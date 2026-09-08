# 0005 — Organize navigation around six workstreams

- **Status:** Accepted
- **Date:** 2026-07-25
- **Deciders:** maintainers

## Context

The guide had grown across setup, building, platform selection, operations,
learning material, and reference content. Its previous top-level navigation
mixed those purposes and made it harder to predict where a page belonged.
The recipe and decision-record collections must still follow the index-first
pattern accepted in [ADR 0004](0004-recipe-nav-pattern.md).

Desktop navigation also needs to expose nested workstream links without making
the tab bar excessively wide. Any custom submenu must preserve native links,
keyboard operation, visible focus, and one synchronized state for what is
visible and what assistive technology reports.

## Decision

Organize the guide into six top-level workstreams:

1. Start
2. Build
3. Connect
4. Operate
5. Learn
6. Reference

Use a small MkDocs Material tabs override to render nested desktop submenus.
The submenu toggle owns the complete open state: `data-open="true"`, its
`aria-expanded` value, and visible CSS must always agree. Click, Arrow Down,
Escape, focus-out, and outside-click behavior must remain keyboard operable and
must restore focus when dismissal is initiated from the keyboard.

ADR 0004 remains in force. Recipes are still discovered from their categorized
index, and decision records remain nested under their index rather than being
promoted to independent top-level destinations.

## Consequences

- Readers get a predictable task-oriented information architecture.
- Top-level navigation remains bounded while nested pages stay directly
  reachable on desktop.
- The custom partial and controller become accessibility-sensitive code and
  require browser-level regression coverage.
- Navigation changes must keep the six workstreams, the MkDocs `nav` tree, the
  custom tab partial, and portal behavior tests synchronized.

## Alternatives considered

- **Keep the previous mixed navigation.** Rejected because its categories no
  longer reflected the guide's major user journeys.
- **Flatten every page into the tab bar.** Rejected because it would overflow
  and obscure hierarchy.
- **List every recipe and ADR directly.** Rejected because it would conflict
  with ADR 0004 and duplicate their index pages.
- **Use hover-only submenus.** Rejected because hover does not provide a stable,
  inspectable state for keyboard, touch, or assistive-technology users.
