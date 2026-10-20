# Shared mobile puzzle design standard

These are completeness standards, not mechanics prescribed for every game. A section may be N/A with a reason. Product choices belong in each game's DESIGN and decisions.

## Design ready for review

- Identify the intended player, play context, session length, core promise, target devices, orientation, and constraints. Unknowns remain explicit.
- Describe the core loop, input, state transitions, legal/illegal actions, puzzle generation or authorship, win/loss, scoring, progression, hints, undo, reset, and persistence. Define boundary cases and deterministic rules.
- Cover touch target behavior, gestures, interruptions, safe areas, small screens, readable text, color-independent cues, reduced motion, and audio/haptics alternatives. Choose measurable device/layout targets per game.
- Show screen states and transitions, including loading, empty, error, pause/resume, tutorial, success, and retry where applicable. Distinguish exploratory art from production exports.
- Describe the level data model, schema version, stable IDs, solution validation, difficulty dimensions, introductory sequence, failure modes, and playtest evidence. Never claim an untested difficulty curve is validated.
- Document monetization, analytics, online requirements, privacy-sensitive data, localization, and performance only when relevant and decided. Unresolved implementation-critical choices block the affected handover scope.

## Ready for implementation

Every in-scope requirement has a stable game-prefixed ID (for example `MATHLY-R-001`), precise behavior, acceptance examples, and dependencies. Level examples include expected results and at least one invalid/boundary case. Assets have manifest entries and accessible files or immutable versioned sources. The handover includes explicit exclusions and a coverage table from requirements to files and checks.

Visual mockups alone do not specify behavior. Written behavior and visuals must agree; contradictions are blockers, not an instruction to choose whichever is easier.

## Decisions and revisions

Use numbered ADRs: proposed → accepted → superseded or rejected. Record who approved, when, and where. Keep historical decisions; a new ADR links to the superseded one. Stable requirement and level IDs are not reassigned to unrelated behavior. Shared-standard exceptions need a game ADR and an explicit note in the handover.
