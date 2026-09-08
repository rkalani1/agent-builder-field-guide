/**
 * OpenAI Agents SDK — TypeScript example agent (INERT BY DEFAULT)
 *
 * This script exits immediately unless OPERATOR_APPROVED_TO_RUN=1 is set.
 * It prints what it WOULD do before doing anything.
 * It never writes outside ./sandbox/.
 * It never makes network calls in the inert default mode.
 * No real secrets are included — use OPENAI_API_KEY=sk-REPLACE_ME as a placeholder.
 *
 * Reference: https://github.com/openai/openai-agents-python
 * NPM package: @openai/agents (verify current name on npm before installing)
 */

import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// SAFETY GATE: exit immediately unless explicitly approved
// ---------------------------------------------------------------------------
export function runSafetyGate() {
  const APPROVED = process.env.OPERATOR_APPROVED_TO_RUN === "1";

  if (!APPROVED) {
    console.log("=".repeat(60));
    console.log("DRY-RUN MODE — This script will NOT make any API calls.");
    console.log("Set OPERATOR_APPROVED_TO_RUN=1 to enable live execution.");
    console.log("=".repeat(60));
    console.log();
    console.log("What this script WOULD do if enabled:");
    console.log("  1. Read OPENAI_API_KEY from process.env.");
    console.log("  2. Register the readNotes() function as a tool.");
    console.log("  3. Create an Agent with the summarization system prompt.");
    console.log("  4. Run the agent against ./sandbox/notes/.");
    console.log("  5. Print the resulting summary to stdout.");
    console.log();
    console.log("Sandbox directory that would be used: ./sandbox/");
    console.log("No files would be created, modified, or deleted.");
    console.log("No network calls would be made except to the OpenAI API.");
    process.exit(0);
  }

// ---------------------------------------------------------------------------
  // API KEY CHECK
  // ---------------------------------------------------------------------------
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("ERROR: OPENAI_API_KEY environment variable is not set.");
    console.error("Set it to your OpenAI API key before running this script.");
    console.error("Example: export OPENAI_API_KEY=sk-REPLACE_ME");
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// IMPORTS (only reached when OPERATOR_APPROVED_TO_RUN=1)
// Note: import the actual SDK — verify package name on npm before installing.
// ---------------------------------------------------------------------------
// import { Agent, Runner, tool } from "@openai/agents";

// ---------------------------------------------------------------------------
// SANDBOX ENFORCEMENT
// ---------------------------------------------------------------------------
export const SANDBOX_DIR = path.resolve("./sandbox");

export function safePath(relativePath: string): string {
  const resolved = path.resolve(SANDBOX_DIR, relativePath);

  let realResolved: string;
  try {
    realResolved = fs.realpathSync(resolved);
  } catch (err: any) {
    // If the file doesn't exist, resolve as much of the path as possible
    if (err.code === 'ENOENT') {
      let currentPath = resolved;
      while (!fs.existsSync(currentPath)) {
        const parent = path.dirname(currentPath);
        if (parent === currentPath) {
          break;
        }
        currentPath = parent;
      }
      const realCurrentPath = fs.existsSync(currentPath) ? fs.realpathSync(currentPath) : currentPath;
      const relativeFromCurrent = path.relative(currentPath, resolved);
      realResolved = relativeFromCurrent === ''
        ? realCurrentPath
        : path.resolve(realCurrentPath, relativeFromCurrent);
    } else {
      throw err;
    }
  }

  const realSandbox = fs.existsSync(SANDBOX_DIR) ? fs.realpathSync(SANDBOX_DIR) : SANDBOX_DIR;

  if (!realResolved.startsWith(realSandbox + path.sep) && realResolved !== realSandbox) {
    throw new Error(
      `Path '${relativePath}' resolves outside sandbox directory '${SANDBOX_DIR}'. Access denied.`
    );
  }
  return realResolved;
}

// ---------------------------------------------------------------------------
// TOOL DEFINITION
// ---------------------------------------------------------------------------
/**
 * Read a plain-text note file from the sandbox directory.
 *
 * @param filePath - Relative path to the file within the sandbox directory.
 * @returns The file contents as a string.
 * @throws Error if path resolves outside the sandbox.
 * @throws Error if the file does not exist.
 */
export function readNotes(filePath: string): string {
  const safe = safePath(filePath);
  if (!fs.existsSync(safe)) {
    throw new Error(`File not found in sandbox: ${filePath}`);
  }
  const stat = fs.statSync(safe);
  if (!stat.isFile()) {
    throw new Error(`Path is not a file: ${filePath}`);
  }
  return fs.readFileSync(safe, "utf-8");
}

// Tool descriptor for the SDK (shape depends on @openai/agents API — verify before use)
const readNotesTool = {
  name: "read_notes",
  description: "Read a plain-text note file from the sandbox/notes/ directory.",
  parameters: {
    type: "object" as const,
    properties: {
      path: {
        type: "string",
        description: "Relative path to the file within the sandbox directory.",
      },
    },
    required: ["path"],
  },
  execute: async (args: { path: string }) => readNotes(args.path),
};

// ---------------------------------------------------------------------------
// SYSTEM PROMPT
// ---------------------------------------------------------------------------
const SYSTEM_PROMPT = `You are a note summarization assistant. Read the plain-text files provided \
via the read_notes tool and produce a structured summary (300-500 words) of key themes, decisions, \
and action items. Do not add information not present in the source files. Output format: markdown.`;

export function getValidNoteFiles(notesDir: string): string[] {
  if (!fs.existsSync(notesDir)) {
    console.error(`ERROR: Sandbox notes directory not found: ${notesDir}`);
    console.error("Create ./sandbox/notes/ and add .txt files before running.");
    process.exit(1);
  }

  const noteFiles = fs
    .readdirSync(notesDir)
    .filter((f) => f.endsWith(".txt") || f.endsWith(".md"))
    .slice(0, 50);

  if (noteFiles.length === 0) {
    console.error("ERROR: No .txt or .md files found in ./sandbox/notes/");
    process.exit(1);
  }

  return noteFiles;
}

// ---------------------------------------------------------------------------
// MAIN (illustrative — wire to actual SDK Runner when enabling)
// ---------------------------------------------------------------------------
async function main(): Promise<void> {
  const notesDir = path.join(SANDBOX_DIR, "notes");
  const noteFiles = getValidNoteFiles(notesDir);

  const fileList = noteFiles.join(", ");
  const userMessage = `Please summarize the following note files from sandbox/notes/: ${fileList}`;

  console.log(`Running agent against ${noteFiles.length} file(s)...`);
  console.log("(Wire to actual @openai/agents Runner.run() here)");
  console.log("\nSystem prompt:");
  console.log(SYSTEM_PROMPT);
  console.log("\nFirst tool call would be read_notes for:", noteFiles[0]);
  console.log("\nUser message:", userMessage);
}

if (require.main === module) {
  runSafetyGate();
  main().catch((err) => {
    console.error("Agent error:", err);
    process.exit(1);
  });
}
