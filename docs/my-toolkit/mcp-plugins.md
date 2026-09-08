# Custom AI Toolkit

> **Last verified:** 2026-07-18 · **Drift risk:** high

This section provides an example catalog of clinical and research AI tools, oriented toward vascular neurology, neuroepidemiological data science, and academic research workflows.

This is one example toolkit of custom CLI plugins and MCP (Model Context Protocol) servers. Treat it as a starting point and adapt the selection to your own needs rather than copying it wholesale.

---

## 📦 Custom CLI Plugins (Claude Code & Antigravity)
These plugins teach your AI agent specialized workflows. They are saved on your local machine and run on-demand:

### 1. **Google Workspace CLI (`google-workspace-cli`)**
* **Purpose:** Enables secure automation across Gmail, Google Calendar, Sheets, Docs, and Slides.
* **Common Recipes:** 
  - `gws-workflow-meeting-prep` (agendas + attendee docs)
  - `gws-workflow-standup-report` (calendar meetings + open tasks)
  - `recipe-sync-contacts-to-sheet` (contacts database exports)
* **Replication:** Install the Google Workspace CLI tool and authenticate via OAuth.

### 2. **Maestro Orchestration (`maestro`)**
* **Purpose:** Multi-step workflow management that enforces code quality, performance audits, compliance reviews, and debugging.
* **Common Skills:** `orchestrate`, `execute`, `perf-check`, `compliance-check`, `security-audit`.

### 3. **Science Superpowers (`science-superpowers`)**
* **Purpose:** Enforces scientific rigor for data exploration, statistical analysis, literature surveys, and pre-registering analysis plans.
* **Common Skills:** `framing-research-questions`, `setting-up-reproducible-analysis`, `surveying-prior-work`, `preregistering-analysis`, `verifying-results-before-claiming`.

### 4. **Signum (`signum`)**
* **Purpose:** An evidence-driven development pipeline that tests code changes against a strict contract and audits changes with multiple independent model checkpoints.

### 5. **Official Claude Code Plugins**
These are the core plugins loaded by Claude Code for dev workflows:
* **`code-review`**: Runs refactoring audits and tests code reviews.
* **`feature-dev`**: Drives autonomous multi-file feature implementations.
* **`frontend-design`**: Designs and polishes visual layouts, grids, and styling.
* **`chrome-devtools-mcp`**: Dom inspector and devtools debugger.
* **`context7`**: Repository context indexer for large projects.
* **`exa`**: Target semantic web searches and doc searches.
* **`firecrawl`**: Converts websites to raw, clean Markdown files.
* **`desktop-commander`**: Desktop macro actions and keyboard controls.
* **`code-simplifier`**: Refactors complex methods into cleaner code patterns.
* **`commit-commands`**: Atomically generates clean git commits.
* **`hookify`**: Installs pre-commit / post-checkout automation hooks.
* **`claude-code-setup`**: Project setup scaffolds and guidelines.
* **`claude-md-management`**: Audits, formats, and reviews markdown guides.
* **`github`**: GitHub API integration (PRs, issues, status checks).
* **`coderabbit`**: Code Rabbit review integrator.

---

## 🔧 Configured MCP Servers (27 Total)
Model Context Protocol (MCP) servers allow Claude to interact with databases, local files, and web APIs. The configuration is saved in:
`%APPDATA%\Claude\claude_desktop_config.json` (Windows) / `~/Library/Application Support/Claude/claude_desktop_config.json` (Mac)

Here are the key servers in this example toolkit:

### 1. Research & Literature Servers
* **PubMed (`pubmed`)**: Primary access to search PubMed abstracts and retrieve metadata.
* **Biomedical GPT (`bgpt`)**: Search and retrieve papers/metadata from clinical/biomedical databases.
* **medRxiv (`medrxiv`)**: Retrieves preprints in clinical medicine and epidemiology.
* **NICE guidelines (`medical-guidelines`)**: Access to evidence-based clinical guidance.

### 2. Web & Automation
* **Brave Search (`brave-search`)**: Safe, structured web search for real-time fact checking.
* **Puppeteer (`puppeteer`)**: Browser automation to scrape tables or capture page layouts.
* **Helium (`helium`)**: Financial news, stock options prices, source bias, memes, and trading strategies.

### 3. Database Operations
* **SQLite (`sqlite`)**: Local database query engine for medical data sets.
* **PostgreSQL (`postgres`)**: Database connection for larger neuroepidemiology data.

---

## ⚙️ How to Set Up a Similar Toolkit

!!! warning "Third-party servers and marketplaces run code with your permissions"
    Unpinned third-party MCP servers and plugin marketplaces execute arbitrary code with your permissions. Before you install anything below: pin versions to a reviewed release, prefer official or scoped packages, review the source, and grant least privilege. See [MCP security](../mcp/security.md).

Follow these steps to set up a comparable toolkit:

### Step 1: Install Node.js
Many MCP servers run via `npx`. Ensure Node.js (v18+) is installed on the machine.
```powershell
winget install OpenJS.NodeJS
```

### Step 2: Configure the Desktop Config File
1. Open the Claude Desktop Configuration file:
   - **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
   - **Mac:** `~/Library/Application Support/Claude/claude_desktop_config.json`
2. Copy and paste the following sanitized JSON structure:

```json
{
  "mcpServers": {
    "pubmed": {
      "command": "npx",
      "args": ["-y", "pubmed-mcp-server"]
    },
    "bgpt": {
      "command": "npx",
      "args": ["-y", "bgpt-mcp-server"]
    },
    "medrxiv": {
      "command": "npx",
      "args": ["-y", "medrxiv-mcp-server"]
    },
    "medical-guidelines": {
      "command": "npx",
      "args": ["-y", "medical-mcp"]
    },
    "sqlite": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sqlite", "--db", "C:/path/to/your/database.db"]
    },
    "helium": {
      "command": "npx",
      "args": ["-y", "helium-mcp-server"]
    },
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "YOUR_BRAVE_API_KEY_HERE"
      }
    },
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
    }
  }
}
```
3. Restart Claude Desktop. The servers will appear as available tools in the chat UI.

### Step 3: Set up CLI Plugins
For command-line execution (e.g. in Claude Code or Antigravity):
1. Register the plugin marketplaces:
   ```bash
   /plugin marketplace add ccplugins/awesome-claude-code-plugins
   /plugin marketplace add jeremylongshore/claude-code-plugins-plus-skills
   ```
2. Search and install the required plugins:
   ```bash
   /plugin install code-review
   /plugin install bug-detective
   ```
