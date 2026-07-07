/** Tier 7: deliberate saves via tools, unprompted recall, extractor with dedupe & skip. */
import assert from "node:assert";
import { rmSync } from "node:fs";
import { CONFIG } from "../src/config.js";
import { MockProvider } from "../src/provider.js";
import { Session } from "../src/session.js";
import { runTurn } from "../src/chatTurn.js";
import { extractMemories } from "../src/extractor.js";
import { listMemories } from "../src/memory.js";
import { executeTool } from "../src/tools.js";

rmSync(CONFIG.memoriesDir, { recursive: true, force: true });
rmSync(CONFIG.sessionsDir, { recursive: true, force: true });
rmSync(CONFIG.indexPath, { force: true });

/* 1. Teach a durable fact; the model CHOOSES to save it via the tool loop. */
const mock = new MockProvider();
mock.enqueue({
  toolCalls: [
    {
      id: "t1",
      name: "save_memory",
      input: {
        type: "preference",
        hook: "Weekly status emails go out on Fridays",
        body: "User said so on 2026-07-07. Apply when drafting or scheduling status emails.",
      },
    },
  ],
});
mock.enqueue({ text: "Got it — Fridays it is." });

const s1 = Session.create();
const reply = await runTurn({
  provider: mock,
  session: s1,
  userMessage: "remember: I send my weekly status email on Fridays",
});
assert.equal(reply, "Got it — Fridays it is.");
assert.equal(listMemories().length, 1, "the taught fact was saved deliberately");
assert.match(listMemories()[0].hook, /Fridays/);
// The session recorded the full tool exchange (assistant tool_use + user tool_result).
assert.ok(s1.turns.some((t) => Array.isArray(t.content)));

/* 2. Fresh session: the fact is recalled unprompted when relevant. */
const mock2 = new MockProvider();
const s2 = Session.create();
await runTurn({
  provider: mock2,
  session: s2,
  userMessage: "when should the weekly status email go out?",
});
// Inspect what the model actually received: the dynamic block carried the memory.
// (MockProvider heuristic answers from its prompt, so a correct answer proves injection.)
const lastAssistant = s2.turns.filter((t) => t.role === "assistant").pop();
assert.match(String(lastAssistant?.content), /Fridays/, "memory surfaced without being asked");

/* 3. forget_memory requires confirmation — declining keeps the file. */
const id = listMemories()[0].id;
const kept = await executeTool(
  { id: "t2", name: "forget_memory", input: { id } },
  { confirmForget: async () => false },
);
assert.match(kept, /declined/);
assert.equal(listMemories().length, 1);
const gone = await executeTool(
  { id: "t3", name: "forget_memory", input: { id } },
  { confirmForget: async () => true },
);
assert.match(gone, /Deleted/);
assert.equal(listMemories().length, 0);

/* 4. Extractor: durable facts saved, small talk skipped, duplicates rejected. */
const s3 = Session.create();
s3.append("user", "fyi our fabric supplier is switching to Meridian Textiles next quarter");
s3.append("assistant", "Noted — Meridian Textiles starting next quarter.");
s3.append("user", "also I prefer bullet points over long paragraphs in summaries");
s3.append("assistant", "Understood.");

const extractorMock = new MockProvider();
extractorMock.enqueue({
  text: JSON.stringify([
    {
      type: "project",
      hook: "Fabric supplier switching to Meridian Textiles next quarter",
      body: "Announced 2026-07. Affects sourcing timelines; apply when planning production.",
    },
    {
      type: "preference",
      hook: "Summaries should use bullet points, not long paragraphs",
      body: "Stated preference. Apply to every summary.",
    },
  ]),
});
const report = await extractMemories(extractorMock, s3);
assert.equal(report.skipped, false);
assert.equal(report.saved.length, 2, "extractor saved the two durable facts");

/* Near-duplicate proposal is rejected, not stored twice. */
const s4 = Session.create();
s4.append("user", "as I said, supplier is Meridian Textiles from next quarter");
s4.append("assistant", "Yes, I have that.");
s4.append("user", "great");
s4.append("assistant", "!");
const dupeMock = new MockProvider();
dupeMock.enqueue({
  text: JSON.stringify([
    {
      type: "project",
      hook: "Fabric supplier switching to Meridian Textiles next quarter",
      body: "Repeat of the same fact.",
    },
  ]),
});
const dupeReport = await extractMemories(dupeMock, s4);
assert.equal(dupeReport.saved.length, 0);
assert.equal(dupeReport.rejected[0]?.why, "duplicate", "near-duplicate rejected on the way in");

/* Trivial session: skipped before any model call is even parsed. */
const s5 = Session.create();
s5.append("user", "hi");
s5.append("assistant", "hey");
const shortReport = await extractMemories(new MockProvider(), s5);
assert.equal(shortReport.skipped, true, "small talk session skipped");

/* Extractor proposing a secret is refused by the same guardrail. */
const s6 = Session.create();
s6.append("user", "a");
s6.append("assistant", "b");
s6.append("user", "c");
s6.append("assistant", "d");
const secretMock = new MockProvider();
secretMock.enqueue({
  text: JSON.stringify([
    { type: "user-fact", hook: "shop admin login", body: "password: hunter2!" },
  ]),
});
const secretReport = await extractMemories(secretMock, s6);
assert.equal(secretReport.saved.length, 0);
assert.equal(secretReport.rejected[0]?.why, "secret");

/* Sanity: prompt guidance for save discipline is in the stable block. */
const { buildSystem } = await import("../src/promptBuilder.js");
const sys = buildSystem({ turnCount: 1 });
assert.match(sys[0].text, /Remembering is a deliberate decision/);

rmSync(CONFIG.memoriesDir, { recursive: true, force: true });
rmSync(CONFIG.sessionsDir, { recursive: true, force: true });
rmSync(CONFIG.indexPath, { force: true });
console.log("tier 7 OK — deliberate saves, unprompted recall, confirmed forget, extractor dedupe/skip/secret-screen");
