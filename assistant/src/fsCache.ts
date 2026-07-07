import { readFileSync, statSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";

/**
 * Re-read a file only when its mtime changes. Cheap enough to call every
 * turn (one stat), so an edit to the file lands on the very next reply
 * with no restart.
 */
export function mtimeCachedFile(filePath: string): () => string {
  let cachedMtime = -1;
  let cachedText = "";
  return () => {
    if (!existsSync(filePath)) return "";
    const mtime = statSync(filePath).mtimeMs;
    if (mtime !== cachedMtime) {
      cachedText = readFileSync(filePath, "utf8");
      cachedMtime = mtime;
    }
    return cachedText;
  };
}

/**
 * Same idea for a directory of .md files: re-stat every call, re-read only
 * files whose mtime changed. Returns files sorted by name for a stable
 * (cache-friendly) render order.
 */
export function mtimeCachedDir(dirPath: string): () => { name: string; text: string }[] {
  const cache = new Map<string, { mtime: number; text: string }>();
  return () => {
    if (!existsSync(dirPath)) return [];
    const names = readdirSync(dirPath).filter((f) => f.endsWith(".md")).sort();
    for (const key of [...cache.keys()]) {
      if (!names.includes(key)) cache.delete(key);
    }
    return names.map((name) => {
      const full = path.join(dirPath, name);
      const mtime = statSync(full).mtimeMs;
      const hit = cache.get(name);
      if (hit && hit.mtime === mtime) return { name, text: hit.text };
      const text = readFileSync(full, "utf8");
      cache.set(name, { mtime, text });
      return { name, text };
    });
  };
}
