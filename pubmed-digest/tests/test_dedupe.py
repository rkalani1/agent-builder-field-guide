"""Unit tests for cross-source de-duplication. No network."""

from __future__ import annotations

from dedupe import dedupe
from models import Record


def test_dedupe_by_doi_prefers_pubmed():
    preprint = Record(
        title="A trial of tenecteplase",
        source="medrxiv",
        doi="10.1101/2026.01.01.123456",
        journal="medrxiv (preprint)",
        date="2026-01-01",
        abstract="preprint abstract",
    )
    published = Record(
        title="A trial of tenecteplase",
        source="pubmed",
        pmid="40000123",
        doi="10.1101/2026.01.01.123456",  # same DOI
        journal="Stroke",
        date="2026-03-01",
        abstract="",  # missing -> should be backfilled from preprint
    )
    out = dedupe([preprint, published])
    assert len(out) == 1
    merged = out[0]
    # PubMed (peer-reviewed) wins as primary...
    assert merged.source == "pubmed"
    assert merged.pmid == "40000123"
    assert merged.journal == "Stroke"
    # ...but the missing abstract is backfilled from the preprint.
    assert merged.abstract == "preprint abstract"


def test_dedupe_by_pmid():
    a = Record(title="Paper A", source="pubmed", pmid="111", journal="Neurology", date="2026-02-01")
    b = Record(title="Paper A duplicate fetch", source="pubmed", pmid="111", journal="", date="")
    out = dedupe([a, b])
    assert len(out) == 1
    assert out[0].journal == "Neurology"


def test_dedupe_by_normalized_title():
    a = Record(title="Stroke Outcomes: A Cohort Study!", source="pubmed", date="2026-02-01")
    b = Record(title="stroke outcomes a cohort study", source="biorxiv", date="2026-02-02")
    out = dedupe([a, b])
    assert len(out) == 1


def test_no_false_merge_distinct_papers():
    a = Record(title="Paper about lacunar stroke", source="pubmed", pmid="1", date="2026-01-01")
    b = Record(title="Paper about cardioembolic stroke", source="pubmed", pmid="2", date="2026-01-01")
    out = dedupe([a, b])
    assert len(out) == 2


def test_mesh_union_on_merge():
    a = Record(title="x", source="pubmed", doi="10.1/x", mesh_terms=["Stroke"])
    b = Record(title="x", source="medrxiv", doi="10.1/x", mesh_terms=["Biomarkers"])
    out = dedupe([a, b])
    assert len(out) == 1
    assert set(out[0].mesh_terms) == {"Stroke", "Biomarkers"}


def test_order_preserved():
    a = Record(title="first", source="pubmed", pmid="1", date="2026-01-01")
    b = Record(title="second", source="pubmed", pmid="2", date="2026-01-01")
    c = Record(title="first", source="pubmed", pmid="1", date="2026-01-01")  # dup of a
    out = dedupe([a, b, c])
    assert [r.title for r in out] == ["first", "second"]
