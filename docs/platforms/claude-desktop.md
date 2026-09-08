# Claude Desktop

> **Last verified:** 2026-05-06 · **Drift risk:** high · **Partially re-verified:** 2026-07-18
> **Official sources:** [Download Claude Desktop](https://claude.com/download), [Desktop app reference (Chat, Cowork, Code tabs)](https://code.claude.com/docs/en/desktop), [Local MCP servers on Claude Desktop](https://support.claude.com/en/articles/10949351-getting-started-with-local-mcp-servers-on-claude-desktop), [Custom connectors via remote MCP](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp), [Connectors overview](https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities), [Get started with Claude Cowork](https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork)

---

## What This Surface Is

Claude Desktop is the installable application version of Claude for macOS and Windows, with a Linux beta (see Limits and Gotchas). It gives you the same Claude models you get on claude.ai, wrapped in a native app that can integrate with tools and data sources running on your local machine.

The app is organized into three tabs, per the [official desktop reference](https://code.claude.com/docs/en/desktop): **Chat** for conversations, **Cowork** for Dispatch and longer agentic work, and **Code** for software development (an embedded [Claude Code](claude-code.md)). This page focuses on the Chat tab and its desktop extensions—packaged MCP (Model Context Protocol) servers that Claude can call during a conversation. With an extension active, Claude can read and write local files, query a local database, call a shell command, or talk to an API on your behalf. The app manages permissions, credentials, and the connection lifecycle.

### The Cowork and Code tabs

- **Cowork** is the desktop app's workspace for longer agentic work: instead of a single chat exchange, Claude works through multi-step tasks against your files. Per mid-2026 official announcements, Cowork launched in the desktop app in early 2026 and has since expanded to other surfaces. Plan availability and how file-access permissions are scoped are documented in the official [Get started with Claude Cowork](https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork) article and on the [Cowork product page](https://claude.com/product/cowork)—verify current details there.
- **Code** embeds Claude Code for software development; see [Claude Code](claude-code.md) and the [desktop reference](https://code.claude.com/docs/en/desktop).

---

## Who It Is Best For

- People who want Claude to access local files or apps without running a cloud server
- Developers who want to prototype MCP-based tools before deploying them
- Teams on Pro, Max, Team, or Enterprise plans who want connectors from the official directory
- Anyone who finds the browser interface insufficient for tasks that require persistent local context

---

## Prerequisites

- macOS 12 or later, or Windows 10 1809 or later
- A Claude account: Pro, Max, Team, or Enterprise (the Free plan does not include tool use via desktop extensions as of this writing—verify current plan limits at [claude.com/pricing](https://claude.com/pricing))
- Node.js, Python, or a compiled binary if you plan to run a custom MCP server locally

---

## Step-by-Step Setup

### 1. Download and install

Go to [claude.com/download](https://claude.com/download) (claude.ai/download redirects there) and download the package for your operating system. Run the installer. No special permissions are needed beyond what a standard app installation requires.

### 2. Log in

Open the app. You will be prompted to log in with your Anthropic account credentials. Once authenticated, credentials are stored and you will not need to log in again unless you explicitly sign out.

### 3. Open Extensions settings

Navigate to **Settings > Extensions**. This is where you manage both directory extensions and custom local tools.

### 4. Browse and install a directory extension

Click **Browse extensions** to see the connectors directory. Note that listings are not all reviewed to the same depth: per the official directory documentation, **verified** connectors are reviewed by Anthropic, while **community** connectors pass automated checks but are not reviewed in depth—check the badge on each listing. Each listing shows what the extension can read and write, and which platforms it is available on. Click **Install** on any extension you want. Configure any required settings (such as API keys) through the form that appears. The extension becomes available in your conversations immediately.

### 5. Verify a connection

Click the **+** button at the bottom left of any chat window and hover over **Connectors**. You will see a list of connected extensions with a toggle for each. Enabling a toggle makes that extension available for the current conversation.

---

## Building Your First Useful Agent: Filesystem MCP Server

The filesystem MCP server is the canonical first example. It lets Claude read and write files within directories you specify. The following assumes you want to install a custom local MCP server rather than a directory extension.

### Installing a custom desktop extension

As of early 2026, the packaged `.mcpb` file is the primary documented path for custom extensions, rather than manual JSON editing of a config file. The older `claude_desktop_config.json` pattern, which was the standard approach in 2024 and early 2025, is treated by the desktop docs as the manual, older path—but it has not clearly disappeared: the MCP project docs still describe [connecting local servers](https://modelcontextprotocol.io/docs/develop/connect-local-servers) to Claude Desktop via that config file. Treat the two paths as coexisting and verify against current docs before assuming either is gone.

To install a custom extension:

1. Obtain or build a `.mcpb` file. (Developer instructions are in the Claude Desktop developer documentation.)
2. In **Settings > Extensions**, click **Advanced settings**.
3. Under **Extension Developer**, click **Install Extension…**.
4. Select your `.mcpb` file and follow the prompts.

### Worked example: asking Claude to summarize files in a directory

Assume you have installed a filesystem extension that has read access to `~/Documents/project-notes`.

Open a conversation, enable the filesystem extension from the **+** menu, and send:

```
Summarize all markdown files in ~/Documents/project-notes, grouped by topic.
```

Claude will call the filesystem tool to list files, read each one, and return a structured summary. It will ask for approval before any write operations.

For reference, the older JSON config format (still documented by the MCP project and referenced in many tutorials) looks like this:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/yourname/Documents/project-notes"
      ]
    }
  }
}
```

If a tutorial you are following uses this format, check whether Claude Desktop's current version still reads it, or whether you need to package the server as a `.mcpb` file instead.

---

## Customization

### System prompt

Claude Desktop does not expose a persistent system prompt field in the way Claude Projects does. Per-conversation context can be set by typing instructions at the start of a conversation, or by using a Project (see [Claude Projects](claude-projects.md)).

### Extension-level permissions

When you install an extension, you can configure which tool categories are available. Navigate to **Settings > Extensions**, select the extension, and review its **Tool permissions**. Options are typically:

- **Always allow**: Claude calls the tool without asking you first
- **Needs approval**: Claude pauses and shows you the proposed action before executing
- **Blocked**: Claude cannot use this tool at all

Setting write operations to **Needs approval** is a sensible default until you trust an extension.

### Multiple extensions at once

You can have multiple extensions installed and selectively enable them per conversation. If you have ten or more extensions active simultaneously, switch the **Tool access** mode to **On demand** (found in the **+** menu under Connectors) to give more space in the context window to the conversation itself.

---

## Limits and Gotchas

- **Linux is in beta.** Claude Desktop for Linux is available in beta for Ubuntu and Debian (x64 and arm64) via apt or a .deb package, per the [official Linux page](https://code.claude.com/docs/en/desktop-linux). Given the beta label, verify feature parity—particularly for desktop extensions—before relying on it for production workflows.
- **Custom connectors are cloud-side, not local-side.** Remote MCP connectors (added via a URL) reach your MCP server from Anthropic's cloud infrastructure, not from your local machine. Your server must be reachable over the public internet. This is different from desktop extensions, which run locally. Per the [remote MCP docs](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp), servers behind a corporate firewall will fail unless you allowlist Anthropic's IP ranges.
- **The `.mcpb` packaging path is newer than most tutorials.** Documentation on the web still refers to `claude_desktop_config.json`. The desktop docs describe the JSON config as the older, manual path and steer custom extensions through the developer section of the Extensions settings panel, but the MCP project docs still document the config file for local servers—check which route your Claude Desktop version supports.
- **Free plan users have limited connector access.** The free plan limits custom connectors to one. Directory extensions may have their own plan requirements. Check individual extension listings.
- **Context window still applies.** Enabling many connectors adds tool definitions to the context window and can reduce the space available for conversation content.

---

## Confirmed by Docs vs. Practical Inference

| Claim | Status |
|-------|--------|
| Download at claude.com/download (claude.ai/download redirects) | Confirmed: 301 redirect observed 2026-07-18 |
| Three tabs: Chat, Cowork, Code | Confirmed by [desktop reference](https://code.claude.com/docs/en/desktop) (fetched 2026-07-18) |
| Desktop extensions installed via .mcpb files | Confirmed by support article |
| `.mcpb` is the primary documented custom-extension path | Mixed: desktop docs call the JSON config the older manual path, but [MCP project docs](https://modelcontextprotocol.io/docs/develop/connect-local-servers) still document `claude_desktop_config.json`—verify |
| Settings path: Settings > Extensions | Confirmed by support article |
| Tool permission options (Always allow, Needs approval, Blocked) | Confirmed by connectors support article |
| Free plan limits custom connectors to one | Confirmed by connectors overview article |
| Directory distinguishes verified (Anthropic-reviewed) from community connectors | Reported by official directory documentation surfaced in search 2026-07-18; direct fetch blocked—verify on the [directory](https://claude.com/connectors) |
| Linux desktop app in beta (Ubuntu/Debian, apt/.deb, x64/arm64) | Confirmed by [official Linux page](https://code.claude.com/docs/en/desktop-linux) (linked from desktop reference, fetched 2026-07-18) |

---

## Cost and Rate-Limit Notes

Claude Desktop itself does not carry an additional fee. Costs come from the underlying Claude plan. Pro and Max plans include a usage allowance; very heavy tool-use sessions (many file reads, many model calls) may consume your allowance faster than plain conversation. Team and Enterprise plans have separate per-seat or enterprise pricing. Check [claude.com/pricing](https://claude.com/pricing) for current plan details—specific prices are not documented here.

---

## Where to Go Next

- [Claude Code](claude-code.md) — for coding workflows in the terminal or via the desktop app's Code tab
- [Claude Projects](claude-projects.md) — if you want persistent system instructions and file context without tool use
- [Custom remote MCP connectors](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp) — if you want to connect a cloud-hosted MCP server
- [Connectors directory](https://claude.com/connectors) — to browse verified and community connectors (also reachable in-product under **Settings > Connectors**)
