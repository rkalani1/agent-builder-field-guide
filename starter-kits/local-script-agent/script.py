"""
Local Script Agent — Python example (INERT BY DEFAULT)

This script exits immediately unless OPERATOR_APPROVED_TO_RUN=1 is set.
It prints what it WOULD do before doing anything.
It never writes outside ./sandbox/.
It never makes network calls in the inert default mode.
No real secrets are included — use OPENAI_API_KEY=sk-REPLACE_ME as a placeholder.

Reference:  /agents-automations/
docs/platforms/local-scripts.md

# manual-only example (do NOT enable without completing the full launch checklist):
# 0 9 * * 1 OPERATOR_APPROVED_TO_RUN=1 /path/to/venv/bin/python /path/to/script.py >> /var/log/notes-summary.log 2>&1
"""

from __future__ import annotations

import os
import sys
import pathlib
import itertools
from concurrent.futures import ThreadPoolExecutor

# ---------------------------------------------------------------------------
# SAFETY GATE
# ---------------------------------------------------------------------------
APPROVED = os.getenv("OPERATOR_APPROVED_TO_RUN", "0") == "1"

if not APPROVED:
    print("=" * 60)
    print("DRY-RUN MODE — This script will NOT make any API calls.")
    print("Set OPERATOR_APPROVED_TO_RUN=1 to enable live execution.")
    print("=" * 60)
    print()
    print("What this script WOULD do if enabled:")
    print("  1. Read OPENAI_API_KEY from the environment.")
    print("  2. Find all .txt and .md files in ./sandbox/notes/.")
    print("  3. Read each file (up to MAX_FILES=50).")
    print("  4. Send the contents to the OpenAI chat completions API")
    print("     with the summarization system prompt.")
    print("  5. Print the summary to stdout.")
    print("  6. Write the summary to ./sandbox/output/summary.md.")
    print()
    print("Sandbox directory: ./sandbox/")
    print("No files outside ./sandbox/ would be read or written.")
    print("No other network calls would be made.")
    sys.exit(0)

# ---------------------------------------------------------------------------
# API KEY CHECK
# ---------------------------------------------------------------------------
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    print("ERROR: OPENAI_API_KEY environment variable is not set.", file=sys.stderr)
    print("Example: export OPENAI_API_KEY=sk-REPLACE_ME", file=sys.stderr)
    sys.exit(1)

# ---------------------------------------------------------------------------
# IMPORTS (only reached when OPERATOR_APPROVED_TO_RUN=1)
# ---------------------------------------------------------------------------
from openai import OpenAI

# ---------------------------------------------------------------------------
# CONSTANTS
# ---------------------------------------------------------------------------
MAX_FILES = 50
SANDBOX_DIR = pathlib.Path("./sandbox").resolve()
NOTES_DIR = SANDBOX_DIR / "notes"
OUTPUT_DIR = SANDBOX_DIR / "output"

SYSTEM_PROMPT = """\
You are a note summarization assistant. Read the plain-text notes provided
in the user message and produce a structured summary (300-500 words) of key
themes, decisions, and action items. Do not add information not present in
the notes. Output format: markdown with sections for Themes, Decisions,
and Action Items.
"""

# ---------------------------------------------------------------------------
# SANDBOX ENFORCEMENT
# ---------------------------------------------------------------------------
def safe_read(path: pathlib.Path) -> str:
    """Read a file only if it is inside SANDBOX_DIR."""
    try:
        resolved = path.resolve(strict=True)
    except FileNotFoundError:
        # If the file doesn't exist, we can't read it anyway.
        # But for security, we want to fail fast before any symlink attacks.
        raise PermissionError(f"File not found or invalid path: {path}")

    if not resolved.is_relative_to(SANDBOX_DIR):
        raise PermissionError(
            f"Attempted to read outside sandbox: {resolved}"
        )
    return resolved.read_text(encoding="utf-8", errors="ignore")


def read_note_files(note_files: list[pathlib.Path]) -> tuple[str, list[str]]:
    """Read contents of note files and return combined text and warnings."""
    combined: list[str] = []
    warnings = []

    def read_one(f: pathlib.Path) -> tuple[str | None, str | None]:
        try:
            content = safe_read(f)
            return f"--- {f.name} ---\n{content}", None
        except PermissionError as e:
            return None, str(e)
        except Exception as e:
            return None, f"Skipped {f.name}: {e}"

    with ThreadPoolExecutor() as executor:
        for content, warning in executor.map(read_one, note_files):
            if content is not None:
                combined.append(content)
            if warning is not None:
                warnings.append(warning)
                print(f"WARNING: {warning}", file=sys.stderr)

    return "\n\n".join(combined), warnings

def generate_summary(user_message: str, model: str, api_key: str) -> str:
    """Generate a summary of the notes using the OpenAI API."""
    print(f"Calling OpenAI API for summarization with model={model}...")
    client = OpenAI(api_key=api_key)
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_message},
        ],
        max_tokens=1024,
    )
    return response.choices[0].message.content or ""

# ---------------------------------------------------------------------------
# MAIN
# ---------------------------------------------------------------------------
def main() -> None:
    if not NOTES_DIR.is_dir():
        print(f"ERROR: Notes directory not found: {NOTES_DIR}", file=sys.stderr)
        print("Create ./sandbox/notes/ and add .txt files.", file=sys.stderr)
        sys.exit(1)

    note_files = list(
        itertools.islice(
            itertools.chain(NOTES_DIR.glob("*.txt"), NOTES_DIR.glob("*.md")),
            MAX_FILES
        )
    )

    if not note_files:
        print("ERROR: No .txt or .md files found in ./sandbox/notes/", file=sys.stderr)
        sys.exit(1)

    print(f"Found {len(note_files)} note file(s). Reading...")

    user_message, warnings = read_note_files(note_files)

    if not user_message:
        print("ERROR: No files could be read.", file=sys.stderr)
        sys.exit(1)

    # Model is read from OPENAI_MODEL so the script doesn't go stale when
    # vendors retire model IDs. See docs/model-freshness.md in the guide.
    model = os.getenv("OPENAI_MODEL")
    if not model:
        print("ERROR: OPENAI_MODEL is not set. Pick a current model from", file=sys.stderr)
        print("https://platform.openai.com/docs/models and export it, e.g.:", file=sys.stderr)
        print("  export OPENAI_MODEL=<model-id>", file=sys.stderr)
        sys.exit(1)

    summary = generate_summary(user_message, model, api_key)

    print("\n--- SUMMARY ---\n")
    print(summary)

    if warnings:
        print("\n--- WARNINGS ---")
        for w in warnings:
            print(f"  - {w}")

    # Write output
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    output_path = OUTPUT_DIR / "summary.md"
    output_path.write_text(summary, encoding="utf-8")
    print(f"\nSummary written to: {output_path}")


if __name__ == "__main__":
    main()
