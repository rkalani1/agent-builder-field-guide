# Universal AI Mastery & Interactive Workbench

> **Last verified:** 2026-07-18 (page structure; embedded product claims not individually re-verified) · **Drift risk:** high — vendor UIs and plan features drift; the official pages linked throughout are canonical

A model-agnostic playground and setup guide. Select your preferred AI model at the top, and the interactive workbench will dynamically configure its task prompts, setup checklists, toolkits, and surface recommendations for that provider.

---

<div class="universal-workbench">

  <!-- Model Selector Tab Bar -->
  <div class="model-selector-bar" role="tablist" aria-label="Select AI Model">
    <button type="button" class="choice model-tab is-active" data-model="chatgpt" aria-selected="true" role="tab">ChatGPT</button>
    <button type="button" class="choice model-tab" data-model="claude" aria-selected="false" role="tab">Claude</button>
    <button type="button" class="choice model-tab" data-model="gemini" aria-selected="false" role="tab">Gemini</button>
    <button type="button" class="choice model-tab" data-model="grok" aria-selected="false" role="tab">Grok</button>
  </div>

  <section class="hero hero-workbench" id="start" aria-labelledby="hero-title">
    <div class="hero-copy">
      <p id="hero-title" class="dynamic-model-name hero-display">Learn ChatGPT</p>
      <p class="lede">Start with one real task. Copy a strong prompt, choose the right surface, and improve the result.</p>
      <p style="margin:0 0 1rem;color:#6b617c;font-size:0.95rem;line-height:1.5;">Use non-sensitive examples here. Do not paste PHI, patient identifiers, learner records, credentials, confidential data, or restricted research data into public demos or exported prompt packs.</p>
      <div class="official-links" aria-label="Official app links" id="app-links">
        <!-- Populated dynamically -->
      </div>
      <div class="task-shortcuts" aria-label="Common tasks">
        <button type="button" data-shortcut-mission="email">Write</button>
        <button type="button" data-shortcut-mission="document">Summarize</button>
        <button type="button" data-shortcut-mission="research">Research</button>
        <button type="button" data-shortcut-mission="spreadsheet">Analyze file</button>
        <button type="button" data-shortcut-mission="slides">Make slides</button>
        <button type="button" data-shortcut-mission="lectureToPpt">Lecture to PPT</button>
        <button type="button" data-shortcut-mission="infographic">Infographic</button>
        <a href="#fix-answer">Fix answer</a>
        <button type="button" data-shortcut-mission="agent">Build agent</button>
      </div>
    </div>

    <div class="hero-task-panel" aria-label="Task picker">
      <h2 class="sr-only">Pick a task</h2>
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
            <button type="button" class="choice" data-mission="infographic">Infographic</button>
          </div>
        </div>
        <div class="task-result" aria-live="polite">
          <div class="prompt-head">
            <h3 id="mission-output-title">Email</h3>
            <button class="button small copy" data-copy-target="mission-prompt" type="button">Copy</button>
          </div>
          <div class="result-copy">
            <p id="mission-surface"></p>
            <p id="mission-next"></p>
          </div>
          <textarea id="mission-prompt" aria-label="Prompt for selected task" readonly rows="11"></textarea>
        </div>
      </div>
    </div>
  </section>

  <section class="section setup-strip" id="setup" aria-labelledby="setup-title">
    <div class="section-head">
      <h2 id="setup-title">Set up once</h2>
      <p>Configure defaults, preferences, and workspace templates once to maximize speed.</p>
    </div>
    <ol class="setup-grid" id="setup-cards-container">
      <!-- Populated dynamically -->
    </ol>
  </section>

  <section class="section toolkit-section" id="toolkit" aria-labelledby="toolkit-title">
    <div class="section-head">
      <h2 id="toolkit-title">Custom AI Toolkit</h2>
      <p>Explore the complete set of MCP servers, CLI plugins, Workspace integrations, and data science tools configured in the environment.</p>
    </div>
    
    <div class="surface-filter" aria-label="Filter AI Toolkit" id="toolkit-tabs" style="margin-bottom: 1.5rem;">
      <button type="button" class="choice is-active" data-toolkit-tab="clinical">Literature & Research</button>
      <button type="button" class="choice" data-toolkit-tab="office">Office & Workspace</button>
      <button type="button" class="choice" data-toolkit-tab="data">Data & Databases</button>
      <button type="button" class="choice" data-toolkit-tab="cli">CLI & Dev Workflows</button>
      <button type="button" class="choice" data-toolkit-tab="code-plugins" id="toolkit-model-plugins-tab">Model Plugins</button>
    </div>

    <div class="toolkit-grid" id="toolkit-content">
      <!-- Dynamically populated by JS -->
    </div>
    
    <!-- Hidden textarea for copying sanitized config -->
    <textarea id="mcp-config-json" aria-label="Sanitized configuration" readonly style="display:none;"></textarea>
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
      <article class="method-card"><span>5</span><h3>Save</h3><p>Turn repeated work into a Project, custom GPT/Gem, template, or automation.</p></article>
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
    <div class="example-grid worked-examples" id="worked-examples-container">
      <!-- Populated dynamically -->
    </div>
  </section>

  <section class="section prompt-lab-section" id="prompt-lab" aria-labelledby="prompt-lab-title">
    <div class="section-head">
      <h2 id="prompt-lab-title">Turn a rough request into a strong prompt</h2>
      <p>Type normally. The builder adds context, output rules, and model-specific constraints.</p>
    </div>
    <div class="prompt-lab">
      <div class="field">
        <label for="rough-prompt">What do you want the AI to help you do?</label>
        <textarea id="rough-prompt" rows="4">Help me turn my notes into a clear, useful output.</textarea>
      </div>
      <div class="choice-label">Choose the target surface</div>
      <div class="choice-grid" aria-label="Choose a surface" id="lab-surface-selector">
        <!-- Populated dynamically -->
      </div>
      <div class="choice-label">Choose the output</div>
      <div class="choice-grid" aria-label="Choose output type" id="lab-output-selector">
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
          <button class="button small" id="open-app-with-prompt" type="button">Copy and open AI App</button>
        </div>
      </div>
      <p id="prompt-status" class="sr-only" aria-live="polite"></p>
      <details class="model-fit" aria-labelledby="model-fit-title">
        <summary>
          <span id="model-fit-title">Model fit</span>
          <span id="model-fit-copy"></span>
        </summary>
        <div class="model-links" aria-label="Model links" id="model-fit-links">
          <!-- Populated dynamically -->
        </div>
      </details>
      <textarea id="optimized-prompt" aria-label="Optimized prompt" readonly rows="15"></textarea>
    </div>
  </section>

  <section class="section" id="surfaces" aria-labelledby="surfaces-title">
    <div class="section-head">
      <h2 id="surfaces-title">Use the right surface</h2>
      <p>Filter by task, then choose the simplest surface that fits.</p>
    </div>
    <div class="surface-filter" aria-label="Filter surfaces" id="surface-filters-container">
      <button type="button" class="choice" data-surface-filter="all">All</button>
      <button type="button" class="choice is-active" data-surface-filter="draft">Draft</button>
      <button type="button" class="choice" data-surface-filter="research">Research</button>
      <button type="button" class="choice" data-surface-filter="files">Files</button>
      <button type="button" class="choice" data-surface-filter="office">Office</button>
      <button type="button" class="choice" data-surface-filter="code">Code</button>
      <button type="button" class="choice" data-surface-filter="agents">Agents</button>
    </div>
    <div class="surface-grid compact-surfaces" id="surfaces-grid-container">
      <!-- Populated dynamically -->
    </div>
    <div class="decision-strip" aria-label="Surface decision rules" id="surfaces-decision-container">
      <!-- Populated dynamically -->
    </div>

    <details class="terms-panel" id="glossary-panel">
      <summary>Terminology in plain English</summary>
      <div class="glossary-grid" id="glossary-grid-container">
        <!-- Populated dynamically -->
      </div>
    </details>
  </section>

  <section class="section fixer-section" id="fix-answer" aria-labelledby="fix-answer-title">
    <div class="section-head">
      <h2 id="fix-answer-title">Repair weak answers instead of starting over</h2>
      <p>Pick the problem and copy the recovery prompt.</p>
    </div>
    <div class="task-tool fixer-tool" aria-label="Answer fixer">
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
          <p id="fix-next"></p>
        </div>
        <textarea id="fix-prompt" aria-label="Recovery prompt" readonly rows="10"></textarea>
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
      <div class="power-grid" id="power-grid-container">
        <!-- Populated dynamically -->
      </div>
      <article class="prompt-card trust-prompt">
        <div class="prompt-head"><h3>Prompt architect</h3><button class="button small copy" data-copy-target="architect-template" type="button">Copy</button></div>
        <textarea id="architect-template" aria-label="Prompt architect template" readonly rows="10">I want the AI to help me with this task:
[DESCRIBE THE TASK]

Do not answer yet.

First, ask me the five questions that would help you write the strongest prompt.
After I answer, create:
1. A clear reusable prompt.
2. A shorter quick-use version.
3. The best app surface for this workflow.
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
      <div class="agent-lanes" id="agent-lanes-container">
        <!-- Populated dynamically -->
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
        <textarea id="agent-brief-template" aria-label="Agent workflow brief prompt" readonly rows="14">Help me design an agentic workflow with the AI.

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

Return the simplest version, the safety checks, the handoff, and what would require custom CLIs, GitHub Actions, or APIs later.</textarea>
      </article>
      <div class="resource-row" aria-label="Official agent development resources" id="agent-links">
        <!-- Populated dynamically -->
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
    <div class="template-list" id="prompts-template-list">
      <!-- Populated dynamically -->
    </div>
  </section>

</div>

<div class="toast" id="toast" role="status" aria-live="polite" aria-atomic="true"></div>
