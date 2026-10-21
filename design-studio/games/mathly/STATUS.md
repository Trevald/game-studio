# Mathly — status

- Updated: 2026-10-21
- Stage: Playful Deck and Adaptive rows selected; detailed packet pending
- Current goal: capture the selected adaptive layout and prepare the next design checkpoint
- Publishing branch: `main` (direct commits authorized by Benji on 2026-10-21)
- PR: none required going forward. PR #5 is superseded by direct publication of its decision commits to main; prior PRs #4 and #2 are merged.
- Inspected baseline: `7b5e8306d66ebfc4dac02c8e357b05fcf58f5d2b`
- Existing handover: `games/mathly-trails/design/handover-v1/`, spec v1.1, 2026-10-19. No exact approval commit/comment recovered; do not retroactively mark it approved under the new protocol.
- New approved handover / delivery / implementation PR / owner acceptance: none

## Completed

2026-10-21: owner changed the publishing workflow to direct commits on main. Recorded the override in PROJECT.md and carried the pending Adaptive rows decision into direct publication. Design/implementation approval requirements are unchanged.

2026-10-21: Benji explicitly selected Adaptive rows (“Yes Adaptive rows”). ADR-003 pins the reviewed reference and approval scope. Three-row taller layouts and two-row compact paging are selected; the implementation packet is still pending.

2026-10-21: recorded owner selection of Playful Deck in ADR-002, scoped to visual direction. Created an interactive 11/19-token equation study, measured 12 canvas/example/variant combinations in Chrome, and verified paging, selection and insertion positioning. See explorations/playful-deck-equations-v1/ for source, screenshot, results and limits. No production game code changed.

2026-10-20 visual exploration: compared three directions, generated and reviewed a common-state concept sheet, and recorded draft visual requirements and limitations in ADR-001. The owner requested exploration, not selection or implementation.

Read shared instructions, project scaffold, existing game design, full handover, night log, request history, code excerpts and saved QA. Confirmed the repository explicitly maps Mathly to `games/mathly-trails`. Updated project mapping and design index without moving the existing design or changing code.

## Implementation status and evidence

[Night 2 log](../../../games/mathly-trails/NIGHTS.md) reports phase 1 shipped: expression editor, exact arithmetic, Card Table styling, automatic completion, collections, 12 boards, hints, help, sound/high-contrast settings and local saves. [Code](../../../games/mathly-trails/index.html) confirms the operator palette, all-five flag, BigInt arithmetic and localStorage use.

[Saved QA report](../../../games/mathly-trails/qa/report.json), dated 2026-10-20, records 17/17 checks passed and all 12 boards solvable. These are prior results, not tests rerun in this intake. No fresh playtest, device verification or owner acceptance is claimed.

## Unresolved feedback and blockers

- Existing [REQUESTS R1](../../../games/mathly-trails/design/REQUESTS.md) is marked answered by the old handover; retain that history.
- Open observations in Night 2: no Daily/practice; repetitive Starter solutions; landscape uses stacked scrolling rather than specified two-column layout; undo history is lost on reload; duplicate-number shortcuts choose first free card rather than requiring selection. These are recorded observations, not newly resolved or approved changes.
- Existing handover O1–O9 remain the decision register. ADR-002 accepts Playful Deck and ADR-003 selects Adaptive rows. MATHLY-VIS-005 has an accepted direction; detailed responsive/interaction acceptance remains to be completed. Other ADR-001 requirements remain proposed. No new approved handover exists.
- Next milestone, relevant rule approvals and release platform remain unresolved. Original daily site's repository/compatibility is unknown.

## Next action

Prepare the scoped Playful Deck + Adaptive rows design packet, covering screen states, usable-height rules, editing across boundaries and accessibility, for exact-version implementation approval.

## Session checkpoint

2026-10-21: direct-to-main publishing is now a studio-wide preference, recorded in root RULES/CLAUDE and shared design workflow/protocol. Mathly’s next design action remains the scoped Playful Deck + Adaptive rows packet.

Visual exploration adds ADR-001, a concept comparison and exact generation prompt, plus manifest/design/status updates. Existing implementation and historical packet are unchanged. Generated image inspected for arithmetic and intended controls; no fresh runtime/device tests. Work uses an isolated Mathly worktree; its commits are published directly to main under the owner override. Playful Deck and Adaptive rows are selected; no complete handover or implementation authorization is implied. This checkpoint records the decision only; earlier layout results were not rerun.
