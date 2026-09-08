> **Last verified:** 2026-07-18 · **Drift risk:** medium
> **Official sources:** [Connect local MCP servers](https://modelcontextprotocol.io/docs/develop/connect-local-servers), [Local MCP on Claude Desktop](https://support.claude.com/en/articles/10949351-getting-started-with-local-mcp-servers-on-claude-desktop)

# Installing an MCP Server

This page walks through adding the official filesystem MCP server to Claude Desktop. The filesystem server is a good first example because it requires no API keys, has no side effects beyond reading the directories you specify, and demonstrates every config concept you need.

## Prerequisites

You need Node.js installed. The `npx` command, which comes with Node.js, downloads and runs the server package without a permanent global install. Verify Node.js is present:

```
node --version
```

Any version 18 or later works. If you do not have Node.js, install it from [nodejs.org](https://nodejs.org/).

## Locating the config file

Claude Desktop reads its MCP configuration from a JSON file. The path depends on your operating system.

| Platform | Config file path |
|----------|-----------------|
| macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Windows | `%APPDATA%\Claude\claude_desktop_config.json` |

To open it from inside Claude Desktop: click the Claude menu in the system menu bar (macOS top bar, or the app menu on Windows), select "Settings…", navigate to the "Developer" tab, and click "Edit Config". This opens the file in your default text editor.

If the file does not exist yet, create it. The directory will already exist if you have installed Claude Desktop.

## The minimal config

Replace the contents of the config file with the following, substituting your actual username for `username`:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/username/Desktop",
        "/Users/username/Downloads"
      ]
    }
  }
}
```

On Windows, use Windows-style paths:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "C:\\Users\\username\\Desktop",
        "C:\\Users\\username\\Downloads"
      ]
    }
  }
}
```

The `args` array after the package name lists the directories the server is allowed to access. You can add or remove paths here. The server will refuse to read or write anything outside these directories.

## Config file structure

The top-level `mcpServers` key is an object whose keys are arbitrary names you choose — these names appear in the Claude Desktop UI. Each entry has at minimum:

- `command` — the executable to run (here `npx`)
- `args` — an array of arguments passed to that executable

Optional keys include:

- `env` — an object of environment variables to set for the server process. Use this to pass API keys rather than hard-coding them in `args`.
- `disabled` — set to `true` to temporarily disable a server without removing its config. This key could not be confirmed in official Claude Desktop documentation as of 2026-07-18; treat it as unverified and check the [Claude Desktop support article](https://support.claude.com/en/articles/10949351-getting-started-with-local-mcp-servers-on-claude-desktop) before relying on it.

Example with an environment variable, using the official [GitHub MCP server](https://github.com/github/github-mcp-server) (the older `@modelcontextprotocol/server-github` npm package is deprecated and has been removed from the reference servers repo). The local variant runs via Docker and reads `GITHUB_PERSONAL_ACCESS_TOKEN`:

```json
{
  "mcpServers": {
    "github": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "-e", "GITHUB_PERSONAL_ACCESS_TOKEN", "ghcr.io/github/github-mcp-server"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

## Restarting Claude Desktop

After saving the config file, you must completely quit and relaunch Claude Desktop. The application does not watch the config file for changes — it reads it only at startup. On macOS, "quit" means Cmd+Q or right-clicking the Dock icon and choosing Quit, not just closing the window.

To confirm the server connected, click the "+" button at the bottom left of the chat input, then select "Connectors". You should see "filesystem" listed with its tools. If it does not appear, check the logs:

| Platform | Log directory |
|----------|--------------|
| macOS | `~/Library/Logs/Claude/` |
| Windows | `%APPDATA%\Claude\logs\` |

The file `mcp-server-filesystem.log` will contain any startup errors. A common issue is a path that does not exist — the server exits immediately if an argument path is not a real directory.

To tail logs live on macOS:

```
tail -f ~/Library/Logs/Claude/mcp-server-filesystem.log
```

## Adding multiple servers

You can register as many servers as you need. Each gets its own key in `mcpServers`:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/username/Documents"]
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}
```

Claude Desktop starts each server as a separate child process. If one server fails to start, the others still work.

## Installing into Claude Code

Claude Code (the CLI) reads MCP config from a different location and supports project-level config files. Run:

```
claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem /path/to/dir
```

The `--` separates Claude's own options from the command (and its arguments) that runs the server — without it, `claude` tries to parse flags like `-y` as its own options and the command fails. This writes the entry into the appropriate config file automatically. Use `claude mcp list` to see registered servers and `claude mcp remove <name>` to remove one. For project-scoped servers (checked into a repo), Claude Code reads `.mcp.json` at the project root, and prompts for approval before using project-scoped servers from that file.

## Installing into other clients

The `claude_desktop_config.json` format is specific to Claude Desktop and Claude Code. Other MCP clients use their own config formats, but the underlying concept is the same: you specify a command, arguments, and environment variables. Consult the documentation for the client you are using. The [MCP spec connection guide](https://modelcontextprotocol.io/docs/develop/connect-local-servers) covers the general pattern that all stdio-based client configs follow.

## The `-y` flag on npx

The `-y` flag tells `npx` to skip the interactive "install this package?" prompt. Without it, the server would hang waiting for keyboard input that never arrives. Always include `-y` when registering npx-based servers in config files.

## Verifying the server works

Once Claude Desktop has restarted and shows the filesystem server in its connectors list, start a conversation and ask: "List the files on my Desktop." Claude should respond with the actual contents of the Desktop directory. If it does not, check that the path in the config matches a directory that actually exists on your machine and that you have read permission for it.
