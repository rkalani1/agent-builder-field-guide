> **Last verified:** 2026-05-06 · **Drift risk:** high · **Plan annotations:** Free / Sub / Team / Ent / API · **Partially re-verified:** 2026-07-18

# Grok mastery

Grok is xAI's large language model, available through three distinct surfaces that behave very differently from one another. Understanding which surface you are on matters before you build anything. Throughout this page, the three surfaces are referred to by these names:

- **Grok consumer chat** — the standalone web app and mobile apps at [grok.com](https://grok.com).
- **Grok on X** — Grok accessed from within the X (formerly Twitter) platform. Per mid-2026 reporting it is available to X users with usage limits; Premium tiers raise the limits (verify current gating).
- **xAI API** — the programmatic interface at [console.x.ai](https://console.x.ai), documented at [docs.x.ai](https://docs.x.ai/overview).

Consumer features in Grok are actively developed and the UI changes frequently. Any consumer-side feature described here should be verified in-app before you rely on it. Developer documentation at [docs.x.ai](https://docs.x.ai/overview) is more stable.

Cross-reference [../model-freshness.md](../model-freshness.md) before using any model identifier. Model names and versions change; always read from the `XAI_MODEL` environment variable in code.

---

## 1. Beginner: Grok consumer chat, model picker, first conversation

### Opening the chat

Go to [grok.com](https://grok.com) in any modern browser. You can sign in with a Google account, an Apple ID, or an X account. After signing in, you land on the main chat interface: a text box at the bottom and the model's responses in the center panel. Type any message and press Enter or click the send button.

**How to tell whether it worked:** the model's response streams in the center panel. If the page shows a spinner that never resolves, try reloading. If you see a message about daily usage limits, you have exhausted the free tier's message quota for that period.

**Plan annotation:** Basic Grok consumer chat is **Free** with a usage quota. Higher quotas and access to more capable models require **Sub** (Grok on X with X Premium, or a SuperGrok subscription where available).

### Choosing a model

Near the top of the chat panel or in the text box area, look for a model selector — a dropdown or a series of labeled buttons showing the current model (such as "Grok 4.3" or a fast/mini variant — model names drift; check the picker in-app). Click it to see available model options. Each option typically includes a short description of speed vs. capability. Select the one that fits your task:

- Mini / faster models: lower latency, good for quick back-and-forth. Available **Free** and **Sub**.
- Full models (e.g., the current Grok 4.x generation): stronger reasoning, more thorough answers. May be **Sub**-only or have tighter free-tier limits.
- Thinking / reasoning models (where available): slower, more deliberate multi-step reasoning. **Sub** and **API**.

The consumer model picker does not expose the full list of API models. For the full model catalog, see [docs.x.ai/developers/models](https://docs.x.ai/developers/models).

### Sending an image or file

In the chat text box, look for a paperclip or image icon. Clicking it opens a file picker. Select an image (JPEG, PNG, or similar) from your local machine. After attaching, type a question about the image and send. Grok will analyze the image and respond.

Document attachment (PDFs, spreadsheets, text files) support is more limited than image support and may vary by plan and platform version. If a file type is not accepted, the attachment button will either not appear or will return an error. Verify current supported file types in the Grok interface directly, as this is a high-drift capability area.

**Plan annotation:** Image input is **Free** with limits; higher volume and some file types may require **Sub**. Document file input is **Sub** where available.

---

## 2. Intermediate: Grok on X, personas, memory, personalization

> **Drift risk: high on all features in this section.** Grok's consumer-side feature set changes rapidly. Verify each capability below is present in your current app version before building on it.

### Grok on X (X integration)

Grok is accessible from within the X platform — typically via a dedicated Grok tab or icon in the X app's navigation. Per mid-2026 reporting, this works for X users generally with usage limits; Premium/Premium+ subscriptions raise the limits, and the @grok in-reply feature is reportedly Premium-only as of March 2026 — verify current gating at [help.x.com](https://help.x.com/en/using-x/about-grok). This surface gives you Grok with awareness of your X timeline, trending topics, and public X posts. You can ask questions like "what is being discussed about this topic on X right now" and Grok will draw on public posts.

The Grok on X surface is functionally similar to the Grok consumer chat but has tighter integration with X platform data. It is not a separate model; it is the same underlying model with additional real-time X data context.

**Plan annotation:** Grok on X is **Free** with usage quotas per mid-2026 reporting; **Sub** (X Premium or Premium+) raises limits, and some pathways (@grok in-reply) are reportedly **Sub**-only. SuperGrok subscribers on grok.com may get similar features; check current plan details in-app.

### Custom personas (where available)

Some versions of the Grok consumer app offer the ability to give Grok a different persona or communication style — for example, selecting a more formal or casual tone, or enabling "fun mode" vs. "serious mode." Look for a settings icon inside the chat, a personality or style selector in the sidebar, or a preferences panel.

Because this feature changes frequently, this guide cannot give you a stable click path. If you find a persona or style option, experiment with it. If you do not see one, Grok likely does not expose explicit persona controls at your plan level in the current version.

**Plan annotation:** Persona/style controls, where available, are **Sub**. Verify in-app.

### Workspaces (where available)

Per xAI announcements reported in April 2025, Grok consumer chat offers a Workspaces feature on [grok.com](https://grok.com) that groups related chats together with uploaded files and per-workspace custom instructions. Availability, naming, and capability vary by plan, region, and app version — verify in-app. Outside a workspace, chat history is organized chronologically, and you can rename conversations by clicking the conversation title.

Workspaces is not a shareable "custom GPT"-style bot builder: it scopes context and instructions to your own workspace rather than publishing a configured assistant for others.

**Plan annotation:** Workspaces availability varies by plan; full capability (file uploads, persistent instructions) is reportedly tied to paid tiers (**Sub**). Verify in-app.

### Memory and personalization (where available)

Grok may offer a memory or personalization feature that retains facts about you across conversations. Look for a **Memory** or **Personalization** section in the settings panel (gear icon or profile menu). If present, you can enter facts about yourself — role, preferred response style, topics of interest — and Grok will incorporate them into future responses.

If no memory feature exists in your current version, the workaround is: maintain a short personal context block in a text file and paste it at the start of any conversation where you want personalized behavior.

**Plan annotation:** Memory/personalization, where available, is **Sub**. Free tier may have limited or no persistent memory.

---

## 3. Advanced: consumer surface capabilities and limits

### Saved prompts and sharing chats

Within a conversation, you can copy the entire conversation by using your browser's copy function or by looking for a share or export option in the conversation menu (three dots or gear icon next to the conversation in the sidebar). Grok may offer a direct **Share** button that generates a public link to a conversation snapshot. This is useful for sharing a chain of reasoning with a colleague.

For saving prompts you reuse frequently: Grok consumer chat does not currently offer a dedicated saved-prompts or prompt library feature. The practical workaround is to keep a personal text file of your best prompts and paste from it. This is a gap compared to ChatGPT and Claude, which both offer prompt pinning or saved instructions features.

**Plan annotation:** Chat sharing (link generation) is **Free** or **Sub** depending on current rollout. Verify in-app.

### What you cannot do in consumer Grok

This is important context for anyone coming from ChatGPT or Claude: several capabilities that are available in the consumer interfaces of other AI products require the xAI API in Grok's case. Specifically:

- **Tool calling / function calling:** The consumer Grok chat does not expose function calling. You cannot register external tools or have Grok invoke functions on your behalf from the chat UI. This requires the xAI API.
- **Structured outputs (enforced JSON schema):** The consumer chat does not offer schema-constrained JSON output. You can ask Grok to respond in JSON format and it often will, but the output is not schema-enforced. Reliable structured output requires the xAI API.
- **System prompts (programmatic):** The consumer chat has no exposed system prompt field (unlike AI Studio). You can approximate a system prompt by putting instructions at the top of your first user message, but this is not the same as a proper system-level instruction.
- **Custom assistants or "GPT"-style configurable bots:** Grok does not offer a shareable Gem/GPT-store-style bot builder in the consumer UI. Workspaces (section 2, where available) covers persistent instructions and knowledge files for your own use, but there is no equivalent for publishing a configured assistant to others. This is a high-drift area — verify in-app.

For any of the above, the path is: use the xAI API (section 4).

---

## 4. Expert: xAI API end-to-end

### Console and API key

Go to [console.x.ai](https://console.x.ai). Sign in with your xAI account (separate from your X account; create one at the console). Navigate to **API Keys** in the left sidebar. Click **Create API key**, give it a name, and copy the key immediately — it is shown only once.

Store the key in an environment variable:

```bash
export XAI_API_KEY="xai-REPLACE_ME"
```

Never paste a real key into source code. Always read from environment variables. See [docs.x.ai/overview](https://docs.x.ai/overview) for the current authentication flow, which may add organization or project scoping.

**Plan annotation:** xAI API access requires a **API** account with billing configured. Review current pricing on the console; pricing is per-token and varies by model.

### Model selection

The xAI API exposes a range of Grok model versions. See [docs.x.ai/developers/models](https://docs.x.ai/developers/models) for the current list. Read the model name from an environment variable in all code:

```bash
export XAI_MODEL="grok-4.3"   # replace with current model identifier from docs.x.ai/developers/models
```

Models drift — a name that was current at the time this page was written may be deprecated. Always check [../model-freshness.md](../model-freshness.md) and the [model docs](https://docs.x.ai/developers/models) before deploying.

### The OpenAI-compatible API surface

The xAI API is partially compatible with the OpenAI Python SDK, which means you can often use existing OpenAI-compatible tooling by pointing it at the xAI base URL. This lowers the switching cost for teams that already use OpenAI. The base URL is `https://api.x.ai/v1`.

Using the `openai` Python package:

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["XAI_API_KEY"],
    base_url="https://api.x.ai/v1",
)
model = os.environ.get("XAI_MODEL", "grok-4.3")

response = client.chat.completions.create(
    model=model,
    messages=[
        {"role": "system", "content": "You are a concise technical assistant."},
        {"role": "user", "content": "What is the difference between a process and a thread?"},
    ],
)
print(response.choices[0].message.content)
```

Using `httpx` for teams that prefer a minimal dependency:

```python
import os
import httpx
import json

api_key = os.environ["XAI_API_KEY"]
model = os.environ.get("XAI_MODEL", "grok-4.3")

payload = {
    "model": model,
    "messages": [
        {"role": "system", "content": "You are a concise technical assistant."},
        {"role": "user", "content": "What is the difference between a process and a thread?"},
    ],
}

with httpx.Client() as client:
    response = client.post(
        "https://api.x.ai/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        json=payload,
        timeout=60,
    )
    response.raise_for_status()
    data = response.json()
    print(data["choices"][0]["message"]["content"])
```

Both approaches use the same REST endpoint. The `httpx` version has no AI SDK dependency; the `openai`-package version is more ergonomic for multi-turn conversations.

**Plan annotation:** Both approaches require the **API** tier with billing.

### Function calling

Function calling in the xAI API follows the same OpenAI-style tool-call format. Reference: [docs.x.ai/developers/tools/function-calling](https://docs.x.ai/developers/tools/function-calling).

```python
import os
import json
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["XAI_API_KEY"],
    base_url="https://api.x.ai/v1",
)
model = os.environ.get("XAI_MODEL", "grok-4.3")

tools = [
    {
        "type": "function",
        "function": {
            "name": "lookup_company_info",
            "description": "Returns basic information about a company by name.",
            "parameters": {
                "type": "object",
                "properties": {
                    "company_name": {
                        "type": "string",
                        "description": "The name of the company to look up.",
                    }
                },
                "required": ["company_name"],
            },
        },
    }
]

def lookup_company_info(company_name: str) -> dict:
    # Replace with a real data source in production
    return {"company": company_name, "founded": "PLACEHOLDER", "hq": "PLACEHOLDER"}

response = client.chat.completions.create(
    model=model,
    messages=[{"role": "user", "content": "Tell me about Acme Corp."}],
    tools=tools,
    tool_choice="auto",
)

message = response.choices[0].message

if message.tool_calls:
    tool_call = message.tool_calls[0]
    args = json.loads(tool_call.function.arguments)
    result = lookup_company_info(**args)
    print("Function result:", json.dumps(result))
    # In a full agentic loop, send this result back to the model in a follow-up call
```

The model does not execute the function; it returns a `tool_calls` structure that your code interprets, runs, and feeds back. See [the function calling reference](https://docs.x.ai/developers/tools/function-calling) for the complete multi-turn pattern.

**Plan annotation:** Function calling is **API**. Not available in consumer chat.

### Structured outputs

Structured outputs constrain the model's response to a JSON schema. Reference: [docs.x.ai/developers/model-capabilities/text/structured-outputs](https://docs.x.ai/developers/model-capabilities/text/structured-outputs).

```python
import os
import json
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["XAI_API_KEY"],
    base_url="https://api.x.ai/v1",
)
model = os.environ.get("XAI_MODEL", "grok-4.3")

schema = {
    "type": "object",
    "properties": {
        "title": {"type": "string"},
        "key_points": {
            "type": "array",
            "items": {"type": "string"},
        },
        "action_item": {"type": "string"},
    },
    "required": ["title", "key_points", "action_item"],
}

response = client.chat.completions.create(
    model=model,
    messages=[
        {
            "role": "user",
            "content": "Summarize the main value of automated testing in software development.",
        }
    ],
    response_format={
        "type": "json_schema",
        "json_schema": {
            "name": "summary_schema",
            "schema": schema,
            "strict": True,
        },
    },
)

result = json.loads(response.choices[0].message.content)
print(result)
```

Set `"strict": True` to enforce that the output validates against the schema. If the model cannot satisfy the schema, it returns an error rather than invalid JSON. Verify current schema support for your chosen model version in [the structured output docs](https://docs.x.ai/developers/model-capabilities/text/structured-outputs).

**Plan annotation:** Structured outputs are **API**. Not available in consumer chat.

### Observability, source drift, and maintenance

For production xAI API integrations:

- **Log every request and response** with timestamps, model version, and token counts. This lets you detect when model behavior shifts after a silent update.
- **Pin model identifiers in your environment** using `XAI_MODEL` and document what version was tested. When xAI releases a new model version, test it in a staging environment before promoting. See [../model-freshness.md](../model-freshness.md) for the field guide's drift management protocol.
- **Monitor the [xAI model docs](https://docs.x.ai/developers/models)** for deprecation notices. Build alerts that fire if a model identifier returns a 404 or an unsupported-model error.
- **Eval suite:** Maintain a small set of reference prompts with known expected outputs. Run this suite against every model version change to catch regressions before they reach production.
- **Rate limits and quotas:** The console at [console.x.ai](https://console.x.ai) shows current usage. Build retry logic with exponential backoff for 429 (rate limit) responses.

---

## 5. Level up this workflow

Grok's consumer-side ladder is shorter than ChatGPT's, Claude's, or Gemini's. The consumer chat has fewer configuration options, no shareable custom-assistant builder, and a memory feature reported in beta that is region-dependent (absent in the EU/UK — verify in-app). This means the practical climb often goes directly from consumer chat to the xAI API without an intermediate "power user" tier. Plan for that transition early.

1. **Visit [grok.com](https://grok.com) and send your first message.** Note the default model and the daily message quota. (Free)
2. **Try the model picker.** Switch between available models on the same prompt and compare quality. (Free / Sub)
3. **Attach an image.** Upload a photo and ask a question about it. Confirm image understanding works. (Free / Sub)
4. **Test tone/persona controls (if present).** Look for any style or mode settings in the interface. If none exist, note that this gap is expected and move on. (Sub)
5. **Use Grok on X.** Ask a question about a current trending topic. Compare the answer quality and freshness to a plain Grok consumer chat response. (Free with usage quotas per mid-2026 reporting; Sub raises limits — verify)
6. **Establish a prompt-saving habit.** Keep a text file of your best Grok prompts — there is no native library, so this is the practical substitute. (Free)
7. **Open the xAI console at [console.x.ai](https://console.x.ai).** Create an API key and store it in your environment. (API)
8. **Make your first API call.** Use either the `httpx` or OpenAI-compatible Python example from section 4 with a simple prompt. Confirm you get a response. (API)
9. **Add a system prompt.** Modify your API call to include a system message. Notice how it changes model behavior compared to the consumer chat (which has no exposed system prompt). (API)
10. **Add function calling.** Extend your script to expose one tool and handle the tool-call response. (API)
11. **Add structured output.** Define a JSON schema and confirm the model returns valid, schema-conforming JSON. (API)
12. **Build an eval suite.** Write five reference prompts with expected outputs. Run them on each new model version before promoting. (API)

---

## 6. Guided exercise: brainstorm to structured memo

**Goal:** Use grok.com to brainstorm memo ideas in natural conversation, save the prompt, then port the same prompt to the xAI API with a structured-output schema.

### Part A: brainstorm in the consumer chat

**Step 1 — Open Grok consumer chat.** Go to [grok.com](https://grok.com) and sign in.

**Step 2 — Send the brainstorm prompt.** Paste the following into the chat text box and send:

```
I need to write a one-page personal memo to my manager explaining why I should be allowed to work remotely two days per week. Brainstorm 5 distinct supporting arguments. For each argument, give a one-sentence description and one concrete example.
```

**Step 3 — Review the output.** You should receive five numbered arguments with descriptions and examples. If the model returns fewer, ask it to expand. If the arguments are too generic, add constraints to the prompt: "focus on productivity data" or "emphasize team coordination benefits."

**Step 4 — Refine the prompt.** Adjust the prompt text until you get an output you are happy with. Note the final version of the prompt — this is the prompt you will port to the API.

**Step 5 — Save the prompt.** Copy your final prompt to a text file called `memo_brainstorm_prompt.txt`. This is your saved prompt library entry for this use case.

### Part B: port to the xAI API with structured output

**Step 6 — Set up your environment.** Make sure your environment variables are set:

```bash
export XAI_API_KEY="xai-REPLACE_ME"
export XAI_MODEL="grok-4.3"   # use current model name from docs.x.ai/developers/models
```

**Step 7 — Define a schema.** Create a Python file called `memo_brainstorm.py`. Define a schema that captures the structure you want:

```python
import os
import json
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["XAI_API_KEY"],
    base_url="https://api.x.ai/v1",
)
model = os.environ.get("XAI_MODEL", "grok-4.3")

schema = {
    "type": "object",
    "properties": {
        "arguments": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "argument_title": {"type": "string"},
                    "description": {"type": "string"},
                    "concrete_example": {"type": "string"},
                },
                "required": ["argument_title", "description", "concrete_example"],
            },
            "minItems": 5,
            "maxItems": 5,
        }
    },
    "required": ["arguments"],
}

prompt = (
    "I need to write a one-page personal memo to my manager explaining why I should be "
    "allowed to work remotely two days per week. Provide exactly 5 distinct supporting "
    "arguments. For each argument, include: argument_title (short label), description "
    "(one sentence), and concrete_example (one sentence with a specific example)."
)

response = client.chat.completions.create(
    model=model,
    messages=[
        {"role": "system", "content": "You are a professional writing assistant."},
        {"role": "user", "content": prompt},
    ],
    response_format={
        "type": "json_schema",
        "json_schema": {
            "name": "memo_arguments",
            "schema": schema,
            "strict": True,
        },
    },
)

result = json.loads(response.choices[0].message.content)
for i, arg in enumerate(result["arguments"], 1):
    print(f"\nArgument {i}: {arg['argument_title']}")
    print(f"  Description:     {arg['description']}")
    print(f"  Concrete example: {arg['concrete_example']}")
```

**Step 8 — Run the script.**

```bash
python memo_brainstorm.py
```

**Expected output:** Five printed argument blocks, each with a title, description, and concrete example. The JSON parsing step (`json.loads`) should succeed without errors.

**Step 9 — Compare outputs.** Look at the consumer chat output from Part A and the structured API output from Part B. The content should be similar; the structured version is machine-parseable and could feed downstream code (a document generator, a presentation builder, a database insert).

**Completion check:** You have a saved prompt in a text file (your substitute for a prompt library), and a Python script that returns machine-parseable structured arguments using the xAI API. The same underlying prompt powers both.

---

## 7. Plan availability table

| Feature | Free | Sub (X Premium / SuperGrok) | Team / Ent | API |
|---|---|---|---|---|
| Grok consumer chat at grok.com | Yes, quota-limited | Yes, higher quota | — | — |
| Model picker (mini / fast models) | Yes | Yes | — | Yes |
| Model picker (full / reasoning models) | Limited | Yes | — | Yes |
| Voice input (mobile app) | Yes | Yes | — | — |
| Image input in chat | Yes, limited | Yes | — | Yes |
| Document file input | Limited / drift high | Yes (verify in-app) | — | Yes |
| Grok on X platform | Yes, quota-limited (verify in-app) | Yes, higher limits (X Premium) | — | — |
| Persona / style controls | Limited (drift high) | Yes (verify in-app) | — | System prompt via API |
| Persistent memory | Beta, region-dependent (not EU/UK; drift high) | Yes, beta (region-dependent — verify in-app) | — | Custom storage layer |
| Workspaces / Projects | Limited (verify in-app) | Yes, reported (verify in-app) | — | — |
| Saved prompt library | No (manual workaround) | No (manual workaround) | — | — |
| Chat sharing (public link) | Yes / Sub (drift high) | Yes | — | — |
| Function calling | No | No | No | Yes |
| Structured output (schema-enforced) | No | No | No | Yes |
| System prompts (programmatic) | No | No | No | Yes |
| xAI API access | No | No | — | Yes (billed) |
| OpenAI-compatible client support | No | No | — | Yes |
| Real-time X data context | Quota-limited (Grok on X — verify) | Yes (Grok on X) | — | Check docs.x.ai |

---

## 8. Fallback

Because Grok's consumer surface has fewer configuration options than competing products, the fallback column here is especially important. Where Grok is missing a feature, use the listed alternative while keeping your core prompt portable.

| Feature | If unavailable in Grok | Fallback |
|---|---|---|
| Persistent memory across sessions | Memory reported in beta, region-dependent (absent in EU/UK — verify in-app) | Use a personal context block in a text file; paste at the start of each session. Alternatively, use Claude Projects (free tier includes persistent instructions) or ChatGPT's Memory feature |
| Custom assistant with instructions + knowledge files | No shareable Gem/GPT-store equivalent; Workspaces (where available) covers per-workspace instructions and files | Use Gemini Gems (Sub required) or ChatGPT's GPT builder (free tier allows one custom GPT) or Claude Projects for persistent instruction sets |
| Saved prompt library | No native library | Maintain a text file of prompts manually; use a notes app (Notion, Obsidian) with a dedicated Prompts section |
| Function calling (consumer) | Not available; must use API | If API billing is not set up, approximate tool use by instructing the model to output a JSON "action descriptor" and interpret it manually; or use ChatGPT or Claude consumer chat, which expose limited tool-use features in some plans |
| Structured output (consumer) | Not available; must use API | Ask the model to "respond in JSON format matching this schema" — it usually complies but output is not guaranteed valid; add a json.loads try/except and retry on parse failure |
| Grok on X (region- or gating-restricted) | Real-time X data not available | Use the xAI API's built-in web/X search tools (see [docs.x.ai/developers/tools/overview](https://docs.x.ai/developers/tools/overview)); or use Perplexity for real-time web-sourced answers |
| Deep Research equivalent | DeepSearch/DeeperSearch modes exist on grok.com (introduced Feb 2025; UI naming drifts — verify in-app) | If unavailable on your plan or region, use Gemini Advanced's Deep Research, Perplexity's research mode, or a multi-step agentic loop via the xAI API with web-search tools |
| Agent mode / multi-step automation | Scheduled Tasks/[Automations](https://x.ai/news/grok-automations) reported on the consumer surface as of mid-2026 announcements (some trigger types gated to paid tiers — verify in-app) | For programmatic multi-step agents, build on the xAI API with function calling and your own orchestration loop; or use a hosted agent framework (LangChain, LlamaIndex, or CrewAI) with xAI as the model backend |
| xAI API (billing not set up) | API features unavailable | Use Google AI Studio's free tier with Gemini API for development and testing; the function calling and structured output interfaces are equivalent |
