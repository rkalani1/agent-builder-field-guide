"""Optional medRxiv / bioRxiv preprint fetcher.

The public bioRxiv/medRxiv API (https://api.biorxiv.org) is date-range based, not
keyword-searchable, so we fetch the published window and filter locally against
each topic's keywords. This is a deliberately simple, dependency-light approach.

Disabled by default in ``config.yaml`` (``preprints.enabled: false``) because a
weekly window can be large; enable it when you want preprint coverage.
"""

from __future__ import annotations

import time
from dataclasses import dataclass

import requests

from config import get_logger
from models import Record

log = get_logger(__name__)

BIORXIV_BASE = "https://api.biorxiv.org/details"
DOI_URL_TMPL = "https://doi.org/{doi}"


@dataclass
class PreprintClient:
    timeout: int = 30
    max_retries: int = 4
    page_size: int = 100  # API returns 100 records per cursor page

    def __post_init__(self) -> None:
        self._session = requests.Session()
        self._session.headers.update({"User-Agent": "uw-stroke-literature-digest"})

    def _get(self, url: str) -> dict:
        last_exc: Exception | None = None
        for attempt in range(self.max_retries):
            try:
                resp = self._session.get(url, timeout=self.timeout)
                if resp.status_code in (429, 500, 502, 503, 504):
                    raise requests.HTTPError(f"Transient HTTP {resp.status_code}")
                resp.raise_for_status()
                return resp.json()
            except (requests.RequestException, ValueError) as exc:
                last_exc = exc
                backoff = 2 ** attempt
                log.warning(
                    "%s server attempt %d/%d failed (%s); retrying in %ds",
                    url, attempt + 1, self.max_retries, exc, backoff,
                )
                time.sleep(backoff)
        raise RuntimeError(f"Preprint fetch failed after {self.max_retries} attempts: {url}") from last_exc

    def fetch_server(self, server: str, since: str, until: str) -> list[Record]:
        """Fetch all preprints from *server* ("medrxiv" or "biorxiv") in window."""
        records: list[Record] = []
        cursor = 0
        while True:
            url = f"{BIORXIV_BASE}/{server}/{since}/{until}/{cursor}"
            data = self._get(url)
            collection = data.get("collection", [])
            for item in collection:
                records.append(_parse_preprint(item, server))
            messages = data.get("messages", [{}])
            total = int(messages[0].get("total", 0)) if messages else 0
            cursor += len(collection)
            if not collection or cursor >= total:
                break
        log.info("Fetched %d %s preprints for window %s..%s", len(records), server, since, until)
        return records


def _parse_preprint(item: dict, server: str) -> Record:
    doi = (item.get("doi") or "").strip().lower() or None
    authors_raw = item.get("authors", "")
    # API returns authors as a single "Last F.; Last F." string.
    authors = [a.strip() for a in authors_raw.split(";") if a.strip()]
    return Record(
        title=(item.get("title") or "").strip(),
        source=server,
        pmid=None,
        doi=doi,
        authors=authors,
        journal=f"{server} (preprint)",
        date=(item.get("date") or "").strip(),  # API already gives ISO YYYY-MM-DD
        abstract=(item.get("abstract") or "").strip(),
        url=DOI_URL_TMPL.format(doi=doi) if doi else "",
        mesh_terms=[],
        publication_types=["Preprint"],
    )


def fetch_preprints(
    servers: list[str],
    since: str,
    until: str,
    timeout: int = 30,
) -> list[Record]:
    """Fetch preprints from the requested servers for the given window."""
    client = PreprintClient(timeout=timeout)
    out: list[Record] = []
    for server in servers:
        if server not in ("medrxiv", "biorxiv"):
            log.warning("Skipping unknown preprint server: %s", server)
            continue
        out.extend(client.fetch_server(server, since, until))
    return out


def filter_by_keywords(records: list[Record], keywords: list[str]) -> list[Record]:
    """Keep only preprints whose title or abstract mentions any keyword.

    Case-insensitive substring match. Keeps the pipeline honest: a preprint is
    only surfaced if the source text actually contains a topic keyword.
    """
    if not keywords:
        return records
    lowered = [k.lower() for k in keywords]
    kept: list[Record] = []
    for rec in records:
        haystack = f"{rec.title}\n{rec.abstract}".lower()
        if any(k in haystack for k in lowered):
            kept.append(rec)
    log.info("Keyword filter kept %d/%d preprints", len(kept), len(records))
    return kept
