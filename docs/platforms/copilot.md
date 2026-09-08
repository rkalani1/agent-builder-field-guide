# GitHub Copilot Cloud Agent

> **Last verified:** 2026-05-06 · **Drift risk:** high · **Partially re-verified:** 2026-07-18
> **Official sources:** [About GitHub Copilot cloud agent — GitHub Docs](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent), [Copilot usage-based billing for individuals](https://docs.github.com/en/copilot/concepts/billing/usage-based-billing-for-individuals), [Copilot usage-based billing for organizations and enterprises](https://docs.github.com/en/copilot/concepts/billing/usage-based-billing-for-organizations-and-enterprises), [GitHub Copilot: Meet the new coding agent — GitHub Blog](https://github.blog/news-insights/product-news/github-copilot-meet-the-new-coding-agent/)

---

## What this surface is

GitHub Copilot cloud agent (formerly Copilot coding agent) is an autonomous coding agent embedded in GitHub.com. You assign it a GitHub Issue or prompt it via Copilot Chat, and it works independently in a remote GitHub Actions-powered environment: it clones your repository, reads the codebase, creates an implementation plan, makes code changes on a branch, and pushes commits to a draft pull request. You then review the diff, request changes via pull request comments, and merge when satisfied.

This is distinct from Copilot in the IDE (VS Code, JetBrains, Visual Studio, Xcode, Eclipse). IDE Copilot provides inline completions and chat assistance in your local editor. The cloud agent works asynchronously in the background on GitHub, without any local editor involvement. According to the [GitHub Docs](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent): "Copilot cloud agent works autonomously in a GitHub Actions-powered environment to complete development tasks assigned through GitHub issues or GitHub Copilot Chat prompts."

---

## Who it is best for

- Teams with a well-tested codebase who want to delegate low-to-medium complexity tasks from the backlog without assigning a developer.
- Individual developers who want to parallelize work: assign several small issues to Copilot while focusing on complex tasks themselves.
- Organizations that already use GitHub for issue tracking and pull requests and want minimal workflow disruption.

The [GitHub Blog announcement](https://github.blog/news-insights/product-news/github-copilot-meet-the-new-coding-agent/) describes the agent as excelling at "low-to-medium complexity tasks in well-tested codebases": adding features, fixing bugs, extending tests, refactoring code, and improving documentation.

---

## Prerequisites

- A GitHub repository stored on GitHub.com (not repositories owned by managed user accounts, per the [docs](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent)).
- A compatible Copilot plan (see plan table below).
- For Business and Enterprise plans: an administrator must enable the Copilot cloud agent policy before it is available to repository contributors.
- The repository should have a reasonable test suite and clear coding conventions. The agent performs better with existing context to follow.

### Steering the agent with instruction files

GitHub's docs present repository custom instructions as the main lever for improving cloud-agent results: add a `.github/copilot-instructions.md` file for repository-wide guidance (build and test commands, conventions), or `AGENTS.md` files for scoped guidance — the nearest `AGENTS.md` in the directory tree takes precedence. See [Adding repository custom instructions](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions).

### Plan availability

| Plan | Access |
|---|---|
| GitHub Copilot Pro | Available |
| GitHub Copilot Pro+ | Available |
| GitHub Copilot Max | Available; enabled by default |
| GitHub Copilot Student | Available with limited agent usage |
| GitHub Copilot Business | Available; administrator must enable the policy |
| GitHub Copilot Enterprise | Available; administrator must enable the policy |

The Max and Student rows follow GitHub's mid-2026 official announcements; plan lineups change, so check the current [plans overview](https://docs.github.com/en/copilot/get-started/plans) and [access management](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/access-management) pages rather than relying on this table alone.

Per the [docs](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent), repository owners can also opt individual repositories out of the cloud agent.

---

## How to assign an issue to Copilot

The workflow mirrors assigning any issue to a team member on GitHub.

### Method 1: Assign from the Issues page

1. Open the issue on GitHub.com.
2. In the right-hand **Assignees** panel, click the gear icon.
3. Search for or select **Copilot** from the assignee list.
4. Confirm. The agent adds a reaction (eyes emoji) to the issue to indicate it has picked up the task, per the [blog announcement](https://github.blog/news-insights/product-news/github-copilot-meet-the-new-coding-agent/).

### Method 2: Prompt via Copilot Chat on GitHub

Open Copilot Chat on GitHub.com and type `/task` followed by your request. Per the [GitHub Docs](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/use-cloud-agent-on-github), the session inherits the context of the chat conversation, and you can optionally pick a base branch before the agent starts. The docs' own example:

```
/task Create a pull request to put backticks around file names and variables in output.
```

Earlier docs and the launch blog showed an `@github Open a pull request...` mention here; as of mid-2026, the documented GitHub.com chat entry point is `/task` (the `@github` participant remains an IDE-chat concept — see Method 4).

### Method 3: Agents panel or agents page

Per the [GitHub Docs](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/start-copilot-sessions), you can open the agents panel from the navigation bar at the top right of GitHub.com, describe the task in a prompt-first "New agent task" form, and pick the target repository (and, where configured, a custom agent) before the session starts. The same page lists further entry points, including the GitHub CLI, GitHub Mobile, and MCP-enabled IDEs.

### Method 4: Prompt via VS Code

From Copilot Chat in VS Code, ask Copilot to open a pull request. The agent spins up in the cloud and the work happens on GitHub, not in your local editor.

### What happens next

Once assigned, the agent:

1. Boots an ephemeral virtual machine (GitHub Actions runner).
2. Clones the repository.
3. Analyzes the codebase using advanced retrieval augmented generation (RAG) backed by GitHub code search, per the [blog post](https://github.blog/news-insights/product-news/github-copilot-meet-the-new-coding-agent/).
4. Creates a draft pull request and pushes commits as it works.
5. Updates the pull request description with its plan and reasoning.
6. Logs reasoning and validation steps in the agent session logs (visible in the pull request timeline).
7. Tags you for review when done.

You can watch progress in the pull request's session logs in real time.

---

## How reviews work

Once the agent opens a draft pull request, review it as you would any other pull request:

1. Open the draft pull request on GitHub.
2. Review the diff. Check that the changes match the issue intent.
3. To request changes, add a comment in the pull request review, or mention `@copilot` in a PR comment to ask the agent to make specific adjustments. Per the [docs](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent): "Mention `@copilot` in a comment on an existing pull request to ask it to make changes."
4. The agent picks up your comment automatically and pushes additional commits.
5. When satisfied, mark the pull request ready for review and merge per your normal process.

### Security guardrails

The [GitHub Blog](https://github.blog/news-insights/product-news/github-copilot-meet-the-new-coding-agent/) documents the following default policies:

- The agent can only push to branches it created. Your default branch and existing team branches are protected.
- The developer who assigned the task to Copilot cannot approve their own PR from Copilot (the standard "required reviews" rule still applies).
- The agent's internet access is limited to a trusted list of destinations, which can be customized.
- GitHub Actions workflows will not run on the agent's pull request without a human approving them first.
- Existing repository rulesets and organization policies apply to the agent the same as to any contributor.

These policies mean the agent cannot merge its own work or bypass your CI/CD gatekeeping.

---

## Worked example: rename a module and update imports

**Scenario:** You have a Python module called `src/helpers.py` that has been renamed in the codebase discussion to `src/utils.py`, but the rename has not been applied yet. Imports across the project still reference `helpers`. You want Copilot to handle the rename and import updates.

**Step 1 — Write a clear, scoped issue.**

Create a GitHub Issue with a description like:

```
Title: Rename helpers.py to utils.py and update all imports

Background: `src/helpers.py` should be renamed to `src/utils.py` following the
convention agreed in issue #38. All files that currently import from `helpers`
should be updated to import from `utils`. The public API of the module does not
change.

Acceptance criteria:
- `src/helpers.py` is renamed to `src/utils.py`
- All `from helpers import ...` and `import helpers` statements in the project
  are updated to reference `utils`
- Existing tests pass after the change
- No new functionality is added
```

**Step 2 — Assign to Copilot.**

In the Assignees panel on the issue page, select Copilot.

**Step 3 — Wait for the draft PR.**

The agent creates a draft pull request, typically within a few minutes for a small repository. The PR description will summarize the changes planned.

**Step 4 — Review the diff.**

Check that:

- The file has been renamed (not copied).
- All import references in other files have been updated.
- No imports have been missed.
- No unrelated files have been touched.

If you see a missed import or an unintended change, add a review comment:

```
@copilot You missed the import in src/cli/main.py on line 14. Please fix that.
```

The agent responds to the comment and pushes a new commit.

**Step 5 — Confirm tests pass.**

Review the GitHub Actions test run on the PR. If tests are failing, read the session logs to understand why the agent's changes may have caused them.

**Step 6 — Merge.**

When the diff is correct and tests pass, mark the PR ready and merge.

---

## Limits and gotchas

- **The agent performs best on low-to-medium complexity tasks.** Per the [official docs](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent) and [blog post](https://github.blog/news-insights/product-news/github-copilot-meet-the-new-coding-agent/), highly complex architecture decisions, tasks with deep implicit context, or tasks requiring knowledge outside the repository are not well-suited for the agent.
- **Well-tested codebases produce better results.** The agent uses existing tests as validation signals. Sparse or absent tests reduce confidence in the output.
- **The agent cannot merge its own pull requests.** Human review and approval are always required.
- **GitHub Actions workflows do not run on the agent's PR without approval.** This is a security guardrail, but it means you need to manually trigger or approve CI if your workflow requires it.
- **Repository-level opt-out is available.** Owners can exclude specific repositories from the agent, per the [docs](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent).
- **Deep research and planning (research before opening a PR) are only available on GitHub.com.** External integrations (Azure Boards, Jira, Linear, Slack, Teams) only support creating a PR directly, per the [docs](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent).
- **The agent uses MCP servers configured in repository settings** to access data outside GitHub. If your task requires external context (e.g., a Jira ticket), you need to configure the appropriate MCP server.

---

## Confirmed by docs vs. practical inference

| Claim | Source |
|---|---|
| Agent works autonomously in GitHub Actions environment | [Confirmed — GitHub Docs](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent) |
| Available on Pro, Pro+, Max, Business, Enterprise plans; Student has limited agent usage | [Per GitHub Docs, re-checked 2026-07-18 via official-domain search](https://docs.github.com/en/copilot/get-started/plans) |
| Billing moved to usage-based AI credits on 2026-06-01; premium requests are now legacy | [Per GitHub's official announcements, re-checked 2026-07-18 via official-domain search](https://docs.github.com/en/copilot/concepts/billing/usage-based-billing-for-individuals) |
| `/task` in Copilot Chat on GitHub.com and the agents panel are current chat entry points | [Per GitHub Docs, re-checked 2026-07-18 via official-domain search](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/use-cloud-agent-on-github) |
| Administrator must enable policy for Business/Enterprise | [Confirmed — GitHub Docs](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent) |
| Agent pushes to branches it created only | [Confirmed — GitHub Blog](https://github.blog/news-insights/product-news/github-copilot-meet-the-new-coding-agent/) |
| GitHub Actions won't run on agent's PR without human approval | [Confirmed — GitHub Blog](https://github.blog/news-insights/product-news/github-copilot-meet-the-new-coding-agent/) |
| `@copilot` comment triggers agent to make PR changes | [Confirmed — GitHub Docs](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent) |
| Best for low-to-medium complexity tasks in well-tested codebases | [Confirmed — GitHub Blog](https://github.blog/news-insights/product-news/github-copilot-meet-the-new-coding-agent/) |
| Well-written issue with clear acceptance criteria improves output | **Practical inference** — follows from how the agent uses the issue as its primary context; not explicitly documented as a requirement |
| Rename + import update is a suitable agent task | **Practical inference** — fits the "refactoring" category listed in docs, but specific task outcomes are not guaranteed |
| Agent response time for small repositories (a few minutes) | **Practical inference** — observed range; not documented as an SLA |

---

## Cost and rate-limit notes

Per GitHub's June 2026 official announcements, request-based ("premium request") billing was replaced with usage-based billing as of June 1, 2026: cloud-agent sessions consume GitHub AI credits based on the model used and token usage (input, output, and cached tokens), and an agentic session makes many model calls, so complex tasks and frequent steering comments consume credits faster than simple chat. Cloud-agent sessions also use GitHub Actions minutes. Subscribers on annual Pro and Pro+ plans remain on the legacy premium-request model until their plan term ends, per the same announcements. Check the usage-based billing pages for [individuals](https://docs.github.com/en/copilot/concepts/billing/usage-based-billing-for-individuals) and [organizations and enterprises](https://docs.github.com/en/copilot/concepts/billing/usage-based-billing-for-organizations-and-enterprises) and your usage dashboard before assigning many issues in parallel — the previously linked [requests page](https://docs.github.com/en/copilot/concepts/billing/copilot-requests) is now labeled "(legacy)". For Business and Enterprise accounts, administrators can track adoption and pull request throughput using the Copilot usage metrics API.

---

## Where to go next in this guide

- For a local terminal-based coding agent that does not require GitHub, see [Codex CLI](codex.md).
- For building a fully custom agent pipeline in Python with your own tools and control flow, see [OpenAI API and Agents SDK](openai-api.md).
- For automating API calls on a schedule without a hosted service, see [Local Scripts and Schedulers](local-scripts.md).
