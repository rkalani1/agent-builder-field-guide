# Custom GPTs

> **Last verified:** 2026-05-06 · **Drift risk:** medium · **Partially re-verified:** 2026-07-18
> **Official sources:** [Creating and editing GPTs](https://help.openai.com/en/articles/8554397), [Projects in ChatGPT](https://help.openai.com/en/articles/10169521-projects-in-chatgpt)

---

## What this surface is

A Custom GPT is a published configuration of ChatGPT that packages a specific set of instructions, knowledge files, capability settings, and optional external API connections (Actions) into a shareable assistant. You build it through the GPT builder at [chatgpt.com/gpts](https://chatgpt.com/gpts), and you control who can access it — yourself only, anyone with a link, or anyone on the GPT Store.

Custom GPTs are distinct from Projects. A GPT is a fixed, published tool: one instruction set, one set of knowledge files, deployed to whoever you share it with. A Project is a living workspace where context accumulates over time. If you are building something that will be used repeatedly by people who should not need to configure anything themselves, a Custom GPT is the right choice. If you are building a personal or team context hub that evolves, use a Project instead. The [official FAQ](https://help.openai.com/en/articles/10169521-projects-in-chatgpt) frames GPTs as best suited to reusable knowledge that spans functions and contexts, and Projects as best suited to team alignment, faster onboarding, and knowledge capture (the article's exact wording changes as it is revised).

---

## Who it is best for

- Developers or teams that want to publish a specialized assistant to internal or external users without writing any code.
- Organizations that need a consistent interface for domain-specific tasks (triage, summarization, formatting, Q&A over documentation) that many people will use.
- Builders who want to connect a ChatGPT interface to an existing HTTPS API without standing up a full agent system.

---

## Prerequisites

- A paid ChatGPT account. Per the [help center](https://help.openai.com/en/articles/8554397), creating or editing GPTs requires a paid subscription (as of mid-2026 the paid plans are Go, Plus, Pro, Business, Enterprise, and Edu); it is not available on the Free plan, though Free users can still use published GPTs. Verify plan-specific builder access against the help article — plan lineups shift.
- The GPT builder is only available on the web at [chatgpt.com](https://chatgpt.com). The mobile apps allow using GPTs but not building or editing them.
- If you plan to add Actions: an HTTPS endpoint you control, with a valid TLS certificate, that accepts JSON requests. Do not use `http://` — Actions require HTTPS.

---

## Step-by-step setup

1. Go to [chatgpt.com/gpts](https://chatgpt.com/gpts) and click **Create**.
2. The builder opens with two tabs: **Create** (conversational wizard) and **Configure** (direct field editing). Start with **Configure** for precise control.
3. Fill in **Name** — this appears in search results and at the top of the chat. Be specific: "Cardiovascular Literature Triage" rather than "Med GPT."
4. Fill in **Description** — one or two sentences explaining purpose, audience, and typical tasks.
5. Write **Conversation starters** — three to five realistic example prompts that demonstrate how to use the GPT. These appear to users when they open it.
6. Write **Instructions** — see the section below.
7. Upload **Knowledge** files if needed.
8. Enable or disable **Capabilities** (web search, image generation, code interpreter).
9. If connecting to an API, set up **Actions** — see below.
10. Click **Create** to save and publish. To update an existing GPT, click **Update** after making changes. Changes save to a draft automatically while you edit.
11. Use the built-in **Preview** panel to test the GPT before sharing it.

---

## Builder UI walkthrough

### Configure tab

**Name, Description, Conversation starters**

These are user-facing fields. The Name appears everywhere the GPT is referenced. The Description surfaces in GPT Store listings and previews. Conversation starters show on the opening screen and should reflect realistic, high-value tasks.

**Instructions**

Instructions define how the GPT behaves: what it should do, how it formats responses, what it should decline to do, and in what tone. Per the [official docs](https://help.openai.com/en/articles/8554397): "For multi-step workflows, use explicit step structure, for example: 'When X happens → do Y,' and separate sections with clear delimiters." Positive directives ("Return a JSON object with keys...") work better than long prohibition lists. Include brief examples of acceptable and unacceptable outputs when the GPT must apply specific classifications.

**Knowledge**

You can attach up to 20 files, each up to 512 MB, per the [docs](https://help.openai.com/en/articles/8554397). Use knowledge files for reference material the GPT should draw from (documentation, handbooks, lookup tables). Put behavioral rules in Instructions, not in files. After uploading, test in Preview to confirm the GPT actually uses the content as expected.

**Capabilities**

Four built-in capabilities you can toggle: Web Search, Image Generation, Canvas (longer structured content editing), and Code Interpreter & Data Analysis. Enable only what the GPT actually needs — unused capabilities increase surface area for unexpected behavior.

**Actions**

Actions let the GPT call external APIs you define via an OpenAPI schema. Use Actions when the GPT needs to retrieve live data or trigger operations in external systems. A GPT can use either the connected Apps system or Actions, but not both at the same time — per [Apps in custom GPTs](https://help.openai.com/en/articles/20001049-apps-in-custom-gpts-for-business-accounts-beta), enabling Apps removes the Actions pane and disables existing actions. Apps inside custom GPTs is currently documented as a beta for Business accounts. See the Actions setup section below.

---

## Worked example: a literature triage GPT

**Goal:** A GPT that accepts a structured abstract (PMID-style format, but no real PHI) and returns a JSON triage decision.

This example uses entirely synthetic text and does not reference real trials, real patient data, or real medical recommendations.

**Instructions:**

```
You are a research triage assistant for a systematic review team.

Input format: You will receive one or more abstracts in the following structure:
  TITLE: <title>
  AUTHORS: <authors>
  SOURCE: <journal, year>
  ABSTRACT: <full abstract text>

Your task for each abstract:
1. Assess relevance to the review topic: "interventions for type 2 diabetes in adults aged 65+."
   - INCLUDE: RCTs and systematic reviews with human participants aged ≥65 with T2D.
   - EXCLUDE: Animal studies, non-English, case reports, editorials, studies with mean age < 60.
2. Return a JSON object with these keys:
   - "pmid_placeholder": the value provided in the SOURCE field if a DOI or ID is present, else null
   - "decision": "INCLUDE", "EXCLUDE", or "UNCERTAIN"
   - "exclusion_reason": brief string if EXCLUDE, else null
   - "population_flag": true if age of population is explicitly stated, else false
   - "study_design": one of "RCT", "Systematic review", "Observational", "Other", "Not stated"
3. Do not add commentary outside the JSON. Return one JSON object per abstract, wrapped in a JSON array if multiple abstracts are provided.
4. Do not make clinical recommendations. Do not infer data not present in the text.

If an abstract is ambiguous, set "decision" to "UNCERTAIN" and explain in "exclusion_reason".
```

**Test input (synthetic):**

```
TITLE: Effects of SynthDrug-A on HbA1c in Older Adults with Type 2 Diabetes
AUTHORS: Smith J, Doe A, Lee B
SOURCE: Synthetic Journal of Endocrinology, 2025. ID: SYNTH-2025-001
ABSTRACT: Background: Glycemic management in adults aged ≥65 with T2D presents challenges.
Methods: RCT, n=280, mean age 71.2. Intervention: SynthDrug-A 5mg vs placebo.
Duration: 52 weeks. Primary outcome: HbA1c change from baseline.
Results: Mean HbA1c reduction 0.8% (95% CI 0.5–1.1), p<0.001.
Adverse events: hypoglycemia 4% vs 2%. No severe events.
Conclusion: SynthDrug-A reduced HbA1c with an acceptable safety profile.
Limitations: Single center. No COI disclosed.
```

Expected output:

```json
[
  {
    "pmid_placeholder": "SYNTH-2025-001",
    "decision": "INCLUDE",
    "exclusion_reason": null,
    "population_flag": true,
    "study_design": "RCT"
  }
]
```

Test this in the Preview panel before publishing. Verify that the GPT returns valid JSON, handles edge cases (missing age, case report), and declines to add clinical commentary.

---

## Actions: connecting to an external API

Actions are defined using an OpenAPI 3.x schema that you paste into the GPT builder's Actions editor. A minimal schema structure:

```yaml
openapi: "3.1.0"
info:
  title: My Tool API
  version: "1.0"
servers:
  - url: https://api.yourdomain.com
paths:
  /search:
    get:
      operationId: searchRecords
      summary: Search the internal record database
      parameters:
        - name: query
          in: query
          required: true
          schema:
            type: string
      responses:
        "200":
          description: Search results
```

Key requirements:

- The `servers.url` must use `https://`. Plain `http://` is not accepted.
- Do not include authentication tokens or API keys directly in the schema text. Use the **Authentication** section of the Actions builder to configure bearer tokens, API keys, or OAuth separately. Never paste a real credential into the schema field.
- The GPT calls these endpoints on behalf of the user when the conversation triggers the relevant operation. The user may see a confirmation prompt before the action runs, depending on the action type.

---

## When to use a Custom GPT vs a Project

| Criterion | Custom GPT | Project |
|---|---|---|
| Will multiple people use a fixed tool? | Yes — use a GPT | No — use a Project |
| Does context accumulate over time? | No | Yes — use a Project |
| Do you need live API integration? | Yes — Actions | Via connected Apps (limited) |
| Does the team need to see each other's work? | No | Yes — use a Project |
| Is this a one-off personal workspace? | No | Yes — use a Project |

---

## Limits and gotchas

- **Knowledge file limits:** 20 files, 512 MB each, per the [docs](https://help.openai.com/en/articles/8554397). Complex layouts in PDFs reduce retrieval reliability.
- **Actions require HTTPS.** There is no exception for local or staging endpoints. Use a tunnel tool (e.g., ngrok) for development testing, but replace with a real HTTPS endpoint before sharing the GPT.
- **Actions and Apps are mutually exclusive.** A GPT can use one or the other, not both simultaneously; enabling Apps disables existing Actions. Apps in custom GPTs is documented as a [Business-accounts beta](https://help.openai.com/en/articles/20001049-apps-in-custom-gpts-for-business-accounts-beta).
- **Version history is available** from the three-dot menu in the editor. If you restore an older version that had Actions configured, you may need to reconfigure authentication afterward, per the [docs](https://help.openai.com/en/articles/8554397).
- **Mobile users cannot build GPTs.** They can use them.
- **JSON output is not guaranteed to be valid JSON** without careful instruction engineering and testing. Use the Preview panel thoroughly. Consider adding explicit instructions to "return only valid JSON with no surrounding text."
- **Model selection:** You can set a Recommended Model for your GPT, but users with access to other models can switch. If your JSON schema relies on a specific model's behavior, document that.
- **GPT Store visibility and discoverability** change with product updates. Verify current sharing settings in the builder before publishing to a wide audience.

---

## Confirmed by docs vs. practical inference

| Claim | Source |
|---|---|
| 20 files, 512 MB each for Knowledge | [Confirmed — official docs](https://help.openai.com/en/articles/8554397) |
| Actions require HTTPS | [Confirmed — official docs](https://help.openai.com/en/articles/8554397) |
| Actions and Apps are mutually exclusive | [Confirmed — official docs](https://help.openai.com/en/articles/20001049-apps-in-custom-gpts-for-business-accounts-beta) |
| Restoring old Action versions may break auth | [Confirmed — official docs](https://help.openai.com/en/articles/8554397) |
| Builder only on web, not mobile | [Confirmed — official docs](https://help.openai.com/en/articles/8554397) |
| JSON output reliability with instruction engineering | **Practical inference** — valid JSON output requires explicit prompting and testing; no documented guarantee |
| Triage accuracy on synthetic abstracts | **Practical inference** — accuracy depends on model version and instruction clarity; not documented |

---

## Cost and rate-limit notes

Building GPTs is included in paid plan subscriptions at no separate charge. When users interact with your GPT, their conversations consume from their own plan's message quota. If your GPT uses Code Interpreter, image generation, or Actions with external APIs, those tool calls may use additional credits or count toward tool-use quotas — the exact accounting follows standard ChatGPT pricing for the capability in question. Publish to a limited audience first to estimate usage before a broad release.

---

## Where to go next in this guide

- If you need multi-step automation, tool calling, or want to run agents in code, see [OpenAI API and Agents SDK](openai-api.md).
- For a persistent team context hub rather than a reusable tool, see [ChatGPT Projects](chatgpt.md).
- For a terminal-based coding agent, see [Codex CLI](codex.md).
