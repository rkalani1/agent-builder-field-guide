# Browser and Computer Use

Browser and computer use is the capability that lets an AI model control a graphical interface — clicking buttons, filling forms, reading the screen — rather than calling a structured API. When no API exists or when the task involves software designed for human eyes, this approach is the practical alternative.

## What you will find in this section

| Page | What it covers |
|------|---------------|
| [Comparison](comparison.md) | Side-by-side comparison of Anthropic, OpenAI, and browser-use library approaches |
| [Anthropic computer use](anthropic.md) | Action types, coordinate system, sandbox guidance, and a worked example |
| [OpenAI computer use](openai.md) | Responses API computer tool, batched actions, and differences from Anthropic |
| [browser-use library](browser-use.md) | Python library for LLM-driven browser automation with Playwright |
| [Operating boundaries](boundaries.md) | What must never run unsandboxed: personal browsers, payment accounts, healthcare |

## Why it matters for agent builders

The majority of digital workflows were not designed to be automated by API. Legacy enterprise software, government portals, consumer web apps, desktop applications — they expose a GUI and nothing else. Computer use is what makes agents useful in these contexts.

The capability comes with commensurate risk. An agent that can click through your browser can also accept terms of service, trigger purchases, delete files, or send messages. The [Operating boundaries](boundaries.md) page exists because the risk is not hypothetical.

## The three main approaches

**Model-native computer use** (Anthropic and OpenAI) — the model provider exposes a tool that accepts a screenshot and returns actions. Your code executes the actions, captures a new screenshot, and feeds it back. The model drives the loop.

**Library-based browser automation** (browser-use) — an open-source Python library that wraps Playwright with an LLM agent loop. You specify a goal string. The library handles screenshot capture, DOM extraction, action execution, and context management. You supply the model via the library's own chat-model classes (e.g. `ChatAnthropic`, `ChatOpenAI` from `browser_use`).

**Hosted browser agents** — cloud services that provide a managed browser sandbox with an agent loop. These abstract away the infrastructure entirely but come with latency and data-sovereignty tradeoffs.

## Key terminology

- **Action loop** — the cycle of: capture state → send to model → receive actions → execute → repeat.
- **Sandbox** — an isolated environment (VM, container, dedicated browser profile) that limits what a computer-use agent can affect.
- **Coordinate system** — the pixel coordinate space in which mouse clicks and moves are expressed. Different providers handle display scaling differently.
- **Harness** — the code that bridges model outputs to actual OS or browser actions (mouse clicks, keystrokes, scroll events).
