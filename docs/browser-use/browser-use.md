> **Last verified:** 2026-05-06 · **Drift risk:** high · **Partially re-verified:** 2026-07-18 (API shapes checked against the official repo; the docs site was unreachable, so install-flow wording is hedged)
> **Official sources:** [browser-use repo](https://github.com/browser-use/browser-use), [browser-use on PyPI](https://pypi.org/project/browser-use/)

# browser-use Python Library

[browser-use](https://github.com/browser-use/browser-use) is an open-source Python library that wraps browser automation with an LLM-driven agent loop. You provide a goal string and a model. The library handles screenshot capture, DOM extraction, action planning, and execution. It is the fastest way to get a working browser agent without building the action loop yourself.

## Installation

Install from PyPI (Python 3.11 or later):

```
pip install browser-use
```

With uv:

```
uv pip install browser-use
```

As of the mid-2026 official README, the quickstart stops there: the library uses a Chrome DevTools Protocol (CDP) client as its browser driver and provisions or attaches to a Chromium/Chrome binary itself. If you already have Chrome or Chromium installed at a standard path, the library can use it directly. (The official docs site could not be re-checked on 2026-07-18; verify against [docs.browser-use.com](https://docs.browser-use.com/) if a browser binary is not found.)

For older pinned versions that still used Playwright as the driver, install Chromium via Playwright's installer:

```
playwright install chromium --with-deps --no-shell
```

For the interactive CLI (similar to `claude` on the command line):

```
pip install "browser-use[cli]"
browser-use
```

## Minimal example

```python
import asyncio, os
from dotenv import load_dotenv
load_dotenv()

from browser_use import Agent
from browser_use.llm import ChatOpenAI

async def main():
    agent = Agent(
        task="Go to news.ycombinator.com, find the top story, and return its title and URL.",
        llm=ChatOpenAI(model=os.environ["OPENAI_MODEL"]),
    )
    result = await agent.run()
    print(result)

asyncio.run(main())
```

The `task` parameter is a natural-language goal string. The library translates this into a loop of: observe the browser state, plan the next action, execute, observe again. The `result` is a string containing whatever the agent decided to return when it determined the task was complete.

Store your API key in a `.env` file:

```
OPENAI_API_KEY=sk-...
OPENAI_MODEL=REPLACE_WITH_CURRENT_MODEL
```

## Using with other model providers

browser-use ships its own multi-provider chat-model classes (it migrated off LangChain), and the `llm` parameter expects one of them. To use Claude:

```python
import os
from browser_use import Agent, ChatAnthropic

agent = Agent(
    task="Find the current price of AAPL on Yahoo Finance and return it.",
    llm=ChatAnthropic(model=os.getenv("ANTHROPIC_MODEL", "REPLACE_WITH_CURRENT_MODEL")),
)
```

To use an open-source model via Ollama:

```python
import os
from browser_use import Agent, ChatOllama

agent = Agent(
    task="Open example.com and return the page title.",
    llm=ChatOllama(model=os.getenv("LOCAL_MODEL", "REPLACE_WITH_CURRENT_MODEL")),
)
```

The library also exposes `ChatBrowserUse` (the class used in the official quickstart) alongside `ChatOpenAI`, `ChatGoogle`, `ChatGroq`, and others in `browser_use.llm`. A raw LangChain model object does not satisfy the library's chat-model interface; if you need to bridge one, use the `ChatLangchain` adapter in the repo's examples directory.

The quality of the browser agent degrades significantly with less capable models. For production use, choose a current frontier-class OpenAI or Claude model. Smaller models tend to get stuck in loops or fail to complete multi-step navigation.

## How it works internally

The library maintains a `BrowserSession` that holds an open browser connection. On each agent step:

1. The library captures the current page state: a screenshot plus structured DOM information (element labels, interactive element coordinates, page text).
2. Both are sent to the LLM with a system prompt that defines the available actions.
3. The LLM returns an action choice (click, type, go_to_url, extract_content, done, etc.).
4. The library executes the action against the browser.
5. The updated state is observed and the loop continues.

The DOM extraction step is a key differentiator from pure vision approaches. Even if a click target is visually ambiguous in the screenshot, the library can identify it precisely via its DOM position. This makes browser-use more reliable on text-heavy pages, single-page apps, and forms.

## Running headless or with a visible browser

By default, the library runs with a visible browser window. For server deployments or automated testing, use headless mode:

```python
from browser_use import Agent, BrowserSession
import os

session = BrowserSession(headless=True)
agent = Agent(
    task="Check the status of api.example.com.",
    llm=ChatOpenAI(model=os.environ["OPENAI_MODEL"]),
    browser_session=session,
)
result = await agent.run()
```

In Docker containers, set `IN_DOCKER=True` in the environment. The official Docker image `browseruse/browseruse` includes the browser binary and all dependencies pre-configured.

## MCP integration

browser-use can load MCP servers and expose their tools to the agent alongside browser actions:

```python
from browser_use import Agent, Tools
from browser_use.mcp.client import MCPClient
from browser_use.llm import ChatOpenAI
import os

async def main():
    tools = Tools()

    filesystem_client = MCPClient(
        server_name="filesystem",
        command="npx",
        args=["-y", "@modelcontextprotocol/server-filesystem", "/Users/me/documents"],
    )
    await filesystem_client.connect()
    await filesystem_client.register_to_tools(tools)

    agent = Agent(
        task="Find the latest PDF report in my documents and summarize its title.",
        llm=ChatOpenAI(model=os.environ["OPENAI_MODEL"]),
        tools=tools,
    )
    await agent.run()
    await filesystem_client.disconnect()

asyncio.run(main())
```

This combines browser navigation with local file access in a single agent. The agent decides whether to use a browser action or an MCP tool at each step.

## Controlling the agent loop

The `Agent.run()` method accepts a `max_steps` parameter (default varies by version) that limits the number of actions before the agent is forced to return. Always set an explicit limit in production:

```python
result = await agent.run(max_steps=25)
```

You can also hook into the loop with callbacks. `Agent(...)` accepts `register_new_step_callback` (called with the browser state summary, the model's output, and the step number) and `register_done_callback`; `Agent.run()` additionally accepts `on_step_start` / `on_step_end` hook functions that receive the `Agent` instance:

```python
async def log_step(browser_state_summary, agent_output, step_number):
    print(f"Step {step_number}: {agent_output}")

agent = Agent(
    task="...",
    llm=ChatOpenAI(model=os.environ["OPENAI_MODEL"]),
    register_new_step_callback=log_step,
)
```

Note: the `Agent` constructor accepts `**kwargs` and silently ignores unknown keyword arguments, so a misspelled callback parameter fails silently rather than raising an error. Verify hook names and signatures against the version you have pinned.

## Persistent browser sessions

For tasks that require maintaining state across multiple agent runs (login sessions, multi-step workflows), reuse a `BrowserSession`:

```python
session = BrowserSession(headless=False)

# First task: log in
agent1 = Agent(task="Log into example.com with user@example.com and password from env.", llm=llm, browser_session=session)
await agent1.run()

# Second task: use the logged-in session
agent2 = Agent(task="Navigate to the settings page and return the account tier.", llm=llm, browser_session=session)
await agent2.run()

await session.close()
```

## Version notes and stability

browser-use is under active development and releases frequently. The library's internal architecture changed significantly in 2025 when it migrated from Playwright to a CDP-first approach. For production deployments, pin to the specific version you tested (the release line was 0.13.x as of 2026-07-18 — check PyPI for the current release):

```
pip install browser-use==<version-you-tested>
```

Check the [PyPI release history](https://pypi.org/project/browser-use/#history) and the repository changelog before upgrading. The `main` branch frequently contains breaking changes; install from tagged releases.

## Known limitations

- Browser-only: cannot automate desktop GUI applications outside the browser.
- The agent loop is opaque by default. If the LLM chooses a wrong action, it may take several steps to self-correct, consuming tokens and time.
- Dynamically rendered single-page apps with complex state can confuse the DOM extractor.
- Tasks that require handling CAPTCHAs, MFA, or complex auth flows often need human intervention at those steps.
- Do not use against your personal browser profile. See [Operating boundaries](boundaries.md).
