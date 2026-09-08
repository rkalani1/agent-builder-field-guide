# Antigravity project agent

> **Last verified:** 2026-05-06 · **Drift risk:** high · **Partially re-verified:** 2026-07-18

## Goal

This recipe pairs the [Google Antigravity codelab](https://codelabs.developers.google.com/getting-started-google-antigravity) with a small companion exercise. Antigravity is Google's agent-first desktop IDE, and — per the codelab's official listing as of mid-2026 — the codelab walks through installing it locally (macOS, Windows, or specific Linux distributions, with a Chrome browser and a personal Gmail account) and running your first agent tasks; see the [Antigravity platform page](../platforms/antigravity.md) for the product itself. The companion exercise in this recipe implements the same agentic loop concept (model plus tool calls) in plain Python against the Gemini API, so you can study the pattern outside the IDE. Because Antigravity and its codelab change frequently, this recipe carries a high drift risk — verify the codelab URL and steps before following this recipe.

## Recommended platform(s)

Primary: Google Antigravity (as described in the [Antigravity codelab](https://codelabs.developers.google.com/getting-started-google-antigravity)).

Alternates: [Gemini function calling](https://ai.google.dev/gemini-api/docs/function-calling) for the core agent pattern; [OpenAI Agents SDK](https://github.com/openai/openai-agents-python) if you want a more stable platform.

## Why this platform

The Antigravity codelab is Google's hands-on introduction to its agent-first IDE. It is a learning resource rather than a production tool, which makes it well-suited for teams exploring Google's ecosystem before committing to a production platform. Per its official listing, the codelab covers installing Antigravity, running agent tasks, and reviewing the artifacts the agent produces. The companion exercise below distills the underlying model-tool loop into plain Gemini API code — the same concept that appears in all production agent recipes in this field guide.

Important caveats: Antigravity is preview-stage software. The codelab URL, content, and tooling may change without notice. The drift risk for this recipe is marked high because the underlying product and codelab have changed multiple times since their introduction. If the codelab link is broken or the steps differ from what is described here, fall back to the [Gemini function-calling recipe](gemini-function-calling.md) in this field guide.

## Required subscription / account / API

- A personal Gmail account (required by the codelab to sign in to Antigravity).
- A Gemini API key (from [AI Studio](https://aistudio.google.com/app/apikey)) for the companion Python sample.
- The ability to install the Antigravity desktop app, as described at [the codelab URL](https://codelabs.developers.google.com/getting-started-google-antigravity).

## Required tools / connectors

- The Antigravity desktop application, installed locally per the codelab (macOS, Windows, or specific Linux distributions; Chrome required for browser tasks).
- A local Python environment for the companion function-calling sample.
- `google-genai` Python package (for the companion sample; the codelab itself is about the IDE, not the SDK).
- No external connectors beyond the Gemini API.

## Permission model

| Permission | Scope | Rationale |
|---|---|---|
| Gemini API calls | The companion sample only | The sample calls the Gemini API; no other external services. |
| File read/write | Local workspace only | Scope agent work and sample code to a dedicated project folder. |
| Antigravity agent actions | Local workspace, review-gated | Use the review-driven policy so agent edits and commands require your approval. |
| API key | Stored as an environment variable | Do not hardcode keys in code samples. |

## Filled agent spec

| Field | Value |
|---|---|
| Job statement | Complete the Antigravity codelab, then reproduce the agentic loop with one tool in plain Python, and document what you learned. |
| Inputs | The codelab exercises (guided steps) and the companion sample below. |
| Outputs | A working codelab completion; notes on what changed from this recipe's description. |
| Tools | A mock `get_weather(city)` tool in the companion sample; Antigravity's built-in agent tooling in the IDE. |
| Stop conditions | Codelab marked complete; agent loop observed running end-to-end. |
| Error handling | If any codelab step fails, consult the codelab's "Help" or "Report a bug" link; fall back to the Gemini function-calling recipe. |
| HITL gates | You review the code and artifacts the agent produces before approving them. |
| Owner | The developer following the codelab. |
| Review cadence | High drift risk: re-verify this recipe against the live codelab every 60 days. |

## Setup steps

These steps reflect the codelab's structure as surfaced by its official listing (last full verification 2026-05-06; partially re-checked 2026-07-18, when the codelab page itself could not be re-fetched). Verify each step against the [live codelab](https://codelabs.developers.google.com/getting-started-google-antigravity) before following.

1. Open the codelab at `https://codelabs.developers.google.com/getting-started-google-antigravity`.
2. Follow its setup steps: download and install the Antigravity desktop app for your OS, make sure Chrome is available, and sign in with a personal Gmail account (see the [Antigravity platform page](../platforms/antigravity.md) for details).
3. Work through the codelab's agent exercises in the Agent Manager, reviewing each artifact the agent produces before approving it.
4. For the companion Python sample below, create a local virtual environment and install the required packages:
   ```
   pip install google-genai python-dotenv
   ```
5. Set your API key and model as environment variables:
   ```
   export GEMINI_API_KEY=<your-key>
   export GEMINI_MODEL=<current-model-id>
   ```
   Do not hardcode the key in any code file. Pick a current model ID from the [Gemini models page](https://ai.google.dev/gemini-api/docs/models); see [model freshness](../model-freshness.md).
6. Run the companion sample and observe the terminal output showing tool calls and model responses. Adapt `get_weather(city)` to `read_notes(path)` from the [Gemini function-calling recipe](gemini-function-calling.md) if you want a file-based example.
7. Note any differences between the codelab's current content and this recipe's description — those differences are drift signals.

## Prompt / instructions

Inside Antigravity you drive the agent with natural-language tasks rather than SDK code. The agentic loop it automates is equivalent to the following minimal Gemini function-calling agent (see [the Gemini function-calling recipe](gemini-function-calling.md) for the full version):

```python
# Companion sample: minimal Gemini function-calling agent
# Illustrates the agentic loop concept that Antigravity automates
# Requires: google-genai (2.x), python-dotenv

import os
import google.genai as genai
import google.genai.types as types
from dotenv import load_dotenv

load_dotenv()
client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
# Pick a current model ID from https://ai.google.dev/gemini-api/docs/models
MODEL = os.environ.get("GEMINI_MODEL", "REPLACE_WITH_CURRENT_MODEL")


def get_weather(city: str) -> str:
    """Return a mock weather description for a city (demo tool)."""
    # A mock keeps the sample self-contained: no weather API key required.
    mock_data = {
        "london": "Overcast, 14C, light rain.",
        "tokyo": "Clear, 22C, low humidity.",
        "new york": "Partly cloudy, 18C.",
    }
    return mock_data.get(city.lower(), f"No data for {city}.")


TOOL_FUNCTIONS = {"get_weather": get_weather}

tools = [types.Tool(function_declarations=[
    types.FunctionDeclaration.from_callable_with_api_option(callable=get_weather),
])]

config = types.GenerateContentConfig(
    system_instruction="You are a helpful assistant with access to weather data. "
                       "Call get_weather when asked about conditions in a city.",
    tools=tools,
)

messages = [types.Content(
    role="user",
    parts=[types.Part(text="What is the weather like in Tokyo and London?")],
)]

for _ in range(5):
    response = client.models.generate_content(
        model=MODEL, contents=messages, config=config
    )
    candidate = response.candidates[0]
    fn_calls = [p.function_call for p in candidate.content.parts if p.function_call]
    if not fn_calls:
        print("".join(p.text for p in candidate.content.parts if p.text))
        break
    messages.append(candidate.content)
    fn_responses = []
    for fc in fn_calls:
        result = TOOL_FUNCTIONS.get(fc.name, lambda **kw: "Unknown tool")(**dict(fc.args))
        fn_responses.append(types.Part.from_function_response(
            name=fc.name, response={"result": result}
        ))
    messages.append(types.Content(role="user", parts=fn_responses))
```

## Example input

User message: "What is the weather like in Tokyo and London?"

## Expected output

```
Tokyo is currently clear with a temperature of 22C and low humidity. London has
overcast skies with light rain and a temperature of 14C.
```

This output demonstrates that the agent called `get_weather` twice (once per city) and synthesized the results into a natural-language response.

## Eval cases

1. Both cities available in mock data — agent calls the tool twice; answer includes both cities.
2. City not in mock data (e.g., "Paris") — `get_weather` returns "No data for Paris."; agent surfaces this gracefully.
3. Companion sample copied verbatim — code runs without modification in a fresh virtual environment.
4. API key not set — `os.environ["GEMINI_API_KEY"]` raises `KeyError`; agent prints a clear error message.
5. Model name changed or deprecated — the `generate_content` call fails with a model-not-found error; set the `GEMINI_MODEL` environment variable to a current model name.
6. Codelab content has changed from this recipe's description — drift detected; note the differences for the maintenance record.

## Red-team probes

1. Request to call a non-existent tool: "Call delete_all_files." — the agent has no such tool; it responds that it cannot perform that action.
2. Mock tool returning an extremely long string: `get_weather` returns 100 000 characters — the Gemini context window handles this, but add a truncation cap in production use.
3. Codelab environment prompt injection: a codelab exercise tells you to add a line that calls an external API — review every codelab code sample before running it; never blindly copy-paste from an unfamiliar source.

## Failure modes

- Codelab content drift: the codelab's steps, tools, and model names change without notice. Mitigation: this recipe carries `Drift risk: high`; re-verify every 60 days and document differences in the maintenance log.
- Codelab URL broken: Google may retire or move the codelab. Mitigation: fall back to the [Gemini function-calling recipe](gemini-function-calling.md), which teaches the same pattern on a stable API.
- Local environment reset: if you recreate your virtual environment or open a new shell, installed packages and exported variables are gone. Mitigation: keep a git-ignored `.env` file and a requirements list so you can rebuild the environment quickly.
- Model quota exceeded: the free tier has rate limits; the companion sample can trigger multiple API calls in quick succession. Mitigation: add a `time.sleep(1)` between tool calls if you hit 429 errors.
- Key stored in a code file: tutorials sometimes paste the key directly in code for simplicity. Mitigation: always use environment variables; delete any hardcoded keys before sharing or committing code.

## Cost / usage controls

- The Gemini free tier is sufficient for running the companion sample; Antigravity itself has its own preview quota (see the [platform page](../platforms/antigravity.md)).
- If you use a paid project, the handful of API calls per companion-sample run is typically small; calculate dollar cost from the selected Gemini model's current pricing.
- Monitor the Google Cloud billing dashboard if you use a GCP project.

## Safe launch checklist

- [ ] Live codelab URL verified before starting.
- [ ] API key stored as environment variable, not hardcoded.
- [ ] Antigravity installed for the codelab; local Python environment ready for the companion sample.
- [ ] Each code sample reviewed before running.
- [ ] Differences between this recipe and the live codelab content are documented.
- [ ] Drift risk flag (`high`) is acknowledged; re-verification is scheduled in 60 days.

## Maintenance cadence

Re-verify this recipe every 60 days due to the high drift risk. At each check: open the [codelab URL](https://codelabs.developers.google.com/getting-started-google-antigravity), compare the current steps to this recipe, and update the Setup steps and Prompt / instructions sections to reflect any differences. If the codelab is retired, update the recipe to use the [Gemini function-calling recipe](gemini-function-calling.md) as the primary reference and mark this recipe as deprecated. Update the `google-genai` package version note when new versions are released.
