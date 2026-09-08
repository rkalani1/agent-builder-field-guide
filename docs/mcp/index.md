# Model Context Protocol (MCP)

The Model Context Protocol is an open standard that defines how AI host applications connect to external tools and data sources. Think of it as a USB-C port for AI: instead of building a bespoke integration for every combination of model and tool, you write one server that speaks MCP and any compliant client can use it.

## What you will find in this section

| Page | What it covers |
|------|---------------|
| [Concepts](concepts.md) | Hosts, clients, servers, transports, resources, prompts, and tools |
| [Installing an MCP server](install.md) | Editing `claude_desktop_config.json` and adding the filesystem server |
| [Writing your own server](writing.md) | A minimal Python server with FastMCP, registered in Claude Desktop |
| [Remote connectors](remote-connectors.md) | Pointing Claude at a self-hosted MCP server over HTTPS with OAuth |
| [Security](security.md) | Threat model, prompt injection risks, supply-chain hygiene, secrets |

## Why MCP matters for agent builders

Before MCP, every tool integration was a one-off: a custom function, a custom schema, a custom parsing layer. The model provider, the tool author, and the application developer each had to agree on details that were never standardized.

MCP fixes this by specifying:

- A JSON-RPC 2.0 message format for all requests and responses
- A capability-negotiation handshake so clients and servers advertise what they support
- Three server-side primitives (resources, prompts, tools) that cover the overwhelming majority of integration needs
- Two transport layers (stdio for local processes, HTTP with Server-Sent Events or the newer Streamable HTTP for remote services)

The practical result: a filesystem server, a GitHub server, and a custom internal-API server can all be registered in the same config file and consumed by the same model without any model-specific adaptation code.

## Quick orientation

If you are new to MCP, read [Concepts](concepts.md) first to understand the vocabulary, then follow [Installing an MCP server](install.md) to get something working in under ten minutes. If you already have a running server and want to expose it remotely, jump to [Remote connectors](remote-connectors.md).

The [Security](security.md) page is not optional reading — MCP servers execute arbitrary code on behalf of the model, and the threat surface is larger than most developers expect.

## Spec versions covered

The current specification revision is [2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25). These pages cite the [2025-06-18 revision](https://modelcontextprotocol.io/specification/2025-06-18) — which introduced Streamable HTTP as the preferred production transport and structured tool outputs — where a quoted behavior was verified against that text; differences from earlier revisions are called out inline.
