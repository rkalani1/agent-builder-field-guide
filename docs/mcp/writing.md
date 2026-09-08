> **Last verified:** 2026-07-18 · **Drift risk:** high (SDK v2, a breaking rework, is targeted for late July 2026)
> **Official sources:** [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk), [MCP SDK docs](https://modelcontextprotocol.io/docs/sdk)

# Writing Your Own MCP Server in Python

The [official Python SDK](https://github.com/modelcontextprotocol/python-sdk) provides a high-level class called `FastMCP` that handles protocol negotiation, serialization, and transport so you can focus on writing tool logic. This page walks through a minimal server, explains the moving parts, and shows how to register it in Claude Desktop.

## Installing the SDK

Use either pip or uv. The `[cli]` extra gives you the `mcp` command-line tool for testing and installing servers:

```
pip install "mcp[cli]"
```

With uv (recommended for project isolation):

```
uv init my-mcp-server
cd my-mcp-server
uv add "mcp[cli]"
```

The SDK requires Python 3.10 or later.

## A minimal server

Create a file called `server.py`:

```python
from mcp.server.fastmcp import FastMCP

# Give the server a name. This appears in client UIs.
mcp = FastMCP("Greeter")

@mcp.tool()
def greet(name: str) -> str:
    """Return a greeting for the given name.

    Args:
        name: The person to greet.
    """
    return f"Hello, {name}. This response came from a local MCP server."

if __name__ == "__main__":
    mcp.run()
```

That is a complete, working MCP server. The `@mcp.tool()` decorator:

1. Registers `greet` as a callable tool.
2. Uses the function's docstring as the tool description that the model sees.
3. Uses the function's type annotations and the `Args:` section of the docstring to generate the JSON Schema for the input parameter.
4. Returns the function's return value as the tool result.

When the model calls this tool, it will pass a JSON object like `{"name": "Alice"}`. The SDK unpacks it into the function's keyword arguments automatically.

## Running and testing locally

The `mcp dev` command starts the server with the MCP Inspector, a browser-based UI for testing tool calls without a full model:

```
mcp dev server.py
```

This runs the server in stdio mode and opens the Inspector UI at `http://localhost:6274` (a companion MCP proxy server listens on port 6277); the command prints and opens the URL for you. You can invoke `greet` directly, inspect the request and response JSON, and verify the server behaves as expected before connecting it to a model.

To run the server without the inspector:

```
python server.py
```

Or with uv:

```
uv run server.py
```

## Registering in Claude Desktop

Add an entry to `claude_desktop_config.json` pointing at your `server.py`. The key in `mcpServers` is the name that appears in the Claude Desktop UI:

```json
{
  "mcpServers": {
    "greeter": {
      "command": "python",
      "args": ["/absolute/path/to/server.py"]
    }
  }
}
```

If you are using uv and want the server to run inside the project's virtual environment:

```json
{
  "mcpServers": {
    "greeter": {
      "command": "uv",
      "args": ["run", "--project", "/absolute/path/to/my-mcp-server", "python", "server.py"]
    }
  }
}
```

Use absolute paths. Claude Desktop launches the server from an indeterminate working directory, so relative paths will not resolve correctly.

Restart Claude Desktop after editing the config. Open a conversation and say "Greet Alice using the greeter tool." Claude should return the greeting string.

## Exposing a resource

Resources provide read-only data. Here is a server that exposes the contents of a text file as a resource alongside the greet tool:

```python
from mcp.server.fastmcp import FastMCP
from pathlib import Path

mcp = FastMCP("Greeter")

@mcp.tool()
def greet(name: str) -> str:
    """Return a greeting for the given name."""
    return f"Hello, {name}."

@mcp.resource("file://notes.txt")
def read_notes() -> str:
    """The contents of notes.txt in the project directory."""
    return Path("notes.txt").read_text()

if __name__ == "__main__":
    mcp.run()
```

The URI `file://notes.txt` is how clients request this resource. The function body can read from any source: a file, a database, an in-memory store.

## Exposing a prompt template

Prompts are reusable message templates:

```python
from mcp.server.fastmcp import FastMCP
from mcp.types import PromptMessage, TextContent

mcp = FastMCP("Greeter")

@mcp.prompt()
def greeting_prompt(name: str) -> list[PromptMessage]:
    """Generate a prompt that asks the model to write a formal letter greeting."""
    return [
        PromptMessage(
            role="user",
            content=TextContent(
                type="text",
                text=f"Write a formal one-sentence greeting addressed to {name}."
            )
        )
    ]

if __name__ == "__main__":
    mcp.run()
```

## Transport options

By default, `mcp.run()` uses stdio, which is correct for local servers registered in config files. For a remote server deployed behind HTTPS, use Streamable HTTP:

```python
if __name__ == "__main__":
    mcp.run(transport="streamable-http")
```

This starts a Starlette ASGI app on `http://0.0.0.0:8000/mcp` by default. You can customize the port and path:

```python
mcp.settings.host = "0.0.0.0"
mcp.settings.port = 9000
mcp.settings.streamable_http_path = "/api/mcp"
mcp.run(transport="streamable-http")
```

The older SSE transport is still supported (`transport="sse"`), but the spec replaced HTTP+SSE with Streamable HTTP in the 2025-03-26 revision, and the [current spec (2025-11-25)](https://modelcontextprotocol.io/specification/2025-11-25) retains it only via backwards-compatibility guidance. Prefer Streamable HTTP for new remote servers.

## Structured tool output

The 2025-06-18 spec revision added structured output for tools. If your tool returns a typed dataclass or Pydantic model, the SDK serializes it as a typed JSON result. Clients that support the new spec version can parse this directly; older clients receive an unstructured text fallback automatically.

```python
from dataclasses import dataclass
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("Greeter")

@dataclass
class Greeting:
    message: str
    recipient: str

@mcp.tool()
def greet(name: str) -> Greeting:
    """Return a structured greeting."""
    return Greeting(message=f"Hello, {name}.", recipient=name)

if __name__ == "__main__":
    mcp.run()
```

Note: dataclasses must have type annotations on all fields for structured output to work. Classes without annotations fall back to unstructured text.

## Version notes

The Python SDK is versioned independently of the MCP spec. Check [PyPI](https://pypi.org/project/mcp/) for the current 1.x release rather than trusting any version printed here. The v1.x line is the stable, production-recommended release line, and `FastMCP` is its recommended authoring interface. The lower-level `Server` class from `mcp.server` is available for cases where you need full control over the protocol, but most use cases do not require it. When pinning, include an upper bound (for example `mcp>=1.27,<2`).

**Drift warning:** SDK v2 is in pre-release on PyPI (published as `2.0.0aN` alphas) and is targeted for stable release on 2026-07-27, supporting the 2026-07-28 MCP specification release. It is a breaking rework in which `MCPServer` replaces `FastMCP` as the authoring interface, and the official README says the pre-releases are not for production use. Re-verify this page after that release.

If you see import errors for `mcp.server.fastmcp`, upgrade the SDK within the 1.x line:

```
pip install --upgrade "mcp[cli]>=1.27,<2"
```

The [SDK documentation](https://modelcontextprotocol.io/docs/sdk) lists all official language SDKs — as of mid-2026 the project maintains ten: C#, Go, Java, Kotlin, PHP, Python, Ruby, Rust, Swift, and TypeScript. A formal SDK tiering system was introduced with the 2025-11-25 spec governance changes; check the SDK index for each SDK's current tier.
