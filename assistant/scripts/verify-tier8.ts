/** Tier 8: self-knowledge is generated from the real capability set. */
import assert from "node:assert";
import { rmSync } from "node:fs";
import { CONFIG } from "../src/config.js";
import { describeCapabilities } from "../src/capabilities.js";
import { MEMORY_TOOLS } from "../src/tools.js";
import { buildSystem } from "../src/promptBuilder.js";
import { MockProvider } from "../src/provider.js";
import { Session } from "../src/session.js";
import { runTurn } from "../src/chatTurn.js";

rmSync(CONFIG.sessionsDir, { recursive: true, force: true });
rmSync(CONFIG.indexPath, { force: true });
delete process.env.VOYAGE_API_KEY;
delete process.env.OPENAI_API_KEY;

// Generated from the real tool registry — every actual tool is claimed…
const caps = describeCapabilities();
for (const t of MEMORY_TOOLS) assert.ok(caps.includes(t.name), `claims ${t.name}`);
assert.match(caps, /keyword-based/, "honest about embeddings being off right now");
assert.match(caps, /cannot do it/, "explicitly fences off unlisted abilities");

// …and a tool removed from the registry disappears from the claim.
const without = describeCapabilities(MEMORY_TOOLS.filter((t) => t.name !== "forget_memory"));
assert.ok(!without.includes("forget_memory"), "disabled tool is no longer claimed");
assert.ok(without.includes("save_memory"));

// "What can you do?" is answered from the prompt's capability section.
const mock = new MockProvider();
const session = Session.create();
await runTurn({ provider: mock, session, userMessage: "can you save memories to long-term memory?" });
const answer = String(session.turns.filter((t) => t.role === "assistant").pop()?.content);
assert.match(answer, /save_memory|Long-term memory/i, "answer draws on the generated list");

// The capability list lives in the stable (cached) block.
const sys = buildSystem({ turnCount: 1, capabilities: caps });
assert.ok(sys[0].cache && sys[0].text.includes("generated from your real configuration"));

rmSync(CONFIG.sessionsDir, { recursive: true, force: true });
rmSync(CONFIG.indexPath, { force: true });
console.log("tier 8 OK — capabilities generated from the real tool set, unlisted abilities fenced off");
