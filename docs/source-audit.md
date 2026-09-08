# Source audit

> **Audit date:** 2026-05-06 · **Auditor:** maintainers · **Drift policy:** see [ADR 0002](decision-records/0002-sourced-and-dated.md)

This page is a transparent record of which pages have been re-checked against which official URLs, when, and what remains high-drift. The full canonical reference list lives in [`source-map.md`](source-map.md).

## How to read this table

| Column | Meaning |
|---|---|
| **Page** | The site page (or section) that was audited. |
| **Date** | When the audit was performed (YYYY-MM-DD). |
| **Auditor** | The reviewer's GitHub handle or "maintainers" for batch audits. |
| **Sources checked** | Official vendor URLs consulted. |
| **Drift risk** | Subjective rating used elsewhere in the guide (low / medium / high). |
| **Notes** | What changed, what didn't, and what to watch. |

## Audit log

### Anthropic / Claude

| Page | Date | Sources checked | Drift risk | Notes |
|---|---|---|---|---|
| [Claude](https://claude.ai/) | 2026-05-06 | [plans](https://support.claude.com/en/articles/11049762-choosing-a-claude-ai-plan), [usage limits](https://support.claude.com/en/articles/11647753-how-do-usage-and-length-limits-work), [personalization](https://support.claude.com/en/articles/10185728-understanding-claude-s-personalization-features), [Projects](https://support.claude.com/en/articles/9517075-what-are-projects), [memory](https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context), [incognito](https://support.claude.com/en/articles/12260368-using-incognito-chats), [Artifacts](https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them), [Skills](https://support.claude.com/en/articles/12512176-what-are-skills), [connectors](https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities), [Claude Code](https://code.claude.com/docs/en/overview), [prompting](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) | High | Claude moved to a separate standalone site. The Field Guide keeps only cross-links and an old-path redirect. Plan, limit, model, and UI label claims remain intentionally coarse and dated because these surfaces drift quickly. |
| [Claude Desktop](platforms/claude-desktop.md) | 2026-05-06 | [download](https://claude.ai/download), [local MCP guide](https://support.claude.com/en/articles/10949351-getting-started-with-local-mcp-servers-on-claude-desktop), [connectors](https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities) | Medium | Connectors UI labels evolve quickly; `claude_desktop_config.json` schema confirmed as the documented integration path. |
| [Claude Code](platforms/claude-code.md) | 2026-05-06 | [setup](https://code.claude.com/docs/en/setup), [quickstart](https://code.claude.com/docs/en/quickstart), [settings](https://code.claude.com/docs/en/settings), [subagents](https://code.claude.com/docs/en/sub-agents), [hooks](https://code.claude.com/docs/en/hooks), [MCP](https://code.claude.com/docs/en/mcp) | Medium | Install methods (native installer, Homebrew, WinGet) confirmed; subagent and hook surfaces are evolving. |
| [Claude Projects](platforms/claude-projects.md) | 2026-05-06 | claude.ai surfaces, [connectors](https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities) | Medium | Project memory and file limits documented inconsistently across surfaces; verify in-app. |
| [Computer use](browser-use/anthropic.md) | 2026-05-06 | [tool docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool), [launch post](https://www.anthropic.com/news/3-5-models-and-computer-use) | High | Beta surface; action types and screenshot semantics may move. |

### OpenAI

| Page | Date | Sources checked | Drift risk | Notes |
|---|---|---|---|---|
| [ChatGPT (Projects)](platforms/chatgpt.md) | 2026-05-06 | [Projects help](https://help.openai.com/en/articles/10169521-projects-in-chatgpt) | Medium | Memory modes, file limits, and connector availability change frequently — re-verify in-app each quarter. |
| [Custom GPTs](platforms/custom-gpts.md) | 2026-05-06 | [GPT builder help](https://help.openai.com/en/articles/8554397) | Medium | Actions schema and capability toggles are stable but trust/visibility settings evolve. |
| [OpenAI API & Agents SDK](platforms/openai-api.md) | 2026-05-06 | [platform docs](https://platform.openai.com/docs/overview), [function calling](https://platform.openai.com/docs/guides/function-calling), [structured outputs](https://platform.openai.com/docs/guides/structured-outputs), [Agents SDK repo](https://github.com/openai/openai-agents-python), [SDK docs](https://openai.github.io/openai-agents-python/) | Medium | SDK is under active development; pinning to a specific version is recommended. |
| [Codex CLI](platforms/codex.md) | 2026-05-06 | [Codex CLI docs](https://developers.openai.com/codex/cli), [Codex repo](https://github.com/openai/codex) | High | Approval modes and packaging change rapidly. |
| [Computer use (OpenAI)](browser-use/openai.md) | 2026-05-06 | [API guide](https://developers.openai.com/api/docs/guides/tools-computer-use), [CUA blog](https://openai.com/index/computer-using-agent/) | High | Available models and pricing change frequently. |

### Google

| Page | Date | Sources checked | Drift risk | Notes |
|---|---|---|---|---|
| [Gemini app (Gems)](platforms/gemini-app.md) | 2026-05-06 | [Gemini app](https://gemini.google.com), [Gems help](https://support.google.com/gemini/answer/15235603?hl=en) | Medium | Gems availability has shifted across consumer and Workspace tiers. |
| [Gemini CLI](platforms/gemini-cli.md) | 2026-05-06 | [repo](https://github.com/google-gemini/gemini-cli), [community docs](https://geminicli.com/docs/get-started/installation/) | Medium | Auth flow and free-tier model defaults change — re-check the repo README. |
| [Antigravity](platforms/antigravity.md) | 2026-05-06 | [codelab](https://codelabs.developers.google.com/getting-started-google-antigravity) | High | Newer product; expect renames and capability shifts. Re-check before publishing instructions. |
| [Google AI Studio](platforms/ai-studio.md) | 2026-05-06 | [AI Studio](https://ai.google.dev/aistudio), [API docs](https://ai.google.dev/gemini-api/docs), [function calling](https://ai.google.dev/gemini-api/docs/function-calling), [structured output](https://ai.google.dev/gemini-api/docs/structured-output) | Medium | Free-tier rate limits and model lineup change; pin model names in code. |

### xAI / Grok

| Page | Date | Sources checked | Drift risk | Notes |
|---|---|---|---|---|
| [Grok / xAI](platforms/grok.md) | 2026-05-06 | [overview](https://docs.x.ai/overview), [function calling](https://docs.x.ai/developers/tools/function-calling), [structured outputs](https://docs.x.ai/developers/model-capabilities/text/structured-outputs), [models](https://docs.x.ai/developers/models) | High | Three distinct surfaces (consumer Grok, Grok on X, xAI API). Tool calling and structured outputs require API access. Model lineup and tier availability change frequently. |

### MCP

| Page | Date | Sources checked | Drift risk | Notes |
|---|---|---|---|---|
| [MCP concepts](mcp/concepts.md) | 2026-05-06 | [spec 2025-06-18](https://modelcontextprotocol.io/specification/2025-06-18), [intro](https://modelcontextprotocol.io/introduction) | Low–medium | Spec is versioned; re-pin when a new spec ships. |
| [Installing MCP servers](mcp/install.md) | 2026-05-06 | [connect local](https://modelcontextprotocol.io/docs/develop/connect-local-servers), [Claude Desktop guide](https://support.claude.com/en/articles/10949351-getting-started-with-local-mcp-servers-on-claude-desktop) | Medium | `claude_desktop_config.json` paths and Windows behavior are footgun-prone. |
| [Writing servers](mcp/writing.md) | 2026-05-06 | [Python SDK](https://github.com/modelcontextprotocol/python-sdk), [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk), [SDKs index](https://modelcontextprotocol.io/docs/sdk) | Medium | Pin SDK versions in examples. |
| [MCP security](mcp/security.md) | 2026-05-06 | [security best practices](https://modelcontextprotocol.io/specification/2025-06-18/basic/security_best_practices) | Low | Threat model is stable; specific mitigations track the spec. |

### GitHub

| Page | Date | Sources checked | Drift risk | Notes |
|---|---|---|---|---|
| [Copilot cloud agent](platforms/copilot.md) | 2026-05-06 | [about cloud agent](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent), [risks and mitigations](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/risks-and-mitigations), [best practices](https://docs.github.com/en/copilot/tutorials/cloud-agent/get-the-best-results), [plans](https://docs.github.com/en/copilot/get-started/plans), [requests and billing](https://docs.github.com/en/copilot/concepts/billing/copilot-requests) | Medium | Plan availability, organization policy, premium-request accounting, and cloud-agent naming evolve. |
| Pages + Actions deployment | 2026-05-06 | [Pages docs](https://docs.github.com/pages), [Actions syntax](https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions), [`actions/deploy-pages`](https://github.com/actions/deploy-pages), [MkDocs Material publishing](https://squidfunk.github.io/mkdocs-material/publishing-your-site/) | Low | Stable for our use; revisit when major action versions ship. |

### v0.5 subscription-first surfaces

| Page | Date | Sources checked | Drift risk | Notes |
|---|---|---|---|---|
| [Capability map](capability-map/index.md) | 2026-05-06 | All linked vendor help pages from [`source-map.md`](source-map.md) Subscription-first surfaces section | High | Plan-tier shorthands (`Free` / `Sub` / `Team / Ent` / `Dev / API`) are deliberately coarse to slow drift. Re-verify quarterly. |
| [No-code automations](no-code-automations/index.md) | 2026-05-06 | [ChatGPT Tasks help](https://help.openai.com/en/articles/10291617-tasks-in-chatgpt), [Gemini scheduled actions](https://support.google.com/gemini/answer/16316416?co=GENIE.Platform%3DDesktop&hl=en), [Claude Cowork scheduled tasks](https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-claude-cowork) | High | Native scheduling features are rolled out unevenly per region/plan; treat the names as guidance, not contracts. |
| [Memory & preferences](preferences-memory/index.md) | 2026-05-06 | Custom Instructions help, Memory FAQ, Saved info help, Claude profile preferences | Medium | The shape of the slot ("profile / saved info / memory") is more stable than the labels. |
| [Examples library](examples/index.md) | 2026-05-06 | Internal cross-references only | Low | Examples are tool-agnostic shapes; they reference Mastery pages for product-specific clicks. |
| [Learning path](learning-path/index.md) | 2026-05-06 | Internal cross-references only | Low | The 7 missions are tool-agnostic. |
| [Plain-English glossary + diagrams](glossary-plain.md) | 2026-05-06 | Schematic SVGs (vendor-neutral) | Low | Diagrams are explicitly schematic, not screenshots, to slow drift. |

## What remains high-drift

These pages are the most likely to go stale within a quarter:

- [Antigravity](platforms/antigravity.md) — newer IDE; vendor messaging and feature scope are still moving.
- [Codex CLI](platforms/codex.md) — packaging, login flows, and approval-mode names have changed multiple times.
- [Anthropic computer use](browser-use/anthropic.md) and [OpenAI computer use](browser-use/openai.md) — beta surfaces with rapid iteration.
- Gemini Gems availability across consumer and Workspace tiers.

When you edit any of these pages, bump the `Last verified:` date and re-check the linked official sources first.

## How to contribute an audit

1. Open a [Source drift issue](https://github.com/rkalani1/agents-automations/issues/new?template=source_drift.yml).
2. After review, file a PR that updates the affected page **and** adds a row above with the new date and outcome.
