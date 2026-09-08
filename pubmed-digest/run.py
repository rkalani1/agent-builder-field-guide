"""Pipeline orchestrator.

    python run.py                      # default window ending today (UTC)
    python run.py --date 2026-06-26    # treat this as "today"; window = date-window_days .. date
    python run.py --since 2026-06-01 --until 2026-06-26   # explicit backfill window
    python run.py --no-cache           # ignore + don't update seen.json
    python run.py --email              # also send via SMTP (creds from env)

Determinism / hallucination-resistance guarantees:
  * Dates are ALWAYS explicit. ``--date``/``--since``/``--until`` are passed
    straight through to NCBI; we never let a fuzzy "recent" be inferred.
  * Idempotent: PMIDs/DOIs already in ``seen.json`` are skipped, so reruns over
    overlapping windows don't duplicate items.
  * Fails loudly: any API error propagates and aborts the run (non-zero exit).
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path

from config import DEFAULT_CONFIG_PATH, get_logger, load_config, load_env
from dedupe import dedupe
from digest import build_digest, write_digest
from fetch_preprints import fetch_preprints, filter_by_keywords
from fetch_pubmed import PubMedClient, fetch_topic
from models import Record
from rank import rank_records

log = get_logger("pubmed_digest.run")

HERE = Path(__file__).resolve().parent
DEFAULT_SEEN_PATH = HERE / "seen.json"


# --------------------------------------------------------------------- #
# Seen-cache (idempotency)
# --------------------------------------------------------------------- #
def load_seen(path: Path) -> set[str]:
    if not path.exists():
        return set()
    try:
        with path.open("r", encoding="utf-8") as fh:
            data = json.load(fh)
        return set(data.get("seen", []))
    except (ValueError, OSError) as exc:
        log.warning("Could not read seen cache %s (%s); starting fresh.", path, exc)
        return set()


def save_seen(path: Path, seen: set[str]) -> None:
    payload = {"updated": datetime.utcnow().isoformat(timespec="seconds") + "Z", "seen": sorted(seen)}
    tmp = path.with_suffix(".json.tmp")
    with tmp.open("w", encoding="utf-8") as fh:
        json.dump(payload, fh, indent=2)
    tmp.replace(path)  # atomic
    log.info("Updated seen cache (%d ids) at %s", len(seen), path)


# --------------------------------------------------------------------- #
# Date-window resolution
# --------------------------------------------------------------------- #
def resolve_window(args: argparse.Namespace, default_window_days: int) -> tuple[str, str, str]:
    """Return (since, until, run_date) as explicit ISO strings.

    Precedence:
      1. explicit --since/--until  (either may be supplied; the other derives)
      2. --date as the 'until'/run_date, window = default_window_days back
      3. today (UTC) as 'until', window = default_window_days back
    """
    fmt = "%Y-%m-%d"

    def parse(d: str) -> datetime:
        try:
            return datetime.strptime(d, fmt)
        except ValueError as exc:
            raise SystemExit(f"Invalid date '{d}'; expected YYYY-MM-DD") from exc

    if args.since or args.until:
        until_dt = parse(args.until) if args.until else datetime.utcnow()
        since_dt = parse(args.since) if args.since else (until_dt - timedelta(days=default_window_days))
    else:
        until_dt = parse(args.date) if args.date else datetime.utcnow()
        since_dt = until_dt - timedelta(days=default_window_days)

    if since_dt > until_dt:
        raise SystemExit(f"--since ({since_dt.date()}) is after --until ({until_dt.date()}).")

    return since_dt.strftime(fmt), until_dt.strftime(fmt), until_dt.strftime(fmt)


# --------------------------------------------------------------------- #
# Core pipeline
# --------------------------------------------------------------------- #
def run(args: argparse.Namespace) -> int:
    load_env()
    config = load_config(Path(args.config) if args.config else DEFAULT_CONFIG_PATH)

    defaults = config.get("defaults", {})
    ranking = config["ranking"]
    default_window = int(defaults.get("date_window_days", 7))

    since, until, run_date = resolve_window(args, default_window)
    log.info("Run date %s · search window %s..%s", run_date, since, until)

    seen_path = Path(args.seen) if args.seen else DEFAULT_SEEN_PATH
    use_cache = not args.no_cache
    seen = load_seen(seen_path) if use_cache else set()
    newly_seen: set[str] = set()

    # --- API clients ---
    api_key = os.environ.get("NCBI_API_KEY")
    email = os.environ.get("NCBI_EMAIL") or os.environ.get("CONTACT_EMAIL")
    if not api_key:
        log.warning("NCBI_API_KEY not set; running at the slower unauthenticated rate limit (3 req/s).")
    pubmed = PubMedClient(api_key=api_key, email=email)

    run_today = datetime.strptime(run_date, "%Y-%m-%d").date()

    # --- Preprints (optional, fetched once for the whole window) ---
    preprint_cfg = config.get("preprints", {})
    preprint_records: list[Record] = []
    if preprint_cfg.get("enabled", False):
        servers = preprint_cfg.get("servers", ["medrxiv"])
        log.info("Fetching preprints from %s", servers)
        preprint_records = fetch_preprints(servers, since=since, until=until)

    topics_to_records: dict[str, list[Record]] = {}

    for topic in config["topics"]:
        name = topic["name"]
        query = topic["query"]
        keywords = topic.get("keywords", [])
        mesh = topic.get("mesh", [])
        retmax = int(topic.get("max_results", defaults.get("max_results", 50)))

        log.info("Topic '%s': querying PubMed", name)
        records = fetch_topic(pubmed, query=query, since=since, until=until, retmax=retmax)

        # Attach matching preprints to this topic by keyword filter.
        if preprint_records and keywords:
            topic_preprints = filter_by_keywords(preprint_records, keywords)
            records.extend(topic_preprints)

        for rec in records:
            rec.topic = name

        # Dedupe within the topic, then drop already-seen items.
        records = dedupe(records)
        fresh: list[Record] = []
        for rec in records:
            key = rec.identity_key()
            if use_cache and key in seen:
                continue
            newly_seen.add(key)
            fresh.append(rec)

        ranked = rank_records(fresh, ranking, topic_keywords=keywords, topic_mesh=mesh, today=run_today)
        topics_to_records[name] = ranked
        log.info("Topic '%s': %d new item(s) after dedupe/seen filtering", name, len(ranked))

    # --- Render & write ---
    tldr_count = int(defaults.get("tldr_count", 8))
    markdown = build_digest(
        topics_to_records,
        run_date=run_date,
        since=since,
        until=until,
        tldr_count=tldr_count,
        tags=config.get("output", {}).get("tags"),
    )

    output_dir = args.output or config.get("output", {}).get("dir", str(HERE / "digests"))
    path = write_digest(markdown, output_dir, run_date)
    print(str(path))

    # --- Optional email ---
    if args.email or config.get("email", {}).get("enabled", False):
        from notify_email import EmailConfigError, send_digest

        subject = config.get("email", {}).get("subject", f"Stroke Literature Digest — {run_date}")
        try:
            send_digest(markdown, subject=subject)
        except EmailConfigError as exc:
            log.error("Email not sent: %s", exc)
            return 2

    # --- Persist seen cache (only after a fully successful run) ---
    if use_cache:
        save_seen(seen_path, seen | newly_seen)

    total = sum(len(v) for v in topics_to_records.values())
    log.info("Done. %d new item(s) written to %s", total, path)
    return 0


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="Stroke / neuroepi literature digest pipeline.")
    p.add_argument("--date", help="Treat this date (YYYY-MM-DD) as 'today'; window ends here.")
    p.add_argument("--since", help="Explicit window start (YYYY-MM-DD).")
    p.add_argument("--until", help="Explicit window end (YYYY-MM-DD).")
    p.add_argument("--config", help="Path to config.yaml (default: alongside this script).")
    p.add_argument("--output", help="Output directory for the dated digest note.")
    p.add_argument("--seen", help="Path to the seen.json idempotency cache.")
    p.add_argument("--no-cache", action="store_true", help="Ignore and do not update seen.json.")
    p.add_argument("--email", action="store_true", help="Also send the digest via SMTP (creds from env).")
    return p


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    try:
        return run(args)
    except Exception as exc:  # fail loudly with a non-zero exit
        log.exception("Pipeline failed: %s", exc)
        return 1


if __name__ == "__main__":
    sys.exit(main())
