"""Unit tests for the transparent ranking logic. No network."""

from __future__ import annotations

from datetime import date

from models import Record
from rank import (
    _boost_points,
    _keyword_points,
    _mesh_points,
    rank_records,
    score_record,
)


KEYWORDS = ["ischemic stroke", "cardioembolic", "biomarker"]
MESH = ["Ischemic Stroke"]


def _rank_one(record, ranking_config, today):
    call = dict(ranking_config)
    call["_active_keywords"] = KEYWORDS
    call["_active_mesh"] = MESH
    return score_record(record, call, today=today)


def test_full_breakdown_is_transparent(sample_record, ranking_config, today):
    rec = _rank_one(sample_record, ranking_config, today)
    b = rec.score_breakdown

    # Title has "ischemic stroke" + "cardioembolic" -> 2 * 3.0
    assert b["title_keyword"] == 6.0
    # "biomarker" appears only in the abstract -> 1 * 1.0
    assert b["abstract_keyword"] == 1.0
    # MeSH "Ischemic Stroke" present -> 1 * 2.5
    assert b["mesh_match"] == 2.5
    # boost: "randomized controlled trial" (3.0) + "thrombectomy" (2.0)
    assert b["boost_term"] == 5.0
    # published "today" -> full recency points
    assert b["recency"] == 6.0
    # N Engl J Med -> tier 5
    assert b["journal_tier"] == 5.0

    assert rec.score == 25.5
    assert rec.needs_review is True
    # matched terms are de-duplicated and order-preserving: title keywords,
    # then abstract-only keywords, then the matched MeSH descriptor.
    assert rec.matched_keywords == [
        "ischemic stroke",
        "cardioembolic",
        "biomarker",
        "Ischemic Stroke",
    ]


def test_recency_halflife(ranking_config, today):
    rec = Record(
        title="cardioembolic stroke cohort",
        source="pubmed",
        journal="Stroke",
        date="2026-06-12",  # exactly 14 days before fixed today
        abstract="",
    )
    out = _rank_one(rec, ranking_config, today)
    # one halflife -> half of max_points (6.0 -> 3.0)
    assert out.score_breakdown["recency"] == 3.0


def test_missing_date_earns_no_recency(ranking_config, today):
    rec = Record(title="cardioembolic", source="pubmed", journal="", date="", abstract="")
    out = _rank_one(rec, ranking_config, today)
    assert "recency" not in out.score_breakdown


def test_no_keyword_match_low_score(ranking_config, today):
    rec = Record(
        title="Unrelated cardiology paper about valves",
        source="pubmed",
        journal="Some Minor Journal",
        date="2026-06-26",
        abstract="No relevant terms here.",
    )
    out = _rank_one(rec, ranking_config, today)
    # Only recency should contribute; no keyword/mesh/journal points.
    assert "title_keyword" not in out.score_breakdown
    assert "journal_tier" not in out.score_breakdown
    assert out.needs_review is False


def test_rank_records_sorts_descending(ranking_config, today):
    low = Record(title="cardioembolic", source="pubmed", journal="", date="2026-01-01", abstract="")
    high = Record(
        title="ischemic stroke cardioembolic biomarker",
        source="pubmed",
        journal="Lancet",
        date="2026-06-26",
        abstract="randomized controlled trial",
        mesh_terms=["Ischemic Stroke"],
    )
    ranked = rank_records([low, high], ranking_config, KEYWORDS, MESH, today=today)
    assert ranked[0] is high
    assert ranked[0].score > ranked[1].score


def test_helper_keyword_points():
    weights = {"title_keyword": 3.0, "abstract_keyword": 1.0}
    bd, matched = _keyword_points("Stroke Study", "Biomarker findings", ["stroke", "biomarker"], weights)
    assert bd["title_keyword"] == 3.0
    assert bd["abstract_keyword"] == 1.0
    assert matched == ["stroke", "biomarker"]


def test_helper_mesh_points():
    pts, matched = _mesh_points(["Ischemic Stroke"], ["ischemic stroke"], 2.5)
    assert pts == 2.5
    assert matched == ["ischemic stroke"]


def test_helper_boost_points():
    boost_terms = {"randomized controlled trial": 3.0}
    pts = _boost_points("Title", "A randomized controlled trial", boost_terms)
    assert pts == 3.0
