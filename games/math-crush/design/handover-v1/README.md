# Mobile Math Puzzle — Studio Handoff

Approved visual direction • Final prototype specification • 19 October 2026

Start with **docs/Studio-Handoff.docx** (editable) or **docs/Studio-Handoff.md**. Open **designs/index.html** for the complete screen gallery. Reference/approved-art-direction.png preserves the approved rendered concept.

## Included

- Three distinct MVP specifications, rules, progression, scoring, recovery and future-feature boundaries.
- 21 editable SVG screen layouts and 21 PNG previews: Home, Levels, Tutorial, Gameplay, Pause, Success and Failure/Stuck for each game.
- Three annotated gameplay layouts, SVG and PNG.
- Three painted environment PNGs plus three transparent sprite-atlas PNGs, with 48 named sprite regions and source-coordinate JSON.
- 36 authored starter levels, solution witnesses and independent Python validator.
- Word, Markdown and PDF documentation; asset inventory, generation prompts and checksums.

## Build order and authority

Implement arithmetic and state transitions first, then interactions, then compose the supplied art. The written rules control behavior; SVGs control sample geometry and live text; the approved reference controls art direction. The approved reference is an illustration, not executable UI. Equation screenshots demonstrate target 24 and are not literal first-level starter data.

Match uses addition only, orthogonal swipe chains and refill. Equation uses six number tiles and reusable +, − and ×, with standard precedence. Clear uses finite pairs/triples, no adjacency requirement, no gravity and no refill. Future mechanics must stay out of MVP.

## Asset use

See assets/INTEGRATION.md and inventory.json. Atlases are organized PNG files containing blank reusable components; all numbers and labels must remain live. JSON regions identify sprites directly; a game engine can import them as multiple sprites without a separate image editor. Source art is a coordinated redraw of the accepted style, not original layered concept artwork.

The full ZIP supersedes previous handoff versions. This is a design and implementation package, not a compiled game. Device tests and playtest balancing remain studio work.
