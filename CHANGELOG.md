# Changelog

All notable changes to this guide are documented here. Format loosely follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). The site-rendered version of this file lives at [`docs/changelog.md`](docs/changelog.md) and is kept in sync.

## [Unreleased] — Design-system refinement

### Changed
- Refined the portal and three interactive workbenches with clearer visual hierarchy, responsive tables and navigation, visible focus states, and a more productive split-pane Task Builder. Guide content and product claims are unchanged.

### Verified
- `mkdocs build --strict` exits 0, and desktop/mobile browser checks show no page-level horizontal overflow.

## [0.7.0] — 2026-07-18 — Deep review: currency, IA, and safety pass

### Fixed
- Replaced every remaining `example.github.io` / `github.com/example` scaffold placeholder with the real `rkalani1/agents-automations` URLs, including `site_url` — the live site's canonical URLs, `og:url` tags, and `sitemap.xml` now point at the real domain once deployed.
- The Claude-mastery redirect stub and changelog pointed at claude.ai instead of the standalone [Learn Claude](https://rkalani1.github.io/claude/) site; both now link the correct site.
- Crashing or non-working code samples: the Gemini recipes' `FunctionDeclaration.from_function` calls (method does not exist; replaced with `from_callable_with_api_option`, runtime-verified on google-genai 2.12.1), the Codex recipe's removed `codex auth login` / `--approval-mode` commands, the Agents SDK streaming example, and the Grok tool-calling recipe's flat tool format (now the official nested format).
- Repaired the workbench stylesheets, whose mechanical scope-prefixing had silently dropped the variable block, font import, and print styles; the workbenches now also follow Material's dark mode.
- Eleven long-standing internal-link failures that had kept the gating link-check red since June; the check now passes.

### Changed
- Navigation consolidated from 21 to 13 beginner-first top-level tabs (new "Learn" and "Choose a tool" groups; no URLs changed). The three-item "Clinical Workflows" tab was retired: its recipes are now in the Recipes index (per ADR 0004) and the example toolkit page lives under MCP & Connectors.
- Footer replaced with a neutral MIT/educational notice; the guide no longer links institutional terms pages that could read as endorsement.
- Claude mastery routing: the standalone Learn Claude site is presented as canonical from the homepage and Mastery hub; the embedded copy is labeled as a snapshot.
- Model recommendations across Gemini and Grok pages now use the env-var pattern (`GEMINI_MODEL`, `XAI_MODEL`) instead of hard-coded model IDs that had already been retired.
- MCP security guidance replaced keyword deny-list "sanitization" advice with least-privilege and human-confirmation guidance, and corrected the malicious-server reporting channel.
- Clinical-adjacent recipes carry a standard "Educational example only" admonition (not clinical decision support; synthetic or published content only).

### Added
- A quiet [`llms.txt`](https://rkalani1.github.io/agents-automations/llms.txt) with the section index, the synthetic-data boundary, and the sourcing policy.
- Keyboard (arrow-key) navigation for the Universal Workbench model tablist.
- Sourced-and-dated headers on the interactive workbench and toolkit pages.

### Verified
- Full currency audit against official vendor documentation (2026-07-18). Pages whose sources could be fetched directly (Anthropic docs, MCP spec and SDK repos, OpenAI/xAI GitHub sources, google-genai runtime checks) carry a bumped **Last verified** date; pages whose vendors' doc hosts could only be checked via official-source search snapshots (ChatGPT consumer, Copilot, Grok consumer, Google consumer surfaces) keep their original date plus a **Partially re-verified: 2026-07-18** note with raised drift risk, per ADR 0002.

## [0.6.1] — 2026-05-06 — Standalone Claude site

### Changed
- Claude guidance now lives at the separate [Learn Claude site](https://rkalani1.github.io/claude/) instead of inside the Field Guide navigation.
- `docs/index.md`, `docs/mastery/index.md`, examples, source audit, and Claude redirect page now point to the standalone site.
- Removed Field Guide loading of the Claude-only CSS and JavaScript assets.

### Verified
- Claude source links were refreshed against official Anthropic docs, including the current canonical plan chooser URL.

## [0.6.0] — 2026-05-06 — Claude Mastery microsite

### Added
- **[Claude Mastery](docs/claude-mastery/index.md)** — a beginner-first, step-by-step Claude setup and mastery microsite with a path picker, local progress checklist, copyable prompt kit, Projects walkthrough, feature map, 30-day practice plan, and safety baseline.
- Scoped `docs/assets/stylesheets/claude-mastery.css` and `docs/assets/javascripts/claude-mastery.js` assets. The checklist persists only in the visitor's browser via `localStorage`; copy buttons use the browser Clipboard API and make no network calls.

### Changed
- `docs/index.md` now surfaces Claude Mastery as a first-class starting point for readers learning Claude specifically.
- The older `docs/mastery/claude.md` track now points readers to the dedicated Claude Mastery microsite to avoid duplicated, drifting Claude guidance.

### Verified
- Claude feature claims rechecked against current official Anthropic sources for plans, usage limits, personalization, Projects, memory, incognito chats, Artifacts, Skills, connectors, Claude Code, and prompting best practices.

## [0.5.2] — 2026-05-06 — Audit remediation and source refresh

### Changed
- `docs/index.md` now has a "Pick the right starting point" routing table for absolute beginners, subscription maximizers, product choosers, agent builders, and team/sensitive-data owners.
- GitHub Copilot references now use the current **Copilot cloud agent** name, with "formerly Copilot coding agent" retained only where it clarifies vendor renaming.
- Copilot cloud agent availability and billing guidance now reflects the current GitHub Docs: Pro, Pro+, Business, and Enterprise availability; Business/Enterprise policy enablement; premium-request usage per cloud-agent session and steering comment.
- xAI model links now use the current canonical `docs.x.ai/developers/models` URL, and Grok API examples default to the currently documented `grok-4.3` model identifier while still reading from `XAI_MODEL`.
- The MkDocs Material header repo widget was removed to avoid unauthenticated GitHub API calls and possible 403 console errors in visitor browsers.
- OpenAI recipe snippets now use `OPENAI_MODEL` instead of stale hard-coded model IDs, and beginner setup steps include the matching env var.
- Exact live-cost claims were removed from recipes; cost sections now describe token drivers and tell readers to recalculate against current vendor pricing.
- Structured-output language now tells readers to validate returned objects locally instead of treating provider-side schema constraints as a substitute for production validation.
- Browser/computer-use comparison now marks `computer-use-preview` as legacy and reflects current OpenAI `computer` tool guidance.

### Verified
- Source refresh checked current official GitHub Copilot cloud-agent docs, GitHub Copilot requests/billing docs, xAI structured-output docs, xAI model docs, and OpenAI computer-use docs.
- Site QA now guards against stale xAI model URLs, stale Copilot cloud-agent billing language, hard-coded older OpenAI model IDs, and exact live-cost claims.

## [0.5.0] — 2026-05-06 — Subscription-first expansion (deepening pass)

### Added
- **`docs/capability-map/index.md`** — cross-product matrix covering 18 capabilities across 7 surface groups with plan-availability tags and per-cell fallbacks.
- **`docs/no-code-automations/index.md`** — ChatGPT Tasks, Gemini scheduled actions, Claude Cowork, calendar-driven manual fallback, safety drill (3 manual runs, off-switch, cost cap).
- **`docs/preferences-memory/index.md`** — portable AI profile, global vs project memory, migration playbook for Claude / ChatGPT / Gemini / Grok / Perplexity, 6 copy-paste templates.
- **`docs/examples/`** — 13 guided beginner examples (write-difficult-email, meeting-prep, weekly-report, research-summary, study-plan, trip-planning, newsletter-triage, build-simple-website, build-small-app, create-custom-assistant, create-native-task, maximize-my-ai-subscription, other-ai-tool-workflow). Each has 6 layers + beginner/intermediate/expert steps.
- **`docs/learning-path/index.md`** — universal 7-mission learning path that works on any AI subscription.
- **`docs/glossary-plain.md`** + **`docs/assets/diagrams/*.svg`** — plain-English glossary with 8 schematic diagrams (ChatGPT Project & Task, Claude Project / Skill / Cowork, Gemini Gem / Scheduled action, Grok chat).
- **Task Builder v0.5** in `docs/assets/javascripts/task-builder.js` and `docs/task-builder/index.md`: 4-tier mode selector (Beginner / Power User / Builder / Developer), provider-package output for all 7 surfaces with primary app first, plus 6 new output panels (Learning ladder, What good output looks like, Practice exercise, Free vs paid, Maximize my subscription, Expert expansion).

### Changed
- `docs/index.md` card grid expanded with Learning path, Capability map, No-code automations, Memory, Examples.
- `mkdocs.yml` nav adds Learning path, Capability map, Examples, No-code automations, Memory & preferences sections; Reference adds Plain-English glossary.
- `docs/roadmap.md` rewritten to reflect the subscription-first strategy and what landed in v0.5.
- `docs/source-map.md` gains a v0.5 "Subscription-first vendor surfaces" section.
- `docs/source-audit.md` gains a v0.5 audit table.
- `SUBSCRIPTION_FIRST_EXPANSION_STATUS.md`, `USER_REQUIREMENTS_TRACEABILITY.md`, and `docs/product-requirements/user-requirements-traceability.md` updated to mark v0.5 deliverables.

### Verified
- `mkdocs build --strict` exits 0.
- Beginner / Power User / Builder modes never recommend API, CLI, MCP, or local scripts.
- Task Builder JS contains no `fetch`, `XMLHttpRequest`, `WebSocket`, `sendBeacon`, dynamic script loading, or analytics calls (only commented references as guardrails).
- All runnable scripts in starter kits remain gated behind `OPERATOR_APPROVED_TO_RUN=1`.
- All 16 user requirements and all 24 acceptance criteria are mapped to implementations in the traceability files.

## [0.4.0] — 2026-05-06 — Subscription-first expansion

### Added
- **Mastery section** at `docs/mastery/`: an index plus seven beginner-to-expert tracks for Claude, ChatGPT, Gemini, Grok, Perplexity, Coding agents, and "Any AI tool / I don't know." Each track follows Beginner → Intermediate → Advanced → Expert, ends with a guided exercise, and has a free-vs-paid availability table plus a per-row fallback.
- **Task Builder Beginner Mode** (the new default). Beginner Mode never recommends API keys, CLIs, MCP, or local scripts. Switching to Developer Mode at the top of the page exposes the v0.3 routing.
- **Primary-app picker** at the top of the Task Builder: ChatGPT / Claude / Gemini / Grok / Perplexity / GitHub Copilot / Something else / I don't know.
- **Comfort-level picker**: Beginner / Comfortable / Power user / Developer (developer auto-bumps Mode).
- **Job picker** with 16 common jobs (write, summarize, research, plan, learn, organize, meetings, email/calendar, website/app, automate, documents/data, code, agent, skill, max-leverage, other).
- Two new Task Builder output panels: **Level up this workflow** (per-app capability ladder) and **If your plan doesn't have this** (fallbacks).
- **What to click** panel with exact step-by-step instructions for ChatGPT / Claude / Gemini / Grok / Perplexity / Copilot / Other / Unknown.
- **`USER_REQUIREMENTS_TRACEABILITY.md`** at the repo root and `docs/product-requirements/user-requirements-traceability.md` mapping every user requirement to its implementation.
- **`SUBSCRIPTION_FIRST_EXPANSION_STATUS.md`** at the repo root recording the starting state of this pass and the final verification checklist.

### Changed
- Homepage opens with "No API key required. Start with the AI app you already use." and links Mastery as a primary action.
- Task Builder page rewritten to put primary-app + comfort + job pickers above the rest of the form. The advanced surface picker is hidden in Beginner Mode.
- `mkdocs.yml` adds the Mastery group to the nav and exposes the traceability page in Reference.

### Verified
- `mkdocs build --strict` exits 0.
- Task Builder JS contains no `fetch`, `XHR`, `WebSocket`, or `sendBeacon` calls.
- Beginner Mode does not recommend API/CLI/MCP/local-script surfaces under any combination of inputs.

## [0.3.0] — 2026-05-06 — Task Builder transformation

### Added
- **Task Builder** at `docs/task-builder/index.md`. A static, browser-local tool that takes a task description, the surfaces the user has, and a few constraints, and produces a complete recommendation package: surface choice, prompt, system instructions, memory block, platform setup, tool allowlist, HITL gates, eval checklist, red-team probes, repeat-run playbook, troubleshooting, and exportable JSON. Zero network calls, zero analytics, optional `localStorage` only.
- **Surface router** at `docs/surface-router/index.md`. Long-form decision matrix for chat vs. project vs. coding agent vs. skill vs. automation vs. agent vs. browser-use vs. MCP.
- **Grok / xAI coverage**: `docs/platforms/grok.md`, `docs/quickstarts/first-grok-task.md`, `docs/recipes/grok-structured-output.md`, `docs/recipes/grok-tool-calling.md`. Distinguishes consumer Grok, Grok on X, and the xAI API.
- **Model freshness page** at `docs/model-freshness.md`. Central place that documents the env-var pattern (`OPENAI_MODEL`, `ANTHROPIC_MODEL`, `GEMINI_MODEL`, `XAI_MODEL`, `LOCAL_MODEL`) and a quarterly drift checklist.
- **ADR 0004** documenting the recipe nav pattern (recipes accessed via index, not in top-level nav).
- **`IMPROVEMENT_PASS_STATUS.md`** at the repo root summarizing the starting state of the v0.3 pass.
- Task Builder asset files: `docs/assets/javascripts/task-builder.js` (~38 KB, no network), `docs/assets/stylesheets/task-builder.css`.

### Changed
- Homepage rewritten as a task-to-outcome on-ramp with three example outputs (weekly research summary, repo maintenance, email/calendar triage) and primary actions (Task Builder, Surface router, Recipes, Starter kits).
- `mkdocs.yml` adds Task Builder, Surface router, Model freshness, Grok platform page, and the new Grok quickstart to the nav. `extra_css` and `extra_javascript` register the Task Builder assets.
- Platforms index gains an `xAI / Grok` row.
- Source map and source audit now include xAI / Grok references and an audit row.
- Recipes index links the two new Grok recipes under Programmatic agents.

### Fixed
- **MCP starter-kit approval bypass.** `starter-kits/mcp-server-python/server.py` and `starter-kits/mcp-server-typescript/server.ts` no longer treat "stdin is a pipe" as an approval bypass. Both servers now require `OPERATOR_APPROVED_TO_RUN=1` unconditionally; MCP clients that auto-launch the server must include the variable in their `env` block. README, AGENT_SPEC, and dry-run text updated to match.
- **Deployment claim accuracy.** `DEPLOYMENT_STATUS.md`, `CHANGELOG.md`, and `docs/changelog.md` now describe the strict-build output honestly: `mkdocs build --strict` exits 0; the upstream Material for MkDocs banner is theme-level, not a project warning; the INFO-level recipe-not-in-nav notices are intentional and documented in [ADR 0004](docs/decision-records/0004-recipe-nav-pattern.md).
- **Link check gating.** `.github/workflows/link-check.yml` is now two jobs: `internal-links` runs lychee in `--offline` mode and is gating (fails PRs on broken relative/anchor links); `external-links` is advisory and never fails the build. Documented in `PRODUCTION_DEPLOYMENT.md`.
- **Model currentness.** `starter-kits/local-script-agent/script.py` now reads its model name from `OPENAI_MODEL` and exits with a clear error if unset, eliminating the only hard-coded model in a runnable example. The Model freshness page provides the canonical pattern for all other surfaces.

### Verified
- `mkdocs build --strict` exits 0.
- All Task Builder logic runs in the browser; the JS file contains no `fetch`, `XMLHttpRequest`, `WebSocket`, or `sendBeacon` calls.
- All previous v0.2 work preserved.

## [0.2.0] — 2026-05-06 — Productionization pass

### Added
- **Quickstarts** (`docs/quickstarts/`): five end-to-end recipes (read-only agent, file-editing agent, coding agent, browser agent, MCP agent), each with use case, platform choice, prerequisites, copyable instructions, example I/O, safety boundaries, eval steps, and troubleshooting.
- **Recipe library** (`docs/recipes/`): 40+ complete agent recipes covering email triage, calendar prep, literature triage, PDF extraction, Obsidian capture, spreadsheet cleaning, GitHub issue grooming, PR review, repo maintenance, test generation, doc refresh, release notes, browser research, browser form-fill (dry-run), folder monitor (manual-only), MCP filesystem, MCP database (read-only), customer support drafting, grant drafting, clinical literature summarization (synthetic data only), research data dictionary, daily brief (manual-only), team KB Q&A, Slack/Teams digest (connector-gated), security dependency review, incident response summarizer, cost monitoring, source-drift checking, multi-agent coding sprint coordinator, agent portfolio ranking, prompt-pack generator, eval-case generator, red-team generator, cross-platform prompt porter, local-first offline summarizer, OpenAI Agents SDK tool-calling agent, Gemini function-calling agent, Claude Code repo-editing agent, Codex repo-editing agent, Antigravity project agent, and GitHub Copilot cloud agent task recipe.
- **Starter kits** (`starter-kits/`): nine copyable kits — universal agent spec, Claude Code agent, Codex agent, Gemini Antigravity agent, OpenAI Agents SDK (Python and TypeScript), MCP server (Python and TypeScript), and local script agent. Each kit ships with `README.md`, `AGENT_SPEC.md`, `PROMPT.md`, `TOOL_ALLOWLIST.md`, `EVALS.jsonl`, `RED_TEAM_CASES.jsonl`, `LAUNCH_CHECKLIST.md`, and `INCIDENT_RESPONSE.md`. Example scripts are inert by default and gated behind `OPERATOR_APPROVED_TO_RUN=1`.
- **Evaluation banks** (`evals/`): 100+ golden eval cases across common agent tasks and 100+ red-team cases (prompt injection, jailbreak, exfiltration, overbroad tool use, destructive file actions, infinite loops, denial-of-wallet, privacy leakage, regulated-domain boundary violations, cross-user contamination). Includes per-platform usage notes and rubric files.
- **Agent Factory module** (`docs/agent-factory/`): operating model, portfolio design, requirements intake, candidate ranking, prompt-pack generation, eval generation, red-team generation, cross-platform porting, launch readiness, maintenance & drift, and a single worked example that produces five fully specified agents from 25 candidates.
- **Source audit** (`docs/source-audit.md`): records what was rechecked, when, against which official URLs, and what remains high-drift.
- **Repository hygiene**: bug report, doc update, source drift, and recipe request issue templates; pull request template; Dependabot config; PR build workflow; and link-check workflow.
- **Deployment docs**: `DEPLOYMENT_STATUS.md` and `PRODUCTION_DEPLOYMENT.md` documenting the GitHub Pages + Actions setup, last deployment, and rollback path.

### Changed
- `docs/platforms/index.md`: removed all "(coming soon)" labels for ChatGPT, Custom GPTs, OpenAI API, Codex, GitHub Copilot, and Local scripts — every page exists and is linked.
- `mkdocs.yml`: nav label `Safety/safety-checklists` corrected to `Safety checklists`. Quickstarts, Recipes, Agent Factory, Source audit, and Starter kits index added to the navigation tree.
- Source map (`docs/source-map.md`): expanded with additional Anthropic, OpenAI, Google, GitHub, and MCP references used by the new content.

### Verified
- `mkdocs build --strict` exits 0. The build emits the upstream Material for MkDocs informational banner about the future MkDocs 2.0 release — this is upstream output from the theme, not a project warning. The build also prints INFO-level notices for the 41 recipes that are intentionally accessed via the categorized [Recipes index](docs/recipes/index.md) rather than the top-level nav (see [ADR 0004](docs/decision-records/0004-recipe-nav-pattern.md)).
- GitHub Pages production deployment via `actions/deploy-pages@v4` succeeds from `main`.
- Live site: https://rkalani1.github.io/agents-automations/.

## [0.1.0] — 2026-05-06 — Initial public release

See [`docs/changelog.md`](docs/changelog.md) for the original 0.1.0 entry.
