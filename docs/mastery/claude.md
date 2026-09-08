# Claude Mastery & Interactive Workbench

> **Last verified:** 2026-07-18 (page structure; embedded product claims not individually re-verified) · **Drift risk:** high — the standalone Learn Claude site is the maintained version of this material

A practical, step-by-step track and interactive playground for getting full value from Claude.

!!! info "The canonical Claude track lives on the standalone site"
    The maintained beginner-to-expert Claude guide — setup paths, Projects, memory, Skills, connectors, and Claude Code — is **[Learn Claude](https://rkalani1.github.io/claude/)**. This page embeds a snapshot of that material as an interactive workbench; where the two disagree, the standalone site is current.

---

<div class="claude-workbench">

<section class="hero hero-workbench" id="start" aria-labelledby="hero-title">
        <div class="hero-copy">
          <p class="hero-display" id="hero-title">Learn Claude</p>
          <p class="lede">Start with one real task. Copy a strong prompt, choose the right Claude surface, and improve the result.</p>
          <p style="margin:0 0 1rem;color:#6b617c;font-size:0.95rem;line-height:1.5;">Use non-sensitive examples here. Do not paste PHI, patient identifiers, learner records, credentials, confidential data, or restricted research data into public demos or exported prompt packs.</p>
          <div class="official-links" aria-label="Official Claude links">
            <a class="button primary" href="https://claude.ai/">Open Claude</a>
            <a class="button" href="https://claude.ai/downloads">Download Claude</a>
          </div>
          <div class="task-shortcuts" aria-label="Common Claude tasks">
            <button type="button" data-shortcut-mission="email">Write</button>
            <button type="button" data-shortcut-mission="document">Summarize</button>
            <button type="button" data-shortcut-mission="research">Research</button>
            <button type="button" data-shortcut-mission="spreadsheet">Analyze file</button>
            <button type="button" data-shortcut-mission="slides">Make slides</button>
            <button type="button" data-shortcut-mission="lectureToPpt">Lecture to PPT</button>
            <button type="button" data-shortcut-mission="infographic">Medical Infographic</button>
            <a href="#fix-answer">Fix answer</a>
            <button type="button" data-shortcut-mission="agent">Build agent</button>
          </div>
        </div>

        <div class="hero-task-panel" aria-label="Claude task picker">
          <h2 class="sr-only">Pick a Claude task</h2>
          <div class="task-tool hero-task-tool">
            <div class="task-options">
              <p class="tool-label">What do you need done?</p>
              <div class="task-grid compact">
                <button type="button" class="choice is-active" data-mission="email">Email</button>
                <button type="button" class="choice" data-mission="document">Document</button>
                <button type="button" class="choice" data-mission="slides">Slides</button>
                <button type="button" class="choice" data-mission="spreadsheet">Sheet</button>
                <button type="button" class="choice" data-mission="design">Design</button>
                <button type="button" class="choice" data-mission="research">Research</button>
                <button type="button" class="choice" data-mission="connect">Connect</button>
                <button type="button" class="choice" data-mission="browser">Website</button>
                <button type="button" class="choice" data-mission="cowork">Cowork</button>
                <button type="button" class="choice" data-mission="meeting">Meeting</button>
                <button type="button" class="choice" data-mission="code">Code</button>
                <button type="button" class="choice" data-mission="agent">Agent</button>
                <button type="button" class="choice" data-mission="lectureToPpt">Lecture to PPT</button>
                <button type="button" class="choice" data-mission="infographic">Medical Infographic</button>
              </div>
            </div>
            <div class="task-result" aria-live="polite">
              <div class="prompt-head">
                <h3 id="mission-output-title">Email</h3>
                <button class="button small copy" data-copy-target="mission-prompt" type="button">Copy</button>
              </div>
              <div class="result-copy">
                <p id="mission-surface"><strong>Best Claude surface:</strong> Chat, iOS or Android, or Word if the message comes from a document.</p>
                <p id="mission-next"><strong>Next move:</strong> paste your messy thought, name the recipient, and ask for two versions.</p>
              </div>
              <textarea id="mission-prompt" aria-label="Prompt for selected task" readonly rows="11"></textarea>
            </div>
          </div>
        </div>
      </section>

      <section class="section setup-strip" id="setup" aria-labelledby="setup-title">
        <div class="section-head">
          <h2 id="setup-title">Set up once</h2>
          <p>Use one account. Set defaults. Save one repeated workflow.</p>
        </div>
        <ol class="setup-grid">
          <li class="setup-card"><h3>Sign in once</h3><p>Use the same account on the devices and apps you already use.</p><p class="card-links"><a href="https://claude.ai/">Open Claude</a> &middot; <a href="https://claude.ai/downloads">Download Claude</a></p></li>
          <li class="setup-card">
            <div class="prompt-head compact-head"><h3>Set personal instructions</h3><button class="button small copy" data-copy-target="personal-instructions-template" type="button">Copy</button></div>
            <p>Tell Claude your default tone, detail level, and when it should ask first.</p>
            <p class="card-links"><a href="https://support.claude.com/en/articles/10185728-understanding-claude-s-personalization-features">Instructions guide</a></p>
            <textarea id="personal-instructions-template" aria-label="Personal instructions setup prompt" readonly rows="9">Help me write personal instructions for Claude.
Ask me four questions, one at a time, about:
- Tone and formality I prefer.
- Detail level I want by default.
- When you should ask before answering.
- Topics or formats to avoid.
After I answer, propose a short, edit-ready instructions block I can paste into Claude personalization. Keep it under 120 words.</textarea>
          </li>
          <li class="setup-card"><h3>Turn on Memory and search</h3><p>Memory and chat search make follow-ups smarter because Claude can build on prior context.</p><p class="card-links"><a href="https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context">Memory guide</a></p></li>
          <li class="setup-card"><h3>Add one Connector</h3><p>Pick the app you use most, review access, and test with non-sensitive material.</p><p class="card-links"><a href="https://support.claude.com/en/articles/14328846-browse-skills-connectors-and-plugins-in-one-directory">Directory</a></p></li>
          <li class="setup-card"><h3>Save your first Project</h3><p>Choose one repeated workflow and add its instructions, files, and examples.</p><p class="card-links"><a href="https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects">Project guide</a></p></li>
        </ol>
      </section>
      
      <section class="section toolkit-section" id="toolkit" aria-labelledby="toolkit-title">
        <div class="section-head">
          <h2 id="toolkit-title">Custom AI Toolkit</h2>
          <p>Explore the complete set of MCP servers, CLI plugins, Google Workspace integrations, and data science tools configured in my environment.</p>
        </div>
        
        <div class="surface-filter" aria-label="Filter AI Toolkit" id="toolkit-tabs" style="margin-bottom: 1.5rem;">
          <button type="button" class="choice is-active" data-toolkit-tab="clinical">Literature & Research</button>
          <button type="button" class="choice" data-toolkit-tab="office">Office & Workspace</button>
          <button type="button" class="choice" data-toolkit-tab="data">Data & Databases</button>
          <button type="button" class="choice" data-toolkit-tab="cli">CLI & Dev Workflows</button>
          <button type="button" class="choice" data-toolkit-tab="claude">Claude Code & Plugins</button>
        </div>

        <div class="toolkit-grid" id="toolkit-content">
          <!-- Dynamically populated by JS -->
        </div>

        <!-- Hidden textarea for copying sanitized mcp_config.json -->
        <textarea id="mcp-config-json" aria-label="Sanitized mcp_config.json" readonly style="display:none;">{
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
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://user:password@localhost/dbname"]
    },
    "helium": {
      "command": "npx",
      "args": ["-y", "helium-mcp-server"]
    },
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "YOUR_API_KEY_HERE"
      }
    },
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
    }
  }
}</textarea>
      </section>

      <section class="section compact-section" id="method" aria-labelledby="method-title">
        <div class="section-head">
          <h2 id="method-title">Use one loop everywhere</h2>
          <p>Context -> ask -> check -> improve -> save.</p>
        </div>
        <div class="method-grid">
          <article class="method-card"><span>1</span><h3>Context</h3><p>Goal, audience, source material, examples, rules.</p></article>
          <article class="method-card"><span>2</span><h3>Ask</h3><p>Request the exact output: email, table, slide outline, draft, design, or workflow.</p></article>
          <article class="method-card"><span>3</span><h3>Check</h3><p>Look for missing facts, assumptions, weak wording, and wrong format.</p></article>
          <article class="method-card"><span>4</span><h3>Improve</h3><p>Fix one weakness at a time instead of restarting.</p></article>
          <article class="method-card"><span>5</span><h3>Save</h3><p>Turn repeated work into a Project, template, Artifact, or agentic workflow.</p></article>
        </div>

        <div class="single-template">
          <article class="prompt-card trust-prompt">
            <div class="prompt-head"><h3>Context bundle</h3><button class="button small copy" data-copy-target="context-template" type="button">Copy</button></div>
            <textarea id="context-template" aria-label="Context engineering prompt" readonly rows="10">Use this context bundle before you answer.

Goal:
[WHAT I WANT DONE]

Source of truth:
[FILE, NOTE, WEBPAGE, MESSAGE, SCREENSHOT, FOLDER, OR APP]

Rules:
- Preserve: [WHAT SHOULD NOT CHANGE]
- Ask first before: [WHAT NEEDS MY APPROVAL]
- Avoid: [WHAT I DO NOT WANT]

Before finalizing, list anything uncertain, missing, or important for me to verify.</textarea>
          </article>
        </div>
      </section>

      <section class="section examples" id="examples" aria-labelledby="examples-title">
        <div class="section-head">
          <h2 id="examples-title">Fix vague prompts fast</h2>
        </div>
        <div class="example-grid worked-examples">
          <article class="example-card">
            <h3>Meeting note</h3>
            <p><strong>Vague:</strong> "Summarize this meeting note."</p>
            <p><strong>Why weak:</strong> no audience, length, or source rules.</p>
            <div class="prompt-head compact-head"><h3>Fixed prompt</h3><button class="button small copy" data-copy-target="meeting-example-template" type="button">Copy</button></div>
            <textarea id="meeting-example-template" aria-label="Fixed meeting note prompt" readonly rows="11">Summarize this meeting note for:
[AUDIENCE]

Source of truth:
[PASTE NOTE]

Goal:
Help me leave with decisions, owners, and deadlines.

Return:
- 3 decisions.
- 3 owners.
- 3 deadlines.
- Anything unclear before finalizing.</textarea>
          </article>
          <article class="example-card">
            <h3>Code change</h3>
            <p><strong>Vague:</strong> "Refactor this file."</p>
            <p><strong>Why weak:</strong> no scope, check command, or smallest-change rule.</p>
            <div class="prompt-head compact-head"><h3>Fixed prompt</h3><button class="button small copy" data-copy-target="code-example-template" type="button">Copy</button></div>
            <textarea id="code-example-template" aria-label="Fixed Claude Code prompt" readonly rows="11">Help me improve this file:
[FILE OR PATH]

Before editing:
- Explain the relevant part first.
- Propose the smallest useful change.
- Avoid unrelated cleanup.

After editing:
- Run the existing check command if one exists.
- Summarize what changed.
- Tell me what to test.</textarea>
          </article>
        </div>
      </section>

      <section class="section prompt-lab-section" id="prompt-lab" aria-labelledby="prompt-lab-title">
        <div class="section-head">
          <h2 id="prompt-lab-title">Turn a rough request into a strong prompt</h2>
          <p>Type normally. The builder adds context, output rules, and checks.</p>
        </div>
        <div class="prompt-lab">
          <div class="field">
            <label for="rough-prompt">What do you want Claude to help you do?</label>
            <textarea id="rough-prompt" rows="4">Help me turn my notes into a clear, useful output.</textarea>
          </div>
          <div class="choice-label">Choose the Claude surface</div>
          <div class="choice-grid" aria-label="Choose a Claude surface">
            <button type="button" class="choice is-active" data-surface="chat">Chat</button>
            <button type="button" class="choice" data-surface="project">Project</button>
            <button type="button" class="choice" data-surface="artifact">Artifact</button>
            <button type="button" class="choice" data-surface="research">Research</button>
            <button type="button" class="choice" data-surface="office">Office</button>
            <button type="button" class="choice" data-surface="chrome">Chrome</button>
            <button type="button" class="choice" data-surface="cowork">Cowork</button>
            <button type="button" class="choice" data-surface="connectors">Connectors</button>
            <button type="button" class="choice" data-surface="plugins">Plugins</button>
            <button type="button" class="choice" data-surface="mobile">Mobile</button>
            <button type="button" class="choice" data-surface="code">Code</button>
          </div>
          <div class="choice-label">Choose the output</div>
          <div class="choice-grid" aria-label="Choose output type">
            <button type="button" class="choice is-active" data-output="useful">Useful answer</button>
            <button type="button" class="choice" data-output="email">Email</button>
            <button type="button" class="choice" data-output="document">Document</button>
            <button type="button" class="choice" data-output="slides">Slides</button>
            <button type="button" class="choice" data-output="spreadsheet">Spreadsheet</button>
            <button type="button" class="choice" data-output="design">Design</button>
            <button type="button" class="choice" data-output="decision">Decision</button>
            <button type="button" class="choice" data-output="code">Code change</button>
            <button type="button" class="choice" data-output="agent">Agent workflow</button>
          </div>
          <div class="prompt-head lab-output-head">
            <h3>Optimized prompt</h3>
            <div class="prompt-actions">
              <button class="button small copy" data-copy-target="optimized-prompt" type="button">Copy</button>
              <button class="button small" id="open-claude-with-prompt" type="button">Copy and open Claude</button>
            </div>
          </div>
          <p id="prompt-status" class="sr-only" aria-live="polite"></p>
          <details class="model-fit" aria-labelledby="model-fit-title">
            <summary>
              <span id="model-fit-title">Model fit</span>
              <span id="model-fit-copy">Use Sonnet 4.6 for most everyday work. Switch only when the task clearly needs a different fit.</span>
            </summary>
            <div class="model-links" aria-label="Official model sources">
              <a href="https://www.anthropic.com/news/claude-haiku-4-5">Haiku 4.5</a>
              <a href="https://www.anthropic.com/news/claude-sonnet-4-6">Sonnet 4.6</a>
              <a href="https://www.anthropic.com/news/claude-opus-4-7">Opus 4.7</a>
            </div>
          </details>
          <textarea id="optimized-prompt" aria-label="Optimized prompt" readonly rows="15"></textarea>
        </div>
      </section>

      <section class="section" id="surfaces" aria-labelledby="surfaces-title">
        <div class="section-head">
          <h2 id="surfaces-title">Use the right Claude surface</h2>
          <p>Filter by task, then choose the simplest surface that fits.</p>
        </div>
        <div class="surface-filter" aria-label="Filter Claude surfaces">
          <button type="button" class="choice" data-surface-filter="all">All</button>
          <button type="button" class="choice is-active" data-surface-filter="draft">Draft</button>
          <button type="button" class="choice" data-surface-filter="research">Research</button>
          <button type="button" class="choice" data-surface-filter="files">Files</button>
          <button type="button" class="choice" data-surface-filter="office">Office</button>
          <button type="button" class="choice" data-surface-filter="code">Code</button>
          <button type="button" class="choice" data-surface-filter="agents">Agents</button>
        </div>
        <div class="surface-grid compact-surfaces">
          <article class="surface-card" data-surface-group="draft research files"><span class="surface-badge">Chat</span><h3>Drafts, uploads, images</h3><p>Quick questions, emails, file summaries, decisions, and image analysis.</p><div class="surface-actions"><a class="button small primary" href="https://support.claude.com/en/articles/8241126-upload-files-to-claude">Upload files</a><a class="button small" href="https://platform.claude.com/docs/en/build-with-claude/vision">Vision guide</a></div></article>
          <article class="surface-card" data-surface-group="research agents"><span class="surface-badge">Research</span><h3>Multi-source answers</h3><p>Several searches, connected context, and citations you can check.</p><div class="surface-actions"><a class="button small primary" href="https://support.claude.com/en/articles/11088861-using-research-on-claude">Use Research</a><a class="button small" href="https://support.claude.com/en/articles/11095361-when-should-i-use-web-search-extended-thinking-and-research">When to use</a></div></article>
          <article class="surface-card" data-surface-group="files agents"><span class="surface-badge">Projects</span><h3>Reusable workspaces</h3><p>Saved files, examples, instructions, and role for repeated work.</p><div class="surface-actions"><a class="button small primary" href="https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects">Set up Project</a><a class="button small" href="https://support.claude.com/en/articles/10185728-understanding-claude-s-personalization-features">Instructions</a></div></article>
          <article class="surface-card" data-surface-group="draft files"><span class="surface-badge">Artifacts</span><h3>Editable outputs</h3><p>Documents, charts, prototypes, small apps, and visual previews.</p><a class="setup-link" href="https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them">Artifact docs</a></article>
          <article class="surface-card" data-surface-group="draft office"><span class="surface-badge">Claude Design</span><h3>Visual drafts</h3><p>One-pagers, prototypes, slides, and design-system-aware visuals.</p><a class="setup-link" href="https://support.claude.com/en/articles/14604416-get-started-with-claude-design">Design guide</a></article>
          <article class="surface-card" data-surface-group="draft office files"><span class="surface-badge">Word</span><h3>Document review</h3><p>Review, rewrite, and improve selected text while preserving structure.</p><div class="surface-actions"><a class="button small primary" href="https://support.claude.com/en/articles/14465370-use-claude-for-word">Set up in Word</a><a class="button small" href="https://support.claude.com/en/articles/14465370-use-claude-for-word">Guide</a></div></article>
          <article class="surface-card" data-surface-group="draft office"><span class="surface-badge">PowerPoint</span><h3>Deck building</h3><p>Storyline, slide structure, clearer messages, and better visuals.</p><div class="surface-actions"><a class="button small primary" href="https://support.claude.com/en/articles/13521390-use-claude-for-powerpoint">Set up in PowerPoint</a><a class="button small" href="https://support.claude.com/en/articles/13521390-use-claude-for-powerpoint">Guide</a></div></article>
          <article class="surface-card" data-surface-group="office files"><span class="surface-badge">Excel</span><h3>Workbook help</h3><p>Formula explanations, table checks, analysis, and doc/deck handoff.</p><div class="surface-actions"><a class="button small primary" href="https://support.claude.com/en/articles/12650343-use-claude-for-excel">Set up in Excel</a><a class="button small" href="https://support.claude.com/en/articles/12650343-use-claude-for-excel">Guide</a></div></article>
          <article class="surface-card" data-surface-group="research files"><span class="surface-badge">Chrome</span><h3>Website tasks</h3><p>Reading, comparing, navigating, and low-risk browser workflows.</p><div class="surface-actions"><a class="button small primary" href="https://support.claude.com/en/articles/12012173-get-started-with-claude-in-chrome">Set up Chrome</a></div></article>
          <article class="surface-card" data-surface-group="research files agents"><span class="surface-badge">Connectors</span><h3>Your apps and files</h3><p>Trusted services Claude can search, use, or show as interactive app cards.</p><div class="surface-actions"><a class="button small primary" href="https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities">Set up connectors</a><a class="button small" href="https://support.claude.com/en/articles/13454812-use-interactive-connectors-in-claude">Interactive apps</a><a class="button small" href="https://support.claude.com/en/articles/14328846-browse-skills-connectors-and-plugins-in-one-directory">Directory</a></div></article>
          <article class="surface-card" data-surface-group="files agents"><span class="surface-badge">Mac + Windows</span><h3>Desktop app</h3><p>Daily work, app handoff, Cowork, and Mac quick entry when available.</p><div class="surface-actions"><a class="button small primary" href="https://claude.ai/downloads">Download app</a><a class="button small" href="https://support.claude.com/en/articles/10065433-install-claude-desktop">Desktop guide</a><a class="button small" href="https://support.claude.com/en/articles/12626668-use-quick-entry-with-claude-desktop-on-mac">Mac quick entry</a></div></article>
          <article class="surface-card" data-surface-group="files code agents"><span class="surface-badge">Claude Cowork</span><h3>Longer desktop jobs</h3><p>Selected files, folders, apps, progress visibility, and handoff.</p><div class="surface-actions"><a class="button small primary" href="https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork">Cowork guide</a></div></article>
          <article class="surface-card" data-surface-group="code agents"><span class="surface-badge">Plugins</span><h3>Ready-made Cowork setups</h3><p>Skills, connectors, and subagents bundled for a role or workflow.</p><div class="surface-actions"><a class="button small primary" href="https://support.claude.com/en/articles/13837440-use-plugins-in-claude-cowork">Set up plugins</a><a class="button small" href="https://support.claude.com/en/articles/14328846-browse-skills-connectors-and-plugins-in-one-directory">Directory</a></div></article>
          <article class="surface-card" data-surface-group="draft files"><span class="surface-badge">iOS + Android</span><h3>Mobile work</h3><p>Voice, quick capture, messages, calendar help, and app handoff.</p><div class="surface-actions"><a class="button small primary" href="https://support.claude.com/en/articles/11869619-using-claude-with-ios-apps">iOS guide</a><a class="button small primary" href="https://support.claude.com/en/articles/11869629-using-claude-with-android-apps">Android guide</a><a class="button small" href="https://support.claude.com/en/articles/10065434-using-dictation-on-claude-mobile">Dictation</a></div></article>
          <article class="surface-card" data-surface-group="code agents files"><span class="surface-badge">Claude Code</span><h3>Repository work</h3><p>Inspect first, make the smallest useful edit, then run checks.</p><div class="surface-actions"><a class="button small primary" href="https://code.claude.com/docs/en/overview">Open Claude Code</a><a class="button small" href="https://code.claude.com/docs/en/overview">Guide</a></div></article>
        </div>
        <div class="decision-strip" aria-label="Claude surface decision rules">
          <div><h3>Chat or Project?</h3><p><strong>Chat</strong> for one-time work. <strong>Project</strong> when you would reuse the same background, files, or instructions.</p></div>
          <div><h3>Search or Research?</h3><p><strong>Search</strong> for one fact. <strong>Research</strong> when Claude needs several sources, citations, and synthesis.</p></div>
          <div><h3>Artifact or Design?</h3><p><strong>Artifact</strong> for an editable output. <strong>Design</strong> when the visual result itself needs polish.</p></div>
          <div><h3>Connector or Plugin?</h3><p><strong>Connector</strong> adds one trusted app. <strong>Plugin</strong> bundles a Cowork workflow with tools and skills.</p></div>
          <div><h3>Answer or thinking?</h3><p><strong>Answer</strong> for simple work. <strong>Thinking</strong> when reasoning, math, code, or tradeoffs need a careful path and final check.</p></div>
          <div><h3>Desktop or Mobile?</h3><p><strong>Desktop</strong> for longer work with files and apps. <strong>Mobile</strong> for voice, capture, messages, and quick review.</p></div>
          <div><h3>Cowork or Code?</h3><p><strong>Cowork</strong> for desktop files and apps. <strong>Code</strong> for repositories, tests, reviews, and pull requests.</p></div>
        </div>

        <details class="terms-panel">
          <summary>Claude terms in plain English</summary>
          <div class="glossary-grid">
            <article class="glossary-card"><h3>Instructions</h3><p>Saved preferences for tone, detail, format, and when Claude should ask first.</p></article>
            <article class="glossary-card"><h3>Project</h3><p>A focused workspace for repeated work with the same files and instructions.</p></article>
            <article class="glossary-card"><h3>Artifact</h3><p>An editable output such as a page, chart, document, prototype, or small app.</p></article>
            <article class="glossary-card"><h3>Research</h3><p>A deeper mode where Claude searches across sources and returns citations you can check.</p></article>
            <article class="glossary-card"><h3>Context engineering</h3><p>Giving Claude the goal, source material, examples, rules, and checks before it works.</p></article>
            <article class="glossary-card"><h3>Extended thinking</h3><p>A deeper reasoning mode for hard problems. Use it when the answer needs a careful path, not just a quick draft.</p></article>
            <article class="glossary-card"><h3>Long context</h3><p>Giving Claude a lot of source material at once. Ask it to map the sources before answering.</p></article>
            <article class="glossary-card"><h3>Connector</h3><p>A controlled connection between Claude and another app or service.</p></article>
          <article class="glossary-card"><h3>Plugin</h3><p>A Cowork add-on that can include skills, connectors, and subagents for a role or workflow.</p></article>
            <article class="glossary-card"><h3>Agentic workflow</h3><p>A repeatable job with inputs, allowed actions, checks, and a handoff.</p></article>
            <article class="glossary-card"><h3>MCP</h3><p>A standard way to connect Claude Code or agents to tools and data sources.</p></article>
            <article class="glossary-card"><h3>Hook</h3><p>A command that can run before or after a Claude Code action, often for checks.</p></article>
          </div>
        </details>
      </section>

      <section class="section features-trio" id="features-trio" aria-labelledby="features-trio-title">
        <div class="section-head">
          <h2 id="features-trio-title">Set these three once</h2>
        </div>
        <div class="power-grid">
          <article class="power-card"><span>1</span><h3>Skills</h3><p>Skills teach Claude repeatable procedures for specialized work.</p><p><strong>Try:</strong> browse the directory and add one Skill for a workflow you repeat.</p><a class="setup-link" href="https://support.claude.com/en/articles/12512176-what-are-skills">Skills guide</a></article>
          <article class="power-card"><span>2</span><h3>Memory</h3><p>Memory helps Claude carry useful context into future chats.</p><p><strong>Try:</strong> ask Claude what it remembers, then correct anything stale.</p><a class="setup-link" href="https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context">Memory guide</a></article>
          <article class="power-card"><span>3</span><h3>Personal instructions</h3><p>Instructions and styles set your default tone, depth, and output shape.</p><p><strong>Try:</strong> set a concise default and add exceptions for high-stakes work.</p><a class="setup-link" href="https://support.claude.com/en/articles/10185728-understanding-claude-s-personalization-features">Instructions guide</a></article>
        </div>
        <div class="resource-row" aria-label="Claude customization resources">
          <a href="https://support.claude.com/en/articles/14328846-browse-skills-connectors-and-plugins-in-one-directory">Skills, connectors, and plugins directory</a>
          <a href="https://support.claude.com/en/articles/10181068-configure-and-use-styles">Styles guide</a>
        </div>
      </section>

      <section class="section fixer-section" id="fix-answer" aria-labelledby="fix-answer-title">
        <div class="section-head">
          <h2 id="fix-answer-title">Repair weak answers instead of starting over</h2>
          <p>Pick the problem and copy the recovery prompt.</p>
        </div>
        <div class="task-tool fixer-tool" aria-label="Claude answer fixer">
          <div class="task-options">
            <p class="tool-label">What went wrong?</p>
            <div class="task-grid compact">
              <button type="button" class="choice is-active" data-fix="vague">Too vague</button>
              <button type="button" class="choice" data-fix="wrong">Possibly wrong</button>
              <button type="button" class="choice" data-fix="long">Too long</button>
              <button type="button" class="choice" data-fix="technical">Too technical</button>
              <button type="button" class="choice" data-fix="format">Wrong format</button>
              <button type="button" class="choice" data-fix="stuck">Needs questions</button>
              <button type="button" class="choice" data-fix="evidence">Weak evidence</button>
              <button type="button" class="choice" data-fix="action">Not actionable</button>
              <button type="button" class="choice" data-fix="tone">Tone is off</button>
            </div>
          </div>
          <div class="task-result" aria-live="polite">
            <div class="prompt-head">
              <h3 id="fix-output-title">Too vague</h3>
              <button class="button small copy" data-copy-target="fix-prompt" type="button">Copy</button>
            </div>
            <div class="result-copy">
              <p id="fix-next"><strong>Use when:</strong> Claude sounds reasonable but you still cannot act on the answer.</p>
            </div>
            <textarea id="fix-prompt" aria-label="Recovery prompt for Claude's answer" readonly rows="10"></textarea>
          </div>
        </div>

        <div class="single-template">
          <article class="prompt-card trust-prompt">
            <div class="prompt-head"><h3>Reliability check</h3><button class="button small copy" data-copy-target="trust-template" type="button">Copy</button></div>
            <textarea id="trust-template" aria-label="Reliability check prompt" readonly rows="11">Review your last answer before I rely on it.

Source of truth:
[PASTE OR NAME THE FILE, NOTE, WEBPAGE, OR MESSAGE]

For each important claim, label it as:
- Confirmed from the source of truth.
- Reasonable inference.
- Needs checking.

Then correct the answer if needed and give me a short review checklist.</textarea>
          </article>
        </div>
        <article class="trust-rubric">
          <h3>When to trust, when to verify</h3>
          <div class="trust-grid">
            <div><h4>Trust without extra checking</h4><p>Tone shaping, summaries of material you provided, reformatting, brainstorming, and facts you can sanity-check at a glance.</p></div>
            <div><h4>Verify before relying</h4><p>Numbers, names, dates, citations, code that touches data, medical / legal / financial decisions, and anything you will send or publish.</p></div>
            <div><h4>Verify with the source</h4><p>Claims about specific people, organizations, products, or events; quotes; statistics; and anything outside your own material.</p></div>
          </div>
        </article>
      </section>

      <section class="section power-section" id="power-moves" aria-labelledby="power-moves-title">
        <div class="section-head">
          <h2 id="power-moves-title">Use stronger patterns</h2>
        </div>
        <details class="section-details">
          <summary>Show advanced patterns</summary>
          <div class="power-grid">
            <article class="power-card"><span>1</span><h3>Artifact iteration</h3><p>Ask Claude to revise the output itself: add a filter, simplify a page, make a dashboard, or add a toggle.</p><p><strong>Try:</strong> "Keep the content, make it easier to scan, and add one useful control."</p></article>
            <article class="power-card"><span>2</span><h3>Reason, answer, check</h3><p>For complex work, ask Claude to outline the steps, answer, then check against your rules.</p><p><strong>Try:</strong> "Before answering, outline the steps. Then give the answer. End with what I should verify."</p></article>
            <article class="power-card"><span>3</span><h3>Meta-prompting</h3><p>When the task is fuzzy, ask Claude to interview you before writing the final prompt.</p><p><strong>Try:</strong> "Ask me the five questions needed to write the best prompt for this task."</p></article>
          </div>
          <article class="prompt-card trust-prompt">
            <div class="prompt-head"><h3>Prompt architect</h3><button class="button small copy" data-copy-target="architect-template" type="button">Copy</button></div>
            <textarea id="architect-template" aria-label="Prompt architect template" readonly rows="10">I want Claude to help me with this task:
[DESCRIBE THE TASK]

Do not answer yet.

First, ask me the five questions that would help you write the strongest prompt.
After I answer, create:
1. A clear reusable prompt.
2. A shorter quick-use version.
3. The best Claude surface for this workflow.
4. A checklist for judging the result.</textarea>
          </article>
        </details>
      </section>

      <section class="section agents-section" id="agents" aria-labelledby="agents-title">
        <div class="section-head">
          <h2 id="agents-title">Build agentic workflows safely</h2>
          <p>Start manually. Automate only after the goal, inputs, allowed actions, checks, and handoff are clear.</p>
        </div>
        <details class="section-details">
          <summary>Show agent workflow builder</summary>
          <div class="agent-lanes">
            <article class="agent-card"><span class="surface-badge">Beginner</span><h3>Personal workflow</h3><p>Use a Project, saved prompt, source files, and a review checklist.</p><p><strong>Good for:</strong> meeting prep, document review, inbox drafting, research synthesis, Office work.</p></article>
            <article class="agent-card"><span class="surface-badge">Builder</span><h3>Repository workflow</h3><p>Use Claude Code when files, tests, command-line checks, or pull requests matter.</p><p><strong>Add later:</strong> custom commands, subagents, hooks, and MCP tools when they solve a repeated problem.</p></article>
            <article class="agent-card"><span class="surface-badge">Developer</span><h3>Hosted agent</h3><p>Use the Agent SDK when the agent must run inside an app or service.</p><p><strong>Require:</strong> narrow tools, logging, monitoring, and review before high-impact actions.</p></article>
          </div>
          <div class="agent-steps">
            <article><span>1</span><h3>Job</h3><p>What the agent helps with.</p></article>
            <article><span>2</span><h3>Trigger</h3><p>When the workflow starts.</p></article>
            <article><span>3</span><h3>Inputs</h3><p>Files, notes, sites, issues, or messages.</p></article>
            <article><span>4</span><h3>Actions</h3><p>What it may do and what needs approval.</p></article>
            <article><span>5</span><h3>Checks</h3><p>Facts, tests, errors, and review points.</p></article>
            <article><span>6</span><h3>Handoff</h3><p>What you review before trusting it.</p></article>
          </div>
          <article class="prompt-card trust-prompt">
            <div class="prompt-head"><h3>Agent workflow brief</h3><button class="button small copy" data-copy-target="agent-brief-template" type="button">Copy</button></div>
            <textarea id="agent-brief-template" aria-label="Agent workflow brief prompt" readonly rows="14">Help me design an agentic workflow with Claude.

Workflow goal:
[WHAT THE AGENT SHOULD HELP WITH]

Trigger:
[WHEN IT STARTS]

Inputs it may use:
[FILES, NOTES, WEBSITES, ISSUES, MESSAGES, OR DATA]

Allowed actions:
[WHAT IT MAY DO]

Actions that need my approval:
[WHAT IT MUST ASK BEFORE DOING]

Return the simplest version, the safety checks, the handoff, and what would require Claude Code, GitHub Actions, or the Agent SDK later.</textarea>
          </article>
          <div class="resource-row" aria-label="Official agent development resources">
            <a href="https://docs.claude.com/en/docs/claude-code/sdk/sdk-overview">Agent SDK</a>
            <a href="https://docs.claude.com/en/docs/agent-sdk/hosting">Hosting</a>
            <a href="https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview">Tool use</a>
            <a href="https://docs.claude.com/en/docs/claude-code/mcp">MCP</a>
            <a href="https://docs.claude.com/en/docs/claude-code/github-actions">GitHub Actions</a>
          </div>
        </details>
      </section>

      <section class="section prompts" id="prompts" aria-labelledby="prompts-title">
        <div class="section-head section-head-action">
          <div>
            <h2 id="prompts-title">Copy only what you need</h2>
            <p>The task picker and Prompt Lab cover most work. Use these for reusable workflows.</p>
          </div>
          <button class="button" id="export-prompts" type="button">Export Markdown</button>
        </div>
        <div class="template-list">
          <details class="template-details" open>
            <summary>Research and connected apps</summary>
            <article class="prompt-card"><div class="prompt-head"><h3>Research and connected apps</h3><button class="button small copy" data-copy-target="connected-template" type="button">Copy</button></div><textarea id="connected-template" aria-label="Research and connected apps setup prompt" readonly rows="13">Help me set up Claude for this workflow.

Workflow:
[WHAT I WANT TO DO REPEATEDLY]

Sources or apps involved:
[FILES, DRIVE, EMAIL, CALENDAR, SLACK, LINEAR, DOCS, OR OTHER]

Research needed:
[WHAT CLAUDE MAY NEED TO INVESTIGATE]

Recommend:
1. Whether to use Chat, Project, Research, a connector, or a Cowork plugin.
2. The first connector or plugin to set up, if any.
3. The permissions I should review before connecting it.
4. A safe first test using non-sensitive material.
5. The exact prompt to use after setup.</textarea></article>
          </details>

          <details class="template-details">
            <summary>Chrome or Cowork safety</summary>
            <article class="prompt-card"><div class="prompt-head"><h3>Browser and desktop task</h3><button class="button small copy" data-copy-target="cowork-template" type="button">Copy</button></div><textarea id="cowork-template" aria-label="Claude Cowork prompt" readonly rows="12">Help me run this task safely.

Goal:
[WHAT I WANT DONE]

Material Claude may use:
[FILES, FOLDERS, APPS, WEBSITES, OR CONNECTORS]

Rules:
- Explain your approach before acting.
- Ask before changing, sending, deleting, posting, sharing, or opening sensitive material.
- Stop if access, uncertainty, or risk is unclear.

Start by telling me the safest first action.</textarea></article>
          </details>

          <details class="template-details">
            <summary>Claude Code</summary>
            <article class="prompt-card"><div class="prompt-head"><h3>Claude Code</h3><button class="button small copy" data-copy-target="code-template" type="button">Copy</button></div><textarea id="code-template" aria-label="Claude Code prompt" readonly rows="12">Help me with this codebase in plain English.

Task:
[DESCRIBE THE CHANGE]

Before editing:
- Explain the relevant part of the project.
- Identify the files likely involved.
- Tell me the smallest useful change.

While editing, avoid unrelated cleanup and run the relevant check if one exists.
Afterward, summarize what changed and what I should test.</textarea></article>
          </details>

          <details class="template-details">
            <summary>What's new digest</summary>
            <article class="prompt-card"><div class="prompt-head"><h3>What's new digest</h3><button class="button small copy" data-copy-target="features-template" type="button">Copy</button></div><textarea id="features-template" aria-label="What's new digest prompt" readonly rows="10">I want to keep up with Claude without getting overwhelmed.

I will paste notes from official Claude release notes, documentation, or announcements.

For each change, tell me:
1. What changed in plain English.
2. Which everyday workflow it helps.
3. Whether a beginner should try it now, save it for later, or ignore it.
4. One safe test task I can use to learn it.

Focus only on practical use.</textarea></article>
          </details>
        </div>
      </section>

      <section class="section feature-section" id="features" aria-labelledby="features-title">
        <div class="section-head">
          <h2 id="features-title">What changed and what to try</h2>
          <p>Updated Sunday and Wednesday at 11:00 PM Pacific from official sources.</p>
        </div>
        <div class="feature-grid">
          <article class="feature-post"><span class="surface-badge">May 6, 2026</span><h3>Claude Code feels smoother in real terminals</h3><p><strong>What changed:</strong> Claude Code shipped a batch of reliability and terminal UX fixes—better pasting, less flaky resume/scroll behavior, and safer shutdown when sessions are interrupted.</p><p><strong>Try it:</strong> update Claude Code, paste a screenshot, and run a short task; then use <code>--resume</code> to pick up where you left off.</p><a href="https://code.claude.com/docs/en/changelog">Read Claude Code changelog</a></article>
          <article class="feature-post"><span class="surface-badge">May 5, 2026</span><h3>Ready-to-run finance agents arrive as plugins</h3><p><strong>What changed:</strong> Anthropic released ten agent templates for common financial-services workflows (for example: pitchbooks, KYC screening, and month-end close). They ship as plugins for Claude Cowork and Claude Code, with accompanying cookbooks for managed agents.</p><p><strong>Try it:</strong> pick one template, run it on a non-sensitive sample document, then save your best prompt + checklist as a reusable workflow.</p><a href="https://www.anthropic.com/news/finance-agents">Read announcement</a></article>
          <article class="feature-post"><span class="surface-badge">Apr 28, 2026</span><h3>Creative work connects to more tools</h3><p><strong>What changed:</strong> connectors for Adobe Creative Cloud, Blender, Ableton, Autodesk Fusion, SketchUp, Splice, Affinity, and Resolume help Claude support design, 3D, audio, and production tasks.</p><p><strong>Try it:</strong> ask Claude to walk you through one feature you have been avoiding in a creative tool, then turn it into a repeatable workflow.</p><a href="https://www.anthropic.com/news/claude-for-creative-work">Read announcement</a></article>
          <article class="feature-post"><span class="surface-badge">Apr 17, 2026</span><h3>Claude Design creates polished visual work</h3><p><strong>What changed:</strong> Claude Design helps create designs, prototypes, slides, one-pagers, and other visual drafts.</p><p><strong>Try it:</strong> ask for a one-page visual summary, then ask Claude to improve clarity before polish.</p><a href="https://support.claude.com/en/articles/12138966-release-notes">Read release notes</a></article>
        </div>
        <details class="section-details older-updates">
          <summary>Older updates</summary>
          <div class="feature-grid">
            <article class="feature-post"><span class="surface-badge">Apr 16, 2026</span><h3>Opus 4.7 improves complex work</h3><p><strong>What changed:</strong> Opus 4.7 improves software engineering, long-running coding, and vision with images up to about 2,576 pixels on the long edge.</p><p><strong>Try it:</strong> paste a dense screenshot of a chart, table, or dashboard and ask Claude to extract the data into a clean table.</p><a href="https://www.anthropic.com/news/claude-opus-4-7">Read launch note</a></article>
            <article class="feature-post"><span class="surface-badge">Apr 9, 2026</span><h3>Claude Cowork expands desktop help</h3><p><strong>What changed:</strong> Cowork became generally available on macOS and Windows through the Claude Desktop app.</p><p><strong>Try it:</strong> start with a read-only folder review and approve changes only after Claude explains them.</p><a href="https://support.claude.com/en/articles/12138966-release-notes">Read release notes</a></article>
            <article class="feature-post"><span class="surface-badge">Mar 25, 2026</span><h3>Connectors can show interactive apps</h3><p><strong>What changed:</strong> some connectors now show live app cards and fullscreen interfaces inside Claude.</p><p><strong>Try it:</strong> connect one trusted app, ask a real question, then use the interactive card before asking Claude to summarize the result.</p><a href="https://support.claude.com/en/articles/13454812-use-interactive-connectors-in-claude">Read guide</a></article>
          </div>
        </details>
        <p class="review-note">Last reviewed against official Claude and Anthropic sources on May 7, 2026.</p>
      </section>

      <section class="section" id="sources" aria-labelledby="sources-title">
        <div class="section-head">
          <h2 id="sources-title">Official courses and documentation</h2>
          <p>Use Anthropic courses for structured learning, then source docs for setup and verification.</p>
        </div>
        <div class="resource-row course-row" aria-label="Official Anthropic courses">
          <a href="https://anthropic.skilljar.com/">Anthropic Academy hub</a>
          <a href="https://anthropic.skilljar.com/claude-101">Claude 101</a>
          <a href="https://anthropic.skilljar.com/introduction-to-claude-cowork">Introduction to Claude Cowork</a>
          <a href="https://anthropic.skilljar.com/ai-fluency-framework-foundations">AI Fluency</a>
          <a href="https://github.com/anthropics/prompt-eng-interactive-tutorial">Prompt engineering tutorial</a>
        </div>
        <details class="source-panel">
          <summary>Show source links</summary>
          <ul class="source-list">
            <li><a href="https://anthropic.skilljar.com/">Anthropic Academy hub</a></li>
            <li><a href="https://anthropic.skilljar.com/claude-101">Claude 101</a></li>
            <li><a href="https://anthropic.skilljar.com/introduction-to-claude-cowork">Introduction to Claude Cowork</a></li>
            <li><a href="https://anthropic.skilljar.com/ai-fluency-framework-foundations">AI Fluency: Framework & Foundations</a></li>
            <li><a href="https://github.com/anthropics/prompt-eng-interactive-tutorial">Anthropic interactive prompt engineering tutorial</a></li>
            <li><a href="https://support.claude.com/en/articles/10185728-understanding-claude-s-personalization-features">Personalization and Instructions</a></li>
            <li><a href="https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects">Create and manage Projects</a></li>
            <li><a href="https://support.claude.com/en/articles/8241126-upload-files-to-claude">Upload files to Claude</a></li>
            <li><a href="https://platform.claude.com/docs/en/build-with-claude/vision">Vision guide</a></li>
            <li><a href="https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context">Chat search and memory</a></li>
            <li><a href="https://support.claude.com/en/articles/11088861-using-research-on-claude">Using Research on Claude</a></li>
            <li><a href="https://support.claude.com/en/articles/11095361-when-should-i-use-web-search-extended-thinking-and-research">Web search, thinking, and Research</a></li>
            <li><a href="https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them">Artifacts</a></li>
            <li><a href="https://support.claude.com/en/articles/12512176-what-are-skills">Skills</a></li>
            <li><a href="https://support.claude.com/en/articles/10181068-configure-and-use-styles">Styles</a></li>
            <li><a href="https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities">Connectors</a></li>
            <li><a href="https://support.claude.com/en/articles/13454812-use-interactive-connectors-in-claude">Interactive connectors</a></li>
            <li><a href="https://support.claude.com/en/articles/14328846-browse-skills-connectors-and-plugins-in-one-directory">Skills, connectors, and plugins directory</a></li>
            <li><a href="https://support.claude.com/en/articles/13837440-use-plugins-in-claude-cowork">Plugins in Claude Cowork</a></li>
            <li><a href="https://support.claude.com/en/articles/10065433-install-claude-desktop">Install Claude Desktop for Mac and Windows</a></li>
            <li><a href="https://support.claude.com/en/articles/12626668-use-quick-entry-with-claude-desktop-on-mac">Quick entry on Mac</a></li>
            <li><a href="https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork">Claude Cowork guide</a></li>
            <li><a href="https://support.claude.com/en/articles/14128542-let-claude-use-your-computer-in-cowork">Computer use in Cowork</a></li>
            <li><a href="https://support.claude.com/en/articles/12012173-get-started-with-claude-in-chrome">Claude in Chrome</a></li>
            <li><a href="https://support.claude.com/en/articles/14465370-use-claude-for-word">Claude for Word</a></li>
            <li><a href="https://support.claude.com/en/articles/13521390-use-claude-for-powerpoint">Claude for PowerPoint</a></li>
            <li><a href="https://support.claude.com/en/articles/12650343-use-claude-for-excel">Claude for Excel</a></li>
            <li><a href="https://support.claude.com/en/articles/13892150-work-across-excel-powerpoint-and-word">Work across Excel, PowerPoint, and Word</a></li>
            <li><a href="https://support.claude.com/en/articles/11869619-using-claude-with-ios-apps">Claude with iOS apps</a></li>
            <li><a href="https://support.claude.com/en/articles/11869629-using-claude-with-android-apps">Claude with Android apps</a></li>
            <li><a href="https://support.claude.com/en/articles/10065434-using-dictation-on-claude-mobile">Dictation on Claude Mobile</a></li>
            <li><a href="https://www.anthropic.com/news/claude-haiku-4-5">Claude Haiku 4.5 launch</a></li>
            <li><a href="https://www.anthropic.com/news/claude-sonnet-4-6">Claude Sonnet 4.6 launch</a></li>
            <li><a href="https://support.claude.com/en/articles/12138966-release-notes">Claude release notes</a></li>
            <li><a href="https://www.anthropic.com/news">Anthropic newsroom</a></li>
            <li><a href="https://www.anthropic.com/news/claude-for-creative-work">Claude for Creative Work</a></li>
            <li><a href="https://www.anthropic.com/news/claude-opus-4-7">Claude Opus 4.7 launch</a></li>
            <li><a href="https://support.claude.com/en/articles/14604416-get-started-with-claude-design">Claude Design guide</a></li>
            <li><a href="https://code.claude.com/docs/en/overview">Claude Code overview</a></li>
            <li><a href="https://docs.claude.com/en/docs/claude-code/sdk/sdk-overview">Claude Agent SDK overview</a></li>
            <li><a href="https://docs.claude.com/en/docs/agent-sdk/hosting">Hosting the Agent SDK</a></li>
            <li><a href="https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview">Tool use with Claude</a></li>
            <li><a href="https://docs.claude.com/en/docs/claude-code/mcp">Claude Code MCP</a></li>
            <li><a href="https://docs.claude.com/en/docs/claude-code/hooks">Claude Code hooks</a></li>
            <li><a href="https://docs.claude.com/en/docs/claude-code/github-actions">Claude Code GitHub Actions</a></li>
            <li><a href="https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview">Prompt engineering overview</a></li>
            <li><a href="https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices#be-clear-and-direct">Clear, direct prompting</a></li>
            <li><a href="https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices#long-context-prompting">Long context prompting tips</a></li>
          </ul>
        </details>
      </section>

<div class="toast" id="toast" role="status" aria-live="polite" aria-atomic="true"></div>

</div>
