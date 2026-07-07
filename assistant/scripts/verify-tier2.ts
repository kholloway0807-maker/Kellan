/** Tier 2: two-block prompt — cached stable identity, fresh dynamic state. */
import assert from "node:assert";
import { readFileSync } from "node:fs";
import { CONFIG } from "../src/config.js";
import { buildSystem } from "../src/promptBuilder.js";
import { MockProvider } from "../src/provider.js";

const t1 = new Date("2026-07-07T10:00:00Z");
const t2 = new Date("2026-07-07T10:05:00Z");
const sys1 = buildSystem({ turnCount: 1, now: t1 });
const sys2 = buildSystem({ turnCount: 2, now: t2 });

// Exactly one stable (cacheable) block followed by one dynamic block.
assert.deepEqual(sys1.map((b) => b.cache), [true, false]);

// The FULL personality is present in the stable block on every turn.
const identity = readFileSync(CONFIG.identityPath, "utf8").trim();
assert.ok(sys1[0].text.includes(identity), "entire identity present, turn 1");
assert.ok(sys2[0].text.includes(identity), "entire identity present, turn 2");

// Stable block is byte-identical across turns; dynamic block is fresh.
assert.equal(sys1[0].text, sys2[0].text, "stable prefix must not change between turns");
assert.notEqual(sys1[1].text, sys2[1].text, "dynamic block must change between turns");
assert.match(sys1[1].text, /2026-07-07T10:00:00/, "dynamic block carries current time");

// The provider reuses the cached prefix on the repeat turn.
const mock = new MockProvider();
await mock.chat({ system: sys1, messages: [{ role: "user", content: "hi" }] });
const second = await mock.chat({ system: sys2, messages: [{ role: "user", content: "hi again" }] });
assert.ok(second.usage.cacheRead > 0, "turn 2 reads the cached stable prefix");
assert.equal(second.usage.cacheWrite, 0, "turn 2 rewrites nothing");

console.log("tier 2 OK — full identity every turn, fresh dynamic state, cached prefix reused");
