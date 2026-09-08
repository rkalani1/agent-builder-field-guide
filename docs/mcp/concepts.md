> **Last verified:** 2026-07-18 · **Drift risk:** medium
> **Official sources:** [MCP Specification 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25), [MCP Specification 2025-06-18](https://modelcontextprotocol.io/specification/2025-06-18), [MCP Specification 2025-03-26](https://modelcontextprotocol.io/specification/2025-03-26)

# MCP Concepts

The [Model Context Protocol specification](https://modelcontextprotocol.io/specification/2025-11-25) defines a small vocabulary of roles and primitives. Getting these terms straight before writing any code saves a lot of confusion later.

The current released spec revision is **2025-11-25** (which added OAuth/OIDC discovery improvements, icons, URL elicitation, tool calls in sampling, and experimental tasks on top of 2025-06-18). A further revision dated **2026-07-28** is in release-candidate stage as of this writing — re-check the spec index after that date.

## Roles: Host, Client, Server

MCP uses three distinct roles, and it is easy to conflate them.

**Host** — the LLM application that a user interacts with directly. Claude Desktop is a host. A custom chat application built on the Anthropic or OpenAI API is also a host. The host owns the user session and decides which servers to connect to and which permissions to grant.

**Client** — a connector that lives inside the host. When Claude Desktop connects to two MCP servers simultaneously, it maintains two independent client instances, one per server. Clients are responsible for the connection lifecycle: they initiate the connection, send JSON-RPC requests, and receive responses. Most application developers never write client code directly; the host handles it.

**Server** — a separate process (or remote service) that exposes tools, resources, and prompts. A server knows nothing about the model. It only knows the MCP protocol. This separation is intentional: a server written for Claude today works with any other MCP-compliant host tomorrow.

The direction of capability flow matters. Servers offer things to clients (tools, resources, prompts). Clients offer things back to servers (sampling, roots, elicitation). The spec is explicit that servers should be treated as untrusted until the host has verified them, because a server can send arbitrary text back to the model.

## Transports

Transports define the physical channel over which JSON-RPC messages travel. As of the [2025-11-25 spec](https://modelcontextprotocol.io/specification/2025-11-25), two standard transports are defined: stdio and Streamable HTTP. An older HTTP+SSE transport survives only as backwards-compatibility guidance.

### stdio

The host spawns the server as a child process and communicates over standard input and output. Each line on stdout is a complete JSON-RPC message. Each line on stdin is a request or response.

stdio is the right choice for local servers. It requires no networking, no port management, and no authentication tokens. The filesystem server example in [Installing an MCP server](install.md) uses stdio.

### HTTP with Server-Sent Events (SSE) — historical

An older HTTP transport where the client sends POST requests and the server streams responses back over an SSE connection. It was defined in the 2024-11-05 spec revision and replaced by Streamable HTTP in the 2025-03-26 revision. It remains common in existing deployments, and current spec revisions retain backwards-compatibility guidance for it, but it is no longer one of the standard transports.

### Streamable HTTP

Introduced in the 2025-03-26 revision as the replacement for HTTP+SSE, and the preferred production transport since. The client sends POST requests to a single endpoint (default path `/mcp`). The server can respond with either a plain JSON body (for short responses) or an SSE stream (for long-running operations). Streamable HTTP supports both stateful and stateless modes. The Python SDK exposes this via `mcp.run(transport="streamable-http")`.

## Server-side primitives

### Resources

Resources are read-only data that a server exposes for the model or the user to inspect. A resource has a URI, a MIME type, and content. Examples: a file on disk, a database row, an API response cached for the session. Resources are analogous to GET endpoints: they provide context without side effects.

The spec distinguishes between static resources (fixed URI, fixed content) and dynamic resources (URI templates that accept parameters). Clients can subscribe to resources to receive update notifications when the underlying data changes.

### Prompts

Prompts are reusable message templates. A server can expose a prompt like `summarize-document` that accepts a `document_uri` argument and returns a structured list of messages ready to inject into the conversation. Prompts give tool authors control over how their capabilities are invoked without embedding that logic in the model's system prompt.

### Tools

Tools are functions the model can call. They are the most commonly used primitive and the one most likely to cause harm if misused. Each tool has a name, a description (written for the model), and a JSON Schema input definition. When the model decides to call a tool, the host asks the user for permission (in interactive clients), the client sends a `tools/call` request to the server, and the server returns a result.

Since the 2025-06-18 revision, tool results can be structured (typed JSON) or unstructured (text). Servers built against earlier spec versions return unstructured results only; the SDK maintains backward compatibility automatically.

## Client-side primitives

Three primitives flow in the opposite direction — from client to server — enabling more sophisticated agentic patterns.

**Sampling** — the server can request that the host perform an LLM inference call on its behalf. This enables recursive agent behaviors where a tool implementation itself calls the model. The spec requires explicit user consent before any sampling request is honored.

**Roots** — the server can ask the client which filesystem roots or URI namespaces it is allowed to operate within. This is used by servers that need to respect access boundaries set by the user.

**Elicitation** — the server can request additional input from the user mid-operation. This is useful for interactive tools that need a clarifying question answered before they can proceed.

## Lifecycle

A connection between client and server follows a defined lifecycle:

1. **Initialize** — client sends an `initialize` request carrying its protocol version and supported capabilities. Server responds with its version and capabilities. They negotiate the intersection.
2. **Initialized** — client sends an `initialized` notification to signal it is ready.
3. **Operation** — normal request/response and notification exchanges.
4. **Shutdown** — either side can close the connection. For stdio servers, closing the child process stdin signals shutdown.

Understanding the lifecycle matters when writing servers because a server that does not respond to `initialize` correctly will fail silently in most clients: the connection will appear to hang or the server will simply not show up in the tool list.

## Base protocol

All MCP messages are [JSON-RPC 2.0](https://www.jsonrpc.org/specification). Requests have an `id`, a `method`, and optional `params`. Responses carry either a `result` or an `error`. Notifications have a `method` but no `id` and expect no response. The spec layers MCP-specific methods (`tools/list`, `tools/call`, `resources/read`, etc.) on top of this base.

One practical implication: if you are debugging a server, you can test it manually by piping raw JSON-RPC messages to its stdin. You do not need a full MCP client to verify that a server is working correctly.

## Security and trust model

The spec dedicates significant space to trust. Key principles from [the current specification](https://modelcontextprotocol.io/specification/2025-11-25) (unchanged in substance since the 2025-06-18 revision):

- Users must explicitly consent to data access and operations.
- Tool descriptions and annotations are considered untrusted unless obtained from a server the host has verified.
- Hosts must not transmit resource data to third parties without user consent.
- Every tool invocation requires explicit user consent in interactive clients.
- Sampling requests require explicit user approval; the protocol intentionally limits server visibility into prompts.

The security implications of these principles are explored in depth in [Security](security.md).
