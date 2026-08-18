import argparse
import pytest
from datetime import datetime
from unittest.mock import patch

from run import resolve_window

@pytest.fixture
def mock_datetime():
    with patch('run.datetime') as mock_dt:
        mock_dt.utcnow.return_value = datetime(2026, 6, 26, 12, 0, 0)
        mock_dt.strptime = datetime.strptime
        yield mock_dt

def create_args(since=None, until=None, date=None):
    return argparse.Namespace(since=since, until=until, date=date)

def test_resolve_window_explicit_since_and_until(mock_datetime):
    args = create_args(since="2026-06-01", until="2026-06-26")
    since, until, run_date = resolve_window(args, 7)
    assert since == "2026-06-01"
    assert until == "2026-06-26"
    assert run_date == "2026-06-26"

def test_resolve_window_explicit_since_only(mock_datetime):
    args = create_args(since="2026-06-01")
    since, until, run_date = resolve_window(args, 7)
    assert since == "2026-06-01"
    assert until == "2026-06-26"
    assert run_date == "2026-06-26"

def test_resolve_window_explicit_until_only(mock_datetime):
    args = create_args(until="2026-06-20")
    since, until, run_date = resolve_window(args, 7)
    assert since == "2026-06-13"
    assert until == "2026-06-20"
    assert run_date == "2026-06-20"

def test_resolve_window_date_only(mock_datetime):
    args = create_args(date="2026-06-20")
    since, until, run_date = resolve_window(args, 5)
    assert since == "2026-06-15"
    assert until == "2026-06-20"
    assert run_date == "2026-06-20"

def test_resolve_window_no_args(mock_datetime):
    args = create_args()
    since, until, run_date = resolve_window(args, 10)
    assert since == "2026-06-16"
    assert until == "2026-06-26"
    assert run_date == "2026-06-26"

def test_resolve_window_invalid_date_format():
    args = create_args(since="06/01/2026")
    with pytest.raises(SystemExit, match="Invalid date '06/01/2026'; expected YYYY-MM-DD"):
        resolve_window(args, 7)

def test_resolve_window_since_after_until():
    args = create_args(since="2026-06-26", until="2026-06-01")
    with pytest.raises(SystemExit, match="--since \\(2026-06-26\\) is after --until \\(2026-06-01\\)"):
        resolve_window(args, 7)
