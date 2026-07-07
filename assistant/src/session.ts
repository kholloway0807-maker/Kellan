import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { CONFIG } from "./config.js";
import type { ChatMessage } from "./provider.js";

export interface TurnRecord {
  role: "user" | "assistant";
  content: string | unknown[];
  ts: string;
}

export interface SessionMeta {
  id: string;
  mtimeMs: number;
  turnCount: number;
  preview: string;
}

/**
 * A conversation session. Every turn is appended to a JSONL file as it
 * happens, so nothing is lost to a crash or timeout; the file is the
 * durable record, while `windowMessages()` returns a bounded slice for
 * the model so context can't grow without limit.
 */
export class Session {
  readonly id: string;
  readonly filePath: string;
  readonly turns: TurnRecord[];

  private constructor(id: string, turns: TurnRecord[]) {
    this.id = id;
    this.turns = turns;
    this.filePath = path.join(CONFIG.sessionsDir, `${id}.jsonl`);
  }

  static create(): Session {
    mkdirSync(CONFIG.sessionsDir, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const id = `${stamp}-${crypto.randomBytes(2).toString("hex")}`;
    return new Session(id, []);
  }

  static load(id: string): Session {
    const filePath = path.join(CONFIG.sessionsDir, `${id}.jsonl`);
    const lines = readFileSync(filePath, "utf8").split("\n").filter(Boolean);
    const turns = lines.map((l) => JSON.parse(l) as TurnRecord);
    return new Session(id, turns);
  }

  static list(): SessionMeta[] {
    if (!existsSync(CONFIG.sessionsDir)) return [];
    return readdirSync(CONFIG.sessionsDir)
      .filter((f) => f.endsWith(".jsonl"))
      .map((f) => {
        const full = path.join(CONFIG.sessionsDir, f);
        const lines = readFileSync(full, "utf8").split("\n").filter(Boolean);
        const first = lines[0] ? (JSON.parse(lines[0]) as TurnRecord) : null;
        const preview =
          first && typeof first.content === "string" ? first.content.slice(0, 60) : "";
        return {
          id: f.replace(/\.jsonl$/, ""),
          mtimeMs: statSync(full).mtimeMs,
          turnCount: lines.length,
          preview,
        };
      })
      .sort((a, b) => b.mtimeMs - a.mtimeMs);
  }

  /** Most recent session, or null. */
  static latest(): SessionMeta | null {
    return Session.list()[0] ?? null;
  }

  /** Latest session if it's fresh enough to silently pick back up. */
  static resumable(now = Date.now()): SessionMeta | null {
    const latest = Session.latest();
    if (!latest) return null;
    const ageMin = (now - latest.mtimeMs) / 60_000;
    return ageMin <= CONFIG.autoResumeMinutes ? latest : null;
  }

  append(role: TurnRecord["role"], content: TurnRecord["content"]): void {
    const record: TurnRecord = { role, content, ts: new Date().toISOString() };
    this.turns.push(record);
    mkdirSync(CONFIG.sessionsDir, { recursive: true });
    appendFileSync(this.filePath, JSON.stringify(record) + "\n");
  }

  /**
   * The bounded in-context window: newest turns first to fit within the
   * turn and character budgets, then trimmed so the window starts on a
   * plain user message (never mid tool exchange).
   */
  windowMessages(): ChatMessage[] {
    const picked: TurnRecord[] = [];
    let chars = 0;
    for (let i = this.turns.length - 1; i >= 0; i--) {
      const t = this.turns[i];
      const len = typeof t.content === "string" ? t.content.length : JSON.stringify(t.content).length;
      if (picked.length >= CONFIG.windowMaxTurns) break;
      if (picked.length > 0 && chars + len > CONFIG.windowMaxChars) break;
      picked.unshift(t);
      chars += len;
    }
    while (picked.length > 0) {
      const head = picked[0];
      if (head.role === "user" && typeof head.content === "string") break;
      picked.shift();
    }
    return picked.map((t) => ({ role: t.role, content: t.content }));
  }
}
