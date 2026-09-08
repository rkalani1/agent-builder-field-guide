# OpenAI Codex CLI

> **Last verified:** 2026-07-18 · **Drift risk:** high — this tool is rapidly evolving; verify every detail against the current docs before relying on it
> **Official sources:** [Codex CLI — developers.openai.com](https://developers.openai.com/codex/cli), [openai/codex on GitHub](https://github.com/openai/codex)

---

## What this surface is

Codex CLI is an open-source, terminal-based coding agent that runs on your local machine. You point it at a code repository, give it a natural-language task, and it reads your files, proposes or applies edits, and optionally executes shell commands — all from an interactive terminal UI (TUI). It is built in Rust for speed and is available on macOS, Linux, and Windows (natively in PowerShell or via WSL2 for a Linux-native environment).

Codex CLI is separate from Codex Web, OpenAI's cloud-based coding agent at chatgpt.com/codex (see below). The CLI runs locally with access to your filesystem. Codex Web runs in a remote environment.

This is the right tool when you want an AI coding assistant that operates directly inside your repository, respects your local toolchain, and does not require a browser.

---

## Who it is best for

- Developers who prefer working in the terminal and want AI assistance without leaving their shell.
- Teams exploring AI-assisted code review, test generation, or refactoring in an existing codebase.
- Anyone who wants to understand what an agent will do before it does it, using approval modes.
- Builders evaluating local coding agent patterns before committing to a cloud-based workflow.

---

## Prerequisites

- Node.js 18 or newer (for `npm`-based installation). Alternatively, download a platform binary directly from the [GitHub releases page](https://github.com/openai/codex/releases).
- Either a ChatGPT account with Codex access (included in Plus, Pro, Business, Edu, and Enterprise plans) or an OpenAI API key.
- A code repository or project directory to work in. Codex operates in the current working directory.
- macOS, Linux, or Windows (PowerShell with Windows Sandbox, or WSL2). For Windows-specific setup, see the Windows setup guide linked from the [official docs](https://developers.openai.com/codex/cli).

---

## Step-by-step setup

### 1. Install

```bash
npm i -g @openai/codex
```

To install the latest version explicitly:

```bash
npm i -g @openai/codex@latest
```

Alternatively, download a platform-specific binary from the [GitHub releases page](https://github.com/openai/codex/releases) if you prefer not to use npm.

Verify the installation:

```bash
codex --version
```

### 2. Authenticate

Run Codex for the first time:

```bash
codex
```

On first launch, you will be prompted to sign in. Two options:

**Option A — ChatGPT account (browser OAuth):**
Codex opens a browser window for the ChatGPT OAuth flow. Log in with your ChatGPT account. Usage is included in your plan quota.

**Option B — API key:**
```bash
printenv OPENAI_API_KEY | codex login --with-api-key
```
Or use device code flow if you are on a headless machine:
```bash
codex login --device-auth
```

To check your current authentication status:
```bash
codex login status
```
This exits with code `0` when credentials are present, which is useful in automation scripts per the [reference docs](https://developers.openai.com/codex/cli/reference).

### 3. Navigate to a repository

```bash
cd /path/to/your/project
codex
```

Codex opens its interactive TUI. The agent can see all files in the current directory tree. It does not access files above the working directory without explicit permission.

---

## Approval modes

Approval modes control how much autonomy Codex has before requiring your confirmation. Choose the mode that matches your risk tolerance for the current session. Per the [official docs](https://developers.openai.com/codex/cli):

| Mode | File reads | File writes | Shell commands | Best for |
|---|---|---|---|---|
| `read-only` | Automatic | Requires approval | Requires approval | Code review, exploring an unfamiliar codebase |
| `workspace-write` | Automatic | Automatic within working directory | Requires approval | Active development in a tracked repo |
| `danger-full-access` | Automatic | Automatic anywhere | Automatic | Sandboxed / containerized environments only |

To switch modes during a session, use the `/permissions` slash command inside the TUI and select the mode from the menu.

To set a default mode in your configuration file (`~/.codex/config.toml`):

```toml
sandbox_mode = "workspace-write"
```

The `danger-full-access` mode removes all approval prompts. Use it only in isolated environments (Docker containers, virtual machines, ephemeral CI containers) where unintended file system changes are acceptable or reversible.

---

## Working in a repo

Once the TUI is open, type your task in natural language. Codex will:

1. Read relevant files in the repository.
2. Plan the changes needed.
3. Propose or apply edits depending on the approval mode.
4. Execute shell commands (e.g., running tests) depending on the approval mode and whether you confirm.

You can also run Codex non-interactively using the `exec` subcommand for scripted workflows:

```bash
codex exec "Add a docstring to every public function in src/utils.py"
```

For complex tasks, break them into smaller steps and run Codex separately for each. One focused task per session is more reliable than one large compound instruction.

Codex reads an `AGENTS.md` file from the repository root (if present) and uses it as custom instructions for the agent. This is the standard way to give Codex persistent context about your project: conventions, banned patterns, testing commands, etc.

```markdown
# AGENTS.md
- Run `pytest` before proposing any changes to confirm the baseline passes.
- Use snake_case for all identifiers.
- Do not modify files in `vendor/`.
- When adding tests, place them in the `tests/` directory mirroring the source structure.
```

---

## Worked example: add a test file

**Setup:** You have a Python module `src/calculator.py` with an `add(a, b)` function and no tests yet.

**Step 1 — Navigate to the repository:**

```bash
cd /path/to/calculator-project
codex
```

**Step 2 — Set approval mode to `workspace-write`:**

In the TUI, run `/permissions` and select `workspace-write`. This allows Codex to write files automatically but requires your approval for shell commands.

**Step 3 — Give the task:**

```
Add a pytest test file for src/calculator.py. Cover add() with at least three cases: two integers, negative numbers, and zero. Place the test file at tests/test_calculator.py. Do not run the tests yet.
```

**Step 4 — Review the proposed file.**

Codex will show you the content it plans to write. In `workspace-write` mode, it applies the change after your confirmation. Review the output before accepting.

**Step 5 — Run the tests manually:**

Once you accept the file:

```bash
pytest tests/test_calculator.py -v
```

Verify the tests pass before committing.

**What to expect:** Codex reads `src/calculator.py`, infers the function signatures and behavior, and writes a test file with appropriate imports and test cases. If your `AGENTS.md` specifies a testing convention, it follows that. If it does not find the source file (e.g., wrong path), it will tell you and ask for clarification.

---

## Codex Web and other Codex surfaces

Codex also runs as **Codex Web**, OpenAI's cloud-based coding agent at [chatgpt.com/codex](https://chatgpt.com/codex). This is a distinct product from the CLI: it runs tasks in a remote environment managed by OpenAI rather than on your local machine. You can launch a cloud task and apply the resulting diff from within the CLI using the **Codex Cloud Tasks** feature. Per the [openai/codex README](https://github.com/openai/codex), there is also a Codex desktop App (launched with `codex app`) and an IDE extension as additional surfaces. For tasks that require a persistent local environment or access to private files, the CLI remains the appropriate tool. Codex Web and the other surfaces are evolving separately from the CLI.

---

## Limits and gotchas

- **This tool is rapidly evolving.** The CLI changelog shows frequent releases with breaking changes to configuration keys, approval policies, and TUI behavior. Always run `npm i -g @openai/codex@latest` before relying on a specific feature, and check the [changelog](https://developers.openai.com/codex/changelog) for your version.
- **`danger-full-access` has no safeguards.** Files can be deleted, overwritten, or moved without confirmation. Use only in disposable or containerized environments.
- **Codex operates in the current working directory.** It cannot access files above that directory by default. Run it from the repository root.
- **Large repositories slow down context gathering.** Codex reads files to build context. Repositories with very many files or very large files may produce slower or less accurate results.
- **Shell command execution depends on your local environment.** If Codex runs a test command and your virtualenv is not activated, it will fail. Ensure your environment is set up before starting a session.
- **The `AGENTS.md` file is optional but strongly recommended.** Without it, Codex makes assumptions about conventions that may not match your project.
- **Windows support:** Native PowerShell support is available but described as having a distinct setup path. Use WSL2 for full Linux compatibility if you encounter issues on Windows.

---

## Confirmed by docs vs. practical inference

| Claim | Source |
|---|---|
| Install command: `npm i -g @openai/codex` | [Confirmed — official docs](https://developers.openai.com/codex/cli) |
| Available on Plus, Pro, Business, Edu, Enterprise plans | [Confirmed — official docs](https://developers.openai.com/codex/cli) |
| Three sandbox modes (`read-only`, `workspace-write`, `danger-full-access`) | [Confirmed — reference docs](https://developers.openai.com/codex/cli/reference) |
| `codex login --with-api-key` reads from stdin | [Confirmed — reference docs](https://developers.openai.com/codex/cli/reference) |
| `codex login status` exits 0 when logged in | [Confirmed — reference docs](https://developers.openai.com/codex/cli/reference) |
| `AGENTS.md` used for custom instructions | [Confirmed — Codex AGENTS.md guide](https://developers.openai.com/codex/guides/agents-md) |
| One task per session is more reliable than compound instructions | **Practical inference** — consistent with documented best practices but not explicitly stated |
| Large repositories produce slower/less accurate results | **Practical inference** — follows from how context windows work; not documented specifically |

---

## Cost and rate-limit notes

When authenticated via ChatGPT account, Codex usage counts against your plan's Codex or premium request quota. When authenticated via API key, you are billed per token at standard API rates. Codex CLI can make many API calls per session (each file read, plan step, and edit involves model calls). Long sessions or large codebases accumulate costs faster than expected. For initial exploration, use `read-only` mode: this limits writes and commands while still letting you see what the agent plans to do.

---

## Where to go next in this guide

- For a cloud-based coding agent that operates on GitHub Issues and creates pull requests automatically, see [GitHub Copilot Coding Agent](copilot.md).
- For building multi-tool agents in Python with full control over the agent loop, see [OpenAI API and Agents SDK](openai-api.md).
- For scheduling API-based automation scripts, see [Local Scripts and Schedulers](local-scripts.md).
