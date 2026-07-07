import { CONFIG } from "./config.js";
import { mtimeCachedFile, mtimeCachedDir } from "./fsCache.js";
import type { SystemBlock } from "./provider.js";

const readIdentity = mtimeCachedFile(CONFIG.identityPath);
const readKnowledge = mtimeCachedDir(CONFIG.knowledgeDir);

export interface PromptContext {
  /** How many user turns deep this conversation is. */
  turnCount: number;
  /** Auto-generated description of real capabilities (filled in Tier 8). */
  capabilities?: string;
  /** Per-turn notes for the dynamic block (e.g. recalled memories). */
  reminders?: string[];
  /** Clock override for tests. */
  now?: Date;
}

/**
 * Assembles the two-block system prompt.
 *
 * Stable block (cache: true): the full identity, all core knowledge, and
 * the capabilities summary. Byte-identical between turns unless a file on
 * disk changed, so the provider serves it from prompt cache — which is
 * what makes sending the entire personality every single turn affordable.
 *
 * Dynamic block (cache: false): current time and per-turn reminders.
 * Always after the cache breakpoint so freshness never invalidates the
 * stable prefix.
 */
export function buildSystem(ctx: PromptContext): SystemBlock[] {
  const identity = readIdentity().trim();
  const knowledgeFiles = readKnowledge();

  const stableParts: string[] = [identity];

  if (knowledgeFiles.length > 0) {
    const rendered = knowledgeFiles
      .map((f) => `<!-- knowledge/${f.name} -->\n${f.text.trim()}`)
      .join("\n\n");
    stableParts.push(
      "# Core knowledge\n\n" +
        "Curated facts you always know. Treat them as true background —\n" +
        "never ask for anything already answered here. This knowledge is\n" +
        "human-maintained; you read it but never rewrite it.\n\n" +
        rendered,
    );
  }

  stableParts.push(
    "# Your capabilities\n\n" +
      (ctx.capabilities ??
        "You are a text-based conversational assistant. Additional tools will be listed here when available; do not claim abilities that are not listed."),
  );

  const now = ctx.now ?? new Date();
  const dynamicParts: string[] = [`Current date and time: ${now.toISOString()}`];
  if (ctx.reminders && ctx.reminders.length > 0) {
    dynamicParts.push(ctx.reminders.join("\n"));
  }

  return [
    { text: stableParts.join("\n\n---\n\n"), cache: true },
    { text: dynamicParts.join("\n\n"), cache: false },
  ];
}
