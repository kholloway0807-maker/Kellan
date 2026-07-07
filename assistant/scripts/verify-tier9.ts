/** Tier 9: the anti-drift self-audit appears only once conversations run deep. */
import assert from "node:assert";
import { CONFIG } from "../src/config.js";
import { buildSystem } from "../src/promptBuilder.js";

const shallow = buildSystem({ turnCount: 5, now: new Date("2026-07-07T10:00:00Z") });
const deep = buildSystem({
  turnCount: CONFIG.checkpointAfterTurns + 1,
  now: new Date("2026-07-07T10:00:00Z"),
});

// Short conversations stay unencumbered.
assert.ok(!shallow[1].text.includes("Personality checkpoint"), "no checkpoint at turn 5");

// Deep conversations get the audit: length axis + voice axis.
assert.match(deep[1].text, /Personality checkpoint/);
assert.match(deep[1].text, /length/);
assert.match(deep[1].text, /voice/);

// It rides in the DYNAMIC block — the cached stable prefix is untouched.
assert.ok(!deep[0].text.includes("Personality checkpoint"));
assert.equal(shallow[0].text, deep[0].text, "stable block identical shallow vs deep");

// Exactly at the threshold it activates.
const atThreshold = buildSystem({ turnCount: CONFIG.checkpointAfterTurns });
assert.match(atThreshold[1].text, /Personality checkpoint/);

console.log("tier 9 OK — self-audit injected only in deep conversations, cache prefix untouched");
