# Improvement pass status

> **Pass start:** 2026-05-06 · **Author:** maintainers

This file is a single-page snapshot taken at the start of the v0.3 productionization pass. It is updated, not deleted, when the pass closes.

## Starting point

| Field | Value |
|---|---|
| Starting commit | `764b9c61b8d017ea477d390e43bf5b2dcd228706` ("v0.2.0: Productionization pass") |
| Live URL | https://rkalani1.github.io/agents-automations/ |
| Source branch | `main` |
| Build source | GitHub Actions (`build_type=workflow`) |
| Last successful deployment | 2026-05-06 (run 25426535611, build 25 s, deploy 12 s) |

## File counts at start of pass

| Surface | Count |
|---|---:|
| Markdown pages under `docs/` | 125 |
| Files across `starter-kits/` (9 kits) | 87 |
| JSONL eval files under `evals/` | 19 |
| Golden eval cases | 103 |
| Red-team eval cases | 101 |
| GitHub Actions workflows | 3 (deploy, pr-build, link-check) |
| Issue templates | 4 (bug, doc update, source drift, recipe request) |

## What this pass preserves

All v0.2 work stays in place:

- Quickstarts (5), recipes (41), starter kits (9), eval banks (golden + red-team), Agent Factory module (12 pages), source map, source audit, deployment docs.
- GitHub Pages production deployment workflow at `.github/workflows/deploy.yml`.
- PR build and link-check workflows.
- All four issue templates and the PR template.
- Dependabot config for pip + GitHub Actions.

No existing pages are deleted. Edits are additive or corrective.

## Known gaps the v0.3 pass will close

| # | Gap | Phase |
|---|---|---|
| 1 | `starter-kits/mcp-server-python/server.py` and `server.ts` allow approval bypass when stdin is piped. | Phase 1.1 |
| 2 | `DEPLOYMENT_STATUS.md`, `CHANGELOG.md`, and `docs/changelog.md` overstate "zero warnings" — Material for MkDocs ships an upstream banner and `--strict` build emits INFO-level notices about recipe pages not in nav. | Phase 1.2 |
| 3 | `.github/workflows/link-check.yml` uses `fail: false` for everything, so broken internal links do not gate PRs. | Phase 1.3 |
| 4 | Some pages hard-code model names and cost claims that drift quickly; there is no central "model freshness" page. | Phase 1.4 |
| 5 | No substantive Grok/xAI coverage anywhere. | Phase 2 |
| 6 | Homepage is a generic landing page, not a task-to-outcome on-ramp. | Phase 3 |
| 7 | No Task Builder. The site is reference-only; there is no static, in-browser tool to turn a task into a recommended workflow + prompt + spec. | Phase 4 |
| 8 | No surface-router decision matrix that visually contrasts chat vs. project vs. copilot vs. skill vs. automation vs. agent. | Phase 5.1 |

## Safety status at start of pass

- No real API keys, tokens, secrets, PII, or PHI exist anywhere in the repo or its history.
- No background automations, cron jobs, launchd jobs, recurring agents, or scheduled GitHub Actions are enabled.
- All runnable scripts in starter kits are gated behind `OPERATOR_APPROVED_TO_RUN=1` — except for the MCP servers' stdio-pipe bypass that this pass removes (Phase 1.1).
- No telemetry, analytics, or remote logging is configured anywhere.

## Verification after this pass

The pass is complete only when:

1. `mkdocs build --strict` exits 0 with no warnings or errors.
2. The Pages production deployment from `main` succeeds.
3. The Task Builder runs entirely in the browser with no network calls and no `localStorage` writes other than an explicitly user-toggled draft preference.
4. All Phase 1 fixes are in place and reflected in deployment/changelog text.
5. The Grok/xAI surface is documented and the Task Builder can route to it.
