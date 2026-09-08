# Google Antigravity

> **Last verified:** 2026-05-06 · **Drift risk:** high
> **Official sources:** [Antigravity site](https://antigravity.google/), [Antigravity documentation](https://antigravity.google/docs), [Getting Started codelab](https://codelabs.developers.google.com/getting-started-google-antigravity), [Download page](https://antigravity.google/download)

**Re-verify notice**: Antigravity is a new product in active development. UI labels, feature names, configuration paths, and the installation process described here are based on the official codelab as of 2026-05-06. A re-check attempt on 2026-07-18 could not reach the official pages, but search-surfaced announcements around Google I/O 2026 suggest the product (including its tooling, availability, and plan structure) has been updated since this page's last full verification. Before writing documentation, tutorials, or internal guides that reference Antigravity, re-check the [codelab](https://codelabs.developers.google.com/getting-started-google-antigravity) and [official docs](https://antigravity.google/docs) directly.

---

## What This Surface Is

Google Antigravity is an agent-first development platform. It is built on the open-source Visual Studio Code codebase but is redesigned from the ground up to prioritize autonomous AI agents over line-by-line code editing.

The key distinction from a standard AI coding assistant (like GitHub Copilot in VS Code) is that Antigravity is designed around the idea that the AI is an autonomous actor. You give it a high-level objective—"refactor the authentication module," "generate a test suite for the billing API"—and an agent plans, codes, tests, browses the web for documentation, and iterates on the result, producing reviewable artifacts at each step.

The interface has two primary windows:

- **Editor**: a familiar VS Code-like code editor
- **Agent Manager**: a dashboard for spawning, monitoring, and reviewing agents

At this page's last full verification, Antigravity was available as a preview for personal Gmail accounts with a free quota. Availability, plan tiers, and quotas have been changing quickly — check [antigravity.google](https://antigravity.google/) for the current status before relying on this snapshot.

---

## Who It Is Best For

- Developers who want to delegate entire engineering tasks to an agent, not just get autocomplete suggestions
- People building web apps, working through large refactors, or writing test suites who want an agent that plans and executes multi-step work
- Developers willing to work with preview-stage software and accept occasional rough edges in exchange for early access to agent-first workflows
- Not recommended for environments with strict security requirements around AI-executed terminal commands until you fully understand the permission model

---

## Prerequisites

- macOS, Windows, or a supported Linux distribution
- A Chrome web browser (required for the built-in Antigravity browser subagent)
- A personal Gmail account
- Available disk space for the application installer

---

## Step-by-Step Setup

### 1. Download the installer

Go to [antigravity.google/download](https://antigravity.google/download) and download the package for your operating system.

### 2. Install and launch

Run the installer. Launch the Antigravity application.

### 3. Complete the setup wizard

The setup wizard walks you through several one-time choices:

**Import vs. fresh start**: You can import settings from an existing VS Code or Cursor installation. A fresh start is recommended to avoid carrying over configurations that may conflict with Antigravity's agent-oriented design.

**Choose a theme**: Dark or light. This can be changed later via `Cmd+,` (macOS) or `Ctrl+,` (Linux/Windows).

**Choose your agent usage policy**: This controls how aggressively the agent acts without asking for your review. Options from the [codelab](https://codelabs.developers.google.com/getting-started-google-antigravity):

| Policy | Terminal execution | Code review |
|--------|-------------------|-------------|
| Secure mode | Restricted external access | Enhanced security controls |
| Review-driven development (recommended) | Requests review | Agent frequently asks for review |
| Agent-driven development | Always proceeds | Never asks for review |
| Custom | Configurable | Configurable |

For a first install, **Review-driven development** is the safest choice. You can change this later.

**Configure editor**: Set keybindings, install language extensions, and optionally install the `agy` command-line tool.

**Sign in to Google**: Authenticate with a personal Gmail account.

### 4. Open a workspace

In the Agent Manager, click **Open Folder** and select a local project directory. Antigravity uses this as its working directory.

### 5. Install the browser extension (optional but needed for web tasks)

If you want the agent to interact with web pages:

1. Start a conversation and type: `go to antigravity.google`
2. When prompted, click **Setup**.
3. Install the Antigravity Chrome extension from the Chrome Web Store.
4. Grant the requested permissions.

The browser subagent can then navigate pages, click elements, read content, and take screenshots.

---

## Building Your First Useful Agent: Small Website Refactor

This worked example takes an existing small website (HTML/CSS/JavaScript) and has Antigravity refactor the visual theme and add comments to the code.

### Start in the Agent Manager

Open the Agent Manager window (if the Editor is showing, press `Cmd+E` on macOS or use the menu). You will see a chat input at the bottom of the Agent Manager.

### Choose a mode

For a non-trivial task like a refactor, use **Planning** mode. Planning mode asks the agent to produce a structured plan before touching any files. You can review and comment on the plan before execution begins.

### Submit the task

```
Refactor the website in the current folder. Change the color scheme to use
a blue and white palette instead of the current orange. Add brief comments
to all JavaScript functions explaining what they do. Do not change any
functionality.
```

### Review the Implementation Plan artifact

In Planning mode, the agent first produces an **Implementation Plan** artifact describing what it intends to change. Review this. If the plan includes changes you did not ask for, comment on the artifact:

```
Do not touch any HTML structure, only CSS and JS. Keep the footer unchanged.
```

The agent revises the plan before coding.

### Review the Task List artifact

After the plan is approved, the agent produces a **Task List** breaking the work into steps. Each step is executed and reviewable before the next begins (under Review-driven development policy).

### Review code diffs

For each file changed, the agent produces a **code diff** artifact. Review it and approve or reject. Under the recommended review policy, no file is modified without your explicit approval.

### Verify with the browser subagent

Ask the agent to open the site in the browser and take a screenshot to verify the changes:

```
Open the website in the browser and take a screenshot showing the new color scheme.
```

The agent will use the browser subagent to launch the local server, navigate to it, and return a screenshot artifact.

---

## Customization

### Rules

Rules are persistent instructions stored as Markdown files. They apply to all agent sessions in the workspace (workspace-level rules) or globally across all workspaces (global rules).

- Workspace rules: `.agents/rules/<rule-name>.md`
- Global rules: `~/.gemini/GEMINI.md` (Antigravity shares the global config path with Gemini CLI)

Example rule file (`.agents/rules/code-style.md`):

```markdown
# Code style

- Follow PEP 8 for all Python files.
- Add a docstring to every function.
- Use f-strings, not .format() or % formatting.
```

### Workflows

Workflows are repeatable multi-step procedures that can be triggered with a slash command (e.g., `/generate-unit-tests`). Store them in `.agents/workflows/<name>.md`.

### Skills

Skills are modular instruction sets for specific capabilities. A skill has a `SKILL.md` file with metadata and instructions, plus optional scripts, references, and assets.

- Workspace skills: `<workspace>/.agents/skills/<skill-name>/`
- Global skills: `~/.gemini/antigravity/skills/<skill-name>/`

### Model selection

The Agent Manager includes a model selection dropdown. At the last full verification (2026-05-06), Gemini 3 Pro was available with limited quota in the preview tier. Model availability and quota allocations change as the product evolves — check the dropdown and the [official docs](https://antigravity.google/docs) for what is currently offered.

---

## Limits and Gotchas

- **Preview software.** Antigravity is in preview and targeted at personal Gmail accounts. Features, UI, and configuration paths may change without notice. The "high drift risk" label on this page is intentional.
- **Requires Chrome for browser tasks.** The browser subagent relies on the Antigravity Chrome extension. Safari, Firefox, and other browsers are not supported for this feature.
- **Review-driven development adds friction, but that is appropriate.** The agent-driven policy (no review prompts) moves faster but applies all changes without your review. Use it only on disposable code or when you fully understand what the agent is doing.
- **Antigravity and Gemini CLI share config paths.** The global GEMINI.md and `~/.gemini/` directory are shared. Rules or settings written by one tool may affect the other.
- **Free quota is limited.** At last verification, the preview offered a free quota for Gemini 3 Pro. Complex tasks that require many model calls will exhaust it quickly. Quota amounts and plan structure are subject to change — verify at [antigravity.google](https://antigravity.google/).
- **The `agy` CLI tool is optional but useful.** Installing it during setup lets you interact with Antigravity from a terminal without opening the GUI. Its commands are documented at [antigravity.google/docs](https://antigravity.google/docs).
- **Undo support exists.** You can undo changes up to a checkpoint using the **Undo changes up to this point** option on artifacts. This is useful when an agent run produces unsatisfactory results.

---

## Confirmed by Docs vs. Practical Inference

| Claim | Status |
|-------|--------|
| Download at antigravity.google/download | Confirmed by [codelab](https://codelabs.developers.google.com/getting-started-google-antigravity) |
| Personal Gmail account required | Confirmed by codelab |
| Chrome browser required for browser subagent | Confirmed by codelab |
| Setup wizard with policy options (Secure, Review-driven, Agent-driven, Custom) | Confirmed by codelab |
| Agent Manager and Editor as dual primary windows | Confirmed by codelab |
| Planning vs. Fast mode | Confirmed by codelab |
| Artifact types (Task List, Implementation Plan, Walkthrough, code diffs, screenshots) | Confirmed by codelab |
| Rules in `.agents/rules/`, workflows in `.agents/workflows/` | Confirmed by codelab |
| Shared `~/.gemini/GEMINI.md` with Gemini CLI | Confirmed by codelab |
| Gemini 3 Pro available with limited quota | Confirmed by codelab as of 2026-05-06; model lineup and quotas change quickly — re-verify before relying on this |
| Undo functionality on artifacts | Confirmed by codelab |
| Linux support available | Confirmed by codelab ("Mac, Windows, and specific Linux distributions") |

---

## Cost and Rate-Limit Notes

At this page's last full verification, Antigravity was free to use during preview with a personal Gmail account and a provided quota for Gemini 3 Pro. Quota amounts, plan tiers, and billing details have been changing as the product evolves — check [antigravity.google](https://antigravity.google/) for current quota and pricing information rather than relying on this snapshot. If you exhaust the free quota during a session, the agent will be unable to continue until quota resets or you configure a different authentication method.

---

## Where to Go Next

- [Google Antigravity codelab](https://codelabs.developers.google.com/getting-started-google-antigravity) — the canonical, up-to-date hands-on tutorial
- [Antigravity documentation](https://antigravity.google/docs) — reference for rules, workflows, skills, and the `agy` CLI
- [Gemini CLI](gemini-cli.md) — a terminal-based agent if you prefer working outside an IDE
- [Google AI Studio](ai-studio.md) — for API-level access to the Gemini models that power Antigravity
