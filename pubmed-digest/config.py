"""Configuration loading and logging setup.

Loads ``config.yaml`` (search profiles + ranking weights) and ``.env`` (secrets
such as the NCBI API key and SMTP credentials). Secrets are ONLY ever read from
the environment -- never from ``config.yaml`` -- so the committed config file is
safe to share.
"""

from __future__ import annotations

import logging
import os
import sys
from pathlib import Path
from typing import Any

import yaml

try:  # python-dotenv is optional at runtime; degrade gracefully if absent
    from dotenv import load_dotenv
except ImportError:  # pragma: no cover - exercised only when dep missing
    def load_dotenv(*_args: Any, **_kwargs: Any) -> bool:
        return False


HERE = Path(__file__).resolve().parent
DEFAULT_CONFIG_PATH = HERE / "config.yaml"
DEFAULT_ENV_PATH = HERE / ".env"


def load_env(env_path: Path | None = None) -> None:
    """Load environment variables from a ``.env`` file if present.

    Real environment variables always take precedence over the file.
    """
    path = env_path or DEFAULT_ENV_PATH
    if path.exists():
        load_dotenv(path, override=False)


def load_config(config_path: Path | None = None) -> dict[str, Any]:
    """Parse and lightly validate ``config.yaml``.

    Fails loudly (raises) on a missing or malformed config rather than guessing
    defaults that could silently change which papers are surfaced.
    """
    path = config_path or DEFAULT_CONFIG_PATH
    if not path.exists():
        raise FileNotFoundError(
            f"Config file not found: {path}. Copy config.yaml from the repo or "
            f"pass --config /path/to/config.yaml."
        )

    with path.open("r", encoding="utf-8") as fh:
        config = yaml.safe_load(fh)

    if not isinstance(config, dict):
        raise ValueError(f"Config at {path} did not parse to a mapping.")

    for required in ("ranking", "topics"):
        if required not in config:
            raise ValueError(f"Config is missing required top-level key: '{required}'")

    if not config["topics"]:
        raise ValueError("Config defines no topics; nothing to search.")

    return config


def get_logger(name: str = "pubmed_digest", level: str | None = None) -> logging.Logger:
    """Return a configured logger that writes to stderr.

    Level can be overridden via the ``LOG_LEVEL`` environment variable so
    scheduled (cron/launchd) runs can be made verbose without code changes.
    """
    logger = logging.getLogger(name)
    if logger.handlers:  # already configured
        return logger

    resolved_level = (level or os.environ.get("LOG_LEVEL", "INFO")).upper()
    handler = logging.StreamHandler(sys.stderr)
    handler.setFormatter(
        logging.Formatter(
            "%(asctime)s  %(levelname)-7s  %(name)s  %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        )
    )
    logger.addHandler(handler)
    logger.setLevel(getattr(logging, resolved_level, logging.INFO))
    logger.propagate = False
    return logger
