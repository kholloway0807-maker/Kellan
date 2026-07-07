/** Voice tier: ElevenLabs speech with the configured voice, degrading to text-only. */
import assert from "node:assert";
import { existsSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { CONFIG } from "../src/config.js";
import { Voice, stripForSpeech } from "../src/voice.js";

// The requested voice is wired into config.
assert.equal(CONFIG.voice.voiceId, "bfGb7JTLUnZebZRiFYyq");

// Markdown is flattened before being read aloud.
assert.equal(
  stripForSpeech("**Bold** and a [link](https://x.com)\n\n```js\ncode\n```"),
  "Bold and a link code omitted.",
);

// Without a key: unavailable, speak() is a harmless no-op.
delete process.env[CONFIG.voice.apiKeyEnv];
const silent = new Voice();
assert.equal(silent.available, false);
assert.match(silent.reason, /ELEVENLABS_API_KEY/);
assert.equal(await silent.speak("hello"), null, "no key means silent no-op, not an error");
assert.equal(silent.toggle(), false, "can't toggle on what isn't available");

// With a synth (stubbed offline): audio is produced and saved.
const fakeAudio = Buffer.from("ID3fake-mp3-bytes");
const spoken: string[] = [];
const voice = new Voice({
  synth: async (text) => {
    spoken.push(text);
    return fakeAudio;
  },
  playerCmd: null, // no audio device in this container
});
assert.equal(voice.available, true);
const file = await voice.speak("Two colorways, launching in **April**.");
assert.ok(file && existsSync(file), "audio file written");
assert.equal(readFileSync(file).toString(), fakeAudio.toString());
assert.equal(spoken[0], "Two colorways, launching in April.", "speaks the cleaned text");

// A failing synthesis disables voice gracefully instead of crashing the chat.
const flaky = new Voice({
  synth: async () => {
    throw new Error("service down");
  },
  playerCmd: null,
});
assert.equal(await flaky.speak("hello"), null);
assert.equal(flaky.enabled, false, "voice turns itself off after failure");

// Toggle round-trip.
assert.equal(voice.toggle(), false);
assert.equal(voice.toggle(), true);

rmSync(path.join(CONFIG.dataDir, "last-reply.mp3"), { force: true });
console.log("tier 10 OK — ElevenLabs voice bfGb7JTLUnZebZRiFYyq wired, graceful text-only fallback");
