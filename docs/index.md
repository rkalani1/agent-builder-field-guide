<div class="portal-hero" markdown="1">

# Agents and Automations

<p class="portal-lede">A practical, vendor-neutral portal for designing, configuring, testing, and operating AI agents and workflow automations across Claude, Gemini, ChatGPT/OpenAI, and adjacent surfaces.</p>

<div class="portal-actions" markdown="1">
[Open the Task Builder](task-builder/index.md){ .portal-primary }
[Start the learning path](learning-path/index.md){ .portal-secondary }
</div>

<ol class="workflow-ribbon" aria-label="Agent workflow">
  <li><span>01</span><strong>Task</strong><small>Name the outcome</small></li>
  <li><span>02</span><strong>Tool</strong><small>Choose the surface</small></li>
  <li><span>03</span><strong>Guardrails</strong><small>Bound actions</small></li>
  <li><span>04</span><strong>Test</strong><small>Probe failure</small></li>
  <li><span>05</span><strong>Operate</strong><small>Monitor + hand off</small></li>
</ol>

</div>

## Pick the right starting point

You do not need to read this site front to back. Start with the row that matches you.

<div class="starter-routes" markdown="1">

| If you are... | Do this first | You should have by the end |
|---|---|---|
| An absolute beginner | [Open the Task Builder](task-builder/index.md), leave **Beginner Mode** on, and describe one real task. | A prompt to paste, exact clicks, and a safe fallback using the AI app you already have. |
| Learning Claude specifically | Open the standalone [Learn Claude](https://rkalani1.github.io/claude/) guide; use the in-repo [Claude workbench](mastery/claude.md) for quick-task prompts. | Account instructions, one Project, a reusable prompt kit, and a safe path to Skills, connectors, and Claude Code. |
| Trying to get more value from one subscription | Run the [7-mission learning path](learning-path/index.md). | A portable AI profile, reusable prompt, Project/Gem/Space, citation habit, and evaluation routine. |
| Choosing between ChatGPT, Claude, Gemini, Grok, Perplexity, or Copilot | Use the [Capability map](capability-map/index.md) and [Mastery hub](mastery/index.md). | A deliberate tool choice for each recurring workflow instead of defaulting to whichever tab is open. |
| Building a real agent or coding workflow | Start with [Agent Factory](agent-factory/index.md), [Evals & safety](evals/index.md), and [Starter kits](starter-kits.md). | A scoped agent spec, tool allowlist, eval set, red-team probes, and launch checklist. |
| Responsible for a team or sensitive data | Read [Team path](start-here/team-path.md), [Safety baseline](start-here/safety-baseline.md), and [Human-in-the-loop](safety/hitl.md). | A permission model, review gates, data boundaries, and off-switch before any automation runs. |

</div>

<div class="grid cards" markdown>

-   :material-tools: **Start the Task Builder**

    ---

    Describe a task. Pick the AI app you already use. Get a recommended workflow, a copy-paste prompt, exact "what to click" steps, a level-up ladder, and a fallback if your plan doesn't have a feature.

    [→ Open the Task Builder](task-builder/index.md)

-   :material-school: **Claude**

    ---

    Step-by-step Claude setup for beginners, then Projects, memory, Artifacts, Skills, connectors, Claude Code, and expert reliability habits — on the standalone Learn Claude site.

    [→ Learn Claude (standalone site)](https://rkalani1.github.io/claude/) · [→ In-repo workbench](mastery/claude.md)

-   :material-flag-checkered: **Try the 7-mission learning path**

    ---

    Seven 30-minute missions that take any AI subscription from "I have it" to "I'm getting full value." Works for ChatGPT, Claude, Gemini, Grok, Perplexity, Copilot, or anything else.

    [→ Start the learning path](learning-path/index.md)

-   :material-school: **Master the AI you already have**

    ---

    Beginner-to-expert tracks for ChatGPT, Claude, Gemini, Grok, Perplexity, GitHub Copilot, and any other AI chat. Each track ends with a guided exercise.

    [→ Open Mastery](mastery/index.md)

-   :material-table: **Capability map**

    ---

    Cross-product comparison: chat / projects / memory / files / custom assistants / skills / scheduled actions / agents / coding agents / API. Plan-availability tags and fallbacks per cell.

    [→ Open the capability map](capability-map/index.md)

-   :material-clock-outline: **No-code automations**

    ---

    Native scheduled actions in ChatGPT, Claude Cowork, and Gemini — plus the universal calendar-reminder fallback for everyone else. Manual-first; safety-first.

    [→ Open the automation guide](no-code-automations/index.md)

-   :material-brain: **Memory & preferences**

    ---

    A portable AI profile you can paste into any tool. Templates for global memory, project memory, and the conversations you'll have with your AI about its own memory.

    [→ Open the memory guide](preferences-memory/index.md)

-   :material-lightbulb: **Beginner examples**

    ---

    Thirteen guided workflows you can copy today: difficult email, meeting prep, study plan, trip plan, weekly report, research, custom assistants, scheduled tasks, and more.

    [→ Browse examples](examples/index.md)

-   :material-compare: **Compare AI surfaces**

    ---

    Chat vs. Project vs. Custom GPT/Gem vs. Copilot/coding agent vs. Skill vs. Automation vs. Agent. A decision matrix that maps your task to the right shape.

    [→ Open the surface router](surface-router/index.md)

-   :material-book-open-variant: **Browse recipes**

    ---

    45 complete agent recipes, each with a job statement, prompt, tool allowlist, evals, red-team probes, and a safe-launch checklist.

    [→ Browse the recipe library](recipes/index.md)

-   :material-package-variant: **Download starter kits**

    ---

    Nine copyable kits — universal spec, Claude Code, Codex, Gemini Antigravity, OpenAI Agents SDK (Python + TS), MCP server (Python + TS), local script.

    [→ See starter kits](starter-kits.md)

</div>

## Three example outputs from the Task Builder

These are real shapes the Task Builder produces. Click any to jump to a worked example.

### Weekly research summary

> **Input:** "Every Monday I want a one-page summary of the past week's newly-deposited preprints in my field, with three highlighted papers and questions for journal club. I have ChatGPT and Claude. Inputs come from a folder of PDFs I save during the week. Output goes to my Obsidian vault. Manual run only."

The Task Builder routes this to a **Project** (ChatGPT or Claude) plus a **prompt** plus a **manual playbook** — not an agent, not a scheduler.

It produces: a system prompt, a Project description, a memory/preferences block ("MIND-diet research, NEJM citation style, no full-text reproduction"), an output schema, a 5-case eval set, three red-team probes (e.g., "what if a PDF is image-only?"), and a Monday playbook with the exact 60-second steps.

[→ See this output as a worked recipe: Literature triage](recipes/literature-triage.md)

### Repository maintenance

> **Input:** "Keep `my-org/my-repo` healthy: dependency updates, lint fixes, and tiny refactors that pass CI. I have Claude Code and GitHub Copilot. Anything that opens a PR has to be reviewed by a human."

The Task Builder routes this to a **coding agent** workflow (Claude Code locally for the dev loop, GitHub Copilot cloud agent for hands-off PRs), with a **CLAUDE.md** / **AGENTS.md** scaffold, an **HITL gate** that forbids `git push` to `main`, an eval set ("PR diff is small," "tests pass," "no new dependencies without review"), and a maintenance cadence.

[→ See this output as a worked recipe: Repo maintenance](recipes/repo-maintenance.md)

### Email and calendar triage

> **Input:** "First-thing-in-the-morning brief: triage overnight email into Now/Later/Reference/Trash, and write a one-paragraph prep note for each meeting today. Connectors: Gmail and Calendar via ChatGPT. Drafts only, never send."

The Task Builder routes this to a **Project + connectors** (read-only) plus a **draft-only refusal block** so the agent never sends a reply on your behalf. It produces a system prompt, a connector permission spec, an eval set with at least one ambiguous "is this Now or Later?" case, and three red-team probes (prompt injection from email body, calendar invite spoofing, forward-this-to-X attempts).

[→ See worked recipes: Email triage](recipes/email-triage.md) and [Calendar meeting prep](recipes/calendar-meeting-prep.md)

## What's inside

<div class="grid cards" markdown>

-   :material-rocket-launch: **Start Here**

    Decide *whether* to build an agent at all, then pick a setup path.

    [→ Start Here](start-here/index.md)

-   :material-tools: **Platforms**

    Setup guides for Claude, Gemini, ChatGPT, Grok, Codex, Copilot, MCP, and more.

    [→ Platforms](platforms/index.md)

-   :material-flash: **Quickstarts**

    Five end-to-end recipes you can finish in 30–60 minutes.

    [→ Quickstarts](quickstarts/index.md)

-   :material-power-plug: **MCP & connectors**

    Concepts, installing servers, writing your own server, security.

    [→ MCP](mcp/index.md)

-   :material-cursor-default-click: **Browser & computer use**

    Anthropic, OpenAI, the `browser-use` library, and operating boundaries.

    [→ Browser & computer use](browser-use/index.md)

-   :material-graph: **Orchestration**

    Single-agent loops, multi-agent patterns, local-first, state and memory.

    [→ Orchestration](orchestration/index.md)

-   :material-shield-check: **Evaluation & safety**

    Eval sets, red-team workflows, safety checklists, HITL, incident response.

    [→ Evals & safety](evals/index.md)

-   :material-factory: **Agent Factory**

    A repeatable workflow to design, rank, build, eval, port, and launch agents.

    [→ Agent Factory](agent-factory/index.md)

-   :material-file-document-multiple: **Templates**

    Reusable agent specs, prompts, eval rubrics, safety checklists, PRDs.

    [→ Templates](template-library/index.md)

-   :material-book-open-variant: **Reference**

    Glossary, model freshness, source map, source audit, roadmap, decision records.

    [→ Glossary](glossary.md)

</div>

## Boundaries this guide enforces

- **No real secrets in any example.** All API keys, tokens, and personal info are placeholders.
- **No background automations or schedulers run by default.** Every cron / launchd / Task Scheduler example is opt-in and marked as such ([ADR 0003](decision-records/0003-no-default-schedulers.md)).
- **No tracking, analytics, or telemetry on this site.** The Task Builder runs entirely in your browser; nothing leaves your machine.
- **Every product page is dated and sourced.** Specific model names, prices, and rate limits drift fast — see [Model freshness](model-freshness.md).

## License

[MIT](https://github.com/rkalani1/agents-automations/blob/main/LICENSE). All trademarks belong to their respective owners. This guide is independent and is not endorsed by Anthropic, OpenAI, Google, xAI, GitHub, or Microsoft.
