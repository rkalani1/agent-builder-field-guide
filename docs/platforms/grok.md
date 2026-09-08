> **Last verified:** 2026-05-06 · **Drift risk:** high · **Partially re-verified:** 2026-07-18
> **Official sources:** [xAI overview](https://docs.x.ai/overview), [xAI models](https://docs.x.ai/developers/models), [xAI API console](https://console.x.ai), [Grok consumer (grok.com)](https://grok.com), [Grok on X](https://x.com/i/grok)

# Grok / xAI platform overview

This page covers the Grok and xAI ecosystem as a platform for building AI agents. It defines the three distinct surfaces available to builders and end users, explains what each surface can and cannot do, and points you toward the setup steps and examples in the rest of this guide.

---

## What this surface is

"Grok" refers to a family of large language models developed by xAI. The name is used across three distinct surfaces that are easy to confuse because they share branding but differ significantly in capability, access model, and suitability for agent work. This guide uses the following definitions throughout:

**Grok consumer chat** (grok.com / Grok mobile app) is a chat product aimed at end users. You sign in with an account on [grok.com](https://grok.com) or use the Grok app on mobile. Interaction is through a browser or app UI. There is no programmatic API on this surface. Features and model tiers can vary by account tier and country of access. This surface is suitable for exploratory conversations and manual tasks, not for automated agents.

**Grok on X** is the Grok integration inside the X social product, accessible at [x.com/i/grok](https://x.com/i/grok). Per mid-2026 reporting, it is available to X users with usage limits; Premium/Premium+ subscriptions raise the limits, and the @grok in-reply feature is reportedly Premium-only as of March 2026 — verify current gating at [help.x.com](https://help.x.com/en/using-x/about-grok). Access is through the X interface. Like the consumer chat, this surface has no developer API, and capabilities depend on your X subscription tier. It is relevant if your workflow is centered on X content, but it does not support function calling or structured outputs.

**xAI API** (documented at [docs.x.ai](https://docs.x.ai/overview)) is the developer-facing REST endpoint. This is the surface relevant to agent builders. It is OpenAI-compatible in its interface conventions — you can reuse much of the OpenAI Python SDK by redirecting the base URL — but this compatibility is partial and not a guarantee of feature parity. The xAI API supports tool calling (function calling), structured outputs, image input, and multi-turn conversations. It requires an API key obtained from the [xAI Console](https://console.x.ai). All code examples in this guide target this surface.

---

## Who it is best for

The xAI API is a good fit if you need:

- A large-context model (Grok 4.3 supports a 1 million token context window, per [xAI docs](https://docs.x.ai/developers/models)) for document-heavy workloads.
- Function calling to orchestrate local tools or external services from a model decision loop.
- Structured JSON output constrained to a supplied schema, for extraction and classification pipelines.
- An OpenAI-compatible interface that lets you reuse existing SDK code with minimal changes.

It is a less natural choice if you need tight integration with non-xAI ecosystems, rely on a specific narrow model that has been announced for deprecation, or require a fully managed agent runtime rather than a raw API.

---

## Prerequisites

The prerequisites differ by surface.

**Grok consumer chat** requires an account on [grok.com](https://grok.com). Free and paid tiers exist. Some capabilities, models, and features are gated by tier or region. No API key is involved.

**Grok on X** requires an X account. Free access carries usage limits; Premium tiers raise them (verify current gating at [help.x.com](https://help.x.com/en/using-x/about-grok)). Access is through [x.com/i/grok](https://x.com/i/grok). No API key is involved.

**xAI API** requires:

1. An account on the [xAI Console](https://console.x.ai).
2. An API key generated from the Console. Store this key as an environment variable; never hard-code it.
3. Python 3.10 or later, and either the `openai` package (`pip install openai`) or the `xai_sdk` package (`pip install xai-sdk`).
4. (Optional) `httpx` if you prefer to make raw HTTP calls without a vendor SDK.

---

## Step-by-step setup for each surface

### Consumer chat setup

1. Go to [grok.com](https://grok.com) and create an account, or sign in.
2. Select a conversation from the sidebar or start a new one.
3. Type your prompt and press Enter.

No further configuration is needed. You cannot add custom tools, inject system prompts programmatically, or retrieve structured responses from this surface.

### Grok on X setup

1. Sign in to an X account. Free access carries usage limits; an X Premium subscription raises them (verify current gating at [help.x.com](https://help.x.com/en/using-x/about-grok)).
2. Navigate to [x.com/i/grok](https://x.com/i/grok) while signed in to your X account.
3. Interact through the X interface.

This surface can search X content natively. It does not accept developer-defined tool schemas.

### xAI API setup

1. Go to [console.x.ai](https://console.x.ai) and sign in or create an account.
2. Create an API key. Copy the key value immediately — it will not be shown again.
3. Set the key in your environment:

```bash
export XAI_API_KEY=xai-REPLACE_ME
export XAI_MODEL=grok-4.3
```

4. Install the OpenAI-compatible Python SDK:

```bash
pip install openai
```

5. Send a minimal test request to confirm connectivity:

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["XAI_API_KEY"],
    base_url="https://api.x.ai/v1",
)

response = client.chat.completions.create(
    model=os.environ["XAI_MODEL"],
    messages=[{"role": "user", "content": "Reply with the word OK only."}],
)
print(response.choices[0].message.content)
```

If you see `OK`, the API key and base URL are correctly configured.

---

## Building your first useful agent on Grok

The following example uses the xAI API to extract structured fields from a short text passage. This is a typical first task for agent builders: give the model a document and get back a well-typed JSON object rather than free prose.

The example uses the `response_format` parameter with a JSON schema, which is [documented in the xAI structured outputs guide](https://docs.x.ai/developers/model-capabilities/text/structured-outputs). When a schema is supplied this way, the response is schema-constrained for supported schema features; production code should still validate the returned object before writing downstream data.

```python
import json
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["XAI_API_KEY"],
    base_url="https://api.x.ai/v1",
)

SCHEMA = {
    "type": "object",
    "properties": {
        "title":   {"type": "string",  "description": "Paper title"},
        "year":    {"type": "integer", "description": "Publication year"},
        "methods": {
            "type": "array",
            "items": {"type": "string"},
            "description": "List of methods mentioned"
        },
        "conclusion": {"type": "string", "description": "One-sentence conclusion"},
    },
    "required": ["title", "year", "methods", "conclusion"],
    "additionalProperties": False,
}

ABSTRACT = """
Title: Automated Classification of Soil Samples Using Hyperspectral Imaging (2023)
We evaluated three classification methods -- SVM, random forest, and a fine-tuned
ResNet-50 -- against a 1,200-sample hyperspectral dataset. ResNet-50 achieved 94.1%
accuracy, outperforming both classical methods. Future work will address class imbalance.
"""

response = client.chat.completions.create(
    model=os.environ["XAI_MODEL"],
    messages=[
        {"role": "system", "content": "Extract the requested fields from the abstract. Return only valid JSON."},
        {"role": "user",   "content": ABSTRACT},
    ],
    response_format={"type": "json_schema", "json_schema": {"name": "paper_fields", "schema": SCHEMA}},
)

result = json.loads(response.choices[0].message.content)
print(json.dumps(result, indent=2))
```

Expected output shape:

```json
{
  "title": "Automated Classification of Soil Samples Using Hyperspectral Imaging",
  "year": 2023,
  "methods": ["SVM", "random forest", "ResNet-50"],
  "conclusion": "ResNet-50 achieved 94.1% accuracy, outperforming both classical methods."
}
```

For a complete walkthrough of this pattern, see the [first Grok task quickstart](../quickstarts/first-grok-task.md).

---

## Customization

**System prompt placement.** On the xAI API, you pass a system prompt as a message with `"role": "system"`. Unlike some other providers, the xAI API has not enforced strict role-ordering constraints — earlier versions of xAI's docs stated that system, user, and assistant roles can be mixed in any sequence, but the current docs page stating this could not be re-verified; treat it as a practical inference and test it. In practice, placing system content first remains the clearest convention.

**Function calling availability by surface.** Tool calling (function calling) is only available through the xAI API. It is not available on Grok consumer chat or Grok on X. On the API, you define tools as JSON Schema objects and pass them in the `tools` array of your request. The model decides whether to invoke a tool, returns a `tool_call` object when it does, and expects you to execute the function locally and return the result. See the [function calling recipe](../recipes/grok-tool-calling.md) for a complete working example.

**Structured outputs availability.** Structured outputs via `response_format` are an API-only capability. They are supported on the currently served models (the Grok 4 family; the docs historically listed support as `grok-2-1212` and later) — verify the supported-models note in the [structured outputs documentation](https://docs.x.ai/developers/model-capabilities/text/structured-outputs). The consumer chat and X surfaces return free-form text only.

**Built-in tools.** The xAI API also offers server-side tools that execute on xAI infrastructure rather than on your machine: web search, X post search, code execution, file attachment search, and others. These are available as named entries in the `tools` array (for example, `{"type": "web_search"}`). Pricing is per-call and separate from token costs.

---

## Limits and gotchas

**Region availability of consumer surfaces.** Grok consumer chat and Grok on X have region-dependent availability. If you are building for end users in multiple countries, check current availability at [grok.com](https://grok.com) because coverage can change. The xAI API does not have the same consumer-facing regional restrictions, but you should review xAI's terms of service for your use case.

**Model naming and deprecation.** The xAI model lineup evolves rapidly, and mid-2026 xAI announcements describe newer flagship models shipped since this page was last fully verified — check the [models page](https://docs.x.ai/developers/models) for the current recommended model for reasoning and agentic workloads rather than relying on any name printed here. `grok-4.3` remains a served model. Several earlier identifiers (`grok-4`, `grok-4-fast`, `grok-4-1-fast`, and others) were retired on 2026-05-15, per the [May 15 retirement notice](https://docs.x.ai/developers/migration/may-15-retirement); requests to retired IDs are reportedly redirected to (and billed as) `grok-4.3`. Always read the model name from an environment variable (`XAI_MODEL`) rather than hard-coding a model identifier, so you can update without changing source code. Using the alias `grok-4.3` without a date suffix pins you to the latest stable version of that model family.

**OpenAI-compatible, but verify.** The xAI API uses the same request shape as the OpenAI API and can be accessed with the OpenAI Python SDK by setting `base_url="https://api.x.ai/v1"`. However, feature parity is not guaranteed. Some OpenAI-specific parameters may be silently ignored or may behave differently. Test any feature you depend on against the xAI API directly, and consult [docs.x.ai](https://docs.x.ai/overview) for authoritative behavior.

**Context window vs. practical limits.** Grok 4.3 advertises a 1 million token context window. Very large contexts will increase latency and cost. Test your specific workload at realistic input sizes before committing to a production design.

**Parallel tool calls.** The API enables parallel function calling by default, meaning the model may request multiple tool calls in a single response. Your tool-execution loop must handle a list of tool calls, not a single call. See the [tool calling recipe](../recipes/grok-tool-calling.md).

---

## Confirmed by docs vs. practical inference

| Claim | Source | Confidence |
|---|---|---|
| xAI API is OpenAI-compatible via `base_url` redirect | [xAI overview](https://docs.x.ai/overview) | Confirmed by docs |
| Grok 4.3 has a 1M token context window | [xAI models](https://docs.x.ai/developers/models) | Confirmed by docs |
| Structured outputs are supported on currently served models (historically `grok-2-1212` and later) | [Structured outputs guide](https://docs.x.ai/developers/model-capabilities/text/structured-outputs) | Practical inference — re-verify the supported-models note |
| Tool calling is API-only, not available on consumer surfaces | [Function calling guide](https://docs.x.ai/developers/tools/function-calling) | Confirmed by docs |
| Consumer chat has no programmatic API | grok.com inspection | Practical inference |
| Grok on X is available with usage limits; @grok in-reply reportedly Premium-only since March 2026 | [help.x.com](https://help.x.com/en/using-x/about-grok) | Practical inference — official page not reachable for re-verification 2026-07-18 |
| `additionalProperties` defaults to `false` in schema enforcement | [Structured outputs guide](https://docs.x.ai/developers/model-capabilities/text/structured-outputs) | Confirmed by docs |
| Role-ordering is flexible (no strict system-first requirement) | Earlier xAI docs versions; current docs page not re-verified | Practical inference |
| Maximum 200 tools per request | Third-party reports; not found in indexed official docs | Practical inference — re-verify against the [function calling guide](https://docs.x.ai/developers/tools/function-calling) |

---

## Cost and rate-limit notes

The xAI API charges per token for text generation and per call for built-in tools such as web search. Pricing is token-based and varies by model; lighter model variants cost less per token than the flagship reasoning model. No specific dollar amounts are listed here because pricing changes frequently — always check [docs.x.ai/developers/models](https://docs.x.ai/developers/models) for current rates.

Rate limits are applied at the API key level. If you hit a rate limit, the API returns a 429 status code. Implement exponential backoff in production code. The [xAI Console](https://console.x.ai) shows your current usage and limit tier.

Structured outputs and function calling do not carry a separate surcharge beyond the underlying token cost of the model's response and the inputs you provide.

---

## Where to go next in this guide

- [First Grok task quickstart](../quickstarts/first-grok-task.md) — end-to-end walkthrough: extract structured fields from a synthetic abstract using the xAI API.
- [Structured output recipe](../recipes/grok-structured-output.md) — convert a folder of plain-text customer feedback into a structured CSV using xAI structured outputs.
- [Tool calling recipe](../recipes/grok-tool-calling.md) — use xAI function calling to let Grok decide between two local Python tools to answer a research question.
