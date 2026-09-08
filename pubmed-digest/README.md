# 🧠 Stroke / Neuroepi Literature Digest

A self-contained, **deterministic and hallucination-resistant** literature-monitoring
pipeline. It queries **PubMed** (and optionally **medRxiv/bioRxiv**) on a schedule,
ranks new papers with a **transparent, fully-explainable** scoring function, and writes
a clean **Obsidian-friendly Markdown digest** grouped by topic — with optional email delivery.

Built for a vascular neurologist / neuroepidemiologist tracking ischemic stroke
subtypes, atrial fibrillation & stroke, stroke proteomics/metabolomics, DASH diet /
hypertension, and cerebral small vessel disease. Edit `config.yaml` to track anything.

---

## Design principles

- **Deterministic** — explicit date windows only (`--date` / `--since` / `--until`);
  the pipeline never infers a fuzzy "recent". Reruns over the same window produce the
  same digest.
- **Hallucination-resistant** — only data actually returned by an API is emitted.
  No citations, abstracts, dates, or authors are ever synthesized. Missing fields stay empty.
- **Explainable ranking** — no ML, no black box. Every point a paper earns is traceable
  to a weight in `config.yaml` and recorded in the digest under each item.
- **Idempotent** — already-seen PMIDs/DOIs are cached in `seen.json` and skipped, so
  overlapping/backfill runs don't duplicate items.
- **Fails loudly** — API/parse errors abort the run with a non-zero exit and a logged
  traceback rather than silently emitting an empty digest.
- **Dependency-light** — `requests`, `PyYAML`, `python-dotenv`, `feedparser`, `pytest`.

---

## Project layout

| File | Purpose |
|------|---------|
| `config.yaml` | Editable search profiles + ranking weights (**no secrets**). |
| `.env.example` | Template for secrets (NCBI key, SMTP). Copy to `.env`. |
| `models.py` | Shared `Record` dataclass used across all stages. |
| `config.py` | Config + `.env` loading and logging setup. |
| `fetch_pubmed.py` | PubMed via NCBI E-utilities (esearch + efetch), rate-limited. |
| `fetch_preprints.py` | Optional medRxiv/bioRxiv fetch via their public API. |
| `rank.py` | Transparent relevance scoring (keywords + MeSH + recency + journal tier). |
| `dedupe.py` | De-duplicate across sources by DOI → PMID → normalized title. |
| `digest.py` | Render Markdown digest + write dated Obsidian note `YYYY-MM-DD.md`. |
| `notify_email.py` | Optional SMTP delivery (creds from env only; default OFF). |
| `run.py` | Orchestrates the full pipeline; CLI entry point. |
| `tests/` | Pytest unit tests for `rank.py` and `dedupe.py` (no network). |

---

## Install

Requires **Python 3.10+**.

```bash
cd pubmed-digest
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
# or, as an installable package:  pip install -e .
```

### Add your API keys / secrets

Secrets are read **only** from the environment / a `.env` file — never from
`config.yaml` and never hardcoded.

```bash
cp .env.example .env
# then edit .env and set:
#   NCBI_API_KEY=...     (optional but recommended — raises rate limit 3 → 10 req/s)
#   NCBI_EMAIL=you@uw.edu
#   SMTP_* vars          (only if you want email delivery)
```

> Get a free NCBI API key at <https://www.ncbi.nlm.nih.gov/account/> →
> *Settings → API Key Management*. Without one the pipeline still works, just slower.

`.env` is git-ignored. **Do not commit it.**

---

## Run

```bash
# Default: window = last 7 days ending today (UTC)
python run.py

# Treat a specific date as "today" (deterministic reruns):
python run.py --date 2026-06-26

# Explicit backfill window:
python run.py --since 2026-06-01 --until 2026-06-26

# Also email the digest (requires SMTP_* env vars):
python run.py --email

# Ignore / don't update the seen-cache (useful for one-off exploration):
python run.py --no-cache
```

The digest is written to `digests/YYYY-MM-DD.md` (configurable via `output.dir`
or `--output`). Point `output.dir` at your Obsidian vault to drop notes straight in:

```yaml
# config.yaml
output:
  dir: "/Users/you/Obsidian/Research/Stroke Digests"
```

Each item shows its **score with a full breakdown**, matched keywords, publication
type, links (PubMed / DOI), and an abstract snippet. High-scoring items are flagged
**🔬 NEEDS REVIEW** (threshold configurable via `ranking.needs_review_threshold`).

---

## Customizing what's monitored

Everything lives in `config.yaml` — no code changes needed.

**Add or edit a topic:**

```yaml
topics:
  - name: "My New Topic"
    query: >-
      ("Stroke"[Mesh] OR stroke[Title/Abstract]) AND (your terms here)
    keywords:            # used for transparent title/abstract scoring
      - keyword one
      - keyword two
    mesh:                # MeSH descriptors that boost the score if present
      - Stroke
    max_results: 50      # optional per-topic override
```

The `query` is a full **PubMed/Entrez** query string — test it directly in the
[PubMed search bar](https://pubmed.ncbi.nlm.nih.gov/advanced/) first, then paste it in.

**Tune the ranking** under `ranking:` — keyword/MeSH weights, recency half-life,
journal-tier boosts, the `needs_review` threshold, and global `boost_terms`
(e.g. study designs). Every weight is plain data read by `rank.py`.

**Enable preprints** (off by default):

```yaml
preprints:
  enabled: true
  servers: [medrxiv, biorxiv]
```

---

## Scheduling

### macOS — `launchd` (recommended on Macs)

Create `~/Library/LaunchAgents/io.github.rkalani1.stroke-digest.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>            <string>io.github.rkalani1.stroke-digest</string>
  <key>ProgramArguments</key>
  <array>
    <string>/Users/you/pubmed-digest/.venv/bin/python</string>
    <string>/Users/you/pubmed-digest/run.py</string>
  </array>
  <key>WorkingDirectory</key> <string>/Users/you/pubmed-digest</string>
  <!-- Run every weekday at 07:00 -->
  <key>StartCalendarInterval</key>
  <dict>
    <key>Hour</key>    <integer>7</integer>
    <key>Minute</key>  <integer>0</integer>
  </dict>
  <key>StandardOutPath</key>  <string>/Users/you/pubmed-digest/digest.out.log</string>
  <key>StandardErrorPath</key><string>/Users/you/pubmed-digest/digest.err.log</string>
</dict>
</plist>
```

Load it:

```bash
launchctl load ~/Library/LaunchAgents/io.github.rkalani1.stroke-digest.plist
# unload with:  launchctl unload ~/Library/LaunchAgents/io.github.rkalani1.stroke-digest.plist
```

### Linux / generic — `cron`

```bash
crontab -e
```

```cron
# Daily at 07:00 — run from the project dir so .env and config.yaml resolve.
0 7 * * *  cd /home/you/pubmed-digest && .venv/bin/python run.py >> digest.log 2>&1

# Weekly (Mondays 07:00) with an explicit 7-day window:
# 0 7 * * 1  cd /home/you/pubmed-digest && .venv/bin/python run.py --since $(date -d '7 days ago' +\%Y-\%m-\%d) --until $(date +\%Y-\%m-\%d) >> digest.log 2>&1
```

> Cron has a minimal environment. Either rely on `.env` (loaded automatically) or
> export `NCBI_API_KEY` / `SMTP_*` in the crontab.

---

## Testing

```bash
pip install -r requirements.txt   # includes pytest
pytest                            # all tests are offline (no network)
```

Tests cover the ranking math (transparent breakdown, recency half-life, sorting,
needs-review flag) and de-duplication (DOI / PMID / normalized-title collapse,
PubMed-preferred merge, no false merges).

---

## How ranking works (transparent by design)

For each record, the total score is the sum of:

| Component | What it rewards | Config key |
|-----------|-----------------|------------|
| `title_keyword` | topic keyword in the **title** | `ranking.weights.title_keyword` |
| `abstract_keyword` | topic keyword only in the **abstract** | `ranking.weights.abstract_keyword` |
| `mesh_match` | topic **MeSH** term present on the record | `ranking.weights.mesh_match` |
| `boost_term` | high-value phrases (e.g. *randomized controlled trial*) | `ranking.boost_terms` |
| `recency` | exponential decay from publication date | `ranking.recency.*` |
| `journal_tier` | journal prestige tier | `ranking.journal_tiers` |

The exact breakdown is printed under every item in the digest, so you can always
see **why** a paper ranked where it did — and adjust the weights to taste.

---

## Notes & limitations

- PubMed's `edat` (Entrez date) is when a record entered PubMed, which is the most
  reliable window for "what's new". Switch `datetype` in `fetch_pubmed.py` if you
  prefer publication date.
- medRxiv/bioRxiv's public API is date-range based (not keyword-searchable), so
  preprints are fetched for the window and then keyword-filtered locally.
- This tool surfaces and ranks literature; it does **not** summarize or interpret it.
  Read the source before citing — abstract snippets are verbatim from the API.

## License

MIT (see `pyproject.toml`).
