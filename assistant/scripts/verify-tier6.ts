/** Tier 6: recall works keyword-only, degrades gracefully, index is rebuildable. */
import assert from "node:assert";
import { existsSync, rmSync } from "node:fs";
import { CONFIG } from "../src/config.js";
import { saveMemory } from "../src/memory.js";
import { recall, rebuildIndex, pickEmbedder, type Embedder } from "../src/recall.js";

rmSync(CONFIG.memoriesDir, { recursive: true, force: true });
rmSync(CONFIG.indexPath, { force: true });

saveMemory({
  type: "preference",
  hook: "Invoices are always sent on the first of the month",
  body: "Billing cadence decided with the accountant. Apply when scheduling anything invoice-related.",
});
saveMemory({
  type: "project",
  hook: "Spring drop launches in April with two colorways",
  body: "Two colorways only. Photography booked for March.",
});

// Keyword recall (no embedding key needed) finds the right memory.
const hits = await recall("when do we send invoices?", 3, null);
assert.ok(hits.length > 0, "keyword recall returns a hit");
assert.match(hits[0].memory.hook, /Invoices/);
assert.equal(hits[0].via, "keyword");

// An irrelevant query stays quiet instead of dredging noise.
const noise = await recall("completely unrelated quantum topics", 3, null);
assert.equal(noise.length, 0);

// A broken embedder degrades to keyword — never blinds the assistant.
const broken: Embedder = {
  id: "broken",
  embed: async () => {
    throw new Error("vector service down");
  },
};
const degraded = await recall("invoice schedule", 3, broken);
assert.ok(degraded.length > 0 && degraded[0].via === "keyword", "falls back on embedder failure");

// Delete the index entirely; rebuild from files; recall still works.
rmSync(CONFIG.indexPath, { force: true });
assert.ok(!existsSync(CONFIG.indexPath));
rebuildIndex();
const afterRebuild = await recall("two colorways spring drop", 3, null);
assert.match(afterRebuild[0].memory.hook, /Spring drop/);

// Semantic path: only exercised when a real key is present.
const real = pickEmbedder();
if (real) {
  const semantic = await recall("what's our billing rhythm?", 3, real); // paraphrase, no shared keywords with hook
  assert.ok(semantic.some((h) => /Invoices/.test(h.memory.hook)));
  console.log(`(semantic recall verified via ${real.id})`);
} else {
  console.log("(no embedding key — semantic path skipped; keyword fallback fully verified)");
}

rmSync(CONFIG.memoriesDir, { recursive: true, force: true });
rmSync(CONFIG.indexPath, { force: true });
console.log("tier 6 OK — keyword recall, graceful degradation, index rebuilt from files");
