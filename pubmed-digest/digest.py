"""Render a clean, Obsidian-friendly Markdown digest grouped by topic.

Output layout:
  * YAML frontmatter (date, counts, tags) for Obsidian
  * TL;DR section: the top N highest-scoring items across all topics
  * Per-topic sections, each item showing title, authors, journal, date,
    score (with transparent breakdown), matched keywords, a "needs review"
    flag for high-score items, and links (DOI / PubMed).

Every value rendered comes from a real record field; nothing is summarized by
an LLM or otherwise invented.
"""

from __future__ import annotations

from pathlib import Path
from typing import Any

from config import get_logger
from models import Record

log = get_logger(__name__)


def _format_authors(authors: list[str], max_authors: int = 4) -> str:
    if not authors:
        return "_authors not listed_"
    if len(authors) <= max_authors:
        return ", ".join(authors)
    return ", ".join(authors[:max_authors]) + " et al."


def _format_breakdown(breakdown: dict[str, float]) -> str:
    if not breakdown:
        return ""
    parts = [f"{k} {v:g}" for k, v in breakdown.items()]
    return " · ".join(parts)


def _links(record: Record) -> str:
    links = []
    if record.url:
        label = "PubMed" if record.source == "pubmed" else "Link"
        links.append(f"[{label}]({record.url})")
    if record.doi:
        links.append(f"[DOI](https://doi.org/{record.doi})")
    return " | ".join(links)


def _render_item(record: Record, index: int) -> str:
    lines: list[str] = []
    flag = " 🔬 **NEEDS REVIEW**" if record.needs_review else ""
    lines.append(f"### {index}. {record.title or '_untitled_'}{flag}")
    lines.append("")
    meta = f"*{_format_authors(record.authors)}* — **{record.journal or 'n/a'}**"
    if record.date:
        meta += f" ({record.date})"
    lines.append(meta)
    lines.append("")
    score_line = f"**Score:** {record.score:g}"
    breakdown = _format_breakdown(record.score_breakdown)
    if breakdown:
        score_line += f"  _( {breakdown} )_"
    lines.append(score_line)
    if record.matched_keywords:
        lines.append("")
        lines.append(f"**Matched:** {', '.join(record.matched_keywords)}")
    if record.publication_types:
        lines.append("")
        lines.append(f"**Type:** {', '.join(record.publication_types)}")
    links = _links(record)
    if links:
        lines.append("")
        lines.append(links)
    if record.abstract:
        lines.append("")
        snippet = record.abstract.strip().replace("\n", " ")
        if len(snippet) > 600:
            snippet = snippet[:600].rstrip() + "…"
        lines.append(f"> {snippet}")
    lines.append("")
    return "\n".join(lines)


def build_digest(
    topics_to_records: dict[str, list[Record]],
    run_date: str,
    since: str,
    until: str,
    tldr_count: int = 8,
    tags: list[str] | None = None,
) -> str:
    """Build the full Markdown digest string.

    Parameters
    ----------
    topics_to_records : ordered mapping of topic name -> ranked records.
    run_date          : the date this digest represents (YYYY-MM-DD).
    since / until     : the explicit search window, echoed for provenance.
    """
    tags = tags or ["literature-digest", "stroke", "research"]
    all_records = [r for recs in topics_to_records.values() for r in recs]
    total = len(all_records)
    needs_review_total = sum(1 for r in all_records if r.needs_review)

    out: list[str] = []

    # --- Obsidian YAML frontmatter ---
    out.append("---")
    out.append(f"date: {run_date}")
    out.append(f"search_window: {since}..{until}")
    out.append(f"total_items: {total}")
    out.append(f"needs_review: {needs_review_total}")
    out.append("tags:")
    for tag in tags:
        out.append(f"  - {tag}")
    out.append("---")
    out.append("")

    out.append(f"# 🧠 Literature Digest — {run_date}")
    out.append("")
    out.append(
        f"Search window **{since} → {until}** · **{total}** items across "
        f"**{len(topics_to_records)}** topics · **{needs_review_total}** flagged for review."
    )
    out.append("")

    # --- TL;DR (top items across all topics) ---
    out.append("## ⭐ TL;DR — Top items")
    out.append("")
    top = sorted(all_records, key=lambda r: r.score, reverse=True)[:tldr_count]
    if not top:
        out.append("_No new items in this window._")
        out.append("")
    else:
        for rec in top:
            flag = " 🔬" if rec.needs_review else ""
            link = f"https://doi.org/{rec.doi}" if rec.doi else rec.url
            title = rec.title or "_untitled_"
            line = f"- **[{rec.score:g}]**{flag} {title} — *{rec.journal or 'n/a'}*"
            if link:
                line += f" ([link]({link}))"
            line += f"  `{rec.topic or 'uncategorized'}`"
            out.append(line)
        out.append("")

    # --- Per-topic sections ---
    for topic, records in topics_to_records.items():
        out.append("---")
        out.append("")
        out.append(f"## {topic}  ({len(records)})")
        out.append("")
        if not records:
            out.append("_No new items in this window._")
            out.append("")
            continue
        for i, rec in enumerate(records, start=1):
            out.append(_render_item(rec, i))

    out.append("---")
    out.append("")
    out.append(
        "_Generated by the UW stroke literature-digest pipeline. "
        "All items reflect data returned by PubMed / preprint APIs for the stated "
        "window; no citations are synthesized._"
    )
    out.append("")
    return "\n".join(out)


def write_digest(
    markdown: str,
    output_dir: str | Path,
    run_date: str,
) -> Path:
    """Write the digest to an Obsidian-style dated note ``YYYY-MM-DD.md``.

    Creates the output directory if needed and returns the written path.
    """
    out_dir = Path(output_dir).expanduser()
    out_dir.mkdir(parents=True, exist_ok=True)
    path = out_dir / f"{run_date}.md"
    path.write_text(markdown, encoding="utf-8")
    log.info("Wrote digest to %s", path)
    return path
