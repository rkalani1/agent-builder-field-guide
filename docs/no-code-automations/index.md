# No-code automations

> **Last verified:** 2026-05-06 · **Drift risk:** high (native tasks/scheduled-action features change quarterly — always test manually first)

This guide is for users who have a normal AI subscription and want their AI to **run a workflow on a schedule** without code, cron, launchd, GitHub Actions, or local scripts.

> Defaults this guide enforces:
>
> - **Schedule nothing on day one.** Run the workflow manually until it succeeds three times in a row.
> - **No agent gets to send messages or take destructive actions** without an explicit human approval step.
> - **API/CLI/MCP/local-script automations live in the [Agent Factory](../agent-factory/index.md) and starter kits**, not here. This page is subscription-native only.

## What "no-code automation" means here

A **native scheduled action** is a feature inside an AI app — ChatGPT, Claude, Gemini — that runs a saved prompt on a schedule and posts the result back into the same chat thread. You configure it once, in the app, with no code.

It is *not* the same as:

- A `cron` job or `launchd` plist on your laptop.
- A GitHub Actions workflow.
- A Zapier / Make / n8n recipe.
- A custom API integration.

If you want to use any of those, switch the Task Builder to **Developer Mode** and follow the [Agent Factory](../agent-factory/index.md). For everyone else, this page is the path.

## What native tasks **can** do

- Run a saved prompt on a schedule (daily / weekly / hourly where allowed).
- Send the result back into the chat thread or as an in-app notification.
- Use whatever connectors are enabled on your account (Email, Calendar, Drive, etc.).
- Be paused, deleted, or one-off-triggered from the same UI that created them.

## What native tasks **cannot** reliably do today

- Run truly long jobs without timing out.
- Do guaranteed file output to your local disk (the result lives in the chat).
- Take action on your behalf in third-party apps without a connector + an approval prompt.
- Be re-run with reproducible inputs unless you constructed the prompt to be self-contained.
- Run more frequently than the platform allows (typically once per hour or once per day).

When any of these matters, use the [Manual repeat-run fallback](#manual-repeat-run-fallback) and only graduate to a scheduled task after three clean manual runs.

## Per-product setup

### ChatGPT Tasks `Sub (where rolled out)`

What to click:

1. Open `https://chatgpt.com`.
2. Start a new chat. Write a clear, self-contained prompt: *"Every Monday at 8:00 America/Los_Angeles, summarise these three feeds…"*.
3. After ChatGPT replies, look for the "Schedule" affordance (clock icon or "Make this a Task" button). UI label drifts; it has appeared in the message footer and the prompt bar.
4. Set the cadence and confirm the timezone.
5. Confirm the task appears under your profile menu → Tasks (label may be plural or singular).
6. Run it once on demand to verify before letting it run on schedule.

How to pause / delete:

- Profile menu → Tasks → tap a task → Pause or Delete.

Failure modes to watch for:

- Tasks silently stop if they fail repeatedly. Check Tasks weekly.
- Connectors used inside a task may require re-auth; the task surfaces an error in the chat thread.

### Gemini scheduled actions `Sub / Adv (where rolled out)`

What to click:

1. Open `https://gemini.google.com`.
2. Start a chat with the prompt you want to schedule.
3. Open Settings & help → Scheduled actions (label may differ by region/plan).
4. Choose cadence and timezone; pick which Gem (if any) the schedule should use.
5. Confirm and run once on demand.

How to pause / delete:

- Settings & help → Scheduled actions → toggle off or remove.

Failure modes to watch for:

- Scheduled actions tied to a Gem stop running if the Gem is deleted.
- Workspace connectors may require admin enablement on enterprise tenants.

### Claude Cowork scheduled tasks `Sub / Team (where rolled out)`

What to click:

1. Open `https://claude.ai` and look for Cowork (or the equivalent Projects-with-tasks affordance — names drift).
2. Inside a Project, choose "Schedule" / "Make this a recurring task".
3. Pick cadence + timezone.
4. Set the **expected output**: where the result should go (chat artifact, project knowledge, or downloaded artifact).
5. Test on demand before letting it run.

How to pause / delete:

- The same Cowork pane lists active tasks; pause or delete from there.

Failure modes to watch for:

- Cowork tasks that touch external connectors will fail silently if a connector is revoked.
- Cowork tasks share the project's knowledge and instructions — any change to the project also changes the task.

### Reminders / calendar workflows where native `Sub / Team`

If your AI has a calendar connector (Gmail/Calendar via ChatGPT, Workspace via Gemini), you can:

- Create a recurring **calendar event** that fires a reminder and includes the saved prompt in the description.
- When the reminder fires, open the chat and paste the prompt — this is the "calendar-driven manual run" pattern.

This is the **safest** schedule pattern because the human always sees the reminder and runs the prompt; nothing happens automatically.

### Project reminders and recurring manual workflows

For users on free or basic plans without scheduled actions:

- Use a **calendar reminder** (Google Calendar, Apple Calendar, Outlook).
- Title: *"Run weekly research summary in Claude Project"*.
- Description: paste the prompt. Optionally link to the Project URL.
- This is the universal fallback.

## Pause/delete checklist

Before scheduling anything:

- Write down where the **off switch** is.
- Note the **expected cost** (token usage on Paid plans is metered; runaway tasks will eat your monthly cap).
- Note the **expected duration** of each run.
- Pick the **least frequent** cadence that satisfies the use case.

## Avoiding runaway automations

- Schedule **one** task at a time. Watch it for a week.
- For tasks that send anything (email draft, posted notice), keep them in **draft only** mode — humans send.
- For tasks that touch files, restrict them to a **read-only** connector or a single dedicated folder.
- If a task triggers other tasks, count the multiplication: 1 daily task that creates 1 child task is 30 runs/month, not 30. 1 daily task that creates 5 child tasks is 150.
- If your AI offers a **monthly run cap**, set it.

## How to test manually before scheduling

Run this **dry-run drill** for any prompt you intend to schedule:

1. **Write the prompt as if it were already scheduled.** Include the date placeholder, the source, the output format, and the failure clause.
2. **Paste it into a chat manually.** Verify the output by hand.
3. **Repeat for three consecutive days (or weeks)** without modification.
4. **If all three runs succeed**, schedule it.
5. **Re-test the schedule once on demand** before walking away.

If any single run fails, do not schedule. Fix the prompt, repeat the three-run drill.

## Examples

Each example below is intentionally subscription-native. Each one also shows the **manual fallback** you can use without scheduled actions.

### Example 1 — Daily morning meeting prep `Sub` {#example-1-daily-morning-meeting-prep-sub}

Prompt to schedule:

```
You are my morning briefer. Today is {{TODAY}}.
1. Read my calendar for today (connector: Calendar).
2. For each meeting that has more than two attendees, write a 4-line prep:
   - the meeting purpose in one sentence,
   - the latest email I sent or received with anyone in the attendee list (connector: Email, read-only),
   - one open question for me to bring,
   - one decision the meeting should produce.
3. Output as a single markdown block. Do not send anything. Drafts only.
```

- ChatGPT: schedule as a Task, weekday-only, 7:30 local.
- Gemini: schedule as a scheduled action, weekday-only, 7:30 local.
- Claude (Cowork): schedule from a "Daily brief" Project.
- **Manual fallback**: calendar reminder at 7:30 local; paste the prompt into chat each morning.

### Example 2 — Daily learning brief `Sub`

Prompt to schedule:

```
You are my learning coach. Each weekday at 6:30 local, give me one
deep-learning question on causal inference, with three follow-ups.
Use my preference profile (already in this Project) for tone and depth.
Limit total length to 250 words. Cite the textbook chapter or paper if you use one.
```

- ChatGPT / Gemini: scheduled task, weekday-only.
- **Manual fallback**: calendar reminder at 6:30; paste the prompt each morning.

### Example 3 — Weekly learning plan `Sub` {#example-3-weekly-learning-plan-sub}

Prompt to schedule:

```
Sundays at 17:00 local, draft a one-page learning plan for the coming week.
Pull from my notes (Project knowledge) and last week's wins/blockers (chat history).
Output: 5 study blocks, each 25 minutes, with a topic, a source, and a self-check question.
```

- Claude Cowork or ChatGPT Task. Weekly cadence.
- **Manual fallback**: Sunday calendar reminder; paste prompt.

### Example 4 — Research watch `Sub` {#example-4-research-watch-sub}

Prompt to schedule:

```
Each Friday at 10:00 local, summarise newly-deposited preprints from the past 7 days
that match my research keywords (already in Project knowledge).
Output: top 5 with a 60-word summary each and a "why this matters to me" line.
Cite each preprint with title, authors, date, and DOI/URL.
If you cannot retrieve fresh data, say so explicitly. Do not fabricate.
```

- Best in **Perplexity Spaces** (paid) for citation discipline.
- Or schedule in ChatGPT/Claude/Gemini if your plan has the connector.
- **Manual fallback**: Friday calendar reminder; run a Perplexity search by hand and paste the result into your notes.

### Example 5 — Reminder-style workflow `Free / Sub`

Prompt to schedule:

```
Every weekday at 16:30 local, ask me one short question:
"What is the one thing left undone today that you can finish in 15 minutes?"
If I answer, congratulate, file my answer, and remind me to close the laptop.
If I do not answer within an hour, ignore.
```

- Light, low-cost, draft-only. Excellent first scheduled task.
- **Manual fallback**: phone reminder.

## Manual repeat-run fallback

If your plan does not include native scheduled tasks, or you prefer not to use them:

1. Pick a **trigger**: a calendar reminder, a phone alarm, or a checklist app.
2. Save the **prompt** as a note or pinned chat.
3. When the trigger fires, open the chat product, paste the prompt, run it, copy the output to its destination.
4. Track success in a small log: `date / success / minutes / notes`.
5. After three clean runs, decide whether scheduling adds enough value to justify the watch effort.

## Plan availability summary

| Product | Native scheduled action available |
|---|---|
| ChatGPT | Tasks (Sub, where rolled out) |
| Claude | Cowork scheduled tasks (Sub / Team, where rolled out) |
| Gemini | Scheduled actions (Advanced, where rolled out) |
| Grok | Not primary — use a manual workflow with calendar reminder |
| Perplexity | Not primary — use a manual workflow + Spaces |
| Copilot | Use GitHub Actions (Developer Mode only) |
| Other | Manual workflow with calendar reminder |

## Safety

This guide enforces three rules for every native task:

1. **Drafts only by default.** No native task should send a message, push code, post publicly, or call an external API that costs money without a human approval step.
2. **Pause-able and visible.** You must know how to find and pause every active task. Write it down.
3. **Test manually three times before scheduling.** No exceptions.

See [ADR 0003](../decision-records/0003-no-default-schedulers.md) for the long-form policy and [Safety baseline](../start-here/safety-baseline.md) for the per-task checklist.

## See also

- [Capability map](../capability-map/index.md) — what each product offers natively.
- [Memory and preferences guide](../preferences-memory/index.md) — keep your scheduled prompts portable.
- [Examples library](../examples/index.md) — beginner examples that include a "schedule it" step.
