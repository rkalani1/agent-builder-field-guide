#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteDir = path.resolve(process.argv[2] || path.join(repoRoot, "_site"));
const mkdocsConfig = fs.existsSync(path.join(repoRoot, "mkdocs.yml"))
  ? fs.readFileSync(path.join(repoRoot, "mkdocs.yml"), "utf8")
  : "";
const siteUrlMatch = mkdocsConfig.match(/^site_url:\s*(\S+)/m);
const siteBasePath = siteUrlMatch ? new URL(siteUrlMatch[1]).pathname.replace(/\/?$/, "/") : "/";

const failures = [];

function fail(message) {
  failures.push(message);
}

function walk(dir, predicate, found = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if ([".git", "node_modules", ".venv", "venv"].includes(entry.name)) continue;
      walk(full, predicate, found);
    }
    else if (predicate(full)) found.push(full);
  }
  return found;
}

function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function htmlRoute(file) {
  const rel = path.relative(siteDir, file).split(path.sep).join("/");
  if (rel === "index.html") return "/";
  if (rel.endsWith("/index.html")) return `/${rel.slice(0, -"index.html".length)}`;
  return `/${rel}`;
}

function fileForPathname(pathname) {
  const decoded = safeDecode(pathname);
  const siteRelative = siteBasePath !== "/" && decoded.startsWith(siteBasePath)
    ? `/${decoded.slice(siteBasePath.length)}`
    : decoded;
  const clean = siteRelative.replace(/^\/+/, "");
  const candidates = [];

  if (clean === "") {
    candidates.push(path.join(siteDir, "index.html"));
  } else if (siteRelative.endsWith("/")) {
    candidates.push(path.join(siteDir, clean, "index.html"));
  } else {
    candidates.push(path.join(siteDir, clean));
    candidates.push(path.join(siteDir, `${clean}.html`));
    candidates.push(path.join(siteDir, clean, "index.html"));
  }

  return candidates.find((candidate) => fs.existsSync(candidate));
}

function extractAttributes(html, attribute) {
  const pattern = new RegExp(`\\s${attribute}=["']([^"']+)["']`, "gi");
  return Array.from(html.matchAll(pattern), (match) => match[1]);
}

function extractAnchorTargets(html) {
  const ids = new Set();
  for (const attribute of ["id", "name"]) {
    for (const value of extractAttributes(html, attribute)) {
      ids.add(safeDecode(value));
    }
  }
  return ids;
}

if (!fs.existsSync(siteDir)) {
  fail(`Site directory does not exist: ${siteDir}`);
} else {
  const htmlFiles = walk(siteDir, (file) => file.endsWith(".html"));
  const anchorCache = new Map();

  if (htmlFiles.length === 0) fail(`No HTML files found in ${siteDir}`);

  for (const file of htmlFiles) {
    const rel = path.relative(siteDir, file);
    const html = fs.readFileSync(file, "utf8");

    if (!/<title>[^<]+<\/title>/i.test(html)) fail(`${rel}: missing non-empty <title>`);
    if (!/<h1[\s>]/i.test(html)) fail(`${rel}: missing <h1>`);
    if (/:material-[a-z0-9_-]+:/i.test(html)) fail(`${rel}: contains unrendered Material icon shortcode`);

    const route = htmlRoute(file);
    const base = new URL(route, "https://local.test");
    const values = [
      ...extractAttributes(html, "href").map((value) => ({ attr: "href", value })),
      ...extractAttributes(html, "src").map((value) => ({ attr: "src", value })),
    ];

    for (const { attr, value } of values) {
      if (
        value.startsWith("mailto:") ||
        value.startsWith("tel:") ||
        value.startsWith("javascript:") ||
        value.startsWith("data:")
      ) {
        continue;
      }

      let url;
      try {
        url = new URL(value, base);
      } catch {
        fail(`${rel}: invalid ${attr}="${value}"`);
        continue;
      }

      if (url.origin !== "https://local.test") continue;

      if (attr === "href" && /\.md(?:$|[#?])/i.test(url.pathname)) {
        fail(`${rel}: built HTML still links to markdown source: ${value}`);
      }

      const target = fileForPathname(url.pathname);
      if (!target) {
        fail(`${rel}: missing internal ${attr} target ${value}`);
        continue;
      }

      if (url.hash && attr === "href") {
        const fragment = safeDecode(url.hash.slice(1));
        if (!fragment) continue;
        if (!anchorCache.has(target)) {
          anchorCache.set(target, extractAnchorTargets(fs.readFileSync(target, "utf8")));
        }
        if (!anchorCache.get(target).has(fragment)) {
          fail(`${rel}: missing anchor ${value}`);
        }
      }
    }
  }

  const taskBuilderCss = path.join(siteDir, "assets", "stylesheets", "task-builder.css");
  const taskBuilderJs = path.join(siteDir, "assets", "javascripts", "task-builder.js");
  const taskBuilderHtml = path.join(siteDir, "task-builder", "index.html");

  if (!fs.existsSync(taskBuilderHtml)) fail("Task Builder page was not generated");
  if (!fs.existsSync(taskBuilderCss)) fail("Task Builder stylesheet missing from built site");
  if (!fs.existsSync(taskBuilderJs)) fail("Task Builder script missing from built site");

  if (fs.existsSync(taskBuilderCss)) {
    const css = fs.readFileSync(taskBuilderCss, "utf8");
    if (!/\.tb-panel\[hidden\]\s*\{[^}]*display:\s*none\s*!important/i.test(css)) {
      fail("Task Builder stylesheet does not force hidden panels out of layout");
    }
  }

  if (fs.existsSync(taskBuilderJs)) {
    const js = fs.readFileSync(taskBuilderJs, "utf8");
    const executableJs = js.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
    for (const forbidden of [/\bfetch\s*\(/, /\bXMLHttpRequest\b/, /\bWebSocket\b/, /\bsendBeacon\s*\(/]) {
      if (forbidden.test(executableJs)) fail(`Task Builder script contains forbidden network primitive: ${forbidden}`);
    }
  }
}

const requirementsPath = path.join(repoRoot, "requirements.txt");
const requirements = fs.existsSync(requirementsPath)
  ? fs.readFileSync(requirementsPath, "utf8")
  : "";
if (!/^mkdocs-material==9\.7\.6\s*$/m.test(requirements)) {
  fail("MkDocs Material must remain pinned to the browser-tested 9.7.6 release");
}

for (const group of ["Start", "Build", "Connect", "Operate", "Learn", "Reference"]) {
  if (!new RegExp(`^  - ${group}:`, "m").test(mkdocsConfig)) {
    fail(`Missing top-level workflow navigation group: ${group}`);
  }
}
if (!/assets\/javascripts\/portal-nav\.js/.test(mkdocsConfig)) {
  fail("Portal navigation/search readiness script is not registered");
}

const portalScriptPath = path.join(repoRoot, "docs", "assets", "javascripts", "portal-nav.js");
if (!fs.existsSync(portalScriptPath)) {
  fail("Portal navigation/search readiness script is missing");
} else {
  const script = fs.readFileSync(portalScriptPath, "utf8");
  for (const token of [
    "Root cause recorded 2026-07-25",
    "replayStrandedQuery",
    'new KeyboardEvent("keyup"',
    '"aria-live", "polite"',
    'event.key !== "Escape"',
    'event.key !== "ArrowDown"',
  ]) {
    if (!script.includes(token)) fail(`Portal script lacks required behavior: ${token}`);
  }
}

const sourceIndex = fs.readFileSync(path.join(repoRoot, "docs", "index.md"), "utf8");
for (const token of [
  "portal-actions",
  "workflow-ribbon",
  "starter-routes",
  "Open the Task Builder",
  "Start the learning path",
  "<strong>Task</strong>",
  "<strong>Tool</strong>",
  "<strong>Guardrails</strong>",
  "<strong>Test</strong>",
  "<strong>Operate</strong>",
]) {
  if (!sourceIndex.includes(token)) fail(`Home page lacks required post-launch element: ${token}`);
}

const builtIndexPath = path.join(siteDir, "index.html");
if (fs.existsSync(builtIndexPath)) {
  const builtIndex = fs.readFileSync(builtIndexPath, "utf8");
  const topLevelTabs = (builtIndex.match(/data-portal-tab/g) || []).length;
  if (topLevelTabs !== 6) fail(`Expected six workflow tabs, found ${topLevelTabs}`);
}

const searchIndexPath = path.join(siteDir, "search", "search_index.json");
if (!fs.existsSync(searchIndexPath)) {
  fail("Built search index is missing");
} else {
  const searchIndex = fs.readFileSync(searchIndexPath, "utf8").toLowerCase();
  if (!searchIndex.includes("safety")) fail("Built search index lacks the known-result probe: safety");
}

const repoContentChecks = [
  {
    root: path.join(repoRoot, "docs"),
    pattern: /docs\.x\.ai\/docs\/models/i,
    message: "Use canonical xAI model docs URL docs.x.ai/developers/models instead of the redirected /docs/models URL",
  },
  {
    root: path.join(repoRoot, "docs"),
    pattern: /no per-task billing is described|per model request it makes during a task|Copilot coding agent is included in the Copilot Enterprise\/Individual subscription/i,
    message: "Found stale Copilot cloud-agent billing language; cite GitHub Copilot requests instead",
  },
  {
    root: path.join(repoRoot, "docs"),
    pattern: /\b(?:gpt-4o-mini|gpt-4o-2024-08-06)\b|model\s*=\s*["']gpt-4o["']|ChatOpenAI\(model=["']gpt-4o["']/i,
    message: "Use OPENAI_MODEL examples instead of hard-coded older OpenAI model IDs",
  },
  {
    root: path.join(repoRoot, "docs"),
    pattern: /\b(?:under|well under|costs? under|at current|current GPT-4o pricing|lowest-cost|recommended small model)\b[^.\n]*\$[0-9]/i,
    message: "Avoid exact live-cost claims; describe token drivers and link to current pricing instead",
  },
  {
    root: path.join(repoRoot, "starter-kits"),
    pattern: /\b(?:gpt-4o-mini|gpt-4o-2024-08-06)\b|model\s*=\s*["']gpt-4o["']|ChatOpenAI\(model=["']gpt-4o["']/i,
    message: "Use env-var model selection in starter kits instead of hard-coded older OpenAI model IDs",
  },
];

for (const check of repoContentChecks) {
  if (!fs.existsSync(check.root)) continue;
  for (const file of walk(check.root, (candidate) => candidate.endsWith(".md"))) {
    const rel = path.relative(repoRoot, file);
    const text = fs.readFileSync(file, "utf8");
    if (check.pattern.test(text)) fail(`${rel}: ${check.message}`);
  }
}

if (failures.length > 0) {
  console.error(`Site QA failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Site QA passed for ${siteDir}`);
