# Evals

> **Last verified:** 2026-05-06 · **Drift risk:** low

Evaluation — the practice of systematically measuring whether your agent does what you intend — is not optional. It is the primary mechanism by which you know whether a change made things better or worse, and it is the first line of defense against silent regressions.

## Why evals are harder for agents than for models

A single-turn language model call has one failure mode: the output is wrong. An agent has many more. A multi-step, tool-using agent can fail at any of the following points independently:

- The model misreads the user's intent from the initial prompt.
- The model selects the wrong tool, or calls the right tool with wrong arguments.
- A tool returns ambiguous output and the model misinterprets it.
- The model loops when it should stop, or stops when it should loop.
- A downstream step succeeds technically but produces a result that violates a constraint (cost, safety, format).

Each additional reasoning step multiplies the probability that at least one failure occurs. Tool use adds an external-world dimension: the agent is no longer operating in a closed sandbox. A tool call can have side effects — sent emails, written records, triggered webhooks — that cannot be undone by simply regenerating a response.

This is why standard LLM benchmarks are a poor proxy for agent quality. A model that scores 90% on MMLU may still produce an agent that reliably mis-sequences tool calls or ignores a stop condition. You need evals that exercise the full execution trace.

## What this section covers

This section gives you practical, actionable guidance on building and operating an eval program for agents:

- [Building eval sets](eval-sets.md) — how to define cases, what schema to use, how to version and expand your dataset over time.
- [Red-team workflows](red-team.md) — adversarial testing categories specific to agents, with concrete test procedures and remediation guidance.
- [AutoMedBench-Lite](automedbench-lite.md) — a five-stage process eval for medical, scientific, and regulated-domain agent work.

## A minimum viable eval program

If you are just getting started, the minimum viable eval program has three parts:

1. A small golden dataset (5-10 hand-crafted cases) that exercises your agent's core tasks.
2. A rubric that defines what a correct execution trace looks like, not just a correct final answer.
3. A way to run all evals automatically on every change to your prompt, tools, or model version.

The cases and rubric matter more than the tooling. Start with a spreadsheet or a JSONL file and a script that calls your agent. Add structure and automation as the agent grows more complex.

## Evals as a feedback loop

Evals become most valuable when they close a loop: a new failure in production becomes a new eval case, and every future deployment is checked against that case before it ships. This practice — sometimes called "eval-driven development" — keeps your regression surface explicit and auditable.
