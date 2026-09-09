from pathlib import Path
import pytest

from digest import (
    _format_authors,
    _format_breakdown,
    _links,
    _render_item,
    build_digest,
    write_digest,
)
from models import Record


# --- Helper Function Tests ---


def test_format_authors_empty():
    assert _format_authors([]) == "_authors not listed_"


def test_format_authors_below_max():
    authors = ["Alice Smith", "Bob Jones"]
    assert _format_authors(authors, max_authors=4) == "Alice Smith, Bob Jones"


def test_format_authors_equal_max():
    authors = ["Alice", "Bob", "Charlie", "David"]
    assert _format_authors(authors, max_authors=4) == "Alice, Bob, Charlie, David"


def test_format_authors_exceeds_max():
    authors = ["Alice", "Bob", "Charlie", "David", "Eve"]
    assert _format_authors(authors, max_authors=4) == "Alice, Bob, Charlie, David et al."
    assert _format_authors(authors, max_authors=2) == "Alice, Bob et al."


def test_format_breakdown_empty():
    assert _format_breakdown({}) == ""


def test_format_breakdown_with_data():
    breakdown = {"title_keyword": 3.0, "mesh_match": 2.5}
    result = _format_breakdown(breakdown)
    assert result == "title_keyword 3 · mesh_match 2.5"


def test_links_pubmed_and_doi():
    rec = Record(
        title="Test Title",
        source="pubmed",
        url="https://pubmed.ncbi.nlm.nih.gov/123/",
        doi="10.1000/123",
    )
    assert _links(rec) == "[PubMed](https://pubmed.ncbi.nlm.nih.gov/123/) | [DOI](https://doi.org/10.1000/123)"


def test_links_non_pubmed_no_doi():
    rec = Record(
        title="Test Title",
        source="medrxiv",
        url="https://medrxiv.org/content/123",
    )
    assert _links(rec) == "[Link](https://medrxiv.org/content/123)"


def test_links_doi_only():
    rec = Record(
        title="Test Title",
        source="pubmed",
        doi="10.1000/123",
    )
    assert _links(rec) == "[DOI](https://doi.org/10.1000/123)"


def test_links_none():
    rec = Record(title="Test Title", source="pubmed")
    assert _links(rec) == ""


# --- Item Rendering Tests ---


def test_render_item_minimal():
    rec = Record(
        title="",
        source="pubmed",
        journal="",
        score=5.0,
    )
    rendered = _render_item(rec, index=1)
    assert "### 1. _untitled_" in rendered
    assert "*_authors not listed_* — **n/a**" in rendered
    assert "**Score:** 5" in rendered


def test_render_item_full(sample_record):
    sample_record.score = 15.0
    sample_record.score_breakdown = {"title_keyword": 3.0, "recency": 6.0}
    sample_record.matched_keywords = ["stroke", "thrombectomy"]
    sample_record.needs_review = True

    rendered = _render_item(sample_record, index=1)
    assert "### 1. Endovascular thrombectomy in cardioembolic ischemic stroke 🔬 **NEEDS REVIEW**" in rendered
    assert "*Smith J, Doe A, Roe B* — **N Engl J Med** (2026-06-26)" in rendered
    assert "**Score:** 15  _( title_keyword 3 · recency 6 )_" in rendered
    assert "**Matched:** stroke, thrombectomy" in rendered
    assert "**Type:** Randomized Controlled Trial" in rendered
    assert "[PubMed](https://pubmed.ncbi.nlm.nih.gov/40000001/) | [DOI](https://doi.org/10.1056/nejm.2026.0001)" in rendered
    assert "> This randomized controlled trial evaluated thrombectomy in patients with cardioembolic ischemic stroke. Biomarker analysis was secondary." in rendered


def test_render_item_abstract_truncation():
    long_abstract = "Word " * 150  # 750 chars
    rec = Record(title="Test", source="pubmed", abstract=long_abstract)
    rendered = _render_item(rec, index=1)
    assert "…" in rendered
    # Abstract snippet minus formatting prefix should be max 601 characters (600 + …)
    lines = rendered.splitlines()
    quote_line = [l for l in lines if l.startswith("> ")][0]
    snippet = quote_line[2:]
    assert len(snippet) <= 601
    assert snippet.endswith("…")


# --- Build Digest Tests ---


def test_build_digest_empty_topics():
    topics_to_records = {"Stroke": []}
    digest = build_digest(
        topics_to_records,
        run_date="2026-06-26",
        since="2026-06-19",
        until="2026-06-26",
    )

    assert "date: 2026-06-26" in digest
    assert "search_window: 2026-06-19..2026-06-26" in digest
    assert "total_items: 0" in digest
    assert "needs_review: 0" in digest
    assert "  - literature-digest" in digest
    assert "  - stroke" in digest
    assert "  - research" in digest
    assert "# 🧠 Literature Digest — 2026-06-26" in digest
    assert "_No new items in this window._" in digest


def test_build_digest_custom_tags_and_tldr():
    rec1 = Record(
        title="Stroke Paper 1",
        source="pubmed",
        score=10.0,
        doi="10.1000/1",
        journal="Stroke",
        topic="Stroke",
    )
    rec2 = Record(
        title="Stroke Paper 2",
        source="pubmed",
        score=20.0,
        needs_review=True,
        url="https://pubmed.ncbi.nlm.nih.gov/2/",
        journal="Lancet",
        topic="Stroke",
    )
    rec3 = Record(
        title="Preprint Paper",
        source="biorxiv",
        score=15.0,
        topic="Preprints",
    )

    topics_to_records = {
        "Stroke": [rec2, rec1],
        "Preprints": [rec3],
    }

    digest = build_digest(
        topics_to_records,
        run_date="2026-06-26",
        since="2026-06-19",
        until="2026-06-26",
        tldr_count=2,
        tags=["custom-tag"],
    )

    # Frontmatter
    assert "total_items: 3" in digest
    assert "needs_review: 1" in digest
    assert "  - custom-tag" in digest

    # TL;DR section ordering (rec2 score 20, rec3 score 15, rec1 score 10 truncated by tldr_count=2)
    tldr_start = digest.find("## ⭐ TL;DR — Top items")
    topic_start = digest.find("## Stroke  (2)")
    tldr_section = digest[tldr_start:topic_start]

    assert "- **[20]** 🔬 Stroke Paper 2 — *Lancet* ([link](https://pubmed.ncbi.nlm.nih.gov/2/))  `Stroke`" in tldr_section
    assert "- **[15]** Preprint Paper — *n/a*  `Preprints`" in tldr_section
    assert "Stroke Paper 1" not in tldr_section  # Excluded due to tldr_count=2

    # Topic sections
    assert "## Stroke  (2)" in digest
    assert "## Preprints  (1)" in digest


def test_build_digest_tldr_uncategorized_and_untitled():
    rec = Record(
        title="",
        source="pubmed",
        score=5.0,
        topic="",
    )
    digest = build_digest(
        {"Empty Topic": [rec]},
        run_date="2026-06-26",
        since="2026-06-19",
        until="2026-06-26",
    )
    assert "- **[5]** _untitled_ — *n/a*  `uncategorized`" in digest


# --- Write Digest Tests ---


def test_write_digest(tmp_path: Path):
    markdown = "# Test Digest"
    run_date = "2026-06-26"
    out_dir = tmp_path / "output_folder"

    result_path = write_digest(markdown, out_dir, run_date)

    assert result_path.exists()
    assert result_path == out_dir / "2026-06-26.md"
    assert result_path.read_text(encoding="utf-8") == "# Test Digest"
