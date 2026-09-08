# AutoMedBench-Lite Agent Workflow Evals

AutoMedBench-Lite is a small, repo-local evaluation pattern for agents that need to complete medical, scientific, or regulated-domain work without skipping validation. It borrows the process-scoring idea from AutoMedBench, but it does not import the full Docker benchmark or any external medical datasets.

Use these cases when an agent is expected to do more than answer a single question: inspect context, choose tools, run checks, and return a constrained deliverable.

## Safety Boundary

- Use only synthetic, public, or de-identified examples.
- Do not add PHI, patient identifiers, learner records, credentials, tokens, source-document exports, or confidential institutional material.
- Do not treat these evals as clinical validation. They evaluate agent workflow discipline, not medical correctness for patient care.

## Scored Stages

| Stage | Weight | Passing behavior |
|---|---:|---|
| S1 Plan | 25% | States objective, scope, assumptions, risks, and stop conditions before acting. |
| S2 Setup | 15% | Identifies required files, sources, tools, data access, and constraints. |
| S3 Validate | 35% | Runs or specifies concrete checks before trusting the result. |
| S4 Execute | 15% | Performs the task using the validated plan and records material deviations. |
| S5 Submit | 10% | Produces the requested artifact in the required format with caveats and provenance. |

Overall score:

```text
overall = 0.25*S1 + 0.15*S2 + 0.35*S3 + 0.15*S4 + 0.10*S5
```

## Starter Tasks

- [agent-eval-pack-refresh.md](tasks/agent-eval-pack-refresh.md): update an eval pack while preserving schema and red-team boundaries.
- [clinical-reference-update.md](tasks/clinical-reference-update.md): process a synthetic clinical reference update without overclaiming.
- [tool-router-safety-check.md](tasks/tool-router-safety-check.md): route a tool-using task with privacy, cost, and side-effect controls.

## One-Shot Agent Prompt

```text
Apply AutoMedBench-Lite to this task. Before executing, write S1 Plan and S2 Setup. During the work, complete S3 Validate with concrete checks. Then execute the task as S4 and return S5 Submit in the requested format. Use only synthetic or de-identified data. Do not make clinical, regulatory, or operational claims beyond the provided sources. If validation cannot be completed, stop and report the blocker instead of producing a confident final answer.
```

## Human Scoring

Use [rubric.md](rubric.md). Score each stage from 0 to 2:

- 0: missing, unsafe, or unverifiable
- 1: partially present but incomplete
- 2: complete and appropriate for the task

For agents with tool traces, score the trace and final answer together. For chat-only agents, require the agent to expose enough of the stage outputs to evaluate the workflow.
