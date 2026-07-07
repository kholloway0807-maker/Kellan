import { writeFileSync } from "node:fs";
import { CONFIG } from "./config.js";
import {
  loadIndex,
  rebuildIndex,
  readMemory,
  tokenize,
  type IndexEntry,
  type Memory,
} from "./memory.js";

export interface RecallHit {
  memory: Memory;
  score: number;
  via: "semantic" | "keyword";
}

/* ------------------------------------------------------------------ */
/* Optional embeddings — semantic recall when a provider is available  */
/* ------------------------------------------------------------------ */

export interface Embedder {
  id: string;
  embed(texts: string[]): Promise<number[][]>;
}

/** Voyage AI or OpenAI embeddings if a key is present; otherwise null. */
export function pickEmbedder(): Embedder | null {
  if (process.env.VOYAGE_API_KEY) {
    return {
      id: "voyage-3-lite",
      async embed(texts) {
        const res = await fetch("https://api.voyageai.com/v1/embeddings", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${process.env.VOYAGE_API_KEY}`,
          },
          body: JSON.stringify({ model: "voyage-3-lite", input: texts }),
        });
        if (!res.ok) throw new Error(`voyage ${res.status}`);
        const data = (await res.json()) as { data: { embedding: number[] }[] };
        return data.data.map((d) => d.embedding);
      },
    };
  }
  if (process.env.OPENAI_API_KEY) {
    return {
      id: "text-embedding-3-small",
      async embed(texts) {
        const res = await fetch("https://api.openai.com/v1/embeddings", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({ model: "text-embedding-3-small", input: texts }),
        });
        if (!res.ok) throw new Error(`openai ${res.status}`);
        const data = (await res.json()) as { data: { embedding: number[] }[] };
        return data.data.map((d) => d.embedding);
      },
    };
  }
  return null;
}

function cosine(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return na && nb ? dot / (Math.sqrt(na) * Math.sqrt(nb)) : 0;
}

/** Compute and cache vectors in the derived index (no-op without embedder). */
export async function embedIndex(embedder: Embedder): Promise<void> {
  const index = loadIndex();
  const missing = index.entries.filter((e) => !e.vector || index.embedderId !== embedder.id);
  if (missing.length === 0) return;
  const texts = missing.map((e) => {
    const m = readMemory(e.id);
    return m ? `${m.hook}\n${m.body}` : e.hook;
  });
  const vectors = await embedder.embed(texts);
  missing.forEach((e, i) => (e.vector = vectors[i]));
  index.embedderId = embedder.id;
  writeFileSync(CONFIG.indexPath, JSON.stringify(index, null, 2));
}

/* ------------------------------------------------------------------ */
/* Keyword scoring — always available, never breaks                    */
/* ------------------------------------------------------------------ */

function keywordScore(queryTerms: string[], entry: IndexEntry): number {
  if (queryTerms.length === 0) return 0;
  const terms = new Set(entry.terms);
  const hookTerms = new Set(tokenize(entry.hook));
  let score = 0;
  for (const q of queryTerms) {
    if (hookTerms.has(q)) score += 2; // hook matches count double
    else if (terms.has(q)) score += 1;
  }
  return score / queryTerms.length;
}

/**
 * Recall memories for a query. Semantic when an embedder is available,
 * keyword otherwise — and if the embedder fails for any reason, this
 * degrades to keyword rather than failing. The assistant is never blind
 * because a vector service hiccuped.
 */
export async function recall(
  query: string,
  k = 3,
  embedder: Embedder | null = pickEmbedder(),
): Promise<RecallHit[]> {
  if (embedder) {
    try {
      await embedIndex(embedder);
      const index = loadIndex();
      const [qv] = await embedder.embed([query]);
      const hits = index.entries
        .filter((e) => e.vector)
        .map((e) => ({ e, score: cosine(qv, e.vector!) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, k)
        .filter((h) => h.score > 0.35)
        .flatMap((h) => {
          const m = readMemory(h.e.id);
          return m ? [{ memory: m, score: h.score, via: "semantic" as const }] : [];
        });
      if (hits.length > 0) return hits;
    } catch {
      // fall through to keyword
    }
  }

  const index = loadIndex();
  const queryTerms = tokenize(query);
  return index.entries
    .map((e) => ({ e, score: keywordScore(queryTerms, e) }))
    .filter((h) => h.score > 0.15)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .flatMap((h) => {
      const m = readMemory(h.e.id);
      return m ? [{ memory: m, score: h.score, via: "keyword" as const }] : [];
    });
}

export { rebuildIndex };
