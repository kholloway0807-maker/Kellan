import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { CONFIG } from "./config.js";

/** The type shapes when a memory is worth recalling. Small and fixed. */
export const MEMORY_TYPES = ["user-fact", "preference", "project", "pointer"] as const;
export type MemoryType = (typeof MEMORY_TYPES)[number];

export interface Memory {
  /** Filename without .md — the memory's stable id. */
  id: string;
  type: MemoryType;
  /** One-line searchable summary. */
  hook: string;
  created: string;
  /** The fact, why it matters, and how to apply it. */
  body: string;
}

export interface IndexEntry {
  id: string;
  type: MemoryType;
  hook: string;
  created: string;
  terms: string[];
  /** Optional semantic vector; present only when an embedder ran. */
  vector?: number[];
}

export interface MemoryIndex {
  builtAt: string;
  embedderId: string | null;
  entries: IndexEntry[];
}

/* ---------------------------------------------------------------- */

export function tokenize(text: string): string[] {
  return [...new Set(text.toLowerCase().match(/[a-z0-9]{3,}/g) ?? [])];
}

/**
 * Memory is a trust surface: refuse to store anything that looks like a
 * credential or secret, no matter how it was phrased.
 */
const SECRET_PATTERNS: RegExp[] = [
  /sk-[a-zA-Z0-9_-]{16,}/,
  /(ghp|gho|ghu|ghs)_[A-Za-z0-9]{20,}/,
  /AKIA[0-9A-Z]{16}/,
  /xox[baprs]-[A-Za-z0-9-]{10,}/,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /\b(password|passwd|passcode|api[_ ]?key|secret[_ ]?key|auth[_ ]?token|access[_ ]?token)\b\s*[:=]?\s*\S+/i,
  /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{5,}/, // JWT
];

export function looksLikeSecret(text: string): boolean {
  return SECRET_PATTERNS.some((p) => p.test(text));
}

/** Word-overlap similarity between two hooks, 0..1. */
export function hookSimilarity(a: string, b: string): number {
  const ta = new Set(tokenize(a));
  const tb = new Set(tokenize(b));
  if (ta.size === 0 || tb.size === 0) return 0;
  let shared = 0;
  for (const t of ta) if (tb.has(t)) shared++;
  return shared / Math.min(ta.size, tb.size);
}

/* ---------------------------------------------------------------- */

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48);
}

function serialize(m: Memory): string {
  return `---\ntype: ${m.type}\nhook: ${m.hook}\ncreated: ${m.created}\n---\n\n${m.body.trim()}\n`;
}

export function parseMemoryFile(id: string, text: string): Memory | null {
  const match = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return null;
  const meta: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const kv = line.match(/^(\w[\w-]*):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].trim();
  }
  const type = MEMORY_TYPES.includes(meta.type as MemoryType) ? (meta.type as MemoryType) : "user-fact";
  if (!meta.hook) return null;
  return { id, type, hook: meta.hook, created: meta.created ?? "", body: match[2].trim() };
}

export function listMemories(): Memory[] {
  if (!existsSync(CONFIG.memoriesDir)) return [];
  return readdirSync(CONFIG.memoriesDir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .flatMap((f) => {
      const text = readFileSync(path.join(CONFIG.memoriesDir, f), "utf8");
      const parsed = parseMemoryFile(f.replace(/\.md$/, ""), text);
      return parsed ? [parsed] : [];
    });
}

export function readMemory(id: string): Memory | null {
  const file = path.join(CONFIG.memoriesDir, `${id}.md`);
  if (!existsSync(file)) return null;
  return parseMemoryFile(id, readFileSync(file, "utf8"));
}

export type SaveResult =
  | { ok: true; memory: Memory }
  | { ok: false; reason: "secret" | "duplicate"; duplicateOf?: string };

/**
 * Store a new memory as its own human-editable markdown file.
 * Refuses secrets outright and near-duplicates of an existing hook —
 * remembering is a decision, not a default.
 */
export function saveMemory(input: {
  type: MemoryType;
  hook: string;
  body: string;
}): SaveResult {
  const combined = `${input.hook}\n${input.body}`;
  if (looksLikeSecret(combined)) return { ok: false, reason: "secret" };

  for (const existing of listMemories()) {
    if (hookSimilarity(existing.hook, input.hook) >= 0.7) {
      return { ok: false, reason: "duplicate", duplicateOf: existing.id };
    }
  }

  mkdirSync(CONFIG.memoriesDir, { recursive: true });
  const created = new Date().toISOString().slice(0, 10);
  let id = `${created}-${slugify(input.hook)}`;
  let n = 2;
  while (existsSync(path.join(CONFIG.memoriesDir, `${id}.md`))) id = `${created}-${slugify(input.hook)}-${n++}`;

  const memory: Memory = { id, type: input.type, hook: input.hook, created, body: input.body };
  writeFileSync(path.join(CONFIG.memoriesDir, `${id}.md`), serialize(memory));
  rebuildIndex();
  return { ok: true, memory };
}

export function deleteMemory(id: string): boolean {
  const file = path.join(CONFIG.memoriesDir, `${id}.md`);
  if (!existsSync(file)) return false;
  rmSync(file);
  rebuildIndex();
  return true;
}

/* ---------------------------------------------------------------- */

/**
 * The index is derived, never the source of truth. It can be deleted at
 * any time and rebuilt from the markdown files intact.
 */
export function rebuildIndex(): MemoryIndex {
  const entries: IndexEntry[] = listMemories().map((m) => ({
    id: m.id,
    type: m.type,
    hook: m.hook,
    created: m.created,
    terms: tokenize(`${m.hook} ${m.body}`),
  }));
  const index: MemoryIndex = { builtAt: new Date().toISOString(), embedderId: null, entries };
  mkdirSync(CONFIG.dataDir, { recursive: true });
  writeFileSync(CONFIG.indexPath, JSON.stringify(index, null, 2));
  return index;
}

export function loadIndex(): MemoryIndex {
  if (!existsSync(CONFIG.indexPath)) return rebuildIndex();
  try {
    return JSON.parse(readFileSync(CONFIG.indexPath, "utf8")) as MemoryIndex;
  } catch {
    return rebuildIndex();
  }
}
