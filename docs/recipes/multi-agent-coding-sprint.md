# Multi-agent coding sprint coordinator

> **Last verified:** 2026-05-06 · **Drift risk:** medium

## Goal

This recipe implements a three-agent coding workflow using the [OpenAI Agents SDK](https://github.com/openai/openai-agents-python) handoff mechanism: a Planner agent decomposes a coding task into subtasks; an Executor agent implements each subtask in a local sandbox repository; and a Reviewer agent checks the diff for correctness, style, and security issues. All work is confined to a local sandbox repository — no code is pushed to any remote. The user triggers the sprint manually and reviews the final diff before merging anything.

## Recommended platform(s)

Primary: [OpenAI Agents SDK](https://github.com/openai/openai-agents-python) with Python-based file and subprocess tools.

Alternates: Anthropic Claude multi-agent setup using tool-use chaining; LangGraph for more complex stateful workflows.

## Why this platform

The OpenAI Agents SDK's native handoff feature lets you pass control between agents with a typed context object, which maps naturally to the Planner → Executor → Reviewer pipeline. The SDK's tracing captures every handoff and tool call, giving a full audit trail of what each agent did in the sandbox. Per [OpenAI Agents SDK documentation](https://github.com/openai/openai-agents-python), handoffs are implemented as a special tool call the SDK resolves automatically, keeping the control flow explicit.

## Required subscription / account / API

- OpenAI API key and `OPENAI_MODEL` set to a current model ID. Use stronger current models for Planner/Reviewer roles and cheaper current models for simple Executor roles.
- A local git repository to use as the sandbox (never the production repository).

## Required tools / connectors

- `read_file(path: str) -> str` — read a file from the sandbox repo.
- `write_file(path: str, content: str) -> str` — write or overwrite a file in the sandbox repo.
- `run_tests(test_command: str) -> dict` — runs a test command (e.g., `pytest`) inside the sandbox and returns stdout, stderr, and exit code.
- `git_diff() -> str` — returns the current `git diff` of the sandbox repo.

All tools operate within a single sandbox directory; path traversal outside that directory is blocked.

## Permission model

| Permission | Scope | Rationale |
|---|---|---|
| File read | Sandbox repo directory only | Planner and Reviewer need to read existing code. |
| File write | Sandbox repo directory only | Executor writes new or modified files. |
| Shell execution | `pytest` / `npm test` in sandbox only | Reviewer needs test results. |
| Network | OpenAI API only | No git push, no remote access. |
| Env vars | `OPENAI_API_KEY` only | Never logged or printed. |

The sandbox repo must be a separate directory from your production codebase. Before the run, commit all changes so the `git diff` is clean.

## Filled agent spec

| Field | Value |
|---|---|
| Job statement | Decompose a coding task into subtasks (Planner), implement each subtask (Executor), then review the resulting diff for correctness and safety (Reviewer). |
| Inputs | Natural-language task description; path to sandbox repo. |
| Outputs | Modified files in the sandbox repo; a Reviewer report summarizing findings. |
| Tools | `read_file`, `write_file`, `run_tests`, `git_diff` |
| Stop conditions | All subtasks implemented; tests pass; Reviewer report produced. |
| Error handling | If a subtask fails (test failure or write error), the Executor reports the failure to the Reviewer; the sprint halts. |
| HITL gates | (1) User approves the Planner's subtask list before Executor runs. (2) User reviews the Reviewer report before committing or merging anything. |
| Owner | The engineer who triggered the sprint. |
| Review cadence | Re-verify the handoff API after each Agents SDK minor release. |

## Setup steps

1. Set up a sandbox repository:
   ```
   git clone https://github.com/your-org/your-sandbox-repo /tmp/sandbox_repo
   cd /tmp/sandbox_repo
   ```
2. Set up the Python environment in your working directory:
   ```
   python -m venv .venv
   source .venv/bin/activate
   pip install openai-agents python-dotenv
   ```
3. Add `OPENAI_API_KEY=<your-key>` and `OPENAI_MODEL=REPLACE_WITH_CURRENT_MODEL` to `.env`. Add `.env` to `.gitignore`.
4. Save `coding_sprint.py` (see Prompt / instructions below).
5. Run:
   ```
   python coding_sprint.py \
     --task "Add input validation to the user registration function in src/auth.py" \
     --sandbox /tmp/sandbox_repo
   ```
6. Review the Planner output and confirm you want to proceed (HITL gate 1).
7. After the sprint, read the Reviewer report and inspect `git diff` in the sandbox repo.
8. If satisfied, manually cherry-pick or copy changes to your production repo.

## Prompt / instructions

```python
# coding_sprint.py
import argparse, os, shlex, subprocess
from pathlib import Path
from dotenv import load_dotenv
from agents import Agent, Runner, function_tool, handoff

load_dotenv()

SANDBOX = ""  # set at runtime

@function_tool
def read_file(path: str) -> str:
    full = Path(SANDBOX) / path
    if not full.resolve().is_relative_to(Path(SANDBOX).resolve()):
        return "ERROR: path outside sandbox"
    try:
        return full.read_text(encoding="utf-8")
    except Exception as e:
        return f"ERROR: {e}"

@function_tool
def write_file(path: str, content: str) -> str:
    full = Path(SANDBOX) / path
    if not full.resolve().is_relative_to(Path(SANDBOX).resolve()):
        return "ERROR: path outside sandbox"
    full.parent.mkdir(parents=True, exist_ok=True)
    full.write_text(content, encoding="utf-8")
    return f"Written: {path}"

@function_tool
def run_tests(test_command: str) -> dict:
    try:
        args = shlex.split(test_command)
    except ValueError as e:
        return {"stdout": "", "stderr": f"Error parsing command: {e}", "exit_code": 1}

    # Exact-command allowlist: only `pytest ...` or `npm test` — any other
    # npm subcommand (install, run, exec, ...) is rejected.
    ALLOWED_PREFIXES = (["pytest"], ["npm", "test"])
    if not any(args[: len(prefix)] == prefix for prefix in ALLOWED_PREFIXES):
        return {"stdout": "", "stderr": "Command not allowed. Only 'pytest' or 'npm test' are permitted.", "exit_code": 1}

    result = subprocess.run(
        args, shell=False, cwd=SANDBOX,
        capture_output=True, text=True, timeout=60
    )
    return {"stdout": result.stdout[-2000:], "stderr": result.stderr[-1000:],
            "exit_code": result.returncode}

@function_tool
def git_diff() -> str:
    result = subprocess.run(
        ["git", "diff"], cwd=SANDBOX, capture_output=True, text=True
    )
    return result.stdout[:4000]

reviewer_agent = Agent(
    name="Reviewer",
    model=os.environ["OPENAI_MODEL"],
    instructions="""
    You are a code reviewer. You will receive the git diff of a sandbox repository.
    Review it for:
    1. Correctness: does the change implement the stated task?
    2. Safety: any injection risks, hardcoded secrets, or unchecked inputs?
    3. Style: obvious style violations?
    4. Test results: do tests pass?
    Call git_diff, then call run_tests with 'pytest' (or 'npm test' if a Node project).
    Produce a Markdown review report with: Summary, Issues (critical/warning/info),
    and a Go/No-go recommendation.
    """,
    tools=[git_diff, run_tests],
)

executor_agent = Agent(
    name="Executor",
    model=os.environ["OPENAI_MODEL"],
    instructions="""
    You are a code executor. You will receive a list of subtasks from the Planner.
    For each subtask:
    1. Read relevant files with read_file.
    2. Implement the change with write_file.
    3. After all subtasks, hand off to Reviewer.
    """,
    tools=[read_file, write_file],
    handoffs=[handoff(reviewer_agent)],
)

planner_agent = Agent(
    name="Planner",
    model=os.environ["OPENAI_MODEL"],
    instructions="""
    You are a coding sprint planner. Given a task description and a sandbox repo path,
    decompose the task into 3-7 concrete subtasks, each referencing specific file(s).
    Output the subtask list as a numbered Markdown list.
    Then hand off to the Executor with the full subtask list in the handoff message.
    """,
    tools=[read_file],
    handoffs=[handoff(executor_agent)],
)

def main():
    global SANDBOX
    parser = argparse.ArgumentParser()
    parser.add_argument("--task", required=True)
    parser.add_argument("--sandbox", required=True)
    args = parser.parse_args()
    SANDBOX = args.sandbox

    result = Runner.run_sync(
        planner_agent,
        f"Task: {args.task}\nSandbox: {args.sandbox}",
        max_turns=20,
    )
    print(result.final_output)

if __name__ == "__main__":
    main()
```

## Example input

Task: "Add input validation to the user registration function in `src/auth.py` to reject emails longer than 254 characters and passwords shorter than 8 characters."

Sandbox: `/tmp/sandbox_repo` (a Python project with `src/auth.py` and a `tests/` folder).

## Expected output

1. Planner outputs a subtask list: (1) Read `src/auth.py`; (2) Add email-length check; (3) Add password-length check; (4) Update docstring; (5) Confirm tests pass.
2. Executor implements changes in `src/auth.py`.
3. Reviewer produces a Markdown report: summary of changes, no critical issues, tests pass, recommendation: Go.

## Eval cases

1. All subtasks succeed and tests pass — Reviewer reports "Go."
2. Executor writes a file that breaks an existing test — Reviewer reports the test failure and recommends "No-go."
3. Planner tries to reference a file outside the sandbox — `read_file` returns "ERROR: path outside sandbox."
4. Task is ambiguous — Planner asks one clarifying question before decomposing (single clarification only).
5. Reviewer detects a hardcoded string that looks like a secret — report flags it as "Critical: possible secret."
6. Sandbox has no test suite — Reviewer notes "No tests found" and marks test status as "Unknown."

## Red-team probes

1. Task description containing `; rm -rf /tmp/sandbox_repo` — the task string is passed as a prompt argument, not a shell command; `write_file` and `run_tests` use explicit argument validation.
2. Executor attempts to write outside the sandbox (e.g., `../../etc/passwd`) — path-traversal check in `write_file` blocks the write and returns an error.
3. Reviewer tries to call `write_file` — only Executor has `write_file` in its tool list; Reviewer cannot call it.

## Failure modes

- Handoff loop: two agents hand off to each other indefinitely. Mitigation: the SDK enforces a max-turns limit; set it explicitly (e.g., `max_turns=20`).
- Executor overwrites the wrong file: path confusion when multiple files share similar names. Mitigation: Planner specifies full relative paths in the subtask list.
- Test command injection: the Reviewer calls `run_tests` with a malicious command string. Mitigation: allowlist the test command (e.g., only `pytest` or `npm test`) in the tool implementation.
- Context fragmentation across handoffs: the Executor loses the Planner's subtask context. Mitigation: the Planner includes the full subtask list in the handoff message.
- Sandbox pollution: failed runs leave partial changes in the sandbox. Mitigation: run `git stash` or `git checkout -- .` before each sprint to start from a clean state.

## Cost / usage controls

- Three-agent sprints can consume a meaningful number of tokens because each role reads context and writes output. Estimate cost from selected model pricing and task complexity before running broad sprints.
- Use a cheaper/current small model for the Executor on simple, well-specified subtasks, and a stronger current model for Planner/Reviewer roles.
- Set `max_turns=20` to prevent runaway loops.

## Safe launch checklist

- [ ] Sandbox is a separate repo from production; never the production codebase.
- [ ] Sandbox is clean (`git status` shows no uncommitted changes) before the run.
- [ ] Path-traversal checks are present in `read_file` and `write_file`.
- [ ] Test command allowlist is implemented in `run_tests`.
- [ ] User reviews the Planner's subtask list before confirming the Executor run (HITL gate 1).
- [ ] User reviews the Reviewer report before any changes are committed to production (HITL gate 2).
- [ ] `max_turns` is set on the Runner call.

## Maintenance cadence

Re-verify when the OpenAI Agents SDK releases a new version — the `handoff` API and `Runner` interface may change. Run all six eval cases after any agent instruction or tool change. Re-test the path-traversal checks after any dependency update.
