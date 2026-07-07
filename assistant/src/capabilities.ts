import { CONFIG } from "./config.js";
import { listMemories } from "./memory.js";
import { pickEmbedder } from "./recall.js";
import { MEMORY_TOOLS } from "./tools.js";
import type { ToolDef } from "./provider.js";

/**
 * Self-knowledge, generated from what the system actually exposes — the
 * registered tool list and live config — so "what can you do?" is answered
 * from fact, and a capability that isn't wired up is never claimed.
 */
export function describeCapabilities(
  tools: ToolDef[] = MEMORY_TOOLS,
  extras: string[] = [],
): string {
  const memoryCount = listMemories().length;
  const embedder = pickEmbedder();

  const lines = [
    `- Conversation: model ${CONFIG.model}, personality from identity.md, core knowledge from knowledge/.`,
    ...tools.map((t) => `- Tool \`${t.name}\`: ${t.description.split(". ")[0]}.`),
    `- Long-term memory: ${memoryCount} memor${memoryCount === 1 ? "y" : "ies"} stored as editable files; recall is ${
      embedder ? `semantic (${embedder.id}) with keyword fallback` : "keyword-based (no embedding service configured)"
    }.`,
    "- Sessions: every turn is persisted; recent conversations can be resumed after a restart.",
    ...extras,
  ];

  return (
    "This list is generated from your real configuration. It is complete:\n" +
    lines.join("\n") +
    "\n\nIf something is not on this list (browsing the web, editing files, " +
    "sending email, running code), you cannot do it — say so plainly instead " +
    "of improvising."
  );
}
