# Google AI Studio

> **Last verified:** 2026-05-06 · **Drift risk:** medium · **Partially re-verified:** 2026-07-18
> **Official sources:** [Google AI Studio](https://aistudio.google.com), [Gemini API docs](https://ai.google.dev/gemini-api/docs), [API keys](https://aistudio.google.com/app/apikey), [Quickstart](https://ai.google.dev/gemini-api/docs/quickstart), [Structured outputs](https://ai.google.dev/gemini-api/docs/structured-output), [System instructions](https://ai.google.dev/gemini-api/docs/system-instructions)

---

## What This Surface Is

Google AI Studio is a browser-based workbench for designing, testing, and exporting prompts that use the Gemini API. Think of it as an interactive scratchpad that sits between a chat interface and a production API call. You can:

- Experiment with different Gemini models and compare their responses
- Write and test system instructions without writing any code
- Design structured output schemas and see the JSON response in real time
- Set up function calling definitions and test them interactively
- Copy the working code snippet for Python, JavaScript, Go, REST, and other supported languages directly from the UI

AI Studio is the standard entry point for developers who want to use the Gemini API. Getting your API key happens here, and the prompt testing you do here directly informs the code you write later.

---

## Who It Is Best For

- Developers starting with the Gemini API who want to test prompts before writing application code
- Anyone building a structured extraction pipeline who wants to iterate on the JSON schema interactively
- Researchers or analysts testing system instruction behavior across different models
- Teams who want a shared workspace for evaluating prompt designs

---

## Prerequisites

- A Google account (personal Gmail or Google Workspace)
- A browser; AI Studio is a web application with no local install
- For production API calls beyond the free tier: a Google Cloud project with billing enabled, or a paid AI Studio plan

---

## Step-by-Step Setup

### 1. Sign in to AI Studio

Go to [aistudio.google.com](https://aistudio.google.com) and sign in with your Google account. You will land on the main workbench interface.

### 2. Get an API key

1. Go to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).
2. Click **Create API key**.
3. Associate the key with a Google Cloud project. If you do not have an existing project, the wizard creates one for you.
4. Copy the key immediately and store it securely. The full key value is only shown once.

Set the key as an environment variable for local development:

```bash
export GEMINI_API_KEY=your_api_key_here
```

Add this to your shell profile (`~/.bashrc`, `~/.zshrc`, or equivalent) if you want it to persist across sessions. Per the [Gemini API quickstart](https://ai.google.dev/gemini-api/docs/quickstart), all official code samples assume `GEMINI_API_KEY` is set in the environment.

### 3. Make a test API call

Verify the key works with a minimal REST call. Set `GEMINI_MODEL` to a current model ID from the [Gemini models page](https://ai.google.dev/gemini-api/docs/models) first — model IDs churn too fast to hard-code here (see [model freshness](../model-freshness.md)):

```bash
export GEMINI_MODEL=<current-model-id>
curl "https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent" \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -H 'Content-Type: application/json' \
  -X POST \
  -d '{
    "contents": [
      {
        "parts": [
          {
            "text": "Respond with the single word: working"
          }
        ]
      }
    ]
  }'
```

A successful response returns a JSON object with `candidates[0].content.parts[0].text` equal to "working" (or a close variant).

### 4. Install the Python SDK (optional but recommended for local development)

```bash
pip install -q -U google-genai
```

Equivalent quickstart call in Python per the [official docs](https://ai.google.dev/gemini-api/docs/quickstart), adapted to read the model ID from the environment (see [model freshness](../model-freshness.md)):

```python
import os
from google import genai

# The client reads GEMINI_API_KEY from the environment automatically.
client = genai.Client()

response = client.models.generate_content(
    model=os.environ.get("GEMINI_MODEL", "REPLACE_WITH_CURRENT_MODEL"),
    contents="Explain how AI works in a few words",
)
print(response.text)
```

---

## Building Your First Useful Agent: Structured Extraction from a Clinical Abstract

This worked example uses AI Studio's structured output feature to extract structured fields from a synthetic clinical-style abstract. The scenario is a researcher building a pipeline to index trial data.

### The synthetic abstract

```
Title: Efficacy of once-weekly semaglutide 2.4 mg vs. placebo in adults with
type 2 diabetes and obesity: a randomized controlled trial

Background: Obesity worsens glycemic control in type 2 diabetes. GLP-1 receptor
agonists reduce body weight and improve HbA1c. This trial assessed once-weekly
subcutaneous semaglutide 2.4 mg versus placebo over 52 weeks.

Methods: Adults (n=312) with type 2 diabetes (HbA1c 7.5–10%) and body mass index
≥30 kg/m² were randomized 2:1 to semaglutide 2.4 mg (n=208) or placebo (n=104).
Primary endpoints: change in body weight (%) and HbA1c at 52 weeks.

Results: Mean body weight reduction was −9.6% in the semaglutide group versus
−2.1% in placebo (difference: −7.5 percentage points; 95% CI −8.9 to −6.1;
p<0.001). HbA1c fell by 1.4% in the semaglutide group versus 0.3% in placebo.
Adverse events were predominantly gastrointestinal (nausea 28%, vomiting 12%).

Conclusion: Once-weekly semaglutide 2.4 mg produced significant and clinically
meaningful reductions in body weight and HbA1c in adults with type 2 diabetes.
```

This is synthetic text created for illustration purposes. It does not represent a real clinical trial.

### Define a structured output schema in AI Studio

Open AI Studio, create a new prompt, and set the output format to JSON. Define the schema:

```json
{
  "type": "object",
  "properties": {
    "trial_type": {
      "type": "string",
      "description": "Study design: RCT, observational, review, etc."
    },
    "intervention": {
      "type": "string",
      "description": "The experimental treatment name and dose"
    },
    "comparator": {
      "type": "string",
      "description": "The control arm"
    },
    "sample_size": {
      "type": "integer",
      "description": "Total number of participants"
    },
    "duration_weeks": {
      "type": "integer",
      "description": "Trial duration in weeks"
    },
    "primary_endpoints": {
      "type": "array",
      "items": { "type": "string" },
      "description": "List of primary outcome measures"
    },
    "key_results": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Key quantitative findings as brief strings"
    },
    "safety_notes": {
      "type": "string",
      "description": "Brief summary of adverse events mentioned"
    }
  },
  "required": [
    "trial_type",
    "intervention",
    "comparator",
    "sample_size",
    "duration_weeks",
    "primary_endpoints",
    "key_results",
    "safety_notes"
  ]
}
```

### System instruction

```
You are a clinical trial data extractor. Extract only information explicitly
stated in the text. If a field is not mentioned, return null or an empty array.
Do not infer values that are not present.
```

### The prompt

```
Extract structured information from the following clinical abstract:

[paste the abstract here]
```

### Expected output

AI Studio returns a JSON object matching the schema:

```json
{
  "trial_type": "RCT",
  "intervention": "semaglutide 2.4 mg once weekly subcutaneous",
  "comparator": "placebo",
  "sample_size": 312,
  "duration_weeks": 52,
  "primary_endpoints": [
    "change in body weight (%)",
    "HbA1c at 52 weeks"
  ],
  "key_results": [
    "Body weight: -9.6% semaglutide vs -2.1% placebo (difference -7.5pp, p<0.001)",
    "HbA1c: -1.4% semaglutide vs -0.3% placebo"
  ],
  "safety_notes": "Gastrointestinal events: nausea 28%, vomiting 12%"
}
```

### Export as code

Click **Get code** in AI Studio to get a Python (or other language) snippet that reproduces this exact call. The exported code includes the model name, system instruction, schema, and your API key placeholder, ready to paste into your application.

### Equivalent Python code

```python
import os
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from typing import List, Optional

class ClinicalTrialExtract(BaseModel):
    trial_type: str = Field(description="Study design: RCT, observational, review, etc.")
    intervention: str = Field(description="Experimental treatment name and dose")
    comparator: str = Field(description="Control arm")
    sample_size: int = Field(description="Total number of participants")
    duration_weeks: int = Field(description="Trial duration in weeks")
    primary_endpoints: List[str] = Field(description="List of primary outcome measures")
    key_results: List[str] = Field(description="Key quantitative findings")
    safety_notes: Optional[str] = Field(description="Summary of adverse events")

client = genai.Client()

abstract_text = """[paste abstract here]"""

response = client.models.generate_content(
    model=os.environ.get("GEMINI_MODEL", "REPLACE_WITH_CURRENT_MODEL"),
    contents=abstract_text,
    config=types.GenerateContentConfig(
        system_instruction=(
            "You are a clinical trial data extractor. Extract only information "
            "explicitly stated in the text. Return null for missing fields."
        ),
        response_mime_type="application/json",
        response_json_schema=ClinicalTrialExtract.model_json_schema(),
    ),
)

result = ClinicalTrialExtract.model_validate_json(response.text)
print(result.model_dump_json(indent=2))
```

---

## Customization

### System instructions in AI Studio

In the prompt builder, look for the **System instructions** panel (usually above the main prompt field or in a settings panel). Type your system instruction there. It is sent as the `system_instruction` field in the API request per the [system instructions docs](https://ai.google.dev/gemini-api/docs/system-instructions).

System instructions are model-level context that persists across the conversation. Use them to define the assistant's role, output constraints, and refusal behavior—not to pass per-request data.

### Function calling

AI Studio supports function calling setup in the **Tools** panel. Define function names, descriptions, and parameter schemas. AI Studio will display the model's function call requests and let you provide mock responses, so you can test the full function-calling loop without writing application code.

### Model selection

AI Studio exposes all current Gemini models. For production extraction tasks, a current flash-class model is usually a good balance of speed and accuracy; for complex reasoning tasks, pick the highest-capability pro-class model. Specific model IDs (especially `-preview` suffixed ones) churn too quickly to list here — check [ai.google.dev/gemini-api/docs/models](https://ai.google.dev/gemini-api/docs/models) for the current model list and their capabilities.

---

## Limits and Gotchas

- **Rate limits exist at the free tier.** The free API tier has lower requests-per-minute and requests-per-day limits than paid tiers. For development and testing these are usually sufficient. For production workloads or batch processing, you will need to move to a paid tier or monitor your usage carefully. Check [ai.google.dev/pricing](https://ai.google.dev/pricing) for current limits.
- **Structured output supports a subset of JSON Schema.** The API ignores JSON Schema properties it does not support and may reject very large or deeply nested schemas. Simplify schemas if you encounter errors. See the [structured output docs](https://ai.google.dev/gemini-api/docs/structured-output) for the supported property list.
- **API key security.** Never commit API keys to version control. Use environment variables or a secrets manager. The [AI Studio key page](https://aistudio.google.com/app/apikey) lets you delete and rotate keys at any time.
- **Model names change.** Model identifiers — especially those with "preview" designations — change as models graduate to stable releases, and retired IDs return model-not-found errors. This page's samples read the model from the `GEMINI_MODEL` environment variable for exactly this reason. If a model name in your code returns a 404, check [ai.google.dev/gemini-api/docs/models](https://ai.google.dev/gemini-api/docs/models) for the current name.
- **Free API keys are linked to a Google Cloud project.** Even if you are not using other Google Cloud services, creating an API key requires a project. AI Studio creates one automatically if you do not have one.
- **Streaming is available.** For long responses, use the streaming endpoint to get partial results as they are generated. The Python SDK exposes `generate_content_stream()` for this.

---

## Confirmed by Docs vs. Practical Inference

| Claim | Status |
|-------|--------|
| API key creation at aistudio.google.com/app/apikey | Confirmed by [Gemini API quickstart](https://ai.google.dev/gemini-api/docs/quickstart) |
| `GEMINI_API_KEY` env variable used by all SDK samples | Confirmed by [quickstart](https://ai.google.dev/gemini-api/docs/quickstart) |
| pip install `google-genai` | Confirmed by [quickstart](https://ai.google.dev/gemini-api/docs/quickstart) |
| REST endpoint and header (`x-goog-api-key`) | Confirmed by [API docs](https://ai.google.dev/gemini-api/docs) and [quickstart](https://ai.google.dev/gemini-api/docs/quickstart) |
| Structured output via `response_mime_type` + `response_json_schema` | Confirmed by [structured output docs](https://ai.google.dev/gemini-api/docs/structured-output) |
| System instruction via `GenerateContentConfig.system_instruction` | Confirmed by [system instructions docs](https://ai.google.dev/gemini-api/docs/system-instructions) |
| JSON Schema subset support (ignores unsupported properties) | Confirmed by [structured output docs](https://ai.google.dev/gemini-api/docs/structured-output) |
| AI Studio exposes function calling setup UI | Practical inference based on product description; verify at aistudio.google.com |
| "Get code" export button in AI Studio | Practical inference consistent with AI Studio's stated purpose as a code-export workbench |

---

## Cost and Rate-Limit Notes

The Gemini API has a free tier with lower rate limits and a paid tier with higher limits. Specific prices and rate limit numbers change with each model release and tier restructuring, so they are not listed here. For current pricing, see [ai.google.dev/pricing](https://ai.google.dev/pricing). Qualitatively: the free tier is appropriate for development, low-volume testing, and personal projects. Production workloads that process many documents per hour will typically require a paid plan. AI Studio usage (prompts tested in the browser) does not count against API quotas—only API calls made with your key are billed.

---

## Where to Go Next

- [Gemini CLI](gemini-cli.md) — use the API key you just created to drive a terminal agent
- [Google Antigravity](antigravity.md) — the IDE-based agent built on the same Gemini models
- [Gemini API structured outputs](https://ai.google.dev/gemini-api/docs/structured-output) — full reference for JSON Schema support
- [Gemini API function calling](https://ai.google.dev/gemini-api/docs/function-calling) — build tool-using agents with the API
