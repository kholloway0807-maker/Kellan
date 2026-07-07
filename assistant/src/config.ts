import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

/** Root of the assistant/ directory (one level up from src/). */
export const ROOT = path.resolve(here, "..");

export const CONFIG = {
  assistantName: "Kellan",

  /** Main conversation model. */
  model: "claude-opus-4-8",
  /** Cheap model used by the post-session memory extractor. */
  extractorModel: "claude-haiku-4-5",
  maxTokens: 16000,

  identityPath: path.join(ROOT, "identity.md"),
  knowledgeDir: path.join(ROOT, "knowledge"),
  dataDir: path.join(ROOT, "data"),
  sessionsDir: path.join(ROOT, "data", "sessions"),
  memoriesDir: path.join(ROOT, "data", "memories"),
  indexPath: path.join(ROOT, "data", "index.json"),

  /** Working-memory window: hard bounds on what is sent to the model. */
  windowMaxTurns: 40,
  windowMaxChars: 60_000,

  /** Resume the latest session automatically if it's newer than this. */
  autoResumeMinutes: 60,

  /** Turn count after which the anti-drift self-audit is injected. */
  checkpointAfterTurns: 12,

  voice: {
    /** ElevenLabs voice for spoken replies. */
    voiceId: "bfGb7JTLUnZebZRiFYyq",
    modelId: "eleven_multilingual_v2",
    apiKeyEnv: "ELEVENLABS_API_KEY",
  },
} as const;
