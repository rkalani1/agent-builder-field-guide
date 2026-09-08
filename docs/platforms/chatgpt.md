# ChatGPT Projects

> **Last verified:** 2026-05-06 · **Drift risk:** high · **Partially re-verified:** 2026-07-18
> **Official sources:** [Projects in ChatGPT](https://help.openai.com/en/articles/10169521-projects-in-chatgpt), [Creating and editing GPTs](https://help.openai.com/en/articles/8554397)

---

## What this surface is

ChatGPT Projects are persistent workspaces inside chatgpt.com that group related conversations, uploaded reference files, and custom instructions under a single named container. The model draws on all of that context across every new chat you start inside the project.

Projects are not the same as Custom GPTs. A Custom GPT is a separately published assistant that any ChatGPT user (within your visibility setting) can open from the GPT Store or a direct link. A Project is a private or team workspace tied to your account — it accumulates context over time and is built for ongoing, evolving work rather than a fixed, reusable tool. The [official FAQ](https://help.openai.com/en/articles/10169521-projects-in-chatgpt) draws the distinction in similar terms: GPTs are static, expert-curated, and discoverable, while a Project acts as a live context hub for ongoing shared work around a topic (the article's exact wording changes as it is revised).

---

## Who it is best for

- Researchers who return to the same topic weekly and want the model to remember prior summaries, documents, and terminology decisions.
- Writers and analysts maintaining a long-running body of work where tone and vocabulary matter.
- Teams on any plan that need a shared reference space without standing up custom infrastructure (collaborator and file limits are higher on paid tiers).
- Anyone who wants the equivalent of a persistent system prompt without API access.

---

## Prerequisites

- A ChatGPT account (any plan, including Free).
- Files to upload must be in a supported format: PDF, DOCX, spreadsheet, image, plain text, or code files. See the [help article](https://help.openai.com/en/articles/10169521-projects-in-chatgpt) for the current list.
- For shared projects: available on all plans, including Free, per OpenAI's October 2025 rollout announcement; collaborator and file limits vary by plan — see the [Projects help article](https://help.openai.com/en/articles/10169521-projects-in-chatgpt) for current limits.

---

## Step-by-step setup

1. Log in at [chatgpt.com](https://chatgpt.com).
2. In the left sidebar, click **New project**.
3. Give the project a name. Pick an icon and color — these appear in the sidebar and help you switch projects quickly.
4. The project opens to an empty chat. To add files, locate the **Sources** or **Add source** area in the project panel (the exact label may vary — this area is fast-moving; verify in the app).
5. Click **Add source** and upload your reference files. Files are available to all future chats in this project. Per-plan file limits are: Free = 5 files, Plus/Go = 25 files, Pro/Business/Enterprise/Edu = 40 files. Only 10 files can be uploaded simultaneously.
6. To add project instructions, click the three-dot menu on the project header and select **Project settings**. Enter plain-language instructions in the text box.
7. Start a new chat inside the project. The model will follow your project instructions and have access to uploaded files.

### Optional: connect external sources

You can paste a Google Drive file/folder link or a Slack channel link into the Sources area to add live context. You will be prompted to connect and approve the app. Whether connected-app content is synced in advance for retrieval (as opposed to searched on demand) has changed over time and appears to depend on plan and workspace configuration — check the [Projects help article](https://help.openai.com/en/articles/10169521-projects-in-chatgpt) and verify current behavior in the app. Connector/integration availability is fast-moving.

### Move existing chats into the project

From the chat list, drag a chat onto the project name in the sidebar, or open the chat's three-dot menu and choose **Move to project**. Moved chats inherit the project's instructions and file context.

---

## Building your first useful agent: a clinical-evidence-summary project

The following example uses entirely synthetic content. No real patient data, real trial IDs, or real medical recommendations appear here.

**Scenario:** You review cardiovascular literature and want a project that always formats summaries the same way and remembers which therapy classes you have already reviewed.

**Step 1 — Write project instructions.**

```
You are a structured medical literature assistant.

When given an abstract or a set of abstracts:
1. Extract: Study design, population (synthetic/placeholder), primary endpoint, key result, statistical significance (p-value or CI), and stated limitations.
2. Format output as a Markdown table with those six columns.
3. After the table, write a one-paragraph plain-language synthesis.
4. Flag any conflicts of interest disclosed in the abstract.
5. Do not make clinical recommendations.

Therapy classes already reviewed: ACE inhibitors, ARBs. Do not repeat background on those unless asked.
```

Paste this into **Project settings > Project instructions**.

**Step 2 — Upload a reference file.**

Create a plain-text file called `terminology.txt` with your internal terminology conventions (synthetic example):

```
MACE = Major Adverse Cardiovascular Event (composite: CV death, MI, stroke)
HFrEF = Heart failure with reduced ejection fraction (LVEF < 40%)
```

Upload this file to the project Sources.

**Step 3 — Test the project.**

Open a new chat inside the project. Paste a synthetic abstract:

```
ABSTRACT (SYNTHETIC — NOT REAL DATA)
Study: SYNTH-CARDIO-01. RCT, n=400. Population: adults aged 55-75 with HFrEF.
Intervention: PlaceholderDrug 10mg vs placebo. Duration: 24 months.
Primary endpoint: MACE. Result: HR 0.78 (95% CI 0.61–0.99), p=0.04.
Limitations: single-center, short follow-up. No COI disclosed.
```

The model should return a six-column table and a synthesis paragraph. It will use the `terminology.txt` file to expand MACE and HFrEF correctly without you restating those definitions.

---

## Customization: instructions, files, and memory

### Instructions

Project instructions override your global Custom Instructions for any chat inside the project. You can be specific about format, vocabulary, and scope. Effective instructions:

- Use positive directives ("Format output as a table") rather than only prohibitions.
- Include worked examples of the desired output format directly in the instructions text.
- State explicitly what the model should not do (e.g., "Do not make clinical recommendations").

### Files

Files act as reference material, not behavioral rules. Rules and tone go in instructions; background documents and lookup tables go in files. According to the [docs](https://help.openai.com/en/articles/10169521-projects-in-chatgpt), prefer "clear, text-forward files" — complex layouts are harder for the model to use reliably.

### Memory

When you create a new project you can choose between **project-only memory** and **default memory**. Project-only memory restricts the model to context within that project. Once you share a project with others, memory is automatically set to project-only and cannot be reverted. For Enterprise and Edu plans, cross-project reference is also restricted — chats inside a project cannot access conversations from other projects or from general ChatGPT, regardless of memory setting.

---

## Limits and gotchas

- **File count caps are per-project.** If you hit the limit, the [docs](https://help.openai.com/en/articles/10169521-projects-in-chatgpt) recommend removing older files, combining data, or splitting work across multiple projects.
- **Project instructions override global Custom Instructions.** This is intentional, but it means you may need to copy relevant global instructions into each project.
- **Project-only memory cannot be set retroactively.** If you created a project before this feature existed, you cannot switch it — you need to create a new project and move conversations.
- **Deleting a project is permanent and immediate for all members.** "This permanently deletes all files, chats, and instructions in that project and cannot be undone," per the [docs](https://help.openai.com/en/articles/10169521-projects-in-chatgpt). Export or copy anything you want to keep before deletion.
- **App connectors are fast-moving.** The set of supported connector apps changes frequently. Always verify current state in the app rather than relying on this guide.
- **Rate limits follow plan tier.** There is no separate rate limit for project chats; they consume from your plan's message quota the same as ordinary chats.
- **Training data:** For Free, Go, Plus, and Pro accounts, project content may be used for model training if "Improve the model for everyone" is enabled. Business, Enterprise, and Edu accounts are excluded from training by default.

---

## Confirmed by docs vs. practical inference

| Claim | Source |
|---|---|
| File limits by plan (5 / 25 / 40) | [Confirmed — official docs](https://help.openai.com/en/articles/10169521-projects-in-chatgpt) |
| Project instructions override global Custom Instructions | [Confirmed — official docs](https://help.openai.com/en/articles/10169521-projects-in-chatgpt) |
| Sharing sets memory to project-only permanently | [Confirmed — official docs](https://help.openai.com/en/articles/10169521-projects-in-chatgpt) |
| Connected-app sync behavior inside projects | **Not re-verified** — the help article has been revised since 2026-05-06 and sync behavior may have changed; verify in the app and the help article |
| Model performance on structured table extraction from abstracts | **Practical inference** — not specifically documented; results vary by model and abstract quality |
| Terminology file reliably expands abbreviations | **Practical inference** — the model uses uploaded files, but retrieval accuracy for specific short strings is not guaranteed |

---

## Cost and rate-limit notes

Projects do not cost extra beyond your plan subscription. Credits and usage charges for individual model calls or tool use (e.g., image generation, deep research) apply inside project chats at the same rate as outside them. Usage counts against your plan's message quota. Users on the Free plan will hit message limits faster if they run complex multi-turn workflows inside a project.

---

## Where to go next in this guide

- If you want to publish a reusable assistant that others can open from a link or the GPT Store, see [Custom GPTs](custom-gpts.md).
- If you need programmatic control, multi-step automation, or want to call external services reliably, see [OpenAI API and Agents SDK](openai-api.md).
- For running an agent locally from a terminal inside a code repository, see [Codex CLI](codex.md).
