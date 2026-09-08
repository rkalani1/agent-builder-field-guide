# OpenAI API and Agents SDK

> **Last verified:** 2026-07-18 · **Drift risk:** medium
> **Official sources:** [openai/openai-agents-python on GitHub](https://github.com/openai/openai-agents-python), [The next evolution of the Agents SDK](https://openai.com/index/the-next-evolution-of-the-agents-sdk/)

---

## What this surface is

The OpenAI API gives you direct programmatic access to OpenAI models via HTTP. The Agents SDK (`openai-agents`) is an open-source Python library layered on top of the API that provides the scaffolding for building multi-step, multi-tool agents: a structured agent loop, tool definitions, agent-to-agent handoffs, guardrails for input and output validation, session memory, and built-in tracing. It is described in the [repository](https://github.com/openai/openai-agents-python) as "a lightweight yet powerful framework for building multi-agent workflows."

Under the hood, the SDK is provider-agnostic: the [README](https://github.com/openai/openai-agents-python) describes it as supporting "the OpenAI Responses and Chat Completions APIs, as well as 100+ other LLMs." For OpenAI models the SDK's models documentation recommends `OpenAIResponsesModel`, which calls OpenAI via the newer Responses API; Chat Completions remains available as the alternative API shape and the common denominator for non-OpenAI providers.

This is the right surface when you need agents that run in your own environment, call arbitrary tools (including code you write), coordinate across multiple specialized sub-agents, or integrate into a larger application. It requires writing Python code and managing your own infrastructure or sandbox.

---

## Who it is best for

- Developers who need automation that goes beyond a single prompt-response cycle.
- Teams building internal tooling where agents must call private APIs or read local files.
- Anyone who needs reproducible, testable agent behavior with version-controlled code.
- Builders who want visibility into agent execution via tracing and structured logging.

---

## Prerequisites

- Python 3.10 or newer. The SDK specifies this as a hard requirement in the [repository](https://github.com/openai/openai-agents-python).
- An OpenAI API key. Generate one at [platform.openai.com/api-keys](https://platform.openai.com/api-keys).
- Familiarity with async Python (`asyncio`, `await`) is helpful but not strictly required — the SDK provides synchronous wrappers.

---

## Step-by-step setup

### 1. Get an API key

1. Log in to [platform.openai.com](https://platform.openai.com).
2. Navigate to **API keys** in the left menu.
3. Click **Create new secret key**, give it a name, and copy the key immediately. It will not be shown again.
4. Set the key as an environment variable. Do not hard-code it in source files.

```bash
export OPENAI_API_KEY="sk-..."
```

For persistent configuration, add this line to your shell profile (`~/.bashrc`, `~/.zshrc`) or use a `.env` file (see [Local Scripts](local-scripts.md) for credential management patterns).

### 2. Create a virtual environment

```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
```

### 3. Install the Agents SDK

```bash
pip install openai-agents
```

For Redis-backed session persistence:

```bash
pip install 'openai-agents[redis]'
```

### 4. Verify the installation

```python
from agents import Agent, Runner
agent = Agent(name="Test", instructions="Reply with 'SDK OK'.")
result = Runner.run_sync(agent, "ping")
print(result.final_output)
```

If the key is set and the installation is correct, this prints a short confirmation response.

---

## Minimal Python example: one tool

```python
import asyncio
from agents import Agent, Runner, function_tool

# Define a tool using the @function_tool decorator.
# Type annotations are used to generate the tool schema automatically.
@function_tool
def word_count(text: str) -> int:
    """Count the number of words in a string."""
    return len(text.split())

agent = Agent(
    name="WordCounter",
    instructions="You are a writing assistant. When asked about word counts, use the word_count tool.",
    tools=[word_count],
)

async def main():
    result = await Runner.run(agent, "How many words are in 'The quick brown fox jumps'?")
    print(result.final_output)

if __name__ == "__main__":
    asyncio.run(main())
```

The `@function_tool` decorator wraps the function and exposes it to the agent. The agent's loop calls the model, receives a tool call request, runs the function, appends the result, and continues until it produces a final text response.

---

## Streaming

The SDK supports streaming agent output. This is useful for long-running tasks or user-facing interfaces where you want to display partial results as they arrive. `Runner.run_streamed()` returns a `RunResultStreaming`; iterate its `stream_events()` to receive events as the run progresses.

```python
import asyncio
from agents import Agent, Runner
from openai.types.responses import ResponseTextDeltaEvent

agent = Agent(name="Summarizer", instructions="Summarize text concisely.")

async def main():
    result = Runner.run_streamed(agent, input="Summarize the water cycle in three sentences.")
    async for event in result.stream_events():
        # event.type is "raw_response_event", "run_item_stream_event",
        # or "agent_updated_stream_event". Text deltas arrive as raw
        # Responses API events on raw_response_event.
        if event.type == "raw_response_event" and isinstance(event.data, ResponseTextDeltaEvent):
            print(event.data.delta, end="", flush=True)
    print()

if __name__ == "__main__":
    asyncio.run(main())
```

---

## Structured output

Set an `output_type` on the agent to receive typed, validated output instead of plain text. The agent loop runs until the model produces a response matching the schema.

```python
import asyncio
from pydantic import BaseModel
from agents import Agent, Runner

class SentimentResult(BaseModel):
    label: str          # "positive", "negative", or "neutral"
    confidence: float   # 0.0 to 1.0

agent = Agent(
    name="SentimentAnalyzer",
    instructions="Classify the sentiment of the input text.",
    output_type=SentimentResult,
)

async def main():
    result = await Runner.run(agent, "This product is surprisingly good.")
    print(result.final_output)          # SentimentResult instance
    print(result.final_output.label)    # "positive"

if __name__ == "__main__":
    asyncio.run(main())
```

---

## Guardrails, handoffs, and tracing

### Guardrails

Guardrails are configurable checks that run on agent input and output. They can block or flag responses that violate rules before or after the model runs. The [SDK repository](https://github.com/openai/openai-agents-python) lists them as a core concept alongside tools and handoffs. Guardrails are defined as Python classes or functions that inspect the input or output and return a pass/fail result.

### Handoffs

A handoff is a mechanism by which one agent transfers control to another. This is how you build multi-agent pipelines: a triage agent routes to a specialized agent based on the content of the input. The [SDK docs](https://openai.github.io/openai-agents-python/handoffs/) explain that handoffs are represented as tools to the LLM — the model invokes a handoff the same way it would invoke a tool, and the SDK transfers control to the target agent. The receiving agent continues the conversation with full context.

```python
from agents import Agent

summarizer = Agent(
    name="Summarizer",
    instructions="Summarize the provided text in two sentences.",
)

classifier = Agent(
    name="Classifier",
    instructions="Classify the input as 'needs summary' or 'needs translation'. If it needs a summary, hand off to the summarizer.",
    handoffs=[summarizer],
)
```

### Tracing

The SDK includes automatic tracing of agent runs. Tracing is extensible: you can add custom spans, disable it, or route trace data to external destinations — the [tracing docs](https://openai.github.io/openai-agents-python/tracing/) list roughly 30 external processor integrations, including Braintrust, Pydantic Logfire, AgentOps, and Scorecard. Tracing is on by default and records the sequence of LLM calls, tool calls, and handoffs — useful for debugging loops that misbehave.

---

## Worked example: a two-tool notes search agent

This agent reads a folder of Markdown notes, searches them for a query, and returns a summary.

```python
import asyncio
import os
from pathlib import Path
from agents import Agent, Runner, function_tool

NOTES_DIR = Path(os.environ.get("NOTES_DIR", "./notes"))  # Set via env var

@function_tool
def search_notes(query: str) -> str:
    """Search all Markdown files in the notes folder for lines containing the query.
    Returns matching lines with their filenames."""
    if not NOTES_DIR.exists():
        return "Notes directory not found."
    results = []
    for md_file in NOTES_DIR.glob("*.md"):
        for i, line in enumerate(md_file.read_text(encoding="utf-8").splitlines(), start=1):
            if query.lower() in line.lower():
                results.append(f"{md_file.name}:{i}: {line.strip()}")
    if not results:
        return f"No matches found for '{query}'."
    return "\n".join(results[:50])  # Limit to 50 lines to avoid context overflow

@function_tool
def read_note(filename: str) -> str:
    """Read the full content of a specific Markdown file from the notes folder."""
    target = NOTES_DIR / filename
    if not target.exists() or not target.suffix == ".md":
        return f"File '{filename}' not found or not a Markdown file."
    return target.read_text(encoding="utf-8")

agent = Agent(
    name="NotesAssistant",
    instructions=(
        "You help users find and understand information in their Markdown notes folder. "
        "Use search_notes to find relevant lines, then read_note to get full context if needed. "
        "Summarize findings clearly. If nothing is found, say so."
    ),
    tools=[search_notes, read_note],
)

async def main():
    query = "meeting notes for Q1 planning"
    result = await Runner.run(agent, f"Find and summarize anything about: {query}")
    print(result.final_output)

if __name__ == "__main__":
    asyncio.run(main())
```

To run this, set the `NOTES_DIR` environment variable to the path of your Markdown folder:

```bash
export NOTES_DIR="/path/to/your/notes"
export OPENAI_API_KEY="sk-..."
python notes_agent.py
```

The agent will search the folder, optionally read specific files for context, and return a prose summary. The `max_turns` parameter on `Runner.run()` (default: 10) caps how many turns the agent can perform; exceeding it raises `MaxTurnsExceeded`. Set it explicitly to match the work you expect the agent to do.

---

## Session memory

The SDK includes `SQLiteSession` for persisting conversation history across multiple `Runner.run()` calls. This enables multi-turn workflows where context carries over between invocations.

```python
from agents import Agent, Runner, SQLiteSession

session = SQLiteSession("user-session-001", "sessions.db")

result1 = await Runner.run(agent, "My name is Alex.", session=session)
result2 = await Runner.run(agent, "What is my name?", session=session)
# result2 should reflect that the agent knows the name is Alex
```

---

## Limits and gotchas

- **The SDK is evolving rapidly.** Check the [GitHub repository](https://github.com/openai/openai-agents-python) for current release notes before building production workflows.
- **`max_turns` defaults to 10.** Exceeding the limit raises `MaxTurnsExceeded`. An agent loop with poorly scoped tools can still burn many model calls within that budget, so set `max_turns` explicitly in production code to control cost rather than relying on the default.
- **Tool functions must be synchronous or properly awaited.** The SDK wraps sync tools automatically, but async tool functions need to be defined with `async def`.
- **Structured output with `output_type` changes the loop exit condition.** The loop will not stop until the model produces a response that validates against the schema. If the schema is too strict or the instructions are ambiguous, the agent may loop repeatedly.
- **Tracing is on by default** and sends data to OpenAI. If you are processing sensitive data, review the tracing configuration and disable or redirect traces as appropriate before running in production.
- **Context window limits apply.** Long session histories or large tool outputs can push the conversation past the model's context limit. Truncate tool output in your tool functions when working with large files.

---

## Confirmed by docs vs. practical inference

| Claim | Source |
|---|---|
| Python 3.10+ required | [Confirmed — SDK README](https://github.com/openai/openai-agents-python) |
| `pip install openai-agents` | [Confirmed — SDK README](https://github.com/openai/openai-agents-python) |
| SDK supports OpenAI Responses and Chat Completions APIs (Responses recommended) | [Confirmed — SDK README](https://github.com/openai/openai-agents-python) |
| Handoffs, guardrails, tracing are core concepts | [Confirmed — SDK README](https://github.com/openai/openai-agents-python) |
| Supported trace destinations (Logfire, AgentOps, etc.) | [Confirmed — SDK tracing docs](https://openai.github.io/openai-agents-python/tracing/) |
| Native sandbox execution in updated SDK | [Confirmed — Agents SDK announcement](https://openai.com/index/the-next-evolution-of-the-agents-sdk/) |
| `max_turns` defaults to 10 (`MaxTurnsExceeded` on overrun) | [Confirmed — SDK source](https://github.com/openai/openai-agents-python) |
| `max_turns` cost risk in production | **Practical inference** — documented parameter but cost implications are inferred from loop behavior |
| 50-line truncation in search tool example | **Practical inference** — recommended pattern, not SDK-specified |

---

## Cost and rate-limit notes

API usage is billed per token (input and output) and per tool-call where applicable. Multi-agent workflows with handoffs and multiple tool calls in a single session accumulate token costs across all turns. Streaming does not reduce costs — it changes delivery latency only. Rate limits are per organization and per model tier. If you hit rate limits in production, implement exponential back-off or use a queue. For development and testing, use a less capable and cheaper model and switch to the production model only for final validation.

---

## Where to go next in this guide

- For a zero-infrastructure terminal agent that operates directly in a code repository, see [Codex CLI](codex.md).
- For cloud-based coding automation tied to GitHub Issues, see [GitHub Copilot Coding Agent](copilot.md).
- For scheduling API-based scripts to run automatically, see [Local Scripts and Schedulers](local-scripts.md).
