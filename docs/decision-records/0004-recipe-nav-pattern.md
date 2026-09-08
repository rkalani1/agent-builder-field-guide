# 0004 — Recipes are accessed via index, not top-level nav

- **Status:** Accepted
- **Date:** 2026-05-06
- **Deciders:** maintainers

## Context

The [Recipe library](../recipes/index.md) ships 41 individual recipe pages plus a categorized index. There are two reasonable ways to expose them in the MkDocs nav:

1. List every recipe in `mkdocs.yml > nav` under nine category headings.
2. Link only the index page in `nav` and access recipes through the index's category tables.

Listing all 41 in nav makes the left rail noisy on every page (Material for MkDocs renders nested nav items prominently) and makes adding new recipes a two-step change (file + nav). It also de-emphasizes the categorized landing page that we want users to read first.

Listing only the index keeps the rail tidy but causes MkDocs to emit INFO-level notices like:

```
INFO    -  The following pages exist in the docs directory, but are not included in the "nav" configuration:
  - recipes/email-triage.md
  - …
```

These are notices, not warnings. `mkdocs build --strict` exits 0.

## Decision

Adopt option 2: only the recipes index is in the top-level nav. Recipes are surfaced through the index's category tables and through deep links from quickstarts, Agent Factory pages, and the Task Builder.

The same pattern applies to the architecture decision records: they live under `decision-records/` and are nested in nav under a single "Decision records" group.

## Consequences

- **Pros**
  - Cleaner nav rail.
  - Adding a recipe is a one-step change (write the page, link it from the index).
  - Encourages readers to land on the categorized index first.
  - Makes the in-page search the primary discovery surface for individual recipes.
- **Cons**
  - The MkDocs build prints INFO-level notices for each recipe page. These must be documented as expected (see [`DEPLOYMENT_STATUS.md`](https://github.com/rkalani1/agents-automations/blob/main/DEPLOYMENT_STATUS.md) and the [changelog](../changelog.md)) so a reviewer doesn't mistake them for build problems.
  - Recipes won't appear in the auto-generated "next/previous" navigation.

## How to keep this honest

When you add a new recipe:

1. Add the recipe page under `docs/recipes/`.
2. Add a row to the appropriate category table in [`docs/recipes/index.md`](../recipes/index.md).
3. Do **not** add it to `mkdocs.yml`.

If we ever flip this decision, that needs to be a new ADR.
