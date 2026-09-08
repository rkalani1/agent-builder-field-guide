"""
OpenAI Agents SDK — Python example agent (INERT BY DEFAULT)

This script exits immediately unless OPERATOR_APPROVED_TO_RUN=1 is set.
It prints what it WOULD do before doing anything.
It never writes outside ./sandbox/.
It never makes network calls in the inert default mode.
No real secrets are included — use OPENAI_API_KEY=sk-REPLACE_ME as a placeholder.

Reference: https://github.com/openai/openai-agents-python
"""

import os
import sys

# ---------------------------------------------------------------------------
# SAFETY GATE: exit immediately unless explicitly approved
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
    print("  2. Register the read_notes() function as a tool.")
    print("  3. Create an Agent with the summarization system prompt.")
    print("  4. Run the agent against ./sandbox/notes/.")
    print("  5. Print the resulting summary to stdout.")
    print()
    print("Sandbox directory that would be used: ./sandbox/")
    print("No files would be created, modified, or deleted.")
    print("No network calls would be made except to the OpenAI API.")
    sys.exit(0)

# ---------------------------------------------------------------------------
# API KEY CHECK
# ---------------------------------------------------------------------------
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    print("ERROR: OPENAI_API_KEY environment variable is not set.", file=sys.stderr)
    print("Set it to your OpenAI API key before running this script.", file=sys.stderr)
    print("Example: export OPENAI_API_KEY=sk-REPLACE_ME", file=sys.stderr)
    sys.exit(1)

# ---------------------------------------------------------------------------
# IMPORTS (only reached when OPERATOR_APPROVED_TO_RUN=1)
# ---------------------------------------------------------------------------
import pathlib

from agents import Agent, Runner, function_tool  # openai-agents-python

# ---------------------------------------------------------------------------
# SANDBOX ENFORCEMENT
# ---------------------------------------------------------------------------
SANDBOX_DIR = pathlib.Path("./sandbox").resolve()


def _safe_path(path: str) -> pathlib.Path:
    """Resolve path and reject anything outside SANDBOX_DIR."""
    resolved = (SANDBOX_DIR / path).resolve()
    if not resolved.is_relative_to(SANDBOX_DIR):
        raise PermissionError(
            f"Path '{path}' resolves outside sandbox directory '{SANDBOX_DIR}'. "
            "Access denied."
        )
    return resolved


# ---------------------------------------------------------------------------
# TOOL DEFINITION
# ---------------------------------------------------------------------------
def _read_notes_impl(path: str) -> str:
    """Core implementation for reading a note file."""
    safe = _safe_path(path)
    if not safe.is_file():
        raise FileNotFoundError(f"File not found in sandbox: {path}")
    return safe.read_text(encoding="utf-8")

@function_tool
def read_notes(path: str) -> str:
    """
    Read a plain-text note file from the sandbox directory.

    Args:
        path: Relative path to the file within the sandbox directory.

    Returns:
        The file contents as a string.

    Raises:
        PermissionError: If path resolves outside the sandbox.
        FileNotFoundError: If the file does not exist.
    """
    return _read_notes_impl(path)


# ---------------------------------------------------------------------------
# AGENT DEFINITION
# ---------------------------------------------------------------------------
SYSTEM_PROMPT = """\
You are a note summarization assistant. Read the plain-text files provided \
via the read_notes tool and produce a structured summary (300-500 words) of \
key themes, decisions, and action items. Do not add information not present \
in the source files. Output format: markdown.
"""

summarizer_agent = Agent(
    name="NotesSummarizer",
    instructions=SYSTEM_PROMPT,
    tools=[read_notes],
)

# ---------------------------------------------------------------------------
# MAIN
# ---------------------------------------------------------------------------
def get_note_files() -> list[pathlib.Path]:
    """Discover and validate note files in the sandbox directory."""
    notes_dir = SANDBOX_DIR / "notes"
    if not notes_dir.is_dir():
        print(f"ERROR: Sandbox notes directory not found: {notes_dir}", file=sys.stderr)
        print("Create ./sandbox/notes/ and add .txt files before running.", file=sys.stderr)
        sys.exit(1)

    note_files = list(notes_dir.glob("*.txt")) + list(notes_dir.glob("*.md"))
    if not note_files:
        print("ERROR: No .txt or .md files found in ./sandbox/notes/", file=sys.stderr)
        sys.exit(1)

    return note_files


def main() -> None:
    note_files = get_note_files()

    file_list = ", ".join(f.name for f in note_files[:50])
    user_message = (
        f"Please summarize the following note files from the sandbox/notes/ directory: "
        f"{file_list}"
    )

    print(f"Running agent against {len(note_files)} file(s)...")
    result = Runner.run_sync(summarizer_agent, user_message)
    print("\n--- SUMMARY ---\n")
    print(result.final_output)


if __name__ == "__main__":
    main()
