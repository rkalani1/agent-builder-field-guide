> **Last verified:** 2026-07-18 · **Drift risk:** high (computer use surfaces change with each model release)
> **Official sources:** [Anthropic computer use tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool), [Anthropic computer use launch](https://www.anthropic.com/news/3-5-models-and-computer-use)

# Anthropic Computer Use

Anthropic [introduced computer use in October 2024](https://www.anthropic.com/news/3-5-models-and-computer-use) as a beta capability. It lets Claude see a screenshot of a desktop environment and return actions — mouse moves, clicks, keyboard input — that your code then executes. The loop continues until the task is complete or the model stops returning tool calls.

## Tool versions

There are two current tool type strings:

| Tool type | Beta header | Supported models |
|-----------|-------------|-----------------|
| `computer_20251124` | `computer-use-2025-11-24` | Claude Sonnet 5, Opus 4.8, Opus 4.7, Opus 4.6, Sonnet 4.6, Opus 4.5 |
| `computer_20250124` | `computer-use-2025-01-24` | Sonnet 4.5, Haiku 4.5, Opus 4.1 (deprecated), Sonnet 4 (retired except Bedrock/Google Cloud), Opus 4 (retired except Google Cloud) |

Use the latest tool type with the latest supported model unless you have a specific reason to use an older version. The `computer_20250124` tool version itself is not marked deprecated, but several of the models it supports are deprecated or retired; use `computer_20251124` with a current model.

## Action types

All tool versions support:

- `screenshot` — capture the current display state
- `left_click` — click at `[x, y]`
- `type` — type a text string
- `key` — press a key or key combination (for example, `"ctrl+s"`, `"Return"`)
- `mouse_move` — move cursor to `[x, y]`

`computer_20250124` and later add:

- `scroll` — scroll in any direction with amount control
- `left_click_drag` — click and drag between two coordinate pairs
- `right_click`, `middle_click` — additional mouse buttons
- `double_click`, `triple_click` — repeated clicks
- `left_mouse_down`, `left_mouse_up` — fine-grained control for drag operations
- `hold_key` — hold a key down for a specified duration (seconds)
- `wait` — pause between actions

`computer_20251124` adds only one new action:

- `zoom` — view a specific region at full resolution (requires `enable_zoom: true` in the tool definition and takes a `region` parameter `[x1, y1, x2, y2]`)

## Coordinate system

Screenshots are sent to the API as base64-encoded images. For models before Claude Opus 4.7, the API constrains images to a maximum of 1568 pixels on the longest edge and approximately 1.15 megapixels total. This means a 1512x982 screen gets downsampled before analysis.

Claude analyzes the smaller image and returns click coordinates in that downsampled space. Your code must scale those coordinates back up to screen space before executing them:

```python
import math

def get_scale_factor(width: int, height: int) -> float:
    long_edge = max(width, height)
    total_pixels = width * height
    long_edge_scale = 1568 / long_edge
    pixel_scale = math.sqrt(1_150_000 / total_pixels)
    return min(1.0, long_edge_scale, pixel_scale)

# Resize the screenshot before sending
scale = get_scale_factor(screen_width, screen_height)
scaled_width = int(screen_width * scale)
scaled_height = int(screen_height * scale)

# Scale coordinates back up before executing
def to_screen_coords(x: int, y: int) -> tuple[int, int]:
    return int(x / scale), int(y / scale)
```

Claude Sonnet 5, Opus 4.8, and Opus 4.7 support up to 2576 pixels on the long edge. On all models, coordinates come back in the pixel space of the image you actually sent, so rescaling is only needed when your screen exceeds the model's image limit and you downsize the screenshot.

## API parameters

```python
{
    "type": "computer_20251124",   # or computer_20250124
    "name": "computer",            # must be exactly "computer"
    "display_width_px": 1024,      # actual screen width
    "display_height_px": 768,      # actual screen height
    "display_number": 1,           # optional: X11 display number
    "enable_zoom": True            # optional: computer_20251124 only
}
```

The request also needs the beta header:

```python
betas=["computer-use-2025-11-24"]
```

Each tool definition consumes approximately 735 input tokens. The computer use beta adds 466–499 tokens to the system prompt overhead.

## Sandbox guidance

Anthropic's documentation for [computer use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool) is explicit about the sandbox requirements:

- Run the environment in a dedicated virtual machine or container with minimal privileges.
- Do not give the model access to sensitive accounts, login credentials, or payment methods.
- Restrict internet access to an allowlist of domains.
- Require human confirmation before any action with real-world consequences: form submissions, file deletions, financial transactions, accepting terms of service.

The reference implementation uses Docker with a virtual X11 display server (Xvfb), a lightweight window manager (Mutter), a taskbar (Tint2), a set of pre-installed Linux applications, and an agent loop that bridges Claude's action outputs to the display server. See the [Anthropic computer use demo repository](https://github.com/anthropics/anthropic-quickstarts) for the full reference implementation.

## Worked example (pseudocode)

The following pseudocode illustrates the core agent loop pattern from the [Anthropic documentation](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool). Details like the actual screenshot library, display server interaction, and action executor are environment-specific.

```python
import anthropic
import base64

client = anthropic.Anthropic()

TOOL_DEFINITION = {
    "type": "computer_20251124",
    "name": "computer",
    "display_width_px": 1024,
    "display_height_px": 768,
    "enable_zoom": False,
}

def run_computer_use_task(task: str, max_turns: int = 20) -> str:
    messages = [{"role": "user", "content": task}]

    for turn in range(max_turns):
        response = client.beta.messages.create(
            model="claude-opus-4-7",
            max_tokens=4096,
            tools=[TOOL_DEFINITION],
            messages=messages,
            betas=["computer-use-2025-11-24"],
        )

        # Accumulate the assistant turn
        messages.append({"role": "assistant", "content": response.content})

        # Collect tool calls from this turn
        tool_results = []
        for block in response.content:
            if block.type == "tool_use" and block.name == "computer":
                action = block.input["action"]

                if action == "screenshot":
                    # Capture the display and return it
                    raw = capture_screenshot()  # returns PNG bytes
                    encoded = base64.standard_b64encode(raw).decode()
                    result_content = {
                        "type": "image",
                        "source": {"type": "base64", "media_type": "image/png", "data": encoded}
                    }
                else:
                    # Execute the action (click, type, key, scroll, etc.)
                    execute_action(action, block.input)
                    # Capture updated state
                    raw = capture_screenshot()
                    encoded = base64.standard_b64encode(raw).decode()
                    result_content = {
                        "type": "image",
                        "source": {"type": "base64", "media_type": "image/png", "data": encoded}
                    }

                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": [result_content],
                })

        # If no tool calls were made, the task is complete
        if not tool_results:
            # Extract the final text response
            for block in response.content:
                if hasattr(block, "text"):
                    return block.text
            return "Task complete."

        # Feed results back for the next turn
        messages.append({"role": "user", "content": tool_results})

    return "Max turns reached."
```

Key points from this pattern:

- Every tool call must receive a tool result, even if it is just a confirmation screenshot.
- The loop terminates when the model returns a turn with no `tool_use` blocks.
- Set a `max_turns` guard. Without it, a confused model or a stalled UI can run indefinitely.
- The `stop_reason` in the response can be `"end_turn"` (model finished), `"tool_use"` (more tool calls pending), or `"max_tokens"` (truncated — usually indicates the context is too long).

## Known limitations

From the [Anthropic documentation](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool):

- Latency per turn makes the approach slow for tasks requiring many sequential actions. Target use cases where speed is not critical.
- Coordinate accuracy degrades on high-density displays and on UIs with small click targets. Use the `zoom` action to inspect dense areas before clicking.
- Scrolling reliability, spreadsheet interactions, and multi-application tasks are harder than single-window web tasks.
- Prompt injection via web page content is a documented risk. Treat any text returned from external URLs as potentially adversarial.
