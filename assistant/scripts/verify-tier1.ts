/** Tier 1: identity.md is re-read on mtime change — an edit lands on the next turn. */
import assert from "node:assert";
import { appendFileSync, readFileSync, writeFileSync, utimesSync } from "node:fs";
import { CONFIG } from "../src/config.js";
import { buildSystem } from "../src/promptBuilder.js";

const original = readFileSync(CONFIG.identityPath, "utf8");
const marker = `mid-run identity edit ${Date.now()}`;

try {
  const before = buildSystem({ turnCount: 1 });
  assert.ok(before[0].cache, "identity lives in the stable (cached) block");
  assert.match(before[0].text, /You are Kellan/, "identity file is loaded");
  assert.ok(!before[0].text.includes(marker));

  // Simulate the user editing the file while the assistant is running.
  appendFileSync(CONFIG.identityPath, `\n${marker}\n`);
  const bumped = new Date(Date.now() + 5); // guard against coarse mtime clocks
  utimesSync(CONFIG.identityPath, bumped, bumped);

  const after = buildSystem({ turnCount: 2 });
  assert.ok(after[0].text.includes(marker), "the very next prompt reflects the edit");
} finally {
  writeFileSync(CONFIG.identityPath, original);
}

console.log("tier 1 OK — identity file edit takes effect on the next turn, no restart");
