# Mastery

> **Last verified:** 2026-05-06 · **Drift risk:** medium

Master the AI app you already have. Each track teaches **every major capability** of one provider, from the first chat to the last byte of API code, with a guided exercise at the end.

If you don't know which AI to pick, start with [Any AI tool](any-ai-tool.md) — the universal method works in almost any chat product.

## Pick your track

<div class="grid cards" markdown>

-   :material-chat-outline: **Universal Workbench**

    ---

    Interactive prompt lab, task picker, setups, toolkits, and fixer checklists configured for ChatGPT, Claude, Gemini, Grok, and Perplexity.

    [→ Open the Universal Workbench](universal-workbench.md)

-   :material-chat-outline: **Claude**

    ---

    The full beginner-to-expert Claude track lives on the standalone [Learn Claude](https://rkalani1.github.io/claude/) site. The in-repo page keeps the interactive workbench and quick-task prompts.

    [→ Learn Claude (standalone site)](https://rkalani1.github.io/claude/) · [→ Claude workbench](claude.md)

-   :material-chat-outline: **ChatGPT**

    ---

    Chat → Custom Instructions → Projects → Custom GPTs → Tasks → Codex (cloud) → Agents SDK.

    [→ ChatGPT mastery](chatgpt.md)

-   :material-chat-outline: **Gemini**

    ---

    Chat → Saved info → Workspace context → Gems → Deep Research → Antigravity → Gemini API.

    [→ Gemini mastery](gemini.md)

-   :material-chat-outline: **Grok**

    ---

    Consumer Grok → Grok on X → personas → xAI API (function calling, structured outputs).

    [→ Grok mastery](grok.md)

-   :material-code-tags: **Coding agents**

    ---

    Copilot Chat → Repository instructions → Copilot cloud agent → Claude Code → Codex CLI → Antigravity.

    [→ Coding agents mastery](coding-agents.md)

-   :material-help-circle-outline: **Any AI tool / I don't know**

    ---

    A universal method that works in almost any AI chat product, plus how to switch tools when you outgrow yours.

    [→ Any AI tool](any-ai-tool.md)

</div>

## How each track is structured

Every mastery page uses the same shape so you can compare across products:

1. **Beginner** — what to click, what to paste, how to tell whether it worked.
2. **Intermediate** — projects/workspaces, saved instructions, memory, files, native tasks.
3. **Advanced** — custom assistants, skills, shared workflows, evals, red-team checks, native automations.
4. **Expert** — coding agents, CLI, APIs, SDKs, MCP, observability, source drift, maintenance.
5. **Level up this workflow** — the exact next rung on the ladder.
6. **Guided exercise** — a small task that teaches the capability by doing.
7. **Free / subscription / API availability** — which features need which plan.
8. **Fallback** — what to do when a feature is missing from your plan.

## Capability matrix (rough comparison)

This is an opinionated, simplified comparison. Specifics drift; check the per-product mastery page for the current source-cited list.

| Capability | ChatGPT | Claude | Gemini | Grok | Copilot |
|---|---|---|---|---|---|
| Plain chat | ✓ | ✓ | ✓ | ✓ | ✓ (Copilot Chat) |
| Memory / saved instructions | ✓ | ✓ | ✓ | partial | repo-level (`copilot-instructions.md`) |
| Project / workspace | ✓ (Projects) | ✓ (Projects) | partial (Workspace context) | partial (Spaces) | the repo |
| Custom assistant | ✓ (Custom GPTs) | ✓ (Project + knowledge) | ✓ (Gems) | partial | partial (Extensions) |
| Skill / packaged behavior | GPT Action | ✓ Claude Skills (`SKILL.md`) | Gem + files | — | — |
| Native scheduled tasks | ✓ (Tasks, where available) | partial | partial (Advanced) | — | — |
| Coworker / agent mode | ✓ (where available) | ✓ Computer use (Desktop) | ✓ (where available) | partial | ✓ Copilot cloud agent |
| Coding agent | Codex (cloud) | Claude Code (CLI) | Antigravity / Gemini CLI | — | Copilot cloud agent |
| Browser/computer use | ✓ Atlas / agent (where available) | ✓ Computer use | partial | — | — |
| Developer / API | OpenAI API | Claude API | Gemini API | xAI API | GitHub Models |

## What the tracks teach in plain English

- **Chat is the floor.** Every product is good at it. Most people get 80% of the value from a good prompt.
- **Memory + a saved prompt** is the single biggest leverage step for non-developers.
- **Projects / Workspaces / Spaces / Gems** all do the same job: "this set of instructions and files belongs together."
- **Custom assistants** turn a project into a one-click thing you (and others) can launch.
- **Skills / Actions** let you teach the assistant a *specific procedure* with templates and resources.
- **Tasks / scheduled actions** automate the recurring parts. Manual-first.
- **Agent / coworker / computer-use modes** drive a real surface (browser / desktop). Sandbox them.
- **Coding agents** are the highest-leverage shape for code work and the fastest-changing.
- **APIs** are for when your idea outgrows the app. Most readers should not start here.

## When to switch tools

| You start with | Switch when… | Switch to… |
|---|---|---|
| ChatGPT | You want long live-document collaboration | Claude Projects + Artifacts |
| Claude | You want connectors to many SaaS apps | ChatGPT Projects |
| Gemini | You need long-form reasoning + Artifacts | Claude |
| Grok | You need structured outputs / programmatic agents | OpenAI / Gemini / Anthropic API |
| Copilot | Task is non-code | ChatGPT / Claude / Gemini |

The [Surface router](../surface-router/index.md) covers the underlying decision matrix in long form.

## Plan-availability shorthand

Throughout the tracks you'll see annotations like:

- **Free:** included in the free tier.
- **Sub:** included in the consumer paid plan.
- **Team / Ent:** team or enterprise plan.
- **API:** requires developer/API access.
- **Limited rollout:** announced and partially shipped; check the vendor.

If a feature is unavailable on your plan, every track ends with a **fallback** that works on a free or basic plan.
