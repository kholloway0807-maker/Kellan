import { CONFIG } from "./config.js";
import { listMemories, saveMemory, MEMORY_TYPES, type MemoryType } from "./memory.js";
import type { Provider } from "./provider.js";
import type { Session } from "./session.js";

export interface ExtractionReport {
  skipped: boolean;
  reason?: string;
  saved: string[];
  rejected: { hook: string; why: string }[];
}

/**
 * The automatic side of memory: when a session ends, a cheap model call
 * reads the transcript and proposes durable facts. Every proposal still
 * passes through saveMemory's secret screen and dedupe — the extractor
 * can suggest, but the same guardrails decide.
 */
export async function extractMemories(
  provider: Provider,
  session: Session,
): Promise<ExtractionReport> {
  const userTurns = session.turns.filter(
    (t) => t.role === "user" && typeof t.content === "string",
  );
  if (userTurns.length < 2) {
    return { skipped: true, reason: "session too short to bother", saved: [], rejected: [] };
  }

  const transcript = session.turns
    .filter((t) => typeof t.content === "string")
    .map((t) => `${t.role}: ${t.content}`)
    .join("\n")
    .slice(-20_000);

  const existingHooks = listMemories().map((m) => `- ${m.hook}`).join("\n") || "(none)";

  const system = [
    "You extract durable memories from a finished assistant conversation.",
    "Durable means: facts about the user or their world, preferences about how the assistant should work, real project decisions, or pointers to external resources — things that will still matter weeks from now.",
    "Skip: small talk, testing/experimentation sessions, transient task state, anything already covered by an existing memory, and NEVER anything secret or private (credentials, tokens, other people's personal details).",
    "",
    "Existing memories (do not duplicate these):",
    existingHooks,
    "",
    `Reply with ONLY a JSON array (possibly empty). Each element: {"type": one of ${JSON.stringify([...MEMORY_TYPES])}, "hook": one-line summary, "body": the fact, why it matters, how to apply it}.`,
  ].join("\n");

  const result = await provider.chat({
    model: CONFIG.extractorModel,
    maxTokens: 2000,
    system: [{ text: system, cache: false }],
    messages: [{ role: "user", content: `Transcript:\n${transcript}` }],
  });

  let proposals: { type: string; hook: string; body: string }[] = [];
  try {
    const jsonText = result.text.slice(result.text.indexOf("["), result.text.lastIndexOf("]") + 1);
    const parsed: unknown = JSON.parse(jsonText);
    if (Array.isArray(parsed)) proposals = parsed as typeof proposals;
  } catch {
    return { skipped: true, reason: "extractor returned no parseable proposals", saved: [], rejected: [] };
  }

  const report: ExtractionReport = { skipped: false, saved: [], rejected: [] };
  for (const p of proposals.slice(0, 8)) {
    if (!p || typeof p.hook !== "string" || typeof p.body !== "string") continue;
    const type: MemoryType = MEMORY_TYPES.includes(p.type as MemoryType)
      ? (p.type as MemoryType)
      : "user-fact";
    const saved = saveMemory({ type, hook: p.hook, body: p.body });
    if (saved.ok) report.saved.push(saved.memory.id);
    else report.rejected.push({ hook: p.hook, why: saved.reason });
  }
  return report;
}
