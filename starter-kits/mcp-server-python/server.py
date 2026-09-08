"""
MCP Server — Python example (INERT BY DEFAULT)

This script is safe to inspect and review without running. It exits
immediately unless OPERATOR_APPROVED_TO_RUN=1 is set in the environment.

There is NO bypass for stdio / MCP-client invocation. If an MCP client
(such as Claude Desktop) launches this server, the launching environment
must include OPERATOR_APPROVED_TO_RUN=1 — typically by setting it inside
the `env` block of the client's MCP server configuration.

Example claude_desktop_config.json snippet:

    {
      "mcpServers": {
        "greeter": {
          "command": "python",
          "args": ["/absolute/path/to/server.py"],
          "env": {
            "OPERATOR_APPROVED_TO_RUN": "1"
          }
        }
      }
    }

Manual start (after completing the launch checklist):

    OPERATOR_APPROVED_TO_RUN=1 python server.py

Reference: https://github.com/modelcontextprotocol/python-sdk
"""

import os
import sys

# ---------------------------------------------------------------------------
# SAFETY GATE
# Single, unconditional gate: the server only starts if the operator has
# explicitly set OPERATOR_APPROVED_TO_RUN=1. There is no stdio/pipe bypass.
# ---------------------------------------------------------------------------
APPROVED = os.getenv("OPERATOR_APPROVED_TO_RUN", "0") == "1"

if not APPROVED:
    print("=" * 60, file=sys.stderr)
    print("DRY-RUN MODE — This MCP server will NOT start.", file=sys.stderr)
    print("Set OPERATOR_APPROVED_TO_RUN=1 in the environment to start.", file=sys.stderr)
    print("For MCP clients, set it in the `env` block of the server", file=sys.stderr)
    print("config (see this file's docstring for an example).", file=sys.stderr)
    print("=" * 60, file=sys.stderr)
    print(file=sys.stderr)
    print("What this server WOULD do if started:", file=sys.stderr)
    print("  1. Initialize the MCP server using the mcp Python SDK.", file=sys.stderr)
    print("  2. Register the 'greet' tool.", file=sys.stderr)
    print("  3. Listen for MCP requests on stdio.", file=sys.stderr)
    print("  4. Respond to greet() calls with a greeting string.", file=sys.stderr)
    print(file=sys.stderr)
    print("Exposed tools: greet(name: str) -> str", file=sys.stderr)
    print("No files are read or written. No network calls are made.", file=sys.stderr)
    sys.exit(0)

# ---------------------------------------------------------------------------
# IMPORTS (only reached when running for real)
# ---------------------------------------------------------------------------
from mcp.server.fastmcp import FastMCP  # from the mcp package

# ---------------------------------------------------------------------------
# SERVER DEFINITION
# ---------------------------------------------------------------------------
mcp = FastMCP("greeter-server")


@mcp.tool()
def greet(name: str) -> str:
    """
    Return a greeting for the given name.

    Args:
        name: The name to greet. Must be a non-empty string of <= 100 characters.
              Must not contain newlines, null bytes, or shell metacharacters.

    Returns:
        A greeting string.

    Example:
        greet("Alice") -> "Hello, Alice! Welcome."
    """
    # Input validation
    if not isinstance(name, str) or not name.strip():
        return "Error: name must be a non-empty string."
    if len(name) > 100:
        return "Error: name must be 100 characters or fewer."
    # Reject inputs that look like injection attempts
    forbidden_chars = set('\n\r\x00;<>&|`$(){}[]')
    if any(c in forbidden_chars for c in name):
        return "Error: name contains invalid characters."
    # Sanitize for display
    safe_name = name.strip()
    return f"Hello, {safe_name}! Welcome."


# ---------------------------------------------------------------------------
# MAIN
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    # Start the server using stdio transport (default for MCP)
    mcp.run(transport="stdio")
