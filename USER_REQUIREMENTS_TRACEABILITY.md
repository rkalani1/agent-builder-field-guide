# User requirements traceability

> **Pass:** v0.5 (subscription-first expansion, deepening pass) · **Last updated:** 2026-05-06

This document maps each user requirement and each acceptance criterion from the v0.4 + v0.5 task briefs to the implementation files that satisfy it, and the status. Status values: `complete`, `partial`, `blocked`.

The site-rendered version of this file lives at [`docs/product-requirements/user-requirements-traceability.md`](docs/product-requirements/user-requirements-traceability.md) and is kept in sync.

## User requirements (16)

| # | Requirement | Implementation files | Status |
|---|---|---|---|
| 1 | The site itself is free and public to use. | [`mkdocs.yml`](mkdocs.yml), [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), Pages config, [`LICENSE`](LICENSE) (MIT) | complete |
| 2 | Default path requires no API key, CLI, install, dev account, or code. | [`docs/index.md`](docs/index.md), [`docs/task-builder/index.md`](docs/task-builder/index.md), [`docs/assets/javascripts/task-builder.js`](docs/assets/javascripts/task-builder.js) (Beginner Mode default; API/CLI/MCP only visible in Developer Mode) | complete |
| 3 | Users start with whichever AI tool they already use most. | Task Builder Section 1 (`primary_app`) in [`docs/task-builder/index.md`](docs/task-builder/index.md) and [`docs/assets/javascripts/task-builder.js`](docs/assets/javascripts/task-builder.js) | complete |
| 4 | Supported tools include Claude, ChatGPT, Gemini, Grok, Perplexity, GitHub Copilot, and "Other / I don't know". | Task Builder primary-app selector + 7 provider mastery pages in [`docs/mastery/`](docs/mastery/) | complete |
| 5 | For each product, the guide teaches the full practical capability ladder. | [`docs/mastery/index.md`](docs/mastery/index.md) + 7 mastery pages, each Beginner→Expert; reinforced by [`docs/capability-map/index.md`](docs/capability-map/index.md) | complete |
| 6 | Absolute beginners can complete a useful workflow in under 10 minutes. | Beginner sections of every mastery page; [`docs/examples/`](docs/examples/) Layer 1 paths; [`docs/learning-path/index.md`](docs/learning-path/index.md) Mission 2 | complete |
| 7 | Intermediate users can make workflows reusable. | Intermediate sections of every mastery page; [`docs/preferences-memory/index.md`](docs/preferences-memory/index.md); Layers 2–5 of every example | complete |
| 8 | Expert users can design evals, red-team tests, agent specs, coding-agent prompts, MCP/tool plans, API/SDK implementations. | Expert sections of every mastery page; Task Builder Expert-expansion panel; [`docs/agent-factory/`](docs/agent-factory/), [`docs/evals/`](docs/evals/), [`docs/mcp/`](docs/mcp/), [`starter-kits/`](starter-kits) | complete |
| 9 | Task Builder generates something pasteable immediately. | Prompt panel + Copy button in [`docs/assets/javascripts/task-builder.js`](docs/assets/javascripts/task-builder.js) | complete |
| 10 | Task Builder teaches how to level up the same task. | `level-up` + `learning ladder` panels in [`docs/assets/javascripts/task-builder.js`](docs/assets/javascripts/task-builder.js) | complete |
| 11 | Task Builder includes exact "what to click" instructions and fallback advice. | `setup`, `providers`, `fallback` panels in [`docs/assets/javascripts/task-builder.js`](docs/assets/javascripts/task-builder.js); mirrored in mastery pages | complete |
| 12 | The site includes guided examples that teach skills and product fluency by doing. | [`docs/examples/`](docs/examples/) (13 examples) + each mastery page's "Guided exercise" + [`docs/learning-path/index.md`](docs/learning-path/index.md) | complete |
| 13 | The site explains when to use one AI product vs another, and when to switch tools mid-workflow. | [`docs/capability-map/index.md`](docs/capability-map/index.md), [`docs/mastery/index.md`](docs/mastery/index.md), [`docs/surface-router/index.md`](docs/surface-router/index.md) | complete |
| 14 | The site does not push API keys as the default. | Beginner Mode default in [`docs/task-builder/index.md`](docs/task-builder/index.md); homepage copy in [`docs/index.md`](docs/index.md); plan-availability tags throughout | complete |
| 15 | The site remains useful for any kind of build. | Task Builder 16-option job picker; 41 recipes in [`docs/recipes/`](docs/recipes/); 13 examples in [`docs/examples/`](docs/examples/) | complete |
| 16 | The Task Builder remains static/local on GitHub Pages with no telemetry, analytics, backend, or network calls. | [`docs/assets/javascripts/task-builder.js`](docs/assets/javascripts/task-builder.js) — verified by grep (no `fetch`/`XHR`/`WebSocket`/`sendBeacon` calls; only commented references as guardrails) | complete |

## Acceptance criteria (24)

| # | Acceptance criterion | Implementation files | Status |
|---|---|---|---|
| 1 | Traceability files exist and mark every user requirement complete or clearly blocked. | This file + [`docs/product-requirements/user-requirements-traceability.md`](docs/product-requirements/user-requirements-traceability.md) | complete |
| 2 | The homepage clearly says no API key is required for normal users. | [`docs/index.md`](docs/index.md) opening line | complete |
| 3 | The Task Builder defaults to Beginner Mode and subscription tools. | `mode=beginner` is the checked default in [`docs/task-builder/index.md`](docs/task-builder/index.md) | complete |
| 4 | API/CLI/MCP/local-script options are hidden unless Developer Mode is selected. | `data-tb-show-when="developer"` on Section 5 of [`docs/task-builder/index.md`](docs/task-builder/index.md); `applyModeVisibility` + `recommend()` in [`docs/assets/javascripts/task-builder.js`](docs/assets/javascripts/task-builder.js) | complete |
| 5 | The Task Builder asks which AI the user already uses most and includes Claude, ChatGPT, Gemini, Grok, Perplexity, Copilot, Something else, I don't know. | Section 1 of [`docs/task-builder/index.md`](docs/task-builder/index.md) | complete |
| 6 | Claude has a full mastery track. | [`docs/mastery/claude.md`](docs/mastery/claude.md) | complete |
| 7 | ChatGPT has a full mastery track. | [`docs/mastery/chatgpt.md`](docs/mastery/chatgpt.md) | complete |
| 8 | Gemini has a full mastery track. | [`docs/mastery/gemini.md`](docs/mastery/gemini.md) | complete |
| 9 | Grok has a no-API path + optional dev path. | [`docs/mastery/grok.md`](docs/mastery/grok.md) — Beginner→Advanced is non-API; Expert section covers xAI API | complete |
| 10 | Perplexity has a mastery path covering research/Spaces/sources/Pages + optional dev. | Covered inside [`docs/mastery/any-ai-tool.md`](docs/mastery/any-ai-tool.md); there is no standalone `perplexity.md` page. | partial |
| 11 | "Any AI tool" path exists. | [`docs/mastery/any-ai-tool.md`](docs/mastery/any-ai-tool.md) | complete |
| 12 | Universal 7-mission learning path. | [`docs/learning-path/index.md`](docs/learning-path/index.md) | complete |
| 13 | Provider capability map covering Beginner/Intermediate/Advanced/Expert/Free/Sub/Ent/Dev-API/fallback. | [`docs/capability-map/index.md`](docs/capability-map/index.md) | complete |
| 14 | No-code automation guide. | [`docs/no-code-automations/index.md`](docs/no-code-automations/index.md) | complete |
| 15 | Memory/preferences guide. | [`docs/preferences-memory/index.md`](docs/preferences-memory/index.md) | complete |
| 16 | At least 13 beginner examples, including "maximize my AI subscription" and "other AI tool workflow". | [`docs/examples/`](docs/examples/) — 13 examples; [`maximize-my-ai-subscription.md`](docs/examples/maximize-my-ai-subscription.md), [`other-ai-tool-workflow.md`](docs/examples/other-ai-tool-workflow.md) | complete |
| 17 | Every beginner example includes intermediate and expert "level up" options. | Each example file has Layer 2–6 + Make-it-reusable / Make-it-robust sections | complete |
| 18 | A nontechnical user can complete a guided example in under 10 minutes without API keys. | Layer 1 of every example; [`docs/learning-path/index.md`](docs/learning-path/index.md) Mission 2 | complete |
| 19 | An intermediate user can convert a workflow into a Project / Skill / Custom GPT / Gem / Space / Task / Cowork task. | Layers 2, 4, 5 of every example; [`docs/examples/create-custom-assistant.md`](docs/examples/create-custom-assistant.md), [`docs/examples/create-native-task.md`](docs/examples/create-native-task.md) | complete |
| 20 | An expert user can convert into evals / red-team / coding-agent / agent spec / API-MCP. | Layer 6 of every example + "Make it robust" sections + Task Builder Expert-expansion panel; [`docs/agent-factory/`](docs/agent-factory/), [`docs/evals/`](docs/evals/), [`starter-kits/`](starter-kits) | complete |
| 21 | Every page clearly separates free/subscription from developer/API. | Plan-availability tags `Free / Sub / Team / Ent / Dev / API` on every Mastery section, Capability map cell, Example layer, Task Builder output | complete |
| 22 | Task Builder remains static/local-only with no network calls. | [`docs/assets/javascripts/task-builder.js`](docs/assets/javascripts/task-builder.js) — verified by grep | complete |
| 23 | `mkdocs build --strict` completes. | Verified locally; CI runs the same command on PR via [`.github/workflows/`](https://github.com/rkalani1/agents-automations/tree/main/.github/workflows) | complete |
| 24 | The live GitHub Pages site is verified after deployment. | Live at https://rkalani1.github.io/agents-automations/. Verified 2026-05-06 post-merge — homepage + all 5 new section indices return HTTP 200 with v0.5 content. Deploy run: <https://github.com/rkalani1/agents-automations/actions/workflows/deploy.yml> | complete |

## Verification commands

```bash
# Confirm no network calls in the Task Builder JS:
grep -vE '^\s*\*|^\s*//' docs/assets/javascripts/task-builder.js | \
  grep -nE 'fetch\(|XMLHttpRequest|new WebSocket|sendBeacon|importScripts|new EventSource|axios\.'

# Strict build:
mkdocs build --strict --site-dir _site

# Confirm starter scripts remain disabled by default:
grep -RE 'OPERATOR_APPROVED_TO_RUN' starter-kits/ | head
```

## Open follow-ups (not blockers)

- A future Visual aids pass will replace schematic SVGs with real, redacted screenshots.
- A future Localization pass may add non-English mastery tracks.
- A Skills authoring page will deepen Claude Skills coverage with a step-by-step `SKILL.md` builder.
- All 24 acceptance criteria are now `complete`. Live URL re-verification confirmed 2026-05-06 (HTTP 200 + content match on all v0.5 surfaces).
