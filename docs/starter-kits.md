# Starter kits

> **Last verified:** 2026-05-06 · **Drift risk:** low–medium

The repository ships nine **starter kits** under [`starter-kits/`](https://github.com/rkalani1/agents-automations/tree/main/starter-kits) on GitHub. Each kit is a copy-pastable project that gives you a working starting point for one platform or pattern.

## What every kit contains

| File | Purpose |
|---|---|
| `README.md` | What the kit is, who it's for, how to use it. |
| `AGENT_SPEC.md` | A filled-in agent spec following the [Agent spec template](template-library/agent-spec.md). |
| `PROMPT.md` | The system / instructions prompt used by the agent. |
| `TOOL_ALLOWLIST.md` | The least-privilege list of tools/connectors the agent may use. |
| `EVALS.jsonl` | Golden eval cases the agent must pass. |
| `RED_TEAM_CASES.jsonl` | Adversarial cases the agent must refuse or handle safely. |
| `LAUNCH_CHECKLIST.md` | Pre-launch checklist tailored to this kit's risk profile. |
| `INCIDENT_RESPONSE.md` | What to do when something goes wrong. |
| Optional inert example script | Gated behind `OPERATOR_APPROVED_TO_RUN=1` so it never runs by accident. |

## Kits

| Kit | Best for |
|---|---|
| [`universal-agent-spec/`](https://github.com/rkalani1/agents-automations/tree/main/starter-kits/universal-agent-spec) | A vendor-neutral baseline. Copy this when starting any new agent. |
| [`claude-code-agent/`](https://github.com/rkalani1/agents-automations/tree/main/starter-kits/claude-code-agent) | A repo-aware coding/refactor agent run in [Claude Code](platforms/claude-code.md). |
| [`codex-agent/`](https://github.com/rkalani1/agents-automations/tree/main/starter-kits/codex-agent) | A repo-aware coding agent run in [OpenAI Codex CLI](platforms/codex.md). |
| [`gemini-antigravity-agent/`](https://github.com/rkalani1/agents-automations/tree/main/starter-kits/gemini-antigravity-agent) | A project-scoped agent for [Google Antigravity](platforms/antigravity.md). |
| [`openai-agents-sdk-python/`](https://github.com/rkalani1/agents-automations/tree/main/starter-kits/openai-agents-sdk-python) | A Python service that uses the [OpenAI Agents SDK](platforms/openai-api.md) with one tool. |
| [`openai-agents-sdk-typescript/`](https://github.com/rkalani1/agents-automations/tree/main/starter-kits/openai-agents-sdk-typescript) | The same shape, in TypeScript. |
| [`mcp-server-python/`](https://github.com/rkalani1/agents-automations/tree/main/starter-kits/mcp-server-python) | A minimal MCP server using the official [Python SDK](https://github.com/modelcontextprotocol/python-sdk). |
| [`mcp-server-typescript/`](https://github.com/rkalani1/agents-automations/tree/main/starter-kits/mcp-server-typescript) | A minimal MCP server using the official [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk). |
| [`local-script-agent/`](https://github.com/rkalani1/agents-automations/tree/main/starter-kits/local-script-agent) | A local Python script agent with manual-only scheduler examples. |

## How to use a kit

1. Browse the kit folder on GitHub.
2. Copy the files you need into your own repo (or fork this one).
3. Read `AGENT_SPEC.md` and edit it to fit your job statement.
4. Trim `TOOL_ALLOWLIST.md` to least-privilege.
5. Run the agent **manually** at least 3 times before considering any automation.
6. Walk through `LAUNCH_CHECKLIST.md` before exposing the agent to anyone else.

## Why scripts are inert by default

Per [ADR 0003](decision-records/0003-no-default-schedulers.md), every example script in a kit:

- requires `OPERATOR_APPROVED_TO_RUN=1` (or an equivalent explicit env var) to do anything,
- prints what it *would* do before doing it,
- and writes a manual-only example for any cron / launchd / Task Scheduler entry — never an enabled one.

This keeps "I copy-pasted a tutorial" from turning into "I have a recurring agent quietly running against my accounts."
