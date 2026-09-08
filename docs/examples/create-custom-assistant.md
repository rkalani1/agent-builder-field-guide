# Example: create a custom assistant

> **Last verified:** 2026-05-06 · **Time:** 20 minutes · **No API key required**

Turn one of your repeated workflows into a reusable, named assistant — a Custom GPT (ChatGPT), a Gem (Gemini), a Skill (Claude), a Space (Perplexity), or a Project (any).

This is the meta-example. After you do it once, every other example in this library becomes shareable.

## Layer 1 — Chat only (the design pass) `Free`

Before you build the assistant, design it in chat:

```
Help me design a custom AI assistant.

The job: <one sentence, e.g., "draft difficult emails in my voice">
Audience: <me; my team; the public>
Inputs the assistant will get: <one or two sentences>
Outputs the assistant should produce: <format + length + tone>

Output a single markdown block with:
1. A 4-word name.
2. A 1-paragraph description.
3. The system prompt / instructions, second-person ("You are…").
4. 3 sample prompts a user might paste.
5. 1 obvious failure mode and the rule that prevents it.
6. Which slot in my AI to paste each piece into:
   - ChatGPT → Custom GPT Configure tab
   - Gemini → Gem Instructions
   - Claude → Project Instructions (and SKILL.md if I want a Skill)
   - Perplexity → Space System Prompt
```

This is the [template from the Memory & preferences guide](../preferences-memory/index.md#turn-this-repeated-workflow-into-a-skill-custom-gpt-gem). Save the output.

## Layer 2 — Project `Sub`

For most users, the right starting point is a **Project**, not a Custom GPT:

- Lower cost.
- Easier to iterate on instructions.
- Already integrates with files and connectors.

What to click:

- **ChatGPT**: New Project → name it → paste Instructions + sample prompts.
- **Claude**: New Project → same.
- **Gemini**: New Gem (closest equivalent).
- **Perplexity**: New Space.

## Layer 3 — Memory `Sub`

If the style/constraints from your assistant are universal, push them into global memory so every chat (not just this Project) benefits.

## Layer 4 — Scheduled action

N/A — assistants are on-demand. But you can schedule a *workflow that uses* the assistant. See [Create a native scheduled task](create-native-task.md).

## Layer 5 — Custom GPT / Gem / Claude Skill `Sub`

Graduate from a Project to a published assistant when:

- Multiple people will use it (Team / Ent for shareable surfaces).
- The instructions are stable.
- You want it discoverable in the GPT/Gem/Skill picker.

What to click:

- **Custom GPT**: `chatgpt.com/gpts/editor` → Create → paste Instructions in Configure → upload Knowledge → set Capabilities (Browsing, Code interpreter) intentionally → save.
- **Gemini Gem**: Gem manager → New Gem → paste Instructions → attach files → save.
- **Claude Skill**: write a `SKILL.md` (see the [Claude feature map](https://claude.ai/)). Skills also pack templates and reference resources.

Always test the published assistant against 3–5 example prompts before sharing.

## Layer 6 — Developer / API (advanced) `Dev`

If your assistant touches APIs / data / external services, write a system prompt + tool list against the SDK of your choice. See [Mastery — Claude § Expert](../mastery/claude.md), [ChatGPT § Expert](../mastery/chatgpt.md), [Gemini § Expert](../mastery/gemini.md).

## Make it reusable

- Save the assistant's source-of-truth doc in your team drive — even when the assistant is published. Things drift; the doc is the truth.
- Version the system prompt. Add a `Last updated:` line.

## Make it robust

- **Eval set**: 5 inputs the assistant should handle well; 2 it should refuse. Score each release.
- **Red-team**: every assistant gets prompt-injection probes (jailbreak persona override, exfiltration via URL, scope creep). See [evals/red-team/](https://github.com/rkalani1/agents-automations/tree/main/evals/red-team).
- **Drift check**: monthly, run the eval set. Adjust instructions when scores drop.

## What good output looks like

- Assistant says exactly what you'd say if you wrote it by hand.
- It refuses out-of-scope requests and offers an in-scope alternative.
- It produces the same shape of output for the same shape of input.

## If your plan doesn't have this feature

- No Custom GPT / Gem → use a Project. Same instructions; just less shareable.
- No Project → save the system prompt in a notes app and paste as message 1 of every chat. The assistant is the prompt.
- No memory → keep your style block in the same notes file.

## See also

- [Memory and preferences](../preferences-memory/index.md)
- [Mastery — ChatGPT § Custom GPTs](../mastery/chatgpt.md)
- [Mastery — Claude § Skills](../mastery/claude.md)
- [Mastery — Gemini § Gems](../mastery/gemini.md)
