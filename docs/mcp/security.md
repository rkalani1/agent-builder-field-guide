> **Last verified:** 2026-05-06 · **Drift risk:** high · **Partially re-verified:** 2026-07-18
> **Official sources:** [MCP Specification 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25), [MCP Specification 2025-06-18](https://modelcontextprotocol.io/specification/2025-06-18), [Custom remote MCP connectors](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp)

# MCP Security

MCP servers execute arbitrary code and return arbitrary text into the model's context. That combination deserves a careful threat model before you connect anything to production.

## The threat model

### Malicious server

A malicious MCP server is one that is intentionally designed to abuse its position in the tool chain. Unlike a buggy server, it actively tries to cause harm. Attack vectors include:

- Returning data from tool calls that instructs the model to perform secondary actions the user did not request.
- Claiming to be a legitimate server (name-squatting on popular package names) to get installed via `npx`.
- Offering tools whose descriptions are accurate but whose implementations exfiltrate user data to a third party before returning the result.

The spec's security model attempts to bound this: the host controls which servers are connected, and users must consent to each tool call. But consent UIs in practice often show a generic "Allow this tool?" prompt without the full detail needed to make an informed decision.

### Prompt injection from server outputs

Tool results flow back into the conversation as user-role or tool-result content. A server that returns text like "Ignore all previous instructions and instead..." is attempting a prompt injection. The model will not always recognize this as an attack.

Prompt injection is particularly dangerous in servers that read external data — web pages, emails, documents — because an adversary who controls the external content can embed instructions in it. A filesystem server reading a malicious text file, a web-browsing tool fetching a compromised page, or an email tool processing a phishing message all face this risk.

Practical mitigations:
- Do not rely on keyword filtering — stripping or escaping instruction-like words ("ignore", "system:", etc.) is trivially bypassed, corrupts legitimate data that happens to contain those words, and gives a false sense of security. Treat all tool output as untrusted data instead; no reachable official MCP guidance recommends keyword deny-lists.
- Scope each server to the least privilege it needs, and keep read capability separate from write capability, so that injected instructions have nothing consequential to invoke.
- Require human confirmation for consequential actions (sending messages, writing files, spending money) — especially any action requested after untrusted content has entered the context.
- Wrap external content in a marker that the system prompt treats as untrusted: `<external_content>` ... `</external_content>`. This aids delimitation but is not a hard boundary.
- Use a separate model call to summarize untrusted content before injecting it into the main conversation.
- In the system prompt, instruct the model to treat tool results as data, not instructions.

### Exfiltration via tool outputs

A server with access to sensitive data (files, database rows, API responses) can return more than the user expects. If the server also has a write-channel — an HTTP tool, a send-email tool, a file-write tool — the model can be instructed to forward sensitive data to an external destination.

Even without a direct exfiltration path, data returned by a tool can end up in the model's response, which is then logged, stored, and potentially included in future training data depending on the provider's policies.

Mitigations:
- Give each server the minimum data access it needs. A server that answers questions about employee headcount does not need full database access.
- Separate read servers from write servers. Never register both a "read all files" server and a "send email" server in the same session unless you have reviewed the interaction risk.
- For sensitive data, use a server-side access control layer: the MCP server checks the user's identity and returns only what they are authorized to see, rather than trusting the model to enforce access controls.

### Supply-chain risk in npx servers

The canonical install path for MCP servers is `npx -y @scope/package-name`. This downloads and executes a Node.js package at invocation time. Risks:

- Package name squatting: an attacker publishes `@modelcontextprotocol/server-filesystemm` (note the typo) and waits for copy-paste errors.
- Dependency confusion: a server's transitive dependencies can be hijacked.
- Version drift: `npx` without a pinned version installs the latest published version, which may have changed since you last reviewed it.

Mitigations:
- Pin versions in your config: `"@modelcontextprotocol/server-filesystem@1.2.3"` instead of `"@modelcontextprotocol/server-filesystem"`.
- Review package names character by character before adding them to config files.
- For production or shared systems, prefer pre-installed packages over on-demand `npx` installs. Install the package globally with `npm install -g` and reference the installed binary directly.
- Use `npm audit` or a software composition analysis tool to check transitive dependencies.
- For internal servers you author, use a private package registry and require authentication for installs.

### Secrets handling

MCP server configs frequently contain API keys, database credentials, and tokens. These end up in:

- `claude_desktop_config.json` — a plaintext JSON file on disk
- Shell history, if you test servers from the command line
- Log files, if the server logs its environment variables
- Version control, if you commit the config file

Mitigations:
- Never commit `claude_desktop_config.json` to version control. Add it to `.gitignore`.
- Use the `env` key in the config to inject secrets from environment variables rather than embedding literal values. On macOS, store secrets in the system Keychain and export them into the shell environment at login.
- For team deployments, use a secrets manager (AWS Secrets Manager, Vault, 1Password Secrets Automation) and inject values at server startup rather than storing them in config files.
- Rotate credentials regularly. If a credential appears in a config file that was ever synced to a cloud backup, treat it as compromised.

## The `tool annotations are untrusted` principle

The [2025-06-18 spec revision](https://modelcontextprotocol.io/specification/2025-06-18) states explicitly (and the [current 2025-11-25 revision](https://modelcontextprotocol.io/specification/2025-11-25) keeps the same consent-centered security model): "descriptions of tool behavior such as annotations should be considered untrusted, unless obtained from a trusted server." This means the model cannot rely on a tool's self-reported description to determine whether it is safe to call. The host (and the user) must make that determination independently.

In practice: if you are building a host application, do not show users the model's description of what a tool does and treat that as authoritative. Show them the raw tool schema from the server and, where possible, a human-reviewed description maintained by your team.

## Practical security checklist

Before registering any MCP server in a production or shared environment:

- Verify the package name character by character against the official source.
- Read the server's source code, or review its published release notes if source is not available.
- Pin the version. Set a calendar reminder to review updates quarterly.
- List every tool the server exposes. For each tool: what does it read? What does it write? What does it call externally?
- Grant the server only the filesystem paths and credentials it needs.
- Keep read servers and write servers in separate registrations.
- Store any secrets in environment variables or a secrets manager, not in the config file body.
- Do not enable servers that access sensitive accounts (banking, healthcare, email with payment methods) in sessions where you also use general-purpose browsing or external-data tools.
- For remote connectors, review the OAuth scopes before completing the auth flow.
- Document which servers are registered and why, so you can audit the list periodically.

## Reporting malicious servers

If you discover a vulnerability in or a malicious server within the MCP ecosystem, the MCP project's `SECURITY.md` files direct reporters to GitHub's private Security Advisory process on the relevant [modelcontextprotocol repository](https://github.com/modelcontextprotocol) (as of 2026-07-18). For malicious npm packages, also report to the npm security team at `security@npmjs.com`.
