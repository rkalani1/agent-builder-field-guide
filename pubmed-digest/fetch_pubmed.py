"""Fetch publications from PubMed via NCBI E-utilities (esearch + efetch).

Design notes
------------
* Two-step protocol: ``esearch`` returns PMIDs for a query + date window, then
  ``efetch`` returns full XML records which we parse with the stdlib XML parser
  (no extra dependency).
* Rate limiting: NCBI allows 3 requests/sec without an API key and 10/sec with
  one. We honor the appropriate limit automatically based on whether
  ``NCBI_API_KEY`` is set in the environment.
* Hallucination resistance: we only ever emit fields that are present in the
  returned XML. Missing abstracts/DOIs become empty -- never invented.
* Fail loudly: HTTP and parse errors raise (with context) so a scheduled run
  visibly fails instead of silently producing an empty digest.
"""

from __future__ import annotations

import time
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from typing import Any

import requests

from config import get_logger
from models import Record

log = get_logger(__name__)

EUTILS_BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils"
PUBMED_URL_TMPL = "https://pubmed.ncbi.nlm.nih.gov/{pmid}/"
TOOL_NAME = "uw-stroke-literature-digest"


@dataclass
class PubMedClient:
    """Thin, rate-limited client around the E-utilities endpoints."""

    api_key: str | None = None
    email: str | None = None
    timeout: int = 30
    max_retries: int = 4

    def __post_init__(self) -> None:
        # 3 req/s without a key, 10 req/s with one. Add a small safety margin.
        self._min_interval = 0.34 if not self.api_key else 0.11
        self._last_request = 0.0
        self._session = requests.Session()
        self._session.headers.update({"User-Agent": f"{TOOL_NAME} (mailto:{self.email or 'unknown'})"})

    # ------------------------------------------------------------------ #
    def _throttle(self) -> None:
        elapsed = time.monotonic() - self._last_request
        if elapsed < self._min_interval:
            time.sleep(self._min_interval - elapsed)
        self._last_request = time.monotonic()

    def _common_params(self) -> dict[str, str]:
        params = {"tool": TOOL_NAME, "db": "pubmed"}
        if self.api_key:
            params["api_key"] = self.api_key
        if self.email:
            params["email"] = self.email
        return params

    def _get(self, endpoint: str, params: dict[str, Any]) -> requests.Response:
        """Issue a throttled GET with exponential-backoff retry on transient errors."""
        url = f"{EUTILS_BASE}/{endpoint}"
        last_exc: Exception | None = None
        for attempt in range(self.max_retries):
            self._throttle()
            try:
                resp = self._session.get(url, params=params, timeout=self.timeout)
                # 429 / 5xx are transient -> retry; other 4xx are fatal.
                if resp.status_code in (429, 500, 502, 503, 504):
                    raise requests.HTTPError(f"Transient HTTP {resp.status_code}")
                resp.raise_for_status()
                return resp
            except (requests.RequestException, requests.HTTPError) as exc:
                last_exc = exc
                backoff = 2 ** attempt
                log.warning(
                    "E-utilities %s attempt %d/%d failed (%s); retrying in %ds",
                    endpoint, attempt + 1, self.max_retries, exc, backoff,
                )
                time.sleep(backoff)
        raise RuntimeError(f"E-utilities {endpoint} failed after {self.max_retries} attempts") from last_exc

    # ------------------------------------------------------------------ #
    def esearch(self, query: str, since: str, until: str, retmax: int) -> list[str]:
        """Return PMIDs for *query* published between *since* and *until* (inclusive).

        Dates are explicit ``YYYY/MM/DD`` strings passed straight to NCBI's
        ``mindate``/``maxdate`` -- we never infer a "now" date implicitly.
        """
        params = {
            **self._common_params(),
            "term": query,
            "retmax": str(retmax),
            "retmode": "json",
            "datetype": "edat",  # Entrez date == when the record entered PubMed
            "mindate": since.replace("-", "/"),
            "maxdate": until.replace("-", "/"),
        }
        resp = self._get("esearch.fcgi", params)
        try:
            data = resp.json()
            id_list = data["esearchresult"]["idlist"]
        except (ValueError, KeyError) as exc:
            raise RuntimeError(f"Unexpected esearch response shape: {exc}") from exc
        log.info("esearch returned %d PMIDs for query window %s..%s", len(id_list), since, until)
        return list(id_list)

    def efetch(self, pmids: list[str]) -> list[Record]:
        """Fetch and parse full records for the given PMIDs."""
        if not pmids:
            return []
        records: list[Record] = []
        # Batch to keep URLs/response sizes sane.
        for batch in _chunks(pmids, 100):
            params = {
                **self._common_params(),
                "id": ",".join(batch),
                "retmode": "xml",
                "rettype": "abstract",
            }
            resp = self._get("efetch.fcgi", params)
            records.extend(_parse_pubmed_xml(resp.content))
        log.info("efetch parsed %d records from %d PMIDs", len(records), len(pmids))
        return records


# ---------------------------------------------------------------------- #
# XML parsing helpers
# ---------------------------------------------------------------------- #
def _parse_pubmed_xml(xml_bytes: bytes) -> list[Record]:
    try:
        root = ET.fromstring(xml_bytes)
    except ET.ParseError as exc:
        raise RuntimeError(f"Failed to parse PubMed XML: {exc}") from exc

    records: list[Record] = []
    for article in root.findall(".//PubmedArticle"):
        records.append(_parse_article(article))
    return records


def _text(node: ET.Element | None) -> str:
    return (node.text or "").strip() if node is not None else ""


def _parse_article(article: ET.Element) -> Record:
    medline = article.find("MedlineCitation")
    art = medline.find("Article") if medline is not None else None

    pmid = _text(medline.find("PMID")) if medline is not None else ""

    # --- Title ---
    title = ""
    if art is not None:
        title = "".join(art.find("ArticleTitle").itertext()).strip() if art.find("ArticleTitle") is not None else ""

    # --- Abstract (may have multiple labeled sections) ---
    abstract_parts: list[str] = []
    if art is not None:
        for ab in art.findall(".//Abstract/AbstractText"):
            label = ab.get("Label")
            text = "".join(ab.itertext()).strip()
            if not text:
                continue
            abstract_parts.append(f"{label}: {text}" if label else text)
    abstract = "\n".join(abstract_parts)

    # --- Journal & date ---
    journal = ""
    date = ""
    if art is not None:
        journal_node = art.find(".//Journal/ISOAbbreviation")
        if journal_node is None:
            journal_node = art.find(".//Journal/Title")
        journal = _text(journal_node)
        date = _extract_date(art)

    # --- Authors ---
    authors: list[str] = []
    if art is not None:
        for author in art.findall(".//AuthorList/Author"):
            last = _text(author.find("LastName"))
            initials = _text(author.find("Initials"))
            collective = _text(author.find("CollectiveName"))
            if collective:
                authors.append(collective)
            elif last:
                authors.append(f"{last} {initials}".strip())

    # --- DOI (from ELocationID or ArticleIdList) ---
    doi = _extract_doi(article)

    # --- MeSH terms ---
    mesh_terms: list[str] = []
    if medline is not None:
        for mesh in medline.findall(".//MeshHeadingList/MeshHeading/DescriptorName"):
            term = _text(mesh)
            if term:
                mesh_terms.append(term)

    # --- Publication types (e.g., Randomized Controlled Trial) ---
    pub_types: list[str] = []
    if art is not None:
        for pt in art.findall(".//PublicationTypeList/PublicationType"):
            t = _text(pt)
            if t:
                pub_types.append(t)

    return Record(
        title=title,
        source="pubmed",
        pmid=pmid or None,
        doi=doi,
        authors=authors,
        journal=journal,
        date=date,
        abstract=abstract,
        url=PUBMED_URL_TMPL.format(pmid=pmid) if pmid else "",
        mesh_terms=mesh_terms,
        publication_types=pub_types,
    )


def _extract_doi(article: ET.Element) -> str | None:
    for eid in article.findall(".//ArticleIdList/ArticleId"):
        if eid.get("IdType") == "doi" and eid.text:
            return eid.text.strip().lower()
    for eid in article.findall(".//ELocationID"):
        if eid.get("EIdType") == "doi" and eid.text:
            return eid.text.strip().lower()
    return None


def _extract_date(art: ET.Element) -> str:
    """Return an ISO date string, preferring the most specific available source.

    Order of preference: ArticleDate (electronic pub) -> Journal PubDate. Only
    the parts the XML actually provides are used; a missing day defaults to 01
    and a missing month to 01, but a missing year yields an empty string (we do
    not invent a publication year).
    """
    node = art.find(".//ArticleDate")
    if node is None:
        node = art.find(".//Journal/JournalIssue/PubDate")
    if node is None:
        return ""

    year = _text(node.find("Year"))
    if not year:
        # Some PubDate entries only carry a free-text MedlineDate like "2024 Jan".
        medline_date = _text(node.find("MedlineDate"))
        year = medline_date[:4] if medline_date[:4].isdigit() else ""
        if not year:
            return ""
        return f"{year}-01-01"

    month = _normalize_month(_text(node.find("Month"))) or "01"
    day = _text(node.find("Day")).zfill(2) if _text(node.find("Day")) else "01"
    return f"{year}-{month}-{day}"


_MONTHS = {
    "jan": "01", "feb": "02", "mar": "03", "apr": "04", "may": "05", "jun": "06",
    "jul": "07", "aug": "08", "sep": "09", "oct": "10", "nov": "11", "dec": "12",
}


def _normalize_month(raw: str) -> str:
    if not raw:
        return ""
    if raw.isdigit():
        return raw.zfill(2)
    return _MONTHS.get(raw[:3].lower(), "")


def _chunks(seq: list[str], size: int):
    for i in range(0, len(seq), size):
        yield seq[i : i + size]


# ---------------------------------------------------------------------- #
def fetch_topic(
    client: PubMedClient,
    query: str,
    since: str,
    until: str,
    retmax: int,
) -> list[Record]:
    """Convenience wrapper: esearch + efetch for one topic query."""
    pmids = client.esearch(query=query, since=since, until=until, retmax=retmax)
    return client.efetch(pmids)
