# Mathly — status

- Updated: 2026-10-20
- Stage: visual exploration; direction selection pending
- Current goal: explore a more exciting card-table presentation
- Branch: `design/mathly/visual-directions`
- PR: pending publication; baseline PR https://github.com/Trevald/game-studio/pull/2 is merged
- Inspected baseline: `7b5e8306d66ebfc4dac02c8e357b05fcf58f5d2b`
- Existing handover: `games/mathly-trails/design/handover-v1/`, spec v1.1, 2026-10-19. No exact approval commit/comment recovered; do not retroactively mark it approved under the new protocol.
- New approved handover / delivery / implementation PR / owner acceptance: none

## Completed

2026-10-20 visual exploration: compared three directions, generated and reviewed a common-state concept sheet, and recorded draft visual requirements and limitations in ADR-001. The owner requested exploration, not selection or implementation.

Read shared instructions, project scaffold, existing game design, full handover, night log, request history, code excerpts and saved QA. Confirmed the repository explicitly maps Mathly to `games/mathly-trails`. Updated project mapping and design index without moving the existing design or changing code.

## Implementation status and evidence

[Night 2 log](../../../games/mathly-trails/NIGHTS.md) reports phase 1 shipped: expression editor, exact arithmetic, Card Table styling, automatic completion, collections, 12 boards, hints, help, sound/high-contrast settings and local saves. [Code](../../../games/mathly-trails/index.html) confirms the operator palette, all-five flag, BigInt arithmetic and localStorage use.

[Saved QA report](../../../games/mathly-trails/qa/report.json), dated 2026-10-20, records 17/17 checks passed and all 12 boards solvable. These are prior results, not tests rerun in this intake. No fresh playtest, device verification or owner acceptance is claimed.

## Unresolved feedback and blockers

- Existing [REQUESTS R1](../../../games/mathly-trails/design/REQUESTS.md) is marked answered by the old handover; retain that history.
- Open observations in Night 2: no Daily/practice; repetitive Starter solutions; landscape uses stacked scrolling rather than specified two-column layout; undo history is lost on reload; duplicate-number shortcuts choose first free card rather than requiring selection. These are recorded observations, not newly resolved or approved changes.
- Existing handover O1–O9 remain the decision register. ADR-001 is a proposed visual exploration; no new approved handover exists.
- Next milestone, relevant rule approvals and release platform remain unresolved. Original daily site's repository/compatibility is unknown.

## Next action

Benji chooses Grand Table, Midnight Club or Playful Deck (or a preferred combination) for the next measured screen exploration. Grand Table with simplified controls is recommended; no direction is approved.

## Session checkpoint

Visual exploration adds ADR-001, a concept comparison and exact generation prompt, plus manifest/design/status updates. Existing implementation and historical packet are unchanged. Generated image inspected for arithmetic and intended controls; no fresh runtime/device tests. Work is on an isolated Mathly worktree. No new design approval or implementation authorization is implied.
