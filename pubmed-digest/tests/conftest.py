"""Shared fixtures for the test suite. No network access anywhere in tests."""

from __future__ import annotations

import sys
from datetime import date
from pathlib import Path

import pytest

# Make the project modules importable when running `pytest` from anywhere.
ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from models import Record  # noqa: E402


@pytest.fixture
def ranking_config() -> dict:
    """A compact, self-contained ranking config mirroring config.yaml's shape."""
    return {
        "weights": {
            "title_keyword": 3.0,
            "abstract_keyword": 1.0,
            "mesh_match": 2.5,
        },
        "recency": {"max_points": 6.0, "halflife_days": 14},
        "needs_review_threshold": 14.0,
        "boost_terms": {
            "randomized controlled trial": 3.0,
            "thrombectomy": 2.0,
        },
        "journal_tiers": {
            "5": ["N Engl J Med", "Lancet"],
            "3": ["Stroke", "Neurology"],
            "1": ["J Stroke"],
        },
    }


@pytest.fixture
def today() -> date:
    """Fixed 'today' so recency scoring is deterministic in tests."""
    return date(2026, 6, 26)


@pytest.fixture
def sample_record() -> Record:
    return Record(
        title="Endovascular thrombectomy in cardioembolic ischemic stroke",
        source="pubmed",
        pmid="40000001",
        doi="10.1056/nejm.2026.0001",
        authors=["Smith J", "Doe A", "Roe B"],
        journal="N Engl J Med",
        date="2026-06-26",
        abstract=(
            "This randomized controlled trial evaluated thrombectomy in patients "
            "with cardioembolic ischemic stroke. Biomarker analysis was secondary."
        ),
        url="https://pubmed.ncbi.nlm.nih.gov/40000001/",
        mesh_terms=["Ischemic Stroke", "Thrombectomy"],
        publication_types=["Randomized Controlled Trial"],
    )
