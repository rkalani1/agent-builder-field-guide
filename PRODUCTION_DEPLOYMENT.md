# Production deployment

This document explains how ` /agents-automations/` is built and published.

## Architecture

```
main branch
    │
    ▼
┌─────────────────────────────────────────────┐
│ .github/workflows/deploy.yml                │
│  ┌────────────┐    ┌────────────────────┐  │
│  │ build job  │ ─► │ deploy job         │  │
│  │ mkdocs     │    │ deploy-pages@v4    │  │
│  │ --strict   │    │                    │  │
│  └────────────┘    └────────────────────┘  │
└─────────────────────────────────────────────┘
    │
    ▼
GitHub Pages (/agents-automations/)
```

## Components

| Component | Where |
|---|---|
| Static-site generator | MkDocs Material — see [`mkdocs.yml`](mkdocs.yml) and [`requirements.txt`](requirements.txt). |
| Build + deploy workflow | [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). |
| PR validation workflow | [`.github/workflows/pr-build.yml`](.github/workflows/pr-build.yml) — runs `mkdocs build --strict` on every PR. |
| Link checker | [`.github/workflows/link-check.yml`](.github/workflows/link-check.yml) — two jobs: `internal-links` is **gating** (fails PRs on broken relative/anchor links) and `external-links` is **advisory** (reports broken HTTP links as an artifact, never fails the build). Triggered on PRs touching Markdown and on manual dispatch; never scheduled. |
| Pages source | GitHub Actions (`build_type=workflow`). Configured once via `gh api repos/.../pages -f build_type=workflow`. |

## How to enable Pages on a fresh fork

1. Settings → Pages → **Source: GitHub Actions**.
2. Push to `main` (or run **Deploy MkDocs site** manually under **Actions**).
3. Wait ~1 minute. The first deployment will print the page URL in the deploy step output.

## Permissions required by the deploy workflow

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

These are scoped to the workflow file. No personal access token is used.

## Local development

```bash
git clone https://github.com/rkalani1/agents-automations.git
cd agents-automations
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
mkdocs serve
```

Then open <http://127.0.0.1:8000>.

## Strict build

CI runs `mkdocs build --strict --site-dir _site`. The `--strict` flag turns warnings into errors, so the build fails on:

- broken internal links,
- nav references to missing files,
- orphaned files in `docs/` not in nav (when configured),
- duplicate/ambiguous page references.

## Updating dependencies

`requirements.txt` pins `mkdocs-material>=9.5.0`. Dependency updates are manual: bump `requirements.txt` and the action versions in [`.github/workflows/`](.github/workflows/) as needed (Dependabot is not currently configured for this repo).

## Boundaries

- The build environment never sees secrets. No `secrets.*` are referenced in `deploy.yml`.
- Pages is the only public surface. Repo metadata is public; the repo itself contains no PHI, tokens, or personal data.
- No scheduled/recurring workflows. Every workflow is triggered by `push`, `pull_request`, or `workflow_dispatch`.

## Rollback

See [`DEPLOYMENT_STATUS.md`](DEPLOYMENT_STATUS.md#rollback-path).
