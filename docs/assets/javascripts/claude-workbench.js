document$.subscribe(function () {
  "use strict";

  const surfaceHints = {
    chat: "Claude Chat",
    project: "a Claude Project",
    artifact: "an Artifact",
    research: "Claude Research",
    office: "Word, PowerPoint, or Excel",
    chrome: "Claude in Chrome",
    cowork: "Claude Cowork",
    connectors: "Claude with connectors",
    plugins: "Claude Cowork with plugins",
    mobile: "Claude on iOS or Android",
    code: "Claude Code"
  };

  const modelFitHints = {
    default: "Use Sonnet 4.6 for most everyday work. Use Haiku 4.5 for quick, simple, repeated drafts. Use Opus 4.7 for complex reasoning, code, dense images, or high-stakes review.",
    chat: "Use Sonnet 4.6 for everyday chat. Use Haiku 4.5 for quick rewrites or simple summaries. Use Opus 4.7 when the answer affects a serious decision.",
    project: "Use Sonnet 4.6 for most Project work. Use Opus 4.7 when the Project has many files, conflicting context, or a high-stakes review.",
    artifact: "Use Sonnet 4.6 for most Artifacts. Use Opus 4.7 for complex dashboards, dense visual inputs, or multi-step revisions.",
    research: "Use Sonnet 4.6 for ordinary synthesis. Use Opus 4.7 when the question has many sources, dense documents, or a decision you will publish.",
    office: "Use Sonnet 4.6 for most Word, PowerPoint, and Excel work. Use Opus 4.7 for dense decks, complex workbooks, or source-heavy document review.",
    chrome: "Use Sonnet 4.6 for most browser help. Use Haiku 4.5 for quick page summaries and Opus 4.7 for careful comparisons or risky workflows.",
    cowork: "Use Sonnet 4.6 for routine Cowork sessions. Use Opus 4.7 for longer desktop jobs, many files, or work that needs careful handoff.",
    connectors: "Use Sonnet 4.6 for connected-app work. Use Opus 4.7 when Claude must reconcile several sources or produce a decision-ready answer.",
    plugins: "Use Sonnet 4.6 while testing a plugin. Use Opus 4.7 when the workflow spans several tools, files, or review steps.",
    mobile: "Use Haiku 4.5 or Sonnet 4.6 for quick mobile capture and drafts. Use Opus 4.7 later if the task needs deeper review.",
    code: "Use Sonnet 4.6 for routine repo work. Use Opus 4.7 for architecture, difficult bugs, long-running code work, or vision-heavy debugging."
  };

  const outputHints = {
    useful: "a useful answer with a clear next step",
    email: "an email draft with subject line, body, and optional shorter version",
    document: "a structured document with headings, bullets, and a review checklist",
    slides: "a slide-by-slide outline with title, key point, and speaker note for each slide",
    spreadsheet: "a spreadsheet-friendly table, formula explanation, or analysis checklist",
    design: "a Claude Design or Artifact brief with layout, audience, and usability checks",
    decision: "a decision memo with options, tradeoffs, recommendation, and risks",
    code: "a small code change path with files to inspect, edit steps, and tests to run",
    agent: "an agent workflow brief with trigger, context, steps, allowed actions, checks, and handoff"
  };

  const officeAppsByOutput = {
    document: "Word",
    slides: "PowerPoint",
    spreadsheet: "Excel"
  };

  const missionData = {
    email: {
      title: "Email or message",
      surface: "Chat, iOS or Android, or Word if the message comes from a document.",
      next: "Paste your messy thought, name the recipient, and ask for two versions.",
      prompt: `I need to write an email or message.

Recipient:
[WHO IT IS FOR]

Goal:
[WHAT I WANT TO HAPPEN]

Context:
[PASTE NOTES OR THE THREAD]

Please draft:
1. A clear version.
2. A warmer version.
3. A shorter version.

Use plain language. Do not invent facts. End with what I should verify before sending.`
    },
    document: {
      title: "Document",
      surface: "Word for document editing, Chat for drafting, or a Project for repeated document work.",
      next: "Ask Claude to explain what is already there before changing wording.",
      prompt: `Help me improve this document.

Goal:
[WHAT THE DOCUMENT NEEDS TO DO]

Audience:
[WHO WILL READ IT]

Text or notes:
[PASTE CONTENT]

First, summarize the document in plain language.
Then identify unclear, missing, or risky sections.
Then rewrite the highest-value section first.
Keep the structure easy to review.
End with a short checklist I can use before sharing.`
    },
    slides: {
      title: "Slides",
      surface: "PowerPoint when you have a deck open, or an Artifact when you need a quick visual draft.",
      next: "Start with the story and audience before asking for slide text.",
      prompt: `Help me create or improve slides.

Audience:
[WHO WILL SEE THE DECK]

Goal:
[WHAT THE DECK SHOULD ACCOMPLISH]

Source material:
[PASTE NOTES OR SUMMARY]

Create a slide-by-slide outline with:
- Slide title.
- Main point.
- Suggested visual.
- Speaker note.
- What I should verify.

Keep it simple enough for someone new to the topic.`
    },
    spreadsheet: {
      title: "Spreadsheet",
      surface: "Excel when the workbook is open, or Chat when you only need explanation.",
      next: "Ask Claude to explain the workbook before asking it to analyze or change anything.",
      prompt: `Help me understand this spreadsheet.

Goal:
[WHAT I NEED TO KNOW OR CREATE]

Workbook context:
[PASTE COLUMN NAMES, FORMULAS, OR A SMALL SAMPLE]

First, explain what the data appears to show.
Then identify formulas, columns, or assumptions I should check.
Then suggest the cleanest table, chart, formula, or analysis.
Do not guess missing values.
End with checks that could catch mistakes.`
    },
    design: {
      title: "Design",
      surface: "Artifact or Claude Design for one-pagers, prototypes, visual drafts, and presentation-style work.",
      next: "Tell Claude who will use it and what should be clear at first glance.",
      prompt: `Create a simple, useful design draft.

Thing to create:
[PAGE, ONE-PAGER, PROTOTYPE, VISUAL, OR PRESENTATION]

Audience:
[WHO WILL USE IT]

Job it must do:
[WHAT SHOULD BE CLEAR OR POSSIBLE]

Make it:
- Easy to understand at first glance.
- Practical, not decorative.
- Clear for a beginner.
- Simple to revise.

Before finalizing, critique the layout and improve the weakest part.`
    },
    research: {
      title: "Research",
      surface: "Claude Research when the question needs several sources, citations, or connected app context.",
      next: "Turn on Research, name the sources to prioritize, and ask for a short answer first.",
      prompt: `Use Research for this question.

Question:
[WHAT I NEED TO UNDERSTAND]

Context:
[WHY I NEED IT]

Sources I have:
[PASTE LINKS, NOTES, CONNECTED SOURCES, OR TEXT IF AVAILABLE]

Return:
1. The short answer.
2. Citations I can check.
3. Confirmed facts, reasonable inferences, and what still needs checking.
4. A beginner-friendly explanation.
5. The safest practical next step.

Do not make unsupported claims. Tell me what evidence would change the answer.`
    },
    connect: {
      title: "Connect apps",
      surface: "Claude or Desktop Customize for connectors; Cowork Customize for plugins.",
      next: "Start with one trusted service, review permissions, then test on non-sensitive material.",
      prompt: `Help me decide what to connect to Claude.

Workflow:
[WHAT I WANT CLAUDE TO HELP WITH]

Apps or services I use:
[DRIVE, EMAIL, CALENDAR, SLACK, LINEAR, DOCS, OR OTHER]

Information Claude may use:
[WHAT IT CAN READ OR SEARCH]

Actions Claude may take:
[WHAT IT CAN DO]

Actions that need my approval:
[WHAT CLAUDE MUST ASK BEFORE DOING]

Return:
1. The first connector or plugin to set up.
2. Why it helps this workflow.
3. The permissions I should review.
4. A safe first test.
5. A reusable prompt for after setup.`
    },
    browser: {
      title: "Website task",
      surface: "Claude in Chrome when you want help reading, navigating, comparing, or filling a website.",
      next: "Use low-risk tasks first and ask Claude to explain before acting.",
      prompt: `Help me with this website.

Goal:
[WHAT I AM TRYING TO DO]

Rules:
- Explain what you see before taking action.
- Ask before clicking anything that submits, deletes, posts, sends, changes settings, or shares information.
- Tell me when something looks risky or uncertain.
- Keep me in control of the final decision.

Start by giving me the safest next step.`
    },
    cowork: {
      title: "Cowork task",
      surface: "Claude Cowork when the work needs selected files, folders, desktop apps, or a longer task session.",
      next: "Start with a low-risk review and ask Claude to explain its approach before acting.",
      prompt: `Help me run this Claude Cowork task safely.

Goal:
[WHAT I WANT DONE]

Material Claude may use:
[FILES, FOLDERS, APPS, OR CONNECTORS]

Rules:
- Explain your approach before acting.
- Ask before changing, sending, deleting, posting, sharing, or opening sensitive material.
- Keep a short progress log.
- Stop if access, uncertainty, or risk is unclear.

Start by telling me the safest first action and what you need from me.`
    },
    meeting: {
      title: "Meeting prep",
      surface: "Chat or a Project if you prepare for similar meetings often.",
      next: "Give Claude the meeting goal, people involved, and notes you already have.",
      prompt: `Help me prepare for a meeting.

Meeting goal:
[WHAT I NEED FROM THE MEETING]

People involved:
[WHO WILL BE THERE]

Context:
[PASTE NOTES, EMAILS, OR BACKGROUND]

Create:
1. A short briefing.
2. The five most important talking points.
3. Questions I should ask.
4. Decisions or follow-ups to capture.
5. A simple opening message.

Keep it practical and easy to scan.`
    },
    code: {
      title: "Code help",
      surface: "Claude Code for repository work, or Chat for learning a concept before editing.",
      next: "Describe the change plainly and ask Claude to inspect before editing.",
      prompt: `Help me with this codebase in plain English.

Task:
[WHAT I WANT CHANGED OR EXPLAINED]

Before editing:
- Explain what the relevant part of the project does.
- Identify the files likely involved.
- Tell me the smallest useful change.

While working:
- Keep changes focused.
- Avoid unrelated cleanup.
- Run the relevant check if one exists.

Afterward, summarize what changed and what I should test.`
    },
    agent: {
      title: "Agent workflow",
      surface: "A Project for a repeatable personal workflow, Claude Code for repository automation, or the Agent SDK for a hosted agent.",
      next: "Describe the job, the trigger, allowed actions, review points, and what success looks like.",
      prompt: `Help me design an agentic workflow with Claude.

Workflow goal:
[WHAT THE AGENT SHOULD HELP WITH]

Trigger:
[WHEN IT SHOULD RUN OR WHEN I SHOULD START IT]

Inputs:
[FILES, WEBSITES, NOTES, ISSUES, OR MESSAGES IT CAN USE]

Allowed actions:
[WHAT IT MAY DO]

Actions that need my approval:
[WHAT IT MUST ASK BEFORE DOING]

Success looks like:
[WHAT A GOOD RESULT MEANS]

Return:
1. The simplest version I can try in Claude Chat or a Project.
2. The checks that prevent mistakes.
3. The handoff I should review.
4. What would need Claude Code, GitHub Actions, or the Agent SDK later.`
    },
    lectureToPpt: {
      title: "Lecture to PPT",
      surface: "PowerPoint with Claude, or Word if your lecture notes are a document.",
      next: "Paste your Word lecture text or bullet points, and ask Claude to structure it into presentation cards.",
      prompt: `Transform this lecture content into a structured slide presentation outline.

Lecture notes:
[PASTE LECTURE CONTENT]

Audience:
[WHO WILL HEAR/SEE THE LECTURE]

Goal:
Create a logical, highly engaging narrative flow that fits onto a PowerPoint deck.

Return a slide outline structure:
- Slide Title (bold, active voice)
- Core Message (1-2 sentences in plain language)
- Supporting Data/Checklist (max 3 items)
- Slide Layout Suggestion (e.g., split-column, timeline, diagram)
- Speaker Note (conversational guideline, what you would say aloud)

Keep it concise and clear for a beginner. Avoid walls of text on the slides.`
    },
    infographic: {
      title: "Medical Infographic",
      surface: "Claude Design or Artifacts to preview visual drafts, or Chat to generate copy.",
      next: "Paste your clinical guidelines or trial data, and ask for a visual layout blueprint or code.",
      prompt: `Create a professional medical infographic design using best practices in data visualization.

Clinical Data / Topic:
[PASTE GUIDELINES, STUDY DATA, OR MEDICAL INFORMATION]

Audience:
[e.g., Vascular Neurologists, Residents, Patients, Public]

Infographic Rules:
- Prioritize high visual contrast and premium colors (e.g., oklch, curated dark/light palettes).
- Use a single, clear structural hierarchy (e.g., timeline, checklist, flow chart).
- Avoid defaults and placeholders. Recommend specific symbols, icons, and visual guides.

Please output:
1. Structural Layout Blueprint (Header, grid sections, footer).
2. Key Visual Elements & Color Codes (curated palette).
3. Text Copy (extremely brief, data-driven, maximum impact).
4. Direct HTML/SVG code to preview the infographic in Claude Artifacts.`
    }
  };

  const fixData = {
    vague: {
      title: "Too vague",
      next: "Claude sounds reasonable but you still cannot act on the answer.",
      prompt: `Make your last answer specific enough that I can act on it today.

Revise it with:
1. Concrete steps.
2. Examples where helpful.
3. Clear decision points.
4. What I should do first.
5. What I should ignore for now.

Keep the language simple.`
    },
    wrong: {
      title: "Possibly wrong",
      next: "a fact, assumption, calculation, or interpretation may be incorrect.",
      prompt: `Review your last answer for possible errors.

Do not defend the answer.
Compare each important claim to the context I provided.

Return:
1. What might be wrong.
2. What information is missing.
3. What needs checking.
4. A corrected answer that separates confirmed facts from uncertainty.`
    },
    long: {
      title: "Too long",
      next: "the answer is useful but too hard to scan.",
      prompt: `Shorten your last answer.

Give me:
1. The shortest useful version.
2. The three details I should not miss.
3. One optional deeper section only if it truly helps.

Remove repetition and background that does not change what I should do.`
    },
    technical: {
      title: "Too technical",
      next: "the answer assumes too much background knowledge.",
      prompt: `Rewrite your last answer for a beginner.

Rules:
- Use everyday language.
- Define any necessary term in one sentence.
- Replace jargon with examples.
- Keep the steps practical.
- Tell me what matters first.

Do not talk down to me. Make it clear and usable.`
    },
    format: {
      title: "Wrong format",
      next: "the content is good but the shape is not useful.",
      prompt: `Reformat your last answer into this structure:

[PASTE THE FORMAT YOU WANT: table, checklist, email, memo, slides, steps, or bullets]

Keep only the content that supports that format.
Use clear headings.
Make it easy to copy, review, and reuse.`
    },
    stuck: {
      title: "Needs questions",
      next: "Claude needs more context but did not ask for it.",
      prompt: `Pause and ask me the questions that would most improve your answer.

Ask no more than three questions.
For each question, explain why it matters in one short phrase.
After I answer, produce the improved version without restarting from scratch.`
    },
    evidence: {
      title: "Weak evidence",
      next: "facts matter and you need to know what the answer rests on.",
      prompt: `Strengthen the evidence in your last answer.

Separate:
1. Confirmed facts from the material I provided.
2. Reasonable inferences.
3. Claims that need checking.
4. Questions I should verify before relying on this.

If you cannot verify something from the provided material, say so plainly.`
    },
    action: {
      title: "Not actionable",
      next: "the answer explains the topic but does not help you move.",
      prompt: `Turn your last answer into an action checklist.

For each item, include:
- The action.
- Why it matters.
- What good completion looks like.
- The next prompt I should use if I need help.

Put the first action at the top.`
    },
    tone: {
      title: "Tone is off",
      next: "the answer is too stiff, too casual, too forceful, or not right for the audience.",
      prompt: `Rewrite your last answer for this audience:
[AUDIENCE]

Tone:
[WARM, DIRECT, EXECUTIVE, BEGINNER-FRIENDLY, CAREFUL, OR OTHER]

Keep the meaning, improve the wording, and remove anything that sounds unnatural.
Give me one polished version and one shorter version.`
    }
  };

  const roughPrompt = document.getElementById("rough-prompt");
  const optimizedPrompt = document.getElementById("optimized-prompt");
  const surfaceButtons = Array.from(document.querySelectorAll("[data-surface]"));
  const outputButtons = Array.from(document.querySelectorAll("[data-output]"));
  const missionButtons = Array.from(document.querySelectorAll("[data-mission]"));
  const missionTitle = document.getElementById("mission-output-title");
  const missionSurface = document.getElementById("mission-surface");
  const missionNext = document.getElementById("mission-next");
  const missionPrompt = document.getElementById("mission-prompt");
  const fixButtons = Array.from(document.querySelectorAll("[data-fix]"));
  const fixTitle = document.getElementById("fix-output-title");
  const fixNext = document.getElementById("fix-next");
  const fixPrompt = document.getElementById("fix-prompt");
  const modelFitCopy = document.getElementById("model-fit-copy");
  const promptStatus = document.getElementById("prompt-status");
  const toast = document.getElementById("toast");
  const exportPromptsButton = document.getElementById("export-prompts");
  const openClaudeButton = document.getElementById("open-claude-with-prompt");
  const taskShortcutButtons = Array.from(document.querySelectorAll("[data-shortcut-mission]"));
  const surfaceFilterButtons = Array.from(document.querySelectorAll("[data-surface-filter]"));
  const surfaceCards = Array.from(document.querySelectorAll("[data-surface-group]"));
  const urlParams = new URLSearchParams(window.location.search);
  const storagePrefix = "learnClaude:";
  const stateKeys = {
    mission: "mission",
    surface: "surface",
    output: "output",
    fix: "fix",
    rough: "roughPrompt"
  };
  const storage = {
    get(key) {
      try {
        return window.localStorage.getItem(storagePrefix + key);
      } catch {
        return null;
      }
    },
    set(key, value) {
      try {
        window.localStorage.setItem(storagePrefix + key, value);
      } catch {
        // Some privacy modes block localStorage. The page still works without persistence.
      }
    }
  };

  let selectedSurface = readChoice(stateKeys.surface, surfaceButtons, "data-surface", "chat");
  let selectedOutput = readChoice(stateKeys.output, outputButtons, "data-output", "useful");
  let selectedMission = readChoice(stateKeys.mission, missionButtons, "data-mission", "email");
  let selectedFix = readChoice(stateKeys.fix, fixButtons, "data-fix", "vague");

  if (roughPrompt) {
    const savedRoughPrompt = storage.get(stateKeys.rough);
    if (savedRoughPrompt) roughPrompt.value = savedRoughPrompt;
  }

  function readChoice(key, buttons, attribute, fallback) {
    const validChoices = Array.from(buttons).map((button) => button.getAttribute(attribute));
    const fromUrl = urlParams.get(key);
    if (fromUrl && validChoices.includes(fromUrl)) return fromUrl;
    const fromStorage = storage.get(key);
    if (fromStorage && validChoices.includes(fromStorage)) return fromStorage;
    return fallback;
  }

  function updateStateUrl() {
    if (!window.history || !window.history.replaceState) return;
    const params = new URLSearchParams(window.location.search);
    params.set(stateKeys.mission, selectedMission);
    params.set(stateKeys.surface, selectedSurface);
    params.set(stateKeys.output, selectedOutput);
    params.set(stateKeys.fix, selectedFix);
    const query = params.toString();
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
    try {
      window.history.replaceState(null, "", nextUrl);
    } catch {
      // Deep links are a convenience. If the browser blocks history changes, keep the UI usable.
    }
  }

  function persistState() {
    storage.set(stateKeys.mission, selectedMission);
    storage.set(stateKeys.surface, selectedSurface);
    storage.set(stateKeys.output, selectedOutput);
    storage.set(stateKeys.fix, selectedFix);
    updateStateUrl();
  }

  function showToast(message) {
    if (!toast) return;
    window.clearTimeout(showToast.timeoutId);
    toast.textContent = message;
    toast.classList.add("is-visible");
    showToast.timeoutId = window.setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 1800);
  }

  function setActiveChoice(buttons, attribute, value) {
    buttons.forEach((button) => {
      const active = button.getAttribute(attribute) === value;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function setSurfaceFilter(filter) {
    const activeFilter = filter || "all";
    surfaceFilterButtons.forEach((button) => {
      const active = button.getAttribute("data-surface-filter") === activeFilter;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
    surfaceCards.forEach((card) => {
      const groups = (card.getAttribute("data-surface-group") || "").split(/\s+/);
      const hidden = activeFilter !== "all" && !groups.includes(activeFilter);
      card.hidden = hidden;
      card.classList.toggle("is-hidden", hidden);
    });
  }

  async function copyText(text, target) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    }

    // Fallback behavior when clipboard API is unavailable
    if (target && typeof target.select === "function") {
      target.focus();
      target.select();
    }
    return false;
  }

  async function copyTemplate(targetId, button, successMessage) {
    if (!targetId) return;
    const target = document.getElementById(targetId);
    if (!target) return;
    const original = button.textContent;
    const text = target.value || target.textContent || "";

    try {
      const copied = await copyText(text, target);
      button.textContent = copied ? "Copied" : "Selected";
      showToast(copied ? (successMessage || "Copied.") : "Copy blocked. Text selected.");
    } catch {
      target.focus();
      target.select();
      button.textContent = "Selected";
      showToast("Copy blocked. Text selected.");
    }

    window.setTimeout(() => {
      button.textContent = original;
    }, 1400);
  }

  function getModelFit() {
    if (selectedOutput === "code" || selectedOutput === "agent") return modelFitHints.code;
    if (selectedOutput === "design") return modelFitHints.artifact;
    if (selectedSurface === "office" && selectedOutput === "spreadsheet") return modelFitHints.office;
    return modelFitHints[selectedSurface] || modelFitHints.default;
  }

  function buildOptimizedPrompt() {
    if (!optimizedPrompt) return;
    const task = (roughPrompt && roughPrompt.value.trim()) || "Help me complete this task clearly and well.";
    const surface = selectedSurface === "office"
      ? (officeAppsByOutput[selectedOutput] || surfaceHints.office)
      : (surfaceHints[selectedSurface] || surfaceHints.chat);
    const outputType = outputHints[selectedOutput] || outputHints.useful;
    const modelFit = getModelFit();
    const officeRules = selectedSurface === "office" ? `

Office rules:
- Work in ${surface}.
- First explain what you see in plain language.
- Ask before making major changes.
- Preserve formatting and structure where possible.
- End with what I should review before sharing.` : "";
    const researchRules = selectedSurface === "research" ? `

Research rules:
- Use Research when the question needs multiple sources or citations.
- Prioritize the sources I name.
- Separate confirmed facts from reasonable inferences.
- Cite sources I can check.
- Say what still needs verification.` : "";
    const connectorRules = selectedSurface === "connectors" ? `

Connector rules:
- Use only connected services relevant to the task.
- Tell me which source you used.
- Ask before changing, sending, deleting, or creating anything.
- Respect my existing access in each service.
- Say when a connector is unavailable or not connected.` : "";
    const pluginRules = selectedSurface === "plugins" ? `

Plugin rules:
- Recommend a plugin only if it saves repeated setup.
- Explain the skills, connectors, or subagents it would add in plain language.
- Start with a safe test task before real work.
- Ask before adding or changing access.` : "";
    const mobileRules = selectedSurface === "mobile" ? `

Mobile rules:
- Assume I may be on iOS or Android.
- Keep the output short enough to review on a phone.
- Make the first step voice-friendly.
- If this involves another app, tell me what to review before sending or saving.` : "";
    const surfaceRules = officeRules || researchRules || connectorRules || pluginRules || mobileRules;
    if (modelFitCopy) modelFitCopy.textContent = modelFit;
    if (promptStatus) promptStatus.textContent = `Optimized prompt updated for ${surface} and ${outputType}.`;
    optimizedPrompt.value = `You are helping me use ${surface} effectively.

Model note for me before sending:
${modelFit}

Task:
${task}

Preferred output:
${outputType}${surfaceRules}

Before answering:
1. Restate the goal in one sentence.
2. Ask up to three questions only if you truly need more context.
3. If you have enough context, start the work.

Output rules:
- Start with the useful answer, not a long explanation.
- Use plain language.
- Use headings, bullets, or a table when that makes the result easier to use.
- Flag uncertainty instead of guessing.
- Tell me what I should review before I rely on the result.

After the answer:
- Give me one improved version of this prompt for next time.
- Suggest the best Claude surface for repeating this workflow.`;
  }

  function setMission(mission, options = {}) {
    const detail = missionData[mission] || missionData.email;
    selectedMission = missionData[mission] ? mission : "email";
    setActiveChoice(missionButtons, "data-mission", mission);
    if (missionTitle) missionTitle.textContent = detail.title;
    if (missionSurface) {
      missionSurface.textContent = "";
      const strong = document.createElement("strong");
      strong.textContent = "Best Claude surface:";
      missionSurface.appendChild(strong);
      missionSurface.appendChild(document.createTextNode(` ${detail.surface}`));
    }
    if (missionNext) {
      missionNext.textContent = "";
      const strong = document.createElement("strong");
      strong.textContent = "Next move:";
      missionNext.appendChild(strong);
      missionNext.appendChild(document.createTextNode(` ${detail.next}`));
    }
    if (missionPrompt) missionPrompt.value = detail.prompt;
    if (options.persist !== false) persistState();
  }

  function setFix(fix, options = {}) {
    const detail = fixData[fix] || fixData.vague;
    selectedFix = fixData[fix] ? fix : "vague";
    setActiveChoice(fixButtons, "data-fix", fix);
    if (fixTitle) fixTitle.textContent = detail.title;
    if (fixNext) {
      fixNext.textContent = "";
      const strong = document.createElement("strong");
      strong.textContent = "Use when:";
      fixNext.appendChild(strong);
      fixNext.appendChild(document.createTextNode(` ${detail.next}`));
    }
    if (fixPrompt) fixPrompt.value = detail.prompt;
    if (options.persist !== false) persistState();
  }

  surfaceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedSurface = button.getAttribute("data-surface") || "chat";
      setActiveChoice(surfaceButtons, "data-surface", selectedSurface);
      buildOptimizedPrompt();
      persistState();
    });
  });

  outputButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedOutput = button.getAttribute("data-output") || "useful";
      setActiveChoice(outputButtons, "data-output", selectedOutput);
      buildOptimizedPrompt();
      persistState();
    });
  });

  missionButtons.forEach((button) => {
    button.addEventListener("click", () => setMission(button.getAttribute("data-mission") || "email"));
  });

  taskShortcutButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const mission = button.getAttribute("data-shortcut-mission") || "email";
      setMission(mission);
      const title = (missionData[mission] || missionData.email).title;
      showToast(`${title} prompt loaded.`);
    });
  });

  fixButtons.forEach((button) => {
    button.addEventListener("click", () => setFix(button.getAttribute("data-fix") || "vague"));
  });

  surfaceFilterButtons.forEach((button) => {
    button.addEventListener("click", () => setSurfaceFilter(button.getAttribute("data-surface-filter") || "all"));
  });

  if (roughPrompt) {
    roughPrompt.addEventListener("input", () => {
      storage.set(stateKeys.rough, roughPrompt.value);
      buildOptimizedPrompt();
    });
  }

  Array.from(document.querySelectorAll(".copy")).forEach((button) => {
    button.addEventListener("click", () => copyTemplate(button.getAttribute("data-copy-target"), button));
  });

  if (openClaudeButton) {
    openClaudeButton.addEventListener("click", async () => {
      await copyTemplate("optimized-prompt", openClaudeButton, "Prompt copied. Opening Claude.");
      const opened = window.open("https://claude.ai/", "_blank", "noopener");
      if (!opened) showToast("Prompt copied. Open Claude from the top button.");
    });
  }

  if (exportPromptsButton) {
    exportPromptsButton.addEventListener("click", exportPrompts);
  }

  function exportPrompts() {
    const excludedIds = new Set(["mission-prompt", "optimized-prompt", "fix-prompt"]);
    const templates = Array.from(document.querySelectorAll("textarea[readonly]"))
      .filter((textarea) => textarea.id && !excludedIds.has(textarea.id) && textarea.value.trim());
    const sections = templates.map((textarea) => {
      const card = textarea.closest("article, li");
      const heading = card ? card.querySelector("h3") : null;
      const title = heading ? heading.textContent.trim() : textarea.getAttribute("aria-label") || textarea.id;
      return `## ${title}\n\n\`\`\`text\n${textarea.value.trim()}\n\`\`\``;
    });
    const markdown = `# Learn Claude Prompt Pack\n\nGenerated from the Learn Claude site.\n\n${sections.join("\n\n")}\n`;
    const blob = new Blob([markdown], { type: "text/markdown" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "learn-claude-prompts.md";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => URL.revokeObjectURL(link.href), 0);
    showToast("Prompt pack exported.");
  }

  const toolkitData = {
    clinical: [
      {
        name: "PubMed (cyanheads)",
        surface: "Desktop App (MCP)",
        description: "Primary search access to PubMed abstracts, articles, and research metadata.",
        useCases: ["Literature surveys", "Citation verification", "Abstract lookup"],
        install: "npm install -g pubmed-mcp-server"
      },
      {
        name: "Biomedical GPT (bgpt)",
        surface: "Desktop App (MCP)",
        description: "Specialized search and lookup tools for academic literature, clinical trials, and bio-medical databases.",
        useCases: ["Literature surveys", "Abstract searches", "Rigor checks"],
        install: "npm install -g bgpt-mcp-server",
        skills: ["search_papers", "lookup_paper"]
      },
      {
        name: "medRxiv Preprints",
        surface: "Desktop App (MCP)",
        description: "Retrieves preprints in clinical medicine, epidemiology, and health sciences.",
        useCases: ["Preprint alerts", "Epidemic surveillance", "Novel research tracking"],
        install: "npm install -g medrxiv-mcp-server"
      },
      {
        name: "NICE Medical Guidance",
        surface: "Desktop App (MCP)",
        description: "Retrieves clinical guidance and evidence-based recommendations.",
        useCases: ["Clinical pathway design", "Treatment verification", "Guideline QA"],
        install: "npm install -g medical-mcp"
      },
      {
        name: "Jupyter Analysis Skills",
        surface: "Jupyter / R Workspace",
        description: "Over 239 pre-configured agent skills for data science, modeling, and clinical trials analysis.",
        useCases: ["Data wrangling", "Statistical modeling", "Clinical cohort building"]
      }
    ],
    office: [
      {
        name: "Google Drive Connector",
        surface: "Desktop App (MCP)",
        description: "Secure file access and folder management in your personal and shared Google Drive.",
        useCases: ["Direct file reads", "Archival scripts", "Resource sync"],
        install: "npm install -g @modelcontextprotocol/server-google-drive"
      },
      {
        name: "Word Integration",
        surface: "Microsoft Word (Add-in)",
        description: "Direct text rewrites and content summaries while preserving Word document styling.",
        useCases: ["Lecture notes editing", "Abstract drafting", "Preserve styling"]
      },
      {
        name: "PowerPoint Integration",
        surface: "Microsoft PPT (Add-in)",
        description: "Restructures slide cards, refines presentation flows, and edits speaker notes.",
        useCases: ["Draft slide cards", "Check story flow", "Refine slides"]
      },
      {
        name: "Slack Integration",
        surface: "Desktop App (MCP)",
        description: "Post updates and fetch channel conversations directly inside Claude.",
        useCases: ["Meeting briefs", "Team announcements", "Incident logging"],
        install: "npm install -g @modelcontextprotocol/server-slack"
      }
    ],
    data: [
      {
        name: "SQLite Database",
        surface: "Desktop App (MCP)",
        description: "Run read-only SQL queries and perform statistical summaries on local research datasets.",
        useCases: ["Data exploration", "Run SQL queries", "Biomarker metrics"],
        install: "npm install -g @modelcontextprotocol/server-sqlite"
      },
      {
        name: "PostgreSQL Connection",
        surface: "Desktop App (MCP)",
        description: "Connects Claude to active Postgres servers for clinical data warehousing and extraction.",
        useCases: ["Extract cohort metrics", "Large data queries", "Warehouse reads"],
        install: "npm install -g @modelcontextprotocol/server-postgres"
      },
      {
        name: "Redis Server",
        surface: "Desktop App (MCP)",
        description: "Track jobs and queues inside your Redis caching instances.",
        useCases: ["Queue checks", "Pipeline cache tracking", "Dev workflows"],
        install: "npm install -g @modelcontextprotocol/server-redis"
      },
      {
        name: "Helium Market & News",
        surface: "Desktop App (MCP)",
        description: "Fetch financial news, stock options prices, source bias, memes, and trading strategies.",
        useCases: ["Search news", "Options quotes", "Bias analyses", "Trading strategies"],
        install: "npm install -g helium-mcp-server",
        skills: [
          "search_news",
          "get_ticker",
          "get_source_bias",
          "get_all_source_biases",
          "get_option_price",
          "search_balanced_news",
          "search_memes",
          "get_top_trading_strategies",
          "get_bias_from_url",
          "get_historical_options_data"
        ]
      },
      {
        name: "Sequential Thinking",
        surface: "Desktop App (MCP)",
        description: "A reasoning server that guides Claude through multi-step logic and hypothesis testing.",
        useCases: ["Logical proofs", "Bug troubleshooting", "Complex calculations"],
        install: "npm install -g @modelcontextprotocol/server-sequential-thinking"
      }
    ],
    cli: [
      {
        name: "Git Repository Server",
        surface: "Desktop App (MCP)",
        description: "Secures repository status reads, checkout files, and diff management.",
        useCases: ["Local diff checks", "Inspect branches", "Auto-commit drafts"],
        install: "npm install -g @modelcontextprotocol/server-git"
      },
      {
        name: "GitHub API Server",
        surface: "Desktop App (MCP)",
        description: "Manage repository issues, review pull requests, and list repository files.",
        useCases: ["Manage PR reviews", "Search codebase issues", "Automated commits"],
        install: "npm install -g @modelcontextprotocol/server-github"
      },
      {
        name: "Brave Search API",
        surface: "Desktop App (MCP)",
        description: "Uses Brave's search index to verify assertions and retrieve real-time data.",
        useCases: ["Fact-checking claims", "Recent news retrieval", "Identify sources"],
        install: "npm install -g @modelcontextprotocol/server-brave-search"
      },
      {
        name: "Puppeteer Web Browser",
        surface: "Desktop App (MCP)",
        description: "Headless browser automation to scrape dense web tables and capture UI screenshots.",
        useCases: ["Scrape web portals", "Capture visual bugs", "Interact with forms"],
        install: "npm install -g @modelcontextprotocol/server-puppeteer"
      }
    ],
    claude: [
      {
        name: "Claude Code CLI Core",
        surface: "CLI Environment",
        description: "Your terminal-based development agent. Configured to run on Opus 4.7 with ultra-code mode and high-effort reasoning (xhigh) enabled.",
        useCases: ["Repository refactoring", "Automated testing", "Complex debugging"],
        install: "npm install -g @anthropic-ai/claude-code"
      },
      {
        name: "Google Workspace CLI",
        surface: "Claude Code / CLI (Plugin)",
        description: "Secure, OAuth-gated automation across Gmail, Google Calendar, Sheets, Docs, and Slides.",
        useCases: ["Calendar & meeting prep", "Inbox triage", "Sheets data sync"],
        install: "/plugin install google-workspace-cli",
        skills: [
          "gws-gmail",
          "gws-calendar",
          "gws-drive",
          "gws-docs",
          "gws-sheets",
          "gws-chat",
          "gws-tasks",
          "gws-slides",
          "gws-forms",
          "gws-people",
          "gws-classroom",
          "gws-admin-reports",
          "gws-events",
          "gws-meet",
          "gws-modelarmor",
          "gws-script"
        ],
        automations: [
          "gws-workflow-meeting-prep",
          "gws-workflow-standup-report",
          "gws-workflow-weekly-digest",
          "recipe-sync-contacts-to-sheet",
          "recipe-backup-sheet-as-csv",
          "recipe-batch-invite-to-event",
          "recipe-block-focus-time",
          "recipe-bulk-download-folder",
          "recipe-collect-form-responses",
          "recipe-compare-sheet-tabs",
          "recipe-copy-sheet-for-new-month",
          "recipe-create-classroom-course",
          "recipe-create-doc-from-template",
          "recipe-create-events-from-sheet",
          "recipe-create-expense-tracker",
          "recipe-create-feedback-form",
          "recipe-create-gmail-filter",
          "recipe-create-meet-space",
          "recipe-create-presentation",
          "recipe-create-shared-drive",
          "recipe-create-task-list",
          "recipe-create-vacation-responder",
          "recipe-draft-email-from-doc",
          "recipe-email-drive-link",
          "recipe-find-free-time",
          "recipe-find-large-files",
          "recipe-forward-labeled-emails",
          "recipe-generate-report-from-sheet",
          "recipe-label-and-archive-emails",
          "recipe-log-deal-update",
          "recipe-organize-drive-folder",
          "recipe-plan-weekly-schedule",
          "recipe-post-mortem-setup",
          "recipe-reschedule-meeting",
          "recipe-review-meet-participants",
          "recipe-review-overdue-tasks",
          "recipe-save-email-attachments",
          "recipe-save-email-to-doc",
          "recipe-schedule-recurring-event",
          "recipe-send-team-announcement",
          "recipe-share-doc-and-notify",
          "recipe-share-event-materials",
          "recipe-share-folder-with-team",
          "recipe-watch-drive-changes"
        ]
      },
      {
        name: "Maestro Orchestration",
        surface: "Claude Code / CLI (Plugin)",
        description: "Orchestrates multi-step code changes, security audits, compliance reviews, and debugging.",
        useCases: ["Compliance reviews", "Refactoring logic", "Workflow runs"],
        install: "/plugin install maestro",
        skills: [
          "orchestrate",
          "execute",
          "review",
          "perf-check",
          "compliance-check",
          "security-audit",
          "seo-audit",
          "a11y-audit",
          "debug",
          "status",
          "resume",
          "archive"
        ]
      },
      {
        name: "Science Superpowers",
        surface: "Claude Code / CLI (Plugin)",
        description: "Enforces scientific rigor for literature surveys, reproducible analysis plans, and pre-registration.",
        useCases: ["Research planning", "Robust data analysis", "Self-critiques"],
        install: "/plugin install science-superpowers",
        skills: [
          "framing-research-questions",
          "setting-up-reproducible-analysis",
          "surveying-prior-work",
          "preregistering-analysis",
          "executing-analysis",
          "verifying-results-before-claiming",
          "requesting-red-team-review",
          "receiving-critical-review",
          "reporting-and-archiving-findings",
          "investigating-anomalous-results",
          "dispatching-parallel-investigations",
          "using-science-superpowers",
          "writing-science-skills"
        ]
      },
      {
        name: "Signum Code Audit",
        surface: "Claude Code / CLI (Plugin)",
        description: "Runs evidence-driven testing, contract checks, and multi-model checkpoints.",
        useCases: ["Contract testing", "Refactoring audits", "Security checks"],
        install: "/plugin install signum",
        skills: ["init", "signum"]
      },
      {
        name: "Claude Code Reviewer",
        surface: "Claude Code Plugin",
        description: "Performs deep automated code reviews, refactoring audits, and checks changes against coding guidelines.",
        useCases: ["Review code changes", "Audit refactorings", "Enforce guide styling"],
        install: "/plugin install code-review"
      },
      {
        name: "Feature Development Planner",
        surface: "Claude Code Plugin",
        description: "Autonomously designs, implements, and tests complete feature requests across codebases.",
        useCases: ["Write new features", "Verify builds", "Scaffold workflows"],
        install: "/plugin install feature-dev"
      },
      {
        name: "Frontend Visual Designer",
        surface: "Claude Code Plugin",
        description: "Polishes CSS styling, visual hierarchies, typography, and responsive web layouts.",
        useCases: ["Fix layouts", "Upgrade palettes", "Responsive alignments"],
        install: "/plugin install frontend-design"
      },
      {
        name: "Chrome DevTools Controller",
        surface: "Claude Code Plugin",
        description: "Connects directly to Chrome browser devtools to debug layouts, DOM nodes, and live runtime states.",
        useCases: ["DOM inspections", "Live css tweak", "Console log check"],
        install: "/plugin install chrome-devtools-mcp"
      },
      {
        name: "Long Context Repository Indexer",
        surface: "Claude Code Plugin",
        description: "Manages long context files and project indexing across massive repositories.",
        useCases: ["Manage context", "Index large repos", "Token planning"],
        install: "/plugin install context7"
      },
      {
        name: "Exa Semantic Search",
        surface: "Claude Code Plugin",
        description: "Leverages the Exa search engine for highly targeted semantic web queries and doc crawls.",
        useCases: ["Semantic queries", "Recent literature web crawls", "Concept lookups"],
        install: "/plugin install exa"
      },
      {
        name: "Firecrawl Web Scraper",
        surface: "Claude Code Plugin",
        description: "Crawls websites and extracts clean, raw Markdown for documentation or scraping.",
        useCases: ["Scrape documentation", "Crawl web portals", "HTML formatting"],
        install: "/plugin install firecrawl"
      },
      {
        name: "Desktop Commander",
        surface: "Claude Code Plugin",
        description: "Automates keyboard input, app launching, and system-level clicks safely.",
        useCases: ["Automate commands", "Open desktop apps", "Task schedules"],
        install: "/plugin install desktop-commander"
      },
      {
        name: "Code Simplifier & Refactorer",
        surface: "Claude Code Plugin",
        description: "Refactors complex methods and algorithms into simpler, highly maintainable patterns.",
        useCases: ["Simplify code", "Remove duplicates", "Improve readability"],
        install: "/plugin install code-simplifier"
      },
      {
        name: "Commit & Git History Planner",
        surface: "Claude Code Plugin",
        description: "Analyzes diffs to write atomic, descriptive commit messages and summaries.",
        useCases: ["Auto commits", "Draft commit messages", "Review history"],
        install: "/plugin install commit-commands"
      },
      {
        name: "Git Hooks Manager (Hookify)",
        surface: "Claude Code Plugin",
        description: "Installs and manages git pre-commit, post-checkout, and prep-push script hooks.",
        useCases: ["Manage pre-commit hooks", "Add automation hooks", "Git security check"],
        install: "/plugin install hookify"
      },
      {
        name: "Claude Project Initializer",
        surface: "Claude Code Plugin",
        description: "Scaffolds new projects, initializes configuration files, and sets directory rules.",
        useCases: ["Scaffold directories", "Write configuration files", "Set project rules"],
        install: "/plugin install claude-code-setup"
      },
      {
        name: "Markdown Documentation Auditor",
        surface: "Claude Code Plugin",
        description: "Scans, formats, and updates markdown project guides, wikis, and changelogs.",
        useCases: ["Validate markdown", "Update changelogs", "Format documentation"],
        install: "/plugin install claude-md-management"
      },
      {
        name: "GitHub API Interface",
        surface: "Claude Code Plugin",
        description: "Interacts directly with GitHub repositories, pull requests, issues, and action workflows.",
        useCases: ["Audit issues", "Review pull requests", "Fetch repo actions"],
        install: "/plugin install github"
      },
      {
        name: "CodeRabbit Review Integrator",
        surface: "Claude Code Plugin",
        description: "Automates pull request feedback, review loops, and code diagnostics.",
        useCases: ["PR feedback summaries", "Run diagnostics", "Automate review loops"],
        install: "/plugin install coderabbit"
      }
    ]
  };

  const toolkitContent = document.getElementById("toolkit-content");
  const toolkitTabs = Array.from(document.querySelectorAll("[data-toolkit-tab]"));

  function renderToolkitTab(tab) {
    if (!toolkitContent) return;
    const items = toolkitData[tab] || [];
    toolkitContent.innerHTML = "";
    items.forEach((item) => {
      const card = document.createElement("div");
      card.className = "toolkit-card";
      
      const surfaceBadge = document.createElement("span");
      surfaceBadge.className = "surface-badge";
      surfaceBadge.textContent = item.surface;
      card.appendChild(surfaceBadge);

      const title = document.createElement("h3");
      title.textContent = item.name;
      card.appendChild(title);

      const description = document.createElement("p");
      description.textContent = item.description;
      card.appendChild(description);

      if (item.useCases && item.useCases.length) {
        const useCasesDiv = document.createElement("div");
        useCasesDiv.className = "toolkit-list";
        useCasesDiv.style.marginTop = "0.5rem";
        item.useCases.forEach(uc => {
          const ucSpan = document.createElement("span");
          ucSpan.className = "toolkit-badge";
          ucSpan.style.fontSize = "0.7rem";
          ucSpan.style.opacity = "0.85";
          ucSpan.textContent = uc;
          useCasesDiv.appendChild(ucSpan);
        });
        card.appendChild(useCasesDiv);
      }

      if ((item.skills && item.skills.length) || (item.automations && item.automations.length)) {
        const details = document.createElement("details");
        details.className = "card-details";
        details.style.marginTop = "0.6rem";

        const summary = document.createElement("summary");
        const skillsCount = item.skills ? ` (${item.skills.length})` : '';
        const automationsCount = item.automations ? ` & Recipes (${item.automations.length})` : '';
        summary.textContent = `Show Skills${skillsCount}${automationsCount}`;
        details.appendChild(summary);

        if (item.skills && item.skills.length) {
          const skillsSection = document.createElement("div");
          skillsSection.className = "skills-section";
          const skillsH4 = document.createElement("h4");
          skillsH4.textContent = "Skills / Tools";
          skillsSection.appendChild(skillsH4);

          const skillsList = document.createElement("div");
          skillsList.className = "skills-list";
          item.skills.forEach(s => {
            const skillCode = document.createElement("code");
            skillCode.className = "skill-name";
            skillCode.textContent = s;
            skillsList.appendChild(skillCode);
          });
          skillsSection.appendChild(skillsList);
          details.appendChild(skillsSection);
        }

        if (item.automations && item.automations.length) {
          const automationsSection = document.createElement("div");
          automationsSection.className = "automations-section";
          automationsSection.style.marginTop = "0.5rem";

          const automationsH4 = document.createElement("h4");
          automationsH4.textContent = "Recipes & Automations";
          automationsSection.appendChild(automationsH4);

          const automationsList = document.createElement("div");
          automationsList.className = "automations-list";
          item.automations.forEach(a => {
            const autoItem = document.createElement("div");
            autoItem.className = "automation-item";
            autoItem.textContent = a;
            automationsList.appendChild(autoItem);
          });
          automationsSection.appendChild(automationsList);
          details.appendChild(automationsSection);
        }

        card.appendChild(details);
      }

      const cardLinks = document.createElement("div");
      cardLinks.className = "card-links";
      cardLinks.style.display = "flex";
      cardLinks.style.gap = "0.5rem";
      cardLinks.style.alignItems = "center";
      cardLinks.style.marginTop = "auto";
      cardLinks.style.paddingTop = "0.5rem";

      if (item.install) {
        const copyButton = document.createElement("button");
        copyButton.type = "button";
        copyButton.className = "button small copy-inline";
        copyButton.setAttribute("data-copy-text", item.install);
        copyButton.textContent = "Copy Install Command";
        cardLinks.appendChild(copyButton);
      }

      card.appendChild(cardLinks);
      toolkitContent.appendChild(card);
    });

    Array.from(toolkitContent.querySelectorAll(".copy-inline")).forEach((button) => {
      button.addEventListener("click", async () => {
        const text = button.getAttribute("data-copy-text");
        const original = button.textContent;
        try {
          const copied = await copyText(text, button);
          button.textContent = copied ? "Copied" : "Error";
          showToast(copied ? "Command copied." : "Copy blocked.");
        } catch {
          button.textContent = "Error";
        }
        window.setTimeout(() => {
          button.textContent = original;
        }, 1400);
      });
    });
  }

  function setToolkitActiveTab(tab) {
    toolkitTabs.forEach((button) => {
      const active = button.getAttribute("data-toolkit-tab") === tab;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
    renderToolkitTab(tab);
  }

  if (toolkitTabs.length) {
    toolkitTabs.forEach((button) => {
      button.addEventListener("click", () => {
        const tab = button.getAttribute("data-toolkit-tab") || "clinical";
        setToolkitActiveTab(tab);
      });
    });
  }

  setActiveChoice(surfaceButtons, "data-surface", selectedSurface);
  setActiveChoice(outputButtons, "data-output", selectedOutput);
  setMission(selectedMission, { persist: false });
  setFix(selectedFix, { persist: false });
  setSurfaceFilter("draft");
  if (toolkitTabs.length) setToolkitActiveTab("clinical");
  buildOptimizedPrompt();
});
