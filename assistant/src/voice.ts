import { mkdirSync, writeFileSync } from "node:fs";
import { spawn, spawnSync } from "node:child_process";
import path from "node:path";
import { CONFIG } from "./config.js";

/**
 * Spoken replies via ElevenLabs. Voice is a bonus channel, never a
 * dependency: no API key, no player, or any synthesis error just means
 * text-only — the assistant itself is unaffected.
 */

export interface VoiceOptions {
  /** Injectable for tests: returns the synthesized audio bytes. */
  synth?: (text: string) => Promise<Buffer>;
  /** Injectable for tests: command used to play an mp3, or null for none. */
  playerCmd?: string | null;
}

/** Make text sound right when read aloud: drop markdown scaffolding. */
export function stripForSpeech(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, " code omitted. ")
    .replace(/[*_#`>|]/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 1200);
}

function findPlayer(): string | null {
  for (const cmd of ["mpv", "ffplay", "afplay", "mpg123"]) {
    const found = spawnSync("which", [cmd], { stdio: "ignore" });
    if (found.status === 0) return cmd;
  }
  return null;
}

async function elevenLabsSynth(text: string): Promise<Buffer> {
  const apiKey = process.env[CONFIG.voice.apiKeyEnv];
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${CONFIG.voice.voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey ?? "",
        "content-type": "application/json",
        accept: "audio/mpeg",
      },
      body: JSON.stringify({ text, model_id: CONFIG.voice.modelId }),
    },
  );
  if (!res.ok) throw new Error(`elevenlabs ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

export class Voice {
  readonly available: boolean;
  readonly reason: string;
  enabled: boolean;
  private synth: (text: string) => Promise<Buffer>;
  private playerCmd: string | null;
  private warned = false;

  constructor(opts: VoiceOptions = {}) {
    this.synth = opts.synth ?? elevenLabsSynth;
    this.playerCmd = opts.playerCmd !== undefined ? opts.playerCmd : findPlayer();
    const hasKey = Boolean(process.env[CONFIG.voice.apiKeyEnv]) || Boolean(opts.synth);
    this.available = hasKey;
    this.reason = hasKey ? `voice ${CONFIG.voice.voiceId}` : `no ${CONFIG.voice.apiKeyEnv} set`;
    this.enabled = this.available;
  }

  toggle(): boolean {
    if (!this.available) return false;
    this.enabled = !this.enabled;
    return this.enabled;
  }

  /** Speak text; on any failure, warn once and fall back to silence. */
  async speak(text: string): Promise<string | null> {
    if (!this.enabled || !this.available) return null;
    const spoken = stripForSpeech(text);
    if (!spoken) return null;
    try {
      const audio = await this.synth(spoken);
      mkdirSync(CONFIG.dataDir, { recursive: true });
      const file = path.join(CONFIG.dataDir, "last-reply.mp3");
      writeFileSync(file, audio);
      if (this.playerCmd) {
        const quiet =
          this.playerCmd === "ffplay"
            ? ["-nodisp", "-autoexit", "-loglevel", "quiet", file]
            : this.playerCmd === "mpv"
              ? ["--really-quiet", file]
              : [file];
        spawn(this.playerCmd, quiet, { stdio: "ignore", detached: true }).unref();
      }
      return file;
    } catch (err) {
      if (!this.warned) {
        console.error(`(voice off: ${err instanceof Error ? err.message : err})`);
        this.warned = true;
      }
      this.enabled = false;
      return null;
    }
  }
}
