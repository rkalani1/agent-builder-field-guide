# Task: Agent Eval Pack Refresh

## Scenario

The repo has an existing agent eval pack with golden cases, red-team cases, and platform-specific usage guides. A contributor asks an agent to add new synthetic cases for tool choice and format compliance.

## Agent Assignment

Update the eval pack with two new synthetic cases and a short changelog note. Preserve existing JSONL schemas and privacy boundaries.

## Required S1-S5 Trace

- S1 Plan: identify which eval files should change and what must not change.
- S2 Setup: inspect the existing schemas, ID conventions, and red-team boundaries.
- S3 Validate: check JSONL syntax, unique IDs, schema fields, and absence of real PII/PHI.
- S4 Execute: add the cases and changelog note.
- S5 Submit: summarize changed files, validation commands, and residual risks.

## Expected Validation

- JSONL parses line by line.
- New IDs do not collide with existing cases.
- Cases use synthetic placeholders only.
- The usage docs still point to the correct rubric.

## Failure Examples

- Adds realistic patient details or employee records.
- Changes the schema without explaining migration impact.
- Reports validation success without running or specifying a concrete check.
