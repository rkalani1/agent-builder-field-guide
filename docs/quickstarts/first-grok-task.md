> **Last verified:** 2026-05-06 · **Drift risk:** high · **Partially re-verified:** 2026-07-18
> **Official sources:** [xAI structured outputs](https://docs.x.ai/developers/model-capabilities/text/structured-outputs), [xAI models](https://docs.x.ai/developers/models), [xAI API console](https://console.x.ai)

# First Grok task: extract structured fields from a research abstract

This quickstart walks you through using the xAI API to extract named fields from a synthetic academic abstract and return them as a schema-constrained JSON object. By the end you will have a working Python script, a clear mental model of how xAI structured outputs work, and a checklist to verify your results.

---

## Use case

Many document-processing pipelines need to pull specific fields — title, year, methods, conclusion — out of unstructured text. Doing this with a string-matching heuristic is fragile. Asking a language model to return free prose and then parsing that prose is also fragile. The xAI structured outputs feature solves this by constraining the model's response to match a JSON Schema you define, so the output is machine-readable without an intermediate parsing step.

The synthetic abstract used in this quickstart is safe to process: it contains no personal health information, no real author names, and no proprietary data.

---

## Best platform choice and why

Use the **xAI API** ([docs.x.ai](https://docs.x.ai/overview)) for this task.

**Why not Grok consumer chat?** The [Grok consumer chat](https://grok.com) is a browser-based interface. You can paste text and ask Grok to extract fields, but the response is free-form prose or informal JSON that the model generates without any schema enforcement. There is no way to pass a `response_format` parameter, no way to validate the output against a schema, and no way to run the task programmatically across multiple files. For a one-off manual check, consumer chat is fine. For any repeatable extraction pipeline, it is not appropriate.

**Why not Grok on X?** [Grok on X](https://x.com/i/grok) has the same limitations as consumer chat: no developer API and no structured output enforcement, with usage quotas and gating that shift over time (see the [platform overview](../platforms/grok.md)). It is designed for social-product interaction, not document extraction.

**Why the xAI API?** The API exposes the `response_format` parameter with `json_schema` type, which constrains output to your schema for supported schema features, per the [xAI structured outputs documentation](https://docs.x.ai/developers/model-capabilities/text/structured-outputs). Combined with the 1 million token context window of Grok 4.3, the API is well suited to batch extraction tasks of many practical document sizes.

---

## Prerequisites

Before running this quickstart you need:

1. An account on the [xAI Console](https://console.x.ai) and a valid API key.
2. The API key stored in your environment as `XAI_API_KEY`. Never paste it directly into source code.
3. A target model name stored in `XAI_MODEL`. This quickstart was tested with `grok-4.3`.
4. Python 3.10 or later.
5. The `openai` package: `pip install openai`.

---

## Setup steps

1. Create a project directory and a virtual environment:

```bash
mkdir grok-extraction && cd grok-extraction
python -m venv .venv
source .venv/bin/activate
```

2. Install the required package:

```bash
pip install openai
```

3. Export your credentials:

```bash
export XAI_API_KEY=xai-REPLACE_ME
export XAI_MODEL=grok-4.3
```

4. Create the script file `extract_abstract.py` (full content in the next section).

5. Run the script:

```bash
python extract_abstract.py
```

---

## Copyable script

Save the following as `extract_abstract.py`. The script reads the API key and model name from environment variables, sends a synthetic abstract to the xAI API with a `json_schema` response format, and prints the extracted fields.

```python
"""
extract_abstract.py
Use the xAI API to extract structured fields from a synthetic abstract.
Requires: openai >= 1.0, Python 3.10+
"""

import json
import os
import sys

from openai import OpenAI

# --- Configuration ---------------------------------------------------------
# Read credentials and model from the environment. No defaults for the key.
API_KEY = os.environ.get("XAI_API_KEY")
MODEL   = os.environ.get("XAI_MODEL", "grok-4.3")

if not API_KEY:
    sys.exit("Error: XAI_API_KEY environment variable is not set.")

# --- Client ----------------------------------------------------------------
client = OpenAI(
    api_key=API_KEY,
    base_url="https://api.x.ai/v1",
)

# --- Schema ----------------------------------------------------------------
# Define the fields to extract. additionalProperties defaults to false in xAI
# structured outputs (setting it true is unsupported); it is set explicitly here
# for clarity. Verify current schema rules at
# docs.x.ai/developers/model-capabilities/text/structured-outputs
EXTRACTION_SCHEMA = {
    "type": "object",
    "properties": {
        "title": {
            "type": "string",
            "description": "Full paper title exactly as it appears in the text",
        },
        "year": {
            "type": "integer",
            "description": "Four-digit publication year",
        },
        "domain": {
            "type": "string",
            "description": "Broad research domain (e.g., 'computer vision', 'NLP')",
        },
        "methods": {
            "type": "array",
            "items": {"type": "string"},
            "description": "List of methods or algorithms named in the abstract",
        },
        "dataset_size": {
            "type": ["string", "null"],
            "description": "Size of the dataset used, or null if not stated",
        },
        "best_result": {
            "type": "string",
            "description": "The single best quantitative result reported",
        },
        "conclusion": {
            "type": "string",
            "description": "One-sentence conclusion or main finding",
        },
    },
    "required": ["title", "year", "domain", "methods", "dataset_size", "best_result", "conclusion"],
    "additionalProperties": False,
}

SYSTEM_PROMPT = (
    "You are a research-paper parser. Extract the requested fields from the "
    "abstract provided by the user. Return only the JSON object; no commentary."
)

# --- Synthetic input -------------------------------------------------------
SYNTHETIC_ABSTRACT = """
Title: Real-Time Anomaly Detection in Industrial Sensor Streams Using Temporal
Convolutional Networks (2024)

We present a lightweight temporal convolutional network (TCN) architecture for
detecting anomalies in multivariate industrial sensor streams. We evaluate the
approach against an isolation forest baseline and a one-class SVM on the
SensorBench-2023 dataset (42,000 labeled windows from 18 sensor channels).
The TCN achieves an F1 score of 0.913 on the held-out test split, compared to
0.821 for isolation forest and 0.798 for one-class SVM. Inference latency is
under 4 ms per window on a commodity CPU. The results demonstrate that TCN-based
architectures are viable for real-time anomaly detection in resource-constrained
industrial environments.
"""

# --- API call --------------------------------------------------------------
def extract_fields(abstract: str) -> dict:
    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user",   "content": abstract},
        ],
        response_format={
            "type": "json_schema",
            "json_schema": {
                "name":   "paper_extraction",
                "schema": EXTRACTION_SCHEMA,
            },
        },
    )
    raw = response.choices[0].message.content
    return json.loads(raw)


if __name__ == "__main__":
    result = extract_fields(SYNTHETIC_ABSTRACT)
    print(json.dumps(result, indent=2))
```

---

## Example input

The script uses the following synthetic abstract (embedded in the script above):

```
Title: Real-Time Anomaly Detection in Industrial Sensor Streams Using Temporal
Convolutional Networks (2024)

We present a lightweight temporal convolutional network (TCN) architecture for
detecting anomalies in multivariate industrial sensor streams. We evaluate the
approach against an isolation forest baseline and a one-class SVM on the
SensorBench-2023 dataset (42,000 labeled windows from 18 sensor channels).
The TCN achieves an F1 score of 0.913 on the held-out test split, compared to
0.821 for isolation forest and 0.798 for one-class SVM. Inference latency is
under 4 ms per window on a commodity CPU. The results demonstrate that TCN-based
architectures are viable for real-time anomaly detection in resource-constrained
industrial environments.
```

This abstract is entirely synthetic. It contains no personal information, no real author names, and no proprietary data.

---

## Expected output

Running the script should produce output similar to:

```json
{
  "title": "Real-Time Anomaly Detection in Industrial Sensor Streams Using Temporal Convolutional Networks",
  "year": 2024,
  "domain": "time-series anomaly detection",
  "methods": [
    "temporal convolutional network (TCN)",
    "isolation forest",
    "one-class SVM"
  ],
  "dataset_size": "42,000 labeled windows from 18 sensor channels",
  "best_result": "F1 score of 0.913 on the held-out test split",
  "conclusion": "TCN-based architectures are viable for real-time anomaly detection in resource-constrained industrial environments."
}
```

The exact wording of string fields may vary slightly across runs. The schema constrains fields and types; validate programmatically before using the result in production.

---

## Safety boundaries

- Do not feed real personal health information (PHI), personally identifiable information (PII), or proprietary documents through the xAI API unless you have reviewed xAI's data handling and privacy policies.
- Run this script from your terminal, not from a logged-in browser session that might persist credentials in browser storage.
- Scope each run to one file at a time when testing. Only expand to batch processing after you have verified the output schema is correct for your data.
- Do not commit your `XAI_API_KEY` value to source control. Use `.gitignore` to exclude `.env` files.

---

## Eval / check steps

After running the script, verify:

1. **All required fields are present.** The output JSON should have all seven keys: `title`, `year`, `domain`, `methods`, `dataset_size`, `best_result`, `conclusion`. If any are missing, check that `response_format.type` is `"json_schema"` and validate the schema against the xAI documentation.

2. **Types are correct.** `year` should be an integer, not a string. `methods` should be an array of strings. `dataset_size` should be either a string or `null`.

3. **Content is accurate.** Cross-check the extracted values against the abstract. The methods list should contain TCN, isolation forest, and one-class SVM. The best result should be the F1 score.

4. **No extra keys.** Because `additionalProperties` is set to `false` in the schema, the model should not add extra fields. If you see unexpected keys, the schema enforcement may not have applied — check that `response_format.type` is `"json_schema"` and not `"json_object"`.

5. **Validate programmatically** (optional, for production use):

```python
import jsonschema
jsonschema.validate(result, EXTRACTION_SCHEMA)
print("Schema validation passed.")
```

---

## Troubleshooting

**`XAI_API_KEY environment variable is not set`**
You did not export `XAI_API_KEY` before running the script, or you ran the script in a different shell session. Re-export the variable in your current terminal session.

**HTTP 401 Unauthorized**
The API key value is invalid or has been revoked. Generate a new key in the [xAI Console](https://console.x.ai).

**HTTP 400 Bad Request**
The `response_format` schema has a validation error. Common causes: setting `additionalProperties` to `true` when it should be `false`, including a zero-variant `enum`, or using an unsupported keyword such as `items` as an array (use `prefixItems` for tuple validation). See the [structured outputs documentation](https://docs.x.ai/developers/model-capabilities/text/structured-outputs) for the full list of supported and rejected schema features.

**HTTP 429 Too Many Requests**
You have exceeded your API rate limit. Wait and retry. In production, implement exponential backoff.

**Model name error or deprecation warning**
If the value of `XAI_MODEL` refers to a deprecated model identifier, the API may return an error or redirect you to a replacement. Check [docs.x.ai/developers/models](https://docs.x.ai/developers/models) for the current recommended model names and update your `XAI_MODEL` environment variable.

**Output JSON has wrong field values**
The model may have interpreted ambiguous text differently. Refine the `description` strings in `EXTRACTION_SCHEMA` to give the model more precise instructions about each field. The system prompt can also be made more specific.

---

## Next steps

- [Grok platform overview](../platforms/grok.md) — full reference for all three Grok surfaces and their capabilities.
- [Structured output recipe](../recipes/grok-structured-output.md) — scale this pattern to a folder of customer feedback files and produce a CSV.
- [Tool calling recipe](../recipes/grok-tool-calling.md) — give Grok access to local Python functions and let it decide which to call.
