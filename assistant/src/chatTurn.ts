import { buildSystem } from "./promptBuilder.js";
import { recall } from "./recall.js";
import { MEMORY_TOOLS, executeTool, type ToolContext } from "./tools.js";
import type { Provider } from "./provider.js";
import type { Session } from "./session.js";

export interface TurnOptions {
  provider: Provider;
  session: Session;
  userMessage: string;
  onText?: (delta: string) => void;
  toolContext?: ToolContext;
  /** Injected by Tier 8. */
  capabilities?: string;
}

/**
 * One full conversational turn: surface relevant memories into the dynamic
 * block, then run the tool loop until the model stops calling tools.
 * Every intermediate step is appended to the session as it happens.
 */
export async function runTurn(opts: TurnOptions): Promise<string> {
  const { provider, session, userMessage } = opts;

  session.append("user", userMessage);
  const turnCount = session.turns.filter(
    (t) => t.role === "user" && typeof t.content === "string",
  ).length;

  // Unprompted recall: if stored memories look relevant to this message,
  // ride them along in the (uncached) dynamic block.
  const reminders: string[] = [];
  const hits = await recall(userMessage);
  if (hits.length > 0) {
    reminders.push(
      "Possibly relevant memories (point-in-time; verify specifics):\n" +
        hits.map((h) => `- [${h.memory.type}] (${h.memory.id}) ${h.memory.hook}: ${h.memory.body}`).join("\n"),
    );
  }

  for (let hop = 0; hop < 8; hop++) {
    const result = await provider.chat({
      system: buildSystem({ turnCount, reminders, capabilities: opts.capabilities }),
      messages: session.windowMessages(),
      tools: MEMORY_TOOLS,
      onText: opts.onText,
    });

    if (result.toolCalls.length === 0) {
      session.append("assistant", result.text);
      return result.text;
    }

    // Echo the full assistant content (incl. tool_use blocks), then all
    // tool results in ONE user message.
    session.append("assistant", result.assistantContent);
    const toolResults = [];
    for (const call of result.toolCalls) {
      const output = await executeTool(call, opts.toolContext);
      toolResults.push({ type: "tool_result", tool_use_id: call.id, content: output });
    }
    session.append("user", toolResults);
  }

  const bail = "(stopped: too many tool hops in one turn)";
  session.append("assistant", bail);
  return bail;
}
