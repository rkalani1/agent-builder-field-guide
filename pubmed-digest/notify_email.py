"""Optional email delivery of the digest via SMTP.

Default OFF. All credentials are read **only** from environment variables --
nothing sensitive is ever read from ``config.yaml`` or hardcoded:

    SMTP_HOST       e.g. smtp.gmail.com
    SMTP_PORT       e.g. 587  (STARTTLS) or 465 (SSL)
    SMTP_USERNAME   login user
    SMTP_PASSWORD   app password / token
    SMTP_FROM       From: address (defaults to SMTP_USERNAME)
    SMTP_TO         comma-separated recipient list
    SMTP_USE_SSL    "true" to use implicit SSL (port 465) instead of STARTTLS

Markdown is sent as a text/plain part plus a minimal HTML part so it is
readable in any client.
"""

from __future__ import annotations

import os
import smtplib
import ssl
from email.message import EmailMessage

from config import get_logger

log = get_logger(__name__)


class EmailConfigError(RuntimeError):
    """Raised when email is requested but required env vars are missing."""


def _require(name: str) -> str:
    val = os.environ.get(name)
    if not val:
        raise EmailConfigError(
            f"Email sending requested but environment variable {name} is not set. "
            f"Set SMTP_* vars (see .env.example) or disable email."
        )
    return val


def _markdown_to_basic_html(markdown: str) -> str:
    """A deliberately tiny Markdown->HTML shim (no extra dependency).

    We escape HTML and wrap the text in <pre> so the digest stays readable.
    The Markdown source is the source of truth; this is only for email clients.
    """
    import html

    return f"<html><body><pre style='font-family:monospace;white-space:pre-wrap'>{html.escape(markdown)}</pre></body></html>"


def send_digest(markdown: str, subject: str) -> None:
    """Send *markdown* as an email. Raises ``EmailConfigError`` on missing creds.

    Fails loudly on SMTP errors so a scheduled run does not silently drop the
    digest.
    """
    host = _require("SMTP_HOST")
    port = int(os.environ.get("SMTP_PORT", "587"))
    username = _require("SMTP_USERNAME")
    password = _require("SMTP_PASSWORD")
    sender = os.environ.get("SMTP_FROM") or username
    recipients_raw = _require("SMTP_TO")
    recipients = [r.strip() for r in recipients_raw.split(",") if r.strip()]
    use_ssl = os.environ.get("SMTP_USE_SSL", "false").lower() in ("1", "true", "yes")

    if not recipients:
        raise EmailConfigError("SMTP_TO did not contain any valid recipients.")

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = sender
    msg["To"] = ", ".join(recipients)
    msg.set_content(markdown)
    msg.add_alternative(_markdown_to_basic_html(markdown), subtype="html")

    log.info("Sending digest email to %d recipient(s) via %s:%d", len(recipients), host, port)
    context = ssl.create_default_context()
    if use_ssl:
        with smtplib.SMTP_SSL(host, port, context=context, timeout=30) as server:
            server.login(username, password)
            server.send_message(msg)
    else:
        with smtplib.SMTP(host, port, timeout=30) as server:
            server.starttls(context=context)
            server.login(username, password)
            server.send_message(msg)
    log.info("Digest email sent.")
