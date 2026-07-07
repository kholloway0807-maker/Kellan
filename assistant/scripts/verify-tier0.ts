/** Tier 0: the provider abstraction answers a message deterministically. */
import assert from "node:assert";
import { MockProvider, pickProvider } from "../src/provider.js";

const mock = new MockProvider();

// Heuristic mode: the mock can only "know" what is in its system prompt.
const r1 = await mock.chat({
  system: [{ text: "The launch codeword is thunderbolt.", cache: true }],
  messages: [{ role: "user", content: "what is the launch codeword?" }],
});
assert.match(r1.text, /thunderbolt/, "mock should quote the prompt line");
assert.equal(r1.usage.cacheRead, 0, "first call is a cache write");

// Second identical call simulates a cache hit on the stable prefix.
const r2 = await mock.chat({
  system: [{ text: "The launch codeword is thunderbolt.", cache: true }],
  messages: [{ role: "user", content: "codeword again?" }],
});
assert.ok(r2.usage.cacheRead > 0, "second call should read the simulated cache");

// Scripted mode works and reports tool calls.
mock.enqueue({ text: "ok", toolCalls: [{ id: "t1", name: "save_memory", input: { hook: "x" } }] });
const r3 = await mock.chat({ system: [], messages: [{ role: "user", content: "hi" }] });
assert.equal(r3.toolCalls[0]?.name, "save_memory");
assert.equal(r3.stopReason, "tool_use");

// Provider selection defaults to mock when no credentials are present.
delete process.env.ANTHROPIC_API_KEY;
delete process.env.ANTHROPIC_AUTH_TOKEN;
delete process.env.KELLAN_PROVIDER;
assert.equal(pickProvider().name, "mock");
process.env.KELLAN_PROVIDER = "anthropic";
assert.equal(pickProvider().name, "anthropic");
delete process.env.KELLAN_PROVIDER;

console.log("tier 0 OK — provider abstraction, mock heuristics, cache simulation, selection");
