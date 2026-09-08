# Model and source freshness

> **Last verified:** 2026-05-06 · **Drift risk:** high (this page exists because models drift fast)

Specific model names, context-window sizes, rate limits, and prices change every few weeks across all major vendors. This page is the single place where the guide is honest about that.

## Reading rule

When you see any of the following anywhere in this guide, treat it as **a snapshot**, not a fact:

- A specific model identifier (`gpt-…`, `claude-…`, `gemini-…`, `grok-…`, etc.).
- A specific context window size in tokens.
- A specific rate limit number.
- A specific dollar/credit cost.

Each of those should have a `Last verified:` date nearby. If the date is older than ~30 days for a vendor that ships fast (OpenAI, Anthropic, Google, xAI), re-check the official source before relying on it.

## Recommended pattern: env-var-driven model selection

In any code or config example, prefer reading the model name from an environment variable so readers can update without editing the page:

| Vendor | Recommended env var |
|---|---|
| OpenAI / Codex | `OPENAI_MODEL` |
| Anthropic / Claude | `ANTHROPIC_MODEL` |
| Google / Gemini | `GEMINI_MODEL` |
| xAI / Grok | `XAI_MODEL` |
| Local (Ollama, llama.cpp) | `LOCAL_MODEL` |

Python example:

```python
import os
model = os.getenv("OPENAI_MODEL", "REPLACE_WITH_CURRENT_MODEL")
```

TypeScript example:

```ts
const model = process.env.OPENAI_MODEL ?? "REPLACE_WITH_CURRENT_MODEL";
```

When `REPLACE_WITH_CURRENT_MODEL` appears in an example here, replace it with the current model name from the linked official source — and set the env var locally, don't hand-edit the page.

## Where to check current models

| Vendor | Canonical "what's current" surface |
|---|---|
| OpenAI | [Models docs](https://platform.openai.com/docs/models), [Codex CLI docs](https://developers.openai.com/codex/cli) |
| Anthropic | [Claude models docs](https://docs.claude.com/en/docs/about-claude/models) |
| Google | [Gemini models](https://ai.google.dev/gemini-api/docs/models), [AI Studio](https://aistudio.google.com/) |
| xAI | [xAI overview](https://docs.x.ai/overview), [models reference](https://docs.x.ai/developers/models) |
| Microsoft / GitHub | [Copilot plans](https://docs.github.com/en/copilot/get-started/plans) for what's available, [Copilot models](https://docs.github.com/copilot/reference/ai-models) when applicable |
| Local | Your model registry of choice (Ollama tags, Hugging Face). |

## Drift checklist (run quarterly, or when you bump a recipe)

When you edit a page or starter-kit script, walk this checklist before merging:

- [ ] **Model identifiers** in code blocks are either env vars or have a `Last verified:` date within 30 days.
- [ ] **Context window claims** are still accurate per the vendor's current models doc.
- [ ] **Rate limit claims** are described qualitatively (e.g. "free tier"), or carry a date and a link.
- [ ] **Cost claims** are either qualitative or absent. We do not put dollar figures in the guide.
- [ ] **Tool / function calling syntax** matches the current SDK version pinned in the example.
- [ ] **Structured-output / response-format syntax** matches current docs.
- [ ] **Auth flows** (login, API key location) match the current vendor UI.
- [ ] **Filesystem paths** for desktop apps match current OS conventions.
- [ ] **Connector / Action UI** descriptions match the current product UI.
- [ ] The page's `Last verified:` line is updated to today.
- [ ] Any new canonical URL is added to [`source-map.md`](source-map.md).
- [ ] If a vendor renamed or removed a feature, log it in [`source-audit.md`](source-audit.md).

## What "high-drift" means

Per [ADR 0002](decision-records/0002-sourced-and-dated.md), every page declares a drift risk:

| Risk | Re-check cadence |
|---|---|
| **Low** | Annually or when a major vendor change is announced. |
| **Medium** | Quarterly. |
| **High** | Monthly, plus on any vendor announcement. |

Pages that are **automatically high-drift** regardless of content:

- Anything about Codex CLI surface (`docs/platforms/codex.md`, related recipes).
- Anything about Antigravity (`docs/platforms/antigravity.md`).
- Anything about computer use (Anthropic and OpenAI surfaces).
- Anything about Copilot cloud agent plan availability, organization policy controls, or premium-request accounting.
- Anything that names a specific model.

If you add a new page that fits any of those categories, mark it `Drift risk: high` and set a calendar reminder for monthly re-check.

## How readers should treat stale text

If you find a page that names a model, a price, or a rate limit that is wrong:

1. Open a [Source drift issue](https://github.com/rkalani1/agents-automations/issues/new?template=source_drift.yml).
2. Or, file a PR that updates the page **and** updates `Last verified:` and any new sources.

## Why we don't just bake current model names into the prose

- They go stale within weeks.
- They make the guide look authoritative when it is just a snapshot.
- Env vars work cleanly across Claude, OpenAI, Gemini, Grok, and local examples without per-page rewrites.
- Readers usually know what they want to use; what they need from us is a stable shape, not a model recommendation.
