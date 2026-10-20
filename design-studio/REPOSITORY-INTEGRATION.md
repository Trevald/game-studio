# Integration with the existing Game Studio

This kit is installed under `design-studio/` in `trevald/game-studio`. Paths in the kit are relative to that directory unless explicitly described as implementation-repository paths. Open the repository root, then ask the agent to load `design-studio/AGENTS.md`.

## Existing workflow

The repository already has a root CLAUDE.md, studio/RULES.md, studio/NIGHT_SHIFT.md, and playable projects under root games/. These remain authoritative for the existing overnight workflow. Read the root studio/RULES.md for the owner's standing preferences before design work. The new design PR and approval workflow applies to owner-led work in this directory; it does not change scheduled night shifts or authorize migration of existing games.

Existing game folders observed: math-crush, mathly-trails, sweepvault, and tiltstones. The template folder is games/_template. No mapping from Mathly, Ricochet, or Auguru to these folders has been confirmed. Do not create a second design master for an existing game: confirm mappings and inspect its DESIGN.md and design/ materials before adopting or migrating it.

## Handover destination

The kit's docs/design/studio/ destination is a default for separate implementation repositories. For a game implemented in this repository, first confirm its existing games/<slug>/design/ convention and update PROJECT.md with the chosen packet path. Add a reviewed pointer from that game's existing DESIGN.md to the approved packet if needed. Do not replace its existing design or handover. Link existing design/REQUESTS.md entries from the new feedback records instead of creating contradictory resolution histories.

## GitHub templates

The .github folder inside this kit is reference material; GitHub only activates templates at the repository root. Existing automation and root templates are not replaced. Use the kit PR template manually for design PRs until root-level activation is intentionally reviewed.

## First session

Ask: “Read design-studio/AGENTS.md and REPOSITORY-INTEGRATION.md. Work on Mathly. Help confirm which existing game folder or external repository it belongs to, then complete intake without changing existing game code.”
