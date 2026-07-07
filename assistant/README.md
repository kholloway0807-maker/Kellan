# Kellan — your assistant, with a brain

A terminal AI assistant with a durable identity, always-loaded knowledge,
working memory that survives restarts, and long-term memory stored as
plain files you own.

## Run it

```bash
cd assistant
npm install
export ANTHROPIC_API_KEY=sk-ant-...    # or log in with `ant auth login`
export ELEVENLABS_API_KEY=...          # optional: spoken replies
npm run chat
```

Without an Anthropic key it runs against a deterministic offline mock
(useful for testing the plumbing). With no ElevenLabs key it's simply
text-only.

Commands inside the chat: `/quit`, `/new`, `/sessions`, `/resume <id>`,
`/voice`.

## The parts you're meant to touch

| File / folder | What it is |
|---|---|
| `identity.md` | Kellan's personality, in plain prose. **Edit it any time — the very next reply reflects the change.** No restart, no redeploy. |
| `knowledge/*.md` | Facts Kellan always knows: you, your projects, your people. Human-maintained, read-only to the assistant, loaded every turn. |
| `data/memories/*.md` | Long-term memories — one small markdown file each, with a `type`, a one-line `hook`, and a body saying why it matters. Read, edit, or delete them by hand; the files are the source of truth. |
| `data/sessions/*.jsonl` | Conversation logs, one file per session, appended turn by turn. |
| `data/index.json` | Derived search index. Disposable — `npm run rebuild-index` reconstructs it from the memory files. |

## How the brain works

- **Two-block prompt.** The full personality + knowledge + a generated
  capability list form a stable block marked cacheable (prompt caching),
  so the entire identity rides along on every turn cheaply. Time and
  per-turn reminders go in an uncached dynamic block after it.
- **Working memory.** Every turn is persisted as it happens; a recent
  session is picked back up automatically after a crash or restart. The
  in-context window is bounded so long chats can't grow without limit.
- **Long-term memory, two ways in.** Kellan saves deliberately with a
  `save_memory` tool (things you teach it, corrections, decisions), and
  an automatic extractor (claude-haiku-4-5) reads the transcript when a
  session ends and proposes durable facts. Both paths pass the same
  guardrails: secrets/credentials are refused by pattern, near-duplicate
  hooks are rejected, and trivial sessions are skipped.
- **Recall that degrades, never breaks.** Keyword search always works.
  If `VOYAGE_API_KEY` or `OPENAI_API_KEY` is set, recall upgrades to
  semantic search — and falls back to keyword on any failure.
- **Forgetting needs your yes.** `forget_memory` asks for confirmation
  before deleting anything (and you can always just delete the file).
- **Anti-drift checkpoint.** Past 12 user turns, a short self-audit
  (right length? still Kellan's voice?) is injected each turn — the
  seatbelt for exactly where long conversations flatten into generic
  chatbot tone.
- **Voice.** With an ElevenLabs key, replies are also spoken (voice
  `bfGb7JTLUnZebZRiFYyq`); audio is saved to `data/last-reply.mp3` and
  played if a player (`mpv`/`ffplay`/`afplay`/`mpg123`) exists.

## Verify

```bash
npm run verify   # runs every tier's verification against the offline mock
npm run lint     # typecheck
```

## What it never does

No secrets, tokens, passwords, or other people's private details in
memory — saves that look like credentials are refused mechanically, and
the prompt tells Kellan not to try. Memory is single-user by design.
