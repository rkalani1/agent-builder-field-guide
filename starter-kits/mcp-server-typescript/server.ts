/**
 * MCP Server — TypeScript example (INERT BY DEFAULT)
 *
 * This script is safe to inspect and review without running. It exits
 * immediately unless OPERATOR_APPROVED_TO_RUN=1 is set in the environment.
 *
 * There is NO bypass for stdio / MCP-client invocation. If an MCP client
 * (such as Claude Desktop) launches this server, the launching environment
 * must include OPERATOR_APPROVED_TO_RUN=1 — typically by setting it in the
 * `env` block of the client's MCP server configuration.
 *
 * Example claude_desktop_config.json snippet:
 *
 *   {
 *     "mcpServers": {
 *       "greeter": {
 *         "command": "node",
 *         "args": ["/absolute/path/to/server.js"],
 *         "env": { "OPERATOR_APPROVED_TO_RUN": "1" }
 *       }
 *     }
 *   }
 *
 * Manual start (after completing the launch checklist):
 *
 *   OPERATOR_APPROVED_TO_RUN=1 npx ts-node server.ts
 *
 * Reference: https://github.com/modelcontextprotocol/typescript-sdk
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// ---------------------------------------------------------------------------
// SAFETY GATE
// Single, unconditional gate: the server only starts if the operator has
// explicitly set OPERATOR_APPROVED_TO_RUN=1. There is no stdio/pipe bypass.
// ---------------------------------------------------------------------------
const APPROVED = process.env.OPERATOR_APPROVED_TO_RUN === "1";

if (!APPROVED && process.env.NODE_ENV !== "test") {
  console.error("=".repeat(60));
  console.error("DRY-RUN MODE — This MCP server will NOT start.");
  console.error("Set OPERATOR_APPROVED_TO_RUN=1 in the environment to start.");
  console.error("For MCP clients, set it in the `env` block of the server");
  console.error("config (see this file's docstring for an example).");
  console.error("=".repeat(60));
  console.error();
  console.error("What this server WOULD do if started:");
  console.error("  1. Initialize the MCP server using the TypeScript SDK.");
  console.error("  2. Register the 'greet' tool.");
  console.error("  3. Listen for MCP requests on stdio.");
  console.error("  4. Respond to greet() calls with a greeting string.");
  console.error();
  console.error("Exposed tools: greet(name: string) -> string");
  console.error("No files are read or written. No network calls are made.");
  process.exit(0);
}

// ---------------------------------------------------------------------------
// INPUT VALIDATION
// ---------------------------------------------------------------------------
const FORBIDDEN_CHARS = /[\n\r\x00;<>&|`$(){}\[\]]/;
const MAX_NAME_LENGTH = 100;

export function validateName(name: unknown): { valid: true; name: string } | { valid: false; error: string } {
  if (typeof name !== "string" || name.length === 0) {
    return { valid: false, error: "Error: name must be a non-empty string." };
  }
  if (name.length > MAX_NAME_LENGTH) {
    return { valid: false, error: "Error: name must be 100 characters or fewer." };
  }
  if (FORBIDDEN_CHARS.test(name)) {
    return { valid: false, error: "Error: name contains invalid characters." };
  }
  return { valid: true, name: name.trim() };
}

// ---------------------------------------------------------------------------
// SERVER DEFINITION
// ---------------------------------------------------------------------------
const server = new Server(
  {
    name: "greeter-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register tool list
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "greet",
        description: "Return a greeting for the given name.",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description:
                "The name to greet. Non-empty, <= 100 characters, no shell metacharacters.",
            },
          },
          required: ["name"],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name: toolName, arguments: toolArgs } = request.params;

  if (toolName === "greet") {
    const validation = validateName(toolArgs?.name);
    if (!validation.valid) {
      return {
        content: [{ type: "text", text: validation.error }],
        isError: true,
      };
    }
    return {
      content: [
        {
          type: "text",
          text: `Hello, ${validation.name}! Welcome.`,
        },
      ],
    };
  }

  return {
    content: [{ type: "text", text: `Error: Unknown tool '${toolName}'.` }],
    isError: true,
  };
});

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------
async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP greeter-server running on stdio.");
}

if (process.env.NODE_ENV !== "test") {
  main().catch((err) => {
    console.error("Server error:", err);
    process.exit(1);
  });
}
