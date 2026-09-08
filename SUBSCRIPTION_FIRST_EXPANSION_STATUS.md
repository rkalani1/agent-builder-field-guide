# Subscription-first expansion status

> **Pass start:** 2026-05-06 · **Pass version:** v0.5 (deepening pass on top of v0.4)

This file is a single-page snapshot of the v0.5 subscription-first expansion. It is updated, not deleted, at the end of the pass.

## Starting point

| Field | Value |
|---|---|
| Starting commit | `6bfe5fbcf87e6b88126f479ab9a1057beaa7b6c7` ("v0.4.0: Subscription-first expansion") |
| Live URL | https://rkalani1.github.io/agents-automations/ |
| Source branch | `v0.5-subscription-first-expansion` (PR target: `main`) |
| Build source | GitHub Actions (`build_type=workflow`) |

## File counts at end of v0.5 pass

| Surface | Count (delta from v0.4) |
|---|---:|
| Markdown pages under `docs/` | ~155 (+22) |
| New top-level sections | 5 (Capability map, No-code automations, Memory & preferences, Examples, Learning path) |
| Beginner examples | 13 (new) |
| Schematic SVG diagrams | 8 (new) |
| Task Builder output panels | 19 (was 12) |
| Files across `starter-kits/` | 87 (unchanged) |
| JSONL eval files under `evals/` | 19 (unchanged) |

## Task Builder features at end of v0.5

- **4-tier mode selector**: Beginner / Power User / Builder / Developer.
- **Primary AI picker** (Claude, ChatGPT, Gemini, Grok, Perplexity, Copilot, Other, I don't know).
- **Comfort selector** that raises Mode but never lowers it.
- **16-option job picker** covering write / summarize / research / plan / learn / organize / meetings / email-calendar / website-app / automate / documents-data / code / agent / skill / max-leverage / other.
- **19 output panels**, including the v0.5 additions: Use this in… (per-provider), Learning ladder, What good output looks like, Practice exercise, Free vs paid, Maximize my subscription, Expert expansion (gated).
- Save / Load / Reset / Export / Import via `localStorage` and the File API only.
- **Zero network calls.**

## Gaps closed in v0.5

| # | Gap (v0.4 known) | How v0.5 closed it |
|---|---|---|
| 1 | No cross-product capability matrix | `docs/capability-map/index.md` |
| 2 | No no-code automation guide | `docs/no-code-automations/index.md` |
| 3 | Memory advice scattered across mastery pages | `docs/preferences-memory/index.md` consolidates it |
| 4 | No beginner example library | `docs/examples/` with 13 examples |
| 5 | No universal on-ramp | `docs/learning-path/index.md` (7 missions) |
| 6 | No plain-English glossary or visual aids | `docs/glossary-plain.md` + 8 schematic SVGs |
| 7 | Task Builder lacked provider-specific packages | New `Use this in…` panel renders all 7 surfaces |
| 8 | Task Builder lacked Practice / What good looks like / Maximize / Expert outputs | Added in v0.5 |
| 9 | Mode selector was 2-state (Beginner / Developer) | Now 4-state (Beginner / Power / Builder / Developer) |

## What this pass preserves

All v0.3 and v0.4 work stays in place. Task Builder routing is extended; previous tab IDs (prompt, setup, levelup, fallback, system, memory, tools, hitl, evals, redteam, playbook, trouble, json) are preserved.

## Safety status at end of v0.5

- No real API keys, tokens, secrets, PII, or PHI exist anywhere in the repo or its history.
- No background automations, schedulers, recurring agents, or scheduled GitHub Actions are enabled.
- All runnable scripts in starter kits remain gated behind `OPERATOR_APPROVED_TO_RUN=1`.
- The Task Builder makes no network, telemetry, or analytics calls.
- Schematic diagrams are vendor-neutral SVGs; no real screenshots that could leak auth state.

## Final verification checklist

The v0.5 pass is complete only when:

1. `mkdocs build --strict` exits 0. ✅
2. The Pages production deployment from `main` succeeds. ✅ (Run: <https://github.com/rkalani1/agents-automations/actions/workflows/deploy.yml>)
3. The Task Builder defaults to Beginner Mode and never recommends API/CLI/MCP/local-scripts in any mode except Developer. ✅
4. A user can pick AI app + comfort + jobs before getting a recommendation. ✅
5. Every provider mastery page renders with Beginner / Intermediate / Advanced / Expert layers, a guided exercise, a level-up ladder, and free-vs-paid annotations. ✅
6. The "Any AI tool" page includes a universal method that works in any AI chat product. ✅
7. The capability map covers Beginner / Intermediate / Advanced / Expert / Free / Sub / Team / Dev-API / fallback paths for all 7 surface groups. ✅
8. The no-code automation guide covers ChatGPT Tasks, Gemini scheduled actions, Claude Cowork, and the calendar-driven manual fallback. ✅
9. The memory & preferences guide includes the portable AI profile + 6 copy-paste templates. ✅
10. ≥13 beginner examples exist, including "maximize my AI subscription" and "other AI tool workflow." ✅
11. The 7-mission universal learning path exists. ✅
12. Plain-English glossary + 8 schematic diagrams exist. ✅
13. `USER_REQUIREMENTS_TRACEABILITY.md` and `docs/product-requirements/user-requirements-traceability.md` mark every requirement complete (or carry an explicit blocker note). ✅
14. The Task Builder makes zero network calls (verified by grep). ✅

## Acceptance criteria status (24)

All 24 acceptance criteria are `complete`. Final commit on `main`: `5e0d762` ("v0.5.0: Subscription-first expansion (deepening pass) (#7)"). Live URL re-verification 2026-05-06 confirmed homepage + all 5 new section indices return HTTP 200 with v0.5 content.
