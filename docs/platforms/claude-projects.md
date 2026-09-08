# Claude Projects

> **Last verified:** 2026-05-06 · **Drift risk:** high · **Partially re-verified:** 2026-07-18
> **Official sources:** [Claude.ai](https://claude.ai), [What are projects?](https://support.claude.com/en/articles/9517075-what-are-projects), [How can I create and manage projects?](https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects)

---

## What This Surface Is

Claude Projects is a feature of the Claude apps—the claude.ai web interface, and per the help center also the desktop and mobile apps—that lets you create named workspaces with persistent context. A Project stores:

- A system prompt (called "custom instructions" or "project instructions") that applies to every conversation opened within it
- Uploaded files and documents that Claude can reference in any conversation in the project
- The conversation history for all chats belonging to that project

The problem Projects solves is repetition. Without a project, every new conversation starts with a blank slate—you re-explain your role, your preferred output format, and any relevant background documents each time. A project makes that context persistent. You write it once and it applies automatically.

Projects store their context in the cloud—accessible from the web, desktop, and mobile apps—rather than on your local disk. They do not interact with local files, shell commands, or external tools unless you have connectors enabled. For local file access, see [Claude Desktop](claude-desktop.md). For terminal-based coding workflows, see [Claude Code](claude-code.md).

---

## Who It Is Best For

- Writers, researchers, and analysts who need Claude to maintain a consistent persona and format across many sessions
- Teams collaborating on a domain-specific task (legal review, literature synthesis, customer support drafting) who want shared context
- Anyone who writes the same preamble at the start of every conversation

---

## Prerequisites

- A Claude account. Per the help center as of mid-2026, Projects are available to all users, including Free accounts—with Free users capped at five projects. Verify the current cap against [What are projects?](https://support.claude.com/en/articles/9517075-what-are-projects) and [How can I create and manage projects?](https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects).
- Files you want to attach should be in formats Claude can read: PDF, text, Markdown, Word documents, and common code file types.

---

## Step-by-Step Setup

### 1. Create a project

1. Log in at [claude.ai](https://claude.ai).
2. In the left sidebar, click **New Project** (or the **+** icon next to Projects).
3. Give the project a descriptive name. The name is for your own reference and does not appear in Claude's context.

### 2. Write project instructions

After creating the project, open its settings by clicking on the project name and then finding the **Instructions** or **Custom Instructions** panel.

Write the system prompt for this project. This text is prepended to every conversation you have within the project. Good project instructions describe:

- Claude's role and persona for this context
- What kinds of requests it should prioritize and how to handle them
- The expected output format (length, structure, tone)
- Any explicit refusal or constraint behavior

### 3. Attach files

Still in the project settings, upload reference files under the **Knowledge** or **Files** section. These files are available as context in any conversation within the project. Claude can read and quote from them but cannot modify them.

Supported attachments include PDFs, Word documents, plain text files, spreadsheets, and code files. There are per-project file count and size limits that vary by plan—check current limits at [claude.ai](https://claude.ai).

### 4. Open a conversation within the project

Click into the project and start a **New Chat**. This conversation inherits the project instructions and has access to the attached files. The instructions you wrote are active from the first message.

---

## Building Your First Useful Agent: A Literature Review Assistant

This worked example creates a project for synthesizing academic literature on a research topic. The goal is an assistant that reads paper abstracts, extracts key claims, and formats them consistently.

### Project instructions: three sample blocks

**Block 1 — General persona**

```
You are a rigorous research assistant helping with a systematic literature review on
climate adaptation in urban agriculture. You have graduate-level familiarity with
ecology, food systems, and climate science. You are not a domain expert on any
specific city or crop—apply general scientific reasoning and flag when you are
uncertain. Always distinguish between findings you derive from the attached
documents and claims you generate from general knowledge.
```

**Block 2 — Output format**

```
For each paper or abstract I share, produce a structured summary using exactly
this format:

**Citation**: [author, year, title]
**Core claim**: One sentence.
**Methods**: Two to three sentences describing study design, data sources,
and geographic scope.
**Key findings**: Three to five bullet points. Each bullet should include a
specific quantitative result if one is reported.
**Limitations**: One to two sentences.
**Relevance to review**: One sentence explaining how this paper contributes
to the systematic review topic.

Do not add commentary outside this structure unless I explicitly ask.
```

**Block 3 — Refusal behavior**

```
If I ask you to make claims about papers that are not in the attached files or
in the conversation, tell me that you cannot verify the source and offer to
search within the attached documents instead. Do not fabricate citations or
fill in missing bibliographic details. If a paper abstract is ambiguous about
methods or scope, say so rather than guessing.
```

### Attaching files

Upload two or three representative PDF abstracts (or full papers, depending on plan limits). In any conversation in this project, you can then ask:

```
Summarize all the attached papers using the standard format.
```

Or:

```
Which of the attached papers discuss rooftop gardens specifically?
```

Claude will search across all uploaded files and return structured responses.

---

## Customization

### Iterating on instructions

Project instructions are editable at any time. If you notice Claude consistently misformatting outputs or missing a constraint, update the instructions—new conversations will reflect the change. Existing conversations within the project continue to use the instructions that were active when they started.

### Combining instructions blocks

There is no enforced structure for the instructions field. Writing them in clearly labeled blocks (as above) makes them easier to maintain and debug. If Claude is not following a rule, isolating which block the rule lives in helps you pinpoint the issue.

### Sharing projects (Team and Enterprise)

On Team and Enterprise plans, projects can be shared with other team members. Shared project conversations are private by default—content generated with connectors active cannot be shared externally. Owners control which connectors are enabled at the organization level.

---

## Limits and Gotchas

- **Projects are not the same as CLAUDE.md.** Claude Code uses a `CLAUDE.md` file at the root of a repository to set project-level instructions for terminal sessions. Claude Projects store instructions in the cloud and apply them to conversations in the Claude apps. They serve similar purposes but are entirely separate mechanisms.
- **File context has limits, but large knowledge bases no longer simply overflow.** Small project knowledge bases load directly into Claude's context window. Per the help center's [RAG for projects article](https://support.claude.com/en/articles/11473015-retrieval-augmented-generation-rag-for-projects) (as of mid-2026), when project knowledge approaches the context limit, Claude automatically enables a retrieval (RAG) mode that expands the project's knowledge capacity by up to roughly 10x, searching your files rather than loading them all at once. This applies to uploaded project knowledge only—conversation history still occupies the context window, so very long chats can still crowd out material mid-conversation.
- **Instructions are prepended, not enforced.** Claude follows project instructions as a strong prior, not a hard constraint. A user can explicitly override them in conversation. If you need stricter enforcement, consider using the API with a system prompt in a controlled application rather than a public-facing project.
- **Free plan cap.** Projects are available on the Free plan, but capped: per the help center as of mid-2026, free users can create at most five projects. Verify the current cap against [How can I create and manage projects?](https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects).
- **File updates are not automatic.** If you update an attached document, you need to re-upload it to the project. Claude does not poll for changes to files you previously uploaded.
- **Conversations within a project share file context; cross-chat memory depends on plan and settings.** Each chat in the project is a separate conversation. Per the help center's [chat search and memory article](https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context) (as of mid-2026), paid plans with chat search and memory enabled let Claude reference past conversations, and memory is scoped per project—each project has its own separate memory space and dedicated project summary. With memory off, or on plans without it, chats remain isolated and Claude cannot read previous chats unless you explicitly paste their content into the current conversation.

---

## Confirmed by Docs vs. Practical Inference

| Claim | Status |
|-------|--------|
| Projects available on all plans, including Free (five-project cap on Free) | Reported by help center articles [9517075](https://support.claude.com/en/articles/9517075-what-are-projects) and [9519177](https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects) surfaced in search 2026-07-18; direct fetch blocked—verify |
| Project instructions are prepended to every conversation | Confirmed by product behavior; described in Anthropic help docs |
| Files can be uploaded to a project and referenced in any conversation | Confirmed by product behavior; described in help docs |
| Project knowledge auto-switches to RAG mode near the context limit (up to ~10x capacity) | Reported by help center [article 11473015](https://support.claude.com/en/articles/11473015-retrieval-augmented-generation-rag-for-projects) surfaced in search 2026-07-18; direct fetch blocked—verify |
| Chat search and project-scoped memory on paid plans | Reported by help center [article 11817273](https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context) surfaced in search 2026-07-18; direct fetch blocked—verify |
| CLAUDE.md and Claude Projects are separate mechanisms | Confirmed: CLAUDE.md is a Claude Code feature; Projects are a Claude app feature |
| Shared project conversations cannot be exported when connectors are active | Confirmed by connectors overview article |

---

## Cost and Rate-Limit Notes

Claude Projects are included with all plans—per the help center as of mid-2026, Free accounts are capped at five projects. The cost of using a project is the same as the cost of using Claude in any conversation—it is drawn from your plan's usage allowance. Projects with many attached files do not add per-file charges, but longer contexts (more files, more conversation history) increase the token count of each request, which consumes allowance faster. On API-based accounts (Claude Console), projects with large file attachments will incur higher per-request costs.

---

## Where to Go Next

- [Claude Desktop](claude-desktop.md) — for local file access and tool integrations
- [Claude Code](claude-code.md) — for terminal-based coding with project-level instructions via CLAUDE.md
- [Gemini App](gemini-app.md) — for a comparable persistent-persona feature (Gems) on the Google side
