/** Tier 4: sessions persist per turn, survive a restart, and stay bounded. */
import assert from "node:assert";
import { rmSync } from "node:fs";
import { CONFIG } from "../src/config.js";
import { Session } from "../src/session.js";

// Isolate this run from any real sessions.
rmSync(CONFIG.sessionsDir, { recursive: true, force: true });

// A short conversation, persisted turn by turn.
const s = Session.create();
s.append("user", "let's plan the spring drop");
s.append("assistant", "three colorways, launch in April.");
s.append("user", "make it two colorways");

// "Restart": a brand-new process would do exactly this — load from disk.
const revived = Session.load(s.id);
assert.equal(revived.turns.length, 3, "every turn survived the restart");
assert.equal(revived.turns[2].content, "make it two colorways");
assert.deepEqual(
  revived.windowMessages().map((m) => m.role),
  ["user", "assistant", "user"],
);

// Auto-resume finds the fresh session; a stale one is not silently resumed.
assert.equal(Session.resumable()?.id, s.id, "fresh session is resumable");
const staleClock = Date.now() + (CONFIG.autoResumeMinutes + 5) * 60_000;
assert.equal(Session.resumable(staleClock), null, "stale session is not auto-resumed");

// A very long conversation: the file keeps everything, the window is bounded.
const long = Session.create();
for (let i = 0; i < 300; i++) {
  long.append("user", `question number ${i} ${"x".repeat(300)}`);
  long.append("assistant", `answer number ${i} ${"y".repeat(300)}`);
}
assert.equal(long.turns.length, 600, "durable record keeps all 600 turns");
const win = long.windowMessages();
assert.ok(win.length <= CONFIG.windowMaxTurns, `window bounded (${win.length} turns)`);
assert.equal(win[0].role, "user", "window starts on a user turn");
const winChars = win.reduce((n, m) => n + String(m.content).length, 0);
assert.ok(winChars <= CONFIG.windowMaxChars + 1000, "window respects the char budget");

// Cleanup test sessions.
rmSync(CONFIG.sessionsDir, { recursive: true, force: true });
console.log("tier 4 OK — per-turn persistence, restart recovery, bounded window");
