"""De-duplicate records across sources by DOI, then PMID, then normalized title.

The same paper frequently appears as both a PubMed record and a medRxiv/bioRxiv
preprint. We collapse those into a single record, preferring the most complete /
peer-reviewed version while preserving the union of useful metadata.
"""

from __future__ import annotations

from config import get_logger
from models import Record, normalize_title

log = get_logger(__name__)

# Lower index == higher preference when choosing the "primary" of a dup group.
_SOURCE_PRIORITY = {"pubmed": 0, "medrxiv": 1, "biorxiv": 1}


def _dup_key(record: Record) -> str:
    """The key used to detect duplicates: DOI > PMID > normalized title."""
    if record.doi:
        return f"doi:{record.doi.strip().lower()}"
    if record.pmid:
        return f"pmid:{record.pmid.strip()}"
    return f"title:{normalize_title(record.title)}"


def _source_rank(record: Record) -> int:
    return _SOURCE_PRIORITY.get(record.source, 9)


def _merge(primary: Record, other: Record) -> Record:
    """Fold *other*'s metadata into *primary* without overwriting good data.

    Empty fields on the primary are backfilled from the other record; the
    higher relevance score is kept. No field is ever fabricated -- we only copy
    values that already exist on one of the two real records.
    """
    primary.doi = primary.doi or other.doi
    primary.pmid = primary.pmid or other.pmid
    primary.abstract = primary.abstract or other.abstract
    primary.journal = primary.journal or other.journal
    primary.date = primary.date or other.date
    primary.url = primary.url or other.url
    if not primary.authors:
        primary.authors = other.authors
    # Union of MeSH terms / publication types, order-preserving.
    primary.mesh_terms = list(dict.fromkeys([*primary.mesh_terms, *other.mesh_terms]))
    primary.publication_types = list(
        dict.fromkeys([*primary.publication_types, *other.publication_types])
    )
    if other.score > primary.score:
        primary.score = other.score
        primary.score_breakdown = other.score_breakdown
        primary.needs_review = other.needs_review
    return primary


def dedupe(records: list[Record]) -> list[Record]:
    """Collapse duplicates, preferring peer-reviewed (PubMed) versions.

    Returns a new list; input order is otherwise preserved (first occurrence of
    each key wins its slot). Deterministic for a given input ordering.
    """
    groups: dict[str, Record] = {}
    order: list[str] = []

    for rec in records:
        key = _dup_key(rec)
        if key not in groups:
            groups[key] = rec
            order.append(key)
            continue
        existing = groups[key]
        # Choose the preferred source as primary, merge the other into it.
        if _source_rank(rec) < _source_rank(existing):
            merged = _merge(rec, existing)
            groups[key] = merged
        else:
            groups[key] = _merge(existing, rec)

    deduped = [groups[k] for k in order]
    removed = len(records) - len(deduped)
    if removed:
        log.info("Dedupe removed %d duplicate record(s) (%d -> %d)", removed, len(records), len(deduped))
    return deduped
