import Anthropic from "@anthropic-ai/sdk";
import crypto from "node:crypto";
import { CONFIG } from "./config.js";

/**
 * A block of the system prompt. Blocks with `cache: true` form the stable
 * prefix and are marked cacheable; the rest is fresh every turn.
 */
export interface SystemBlock {
  text: string;
  cache: boolean;
}

export interface ChatMessage {
  role: "user" | "assistant";
  /** Plain text, or raw provider content blocks (used in the tool loop). */
  content: string | unknown[];
}

export interface ToolDef {
  name: string;
  description: string;
  input_schema: Record<string, unknown>;
}

export interface ToolCall {
  id: string;
  name: string;
  input: Record<string, unknown>;
}

export interface ChatResult {
  text: string;
  toolCalls: ToolCall[];
  stopReason: string;
  /** Full assistant content, echoable back as an assistant message. */
  assistantContent: unknown[];
  usage: { input: number; output: number; cacheRead: number; cacheWrite: number };
}

export interface ChatRequest {
  system: SystemBlock[];
  messages: ChatMessage[];
  tools?: ToolDef[];
  model?: string;
  maxTokens?: number;
  onText?: (delta: string) => void;
}

export interface Provider {
  readonly name: string;
  chat(req: ChatRequest): Promise<ChatResult>;
}

/* ------------------------------------------------------------------ */
/* Real provider — the Anthropic API                                   */
/* ------------------------------------------------------------------ */

export class AnthropicProvider implements Provider {
  readonly name = "anthropic";
  private client = new Anthropic();

  async chat(req: ChatRequest): Promise<ChatResult> {
    const system: Anthropic.TextBlockParam[] = req.system.map((b, i) => {
      const lastCached = req.system.filter((s) => s.cache).length - 1;
      const cachedSoFar = req.system.slice(0, i + 1).filter((s) => s.cache).length - 1;
      const isLastCached = b.cache && cachedSoFar === lastCached;
      return {
        type: "text",
        text: b.text,
        ...(isLastCached ? { cache_control: { type: "ephemeral" as const } } : {}),
      };
    });

    const stream = this.client.messages.stream({
      model: req.model ?? CONFIG.model,
      max_tokens: req.maxTokens ?? CONFIG.maxTokens,
      thinking: { type: "adaptive" },
      system,
      messages: req.messages as Anthropic.MessageParam[],
      ...(req.tools && req.tools.length > 0
        ? { tools: req.tools as Anthropic.Tool[] }
        : {}),
    });

    if (req.onText) stream.on("text", req.onText);
    const msg = await stream.finalMessage();

    const text = msg.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");
    const toolCalls: ToolCall[] = msg.content
      .filter((b): b is Anthropic.ToolUseBlock => b.type === "tool_use")
      .map((b) => ({ id: b.id, name: b.name, input: b.input as Record<string, unknown> }));

    return {
      text,
      toolCalls,
      stopReason: msg.stop_reason ?? "end_turn",
      assistantContent: msg.content,
      usage: {
        input: msg.usage.input_tokens,
        output: msg.usage.output_tokens,
        cacheRead: msg.usage.cache_read_input_tokens ?? 0,
        cacheWrite: msg.usage.cache_creation_input_tokens ?? 0,
      },
    };
  }
}

/* ------------------------------------------------------------------ */
/* Mock provider — deterministic, offline                              */
/* ------------------------------------------------------------------ */

/**
 * Offline stand-in used for verification. Two modes:
 *  - scripted: verify scripts enqueue exact results;
 *  - heuristic: answers by quoting lines of its own system prompt that
 *    share words with the question. That makes "does the assistant know X"
 *    checks meaningful — the mock can only answer if X really is in the
 *    prompt the real model would have received.
 * It also simulates prompt caching on the cacheable-prefix hash.
 */
export class MockProvider implements Provider {
  readonly name = "mock";
  private queue: Partial<ChatResult>[] = [];
  private lastStableHash: string | null = null;

  enqueue(result: Partial<ChatResult>): void {
    this.queue.push(result);
  }

  async chat(req: ChatRequest): Promise<ChatResult> {
    const stable = req.system.filter((b) => b.cache).map((b) => b.text).join("\n");
    const hash = crypto.createHash("sha256").update(stable).digest("hex");
    const stableTokens = Math.ceil(stable.length / 4);
    const cacheHit = this.lastStableHash === hash;
    this.lastStableHash = hash;
    const usage = {
      input: 100,
      output: 50,
      cacheRead: cacheHit ? stableTokens : 0,
      cacheWrite: cacheHit ? 0 : stableTokens,
    };

    const scripted = this.queue.shift();
    if (scripted) {
      const text = scripted.text ?? "";
      const toolCalls = scripted.toolCalls ?? [];
      if (req.onText && text) req.onText(text);
      return {
        text,
        toolCalls,
        stopReason: scripted.stopReason ?? (toolCalls.length > 0 ? "tool_use" : "end_turn"),
        assistantContent:
          scripted.assistantContent ??
          [
            ...(text ? [{ type: "text", text }] : []),
            ...toolCalls.map((t) => ({ type: "tool_use", id: t.id, name: t.name, input: t.input })),
          ],
        usage,
      };
    }

    const last = req.messages[req.messages.length - 1];
    const question = typeof last?.content === "string" ? last.content : JSON.stringify(last?.content ?? "");
    const words = question.toLowerCase().match(/[a-z0-9]{4,}/g) ?? [];
    const corpus = req.system.map((b) => b.text).join("\n").split("\n");
    const scored = corpus
      .map((line) => ({
        line: line.trim(),
        score: words.filter((w) => line.toLowerCase().includes(w)).length,
      }))
      .filter((s) => s.score > 0 && s.line.length > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const text =
      scored.length > 0
        ? `From what I know: ${scored.map((s) => s.line).join(" | ")}`
        : `(mock) I don't have that in my prompt. You said: ${question}`;
    if (req.onText) req.onText(text);
    return { text, toolCalls: [], stopReason: "end_turn", assistantContent: [{ type: "text", text }], usage };
  }
}

/* ------------------------------------------------------------------ */

/** Pick the real API when credentials are available, otherwise the mock. */
export function pickProvider(): Provider {
  const forced = process.env.KELLAN_PROVIDER;
  if (forced === "mock") return new MockProvider();
  if (forced === "anthropic") return new AnthropicProvider();
  if (process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN) {
    return new AnthropicProvider();
  }
  return new MockProvider();
}
