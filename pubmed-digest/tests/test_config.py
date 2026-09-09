"""Unit tests for config loading and logging setup."""

from __future__ import annotations

import logging
from pathlib import Path
from unittest.mock import patch

import pytest

from config import DEFAULT_CONFIG_PATH, DEFAULT_ENV_PATH, get_logger, load_config, load_env


def test_load_config_success(tmp_path: Path):
    config_file = tmp_path / "config.yaml"
    config_file.write_text(
        """
ranking:
  weights:
    title_keyword: 3.0
topics:
  - name: "Stroke"
    query: "stroke[tiab]"
""",
        encoding="utf-8",
    )

    cfg = load_config(config_file)
    assert isinstance(cfg, dict)
    assert "ranking" in cfg
    assert len(cfg["topics"]) == 1
    assert cfg["topics"][0]["name"] == "Stroke"


def test_load_config_default_path():
    # If config.yaml exists at DEFAULT_CONFIG_PATH (repo root / pubmed-digest / config.yaml)
    if DEFAULT_CONFIG_PATH.exists():
        cfg = load_config()
        assert "ranking" in cfg
        assert "topics" in cfg
    else:
        with pytest.raises(FileNotFoundError):
            load_config()


def test_load_config_file_not_found(tmp_path: Path):
    non_existent = tmp_path / "non_existent_config.yaml"
    with pytest.raises(FileNotFoundError, match="Config file not found"):
        load_config(non_existent)


def test_load_config_not_a_dict(tmp_path: Path):
    config_file = tmp_path / "invalid.yaml"
    config_file.write_text("- list_item_1\n- list_item_2\n", encoding="utf-8")
    with pytest.raises(ValueError, match="did not parse to a mapping"):
        load_config(config_file)


def test_load_config_missing_required_key(tmp_path: Path):
    # Missing 'topics'
    config_file = tmp_path / "missing_topics.yaml"
    config_file.write_text("ranking:\n  weights: {}\n", encoding="utf-8")
    with pytest.raises(ValueError, match="missing required top-level key: 'topics'"):
        load_config(config_file)

    # Missing 'ranking'
    config_file_2 = tmp_path / "missing_ranking.yaml"
    config_file_2.write_text("topics:\n  - name: test\n", encoding="utf-8")
    with pytest.raises(ValueError, match="missing required top-level key: 'ranking'"):
        load_config(config_file_2)


def test_load_config_empty_topics(tmp_path: Path):
    config_file = tmp_path / "empty_topics.yaml"
    config_file.write_text(
        """
ranking:
  weights: {}
topics: []
""",
        encoding="utf-8",
    )
    with pytest.raises(ValueError, match="Config defines no topics; nothing to search."):
        load_config(config_file)


def test_load_env_file_exists(tmp_path: Path):
    env_file = tmp_path / ".env"
    env_file.write_text("TEST_VAR=123\n", encoding="utf-8")
    with patch("config.load_dotenv") as mock_load_dotenv:
        load_env(env_file)
        mock_load_dotenv.assert_called_once_with(env_file, override=False)


def test_load_env_file_not_exists(tmp_path: Path):
    non_existent = tmp_path / ".env.missing"
    with patch("config.load_dotenv") as mock_load_dotenv:
        load_env(non_existent)
        mock_load_dotenv.assert_not_called()


def test_get_logger_creation(monkeypatch):
    monkeypatch.delenv("LOG_LEVEL", raising=False)
    logger_name = "test_logger_unique_1"
    logger = get_logger(logger_name, level="DEBUG")
    assert logger.name == logger_name
    assert logger.level == logging.DEBUG
    assert len(logger.handlers) == 1
    assert isinstance(logger.handlers[0], logging.StreamHandler)

    # Calling get_logger again returns the existing configured logger without duplicate handlers
    logger_again = get_logger(logger_name, level="INFO")
    assert logger_again is logger
    assert len(logger_again.handlers) == 1


def test_get_logger_env_level(monkeypatch):
    monkeypatch.setenv("LOG_LEVEL", "WARNING")
    logger_name = "test_logger_unique_2"
    logger = get_logger(logger_name)
    assert logger.level == logging.WARNING
