# Gemini CLI

> **Last verified:** 2026-05-06 · **Drift risk:** medium · **Partially re-verified:** 2026-07-18
> **Official sources:** [google-gemini/gemini-cli on GitHub](https://github.com/google-gemini/gemini-cli), [Gemini CLI documentation](https://geminicli.com/docs/get-started/installation/), [Hands-on with Gemini CLI codelab](https://codelabs.developers.google.com/gemini-cli-hands-on)

---

## What This Surface Is

Gemini CLI is an open-source terminal agent from Google. It runs in your shell, authenticates with your Google account or a Gemini API key, and gives you an interactive AI agent that can read and modify files, run commands, and call external tools—all from a prompt.

Unlike the Gemini web app, Gemini CLI is not a browser interface. It operates in your existing terminal workflow, making it a direct comparison to Claude Code. The key difference is that Gemini CLI is open source under Apache 2.0, so you can read, fork, and extend the code. The repository is at [github.com/google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli).

Gemini CLI has built-in support for MCP (Model Context Protocol) servers, configurable via a JSON settings file, which means you can connect it to the same tool ecosystem as Claude Desktop and Claude Code.

---

## Who It Is Best For

- Developers who want a terminal-based AI agent and prefer Google's model family
- Anyone who wants an open-source codebase they can audit or modify
- Teams using Google Cloud who want Vertex AI authentication without browser-based OAuth
- Developers who want to run agents in Google Cloud Shell, where Gemini CLI comes pre-installed
- CI/CD workflows that need a Gemini-backed agent without managing a full API integration

---

## Prerequisites

- **Node.js 20 or later** (check with `node -v`)
- macOS, Linux, or Windows
- A personal Google account for free-tier auth, or a Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey) for higher rate limits or headless environments
- Optional: a Google Cloud project for Vertex AI authentication

---

## Step-by-Step Setup

### 1. Install Node.js 20+

If `node -v` returns a version below 20, install a newer version via [nodejs.org](https://nodejs.org) or a version manager like `nvm`:

```bash
nvm install 20
nvm use 20
```

### 2. Install Gemini CLI

The standard install method per the [official documentation](https://geminicli.com/docs/get-started/installation/):

```bash
npm install -g @google/gemini-cli
```

Verify the installation:

```bash
gemini --version
```

Alternative methods:

```bash
# Homebrew (macOS/Linux)
brew install gemini-cli

# Run without installing (temporary)
npx @google/gemini-cli
```

Note: ripgrep has been bundled with Gemini CLI since v0.40.0 (2026-04-28, per the official changelog), so the npm postinstall no longer downloads a ripgrep binary — a step that strict corporate proxies used to block. If you are installing an older version and see a timeout during `npm install`, set your proxy environment variables before running npm, or use the Homebrew method. See the [GitHub issues tracker](https://github.com/google-gemini/gemini-cli/issues) for current workarounds.

### 3. First-run authentication

Start the CLI:

```bash
gemini
```

On first launch, you will be prompted to choose a theme and an authentication method. The two primary options:

**Option A: Sign in with Google account (recommended for personal use)**

Select **Sign in with Google** when prompted. The CLI opens a browser tab for Google OAuth. Authenticate with your Google account, accept the terms, and return to the terminal. The free tier via a personal Google account allows approximately 60 requests per minute and 1,000 requests per day (per the [official README](https://github.com/google-gemini/gemini-cli); limits can change, so re-check there for current values).

Credentials are stored locally in `~/.gemini/` and you will not need to authenticate again on subsequent runs.

**Option B: Gemini API key (for CI/CD or higher rate limits)**

Get an API key from [aistudio.google.com](https://aistudio.google.com). Set it as an environment variable:

```bash
export GEMINI_API_KEY=your_api_key_here
gemini
```

To persist across sessions, add the export to your shell profile (`~/.bashrc`, `~/.zshrc`, etc.).

**Option C: Vertex AI (enterprise)**

```bash
export GOOGLE_CLOUD_PROJECT=your-project-id
export GOOGLE_CLOUD_LOCATION=us-central1
export GOOGLE_GENAI_USE_VERTEXAI=true
gcloud auth application-default login
gemini
```

### 4. Configure settings.json (optional)

Gemini CLI persists its configuration in `~/.gemini/settings.json`. You can set the theme, default model, MCP server connections, and more. The file is created on first run. Edit it with any text editor:

```bash
nano ~/.gemini/settings.json
```

---

## Building Your First Useful Agent: Refactor a File and Run Tests

This worked example takes a Python file with callback-based async code and refactors it to use async/await, then runs the test suite to confirm nothing broke.

### Project setup

Assume you have a repository at `~/projects/myapp` with:

- `src/fetcher.py`: the file to refactor
- `tests/test_fetcher.py`: existing tests
- `requirements.txt` with the project dependencies

### Start the CLI in your project

```bash
cd ~/projects/myapp
gemini
```

### Understand the project

```
What does this project do? Describe the structure of src/.
```

Gemini CLI reads the files it needs and returns a description.

### Refactor the file

```
Refactor src/fetcher.py to use async/await instead of callbacks.
Keep the function signatures compatible with the existing tests.
Show me the diff before applying any changes.
```

Gemini CLI will:

1. Read `src/fetcher.py`
2. Propose a rewritten version
3. Show a diff
4. Wait for your approval before writing

Approve the change:

```
Apply the changes.
```

### Run the tests

```
Run the tests in tests/test_fetcher.py and report any failures.
```

Gemini CLI executes the test command in your shell and returns the output. If tests fail:

```
Fix the test failures and re-run.
```

### Commit

```
Commit the changes with a message that explains the refactor.
```

---

## Customization

### GEMINI.md

Gemini CLI reads a `GEMINI.md` file from the workspace root at the start of each session. Use it to encode project-specific conventions:

```markdown
# Project conventions

- Python 3.11. Use pytest for tests.
- Run `ruff check .` before committing.
- Async code uses asyncio; do not introduce threading.
- The main entry point is src/main.py.
```

Global conventions can go in `~/.gemini/GEMINI.md` and apply across all workspaces.

### MCP server integration

Gemini CLI supports MCP servers via the `settings.json` file. Add an `mcpServers` block:

```json
{
  "mcpServers": {
    "github": {
      "httpUrl": "https://api.githubcopilot.com/mcp/",
      "trust": true,
      "headers": {
        "Authorization": "Bearer ${GITHUB_PAT}"
      }
    }
  }
}
```

Caution: `"trust": true` bypasses all tool-call confirmations for that server (the default is `false`). Per the [official MCP server docs](https://github.com/google-gemini/gemini-cli/blob/main/docs/tools/mcp-server.md), use it only for servers you completely control. For a remote-hosted server like this one, prefer `"trust": false` so each tool call — including write-capable GitHub operations authenticated with your PAT — requires confirmation.

Secrets like `GITHUB_PAT` can be stored in `~/.gemini/.env` and Gemini CLI will load them automatically.

### Custom commands and skills

Beyond `GEMINI.md` (the documented home for rules-style persistent instructions), Gemini CLI supports two structured extension points per the official docs:

- **Custom commands**: reusable slash commands defined as TOML files, stored in `~/.gemini/commands/` (user scope) or `<project>/.gemini/commands/` (project scope). See the [custom commands docs](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/custom-commands.md).
- **Skills**: modular instruction sets stored in `.gemini/skills/`, with an `.agents/skills/` alias that takes precedence within a tier. See the [skills docs](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/skills.md).

Note: `.agents/rules/` and `.agents/workflows/` are [Antigravity](antigravity.md) conventions — Gemini CLI does not read those directories.

---

## Limits and Gotchas

- **Free tier rate limits apply with Google account auth.** Approximately 60 requests per minute and 1,000 per day per the [official README](https://github.com/google-gemini/gemini-cli). Use an API key or Vertex AI for higher limits.
- **Node.js 20+ is required.** Older Node versions will fail. This is a common source of install failures for developers on older LTS versions.
- **Not pre-installed outside Google Cloud Shell and Cloud Workstations.** You must install it manually on your own machine.
- **Corporate network proxy issues (older versions only).** Before v0.40.0 (2026-04-28), the npm postinstall downloaded a ripgrep binary from GitHub, which strict proxy environments could block. Since v0.40.0, ripgrep is bundled with the CLI, so this gotcha applies only when installing older versions.
- **Open source means breaking changes can ship.** Gemini CLI is under active development. Check the [releases page](https://github.com/google-gemini/gemini-cli/releases) before updating in production workflows. Consider pinning a version in CI.
- **Authentication token is stored locally.** The Google OAuth token is stored in `~/.gemini/`. On shared machines, treat this directory as sensitive.
- **MCP configuration format may change.** MCP server support and the `mcpServers` settings format are documented in the [official MCP server docs](https://geminicli.com/docs/tools/mcp-server/), but the CLI is under active development. Verify against the current docs before deploying MCP integrations, and treat `trust: true` as an opt-out of every tool-call confirmation for that server.

---

## Confirmed by Docs vs. Practical Inference

| Claim | Status |
|-------|--------|
| Install command: `npm install -g @google/gemini-cli` | Confirmed by [official docs](https://geminicli.com/docs/get-started/installation/) and [codelab](https://codelabs.developers.google.com/gemini-cli-hands-on) |
| Node.js 20+ required | Confirmed by official documentation |
| Google account OAuth on first run | Confirmed by [codelab](https://codelabs.developers.google.com/gemini-cli-hands-on) |
| API key via `GEMINI_API_KEY` env variable | Confirmed by codelab and community documentation |
| Vertex AI via env variables + ADC | Confirmed by [Warp docs](https://docs.warp.dev/guides/external-tools/how-to-set-up-gemini-cli/) and community documentation |
| ~60 RPM / 1000 RPD free tier limit | Confirmed by [official README](https://github.com/google-gemini/gemini-cli) (re-checked 2026-07-18) |
| GEMINI.md project context file | Confirmed by [official docs](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/gemini-md.md) |
| MCP server support via settings.json | Confirmed by [official MCP server docs](https://geminicli.com/docs/tools/mcp-server/) (`trust` defaults to `false`) |
| Custom commands (TOML in `~/.gemini/commands/` or `<project>/.gemini/commands/`) and skills (`.gemini/skills/`, alias `.agents/skills/`) | Confirmed by official docs ([custom commands](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/custom-commands.md), [skills](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/skills.md)) |
| ripgrep bundled since v0.40.0 (no postinstall download) | Confirmed by [official changelog](https://github.com/google-gemini/gemini-cli/blob/main/docs/changelogs/index.md) (v0.40.0, 2026-04-28) |
| Settings stored in `~/.gemini/settings.json` | Confirmed by codelab |
| Homebrew install method | Confirmed by [official installation docs](https://geminicli.com/docs/get-started/installation/) |

---

## Cost and Rate-Limit Notes

Gemini CLI is open source and free to install. Usage costs depend on your authentication method. With a personal Google account, you get a free daily quota. With an API key from AI Studio, you are billed per token via the Gemini API pricing tier you selected—the free API tier has lower rate limits than paid tiers. With Vertex AI, costs are billed through your Google Cloud project. Check [ai.google.dev/pricing](https://ai.google.dev/pricing) and [cloud.google.com/vertex-ai/pricing](https://cloud.google.com/vertex-ai/pricing) for current rates.

---

## Where to Go Next

- [Google AI Studio](ai-studio.md) — to get an API key and test prompts before committing to the CLI
- [Google Antigravity](antigravity.md) — for an IDE-based agent workflow backed by Gemini
- [Claude Code](claude-code.md) — for the Anthropic equivalent terminal agent
- [Gemini CLI releases](https://github.com/google-gemini/gemini-cli/releases) — to track changes before upgrading
