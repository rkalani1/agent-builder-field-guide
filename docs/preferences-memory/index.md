# Memory and preferences

> **Last verified:** 2026-05-06 · **Drift risk:** medium (memory feature names and toggles change quarterly)

This guide is the canonical place to learn:

- what to put in AI memory and what to keep out;
- the difference between **global memory**, **project memory**, and **project instructions**;
- how to maintain a **portable preference profile** that works across Claude, ChatGPT, Gemini, Grok, and Perplexity;
- how to migrate between tools without losing your style;
- how to ask the AI to summarise itself into reusable memory;
- copy-paste templates for the conversations you'll have with your AI about its own memory.

## What to put in memory

Use memory for facts that are:

- **Stable.** Your name, role, field, primary city, normal pronouns, primary AI tool.
- **Style-shaping.** Tone preference, citation style, length defaults, allergies-of-style ("no marketing language", "no emojis", "no exclamation points").
- **Context-shrinking.** "I'm a clinician at any organization working on epidemiology and dietary intervention research" — saves you from re-typing this constantly.
- **Constraint-enforcing.** "Default to NEJM citation style"; "draft only — never send email on my behalf"; "never recommend API keys for beginners."

## What **not** to put in memory

Do **not** save:

- **Secrets.** API keys, passwords, tokens, recovery codes, SSNs, MRNs, ICDs, or any number that opens a door.
- **Per-project specifics that don't generalise.** Use a Project for those.
- **One-off facts.** Memory clutters fast.
- **Sensitive data about other people.** Names of patients, employees, students, family members in any clinical or HR context.
- **Anything regulated.** PHI, financial details about identifiable people, legal matter details.

If the data is regulated, sensitive, or transient, **use a Project** (which can be deleted), not memory (which persists).

## Global memory vs project memory vs project instructions

These three slots get confused constantly. Here's the rule of thumb.

| Slot | What goes here | Scope | When to clear |
|---|---|---|---|
| **Global / profile memory** | "Who I am, how I like to be addressed, what bores me" | Every chat in this product | When your role / preferences change |
| **Project memory** | "What this project is, who it serves, what good output looks like *for this project*" | All chats inside the Project | When the project ends |
| **Project instructions** | "The system prompt the AI should follow inside this Project — the *job description*" | All chats inside the Project | When the job changes |
| **Project knowledge / files** | Source material the AI consults | All chats inside the Project | When the source becomes stale |

A common mistake is putting style preferences in Project instructions and re-typing them in every Project. Style preferences belong in **global memory** so every Project inherits them automatically.

## Portable AI profile

Maintain one short markdown file you can paste into any AI product. Keep it under one screen. Update it monthly.

```markdown
# AI profile — Operator

## Who I am
- Clinician-researcher at any organization.
- Areas: epidemiology, dietary intervention, causal inference, clinical study design.
- Locale: Sample City. Timezone: America/Los_Angeles.

## How I like AI output
- Tone: concise, technical, no marketing language.
- Style: NEJM citation format. Sentence-case headings. Bullet lists over paragraphs.
- Length: default to short. If I want long, I'll ask.
- Honesty: prefer "I don't know" over confident guesses. Always flag uncertainty.

## Constraints
- Drafts only on email, calendar, files, and code. I take the final action.
- Never invent citations. If a citation cannot be verified, state that.
- For beginners I'm helping, never recommend API keys, CLIs, or local scripts.

## Defaults
- Output as markdown unless I ask otherwise.
- For numeric work, show the formula, then the answer.
- For decisions, list 2–3 options with one-sentence trade-offs before recommending.
```

Save this in your notes app (Obsidian, Apple Notes, Google Doc — anywhere). Paste it as the first message of any new chat where memory isn't available, or save its contents to that product's memory slot.

## Migrating preferences between tools

You can move the profile above between products in seconds. The exact UI varies — here's what to click.

### Claude

- Profile preferences `Sub`: profile menu → Profile → preferences. Paste the whole "How I like AI output" + "Constraints" + "Defaults" sections.
- Per-project: paste **Who I am** + **Constraints** into Project instructions; keep style in profile preferences.

### ChatGPT

- Custom Instructions `Free / Sub`: profile menu → Customize ChatGPT. Two boxes: "What would you like ChatGPT to know about you?" (paste **Who I am**) and "How would you like ChatGPT to respond?" (paste **How I like AI output** + **Defaults**).
- Memory `Sub`: settings → Personalization → Memory. Add facts as conversational sentences, e.g., "Default to NEJM citation style."

### Gemini

- Saved info `Sub`: settings → Saved info. Paste short sentences, one per line.
- Per-Gem: include the same constraints in the Gem's instructions.

### Grok

- Personalization `Sub` (where rolled out): settings → Personalization. Same shape as Custom Instructions.
- If unavailable, paste the full profile as the first message of every chat.

### Perplexity

- Profile `Sub`: settings → Profile → "Tell us about yourself" + "AI tone." Paste **Who I am** and **How I like AI output**.
- Per-Space: paste **Constraints** into the Space's system prompt.

### Other / any AI tool

- If the product has a settings/personalization slot, paste the profile there.
- If it does not, save the profile to your notes app and paste it as message 1 in every new chat. The [universal method](../mastery/any-ai-tool.md) covers this.

## Asking the AI to summarise itself into "memory I should save"

Open a productive chat that taught the AI something useful about you. At the end, paste:

> Summarise this entire conversation into "memory I should save" and "things to keep only inside this project". Format as two short bullet lists. Do not include anything I asked you to forget. Do not include any value that looks like a credential. Tell me what to save into my global profile vs into a Project's instructions vs into a Project's memory. If anything looks regulated or sensitive, flag it and recommend keeping it out of memory.

Paste the result into the right slot.

## Maintaining a living "AI profile" file

Keep one canonical file, e.g., `~/Notes/ai-profile.md`. Conventions:

- **Top of file:** version line — `Last updated: 2026-05-06`.
- **Sections:** Who I am, How I like AI output, Constraints, Defaults, Recent changes.
- **Recent changes log:** one line per change.
- **Do not include secrets.** Ever.

Once a month, paste the file into ChatGPT or Claude and ask:

> Review this profile. Suggest 3 small edits that would make AI output more accurate to me, based on a typical week of my work. Do not invent things. If you do not know, say so.

Apply the edits you agree with. Update the recent-changes log.

## Copy-paste templates

Each template is short and intentionally generic. Tailor before pasting.

### "Remember this about me"

```
Remember this about me, persistently:
- {one short fact, e.g., I default to NEJM citation style}
- {another short fact, e.g., I work in epidemiological research}
- {another short fact, e.g., I prefer bullet lists over paragraphs}

Confirm the additions and tell me anything similar that I have already said before.
Do not store any value that looks like a credential. If something here is sensitive, flag it.
```

### "Summarise this project for future chats"

```
Summarise this project so that a future chat can pick up where we left off in 200 words or fewer.
Include: the goal, what's been decided, what's still open, where the source material lives,
and the constraints I care about. Output as a code block I can paste into Project instructions.
```

### "Create project instructions from this conversation"

```
Turn the relevant parts of this conversation into a "Project instructions" block I can paste
into a new Project. Include:
- a one-line purpose statement,
- a short context paragraph,
- 5 explicit instructions (do this, never do that),
- 1 example of "good" output,
- 1 example of "bad" output (something to avoid).
Format as markdown. Keep it under 400 words. Do not include any credentials or sensitive values.
```

### "Turn this repeated workflow into a Skill / Custom GPT / Gem" {#turn-this-repeated-workflow-into-a-skill-custom-gpt-gem}

```
Look at how I've been using you over the last few messages. Treat that as a workflow I want
to package as a reusable assistant.

Output a single markdown block with:
1. A name (4 words or fewer).
2. A one-paragraph description.
3. The system prompt / instructions, in the second person ("You are…").
4. A short list of files or sources the assistant should be given (Knowledge / Project files).
5. 3 sample prompts the user might paste in.
6. 1 obvious failure mode and how to avoid it.

Tell me which slot in my AI to paste each piece into:
- Custom GPT (ChatGPT) → Configure tab
- Gem (Gemini) → Instructions
- Skill (Claude) → SKILL.md
- Project (any) → Instructions
```

### "Create a portable AI profile I can use in any AI tool"

```
Build me a portable AI profile, plain markdown, under one screen.
Sections:
- Who I am (3–5 lines)
- How I like AI output (5 short rules)
- Constraints (3 lines)
- Defaults (3 lines)
Use the conversation we've had so far. Do not invent. Where you do not know,
leave a `{TODO: ...}` placeholder I can fill in. Do not include credentials.
Output as a single markdown code block.
```

### "Tell me what I should save as memory vs keep only in this project"

```
For each fact I have given you in this chat, sort it into:
- "Save as global memory" (stable, style-shaping, generic)
- "Save as project memory only" (project-specific)
- "Do not save anywhere" (transient, sensitive, or regulated)

Use a 3-column table. Be conservative: if you are unsure, default to "do not save."
Flag anything that looks like a credential or like PHI.
```

## Per-product memory feature reference

| Product | Slot | Plan |
|---|---|---|
| Claude | Profile preferences | `Sub` |
| Claude | Project instructions | `Sub / Team / Ent` |
| Claude | Project knowledge | `Sub / Team / Ent` |
| ChatGPT | Custom Instructions | `Free / Sub` |
| ChatGPT | Memory | `Sub (where enabled)` |
| ChatGPT | Project instructions | `Sub / Team / Ent` |
| Gemini | Saved info | `Sub / Adv` |
| Gemini | Gem instructions | `Sub / Adv` |
| Grok | Personalization | `Sub (where rolled out)` |
| Perplexity | Profile + AI tone | `Sub` |
| Perplexity | Space system prompt | `Sub` |
| GitHub Copilot | `.github/copilot-instructions.md` | `Free` (per repo) |
| Other / any | Paste profile as message 1 | `Free` |

## Safety

- Audit your memory monthly. Open the memory pane and skim every line. Delete anything stale.
- Treat memory like a public bio — assume an admin or auditor can read it on enterprise plans.
- Never delegate "remember my password" or "remember this credential."
- If your AI offers an "incognito / temporary chat" mode, use it for sensitive one-off questions.

## See also

- [Capability map](../capability-map/index.md) — which products have memory and which don't.
- [Mastery](../mastery/index.md) — per-product memory walkthroughs.
- [No-code automations](../no-code-automations/index.md) — schedule prompts that already use your saved profile.
- [Examples — maximize my AI subscription](../examples/maximize-my-ai-subscription.md) — uses the profile from this page.
