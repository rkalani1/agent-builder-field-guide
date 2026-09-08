# Deployment status

| Field | Value |
|---|---|
| Live URL | https://rkalani1.github.io/agents-automations/ |
| Source branch | `main` |
| Build source | GitHub Actions (`build_type=workflow`) |
| Deploy workflow | [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) |
| Deploy action | `actions/deploy-pages@v4` |
| Last verified | 2026-05-06 |
| Build status | ✅ Build + deploy green on `main` |
| Strict build | `mkdocs build --strict` exits 0. The build emits an upstream Material for MkDocs informational banner about the future MkDocs 2.0 release; this is normal output, not a project warning. |
| Recipe nav pattern | The 45 recipes are accessed via the categorized [Recipes index](docs/recipes/index.md) instead of being listed individually in the top-level nav. The build prints INFO-level notices for these pages — this is intentional. See [ADR 0004](docs/decision-records/0004-recipe-nav-pattern.md). |

## How to check current status

```bash
# Latest workflow runs
gh run list --repo example/agents-automations --limit 5

# Pages config
gh api repos/example/agents-automations/pages

# Live site headers
curl -sI  /agents-automations/ | head
```

## Rollback path

If a bad commit reaches `main` and the deployment is broken or actively misleading:

```bash
# Identify the last-known-good commit
git -C agents-automations log --oneline -20

# Hard revert with a new commit (preferred — keeps history)
git revert <bad-sha> [<bad-sha-2> ...]
git push origin main

# Or hard reset (only with explicit human approval)
git push origin <good-sha>:main --force-with-lease
```

The Deploy MkDocs site workflow re-runs on each push to `main` and re-publishes Pages. There is no separate "promote" step; `main` is production.

## Boundaries

- No background automations or recurring agents are deployed by this repo.
- No secrets are stored in this repo or its workflows.
- Pages is the only externally-reachable surface; everything else is repo metadata and build artifacts.

For full setup details, see [`PRODUCTION_DEPLOYMENT.md`](PRODUCTION_DEPLOYMENT.md).
