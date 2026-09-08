document$.subscribe(function () {
  "use strict";

  // Dictionaries containing model-specific configurations for ChatGPT, Claude, Gemini, Grok, and Perplexity
  const modelData = {
    chatgpt: {
      name: "ChatGPT",
      lede: "Start with one real task. Copy a strong prompt, choose the right ChatGPT surface, and improve the result.",
      officialLinks: [
        { text: "Open ChatGPT", url: "https://chatgpt.com/" },
        { text: "Download ChatGPT App", url: "https://chatgpt.com/download" }
      ],
      setupCards: [
        { title: "Sign in once", desc: "Use the same account on the devices and web browser sidebars.", links: '<a href="https://chatgpt.com/">Open ChatGPT</a>' },
        { title: "Set Custom Instructions", desc: "Tell ChatGPT your default tone, style, and rules in Settings under Custom Instructions.", links: '<a href="https://help.openai.com/en/articles/8096350-custom-instructions-for-chatgpt">Instructions guide</a>' },
        { title: "Turn on Memory", desc: "Memory helps ChatGPT recall details across chats to maintain project context automatically.", links: '<a href="https://help.openai.com/en/articles/8590148-memory-in-chatgpt">Memory guide</a>' },
        { title: "Add Custom GPTs", desc: "Explore or build custom assistants in the GPT Store to automate specific workflows.", links: '<a href="https://help.openai.com/en/articles/8241126-gpt-actions">GPT Actions guide</a>' },
        { title: "Save your first Project", desc: "Save reference files, rules, and instructions in a dedicated Project workspace (Plus/Team).", links: '<a href="https://help.openai.com/en/articles/9427670-projects-in-chatgpt">Projects guide</a>' }
      ],
      toolkitPluginsTabName: "Custom GPTs",
      toolkit: [
        { title: "Codex CLI", desc: "OpenAI's terminal-based AI coding assistant for inspecting codebases and running tests.", tags: ["CLI", "Codex", "Code"] },
        { title: "OpenAI Agents SDK", desc: "Build hosted, autonomous multi-agent loops and tool calls programmatically.", tags: ["SDK", "OpenAI", "Agents"] },
        { title: "ChatGPT Workspace Sidebars", desc: "Side panels inside Microsoft Office Online (Word, PPT, Excel) for drafting.", tags: ["Microsoft Office", "Add-in", "Office"] },
        { title: "PubMed Custom GPT Action", desc: "Searches PubMed, bioRxiv, and medRxiv using custom GPT Actions.", tags: ["ChatGPT Plus", "Custom Action", "Research"] },
        { title: "SQLite / Database Action", desc: "Connects Custom GPTs to internal relational databases using SQL endpoints.", tags: ["Database", "GPT Action", "Data"] },
        { title: "Google Workspace Action", desc: "Connects Custom GPTs to Gmail, Calendar, Sheets, and Drive via OAuth.", tags: ["GPT Action", "Workspace", "Office"] }
      ],
      workedExamples: [
        {
          type: "Meeting note",
          bad: "Summarize this meeting note.",
          badReason: "no audience, length, format, or source constraints.",
          fixed: `Summarize this meeting note for ChatGPT Canvas:
[PASTE NOTE]

Goal:
Create a grouped decision memo.

Return:
- 3 key decisions.
- 3 immediate action items (with owners and deadlines).
- Any open questions or ambiguities.

Keep the tone direct and professional.`
        },
        {
          type: "Code change",
          bad: "Refactor this file.",
          badReason: "no scope, check command, or smallest-change rule.",
          fixed: `Help me refactor this script:
[PASTE FILE]

Before writing code:
- Explain what the script does.
- Propose the smallest change to resolve [PROBLEM].

After writing code:
- Output the modified functions only.
- List what tests I should run.`
        }
      ],
      labSurfaces: [
        { key: "chat", name: "Chat" },
        { key: "canvas", name: "Canvas" },
        { key: "project", name: "Project" },
        { key: "gpt", name: "Custom GPT" },
        { key: "voice", name: "Voice" },
        { key: "office", name: "Office" },
        { key: "chrome", name: "Chrome" },
        { key: "mobile", name: "Mobile" },
        { key: "code", name: "Codex CLI" }
      ],
      surfaceFilterLabels: [
        { key: "all", name: "All" },
        { key: "draft", name: "Draft" },
        { key: "research", name: "Research" },
        { key: "files", name: "Files" },
        { key: "office", name: "Office" },
        { key: "code", name: "Code" },
        { key: "agents", name: "Agents" }
      ],
      surfacesGrid: [
        { groups: ["draft", "research", "files"], badge: "Chat", title: "ChatGPT Chat", desc: "Quick questions, file uploads, SearchGPT, and image analysis.", actionHtml: '<a class="button small primary" href="https://chatgpt.com/">Open Chat</a>' },
        { groups: ["draft", "files"], badge: "Canvas", title: "ChatGPT Canvas", desc: "Interactive documents and code editing directly inside the chat window.", actionHtml: '<a class="button small" href="https://help.openai.com/en/articles/9891823-using-canvas-in-chatgpt">Canvas guide</a>' },
        { groups: ["files", "agents"], badge: "Projects", title: "ChatGPT Projects", desc: "Persistent workspaces to upload files and instructions for repeated team tasks.", actionHtml: '<a class="button small primary" href="https://help.openai.com/en/articles/9427670-projects-in-chatgpt">Create Project</a>' },
        { groups: ["research", "agents"], badge: "Custom GPTs", title: "Custom GPTs", desc: "Packaged chatbots with specific system prompts, files, and Custom API Actions.", actionHtml: '<a class="button small primary" href="https://chatgpt.com/gpts">Explore GPTs</a>' },
        { groups: ["draft", "office"], badge: "Voice", title: "Advanced Voice", desc: "Real-time, low-latency conversational audio for brainstorming and dictation.", actionHtml: '<a class="button small" href="https://help.openai.com/en/articles/8904724-advanced-voice-mode">Voice Guide</a>' },
        { groups: ["draft", "office", "files"], badge: "Word", title: "Copilot / Word Add-in", desc: "Rewrite, draft, and format document text in Microsoft Word using OpenAI models.", actionHtml: '<a class="button small" href="https://support.microsoft.com/en-us/copilot">Microsoft Copilot</a>' },
        { groups: ["office"], badge: "Excel", title: "Copilot / Excel Add-in", desc: "Analyze formulas, tables, and workbook data using conversational sidebar models.", actionHtml: '<a class="button small" href="https://support.microsoft.com/en-us/copilot">Microsoft Copilot</a>' },
        { groups: ["research", "files"], badge: "Chrome", title: "SearchGPT / Chrome", desc: "Read web pages, search real-time data, and summarize tabs in the browser.", actionHtml: '<a class="button small" href="https://help.openai.com/en/articles/9938831-searchgpt-in-chrome">SearchGPT Guide</a>' },
        { groups: ["files", "code", "agents"], badge: "Codex CLI", title: "Codex CLI", desc: "Terminal-based AI coding assistant for inspecting codebases and running tests.", actionHtml: '<a class="button small" href="https://github.com/openai/codex-cli">Open Codex</a>' },
        { groups: ["code", "agents"], badge: "API", title: "OpenAI API", desc: "Direct endpoint access to GPT-4o, o1, and embeddings for hosted applications.", actionHtml: '<a class="button small primary" href="https://platform.openai.com/">Open Platform</a>' },
        { groups: ["code", "agents"], badge: "SDK", title: "OpenAI Agents SDK", desc: "Node and Python SDK for building autonomous, multi-agent workflows.", actionHtml: '<a class="button small" href="https://github.com/openai/openai-agents-sdk">Agents SDK</a>' }
      ],
      decisionRules: [
        { title: "Chat or Project?", desc: "<strong>Chat</strong> for one-time questions. <strong>Project</strong> when you reuse the same files, rules, or instructions repeatedly." },
        { title: "Standard or o1 Pro?", desc: "<strong>Standard (GPT-4o)</strong> for writing and quick drafts. <strong>o1 Pro</strong> for complex coding, math, or reasoning." },
        { title: "Canvas or Chat?", desc: "<strong>Canvas</strong> for editing documents or coding directly. <strong>Chat</strong> for simple question-and-answer loops." },
        { title: "Custom GPT or SDK?", desc: "<strong>Custom GPT</strong> for no-code tools shared in ChatGPT. <strong>SDK</strong> for hosted agents with code logic." }
      ],
      glossary: [
        { term: "Custom Instructions", def: "Saved preferences for tone, detail, format, and rules that ChatGPT applies to every chat." },
        { term: "Project", def: "A persistent workspace in ChatGPT Plus/Team that stores shared files and custom instructions." },
        { term: "Canvas", def: "A side-by-side editing interface inside ChatGPT for writing documents or refining code in real-time." },
        { term: "Custom GPT", def: "A tailored chatbot configured with custom files, instructions, and API action integrations." },
        { term: "Actions", def: "API connection settings that let a Custom GPT read or write data to external web services." },
        { term: "o1 Model", def: "OpenAI's reasoning model that thinks step-by-step before answering complex math or coding problems." },
        { term: "Memory", def: "A feature that allows ChatGPT to remember facts, preferences, and details across separate chats." },
        { term: "Agents SDK", def: "A developer toolkit for orchestrating multi-agent loops and tool calls programmatically." }
      ],
      modelFit: {
        title: "Model fit",
        copy: "Use GPT-4o for everyday work and writing. Switch to o1 or o3-mini for reasoning, math, and code.",
        links: [
          { text: "GPT-4o Overview", url: "https://openai.com/index/gpt-4o-and-more-gpts-to-plus-users/" },
          { text: "o1 Reasoning Models", url: "https://openai.com/index/introducing-openai-o1-preview/" }
        ]
      },
      modelFitHints: {
        default: "Use GPT-4o for standard writing and file analysis. Switch to o1 for coding, logic, or high-stakes reasoning.",
        chat: "Use GPT-4o for general questions. Use o1 when you need deep thinking on logical or technical topics.",
        canvas: "Use GPT-4o for document edits. Use o1 for complex code refactoring and logical updates inside Canvas.",
        project: "Use GPT-4o for most Projects. Switch to o1 when the project involves complex data parsing or software engineering.",
        gpt: "Use GPT-4o for Custom GPT actions. Use o1 if the GPT is performing heavy calculation, reasoning, or math tasks.",
        voice: "Advanced Voice uses a native GPT-4o audio model. Optimize for spoken instructions and quick checkins.",
        office: "Use GPT-4o within Word and Excel (Copilot) for general drafting and formula explanations.",
        chrome: "Use GPT-4o for general web reading and SearchGPT summaries.",
        code: "Use o1 or o3-mini for repository edits, complex bug-finding, and deep logic analysis."
      },
      outputHints: {
        useful: "a useful answer with a clear next step",
        email: "an email draft with subject line, body, and optional shorter version",
        document: "a structured document with headings, bullets, and a review checklist",
        slides: "a slide-by-slide outline with title, key point, and speaker note for each slide",
        spreadsheet: "a spreadsheet-friendly table, formula explanation, or analysis checklist",
        design: "a layout brief with canvas guidelines, target audience, and usability checks",
        decision: "a decision memo with options, tradeoffs, recommendation, and risks",
        code: "a small code change path with files to inspect, edit steps, and tests to run",
        agent: "an agent workflow brief with trigger, context, steps, allowed actions, checks, and handoff"
      },
      fixData: {
        vague: { title: "Too vague", next: "ChatGPT sounds reasonable but you still cannot act on the answer.", prompt: "Make your last answer specific enough that I can act on it today. Revise it with concrete steps, examples, clear decision points, and what I should do first. Keep the language simple." },
        wrong: { title: "Possibly wrong", next: "A fact, calculation, or interpretation may be incorrect.", prompt: "Review your last answer for possible errors. Do not defend the answer. Compare each claim to the context I provided and output a corrected version separating facts from uncertainty." },
        long: { title: "Too long", next: "The answer is useful but too hard to scan quickly.", prompt: "Shorten your last answer. Give me the shortest useful version, the three details I should not miss, and remove repetition or background that does not change what I should do." },
        technical: { title: "Too technical", next: "The answer assumes too much background knowledge.", prompt: "Rewrite your last answer for a beginner. Use everyday language, define necessary terms in one sentence, replace jargon with examples, and keep steps practical." },
        format: { title: "Wrong format", next: "The content is good but the visual layout is not useful.", prompt: "Reformat your last answer into this structure: [PASTE THE FORMAT: table, checklist, email, memo, slides, steps, or bullets]. Keep only the content that supports that format." },
        stuck: { title: "Needs questions", next: "ChatGPT needs more context but did not ask for it.", prompt: "Pause and ask me the three questions that would most improve your answer. Explain why each matters in one short phrase." },
        evidence: { title: "Weak evidence", next: "Facts matter and you need to know what the claims rest on.", prompt: "Strengthen the evidence in your last answer. Separate confirmed facts in the material I provided from reasonable inferences, and list what I should verify." },
        action: { title: "Not actionable", next: "The answer explains the topic but does not help you move.", prompt: "Turn your last answer into an action checklist. For each item, include the action, why it matters, and what good completion looks like." },
        tone: { title: "Tone is off", next: "The answer is too stiff, too casual, too forceful, or not right for the audience.", prompt: "Rewrite your last answer for this audience: [AUDIENCE] using this tone: [WARM, DIRECT, EXECUTIVE, BEGINNER-FRIENDLY]. Remove anything that sounds unnatural." }
      },
      powerMoves: [
        { title: "Canvas Iteration", desc: "Ask ChatGPT to revise the document in Canvas: add a section, simplify tone, or add a table." },
        { title: "Chain of Thought", desc: "For complex tasks, use o1 or force ChatGPT to output its thinking steps before giving the answer." },
        { title: "Meta-Prompting", desc: "Have ChatGPT interview you before writing the final prompt for your task." }
      ],
      agentLanes: [
        { badge: "Beginner", title: "Personal Custom GPT", desc: "Use a Custom GPT with uploaded background files and custom system instructions." },
        { badge: "Builder", title: "Codex CLI Workflow", desc: "Use Codex CLI when files, tests, command-line checks, or pull requests matter." },
        { badge: "Developer", title: "Hosted Agents", desc: "Use the OpenAI Agents SDK when the agent must run inside a server or external application." }
      ],
      agentLinks: [
        { text: "Agents SDK Github", url: "https://github.com/openai/openai-agents-sdk" },
        { text: "GPT Actions Overview", url: "https://help.openai.com/en/articles/8241126-gpt-actions" }
      ],
      promptsList: [
        {
          summary: "Custom GPT and connected actions",
          prompt: `Help me design a Custom GPT for this workflow.

Workflow:
[WHAT I WANT TO DO REPEATEDLY]

Sources or apps involved:
[FILES, DRIVE, EMAIL, CALENDAR, SLACK, OR OTHER]

Recommend:
1. Whether to use ChatGPT Chat, a Project, or a Custom GPT.
2. The first Custom Action to configure in the API settings.
3. A safe first test using non-sensitive material.
4. The exact system prompt to paste into the GPT settings.`
        },
        {
          summary: "Codex Code Help",
          prompt: `Help me refactor this file using Codex CLI.

Task:
[DESCRIBE THE CODE CHANGE]

Before editing:
- Explain what the file does.
- Identify the files likely involved.
- Propose the smallest useful change.

After editing, output the code change and write a test case I can run.`
        }
      ],
      mcpConfig: `{
  "customGpts": {
    "pubmed-search": {
      "endpoint": "https://api.pubmed-custom-gpt.example.com",
      "auth": "OAuth2"
    },
    "sqlite-connector": {
      "endpoint": "https://api.db-connector.example.com",
      "auth": "APIKey"
    }
  }
}`
    },
    claude: {
      name: "Claude",
      lede: "Start with one real task. Copy a strong prompt, choose the right Claude surface, and improve the result.",
      officialLinks: [
        { text: "Open Claude", url: "https://claude.ai/" },
        { text: "Download Claude App", url: "https://claude.ai/downloads" }
      ],
      setupCards: [
        { title: "Sign in once", desc: "Use the same account on the devices and apps you already use.", links: '<a href="https://claude.ai/">Open Claude</a> &middot; <a href="https://claude.ai/downloads">Download Claude</a>' },
        { title: "Set Personal Instructions", desc: "Tell Claude your default tone, detail level, and when it should ask first.", links: '<a href="https://support.claude.com/en/articles/10185728-understanding-claude-s-personalization-features">Instructions guide</a>' },
        { title: "Turn on Memory and search", desc: "Memory and chat search make follow-ups smarter because Claude can build on prior context.", links: '<a href="https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context">Memory guide</a>' },
        { title: "Add one Connector", desc: "Pick the app you use most, review access, and test with non-sensitive material.", links: '<a href="https://support.claude.com/en/articles/14328846-browse-skills-connectors-and-plugins-in-one-directory">Directory</a>' },
        { title: "Save your first Project", desc: "Choose one repeated workflow and add its instructions, files, and examples.", links: '<a href="https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects">Project guide</a>' }
      ],
      toolkitPluginsTabName: "Claude Plugins",
      toolkit: [
        { title: "Google Workspace CLI (google-workspace-cli)", desc: "Enables secure automation across Gmail, Google Calendar, Sheets, Docs, and Slides.", tags: ["CLI", "Workspace", "Office"] },
        { title: "Maestro Orchestration (maestro)", desc: "Multi-step workflow management enforcing code quality, performance audits, compliance reviews, and debugging. Skills: orchestrate, execute, perf-check.", tags: ["CLI", "Maestro", "Code"] },
        { title: "Science Superpowers (science-superpowers)", desc: "Enforces scientific rigor for data exploration, statistical analysis, literature surveys, and pre-registering analysis plans.", tags: ["CLI", "Science", "Research"] },
        { title: "Signum (signum)", desc: "An evidence-driven development pipeline that tests code changes against a contract and audits changes with multiple model checkpoints.", tags: ["CLI", "Signum", "Code"] },
        { title: "Claude Code", desc: "Anthropic's official local command-line agent for repository editing, checks, and running project tests.", tags: ["CLI", "Claude Code", "Code"] },
        { title: "PubMed MCP Server", desc: "Connects Claude to PubMed API for clinical literature searches.", tags: ["MCP", "PubMed", "Research"] },
        { title: "BGPT MCP Server", desc: "Connects Claude to Biomedical BioGPT models for clinical synthesis.", tags: ["MCP", "bgpt", "Research"] },
        { title: "medRxiv MCP Server", desc: "Retrieves preprints in clinical medicine and epidemiology.", tags: ["MCP", "medrxiv", "Research"] },
        { title: "NICE Guidelines MCP", desc: "Access to evidence-based clinical guidance and medical guidelines.", tags: ["MCP", "Guidelines", "Research"] },
        { title: "Helium MCP Server", desc: "Financial news, options prices, source bias, memes, and trading strategies.", tags: ["MCP", "Helium", "Research"] },
        { title: "SQLite MCP Server", desc: "Connects Claude Code and desktop to local database query engine for medical data sets.", tags: ["MCP", "sqlite", "Data"] },
        { title: "PostgreSQL MCP Server", desc: "Database connection for larger neuroepidemiology datasets.", tags: ["MCP", "postgres", "Data"] },
        { title: "Puppeteer / Browser MCP", desc: "Browser automation to scrape tables or capture page layouts.", tags: ["MCP", "puppeteer", "Research"] },
        { title: "Brave Search MCP", desc: "Connects Claude to Brave Search API for live web queries and fact-checking.", tags: ["MCP", "brave-search", "Research"] },
        { title: "Official Claude Code Plugins", desc: "Loaded plugins: code-review, code-simplifier, feature-dev, coderabbit, chrome-devtools-mcp, context7, exa, firecrawl, desktop-commander, commit-commands, hookify, github.", tags: ["Plugin", "Claude Code", "Code"] }
      ],
      workedExamples: [
        {
          type: "Meeting note",
          bad: "Summarize this meeting note.",
          badReason: "no XML structure, audience, or check instructions.",
          fixed: `Summarize this meeting note for [AUDIENCE] using XML structure.
<note>
[PASTE NOTE]
</note>

Goal:
Help me leave with decisions, owners, and deadlines.

Return inside <summary> tags:
- 3 decisions.
- 3 owners.
- 3 deadlines.
- Anything unclear before finalizing.`
        },
        {
          type: "Code change",
          bad: "Refactor this file.",
          badReason: "no scope, check command, or smallest-change rule.",
          fixed: `Help me improve this file:
[FILE OR PATH]

Before editing:
- Explain the relevant part first.
- Propose the smallest useful change.
- Avoid unrelated cleanup.

After editing:
- Run the existing check command if one exists.
- Summarize what changed.
- Tell me what to test.`
        }
      ],
      labSurfaces: [
        { key: "chat", name: "Chat" },
        { key: "project", name: "Project" },
        { key: "artifact", name: "Artifact" },
        { key: "research", name: "Research" },
        { key: "office", name: "Office" },
        { key: "chrome", name: "Chrome" },
        { key: "cowork", name: "Cowork" },
        { key: "connectors", name: "Connectors" },
        { key: "plugins", name: "Plugins" },
        { key: "mobile", name: "Mobile" },
        { key: "code", name: "Code" }
      ],
      surfaceFilterLabels: [
        { key: "all", name: "All" },
        { key: "draft", name: "Draft" },
        { key: "research", name: "Research" },
        { key: "files", name: "Files" },
        { key: "office", name: "Office" },
        { key: "code", name: "Code" },
        { key: "agents", name: "Agents" }
      ],
      surfacesGrid: [
        { groups: ["draft", "research", "files"], badge: "Chat", title: "Drafts, uploads, images", desc: "Quick questions, emails, file summaries, decisions, and image analysis.", actionHtml: '<a class="button small primary" href="https://support.claude.com/en/articles/8241126-upload-files-to-claude">Upload files</a><a class="button small" href="https://platform.claude.com/docs/en/build-with-claude/vision">Vision guide</a>' },
        { groups: ["research", "agents"], badge: "Research", title: "Multi-source answers", desc: "Several searches, connected context, and citations you can check.", actionHtml: '<a class="button small primary" href="https://support.claude.com/en/articles/11088861-using-research-on-claude">Use Research</a>' },
        { groups: ["files", "agents"], badge: "Projects", title: "Reusable workspaces", desc: "Saved files, examples, instructions, and role for repeated work.", actionHtml: '<a class="button small primary" href="https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects">Set up Project</a>' },
        { groups: ["draft", "files"], badge: "Artifacts", title: "Editable outputs", desc: "Documents, charts, prototypes, small apps, and visual previews.", actionHtml: '<a class="setup-link" href="https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them">Artifact docs</a>' },
        { groups: ["draft", "office"], badge: "Design", title: "Visual drafts", desc: "One-pagers, prototypes, slides, and design-system-aware visuals.", actionHtml: '<a class="setup-link" href="https://support.claude.com/en/articles/14604416-get-started-with-claude-design">Design guide</a>' },
        { groups: ["draft", "office", "files"], badge: "Word", title: "Document review", desc: "Review, rewrite, and improve selected text while preserving structure.", actionHtml: '<a class="button small primary" href="https://support.claude.com/en/articles/14465370-use-claude-for-word">Set up in Word</a>' },
        { groups: ["office"], badge: "Excel", title: "Workbook help", desc: "Formula explanations, table checks, analysis, and doc/deck handoff.", actionHtml: '<a class="button small primary" href="https://support.claude.com/en/articles/12650343-use-claude-for-excel">Set up in Excel</a>' },
        { groups: ["research", "files"], badge: "Chrome", title: "Website tasks", desc: "Reading, comparing, navigating, and low-risk browser workflows.", actionHtml: '<a class="button small primary" href="https://support.claude.com/en/articles/12012173-get-started-with-claude-in-chrome">Set up Chrome</a>' },
        { groups: ["files", "code", "agents"], badge: "Cowork", title: "Longer desktop jobs", desc: "Selected files, folders, apps, progress visibility, and handoff.", actionHtml: '<a class="button small primary" href="https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork">Cowork guide</a>' },
        { groups: ["code", "agents"], badge: "Claude Code", title: "Repository work", desc: "Inspect first, make the smallest useful edit, then run checks.", actionHtml: '<a class="button small primary" href="https://code.claude.com/docs/en/overview">Open Claude Code</a>' }
      ],
      decisionRules: [
        { title: "Chat or Project?", desc: "<strong>Chat</strong> for one-time work. <strong>Project</strong> when you would reuse the same background, files, or instructions." },
        { title: "Search or Research?", desc: "<strong>Search</strong> for one fact. <strong>Research</strong> when Claude needs several sources, citations, and synthesis." },
        { title: "Artifact or Design?", desc: "<strong>Artifact</strong> for an editable output. <strong>Design</strong> when the visual result itself needs polish." },
        { title: "Connector or Plugin?", desc: "<strong>Connector</strong> adds one trusted app. <strong>Plugin</strong> bundles a Cowork workflow with tools and skills." }
      ],
      glossary: [
        { term: "Instructions", def: "Saved preferences for tone, detail, format, and when Claude should ask first." },
        { term: "Project", def: "A focused workspace for repeated work with the same files and instructions." },
        { term: "Artifact", def: "An editable output such as a page, chart, document, prototype, or small app." },
        { term: "Research", def: "A deeper mode where Claude searches across sources and returns citations you can check." },
        { term: "Context engineering", def: "Giving Claude the goal, source material, examples, rules, and checks before it works." },
        { term: "Extended thinking", def: "A deeper reasoning mode for hard problems. Use it when the answer needs a careful path." },
        { term: "MCP", def: "Model Context Protocol. A standard way to connect Claude Code or agents to tools and data sources." },
        { term: "Plugin", def: "A Cowork add-on that can include skills, connectors, and subagents for a role or workflow." }
      ],
      modelFit: {
        title: "Model fit",
        copy: "Use Sonnet 4.6 for most everyday work. Switch only when the task clearly needs a different fit.",
        links: [
          { text: "Sonnet 4.6 Launch", url: "https://www.anthropic.com/news/claude-sonnet-4-6" },
          { text: "Opus 4.7 Launch", url: "https://www.anthropic.com/news/claude-opus-4-7" }
        ]
      },
      modelFitHints: {
        default: "Use Sonnet 4.6 for most everyday work. Use Haiku 4.5 for quick, simple, repeated drafts. Use Opus 4.7 for complex reasoning, code, dense images, or high-stakes review.",
        chat: "Use Sonnet 4.6 for everyday chat. Use Haiku 4.5 for quick rewrites or simple summaries. Use Opus 4.7 when the answer affects a serious decision.",
        project: "Use Sonnet 4.6 for most Project work. Use Opus 4.7 when the Project has many files, conflicting context, or a high-stakes review.",
        artifact: "Use Sonnet 4.6 for most Artifacts. Use Opus 4.7 for complex dashboards, dense visual inputs, or multi-step revisions.",
        research: "Use Sonnet 4.6 for ordinary synthesis. Use Opus 4.7 when the question has many sources, dense documents, or a decision you will publish.",
        office: "Use Sonnet 4.6 for most Word, PowerPoint, and Excel work. Use Opus 4.7 for dense decks, complex workbooks, or source-heavy document review.",
        chrome: "Use Sonnet 4.6 for most browser help. Use Haiku 4.5 for quick page summaries and Opus 4.7 for careful comparisons or risky workflows.",
        cowork: "Use Sonnet 4.6 for routine Cowork sessions. Use Opus 4.7 for longer desktop jobs, many files, or work that needs careful handoff.",
        connectors: "Use Sonnet 4.6 for connected-app work. Use Opus 4.7 when Claude must reconcile several sources or produce a decision-ready answer.",
        plugins: "Use Sonnet 4.6 while testing a plugin. Use Opus 4.7 when the workflow spans several tools, files, or review steps.",
        mobile: "Use Haiku 4.5 or Sonnet 4.6 for quick mobile capture and drafts. Use Opus 4.7 later if the task needs deeper review.",
        code: "Use Sonnet 4.6 for routine repo work. Use Opus 4.7 for architecture, difficult bugs, long-running code work, or vision-heavy debugging."
      },
      outputHints: {
        useful: "a useful answer with a clear next step",
        email: "an email draft with subject line, body, and optional shorter version",
        document: "a structured document with headings, bullets, and a review checklist",
        slides: "a slide-by-slide outline with title, key point, and speaker note for each slide",
        spreadsheet: "a spreadsheet-friendly table, formula explanation, or analysis checklist",
        design: "a Claude Design or Artifact brief with layout, audience, and usability checks",
        decision: "a decision memo with options, tradeoffs, recommendation, and risks",
        code: "a small code change path with files to inspect, edit steps, and tests to run",
        agent: "an agent workflow brief with trigger, context, steps, allowed actions, checks, and handoff"
      },
      fixData: {
        vague: { title: "Too vague", next: "Claude sounds reasonable but you still cannot act on the answer.", prompt: "Make your last answer specific enough that I can act on it today. Revise it with concrete steps, examples, clear decision points, and what I should do first. Keep the language simple." },
        wrong: { title: "Possibly wrong", next: "A fact, assumption, calculation, or interpretation may be incorrect.", prompt: "Review your last answer for possible errors. Do not defend the answer. Compare each claim to the context I provided and output a corrected version." },
        long: { title: "Too long", next: "The answer is useful but too hard to scan.", prompt: "Shorten your last answer. Give me the shortest useful version, the three details I should not miss, and remove repetition or background." },
        technical: { title: "Too technical", next: "The answer assumes too much background knowledge.", prompt: "Rewrite your last answer for a beginner. Use everyday language, define necessary terms in one sentence, replace jargon with examples, and keep steps practical." },
        format: { title: "Wrong format", next: "The content is good but the shape is not useful.", prompt: "Reformat your last answer into this structure: [PASTE THE FORMAT: table, checklist, email, memo, slides, steps, or bullets]. Keep only the content that supports that format." },
        stuck: { title: "Needs questions", next: "Claude needs more context but did not ask for it.", prompt: "Pause and ask me the three questions that would most improve your answer. Explain why each matters in one short phrase." },
        evidence: { title: "Weak evidence", next: "Facts matter and you need to know what the answer rests on.", prompt: "Strengthen the evidence in your last answer. Separate confirmed facts from reasonable inferences, and list what I should verify." },
        action: { title: "Not actionable", next: "The answer explains the topic but does not help you move.", prompt: "Turn your last answer into an action checklist. For each item, include the action, why it matters, and what good completion looks like." },
        tone: { title: "Tone is off", next: "The answer is too stiff, too casual, too forceful, or not right for the audience.", prompt: "Rewrite your last answer for this audience: [AUDIENCE] using this tone: [WARM, DIRECT, EXECUTIVE, BEGINNER-FRIENDLY]. Remove anything that sounds unnatural." }
      },
      powerMoves: [
        { title: "Artifact iteration", desc: "Ask Claude to revise the output itself: add a filter, simplify a page, make a dashboard, or add a toggle." },
        { title: "Reason, answer, check", desc: "For complex work, ask Claude to outline the steps, answer, then check against your rules." },
        { title: "Meta-prompting", desc: "When the task is fuzzy, ask Claude to interview you before writing the final prompt." }
      ],
      agentLanes: [
        { badge: "Beginner", title: "Personal workflow", desc: "Use a Project, saved prompt, source files, and a review checklist." },
        { badge: "Builder", title: "Repository workflow", desc: "Use Claude Code when files, tests, command-line checks, or pull requests matter." },
        { badge: "Developer", title: "Hosted agent", desc: "Use the Agent SDK when the agent must run inside an app or service." }
      ],
      agentLinks: [
        { text: "Agent SDK Docs", url: "https://docs.claude.com/en/docs/claude-code/sdk/sdk-overview" },
        { text: "MCP Protocol", url: "https://docs.claude.com/en/docs/claude-code/mcp" }
      ],
      promptsList: [
        {
          summary: "Research and connected apps",
          prompt: `Help me set up Claude for this workflow.

Workflow:
[WHAT I WANT TO DO REPEATEDLY]

Sources or apps involved:
[FILES, DRIVE, EMAIL, CALENDAR, SLACK, LINEAR, DOCS, OR OTHER]

Recommend:
1. Whether to use Chat, Project, Research, a connector, or a Cowork plugin.`
        },
        {
          summary: "Claude Code Help",
          prompt: `Help me with this codebase in plain English.

Task:
[DESCRIBE THE CHANGE]

Before editing:
- Explain the relevant part of the project.
- Identify the files likely involved.
- Tell me the smallest useful change.`
        }
      ],
      mcpConfig: `{
  "mcpServers": {
    "pubmed": { "command": "npx", "args": ["-y", "pubmed-mcp-server"] },
    "sqlite": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-sqlite"] }
  }
}`
    },
    gemini: {
      name: "Gemini",
      lede: "Start with one real task. Copy a strong prompt, choose the right Gemini surface, and improve the result.",
      officialLinks: [
        { text: "Open Gemini", url: "https://gemini.google.com/" },
        { text: "AI Studio (API)", url: "https://aistudio.google.com/" }
      ],
      setupCards: [
        { title: "Sign in once", desc: "Sign in to gemini.google.com and turn on the Workspace Extensions.", links: '<a href="https://gemini.google.com/">Open Gemini</a>' },
        { title: "Set Saved Info", desc: "Tell Gemini your default details, writing preferences, and rules in Settings under Saved Info.", links: '<a href="https://support.google.com/gemini/answer/15281487">Saved Info Guide</a>' },
        { title: "Enable Extensions", desc: "Turn on Gmail, Google Docs, Drive, and Flights extensions to connect your Google ecosystem.", links: '<a href="https://support.google.com/gemini/answer/13690059">Extensions Guide</a>' },
        { title: "Create custom Gems", desc: "Build tailored copilots (Gems) with specific instructions and reference materials (Advanced).", links: '<a href="https://support.google.com/gemini/answer/15222091">Gems Guide</a>' },
        { title: "Test in AI Studio", desc: "Use Google AI Studio to prototype complex instructions and test 2M token context windows.", links: '<a href="https://aistudio.google.com/">Open AI Studio</a>' }
      ],
      toolkitPluginsTabName: "Gems & Extensions",
      toolkit: [
        { title: "Google Workspace CLI (google-workspace-cli)", desc: "Enables secure automation across Gmail, Google Calendar, Sheets, Docs, and Slides.", tags: ["CLI", "Workspace", "Office"] },
        { title: "Maestro Orchestration (maestro)", desc: "Multi-step workflow management enforcing code quality, performance audits, compliance reviews, and debugging. Skills: orchestrate, execute, perf-check.", tags: ["CLI", "Maestro", "Code"] },
        { title: "Science Superpowers (science-superpowers)", desc: "Enforces scientific rigor for data exploration, statistical analysis, literature surveys, and pre-registering analysis plans.", tags: ["CLI", "Science", "Research"] },
        { title: "Signum (signum)", desc: "An evidence-driven development pipeline that tests code changes against a contract and audits changes with multiple model checkpoints.", tags: ["CLI", "Signum", "Code"] },
        { title: "Google Antigravity CLI", desc: "Google's power agent tool for running codebase modifications, running tests, and executing terminal commands.", tags: ["CLI", "Antigravity", "Code"] },
        { title: "Gemini CLI", desc: "Simple command-line helper for piping script outputs directly to Gemini API.", tags: ["CLI", "Gemini", "CLI"] },
        { title: "Google Workspace Side Panels", desc: "Gemini built natively into Google Docs, Sheets, Slides, and Gmail sidebar panels.", tags: ["Google Workspace", "Sidebar", "Office"] },
        { title: "Google AI Studio", desc: "Developer playground with massive 2M token context window, system prompts, and temperature controls.", tags: ["Studio", "AI Studio", "Data"] },
        { title: "Vertex AI / Agent Builder", desc: "Enterprise platform for deploying custom retrieval-augmented agents and search engines.", tags: ["Google Cloud", "Enterprise", "Agents"] }
      ],
      workedExamples: [
        {
          type: "Meeting note",
          bad: "Summarize this meeting note.",
          badReason: "does not utilize workspace structure or direct checklist rules.",
          fixed: `Summarize this meeting note:
[PASTE NOTE]

Goal:
Help me track project handoffs.

Output format:
- Meeting Decisions (3 bullet points maximum)
- Draft follow-up email to the team members mentioned
- Unresolved issues that need my review`
        },
        {
          type: "Code change",
          bad: "Refactor this file.",
          badReason: "no scope, check command, or smallest-change rule.",
          fixed: `Help me refactor this script:
[PASTE FILE]

Before writing code:
- Explain what the script does.
- Propose the smallest change to resolve [PROBLEM].

After writing code:
- Output the modified functions only.
- List what tests I should run.`
        }
      ],
      labSurfaces: [
        { key: "chat", name: "Gemini App" },
        { key: "saved_info", name: "Saved Info" },
        { key: "gem", name: "Gems" },
        { key: "side_panels", name: "Workspace Side Panel" },
        { key: "antigravity", name: "Antigravity CLI" },
        { key: "ai_studio", name: "AI Studio" },
        { key: "gemini_cli", name: "Gemini CLI" },
        { key: "mobile", name: "Mobile App" }
      ],
      surfaceFilterLabels: [
        { key: "all", name: "All" },
        { key: "draft", name: "Draft" },
        { key: "research", name: "Research" },
        { key: "files", name: "Files" },
        { key: "office", name: "Office" },
        { key: "code", name: "Code" },
        { key: "agents", name: "Agents" }
      ],
      surfacesGrid: [
        { groups: ["draft", "research", "files"], badge: "Chat", title: "Gemini App", desc: "Quick questions, files/images uploads, and Deep Research.", actionHtml: '<a class="button small primary" href="https://gemini.google.com/">Open Gemini</a>' },
        { groups: ["files", "agents"], badge: "Gems", title: "Gems (Custom Bots)", desc: "Tailored chatbots with specific instructions, files, and rules (Gemini Advanced).", actionHtml: '<a class="button small primary" href="https://support.google.com/gemini/answer/15222091">Gems Guide</a>' },
        { groups: ["draft", "office", "files"], badge: "Docs Sidebar", title: "Workspace side panels", desc: "Draft documents, summarize emails, and analyze Drive sheets inside Workspace apps.", actionHtml: '<a class="button small" href="https://support.google.com/gemini/answer/13690059">Extensions Guide</a>' },
        { groups: ["research", "files"], badge: "AI Studio", title: "Google AI Studio", desc: "Developer playground with massive 2M token context, temperature controls, and system prompts.", actionHtml: '<a class="button small primary" href="https://aistudio.google.com/">Open AI Studio</a>' },
        { groups: ["files", "code", "agents"], badge: "Antigravity", title: "Google Antigravity", desc: "Power agent tool for running codebase modifications and command execution.", actionHtml: '<a class="button small" href="https://aistudio.google.com/">Platform Docs</a>' },
        { groups: ["code", "agents"], badge: "Gemini API", title: "Gemini API", desc: "Developer access to Gemini 2.5 Flash and Pro models for custom software.", actionHtml: '<a class="button small" href="https://ai.google.dev/">Developer Hub</a>' }
      ],
      decisionRules: [
        { title: "Chat or Gem?", desc: "<strong>Gemini Chat</strong> for quick one-off tasks. <strong>Gems</strong> when you want a persistent custom copilot with specialized guidelines." },
        { title: "Flash or Pro?", desc: "<strong>Gemini 2.5 Flash</strong> for speed, quick drafts, and simple API calls. <strong>Gemini 2.5 Pro</strong> for complex code, logic, and long documents." },
        { title: "Chat or AI Studio?", desc: "<strong>Gemini App</strong> for consumer tasks with Gmail/Drive access. <strong>AI Studio</strong> for large files (up to 2M tokens) and temperature tuning." }
      ],
      glossary: [
        { term: "Saved Info", def: "Google's equivalent of Custom Instructions, allowing users to save defaults for Gemini answers." },
        { term: "Gems", def: "Custom assistant bots configured inside the Gemini app with specific rules and system instructions." },
        { term: "Workspace Extensions", def: "Integrations that let Gemini directly search and read data from Gmail, Drive, Docs, and Calendar." },
        { term: "AI Studio", def: "A developer-focused web tool for running experiments, configuring parameters, and calling the API." },
        { term: "Antigravity", def: "An advanced agent interface for executing programmatic tasks, code adjustments, and repository edits." },
        { term: "2M Context Window", def: "Gemini's large context limit, allowing it to process entire video files or large codebases in one prompt." }
      ],
      modelFit: {
        title: "Model fit",
        copy: "Use Gemini 2.5 Flash for speed and standard tasks. Use Gemini 2.5 Pro for coding, math, reasoning, and massive file analysis.",
        links: [
          { text: "Gemini 2.5 Pro Specs", url: "https://deepmind.google/technologies/gemini/" },
          { text: "Google AI Studio", url: "https://aistudio.google.com/" }
        ]
      },
      modelFitHints: {
        default: "Use Gemini 2.5 Flash for speed. Switch to Gemini 2.5 Pro for large file context (up to 2M tokens) or complex coding.",
        chat: "Use Gemini 2.5 Flash for quick chats. Use Gemini 2.5 Pro for deep reasoning or analyzing uploaded PDFs.",
        saved_info: "Configure default settings suitable for Gemini 2.5 Flash writing style.",
        gem: "Use Gemini 2.5 Pro inside Gems if they perform complex calculations, data science, or coding tasks.",
        side_panels: "Workspace side panels use Gemini 2.5 Flash to ensure real-time drafting and quick email summaries.",
        antigravity: "Antigravity leverages Gemini 2.5 Pro to manage codebase edits and complex terminal commands.",
        ai_studio: "Use Gemini 2.5 Pro to upload huge books, codebases, or videos using the 2M token context window.",
        gemini_cli: "Use Gemini 2.5 Flash for fast terminal script outputs.",
        mobile: "Use Gemini 2.5 Flash on mobile for fast voice inputs and capture."
      },
      outputHints: {
        useful: "a useful answer with a clear next step",
        email: "an email draft with subject line, body, and optional shorter version",
        document: "a structured document with headings, bullets, and a review checklist",
        slides: "a slide-by-slide outline with title, key point, and speaker note for each slide",
        spreadsheet: "a spreadsheet-friendly table, formula explanation, or analysis checklist",
        design: "a design layout blueprint with color guides, target audience, and usability checks",
        decision: "a decision memo with options, tradeoffs, recommendation, and risks",
        code: "a small code change path with files to inspect, edit steps, and tests to run",
        agent: "an agent workflow brief with trigger, context, steps, allowed actions, checks, and handoff"
      },
      fixData: {
        vague: { title: "Too vague", next: "Gemini sounds reasonable but you still cannot act on the answer.", prompt: "Make your last answer specific enough that I can act on it today. Revise it with concrete steps, examples, clear decision points, and what I should do first. Keep the language simple." },
        wrong: { title: "Possibly wrong", next: "A fact, calculation, or interpretation may be incorrect.", prompt: "Review your last answer for possible errors. Do not defend the answer. Compare each claim to the context I provided and output a corrected version." },
        long: { title: "Too long", next: "The answer is useful but too hard to scan quickly.", prompt: "Shorten your last answer. Give me the shortest useful version, the three details I should not miss, and remove repetition." },
        technical: { title: "Too technical", next: "The answer assumes too much background knowledge.", prompt: "Rewrite your last answer for a beginner. Use everyday language, define necessary terms in one sentence, replace jargon with examples, and keep steps practical." },
        format: { title: "Wrong format", next: "The content is good but the visual layout is not useful.", prompt: "Reformat your last answer into this structure: [PASTE THE FORMAT: table, checklist, email, memo, slides, steps, or bullets]. Keep only the content that supports that format." },
        stuck: { title: "Needs questions", next: "Gemini needs more context but did not ask for it.", prompt: "Pause and ask me the three questions that would most improve your answer. Explain why each matters in one short phrase." },
        evidence: { title: "Weak evidence", next: "Facts matter and you need to know what the claims rest on.", prompt: "Strengthen the evidence in your last answer. Separate confirmed facts in the material I provided from reasonable inferences, and list what I should verify." },
        action: { title: "Not actionable", next: "The answer explains the topic but does not help you move.", prompt: "Turn your last answer into an action checklist. For each item, include the action, why it matters, and what good completion looks like." },
        tone: { title: "Tone is off", next: "The answer is too stiff, too casual, too forceful, or not right for the audience.", prompt: "Rewrite your last answer for this audience: [AUDIENCE] using this tone: [WARM, DIRECT, EXECUTIVE, BEGINNER-FRIENDLY]. Remove anything that sounds unnatural." }
      },
      powerMoves: [
        { title: "Workspace Integration", desc: "Use @Drive or @Gmail in the chat bar to pull live details directly into Gemini without copying and pasting." },
        { title: "Deep Research", desc: "Turn on Deep Research mode for complex topics where Gemini runs multiple web queries and cites sources." },
        { title: "AI Studio Scoping", desc: "Build system prompt rules in AI Studio and export them as curl/Python code blocks." }
      ],
      agentLanes: [
        { badge: "Beginner", title: "Workspace Gems", desc: "Set up a Gem connected to Google Workspace Extensions to act as a custom inbox coordinator." },
        { badge: "Builder", title: "Antigravity CLI Agent", desc: "Use Antigravity to run codebase checks, shell executions, and local code refactoring." },
        { badge: "Developer", title: "Vertex AI / Agent Builder", desc: "Build hosted, custom RAG search engines and RAG agents in Google Cloud Platform." }
      ],
      agentLinks: [
        { text: "Google AI Studio", url: "https://aistudio.google.com/" },
        { text: "Gemini API Docs", url: "https://ai.google.dev/docs" }
      ],
      promptsList: [
        {
          summary: "Workspace Gems and sidebars",
          prompt: `Help me write instructions for a custom Gemini Gem.

Goal:
[WHAT THE GEM SHOULD DO]

Context / Files involved:
[EMAILS, DOCS, SHEETS, DRIVE FOLDERS, OR SITES]

Provide:
1. The exact Gem Instructions (Saved Info).
2. Which extensions (@Gmail, @Drive) the Gem must call.
3. A test checklist for checking output accuracy.`
        },
        {
          summary: "Antigravity Coding",
          prompt: `Help me draft a command-line script for Google Antigravity.

Task:
[DESCRIBE CODE CHANGES]

Structure the instructions:
- List files to read first.
- Provide the smallest code change block.
- Specify shell checks to execute.`
        }
      ],
      mcpConfig: `{
  "geminiAPI": {
    "model": "gemini-2.5-pro",
    "temperature": 0.2,
    "systemInstruction": "You are a precise research assistant. Always cite sources from @Drive and @Gmail."
  }
}`
    },
    grok: {
      name: "Grok",
      lede: "Start with one real task. Copy a strong prompt, choose the right Grok surface, and improve the result.",
      officialLinks: [
        { text: "Open Grok on X", url: "https://x.com/" }
      ],
      setupCards: [
        { title: "Sign in once", desc: "Log in to your X premium account to access Grok in the X app or web sidebar.", links: '<a href="https://x.com/">Open X</a>' },
        { title: "Select Persona Mode", desc: "Toggle between Regular Mode (direct, objective) and Fun Mode (humorous, sarcastic) depending on the task.", links: '<a href="https://x.com/">Grok settings</a>' },
        { title: "Enable X Search", desc: "Grok is natively connected to live posts and search indices on X. Make sure search is active.", links: '<a href="https://x.com/">X Search Guide</a>' },
        { title: "Test API Key", desc: "Get an API key from the xAI developer portal to run script integration (Grok 2/3).", links: '<a href="https://console.x.ai/">xAI console</a>' }
      ],
      toolkitPluginsTabName: "Grok Console",
      toolkit: [
        { title: "Grok Build (Grok Console)", desc: "Build tools, python script actions, and sqlite database integrations directly in the Grok dev workspace.", tags: ["CLI", "Grok Build", "Code"] },
        { title: "X Search Panel", desc: "Grok's native sidebar on X.com for summarization of trending topics and live posts.", tags: ["X.com Integration", "Real-time Data", "Research"] },
        { title: "xAI API Client", desc: "Developer client endpoints for calling Grok 2/3 models programmatically.", tags: ["xAI API", "Python / NodeJS", "CLI"] },
        { title: "Flux Image Generation", desc: "Natively integrated image generator inside Grok Chat for visual ideas and layouts.", tags: ["Image Generation", "Flux", "Design"] }
      ],
      workedExamples: [
        {
          type: "Meeting note",
          bad: "Summarize this meeting note.",
          badReason: "no structured tone or checklist guidelines.",
          fixed: `Summarize this meeting note in Grok Regular Mode:
[PASTE NOTE]

Goal:
Create a grouped action checklist.

Format:
- Decided: (3 points)
- Action Item: Owner (Deadline)
- Open issues`
        },
        {
          type: "Code change",
          bad: "Refactor this file.",
          badReason: "no scope, check command, or smallest-change rule.",
          fixed: `Help me refactor this script:
[PASTE FILE]

Before writing code:
- Explain what the script does.
- Propose the smallest change to resolve [PROBLEM].

After writing code:
- Output the modified functions only.
- List what tests I should run.`
        }
      ],
      labSurfaces: [
        { key: "chat", name: "Grok Chat" },
        { key: "sidebar", name: "X Sidebar" },
        { key: "flux", name: "Flux Image" },
        { key: "api", name: "xAI Console" },
        { key: "mobile", name: "Mobile App" }
      ],
      surfaceFilterLabels: [
        { key: "all", name: "All" },
        { key: "draft", name: "Draft" },
        { key: "research", name: "Research" },
        { key: "code", name: "Code" }
      ],
      surfacesGrid: [
        { groups: ["draft", "research"], badge: "Chat", title: "Grok Chat", desc: "Live chat with access to trending news, posts, and real-time data on X.", actionHtml: '<a class="button small primary" href="https://x.com/">Open Grok</a>' },
        { groups: ["research"], badge: "X Sidebar", title: "X Sidebar", desc: "Interactive sidebar for summarizing threads, trends, and profiles.", actionHtml: '<a class="button small" href="https://x.com/">Open X</a>' },
        { groups: ["draft"], badge: "Flux", title: "Flux Image Gen", desc: "Create high-fidelity graphic layouts, images, and mockups in Chat.", actionHtml: '<a class="button small" href="https://x.com/">Open Grok</a>' },
        { groups: ["code"], badge: "API", title: "xAI API", desc: "API endpoints for Grok 2/3, featuring structured JSON output and tool use.", actionHtml: '<a class="button small primary" href="https://console.x.ai/">Console xAI</a>' }
      ],
      decisionRules: [
        { title: "Regular or Fun Mode?", desc: "<strong>Regular Mode</strong> for factual tasks, summaries, and code. <strong>Fun Mode</strong> for creative brainstorming and entertainment." },
        { title: "Grok or API?", desc: "<strong>Grok app</strong> for search, X trends, and image creation. <strong>xAI API</strong> for structured data extraction or custom app integrations." }
      ],
      glossary: [
        { term: "Fun Mode", def: "Grok's conversational mode where it uses humor, sarcasm, and a less formal tone." },
        { term: "Regular Mode", def: "The standard conversational mode where Grok behaves as a helpful, objective assistant." },
        { term: "X Trends", def: "Real-time search results pulled from active posts and topics on the X social platform." },
        { term: "Flux", def: "The state-of-the-art image model integrated into Grok for generating photos and visual designs." },
        { term: "xAI Console", def: "The developer portal for managing API keys, checking usage, and viewing documentation." }
      ],
      modelFit: {
        title: "Model fit",
        copy: "Use Grok 2 for standard search, writing, and images. Use Grok 3 for coding, advanced logic, and deep research.",
        links: [
          { text: "xAI Portal", url: "https://x.ai/" }
        ]
      },
      modelFitHints: {
        default: "Use Grok 2 for standard news summaries and Flux images. Use Grok 3 for coding or advanced reasoning.",
        chat: "Use Grok 2 for general chat and X trends search. Use Grok 3 for deep reasoning tasks.",
        sidebar: "X Sidebar uses Grok 2 to summarize posts and analyze user accounts in real-time.",
        flux: "Use Grok 2 inside chat to generate graphics and layouts via Flux.",
        api: "Grok 2 and 3 are accessible via the xAI developer platform console.",
        mobile: "Mobile App defaults to Grok 2 for fast, on-the-go conversational search."
      },
      outputHints: {
        useful: "a useful answer with a clear next step",
        email: "an email draft with subject line, body, and optional shorter version",
        document: "a structured document with headings, bullets, and a review checklist",
        slides: "a slide-by-slide outline with title, key point, and speaker note for each slide",
        spreadsheet: "a spreadsheet-friendly table, formula explanation, or analysis checklist",
        design: "a layout blueprint with Flux prompt tags, color codes, and visual rules",
        decision: "a decision memo with options, tradeoffs, recommendation, and risks",
        code: "a small code change path with files to inspect, edit steps, and tests to run",
        agent: "an agent workflow brief with trigger, context, steps, allowed actions, checks, and handoff"
      },
      fixData: {
        vague: { title: "Too vague", next: "Grok sounds reasonable but you still cannot act on the answer.", prompt: "Make your last answer specific enough that I can act on it today. Revise it with concrete steps, examples, clear decision points, and what I should do first. Keep the language simple." },
        wrong: { title: "Possibly wrong", next: "A fact, calculation, or interpretation may be incorrect.", prompt: "Review your last answer for possible errors. Do not defend the answer. Compare each claim to the context I provided and output a corrected version." },
        long: { title: "Too long", next: "The answer is useful but too hard to scan quickly.", prompt: "Shorten your last answer. Give me the shortest useful version, the three details I should not miss, and remove repetition." },
        technical: { title: "Too technical", next: "The answer assumes too much background knowledge.", prompt: "Rewrite your last answer for a beginner. Use everyday language, define necessary terms in one sentence, replace jargon with examples, and keep steps practical." },
        format: { title: "Wrong format", next: "The content is good but the visual layout is not useful.", prompt: "Reformat your last answer into this structure: [PASTE THE FORMAT: table, checklist, email, memo, slides, steps, or bullets]. Keep only the content that supports that format." },
        stuck: { title: "Needs questions", next: "Grok needs more context but did not ask for it.", prompt: "Pause and ask me the three questions that would most improve your answer. Explain why each matters in one short phrase." },
        evidence: { title: "Weak evidence", next: "Facts matter and you need to know what the claims rest on.", prompt: "Strengthen the evidence in your last answer. Separate confirmed facts in the material I provided from reasonable inferences, and list what I should verify." },
        action: { title: "Not actionable", next: "The answer explains the topic but does not help you move.", prompt: "Turn your last answer into an action checklist. For each item, include the action, why it matters, and what good completion looks like." },
        tone: { title: "Tone is off", next: "The answer is too stiff, too casual, too forceful, or not right for the audience.", prompt: "Rewrite your last answer for this audience: [AUDIENCE] using this tone: [WARM, DIRECT, EXECUTIVE, BEGINNER-FRIENDLY]. Remove anything that sounds unnatural." }
      },
      powerMoves: [
        { title: "Real-time Search", desc: "Ask Grok for the latest updates on X about a specific keyword, rather than relying on stale static context." },
        { title: "Visual Brainstorming", desc: "Use Flux image prompt tags to generate structural user interface mockups or visual layout templates." }
      ],
      agentLanes: [
        { badge: "Beginner", title: "X Alert Bot", desc: "Write prompts for Grok to monitor specific X trends or keyword updates." },
        { badge: "Developer", title: "xAI API Agent", desc: "Configure hosted agents using the xAI developer API to call Grok 2/3." }
      ],
      agentLinks: [
        { text: "xAI Developer Platform", url: "https://console.x.ai/" }
      ],
      promptsList: [
        {
          summary: "X Trend Summarization",
          prompt: `Search the latest X posts and summarize the current discussion about:
[TOPIC OR KEYWORD]

Provide:
1. The core facts/announcements.
2. The general sentiment/opinion of X users.
3. 3 verified links or sources if available.
4. What remains unconfirmed.`
        }
      ],
      mcpConfig: `{
  "xaiAPI": {
    "model": "grok-2-1212",
    "temperature": 0.1,
    "systemPrompt": "You are a concise researcher utilizing real-time X search results."
  }
}`
    }
    
  };


  // Selectors
  const modelTabs = Array.from(document.querySelectorAll(".universal-workbench .model-tab"));
  const dynamicModelName = document.querySelector(".universal-workbench .dynamic-model-name");
  const dynamicLede = document.querySelector(".universal-workbench .lede");
  const appLinksContainer = document.getElementById("app-links");
  const setupCardsContainer = document.getElementById("setup-cards-container");
  const toolkitGrid = document.getElementById("toolkit-content");
  const toolkitTabName = document.getElementById("toolkit-model-plugins-tab");
  const workedExamplesContainer = document.getElementById("worked-examples-container");
  const labSurfaceSelector = document.getElementById("lab-surface-selector");
  const labOutputSelector = document.getElementById("lab-output-selector");
  const optimizedPrompt = document.getElementById("optimized-prompt");
  const openAppButton = document.getElementById("open-app-with-prompt");
  const roughPrompt = document.getElementById("rough-prompt");
  const modelFitTitle = document.getElementById("model-fit-title");
  const modelFitCopy = document.getElementById("model-fit-copy");
  const modelFitLinks = document.getElementById("model-fit-links");
  const surfaceFiltersContainer = document.getElementById("surface-filters-container");
  const surfacesGridContainer = document.getElementById("surfaces-grid-container");
  const surfacesDecisionContainer = document.getElementById("surfaces-decision-container");
  const glossaryGridContainer = document.getElementById("glossary-grid-container");
  const agentLanesContainer = document.getElementById("agent-lanes-container");
  const agentLinksContainer = document.getElementById("agent-links");
  const promptsTemplateList = document.getElementById("prompts-template-list");
  const mcpConfigTextarea = document.getElementById("mcp-config-json");
  const toast = document.getElementById("toast");

  // Interaction buttons
  const missionButtons = Array.from(document.querySelectorAll(".universal-workbench [data-mission]"));
  const missionTitle = document.getElementById("mission-output-title");
  const missionSurface = document.getElementById("mission-surface");
  const missionNext = document.getElementById("mission-next");
  const missionPrompt = document.getElementById("mission-prompt");

  const fixButtons = Array.from(document.querySelectorAll(".universal-workbench [data-fix]"));
  const fixTitle = document.getElementById("fix-output-title");
  const fixNext = document.getElementById("fix-next");
  const fixPrompt = document.getElementById("fix-prompt");

  const shortcutButtons = Array.from(document.querySelectorAll(".universal-workbench [data-shortcut-mission]"));
  const toolkitTabButtons = Array.from(document.querySelectorAll(".universal-workbench [data-toolkit-tab]"));

  // Storage and State
  const storagePrefix = "universalWorkbench:";
  const storage = {
    get(key) {
      try { return window.localStorage.getItem(storagePrefix + key); } catch { return null; }
    },
    set(key, value) {
      try { window.localStorage.setItem(storagePrefix + key, value); } catch {}
    }
  };

  let activeModel = storage.get("activeModel") || "chatgpt";
  let activeMission = "email";
  let activeFix = "vague";
  let activeSurface = "chat";
  let activeOutput = "useful";
  let activeToolkitTab = "clinical";
  let activeSurfaceFilter = "all";

  // URL parameters sync
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("model") && modelData[urlParams.get("model")]) {
    activeModel = urlParams.get("model");
  }

  // Active state handlers
  function setActiveChoice(buttons, attribute, value) {
    buttons.forEach((button) => {
      const active = button.getAttribute(attribute) === value;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
      if (button.getAttribute("role") === "tab") {
        button.setAttribute("tabindex", active ? "0" : "-1");
      }
    });
  }

  function showToast(message) {
    if (!toast) return;
    window.clearTimeout(showToast.timeoutId);
    toast.textContent = message;
    toast.classList.add("is-visible");
    showToast.timeoutId = window.setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 1800);
  }

  async function copyText(text, target) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    }
    return false;
  }

  // Model-specific UI updating function
  function renderModelWorkbench() {
    const data = modelData[activeModel];
    if (!data) return;

    // Save active model state
    storage.set("activeModel", activeModel);

    // Update URL query parameters silently
    if (window.history && window.history.replaceState) {
      const params = new URLSearchParams(window.location.search);
      params.set("model", activeModel);
      window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}${window.location.hash}`);
    }

    // 1. Update Title and description
    if (dynamicModelName) dynamicModelName.textContent = "Learn " + data.name;
    if (dynamicLede) dynamicLede.textContent = data.lede;

    // 2. Render official app links
    if (appLinksContainer) {
      appLinksContainer.innerHTML = "";
      data.officialLinks.forEach((link, idx) => {
        const a = document.createElement("a");
        a.className = idx === 0 ? "button primary" : "button";
        a.href = link.url;
        a.target = "_blank";
        a.textContent = link.text;
        appLinksContainer.appendChild(a);
      });
    }

    // 3. Render setup cards
    if (setupCardsContainer) {
      setupCardsContainer.innerHTML = "";
      data.setupCards.forEach((card, idx) => {
        const li = document.createElement("li");
        li.className = "setup-card";

        const h3 = document.createElement("h3");
        h3.textContent = card.title;

        const pDesc = document.createElement("p");
        pDesc.textContent = card.desc;

        const pLinks = document.createElement("p");
        pLinks.className = "card-links";
        pLinks.innerHTML = card.links; // links is expected to contain safe html tags like <a>

        if (idx === 1) {
          // Add personalization instructions textarea
          const headDiv = document.createElement("div");
          headDiv.className = "prompt-head compact-head";

          const copyBtn = document.createElement("button");
          copyBtn.className = "button small copy";
          copyBtn.setAttribute("data-copy-target", "setup-personal-instr");
          copyBtn.type = "button";
          copyBtn.textContent = "Copy";

          headDiv.appendChild(h3);
          headDiv.appendChild(copyBtn);

          const textarea = document.createElement("textarea");
          textarea.id = "setup-personal-instr";
          textarea.readOnly = true;
          textarea.rows = 8;
          textarea.value = `Help me write custom instructions for ${data.name}.\nAsk me four questions, one at a time, about:\n- Tone and formality I prefer.\n- Detail level I want by default.\n- When you should ask before answering.\n- Topics or formats to avoid.\nAfter I answer, propose a short, edit-ready instructions block. Keep it under 120 words.`;

          li.appendChild(headDiv);
          li.appendChild(pDesc);
          li.appendChild(pLinks);
          li.appendChild(textarea);
        } else {
          li.appendChild(h3);
          li.appendChild(pDesc);
          li.appendChild(pLinks);
        }
        setupCardsContainer.appendChild(li);
      });

      // Bind copy listener to setup-card textarea
      const copyBtn = setupCardsContainer.querySelector(".copy");
      if (copyBtn) {
        copyBtn.addEventListener("click", () => {
          const textarea = document.getElementById("setup-personal-instr");
          if (textarea) {
            copyText(textarea.value).then((ok) => {
              if (ok) showToast("System template copied.");
            });
          }
        });
      }
    }

    // 4. Update toolkit tab label
    if (toolkitTabName) toolkitTabName.textContent = data.toolkitPluginsTabName;

    // 5. Populate and filter Toolkit items
    renderToolkit();

    // 6. Populate worked examples
    if (workedExamplesContainer) {
      workedExamplesContainer.innerHTML = data.workedExamples.map(ex => `
        <article class="example-card">
          <h3>${ex.type}</h3>
          <p><strong>Vague:</strong> "${ex.bad}"</p>
          <p><strong>Why weak:</strong> ${ex.badReason}</p>
          <div class="prompt-head compact-head">
            <h3>Fixed prompt</h3>
            <button class="button small copy" data-copy-target="example-${ex.type.replace(/\s+/g, '-').toLowerCase()}" type="button">Copy</button>
          </div>
          <textarea id="example-${ex.type.replace(/\s+/g, '-').toLowerCase()}" readonly rows="10">${ex.fixed}</textarea>
        </article>
      `).join("");
      // Bind copy buttons inside worked examples
      workedExamplesContainer.querySelectorAll(".copy").forEach(btn => {
        btn.addEventListener("click", () => {
          const targetId = btn.getAttribute("data-copy-target");
          const textarea = document.getElementById(targetId);
          if (textarea) {
            copyText(textarea.value).then(ok => {
              if (ok) showToast("Worked prompt copied.");
            });
          }
        });
      });
    }

    // 7. Populate prompt lab surfaces
    if (labSurfaceSelector) {
      labSurfaceSelector.innerHTML = data.labSurfaces.map((s, idx) => {
        const cls = s.key === activeSurface ? "choice is-active" : "choice";
        return `<button type="button" class="${cls}" data-surface="${s.key}">${s.name}</button>`;
      }).join("");
      // Bind event listeners to new buttons
      const surfaceButtons = Array.from(labSurfaceSelector.querySelectorAll("[data-surface]"));
      surfaceButtons.forEach(btn => {
        btn.addEventListener("click", () => {
          activeSurface = btn.getAttribute("data-surface");
          setActiveChoice(surfaceButtons, "data-surface", activeSurface);
          renderOptimizedPrompt();
        });
      });
    }

    // 8. Populate surfaces grid & decision rules
    renderSurfaces();

    // 9. Populate Glossary
    if (glossaryGridContainer) {
      glossaryGridContainer.innerHTML = data.glossary.map(item => `
        <article class="glossary-card">
          <h3>${item.term}</h3>
          <p>${item.def}</p>
        </article>
      `).join("");
    }

    // 10. Populate Agent lanes & resource links
    if (agentLanesContainer) {
      agentLanesContainer.innerHTML = data.agentLanes.map(lane => `
        <article class="agent-card">
          <span class="surface-badge">${lane.badge}</span>
          <h3>${lane.title}</h3>
          <p>${lane.desc}</p>
        </article>
      `).join("");
    }
    if (agentLinksContainer) {
      agentLinksContainer.innerHTML = data.agentLinks.map(link => `
        <a href="${link.url}" target="_blank">${link.text}</a>
      `).join("");
    }

    // 11. Populate exportable prompts list
    if (promptsTemplateList) {
      promptsTemplateList.innerHTML = data.promptsList.map((item, idx) => `
        <details class="template-details" ${idx === 0 ? "open" : ""}>
          <summary>${item.summary}</summary>
          <article class="prompt-card">
            <div class="prompt-head">
              <h3>${item.summary}</h3>
              <button class="button small copy" data-copy-target="template-prompt-${idx}" type="button">Copy</button>
            </div>
            <textarea id="template-prompt-${idx}" readonly rows="12">${item.prompt}</textarea>
          </article>
        </details>
      `).join("");
      // Bind copy buttons inside template prompts
      promptsTemplateList.querySelectorAll(".copy").forEach(btn => {
        btn.addEventListener("click", () => {
          const targetId = btn.getAttribute("data-copy-target");
          const textarea = document.getElementById(targetId);
          if (textarea) {
            copyText(textarea.value).then(ok => {
              if (ok) showToast("Template prompt copied.");
            });
          }
        });
      });
    }

    // 12. Update config textarea
    if (mcpConfigTextarea) {
      mcpConfigTextarea.value = data.mcpConfig;
    }

    // Trigger secondary render loops
    renderMissionPrompt();
    renderFixPrompt();
    renderOptimizedPrompt();
  }

  // Model-agnostic toolkit filtering
  function renderToolkit() {
    if (!toolkitGrid) return;
    const data = modelData[activeModel];
    if (!data) return;

    // Filter cards based on tab
    const filteredTools = data.toolkit.filter(tool => {
      const toolTags = tool.tags.map(t => t.toLowerCase());
      if (activeToolkitTab === "clinical") {
        return toolTags.includes("research") || toolTags.includes("literature");
      }
      if (activeToolkitTab === "office") {
        return toolTags.includes("office") || toolTags.includes("workspace") || toolTags.includes("ppt") || toolTags.includes("word");
      }
      if (activeToolkitTab === "data") {
        return toolTags.includes("data") || toolTags.includes("database") || toolTags.includes("sql");
      }
      if (activeToolkitTab === "cli") {
        return toolTags.includes("cli") || toolTags.includes("terminal");
      }
      if (activeToolkitTab === "code-plugins") {
        return toolTags.includes("mcp") || toolTags.includes("plugin") || toolTags.includes("action") || toolTags.includes("gpts");
      }
      return true;
    });

    toolkitGrid.innerHTML = "";

    if (filteredTools.length === 0) {
      const emptyDiv = document.createElement("div");
      emptyDiv.style.cssText = "grid-column: 1/-1; padding: 2rem; text-align: center; color: var(--muted);";
      emptyDiv.textContent = "No toolkit components configured in this category.";
      toolkitGrid.appendChild(emptyDiv);
      return;
    }

    filteredTools.forEach(tool => {
      const card = document.createElement("div");
      card.className = "toolkit-card";

      const title = document.createElement("h3");
      title.textContent = tool.title;
      card.appendChild(title);

      const desc = document.createElement("p");
      desc.textContent = tool.desc;
      card.appendChild(desc);

      const list = document.createElement("div");
      list.className = "toolkit-list";

      tool.tags.forEach(tag => {
        const badge = document.createElement("span");
        badge.className = "toolkit-badge";
        badge.textContent = tag;
        list.appendChild(badge);
      });

      card.appendChild(list);
      toolkitGrid.appendChild(card);
    });
  }

  // Model-agnostic surfaces listing and filtering
  function renderSurfaces() {
    if (!surfacesGridContainer) return;
    const data = modelData[activeModel];
    if (!data) return;

    // Filter surfaces
    const filteredSurfaces = data.surfacesGrid.filter(surf => {
      if (activeSurfaceFilter === "all") return true;
      return surf.groups.includes(activeSurfaceFilter);
    });

    surfacesGridContainer.innerHTML = filteredSurfaces.map(surf => `
      <article class="surface-card">
        <span class="surface-badge">${surf.badge}</span>
        <h3>${surf.title}</h3>
        <p>${surf.desc}</p>
        <div class="surface-actions">${surf.actionHtml}</div>
      </article>
    `).join("");

    if (surfacesDecisionContainer) {
      surfacesDecisionContainer.innerHTML = `
        <h3>How to choose</h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-top: 0.5rem;">
          ${data.decisionRules.map(rule => `
            <div><strong>${rule.title}</strong><p style="margin:0.2rem 0 0;font-size:0.92rem;">${rule.desc}</p></div>
          `).join("")}
        </div>
      `;
    }
  }

  // Model-agnostic Task Picker prompt rendering
  function renderMissionPrompt() {
    const data = modelData[activeModel];
    if (!data) return;

    // Safely look up prompt for selected mission
    const missionKey = activeMission;
    let mission = data.fixData[missionKey]; // Fallback to fix prompt structure if mission matches
    
    // Custom task picker mapper since task prompts are model-agnostic but surfaces vary
    const surfaceMappings = {
      chatgpt: {
        email: "ChatGPT Chat or Canvas",
        document: "ChatGPT Canvas or Word Add-in",
        slides: "PowerPoint with Copilot",
        spreadsheet: "Excel with Copilot",
        design: "Grok Flux / Custom GPT Design Generator",
        research: "SearchGPT or Pro Search",
        connect: "Custom GPT API Action settings",
        browser: "SearchGPT Chrome browser extension",
        cowork: "Codex CLI",
        meeting: "ChatGPT Chat",
        code: "Codex CLI or Canvas Editor",
        agent: "OpenAI Agents SDK",
        lectureToPpt: "PowerPoint Copilot",
        infographic: "ChatGPT Canvas or DALL-E / Flux"
      },
      claude: {
        email: "Claude Chat, iOS or Android, or Word if from document.",
        document: "Word for document editing, Chat for drafting.",
        slides: "PowerPoint when deck open, or Artifact for visual draft.",
        spreadsheet: "Excel when workbook open, or Chat for formulas.",
        design: "Artifact or Claude Design for visual drafts and prototypes.",
        research: "Claude Research for multi-source questions and citations.",
        connect: "Claude Desktop or Cowork connectors setting.",
        browser: "Claude in Chrome extension.",
        cowork: "Claude Cowork longer session.",
        meeting: "Claude Chat or Project.",
        code: "Claude Code CLI.",
        agent: "Project, Claude Code CLI, or Agent SDK.",
        lectureToPpt: "PowerPoint Copilot with Claude",
        infographic: "Claude Design or Artifacts to preview SVGs"
      },
      gemini: {
        email: "Gemini App or Gmail panel.",
        document: "Docs Side Panel or Gemini App.",
        slides: "Slides Side Panel or Gemini App.",
        spreadsheet: "Sheets Side Panel or Excel integration.",
        design: "Gemini App (Imagen / Flux graphic generation).",
        research: "Deep Research mode in Gemini App.",
        connect: "Google Workspace Extensions settings panel.",
        browser: "Gemini Chrome sidebar.",
        cowork: "Google Antigravity CLI.",
        meeting: "Gemini App or Calendar Gems.",
        code: "Google Antigravity CLI or Gemini CLI.",
        agent: "Vertex AI / Agent Builder.",
        lectureToPpt: "Slides Side Panel",
        infographic: "Gemini App with Imagen / Slides"
      },
      grok: {
        email: "Grok Chat (Regular Mode).",
        document: "Grok Chat.",
        slides: "Grok Chat.",
        spreadsheet: "Grok Chat.",
        design: "Flux Image Generation in Grok.",
        research: "Grok Chat with X search connection.",
        connect: "xAI API Client console.",
        browser: "Grok sidebar in X app.",
        cowork: "xAI CLI client.",
        meeting: "Grok Chat.",
        code: "xAI Console or API.",
        agent: "xAI API Console.",
        lectureToPpt: "Grok Chat",
        infographic: "Flux Image Gen in Grok"
      }
    };

    // Generic prompt templates (model-agnostic baseline, adjusted below)
    const prompts = {
      email: {
        title: "Email or message",
        next: "Paste your raw notes, recipient name, and ask for professional and short variants.",
        text: `I need to write an email or message.

Recipient:
[WHO IT IS FOR]

Goal:
[WHAT I WANT TO HAPPEN]

Context:
[PASTE NOTES OR THE THREAD]

Please draft:
1. A clear version.
2. A warmer version.
3. A shorter version.

Use plain language. End with what I should verify before sending.`
      },
      document: {
        title: "Document revision",
        next: "Paste the document text and ask the model to rewrite the weakest section first.",
        text: `Help me improve this document.

Goal:
[WHAT THE DOCUMENT NEEDS TO DO]

Audience:
[WHO WILL READ IT]

Text or notes:
[PASTE CONTENT]

First, summarize the document.
Then identify unclear or risky sections.
Then rewrite the highest-value section first.
Keep the structure easy to review.`
      },
      slides: {
        title: "Slide outline",
        next: "Ask for slide-by-slide titles and speaker notes from your lecture/summary notes.",
        text: `Help me create slide outlines.

Audience:
[WHO WILL SEE THE DECK]

Goal:
[WHAT THE DECK SHOULD ACCOMPLISH]

Source material:
[PASTE NOTES OR SUMMARY]

Create a slide-by-slide outline with:
- Slide title.
- Main point.
- Suggested visual.
- Speaker note.`
      },
      spreadsheet: {
        title: "Spreadsheet help",
        next: "Paste columns or a sample table and request Excel/Sheets formulas.",
        text: `Help me understand this dataset/table.

Goal:
[WHAT I NEED TO KNOW OR CREATE]

Table context:
[PASTE COLUMN NAMES, FORMULAS, OR A SMALL SAMPLE]

First, explain what the data appears to show.
Then identify formulas, columns, or assumptions I should check.
Then suggest the cleanest table, chart, formula, or analysis.`
      },
      design: {
        title: "Design blueprint",
        next: "Ask for UI layout structure, colors, contrast guidelines, and image generation prompts.",
        text: `Create a simple design draft or layout blueprint.

Thing to create:
[PAGE, ONE-PAGER, PROTOTYPE, VISUAL, OR PRESENTATION]

Audience:
[WHO WILL USE IT]

Job it must do:
[WHAT SHOULD BE CLEAR OR POSSIBLE]

Suggest layout structure, color codes, visual rules, and image generator prompts.`
      },
      research: {
        title: "Deep research",
        next: "Enable Pro Search or Deep Research, write the query, and request footnote citations.",
        text: `Research this topic and provide a detailed summary.

Question:
[WHAT I NEED TO UNDERSTAND]

Context:
[WHY I NEED IT]

Sources I have:
[PASTE LINKS, NOTES, OR TEXT IF AVAILABLE]

Return a summary, verified facts, reasonable inferences, and footnote citations I can check.`
      },
      connect: {
        title: "App connection",
        next: "Determine what connectors or API actions are needed for this workflow.",
        text: `Help me decide what to connect to my AI workflow.

Workflow:
[WHAT I WANT TO HELP WITH]

Apps or services I use:
[DRIVE, EMAIL, CALENDAR, SLACK, LINEAR, DOCS, OR OTHER]

Provide the first integration to set up and a safe test case.`
      },
      browser: {
        title: "Website task",
        next: "Explain website tasks, reading, comparing, or scraping.",
        text: `Help me with this website.

Goal:
[WHAT I AM TRYING TO DO]

Rules:
- Explain what you see before taking action.
- Ask before clicking anything that submits, deletes, or changes settings.`
      },
      cowork: {
        title: "CLI or Cowork task",
        next: "Explain workspace file changes or codebase editing.",
        text: `Help me run this codebase task safely.

Goal:
[WHAT I WANT DONE]

Material you may use:
[FILES, FOLDERS, APPS, OR CONNECTORS]

Rules:
- Explain your approach before acting.
- Ask before changing, sending, deleting, or opening sensitive material.`
      },
      meeting: {
        title: "Meeting prep",
        next: "Paste the meeting goal, calendar invitation notes, and target attendees.",
        text: `Help me prepare for an upcoming meeting.

Meeting goal:
[WHAT I NEED FROM THE MEETING]

People involved:
[WHO WILL BE THERE]

Context:
[PASTE NOTES, EMAILS, OR BACKGROUND]

Create a short briefing, talking points, questions to ask, and follow-ups to capture.`
      },
      code: {
        title: "Code editing",
        next: "Feed codebase files, trace scripts, and write test scenarios.",
        text: `Help me with this codebase.

Task:
[WHAT I WANT CHANGED OR EXPLAINED]

Before editing:
- Explain what the relevant part of the project does.
- Identify the files likely involved.
- Tell me the smallest useful change.`
      },
      agent: {
        title: "Agent workflow",
        next: "Establish agent triggers, allowable actions, and review gates.",
        text: `Help me design an agentic workflow.

Workflow goal:
[WHAT THE AGENT SHOULD HELP WITH]

Trigger:
[WHEN IT SHOULD RUN]

Allowed actions:
[WHAT IT MAY DO]

Actions that need my approval:
[WHAT IT MUST ASK BEFORE DOING]

Return the simplest version, safety checks, and the handoff brief.`
      },
      lectureToPpt: {
        title: "Lecture to PPT Outline",
        next: "Paste your Word lecture text or bullet points, and ask the model to structure it into slides.",
        text: `Transform this lecture content into a structured slide presentation outline.

Lecture notes:
[PASTE LECTURE CONTENT]

Audience:
[WHO WILL HEAR/SEE THE LECTURE]

Return a slide-by-slide outline:
- Slide Title
- Core Message (1-2 sentences)
- Supporting points (max 3)
- Slide Layout suggestion
- Speaker Note`
      },
      infographic: {
        title: "Infographic Blueprint",
        next: "Paste your guidelines or dataset, and ask for a visual layout blueprint or code.",
        text: `Create a professional infographic layout blueprint.

Clinical Data / Topic:
[PASTE DATASHEETS OR MEDICAL INFO]

Audience:
[WHO WILL SEE IT]

Rules:
- Focus on clean visual hierarchy.
- Select a specific design palette.
- Output a layout blueprint, copy text, and mock visual code if applicable.`
      }
    };

    const activeM = prompts[activeMission] || prompts.email;
    if (missionTitle) missionTitle.textContent = activeM.title;
    if (missionSurface) {
      const surface = (surfaceMappings[activeModel] && surfaceMappings[activeModel][activeMission]) || "Chat";
      missionSurface.textContent = "";
      const strong = document.createElement("strong");
      strong.textContent = `Best ${data.name} surface:`;
      missionSurface.append(strong, " ", surface);
    }
    if (missionNext) {
      missionNext.textContent = "";
      const strong = document.createElement("strong");
      strong.textContent = "Next move:";
      missionNext.append(strong, " ", activeM.next);
    }
    if (missionPrompt) {
      let promptText = activeM.text;
      // Tailor XML tags specifically for Claude
      if (activeModel === "claude" && activeMission === "email") {
        promptText = promptText.replace("[PASTE NOTES OR THE THREAD]", "<thread>\n[PASTE NOTES OR THE THREAD]\n</thread>");
      }
      missionPrompt.value = promptText;
    }
  }

  // Model-agnostic Answer Fixer prompt rendering
  function renderFixPrompt() {
    const data = modelData[activeModel];
    if (!data) return;

    const fixKey = activeFix;
    const fix = data.fixData[fixKey] || data.fixData.vague;

    if (fixTitle) fixTitle.textContent = fix.title;
    if (fixNext) {
      fixNext.textContent = "";
      const strong = document.createElement("strong");
      strong.textContent = "Use when:";
      fixNext.append(strong, " ", fix.next);
    }
    if (fixPrompt) fixPrompt.value = fix.prompt;
  }

  // Model-agnostic Prompt Lab builder
  function renderOptimizedPrompt() {
    const data = modelData[activeModel];
    if (!data) return;

    const task = (roughPrompt && roughPrompt.value.trim()) || "Help me complete this task.";
    const surfaceName = data.labSurfaces.find(s => s.key === activeSurface)?.name || "Chat";
    const outputType = data.outputHints[activeOutput] || data.outputHints.useful;
    const modelFit = data.modelFitHints[activeSurface] || data.modelFitHints.default;

    if (modelFitCopy) modelFitCopy.textContent = modelFit;
    if (modelFitTitle) modelFitTitle.textContent = "Model Fit for " + surfaceName;

    // Populate model fit link buttons
    if (modelFitLinks) {
      modelFitLinks.innerHTML = data.modelFit.links.map(link => `
        <a href="${link.url}" target="_blank">${link.text}</a>
      `).join("");
    }

    if (optimizedPrompt) {
      let xmlWrapper = "";
      if (activeModel === "claude") {
        xmlWrapper = `\nUse XML tags to separate the prompt parameters (e.g., wrap task content in <task> and formatting in <style>).`;
      }

      optimizedPrompt.value = `You are helping me use ${surfaceName} effectively.

Model note for me before sending:
${modelFit}

Task:
${task}

Preferred output:
${outputType}${xmlWrapper}

Before answering:
1. Restate the goal in one sentence.
2. Ask up to three questions only if you truly need more context.
3. If you have enough context, start the work.

Output rules:
- Start with the useful answer, not a long introduction.
- Use plain language.
- Use headings, bullets, or a table when that makes the result easier to use.
- Flag uncertainty instead of guessing.
- Tell me what I should review before I rely on the result.

After the answer:
- Give me one improved version of this prompt for next time.
- Suggest the best ${data.name} surface for repeating this workflow.`;
    }
  }

  // Bind Event Listeners for Model Selection tabs
  modelTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      activeModel = tab.getAttribute("data-model") || "chatgpt";
      setActiveChoice(modelTabs, "data-model", activeModel);
      renderModelWorkbench();
    });
  });

  // Arrow-key navigation for the model tablist (roving tabindex)
  modelTabs.forEach((tab, index) => {
    tab.addEventListener("keydown", (event) => {
      let next = null;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % modelTabs.length;
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + modelTabs.length) % modelTabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = modelTabs.length - 1;
      if (next === null) return;
      event.preventDefault();
      modelTabs[next].focus();
      modelTabs[next].click();
    });
  });

  // Bind Event Listeners for Task Picker options
  missionButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      activeMission = btn.getAttribute("data-mission") || "email";
      setActiveChoice(missionButtons, "data-mission", activeMission);
      renderMissionPrompt();
    });
  });

  // Bind Event Listeners for Task Shortcuts (Write, Summarize, etc.)
  shortcutButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const mission = btn.getAttribute("data-shortcut-mission") || "email";
      activeMission = mission;
      setActiveChoice(missionButtons, "data-mission", activeMission);
      renderMissionPrompt();
      const title = missionTitle?.textContent || "Task";
      showToast(`${title} prompt loaded.`);
    });
  });

  // Bind Event Listeners for Toolkit filters
  toolkitTabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      activeToolkitTab = btn.getAttribute("data-toolkit-tab") || "clinical";
      setActiveChoice(toolkitTabButtons, "data-toolkit-tab", activeToolkitTab);
      renderToolkit();
    });
  });

  // Bind Event Listeners for Surface filters
  const filterBtns = Array.from(surfaceFiltersContainer?.querySelectorAll("[data-surface-filter]") || []);
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      activeSurfaceFilter = btn.getAttribute("data-surface-filter") || "all";
      setActiveChoice(filterBtns, "data-surface-filter", activeSurfaceFilter);
      renderSurfaces();
    });
  });

  // Bind Event Listeners for Prompt Lab outputs
  const outputBtns = Array.from(labOutputSelector?.querySelectorAll("[data-output]") || []);
  outputBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      activeOutput = btn.getAttribute("data-output") || "useful";
      setActiveChoice(outputBtns, "data-output", activeOutput);
      renderOptimizedPrompt();
    });
  });

  // Bind Event Listeners for Answer Fixers
  fixButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      activeFix = btn.getAttribute("data-fix") || "vague";
      setActiveChoice(fixButtons, "data-fix", activeFix);
      renderFixPrompt();
    });
  });

  if (roughPrompt) {
    roughPrompt.addEventListener("input", () => {
      renderOptimizedPrompt();
    });
  }

  // Copy Buttons handler
  const globalCopyButtons = Array.from(document.querySelectorAll(".universal-workbench .copy"));
  globalCopyButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-copy-target");
      const textarea = document.getElementById(targetId);
      if (textarea) {
        copyText(textarea.value).then(ok => {
          if (ok) showToast("Prompt copied.");
        });
      }
    });
  });

  // Export prompts as Markdown
  const exportBtn = document.getElementById("export-prompts");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const data = modelData[activeModel];
      if (!data) return;

      const mdContent = `# Reusable Prompt Templates for ${data.name}

${data.promptsList.map(item => `## ${item.summary}
\`\`\`
${item.prompt}
\`\`\`
`).join("\n")}
`;
      copyText(mdContent).then(ok => {
        if (ok) showToast("All templates copied as Markdown.");
      });
    });
  }

  // Open App with Prompt handler
  if (openAppButton) {
    openAppButton.addEventListener("click", () => {
      if (optimizedPrompt) {
        copyText(optimizedPrompt.value).then(ok => {
          if (ok) {
            showToast("Copied optimized prompt. Opening app...");
            const data = modelData[activeModel];
            const primaryUrl = data?.officialLinks[0]?.url || "https://chatgpt.com/";
            window.open(primaryUrl, "_blank");
          }
        });
      }
    });
  }

  // Initial trigger
  setActiveChoice(modelTabs, "data-model", activeModel);
  setActiveChoice(missionButtons, "data-mission", activeMission);
  setActiveChoice(fixButtons, "data-fix", activeFix);
  setActiveChoice(toolkitTabButtons, "data-toolkit-tab", activeToolkitTab);
  if (filterBtns.length > 0) setActiveChoice(filterBtns, "data-surface-filter", activeSurfaceFilter);
  
  renderModelWorkbench();
});
