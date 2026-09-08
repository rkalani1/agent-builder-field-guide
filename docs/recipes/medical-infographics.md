# Medical Infographics Guide

> **Last verified:** 2026-06-01 · **Drift risk:** low

!!! warning "Educational example only"
    This recipe is a workflow pattern for education, not a clinical tool. Its outputs are not clinical decision support and must not inform real patient care. Use only synthetic or published, non-identifiable content — never PHI or restricted research data.

This recipe details how to design and generate premium, professional medical infographics using Claude. It focuses on translation of complex clinical guidelines or clinical trial data into clean, visually striking cards or interactive previews.

---

## Design Principles for Medical Data
Medical infographics are frequently cluttered with excessive text, generic diagrams, or browser-default styling. Visual excellence is critical when communicating with other clinicians or patients.

Follow these layout and styling rules:
1. **Curated Color Palettes**: Avoid generic primary colors (pure red, green, blue). Use tailored colors (e.g., slate background, muted emerald for confirmations, soft gold for warnings, electric indigo for accents).
2. **Typography Hierarchy**: Use modern Sans-Serif fonts (like *Inter*, *Roboto*, or *Geist*) with contrasting weights to guide the reader's eye.
3. **Data Density & Whiter Space**: Keep text labels under 8 words. Group related metrics inside bordered boxes or "cards."
4. **SVG & HTML Previews**: Have Claude render the infographic as an inline SVG or responsive HTML file so you can iterate on the layout inside the **Claude Artifacts** viewer.

---

## Infographic Design Workflow

### Step 1: Structural Layout Blueprint
Provide Claude with the data and ask for the layout structure first.
* **Surface to use:** Claude Design or Claude Chat (with Artifacts enabled).

**Layout Planning Prompt:**
```text
I want to design a medical infographic.
Topic: [PASTE CLINICAL GUIDELINES OR TRIAL DATA]
Audience: [e.g., Residents, Vascular Neurologists, Public]

Goal:
Organize this data into a logical layout. Suggest the best format (e.g., timeline grid, three-column metric cards, or a split diagnostic flow diagram).

Please output:
1. Recommended visual layout structure.
2. Color palette codes (using HSL or Hex).
3. Draft copy for the headings.
```

### Step 2: SVG/HTML Generation (Interactive Preview)
Once the layout is approved, instruct Claude to generate the actual code so you can view it immediately.

**SVG Generation Prompt:**
```text
Based on the approved layout, write a standalone responsive SVG file representing the infographic.
Rules:
- Embed all styles directly inside the SVG.
- Use the curated HSL color palette.
- Set a default font family like 'Inter', sans-serif.
- Ensure all text labels fit within their bounds and do not clip.
- Render clean icons and symbols (like checkmarks, warning flags, or arrows) using SVG path elements.

Review your code and ensure the design feels premium and state of the art before outputting.
```

---

## Example Template: Stroke orientation Card
Use this template to generate a pocket-sized orientation card for vascular neurology residents.

**Copy-Pastable Blueprint Prompt:**
```text
Create a pocket orientation card for a first-year neurology resident covering "Acute Stroke Pathway".

Goal:
Make a clean, high-contrast, visual cheat sheet that can be viewed on a mobile device or printed.

Color System:
- Base Background: Slate (#0f172a)
- Critical Actions: Soft Red (#f87171)
- Secondary Metrics: Light Blue (#38bdf8)
- Text: White / Light Gray

Content to include:
1. Pathway Milestones (Triage -> CT scan -> tPA decision -> Endovascular Handoff).
2. Key time constraints (e.g., door-to-needle < 45 minutes).
3. Exclusion criteria checklist.

Generate the complete HTML and inline CSS to render this preview in Claude Artifacts.
```
