> **Last verified:** 2026-05-06 · **Drift risk:** high
> **Official sources:** [OpenAI computer use](https://developers.openai.com/api/docs/guides/tools-computer-use), [OpenAI CUA announcement](https://openai.com/index/computer-using-agent/)
> **Drift note (2026-07-18):** the official OpenAI sources for this page could not be re-checked (unreachable from the audit environment). Treat every product-surface detail below — model name, tool type, action schema, `detail`/megapixel limits, migration steps — as a May 2026 snapshot and confirm against the linked official guide before relying on it.

# OpenAI Computer Use

OpenAI announced the Computer-Using Agent (CUA) in [January 2025](https://openai.com/index/computer-using-agent/) and shipped it as a built-in tool in the Responses API. As of the May 2026 verification, the production model was `gpt-5.5` with the `computer` tool type; an earlier `computer-use-preview` model existed but was legacy. Verify the current model name against the [official guide](https://developers.openai.com/api/docs/guides/tools-computer-use).

## How the Responses API computer tool works

OpenAI's computer use is built on the [Responses API](https://developers.openai.com/api/docs/guides/tools-computer-use), not the Chat Completions API. The key difference is that Responses API turns are linked by `previous_response_id`, forming a chain rather than requiring you to re-send the full message history on every call.

The loop:

1. Send a task to the model with `tools=[{"type": "computer"}]`.
2. The model returns a response containing one or more `computer_call` items.
3. Each `computer_call` has an `actions[]` array containing one or more actions to execute.
4. Execute all actions in order.
5. Capture a screenshot.
6. Send the screenshot back as a `computer_call_output` referencing the `call_id`.
7. Repeat until the model returns a response with no `computer_call` items.

A key difference from Anthropic's model: actions are batched. A single `computer_call` might contain `[{"type": "click", "x": 405, "y": 157}, {"type": "type", "text": "penguin"}]`. This reduces round trips and total API calls for common interaction patterns.

## Action types

From the [OpenAI computer use documentation](https://developers.openai.com/api/docs/guides/tools-computer-use):

| Action | Parameters | Notes |
|--------|-----------|-------|
| `screenshot` | None | Capture current screen state |
| `click` | `x`, `y`, `button` (optional) | Single click |
| `double_click` | `x`, `y`, `button` (optional) | Double click |
| `drag` | `path` (array of `[x, y]` points) | Click, drag through path, release |
| `scroll` | `x`, `y`, `scrollX`, `scrollY` | Scroll at position |
| `move` | `x`, `y` | Move cursor without clicking |
| `keypress` | `keys` (array of key names) | Keyboard input (standalone) |
| `type` | `text` | Type a string |
| `wait` | None | Pause ~2 seconds |

For mouse actions that require held modifier keys (Shift+click, Ctrl+drag), use the mouse action's optional `keys` array rather than splitting into separate keypress and mouse actions.

## Coordinate system

OpenAI's approach is simpler than Anthropic's for coordinate handling. Pass screenshots with `detail: "original"` and the model receives them at full resolution (up to 10.24 megapixels). Coordinates in returned actions are 1:1 with the pixels in the screenshot you sent. No scaling math is required.

Strong performance has been documented at 1440x900 and 1600x900 desktop resolutions. The documentation advises against using `detail: "high"` or `detail: "low"` — use `"original"` consistently.

## Code example: full agent loop

From the [OpenAI computer use documentation](https://developers.openai.com/api/docs/guides/tools-computer-use):

```python
import base64
import os
from openai import OpenAI

client = OpenAI()
MODEL = os.getenv("OPENAI_MODEL", "REPLACE_WITH_CURRENT_MODEL")

def computer_use_loop(task: str, page) -> object:
    # Initial request
    response = client.responses.create(
        model=MODEL,
        tools=[{"type": "computer"}],
        input=task,
    )

    while True:
        computer_call = next(
            (item for item in response.output if item.type == "computer_call"),
            None,
        )
        if computer_call is None:
            # No more tool calls — task complete
            return response

        # Execute all actions in the batch
        handle_computer_actions(page, computer_call.actions)

        # Capture updated screen
        screenshot = page.screenshot(type="png")
        screenshot_base64 = base64.b64encode(screenshot).decode("utf-8")

        # Send result back, linking via previous_response_id
        response = client.responses.create(
            model=MODEL,
            tools=[{"type": "computer"}],
            previous_response_id=response.id,
            input=[
                {
                    "type": "computer_call_output",
                    "call_id": computer_call.call_id,
                    "output": {
                        "type": "computer_screenshot",
                        "image_url": f"data:image/png;base64,{screenshot_base64}",
                        "detail": "original",
                    },
                }
            ],
        )
```

The `previous_response_id` parameter is what makes the Responses API convenient: you do not re-send the full conversation history. The API server maintains the context chain server-side.

## Handling actions with Playwright

```python
import time

def handle_computer_actions(page, actions):
    for action in actions:
        match action.type:
            case "click":
                page.mouse.click(action.x, action.y,
                                  button=getattr(action, "button", "left"))
            case "double_click":
                page.mouse.dblclick(action.x, action.y)
            case "drag":
                path = action.path  # list of [x, y]
                page.mouse.move(path[0][0], path[0][1])
                page.mouse.down()
                for x, y in path[1:]:
                    page.mouse.move(x, y)
                page.mouse.up()
            case "scroll":
                page.mouse.move(action.x, action.y)
                page.mouse.wheel(
                    getattr(action, "scrollX", 0),
                    getattr(action, "scrollY", 0)
                )
            case "keypress":
                for key in action.keys:
                    page.keyboard.press(key)
            case "type":
                page.keyboard.type(action.text)
            case "wait":
                time.sleep(2)
            case "screenshot":
                pass  # Handled in the outer loop
```

## Three integration paths

The [OpenAI documentation](https://developers.openai.com/api/docs/guides/tools-computer-use) describes three ways to integrate:

**Path 1: Built-in computer tool** — the approach shown above. Structured UI actions expressed as JSON. Works well for standard web UIs.

**Path 2: Custom harness** — use the `computer` tool as a hint mechanism but execute actions through your own Playwright, Selenium, VNC, or MCP-based infrastructure. Useful when you need specialized interaction behavior the built-in actions do not cover.

**Path 3: Code-execution harness** — instead of a `computer` tool, expose JavaScript execution and a `ask_user` function. The model writes DOM manipulation scripts rather than issuing click coordinates. This approach is more reliable for data extraction workflows where DOM access is more precise than visual coordinate estimation.

## Differences from Anthropic computer use

| Dimension | Anthropic | OpenAI |
|-----------|-----------|--------|
| API family | Messages API (beta) | Responses API |
| Context management | Caller manages message array | Server-side chaining via `previous_response_id` |
| Action batching | One action per turn (older tools) | Multiple actions per `computer_call` |
| Coordinate scaling | Required for most models | Not required with `detail: "original"` |
| Three integration paths | No (primarily screenshot-loop) | Yes (built-in, custom harness, code-exec) |
| Full desktop automation | Yes | Yes |
| Tool spec stability | Beta flag changes with model | GA tool type `computer` (preview deprecated) |

## The CUA research background

The [CUA announcement](https://openai.com/index/computer-using-agent/) describes the system as combining GPT-4o's vision capabilities with reinforcement learning for GUI interaction. Benchmark results from the January 2025 announcement (historical figures for the original CUA model, not current models): 38.1% on OSWorld (full OS automation), 58.1% on WebArena (web browsing agents), 87% on WebVoyager (live web tasks). Human performance on OSWorld was reported as 72.4%, indicating meaningful remaining headroom at the time.

The model processes raw pixel data rather than relying on OS-specific accessibility APIs, which gives it flexibility across operating systems and applications at the cost of precision on dense UI elements.

## Migration from computer-use-preview

If you have code written against the legacy `computer-use-preview` model (as documented at the May 2026 verification — confirm current steps against the official guide):

| Old | New |
|-----|-----|
| `model="computer-use-preview"` | current production model (set via `OPENAI_MODEL`; `gpt-5.5` as of May 2026) |
| `tools=[{"type": "computer_use_preview", "display_width": 1024, "display_height": 768, "environment": "browser"}]` | `tools=[{"type": "computer"}]` |
| Single `action` on each `computer_call` | Batched `actions[]` array |
| `truncation: "auto"` required | Not required |

## Safety guidance

Run computer use in an isolated browser or VM. Keep a human in the loop for high-impact actions (form submissions, purchases, account changes). Treat page content as untrusted input — injected instructions in page text are a documented attack vector. Per [OpenAI's guidance](https://developers.openai.com/api/docs/guides/tools-computer-use), the model is trained to seek user confirmation before finalizing tasks with external side effects.
