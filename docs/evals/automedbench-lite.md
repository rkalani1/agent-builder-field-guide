# AutoMedBench-Lite

> **Last verified:** 2026-06-09 · **Drift risk:** medium

AutoMedBench-Lite is a small eval pattern for judging whether an agent completes a regulated-domain task with a defensible process, not just a plausible final answer.

It adapts the AutoMedBench idea of scoring the execution trace across five stages:

| Stage | What to look for |
|---|---|
| S1 Plan | Objective, scope, assumptions, risks, and stop conditions. |
| S2 Setup | Files, tools, sources, access constraints, and data boundary. |
| S3 Validate | Concrete source, schema, edge-case, privacy, and format checks. |
| S4 Execute | The actual work, with deviations recorded. |
| S5 Submit | Final artifact, provenance, validation status, and residual risk. |

The most important stage is S3 Validate. Agents often produce coherent work while skipping the checks that would reveal source drift, schema errors, privacy risk, or an invalid final artifact.

## Where the Eval Pack Lives

The repo-local pack is in:

```text
evals/automedbench-lite/
```

It includes:

- a stage rubric
- three starter tasks
- a one-shot agent prompt
- automatic failure conditions

## When to Use It

Use AutoMedBench-Lite when an agent will:

- update clinical, scientific, compliance, or policy content
- run a multi-step workflow with tools
- edit tests, evals, or schemas
- produce a deliverable that must pass source, privacy, or format checks

Do not use it as clinical validation. It evaluates workflow discipline and deliverable hygiene.
