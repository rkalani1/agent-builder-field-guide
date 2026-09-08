"""Shared data model for the literature-monitoring pipeline.

A single, explicit ``Record`` dataclass is used across every stage of the
pipeline (fetch -> dedupe -> rank -> digest). Keeping one structured type
makes the data flow auditable and helps guarantee we only ever emit fields
that an upstream API actually returned (hallucination resistance).
"""

from __future__ import annotations

from dataclasses import dataclass, field, asdict
from typing import Any


@dataclass
class Record:
    """A single publication or preprint record.

    Every field maps directly to data returned by an upstream API. Fields that
    an API did not provide are left empty (``None`` / empty string / empty
    list) -- they are never fabricated.
    """

    # --- Core bibliographic identity (from the source API) ---------------
    title: str
    source: str  # one of: "pubmed", "medrxiv", "biorxiv"
    pmid: str | None = None
    doi: str | None = None
    authors: list[str] = field(default_factory=list)
    journal: str = ""
    date: str = ""  # ISO-8601 "YYYY-MM-DD"; empty if the API gave nothing
    abstract: str = ""
    url: str = ""
    mesh_terms: list[str] = field(default_factory=list)
    publication_types: list[str] = field(default_factory=list)

    # --- Pipeline-derived annotations (computed locally) ----------------
    topic: str | None = None
    score: float = 0.0
    score_breakdown: dict[str, float] = field(default_factory=dict)
    matched_keywords: list[str] = field(default_factory=list)
    needs_review: bool = False

    # ----------------------------------------------------------------- #
    def identity_key(self) -> str:
        """Best stable identifier for caching / seen-tracking.

        Prefers DOI, then PMID, then a normalized title. Always returns a
        non-empty string so the record can be tracked.
        """
        if self.doi:
            return f"doi:{self.doi.strip().lower()}"
        if self.pmid:
            return f"pmid:{self.pmid.strip()}"
        return f"title:{normalize_title(self.title)}"

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "Record":
        """Rebuild a Record from a plain dict, ignoring unknown keys."""
        allowed = {f for f in cls.__dataclass_fields__}  # type: ignore[attr-defined]
        return cls(**{k: v for k, v in data.items() if k in allowed})


def normalize_title(title: str) -> str:
    """Normalize a title for fuzzy matching / dedup.

    Lowercase, strip punctuation, collapse whitespace. Deterministic and
    dependency-free so tests can rely on exact output.
    """
    import re

    text = (title or "").lower()
    text = re.sub(r"[^a-z0-9 ]+", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text
