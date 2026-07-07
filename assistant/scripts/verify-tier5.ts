/** Tier 5: memories are typed, hooked, human-editable files; index is derived. */
import assert from "node:assert";
import { readFileSync, writeFileSync, rmSync, readdirSync } from "node:fs";
import path from "node:path";
import { CONFIG } from "../src/config.js";
import {
  saveMemory,
  listMemories,
  readMemory,
  deleteMemory,
  loadIndex,
  rebuildIndex,
  looksLikeSecret,
  parseMemoryFile,
} from "../src/memory.js";

rmSync(CONFIG.memoriesDir, { recursive: true, force: true });
rmSync(CONFIG.indexPath, { force: true });

// Save via the API: lands as a readable file with type, hook, and body.
const saved = saveMemory({
  type: "preference",
  hook: "Drops should have exactly two colorways",
  body: "Decided 2026-07: two colorways per drop, not three.\nWhy it matters: production cost. Apply when planning any new drop.",
});
assert.ok(saved.ok);
const file = path.join(CONFIG.memoriesDir, `${saved.memory.id}.md`);
const raw = readFileSync(file, "utf8");
assert.match(raw, /^---\ntype: preference\nhook: Drops should have exactly two colorways/);
assert.match(raw, /Apply when planning/);

// It appears in the browsable index of hooks.
assert.ok(loadIndex().entries.some((e) => e.id === saved.memory.id && e.type === "preference"));

// Write one entirely BY HAND — files are the source of truth.
const handId = "2026-07-07-sizing-runs-small";
writeFileSync(
  path.join(CONFIG.memoriesDir, `${handId}.md`),
  "---\ntype: user-fact\nhook: NOVA tees run small\ncreated: 2026-07-07\n---\n\nCustomers say order one size up. Mention it in product copy.\n",
);
rebuildIndex();
assert.ok(loadIndex().entries.some((e) => e.id === handId), "hand-written file is indexed");
assert.equal(readMemory(handId)?.type, "user-fact");

// Hand-edit round-trips cleanly.
writeFileSync(
  path.join(CONFIG.memoriesDir, `${handId}.md`),
  readFileSync(path.join(CONFIG.memoriesDir, `${handId}.md`), "utf8").replace("one size up", "two sizes up"),
);
assert.match(readMemory(handId)!.body, /two sizes up/);

// Hand-delete: gone from files and, after rebuild, from the index.
rmSync(path.join(CONFIG.memoriesDir, `${handId}.md`));
rebuildIndex();
assert.ok(!loadIndex().entries.some((e) => e.id === handId));

// Guardrails: secrets refused, near-duplicates refused.
assert.ok(looksLikeSecret("my api key is sk-abc123def456ghi789jkl"));
const secret = saveMemory({ type: "user-fact", hook: "shop login", body: "password: hunter2!" });
assert.deepEqual(secret, { ok: false, reason: "secret" });
const dupe = saveMemory({
  type: "preference",
  hook: "drops should have two colorways exactly",
  body: "same thing again",
});
assert.ok(!dupe.ok && dupe.reason === "duplicate");

// Malformed files are skipped, not fatal.
assert.equal(parseMemoryFile("bad", "no frontmatter here"), null);

deleteMemory(saved.memory.id);
assert.equal(listMemories().length, 0);
assert.equal(readdirSync(CONFIG.memoriesDir).filter((f) => f.endsWith(".md")).length, 0);

console.log("tier 5 OK — typed file-backed memories, derived index, secret & dupe guardrails");
