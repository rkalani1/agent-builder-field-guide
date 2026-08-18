import argparse
from unittest.mock import patch, MagicMock
from pathlib import Path
from datetime import datetime
import pytest

from run import run, resolve_window
from models import Record

def test_resolve_window_explicit_both():
    args = argparse.Namespace(since="2026-06-01", until="2026-06-26", date=None)
    since, until, run_date = resolve_window(args, 7)
    assert since == "2026-06-01"
    assert until == "2026-06-26"
    assert run_date == "2026-06-26"

def test_resolve_window_explicit_since():
    with patch("run.datetime") as mock_dt:
        mock_dt.utcnow.return_value = datetime(2026, 6, 26)
        mock_dt.strptime = datetime.strptime
        args = argparse.Namespace(since="2026-06-01", until=None, date=None)
        since, until, run_date = resolve_window(args, 7)
        assert since == "2026-06-01"
        assert until == "2026-06-26"
        assert run_date == "2026-06-26"

def test_resolve_window_date_flag():
    args = argparse.Namespace(since=None, until=None, date="2026-06-26")
    since, until, run_date = resolve_window(args, 7)
    assert since == "2026-06-19"
    assert until == "2026-06-26"
    assert run_date == "2026-06-26"

def test_resolve_window_default():
    with patch("run.datetime") as mock_dt:
        mock_dt.utcnow.return_value = datetime(2026, 6, 26)
        mock_dt.strptime = datetime.strptime
        args = argparse.Namespace(since=None, until=None, date=None)
        since, until, run_date = resolve_window(args, 7)
        assert since == "2026-06-19"
        assert until == "2026-06-26"
        assert run_date == "2026-06-26"

def test_resolve_window_invalid_date():
    args = argparse.Namespace(since="invalid", until=None, date=None)
    with pytest.raises(SystemExit, match="Invalid date"):
        resolve_window(args, 7)

def test_resolve_window_since_after_until():
    args = argparse.Namespace(since="2026-06-27", until="2026-06-26", date=None)
    with pytest.raises(SystemExit, match="is after --until"):
        resolve_window(args, 7)

@pytest.fixture
def mock_config():
    return {
        "defaults": {"date_window_days": 7},
        "ranking": {
            "weights": {"title_keyword": 1.0, "abstract_keyword": 0.5, "mesh_match": 1.0},
            "recency": {"max_points": 2.0, "halflife_days": 7},
            "needs_review_threshold": 5.0,
            "boost_terms": {},
            "journal_tiers": {}
        },
        "preprints": {"enabled": True, "servers": ["medrxiv"]},
        "topics": [
            {
                "name": "Stroke",
                "query": "stroke[tiab]",
                "keywords": ["stroke"],
                "mesh": ["Stroke"]
            }
        ],
        "output": {"dir": "/tmp"}
    }

@patch("run.load_env")
@patch("run.load_config")
@patch("run.PubMedClient")
@patch("run.fetch_topic")
@patch("run.fetch_preprints")
@patch("run.write_digest")
@patch("run.load_seen")
@patch("run.save_seen")
def test_run_happy_path(
    mock_save_seen, mock_load_seen, mock_write_digest,
    mock_fetch_preprints, mock_fetch_topic, mock_pubmed_client,
    mock_load_config, mock_load_env, mock_config
):
    mock_load_config.return_value = mock_config
    mock_load_seen.return_value = set()
    mock_write_digest.return_value = Path("/tmp/digest.md")

    # Mock pubmed results
    mock_fetch_topic.return_value = [
        Record(
            title="Stroke treatment", source="pubmed", pmid="123",
            doi="10.123", authors=["A"], journal="J", date="2026-06-25",
            abstract="test", url="http"
        )
    ]
    # Mock preprint results
    mock_fetch_preprints.return_value = [
        Record(
            title="New stroke marker", source="medrxiv", pmid="",
            doi="10.456", authors=["B"], journal="", date="2026-06-25",
            abstract="stroke", url="http"
        )
    ]

    args = argparse.Namespace(
        date="2026-06-26", since=None, until=None,
        config="config.yaml", output=None, seen="seen.json",
        no_cache=False, email=False
    )

    exit_code = run(args)

    assert exit_code == 0
    mock_fetch_topic.assert_called_once()
    mock_fetch_preprints.assert_called_once()
    mock_write_digest.assert_called_once()
    mock_save_seen.assert_called_once()

    # Verify the items are added to cache
    saved_seen = mock_save_seen.call_args[0][1]
    # PubMed record has a DOI so identity_key returns doi:10.123
    assert "doi:10.123" in saved_seen
    # Preprint uses doi since pmid is empty
    assert "doi:10.456" in saved_seen


@patch("run.load_env")
@patch("run.load_config")
@patch("run.PubMedClient")
@patch("run.fetch_topic")
@patch("run.fetch_preprints")
@patch("run.write_digest")
@patch("run.load_seen")
@patch("run.save_seen")
def test_run_with_seen_cache(
    mock_save_seen, mock_load_seen, mock_write_digest,
    mock_fetch_preprints, mock_fetch_topic, mock_pubmed_client,
    mock_load_config, mock_load_env, mock_config
):
    mock_load_config.return_value = mock_config
    # Already seen the item (mock record has doi:10.123, which identity_key prefers)
    mock_load_seen.return_value = {"doi:10.123"}
    mock_write_digest.return_value = Path("/tmp/digest.md")

    # Mock pubmed results
    mock_fetch_topic.return_value = [
        Record(
            title="Stroke treatment", source="pubmed", pmid="123",
            doi="10.123", authors=["A"], journal="J", date="2026-06-25",
            abstract="test", url="http"
        )
    ]
    mock_fetch_preprints.return_value = []

    args = argparse.Namespace(
        date="2026-06-26", since=None, until=None,
        config="config.yaml", output=None, seen="seen.json",
        no_cache=False, email=False
    )

    exit_code = run(args)

    assert exit_code == 0
    mock_write_digest.assert_called_once()

    saved_seen = mock_save_seen.call_args[0][1]
    # No new items added
    assert saved_seen == {"doi:10.123"}

@patch("run.load_env")
@patch("run.load_config")
@patch("run.PubMedClient")
@patch("run.fetch_topic")
@patch("run.fetch_preprints")
@patch("run.write_digest")
@patch("run.load_seen")
@patch("run.save_seen")
@patch("notify_email.send_digest")
def test_run_with_email_success(
    mock_send_digest, mock_save_seen, mock_load_seen, mock_write_digest,
    mock_fetch_preprints, mock_fetch_topic, mock_pubmed_client,
    mock_load_config, mock_load_env, mock_config
):
    mock_load_config.return_value = mock_config
    mock_load_seen.return_value = set()
    mock_write_digest.return_value = Path("/tmp/digest.md")

    mock_fetch_topic.return_value = []
    mock_fetch_preprints.return_value = []

    args = argparse.Namespace(
        date="2026-06-26", since=None, until=None,
        config="config.yaml", output=None, seen="seen.json",
        no_cache=False, email=True
    )

    exit_code = run(args)
    assert exit_code == 0
    mock_send_digest.assert_called_once()


@patch("run.load_env")
@patch("run.load_config")
@patch("run.PubMedClient")
@patch("run.fetch_topic")
@patch("run.fetch_preprints")
@patch("run.write_digest")
@patch("run.load_seen")
@patch("run.save_seen")
@patch("notify_email.send_digest")
def test_run_with_email_failure(
    mock_send_digest, mock_save_seen, mock_load_seen, mock_write_digest,
    mock_fetch_preprints, mock_fetch_topic, mock_pubmed_client,
    mock_load_config, mock_load_env, mock_config
):
    mock_load_config.return_value = mock_config
    mock_load_seen.return_value = set()
    mock_write_digest.return_value = Path("/tmp/digest.md")

    mock_fetch_topic.return_value = []
    mock_fetch_preprints.return_value = []

    from notify_email import EmailConfigError
    mock_send_digest.side_effect = EmailConfigError("bad config")

    args = argparse.Namespace(
        date="2026-06-26", since=None, until=None,
        config="config.yaml", output=None, seen="seen.json",
        no_cache=False, email=True
    )

    exit_code = run(args)
    assert exit_code == 2
    mock_send_digest.assert_called_once()
    # Cache should not be saved if email fails
    mock_save_seen.assert_not_called()
