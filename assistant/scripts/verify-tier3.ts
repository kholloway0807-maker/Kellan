/** Tier 3: a fact that exists only in knowledge/ is simply known, unprompted. */
import assert from "node:assert";
import { writeFileSync, rmSync } from "node:fs";
import path from "node:path";
import { CONFIG } from "../src/config.js";
import { buildSystem } from "../src/promptBuilder.js";
import { MockProvider } from "../src/provider.js";

const seedPath = path.join(CONFIG.knowledgeDir, "zz-verify-seed.md");
writeFileSync(
  seedPath,
  "# Seed fact\n\nThe warehouse door code for the Peachtree facility is 4491.\n",
);

try {
  const system = buildSystem({ turnCount: 1 });
  assert.ok(system[0].cache && system[0].text.includes("Peachtree facility"),
    "knowledge is rendered into the stable block");
  assert.match(system[0].text, /never ask for anything already answered here/i,
    "read-only, never-re-ask framing is in the prompt");

  // Fresh session, fact never mentioned in conversation. The mock can only
  // answer from what's actually in the prompt — so a correct answer proves
  // the knowledge pipeline, same prompt the real model would get.
  const mock = new MockProvider();
  const reply = await mock.chat({
    system,
    messages: [{ role: "user", content: "what is the warehouse door code for Peachtree?" }],
  });
  assert.match(reply.text, /4491/, "assistant answers directly from core knowledge");
} finally {
  rmSync(seedPath, { force: true });
}

// Capabilities placeholder is present until Tier 8 supplies the real list.
const sys = buildSystem({ turnCount: 1 });
assert.match(sys[0].text, /# Your capabilities/);

console.log("tier 3 OK — core knowledge always loaded, answered without being told this session");
