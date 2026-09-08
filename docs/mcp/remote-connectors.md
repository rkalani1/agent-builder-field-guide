> **Last verified:** 2026-05-06 · **Drift risk:** high · **Partially re-verified:** 2026-07-18 (spec references only; the support article was unreachable, so plan, limit, and UI-path claims are unconfirmed since May 2026)
> **Official sources:** [Custom remote MCP connectors](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp), [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk)

# Custom Remote Connectors

A remote MCP connector lets Claude reach a server you host over the public internet rather than running a local process. This is useful when your tool logic requires server-side resources (a database, a private API, long-running compute), when you want to share the same server across multiple users, or when you are building a connector for a team.

As of May 2026, remote connectors are available in beta on Free, Pro, Max, Team, and Enterprise plans. Free users are limited to one custom connector. The feature is accessed through the Claude.ai web interface and Claude Desktop — not through `claude_desktop_config.json`. Plan availability, connector limits, and the menu paths described below are high-drift UI claims that could not be re-checked on 2026-07-18; confirm them against the [official support article](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp) before relying on them.

## How remote connectors differ from local servers

Local stdio servers run as child processes on the user's machine. Remote connectors connect to an HTTPS endpoint that you control. The model's requests travel from Anthropic's infrastructure to your server, so your server must be reachable over the public internet from Anthropic's IP ranges. Servers on private corporate networks, behind a VPN, or blocked by a firewall will not connect.

## Authentication modes

The connector UI supports OAuth for delegated authentication. When a user adds your remote connector:

1. They paste in your server URL.
2. If you configured OAuth, they click "Connect" and go through your OAuth flow.
3. Claude receives an access token scoped to that user's permissions.
4. Every tool call Claude makes to your server includes that token.

To configure OAuth, you provide an OAuth Client ID and Client Secret in the "Advanced settings" panel when adding the connector. Your server must implement the standard OAuth 2.0 authorization code flow. The authorization section of the [current spec revision (2025-11-25)](https://modelcontextprotocol.io/specification/2025-11-25) — which extended the 2025-06-18 authorization model with OIDC discovery and OAuth Client ID Metadata Documents — describes the expected token verification behavior.

Bearer tokens are not exposed as a first-class auth mode in the Claude UI, but you can approximate them by using a static "client credential" OAuth grant on your server. For internal tools where you control both ends, this is a reasonable approach.

For unauthenticated connectors (public read-only data, internal tools on trusted networks), you can leave the OAuth fields empty and rely on network-level controls instead.

## Setting up the connector in Claude

### Pro and Max plans

1. Navigate to Customize > Connectors in Claude.ai.
2. Click "+" then "Add custom connector."
3. Enter your server's Streamable HTTP endpoint URL (for example, `https://tools.example.com/mcp`).
4. Optionally open "Advanced settings" to enter your OAuth Client ID and Client Secret.
5. Click "Add."

### Team and Enterprise plans

Owners configure connectors for the whole organization:

1. Navigate to Organization settings > Connectors.
2. Click "Add," hover over "Custom," and select "Web."
3. Enter the server URL and optional OAuth credentials.
4. Click "Add."

Members then individually connect: Customize > Connectors > find the custom connector > click "Connect" to authenticate.

Per-conversation enabling and disabling: the "+" button at the bottom of the chat input opens the connectors panel where any registered connector can be toggled on or off for that specific conversation.

## Risks of remote connectors

The [Anthropic guidance on remote connectors](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp) calls this out clearly: custom connectors connect Claude to services that have not been verified by Anthropic.

Concrete risks:

**Prompt injection** — your server returns tool results that the model reads. A malicious server (or a compromised server) can embed instructions in tool results that override the user's original intent. Claude has built-in mitigations, but they are not bulletproof. Only connect to servers you control or that are operated by organizations you trust.

**Unintended write actions** — tools can modify data. A server that exposes `delete_record` or `send_email` will execute those actions if Claude calls them. Review every tool your server exposes. When using Research mode with connectors, disable write-action tools.

**Credential scope creep** — the permissions you grant during OAuth are the permissions Claude can exercise. Grant only the minimum scopes required. Anthropic's guidance is explicit: review requested permissions carefully during auth and limit scopes when possible.

**Supply-chain risk** — if you host an MCP server that depends on third-party packages, those packages can introduce vulnerabilities. Pin dependencies and keep them updated.

**Behavioral drift** — the operator of a remote server can change tool behavior at any time. A tool that was read-only yesterday might write data today. Monitor tool inputs and outputs in production.

## Worked example: pointing Claude at a self-hosted server

Suppose you have a FastMCP server running at `https://tools.example.com`. Here is the server (see [Writing your own server](writing.md) for the full authoring guide):

```python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("Company Tools")

@mcp.tool()
def get_employee_count(department: str) -> int:
    """Return the current headcount for a department."""
    # Replace with a real database query
    data = {"engineering": 42, "sales": 18, "operations": 11}
    return data.get(department.lower(), 0)

if __name__ == "__main__":
    mcp.settings.host = "0.0.0.0"
    mcp.settings.port = 8000
    mcp.run(transport="streamable-http")
```

Deploy this behind a reverse proxy (nginx, Caddy, or a cloud load balancer) that handles TLS. The endpoint Claude connects to is `https://tools.example.com/mcp` (the default Streamable HTTP path).

In Claude.ai, add `https://tools.example.com/mcp` as a custom connector. In a conversation with the connector enabled, ask "How many people are in the engineering department?" Claude will call `get_employee_count("engineering")` and return 42.

## Firewall requirements

Your server must accept connections from Anthropic's published IP ranges. Check Anthropic's support documentation at [support.claude.com](https://support.claude.com/) for the current CIDR ranges and update your firewall allowlist accordingly — a canonical article URL for the egress IP ranges has not been re-confirmed, so treat this citation as a known drift risk and locate the current article there. These ranges change occasionally, so subscribe to release notes or set a calendar reminder to recheck them quarterly.

## Removing a connector

As of the May 2026 verification, removing a connector was permanent in the UI — you could not "pause" it without deleting and re-adding. To remove: Customize > Connectors > three-dot menu next to the connector > Remove. For Team/Enterprise: Organization settings > Connectors > Remove. (Verify against the [support article](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp) — removal behavior and menu paths change without notice.)
