# Task Builder

> **Last verified:** 2026-05-06 · **Drift risk:** low

**No API key required.** Tell us what you want done and which AI app you already use. We'll route you to the right workflow, give you a prompt to paste, and show you exactly what to click.

The Task Builder itself runs **entirely in your browser**. It does not send your answers to an API, analytics service, telemetry service, or account connection. Optional Save Draft uses `localStorage` only. The surrounding documentation site may still load normal site assets such as fonts, search indexes, and GitHub Pages/MkDocs metadata.

<noscript>
<div class="tb-noscript">
<strong>JavaScript is disabled.</strong> The interactive Task Builder needs JavaScript. The static templates in
<a href="../template-library/">Templates</a> and the per-product walkthroughs in
<a href="../mastery/">Mastery</a> produce the same shape of output by hand.
</div>
</noscript>

<div id="tb-app" class="tb-app" data-tb-version="0.5.2">

<header class="tb-header">
  <div>
    <h2 class="tb-step-title">Tell us about you and the task</h2>
    <p class="tb-step-sub">Beginner Mode is on by default. Developer Mode is for people who want API keys, CLIs, MCP, and local scripts.</p>
  </div>
  <div class="tb-mode" role="group" aria-label="Mode">
    <label class="tb-mode-label"><input type="radio" name="mode" value="beginner" checked> Beginner</label>
    <label class="tb-mode-label"><input type="radio" name="mode" value="power"> Power User</label>
    <label class="tb-mode-label"><input type="radio" name="mode" value="builder"> Builder</label>
    <label class="tb-mode-label"><input type="radio" name="mode" value="developer"> Developer</label>
  </div>
  <div class="tb-actions">
    <button type="button" class="tb-btn tb-btn-ghost" data-tb-action="save">Save draft</button>
    <button type="button" class="tb-btn tb-btn-ghost" data-tb-action="load">Load draft</button>
    <button type="button" class="tb-btn tb-btn-ghost" data-tb-action="reset">Reset</button>
    <button type="button" class="tb-btn tb-btn-ghost" data-tb-action="export">Export JSON</button>
    <button type="button" class="tb-btn tb-btn-ghost" data-tb-action="import">Import JSON</button>
    <input type="file" id="tb-import-file" accept="application/json" hidden>
  </div>
</header>

<form id="tb-form" class="tb-form" autocomplete="off" novalidate>

  <fieldset class="tb-section">
    <legend>1. Which AI do you already use most?</legend>
    <div class="tb-checks tb-checks-radio">
      <label><input type="radio" name="primary_app" value="chatgpt" checked> ChatGPT</label>
      <label><input type="radio" name="primary_app" value="claude"> Claude</label>
      <label><input type="radio" name="primary_app" value="gemini"> Gemini</label>
      <label><input type="radio" name="primary_app" value="grok"> Grok</label>
      <label><input type="radio" name="primary_app" value="perplexity"> Perplexity</label>
      <label><input type="radio" name="primary_app" value="copilot"> GitHub Copilot</label>
      <label><input type="radio" name="primary_app" value="other"> Something else</label>
      <label><input type="radio" name="primary_app" value="unknown"> I don't know</label>
    </div>
  </fieldset>

  <fieldset class="tb-section">
    <legend>2. What is your comfort level?</legend>
    <div class="tb-checks tb-checks-radio">
      <label><input type="radio" name="comfort" value="beginner" checked> Beginner — no code, no API keys</label>
      <label><input type="radio" name="comfort" value="comfortable"> Comfortable with apps</label>
      <label><input type="radio" name="comfort" value="power"> Power user</label>
      <label><input type="radio" name="comfort" value="developer"> Developer</label>
    </div>
    <p class="tb-help">Comfort affects how much detail we show. Comfort = Developer auto-switches Mode to Developer.</p>
  </fieldset>

  <fieldset class="tb-section">
    <legend>3. What do you want to do?</legend>
    <div class="tb-checks">
      <label><input type="checkbox" name="jobs" value="write"> Write</label>
      <label><input type="checkbox" name="jobs" value="summarize"> Summarize</label>
      <label><input type="checkbox" name="jobs" value="research"> Research</label>
      <label><input type="checkbox" name="jobs" value="plan"> Plan</label>
      <label><input type="checkbox" name="jobs" value="learn"> Learn</label>
      <label><input type="checkbox" name="jobs" value="organize"> Organize</label>
      <label><input type="checkbox" name="jobs" value="meetings"> Prepare for meetings</label>
      <label><input type="checkbox" name="jobs" value="email_calendar"> Manage email/calendar</label>
      <label><input type="checkbox" name="jobs" value="website_app"> Build a website/app</label>
      <label><input type="checkbox" name="jobs" value="automate"> Automate a repeated task</label>
      <label><input type="checkbox" name="jobs" value="documents_data"> Analyze documents/data</label>
      <label><input type="checkbox" name="jobs" value="code"> Work with code</label>
      <label><input type="checkbox" name="jobs" value="agent"> Build an agent</label>
      <label><input type="checkbox" name="jobs" value="skill"> Build a skill / custom assistant</label>
      <label><input type="checkbox" name="jobs" value="max_leverage"> Maximize the AI subscription I already pay for</label>
      <label><input type="checkbox" name="jobs" value="other"> Other</label>
    </div>
  </fieldset>

  <fieldset class="tb-section">
    <legend>4. The task in your own words</legend>
    <label class="tb-field">
      <span class="tb-label">What task do you want done?</span>
      <textarea name="task_summary" rows="3" placeholder="e.g., Triage overnight email into Now / Later / Reference / Trash"></textarea>
    </label>
    <label class="tb-field">
      <span class="tb-label">What final output should the AI produce?</span>
      <textarea name="task_output" rows="3" placeholder="e.g., A grouped list with subject lines and a one-sentence reason per group"></textarea>
    </label>
    <label class="tb-field">
      <span class="tb-label">Frequency</span>
      <select name="frequency">
        <option value="one_time">One-time</option>
        <option value="manual_repeat" selected>Repeated manually</option>
        <option value="scheduled">Scheduled (later, after manual run)</option>
        <option value="event">Event-triggered (later, after manual run)</option>
      </select>
    </label>
  </fieldset>

  <fieldset class="tb-section tb-section-advanced" data-tb-show-when="developer">
    <legend>5. (Developer Mode) Other surfaces you have access to</legend>
    <p class="tb-help">In Beginner Mode we use only your primary app. Switch to Developer Mode at the top to expose API/CLI/MCP/local-script surfaces.</p>
    <div class="tb-checks">
      <label><input type="checkbox" name="surfaces" value="claude_chat"> Claude (claude.ai)</label>
      <label><input type="checkbox" name="surfaces" value="claude_project"> Claude Projects</label>
      <label><input type="checkbox" name="surfaces" value="claude_desktop"> Claude Desktop</label>
      <label><input type="checkbox" name="surfaces" value="claude_code"> Claude Code (CLI)</label>
      <label><input type="checkbox" name="surfaces" value="chatgpt"> ChatGPT (chatgpt.com)</label>
      <label><input type="checkbox" name="surfaces" value="chatgpt_project"> ChatGPT Projects</label>
      <label><input type="checkbox" name="surfaces" value="custom_gpt"> Custom GPTs</label>
      <label><input type="checkbox" name="surfaces" value="codex"> Codex CLI</label>
      <label><input type="checkbox" name="surfaces" value="openai_api"> OpenAI API / Agents SDK</label>
      <label><input type="checkbox" name="surfaces" value="gemini"> Gemini app / Gems</label>
      <label><input type="checkbox" name="surfaces" value="gemini_cli"> Gemini CLI</label>
      <label><input type="checkbox" name="surfaces" value="antigravity"> Google Antigravity</label>
      <label><input type="checkbox" name="surfaces" value="ai_studio"> Google AI Studio / Gemini API</label>
      <label><input type="checkbox" name="surfaces" value="grok"> Grok / xAI API</label>
      <label><input type="checkbox" name="surfaces" value="copilot"> GitHub Copilot cloud agent</label>
      <label><input type="checkbox" name="surfaces" value="perplexity"> Perplexity</label>
      <label><input type="checkbox" name="surfaces" value="local_scripts"> Local Python / shell scripts</label>
      <label><input type="checkbox" name="surfaces" value="mcp"> MCP server (build your own)</label>
    </div>
  </fieldset>

  <fieldset class="tb-section">
    <legend>6. Inputs and outputs</legend>
    <p class="tb-help">What does the task touch?</p>
    <div class="tb-checks">
      <label><input type="checkbox" name="involves" value="files"> Files on my machine</label>
      <label><input type="checkbox" name="involves" value="code"> A code repository</label>
      <label><input type="checkbox" name="involves" value="email"> Email</label>
      <label><input type="checkbox" name="involves" value="calendar"> Calendar</label>
      <label><input type="checkbox" name="involves" value="browser"> A web browser</label>
      <label><input type="checkbox" name="involves" value="external_sites"> External websites</label>
      <label><input type="checkbox" name="involves" value="local_apps"> Local apps</label>
      <label><input type="checkbox" name="involves" value="apis"> APIs</label>
      <label><input type="checkbox" name="involves" value="database"> A database</label>
      <label><input type="checkbox" name="involves" value="documents"> Documents (PDFs, slides, sheets)</label>
    </div>
    <label class="tb-field">
      <span class="tb-label">Where do inputs come from?</span>
      <input name="inputs_source" type="text" placeholder="e.g., ~/Downloads/preprints/ , Gmail label 'review', a Notion page">
    </label>
    <label class="tb-field">
      <span class="tb-label">Where should outputs go?</span>
      <input name="outputs_destination" type="text" placeholder="e.g., a new file in ~/Obsidian/Inbox.md, a draft email, a JSON file">
    </label>
  </fieldset>

  <fieldset class="tb-section">
    <legend>7. Sensitivity and authority</legend>
    <label class="tb-field">
      <span class="tb-label">Is any data sensitive?</span>
      <select name="sensitivity">
        <option value="none" selected>No (public or my own non-sensitive notes)</option>
        <option value="confidential">Confidential business data</option>
        <option value="financial">Financial</option>
        <option value="legal">Legal</option>
        <option value="clinical">Clinical / PHI</option>
        <option value="regulated_other">Other regulated data</option>
      </select>
    </label>
    <label class="tb-field">
      <span class="tb-label">Should the AI act, or only draft?</span>
      <select name="authority">
        <option value="draft_only" selected>Draft only — humans take all final actions</option>
        <option value="act_with_approval">Take actions, but require human approval per action</option>
        <option value="act_within_allowlist">Take actions automatically within a strict allowlist</option>
      </select>
    </label>
    <label class="tb-field">
      <span class="tb-label">Which actions always require human approval?</span>
      <textarea name="hitl_actions" rows="2" placeholder="e.g., sending email, pushing to main, deleting files, posting publicly, calling external APIs that cost money"></textarea>
    </label>
  </fieldset>

  <fieldset class="tb-section">
    <legend>8. Quality and preferences</legend>
    <label class="tb-field">
      <span class="tb-label">What does good output look like? (paste an example or describe it)</span>
      <textarea name="good_examples" rows="3" placeholder="e.g., 5 paragraphs maximum, citations as inline markdown, no marketing language"></textarea>
    </label>
    <label class="tb-field">
      <span class="tb-label">What mistakes should the AI avoid?</span>
      <textarea name="avoid" rows="3" placeholder="e.g., never invent citations; never send email; never modify files outside the project folder"></textarea>
    </label>
    <label class="tb-field">
      <span class="tb-label">Tone, style, and preferences to remember</span>
      <textarea name="preferences" rows="3" placeholder="e.g., NEJM citation style, sentence-case headings, no emojis, bullet lists over paragraphs"></textarea>
    </label>
    <label class="tb-field">
      <span class="tb-label">What counts as success?</span>
      <textarea name="success" rows="2" placeholder="e.g., I can hand the output to my team without rewriting it"></textarea>
    </label>
    <label class="tb-field">
      <span class="tb-label">What should happen when information is missing or uncertain?</span>
      <select name="uncertainty">
        <option value="ask" selected>Ask me a clarifying question</option>
        <option value="flag">Flag the uncertainty in the output and continue</option>
        <option value="skip">Skip the uncertain part and continue</option>
      </select>
    </label>
  </fieldset>

</form>

<section class="tb-output">
  <header class="tb-output-header">
    <h2>Recommended workflow</h2>
    <p class="tb-output-sub">Generated locally from your answers. Updates as you type.</p>
  </header>

  <div id="tb-recommendation" class="tb-card tb-card-recommendation">
    <h3 class="tb-card-title">Pick your AI in section 1 to see a recommendation</h3>
    <p class="tb-card-body">Beginner Mode uses only your primary app and the safest shape that fits your task.</p>
  </div>

  <div class="tb-tabs" role="tablist">
    <button type="button" role="tab" class="tb-tab" data-tb-tab="prompt" aria-selected="true">Prompt</button>
    <button type="button" role="tab" class="tb-tab" data-tb-tab="setup">What to click</button>
    <button type="button" role="tab" class="tb-tab" data-tb-tab="providers">Use this in&hellip;</button>
    <button type="button" role="tab" class="tb-tab" data-tb-tab="learning">Learning ladder</button>
    <button type="button" role="tab" class="tb-tab" data-tb-tab="good">What good output looks like</button>
    <button type="button" role="tab" class="tb-tab" data-tb-tab="practice">Practice exercise</button>
    <button type="button" role="tab" class="tb-tab" data-tb-tab="plans">Free vs paid</button>
    <button type="button" role="tab" class="tb-tab" data-tb-tab="maximize">Maximize my subscription</button>
    <button type="button" role="tab" class="tb-tab" data-tb-tab="levelup">Level up</button>
    <button type="button" role="tab" class="tb-tab" data-tb-tab="fallback">If your plan doesn't have this</button>
    <button type="button" role="tab" class="tb-tab" data-tb-tab="system">System / project instructions</button>
    <button type="button" role="tab" class="tb-tab" data-tb-tab="memory">Memory &amp; preferences</button>
    <button type="button" role="tab" class="tb-tab" data-tb-tab="tools">Tool allowlist</button>
    <button type="button" role="tab" class="tb-tab" data-tb-tab="hitl">Approval gates</button>
    <button type="button" role="tab" class="tb-tab" data-tb-tab="evals">Eval checklist</button>
    <button type="button" role="tab" class="tb-tab" data-tb-tab="redteam">Red-team cases</button>
    <button type="button" role="tab" class="tb-tab" data-tb-tab="playbook">Repeat-run playbook</button>
    <button type="button" role="tab" class="tb-tab" data-tb-tab="trouble">Troubleshooting</button>
    <button type="button" role="tab" class="tb-tab" data-tb-tab="expert">Expert expansion</button>
    <button type="button" role="tab" class="tb-tab" data-tb-tab="json">Full JSON</button>
  </div>

  <div class="tb-panels">
    <div class="tb-panel" data-tb-panel="prompt" hidden>
      <div class="tb-copy-row"><button type="button" class="tb-btn tb-btn-copy" data-tb-copy="prompt">Copy</button></div>
      <pre id="tb-out-prompt"></pre>
    </div>
    <div class="tb-panel" data-tb-panel="setup" hidden>
      <div class="tb-copy-row"><button type="button" class="tb-btn tb-btn-copy" data-tb-copy="setup">Copy</button></div>
      <pre id="tb-out-setup"></pre>
    </div>
    <div class="tb-panel" data-tb-panel="providers" hidden>
      <div class="tb-copy-row"><button type="button" class="tb-btn tb-btn-copy" data-tb-copy="providers">Copy</button></div>
      <pre id="tb-out-providers"></pre>
    </div>
    <div class="tb-panel" data-tb-panel="learning" hidden>
      <div class="tb-copy-row"><button type="button" class="tb-btn tb-btn-copy" data-tb-copy="learning">Copy</button></div>
      <pre id="tb-out-learning"></pre>
    </div>
    <div class="tb-panel" data-tb-panel="good" hidden>
      <div class="tb-copy-row"><button type="button" class="tb-btn tb-btn-copy" data-tb-copy="good">Copy</button></div>
      <pre id="tb-out-good"></pre>
    </div>
    <div class="tb-panel" data-tb-panel="practice" hidden>
      <div class="tb-copy-row"><button type="button" class="tb-btn tb-btn-copy" data-tb-copy="practice">Copy</button></div>
      <pre id="tb-out-practice"></pre>
    </div>
    <div class="tb-panel" data-tb-panel="plans" hidden>
      <div class="tb-copy-row"><button type="button" class="tb-btn tb-btn-copy" data-tb-copy="plans">Copy</button></div>
      <pre id="tb-out-plans"></pre>
    </div>
    <div class="tb-panel" data-tb-panel="maximize" hidden>
      <div class="tb-copy-row"><button type="button" class="tb-btn tb-btn-copy" data-tb-copy="maximize">Copy</button></div>
      <pre id="tb-out-maximize"></pre>
    </div>
    <div class="tb-panel" data-tb-panel="expert" hidden>
      <div class="tb-copy-row"><button type="button" class="tb-btn tb-btn-copy" data-tb-copy="expert">Copy</button></div>
      <pre id="tb-out-expert"></pre>
    </div>
    <div class="tb-panel" data-tb-panel="levelup" hidden>
      <div class="tb-copy-row"><button type="button" class="tb-btn tb-btn-copy" data-tb-copy="levelup">Copy</button></div>
      <pre id="tb-out-levelup"></pre>
    </div>
    <div class="tb-panel" data-tb-panel="fallback" hidden>
      <div class="tb-copy-row"><button type="button" class="tb-btn tb-btn-copy" data-tb-copy="fallback">Copy</button></div>
      <pre id="tb-out-fallback"></pre>
    </div>
    <div class="tb-panel" data-tb-panel="system" hidden>
      <div class="tb-copy-row"><button type="button" class="tb-btn tb-btn-copy" data-tb-copy="system">Copy</button></div>
      <pre id="tb-out-system"></pre>
    </div>
    <div class="tb-panel" data-tb-panel="memory" hidden>
      <div class="tb-copy-row"><button type="button" class="tb-btn tb-btn-copy" data-tb-copy="memory">Copy</button></div>
      <pre id="tb-out-memory"></pre>
    </div>
    <div class="tb-panel" data-tb-panel="tools" hidden>
      <div class="tb-copy-row"><button type="button" class="tb-btn tb-btn-copy" data-tb-copy="tools">Copy</button></div>
      <pre id="tb-out-tools"></pre>
    </div>
    <div class="tb-panel" data-tb-panel="hitl" hidden>
      <div class="tb-copy-row"><button type="button" class="tb-btn tb-btn-copy" data-tb-copy="hitl">Copy</button></div>
      <pre id="tb-out-hitl"></pre>
    </div>
    <div class="tb-panel" data-tb-panel="evals" hidden>
      <div class="tb-copy-row"><button type="button" class="tb-btn tb-btn-copy" data-tb-copy="evals">Copy</button></div>
      <pre id="tb-out-evals"></pre>
    </div>
    <div class="tb-panel" data-tb-panel="redteam" hidden>
      <div class="tb-copy-row"><button type="button" class="tb-btn tb-btn-copy" data-tb-copy="redteam">Copy</button></div>
      <pre id="tb-out-redteam"></pre>
    </div>
    <div class="tb-panel" data-tb-panel="playbook" hidden>
      <div class="tb-copy-row"><button type="button" class="tb-btn tb-btn-copy" data-tb-copy="playbook">Copy</button></div>
      <pre id="tb-out-playbook"></pre>
    </div>
    <div class="tb-panel" data-tb-panel="trouble" hidden>
      <div class="tb-copy-row"><button type="button" class="tb-btn tb-btn-copy" data-tb-copy="trouble">Copy</button></div>
      <pre id="tb-out-trouble"></pre>
    </div>
    <div class="tb-panel" data-tb-panel="json" hidden>
      <div class="tb-copy-row"><button type="button" class="tb-btn tb-btn-copy" data-tb-copy="json">Copy</button></div>
      <pre id="tb-out-json"></pre>
    </div>
  </div>
</section>

</div>

## What the Task Builder gives you

For every task you describe, the Task Builder produces:

1. **Recommendation** — a one-paragraph plain-English suggestion, scoped to the AI app you already use.
2. **Prompt** — copy-paste-ready, with your constraints and preferences baked in.
3. **What to click** — exact step-by-step instructions for the surface you chose.
4. **Level up this workflow** — the next useful capability ladder for your app (saved prompt → Project → memory → custom assistant → skill → scheduled task → automation → agent).
5. **If your plan doesn't have this** — a fallback that works on a free or basic plan.
6. **System / project instructions** — the long-form persistent prompt for a Project / GPT / Gem.
7. **Memory and preferences** — a portable preference block you can reuse across tools.
8. **Tool allowlist** and **approval gates** — least-privilege guardrails.
9. **Eval checklist** and **red-team probes** — a starter set of tests.
10. **Repeat-run playbook** and **troubleshooting** — how to run this every time, and how to fix it when it breaks.
11. **Exportable JSON** — the whole thing, for backup or sharing.

## Privacy

- The form runs in your browser only. There are no network calls.
- Save Draft uses `localStorage` only. Nothing else is persisted.
- Disconnect your network and the Task Builder still works the same.

## Want a different surface?

Switch your **AI in section 1**, your **comfort level**, or **Mode** at the top — the output regenerates instantly.

## Where to go next

- [Mastery](../mastery/index.md) — beginner-to-expert tracks for each major AI.
- [Surface router](../surface-router/index.md) — the underlying decision matrix in long form.
- [Recipes](../recipes/index.md) — 45 worked examples you can clone.
- [Starter kits](../starter-kits.md) — copyable scaffolding (Developer Mode).
