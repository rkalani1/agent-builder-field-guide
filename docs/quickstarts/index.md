# Quickstarts

> **Last verified:** 2026-05-06 · **Drift risk:** medium

This section contains six hands-on quickstarts for building your first AI agents. Each one is scoped to a single, well-defined use case and is designed to be completable in 30 to 60 minutes by someone comfortable with a terminal and a text editor but not necessarily familiar with agent frameworks.

The quickstarts are vendor-neutral where possible. Where a specific tool is recommended, the reasoning is given explicitly, and alternatives are noted.

---

## The six quickstarts

### 1. [First Read-Only Agent](./first-read-only-agent.md)
**Use case:** Summarize a folder of Markdown notes into a one-pager.
**Estimated time:** 20–35 minutes.
Build a project-scoped agent in ChatGPT Projects that reads a small corpus of files and produces a structured summary. No file writes, no external requests. A safe first step that lets you test system instructions and output constraints before touching any live data.

### 2. [First File-Editing Agent](./first-file-editing-agent.md)
**Use case:** Rewrite a folder of Markdown notes for clarity, in-place.
**Estimated time:** 30–45 minutes.
Use Claude Code to run a clarity-rewrite pass over a tiny test repo. You will practice running in approval mode first, writing a `CLAUDE.md` constraint file, and committing changes to a branch rather than directly to `main`. This is the first quickstart that touches your filesystem.

### 3. [First Coding Agent](./first-coding-agent.md)
**Use case:** Add tests to a small Python module.
**Estimated time:** 30–50 minutes.
Use Codex CLI to generate a pytest suite for a 30-line calculator module. The agent is constrained from modifying the implementation. You will verify coverage thresholds and review the generated tests before accepting any changes.

### 4. [First Browser Agent](./first-browser-agent.md)
**Use case:** Open a public weather page and extract the 7-day forecast into JSON.
**Estimated time:** 40–60 minutes.
Use the open-source `browser-use` Python library in a sandboxed environment to extract structured data from a public website. This quickstart carries a medium-high drift risk due to browser automation fragility; read the safety boundaries carefully before running it.

### 5. [First MCP Agent](./first-mcp-agent.md)
**Use case:** Let Claude Desktop summarize files in a specific local folder, with no other access.
**Estimated time:** 25–40 minutes.
Configure Claude Desktop to use the official MCP filesystem server, scoped to a single sandbox directory. This introduces the Model Context Protocol pattern, which underpins a large and growing class of local-tool integrations.

### 6. [First Grok task](./first-grok-task.md)
**Use case:** Use the xAI API to extract structured fields from a synthetic abstract.
**Estimated time:** 30–45 minutes.
Get an xAI Console key, set `XAI_MODEL`, and call the API with a structured-output schema. Distinguishes consumer Grok, Grok on X, and the xAI API — only the API exposes tool calling and structured outputs.

---

## Suggested reading order

If you are new to agent building, read the quickstarts in the order listed above. The sequence moves from lowest risk (read-only, cloud-hosted) to higher risk (filesystem writes, browser automation, local MCP server). Each quickstart builds on concepts introduced in earlier ones.

If you already have experience with chat-based AI tools and want to jump directly to local tool use, start with [First File-Editing Agent](./first-file-editing-agent.md) and then move to [First MCP Agent](./first-mcp-agent.md).

If your primary interest is browser automation, read [First Read-Only Agent](./first-read-only-agent.md) first to get a feel for prompt constraints and safety boundaries, then proceed to [First Browser Agent](./first-browser-agent.md).

---

## Before you start

Each quickstart assumes you have:

- A working internet connection and an account on at least one of: OpenAI, Anthropic, or Google AI Studio.
- A terminal (macOS Terminal, Windows Terminal, or Linux shell).
- Python 3.10 or later installed (required for quickstarts 3, 4, and 5).
- Node.js 18 or later (required for quickstart 5, the MCP quickstart).

API keys and credentials are always stored as environment variables. None of the quickstarts ask you to hard-code a key into a file.

---

Where to go next: [Starter Kits](../starter-kits.md)
