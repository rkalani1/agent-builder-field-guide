# Recipes

This section is a practitioner-focused catalog of 45 agent recipes for the Agents and Automations. Each recipe is a self-contained, copy-pasteable blueprint that covers platform selection, permissions, a filled agent spec, setup steps, a ready-to-use prompt, eval cases, red-team probes, and a safe-launch checklist.

Recipes are vendor-neutral where possible. Where a specific platform is recommended, at least one alternate is listed. No recipe requires production credentials to read, and all examples use synthetic data.

## How to use these recipes

Pick a recipe that matches your use case. Read the "Why this platform" and "Permission model" sections before touching any settings. Run through the "Safe launch checklist" before going live. After launch, follow the "Maintenance cadence" to catch model drift and API changes.

Each recipe is rated by drift risk (low / medium / high), reflecting how quickly the underlying APIs, model behaviors, or third-party connectors are likely to change. Medium is the most common rating: the core task is stable, but prompt tuning and connector re-authentication are expected every few months.

---

## Inbox and calendar

| Recipe | File | Goal |
|--------|------|------|
| Email triage agent | [email-triage.md](email-triage.md) | Read inbox and suggest Now / Later / Reference / Trash labels — no sends |
| Calendar meeting-prep agent | [calendar-meeting-prep.md](calendar-meeting-prep.md) | Produce a one-paragraph brief per tomorrow's meeting from notes and email |
| Slack/Teams digest draft agent | [slack-teams-digest.md](slack-teams-digest.md) | Draft a daily digest of channel activity for human review and send |
| Personal daily brief agent | [personal-daily-brief.md](personal-daily-brief.md) | Compile weather, calendar, and news into a morning brief (manual-only) |

---

## Research and writing

| Recipe | File | Goal |
|--------|------|------|
| Literature triage agent | [literature-triage.md](literature-triage.md) | Label paper abstracts as Read-now / Read-later / Skip with reasons |
| Clinical literature summarizer | [clinical-literature-summarizer.md](clinical-literature-summarizer.md) | Summarize synthetic or public abstracts; strict PHI exclusion |
| Research data dictionary agent | [research-data-dictionary.md](research-data-dictionary.md) | Build a data dictionary from column names and sample rows |
| Grant/proposal drafting agent | [grant-proposal-draft.md](grant-proposal-draft.md) | Draft grant sections from user-supplied outline and reference files |
| Customer support draft agent | [customer-support-draft.md](customer-support-draft.md) | Draft support replies that always require a human to send |
| Team knowledge-base Q&A agent | [team-knowledge-qa.md](team-knowledge-qa.md) | Answer questions grounded in a team's internal knowledge base |
| Documentation refresh agent | [documentation-refresh.md](documentation-refresh.md) | Walk a docs site and propose updates against a changed source map |

---

## Coding and repos

| Recipe | File | Goal |
|--------|------|------|
| GitHub issue grooming agent | [github-issue-grooming.md](github-issue-grooming.md) | Suggest labels and triage notes for new issues; read-only by default |
| PR review assistant | [pr-review.md](pr-review.md) | Post review comments only after human approval |
| Repo maintenance agent | [repo-maintenance.md](repo-maintenance.md) | Update dependencies, fix CI lint warnings, and open draft PRs |
| Test generation agent | [test-generation.md](test-generation.md) | Add pytest tests to a Python module |
| Release-notes agent | [release-notes.md](release-notes.md) | Generate release notes from git log and closed PRs |
| Security dependency review agent | [security-dependency-review.md](security-dependency-review.md) | Flag vulnerable packages in a dependency manifest |
| Multi-agent coding sprint coordinator | [multi-agent-coding-sprint.md](multi-agent-coding-sprint.md) | Coordinate parallel sub-agents on a coding sprint plan |
| Claude Code repo-editing agent | [claude-code-repo-editing.md](claude-code-repo-editing.md) | Edit source files in a repo using Claude Code with git safety |
| Codex repo-editing agent | [codex-repo-editing.md](codex-repo-editing.md) | Edit source files using Codex CLI in a sandboxed checkout |
| GitHub Copilot cloud agent task | [github-copilot-cloud-task.md](github-copilot-cloud-task.md) | Assign an issue to a Copilot cloud coding agent |

---

## Browser and web

| Recipe | File | Goal |
|--------|------|------|
| Browser research agent | [browser-research.md](browser-research.md) | Gather public-web facts into a structured Markdown table |
| Browser form-fill dry-run | [browser-form-fill-dryrun.md](browser-form-fill-dryrun.md) | Populate a form and emit intended values as JSON; stop before submit |
| Source-drift checker agent | [source-drift-checker.md](source-drift-checker.md) | Detect when a cited source URL has changed or gone stale |

---

## Knowledge and data

| Recipe | File | Goal |
|--------|------|------|
| PDF extraction agent | [pdf-extraction.md](pdf-extraction.md) | Extract structured fields from public-domain PDFs into JSON |
| Spreadsheet cleaning agent | [spreadsheet-cleaning.md](spreadsheet-cleaning.md) | Standardize column names and date formats in a CSV |
| MCP database read-only assistant | [mcp-database-readonly.md](mcp-database-readonly.md) | Answer SQL questions against a SQLite DB via a read-only MCP server |
| Incident response summarizer | [incident-response-summarizer.md](incident-response-summarizer.md) | Turn an incident timeline into a structured post-mortem draft |
| Cost-monitoring agent | [cost-monitoring.md](cost-monitoring.md) | Parse usage exports and flag spend above threshold |
| Agent portfolio ranking agent | [agent-portfolio-ranking.md](agent-portfolio-ranking.md) | Score and rank a set of deployed agents by reliability and value |
| Word-to-PPT blueprint | [word-to-ppt.md](word-to-ppt.md) | Turn a Word outline into a slide deck; synthetic/educational content only |
| Medical infographics guide | [medical-infographics.md](medical-infographics.md) | Design educational infographics from published data; not clinical decision support |

---

## Local-first

| Recipe | File | Goal |
|--------|------|------|
| Obsidian capture agent | [obsidian-capture.md](obsidian-capture.md) | Convert raw daily notes to Markdown with YAML frontmatter for Obsidian |
| Local folder monitor agent | [local-folder-monitor.md](local-folder-monitor.md) | Snapshot and diff a local folder; report new, changed, and deleted files |
| MCP filesystem assistant | [mcp-filesystem-assistant.md](mcp-filesystem-assistant.md) | Answer file questions with Claude Desktop scoped to one sandbox directory |
| Local-first offline summarizer | [local-first-offline-summarizer.md](local-first-offline-summarizer.md) | Summarize documents without any network calls using a local model |

---

## Programmatic agents

| Recipe | File | Goal |
|--------|------|------|
| OpenAI Agents SDK tool-calling agent | [openai-agents-sdk-tool-calling.md](openai-agents-sdk-tool-calling.md) | Build a tool-calling loop with the OpenAI Agents SDK |
| Gemini function-calling agent | [gemini-function-calling.md](gemini-function-calling.md) | Implement function calling with the Gemini API |
| Grok structured output | [grok-structured-output.md](grok-structured-output.md) | Convert synthetic feedback into a structured CSV using xAI structured outputs |
| Grok tool calling | [grok-tool-calling.md](grok-tool-calling.md) | Use xAI function calling to choose between local Python tools |

---

## Agent factory utilities

| Recipe | File | Goal |
|--------|------|------|
| Prompt-pack generator | [prompt-pack-generator.md](prompt-pack-generator.md) | Generate a reusable prompt pack for a new agent type |
| Eval-case generator | [eval-case-generator.md](eval-case-generator.md) | Produce a structured eval suite from a task description |
| Red-team generator | [red-team-generator.md](red-team-generator.md) | Generate adversarial probes for a given agent spec |
| Cross-platform prompt porter | [cross-platform-prompt-porter.md](cross-platform-prompt-porter.md) | Translate a prompt written for one model family to another |
| Antigravity project agent | [antigravity-project.md](antigravity-project.md) | Scaffold a new agent project with all boilerplate in place |

---

## Reading guide

Recipes are designed to be read in any order. If you are new to agent building, start with [email-triage.md](email-triage.md) or [mcp-filesystem-assistant.md](mcp-filesystem-assistant.md) — both use narrow permissions and produce no side effects without explicit human action. The "Agent factory utilities" section is useful once you have one or two agents running and want to scale your process.

All recipes follow the same structure so you can scan quickly: the "Filled agent spec" section contains the single most important artifact for handing off to a teammate or to an LLM assistant that will help you build the agent.

