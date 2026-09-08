# Gemini App

> **Last verified:** 2026-05-06 · **Drift risk:** medium · **Partially re-verified:** 2026-07-18
> **Official sources:** [gemini.google.com](https://gemini.google.com), [Create and use Gems](https://support.google.com/gemini/answer/15146780?hl=en), [Tips for writing Gem instructions](https://support.google.com/gemini/answer/15235603?hl=en)

---

## What This Surface Is

Gemini App is Google's consumer-facing AI interface at [gemini.google.com](https://gemini.google.com). It provides conversational access to Google's Gemini models and includes several features that matter for agent-style workflows:

- **Gems**: saved custom personas with persistent system-level instructions and optional file attachments. Each Gem is effectively a named configuration of Gemini with a specific role, tone, and knowledge base.
- **Workspace integration**: connect Google Drive, Gmail, Docs, and other Workspace apps to give Gemini access to your data.
- **Google Search grounding**: Gemini can search the web during a conversation and cite sources.
- **Memory (Saved Info)**: Gemini can remember personal facts and preferences across conversations.
- **Scheduled actions**: recurring or one-time prompts that Gemini runs automatically at a set time (per the [Scheduled actions help article](https://support.google.com/gemini/answer/16316416); plan-tier availability varies — verify there).
- **Deep Research**: an agentic multi-step research mode that browses, synthesizes, and cites sources (per the [Deep Research help article](https://support.google.com/gemini/answer/15719111)).

The web app is accessible with a personal Google account. A Google AI Pro or Google AI Ultra subscription (the plan family that, per Google's plan pages as of mid-2026, replaced the earlier Google One AI Premium branding) or a Google Workspace subscription unlocks higher-tier models and additional features.

---

## Who It Is Best For

- Google Workspace users who want an AI assistant that can read their Drive files, emails, and calendar
- People who want to create reusable AI personas (Gems) without writing any code
- Researchers and analysts who need web-grounded responses
- Teams on Google Workspace who want to build and share specialized Gems with colleagues

---

## Prerequisites

- A Google account (personal Gmail or Google Workspace)
- Access to [gemini.google.com](https://gemini.google.com) in a supported browser
- For advanced models and full Workspace integration: a Google AI Pro or Google AI Ultra subscription, or a qualifying Google Workspace plan
- For Gems: no additional prerequisites beyond a standard account, though Gem sharing requires Workspace

---

## Step-by-Step Setup

### 1. Sign in

Go to [gemini.google.com](https://gemini.google.com) and sign in with your Google account. You will land on the main chat interface.

### 2. Connect Google Workspace (optional but useful)

To let Gemini read your Drive files, Docs, and Gmail:

1. Click the **+** icon or the Google apps icon in the chat interface.
2. Select **Google Drive**, **Gmail**, or another Workspace service.
3. Follow the OAuth flow to grant access.

Once connected, you can reference your documents in conversation by typing `@` and selecting a file or folder.

### 3. Create a Gem

Per the [Google support article on Gems](https://support.google.com/gemini/answer/15146780?hl=en):

1. Go to [gemini.google.com](https://gemini.google.com).
2. In the left sidebar, click **Explore Gems**.
3. Click **New Gem**.
4. Enter a name for your Gem.
5. Write instructions in the text field. (Instructions are strongly recommended—a Gem without them behaves like the default Gemini.)
6. Optionally upload files under the **Knowledge** section: click **Add files**, then choose **Upload files** or **Drive**.
7. Use the preview panel on the right to test prompts before saving.
8. Click **Save**.

After saving, the Gem appears in your Gems list. To edit it later: click **Explore Gems**, find your Gem under **Your Gems**, click **View**, make edits, and click **Update**.

### 4. Start a conversation with a Gem

1. Click **Explore Gems** in the left sidebar.
2. Select the Gem you want to use.
3. Type in the text box as you would in any conversation. The Gem's instructions are active from the first message.

---

## Building Your First Useful Agent: A Research-Summary Gem

This worked example creates a Gem that takes a collection of research abstracts or articles and produces a structured summary with explicit format constraints.

### Gem name

`Research Summarizer`

### Instructions

```
You are a research synthesis assistant. Your job is to read academic abstracts,
articles, or reports and produce structured summaries.

For each piece of text I share, produce exactly this format:

**Source**: [title and author if identifiable, or "user-provided text"]
**Main argument**: One sentence.
**Evidence type**: Observational / experimental / review / theoretical / other.
**Key findings**: Three to five bullet points. Prefer specific numbers and
effect sizes over vague descriptions.
**Caveats**: One to two sentences on stated limitations or gaps.
**Relevance score**: Rate 1–5 for relevance to a systematic review on
[TOPIC PLACEHOLDER—replace when you use the Gem].

Rules:
- Do not add commentary outside this format unless I ask.
- If a finding is not supported by the text I provide, say "not in source."
- Do not fabricate citations.
- Use plain language in the bullet points; avoid jargon unless quoting directly.
```

### Testing in the preview panel

Before saving, paste a short abstract into the preview panel and verify the Gem follows the format exactly. Adjust the instructions until the output is consistent.

### Using the Gem

Open the Gem, replace `[TOPIC PLACEHOLDER]` in your first message with your actual review topic, then paste abstracts one at a time or in batches:

```
Topic: urban heat island mitigation strategies in mid-size cities.

[Paste abstract here]
```

Gemini will return the structured summary. You can then paste the next abstract without repeating the topic.

---

## Customization

### Instruction structure

Google's own guidance ([tips for writing Gem instructions](https://support.google.com/gemini/answer/15235603?hl=en)) recommends covering four areas:

- **Persona**: what role Gemini should play
- **Task**: what it should do or create
- **Context**: background information it needs
- **Format**: the structure of its responses

You can also ask Gemini to expand a short description into full instructions using the **Use Gemini to re-write instructions** button in the Gem editor. This is useful if you have a vague idea but struggle to articulate it in detail.

### Uploading reference files

Gems support uploaded files as a knowledge base. Files uploaded via **Upload files** come from your local machine. Files via **Drive** are pulled from Google Drive and stay in sync—if you update the Drive file, the Gem reflects the newer version automatically.

You can add up to 10 reference files per Gem (as of the time this was written—verify current limits at [support.google.com/gemini](https://support.google.com/gemini)).

### Sharing Gems (Workspace accounts)

Gems can be shared with other users in your organization or externally. Sharing is powered by the same infrastructure as Google Drive sharing—you control who can view, edit, or make a copy. This feature was introduced in late 2025 per [Google Workspace updates](https://workspaceupdates.googleblog.com).

---

## Limits and Gotchas

- **Gem feature has changed and continues to change.** Gems were introduced in 2024 and the interface, available plan tiers, and specific capabilities have shifted multiple times. Steps in this guide are based on the support documentation current as of 2026-05-06. Re-verify at [support.google.com/gemini](https://support.google.com/gemini) before writing internal documentation or tutorials. This is labeled as a known drift risk.
- **Preview window does not auto-save.** Per the [Gems support article](https://support.google.com/gemini/answer/15146780?hl=en), using the preview window does not automatically save your Gem. You must click **Save** explicitly.
- **Free tier limitations.** Personal Google accounts have access to Gems, but advanced model options (such as Gemini 3.1 Pro) may be restricted to paid tiers. The exact feature boundary changes with each model release.
- **Workspace data integration requires explicit connection.** Connecting Drive or Gmail is an opt-in step. Gemini does not access your Workspace data without authorization.
- **Memory (Saved Info) is separate from Gem instructions.** Saved Info applies across all your Gemini conversations, while Gem instructions apply only within that Gem's conversations. If you want per-Gem context, put it in the Gem instructions, not in Saved Info.
- **Gems are personal by default.** On a personal Google account, Gems you create are not visible to other users unless you share them. Sharing requires Workspace.
- **Gemini may indicate when it draws from memory.** Per Google's design philosophy, Gemini flags when it is using Saved Info, keeping users aware of personalization in use.

---

## Confirmed by Docs vs. Practical Inference

| Claim | Status |
|-------|--------|
| Gem creation steps (Explore Gems > New Gem > name > instructions > save) | Confirmed by [Google support article](https://support.google.com/gemini/answer/15146780?hl=en) |
| Preview window does not auto-save | Confirmed explicitly in support article |
| Up to 10 reference files per Gem | Confirmed by third-party documentation drawing from Google guidance; verify current limit at support.google.com |
| Gem sharing via Drive-like interface | Confirmed by [Google Workspace Updates blog post](https://workspaceupdates.googleblog.com/2025/09/gem-sharing-gemini-app-workspace.html) (September 2025) |
| Drive files stay in sync when updated | Confirmed by support article: "Gemini will use the most recent version of the file" |
| Instruction categories: Persona, Task, Context, Format | Confirmed by [Gems tips support article](https://support.google.com/gemini/answer/15235603?hl=en) |
| Advanced models restricted to paid tiers | Practical inference based on Google's published model availability; verify at gemini.google.com |
| Paid tiers named Google AI Pro / Google AI Ultra (Google One AI Premium retired) | Official plan pages surfaced via search 2026-07-18 (support.google.com, gemini.google/subscriptions); pages not directly re-fetched — verify before relying on plan names |
| Scheduled actions feature (recurring/scheduled prompts) | Official [help article](https://support.google.com/gemini/answer/16316416) tracked in this guide's source map; not directly re-fetched 2026-07-18 — verify tier availability there |
| Deep Research feature (multi-step agentic research) | Official [help article](https://support.google.com/gemini/answer/15719111) surfaced via search 2026-07-18; not directly re-fetched — verify details there |

---

## Cost and Rate-Limit Notes

The Gemini App is free to use with a personal Google account, with access to standard Gemini models. Higher-tier models require a Google AI Pro or Google AI Ultra subscription (as of mid-2026 official plan pages; these plans replaced the earlier Google One AI Premium branding). Google Workspace plans include Gemini access at varying levels depending on the tier. Rate limits exist at the free tier; heavy usage may result in temporary throttling. Specific pricing is not listed here—check [gemini.google/subscriptions](https://gemini.google/subscriptions), [one.google.com](https://one.google.com), and [workspace.google.com](https://workspace.google.com) for current plans.

---

## Where to Go Next

- [Google AI Studio](ai-studio.md) — for API-level access, structured output, and programmatic use of Gemini
- [Gemini CLI](gemini-cli.md) — for a terminal-based agent workflow using the same underlying models
- [Claude Projects](claude-projects.md) — for the Anthropic equivalent of Gems (persistent instructions and file context)
