---
name: llm-council
description: Convene a "council" of multiple LLMs to answer a hard question. Dispatches the prompt to several models in parallel, has each model anonymously peer-review and rank the others' answers, then a Chairman model synthesizes one final response. Use when the user wants a multi-model second opinion, a more reliable answer to an ambiguous/high-stakes question, or explicitly asks for the "council", "llm-council", or to cross-check an answer across models. Inspired by karpathy/llm-council.
---

# LLM Council

Answer a question by polling several LLMs, having them critique each other, and
synthesizing a single best answer. This mirrors the three-stage flow from
[karpathy/llm-council](https://github.com/karpathy/llm-council), adapted to run
from the command line.

## When to use

- The user wants a high-confidence answer and is willing to spend extra tokens/time.
- The question is ambiguous, contested, or high-stakes (design decisions, tricky
  trade-offs, factual disputes).
- The user explicitly mentions "council", "llm-council", or asks to cross-check
  across models.

For simple, low-stakes questions, just answer directly — don't convene the council.

## The three stages

1. **Dispatch** — send the user's question to every council member model in parallel.
2. **Peer review** — give each model the *anonymized* set of all answers and ask it
   to evaluate and rank them (so models can't just favor their own/known brand).
3. **Chairman synthesis** — one designated Chairman model receives the original
   question, all answers, and all rankings, and writes the final answer.

## How to run it

The skill ships a self-contained script, `council.py`, that performs all three
stages against the [OpenRouter](https://openrouter.ai) API (same provider the
original project uses, so a single key reaches many model families).

### Prerequisites

- Python 3.10+
- An OpenRouter API key in the environment: `export OPENROUTER_API_KEY=sk-or-...`
- `httpx` available (`pip install httpx` or `uv pip install httpx`).

### Basic usage

```bash
python .claude/skills/llm-council/council.py "Your question here"
```

Read the question from a file or stdin for long prompts:

```bash
python .claude/skills/llm-council/council.py --file question.md
echo "Your question" | python .claude/skills/llm-council/council.py -
```

### Configuring the council

Edit the `COUNCIL_MODELS` and `CHAIRMAN_MODEL` constants at the top of
`council.py`, or override per-run:

```bash
python .claude/skills/llm-council/council.py "Q" \
  --models openai/gpt-5,google/gemini-2.5-pro,anthropic/claude-opus-4 \
  --chairman anthropic/claude-opus-4
```

Useful flags:

- `--json` — emit the full structured result (all stages) as JSON instead of just
  the final answer. Good when you want to show the user the intermediate reasoning.
- `--show-stages` — print each stage's output to stderr as it completes.

## How to present results to the user

- By default, show the **Chairman's final answer** prominently.
- If the user wants to see the deliberation, run with `--json` (or `--show-stages`)
  and summarize the per-model answers and how the council ranked them, calling out
  any notable disagreement.
- Always note which models were on the council, since the answer is a product of
  that specific panel.

## Notes & caveats

- Peer review is done on **anonymized** answers (labeled "Response A/B/C…") so a
  model can't preferentially rank its own or a known competitor's output.
- Cost/latency scale with the number of council members (N initial calls +
  N review calls + 1 synthesis). Keep the panel to 3–5 models unless asked.
- If `OPENROUTER_API_KEY` is missing, the script exits with a clear message —
  ask the user to set it rather than guessing.
