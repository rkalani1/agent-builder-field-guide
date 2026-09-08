# Agents and Automations

A practical, vendor-neutral field guide to designing, configuring, testing, and operating AI agents across **Claude**, **Gemini**, **ChatGPT/OpenAI**, **Codex**, **GitHub Copilot**, and adjacent agent surfaces.

The site is published with [MkDocs Material](https://squidfunk.github.io/mkdocs-material/) on GitHub Pages.

**Live site:** https://rkalani1.github.io/agents-automations/

## Privacy and Safety Boundary

Examples, evals, and red-team fixtures must use clearly synthetic placeholders only. Do not add real patient data, employee records, student records, credentials, confidential business data, or realistic fake identifiers that could be mistaken for real PII/PHI.

## What this covers

- **Start Here** – what an agent is, when to use one, and four setup paths (beginner, power user, local-first, team).
- **Platform setup guides** – Claude Desktop, Claude Code, Claude Projects, Gemini app, Gemini CLI, Antigravity, Google AI Studio, ChatGPT, Custom GPTs, OpenAI API, Agents SDK, Codex CLI/app, GitHub Copilot coding agent, and local schedulers.
- **MCP and connectors** – concepts, installing servers, writing your own server, custom remote connectors, and security.
- **Browser & computer use** – Anthropic's computer-use tool, OpenAI's computer-use tool, the open-source `browser-use` library, and operating boundaries.
- **Orchestration** – single-agent loops, multi-agent patterns, local-first automation, and state/memory/handoffs.
- **Evaluation & safety** – eval sets, red-team workflows, safety checklists, human-in-the-loop, and incident response.
- **Templates** – reusable agent specs, prompts, eval rubrics, safety checklists, and PRDs.
- **Reference** – glossary, source map, roadmap, changelog, and architecture decision records.

## How the guide is sourced

Every product page lists the **last verified date**, **official sources**, what is **confirmed by docs**, what is a **practical inference**, and the **drift risk**. See [`docs/source-map.md`](docs/source-map.md) for the full list of references.

## Local development

```bash
git clone https://github.com/rkalani1/agents-automations.git
cd agents-automations
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
mkdocs serve
```

Then open <http://127.0.0.1:8000>.

## Deploy

The site auto-deploys from `main` via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) using `actions/deploy-pages@v4`. To enable Pages on a fresh fork:

1. **Settings → Pages → Source → "GitHub Actions"**
2. Push to `main` (or run the `Deploy MkDocs site` workflow manually).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Security policy is in [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE). All trademarks belong to their respective owners. This guide is independent and is not endorsed by Anthropic, OpenAI, Google, GitHub, or Microsoft.

