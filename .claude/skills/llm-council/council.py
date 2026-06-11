#!/usr/bin/env python3
"""LLM Council — convene multiple models to answer one question.

Three stages, mirroring karpathy/llm-council:
  1. Dispatch the question to every council model (in parallel).
  2. Each model anonymously reviews and ranks all answers.
  3. A Chairman model synthesizes the final answer.

Runs against the OpenRouter API (https://openrouter.ai), so a single
OPENROUTER_API_KEY reaches many model families.

Usage:
    export OPENROUTER_API_KEY=sk-or-...
    python council.py "Your question"
    python council.py --file question.md
    echo "Your question" | python council.py -
    python council.py "Q" --models openai/gpt-5,google/gemini-2.5-pro --chairman anthropic/claude-opus-4
    python council.py "Q" --json
"""

from __future__ import annotations

import argparse
import asyncio
import json
import os
import string
import sys

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

# Default council. Override with --models / --chairman, or edit here.
COUNCIL_MODELS = [
    "openai/gpt-5",
    "google/gemini-2.5-pro",
    "anthropic/claude-opus-4",
    "x-ai/grok-4",
]
CHAIRMAN_MODEL = "anthropic/claude-opus-4"

REQUEST_TIMEOUT = 180.0


async def call_model(client: httpx.AsyncClient, model: str, messages: list[dict]) -> str:
    """Call one model via OpenRouter, returning its message content (or an error marker)."""
    try:
        resp = await client.post(
            OPENROUTER_URL,
            json={"model": model, "messages": messages},
            timeout=REQUEST_TIMEOUT,
        )
        resp.raise_for_status()
        data = resp.json()
        return data["choices"][0]["message"]["content"]
    except httpx.HTTPStatusError as exc:
        return f"[ERROR calling {model}: HTTP {exc.response.status_code} {exc.response.text[:200]}]"
    except Exception as exc:  # noqa: BLE001 - surface any failure as content, don't crash the council
        return f"[ERROR calling {model}: {exc}]"


async def stage_dispatch(
    client: httpx.AsyncClient, models: list[str], question: str
) -> dict[str, str]:
    """Stage 1: ask every model the original question, in parallel."""
    messages = [{"role": "user", "content": question}]
    results = await asyncio.gather(*(call_model(client, m, messages) for m in models))
    return dict(zip(models, results))


def _anonymize(answers: dict[str, str]) -> tuple[str, dict[str, str]]:
    """Return a labeled block ('Response A: ...') and a label->model map."""
    labels = list(string.ascii_uppercase)
    block_parts, label_to_model = [], {}
    for label, (model, answer) in zip(labels, answers.items()):
        label_to_model[label] = model
        block_parts.append(f"### Response {label}\n{answer}")
    return "\n\n".join(block_parts), label_to_model


async def stage_review(
    client: httpx.AsyncClient,
    models: list[str],
    question: str,
    answers: dict[str, str],
) -> dict[str, str]:
    """Stage 2: each model reviews the anonymized answers and ranks them."""
    anon_block, _ = _anonymize(answers)
    review_prompt = (
        "You are a member of a council of AI models reviewing answers to a question.\n"
        "The responses below are anonymized. Evaluate each on accuracy, completeness, "
        "and clarity, point out any errors, then give a final ranking from best to "
        "worst (e.g. 'Ranking: B > A > C') with a one-line justification each.\n\n"
        f"## Original question\n{question}\n\n"
        f"## Anonymized responses\n{anon_block}"
    )
    messages = [{"role": "user", "content": review_prompt}]
    results = await asyncio.gather(*(call_model(client, m, messages) for m in models))
    return dict(zip(models, results))


async def stage_chairman(
    client: httpx.AsyncClient,
    chairman: str,
    question: str,
    answers: dict[str, str],
    reviews: dict[str, str],
) -> str:
    """Stage 3: chairman synthesizes the final answer from answers + reviews."""
    anon_block, _ = _anonymize(answers)
    reviews_block = "\n\n".join(
        f"### Reviewer {i + 1}\n{review}" for i, review in enumerate(reviews.values())
    )
    chairman_prompt = (
        "You are the Chairman of a council of AI models. Below is a question, the "
        "council members' anonymized answers, and their peer reviews/rankings. "
        "Weigh the answers and the critiques, resolve disagreements, and write the "
        "single best final answer to the original question. Do not mention the "
        "council mechanics in your answer unless asked — just deliver the best answer.\n\n"
        f"## Original question\n{question}\n\n"
        f"## Council answers\n{anon_block}\n\n"
        f"## Peer reviews\n{reviews_block}"
    )
    messages = [{"role": "user", "content": chairman_prompt}]
    return await call_model(client, chairman, messages)


async def run_council(
    question: str, models: list[str], chairman: str, show_stages: bool
) -> dict:
    try:
        import httpx  # noqa: PLC0415 - deferred so --help works without the dep
    except ImportError:
        sys.exit(
            "error: this skill needs the 'httpx' package.\n"
            "       install it with:  pip install httpx   (or: uv pip install httpx)"
        )

    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        sys.exit(
            "error: OPENROUTER_API_KEY is not set.\n"
            "       get a key at https://openrouter.ai and run:\n"
            "         export OPENROUTER_API_KEY=sk-or-..."
        )

    headers = {
        "Authorization": f"Bearer {api_key}",
        "HTTP-Referer": "https://github.com/karpathy/llm-council",
        "X-Title": "llm-council skill",
    }

    async with httpx.AsyncClient(headers=headers) as client:
        if show_stages:
            print(f"[stage 1] dispatching to {len(models)} models...", file=sys.stderr)
        answers = await stage_dispatch(client, models, question)

        if show_stages:
            for m, a in answers.items():
                print(f"\n--- {m} ---\n{a}", file=sys.stderr)
            print("\n[stage 2] peer review...", file=sys.stderr)
        reviews = await stage_review(client, models, question, answers)

        if show_stages:
            for m, r in reviews.items():
                print(f"\n--- review by {m} ---\n{r}", file=sys.stderr)
            print(f"\n[stage 3] chairman ({chairman}) synthesizing...", file=sys.stderr)
        final = await stage_chairman(client, chairman, question, answers, reviews)

    return {
        "question": question,
        "council_models": models,
        "chairman_model": chairman,
        "answers": answers,
        "reviews": reviews,
        "final_answer": final,
    }


def read_question(args: argparse.Namespace) -> str:
    if args.file:
        with open(args.file, "r", encoding="utf-8") as f:
            return f.read().strip()
    if args.question == "-" or args.question is None:
        return sys.stdin.read().strip()
    return args.question


def main() -> None:
    parser = argparse.ArgumentParser(description="Convene an LLM council to answer a question.")
    parser.add_argument("question", nargs="?", help="The question (use '-' to read stdin).")
    parser.add_argument("--file", help="Read the question from a file.")
    parser.add_argument(
        "--models",
        help="Comma-separated OpenRouter model ids for the council.",
    )
    parser.add_argument("--chairman", help="OpenRouter model id for the chairman.")
    parser.add_argument("--json", action="store_true", help="Emit full structured result as JSON.")
    parser.add_argument(
        "--show-stages", action="store_true", help="Stream each stage's output to stderr."
    )
    args = parser.parse_args()

    if not args.question and not args.file:
        parser.error("provide a question argument, --file, or pipe via '-'")

    question = read_question(args)
    if not question:
        parser.error("the question is empty")

    models = (
        [m.strip() for m in args.models.split(",") if m.strip()]
        if args.models
        else COUNCIL_MODELS
    )
    chairman = args.chairman or CHAIRMAN_MODEL

    result = asyncio.run(run_council(question, models, chairman, args.show_stages))

    if args.json:
        print(json.dumps(result, indent=2, ensure_ascii=False))
    else:
        print(result["final_answer"])


if __name__ == "__main__":
    main()
