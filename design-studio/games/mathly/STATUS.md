# Mathly — status

- Updated: 2026-10-21
- Stage: H-001-v1 in review — exact-revision approval pending
- Current goal: review the complete Playful Deck + Adaptive rows handover candidate
- Publishing branch: `main` (direct commits authorized by Benji on 2026-10-21)
- PR: none required going forward. PR #5 is superseded by direct publication of its decision commits to main; prior PRs #4 and #2 are merged.
- Inspected baseline: `7b5e8306d66ebfc4dac02c8e357b05fcf58f5d2b`
- Existing handover: `games/mathly-trails/design/handover-v1/`, spec v1.1, 2026-10-19. No exact approval commit/comment recovered; do not retroactively mark it approved under the new protocol.
- New approved handover: none. Candidate: `handovers/H-001-v1/HANDOVER.md`; candidate commit `5b019c0ff7daab13de703567b237913fd25c6e5e` (published to main).
- Delivery: read in place after approval; no redundant copy. Implementation / owner acceptance: not started.

## Completed

2026-10-21: prepared H-001-v1 at owner request. Includes scoped visual/interaction contract, screen atlas, exact palette, 12 existing level snapshots and 11 UI fixtures, all runtime raster/vector assets, source PNG, reference screens, provenance and hashes. 54 static layout combinations, exact arithmetic fixtures, 8 base contrast pairs and asset decoding/budget checks passed. No implementation tests claimed. ADR-004 captures visual endorsement and preparation scope.

2026-10-21: reviewed Playful Deck concept versus equation study; generated partial/solved refinement v2 and recorded prompt, provenance, arithmetic/card-count inspection and visual limitations. New treatments are proposed; game code is unchanged.

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

Benji reviews and approves the exact H-001-v1 candidate commit for MATHLY-VIS-001–005 and MATHLY-R-006–009, with the packet exclusions, before Claude starts.

## Session checkpoint

2026-10-21: direct-to-main publishing is now a studio-wide preference, recorded in root RULES/CLAUDE and shared design workflow/protocol. Mathly’s next design action remains the scoped Playful Deck + Adaptive rows packet.

Visual exploration adds ADR-001, a concept comparison and exact generation prompt, plus manifest/design/status updates. Existing implementation and historical packet are unchanged. Generated image inspected for arithmetic and intended controls; no fresh runtime/device tests. Work uses an isolated Mathly worktree; its commits are published directly to main under the owner override. Playful Deck and Adaptive rows are selected; no complete handover or implementation authorization is implied. This checkpoint records the decision only; earlier layout results were not rerun.

### Handover checkpoint

H-001-v1 is an in-review candidate on main, not an approved night-shift job. Raster/runtime files are included and local references resolve. No PR, code edits or changes to the old packet. Newly specified detail remains subject to exact-revision approval.

Candidate approval request: H-001-v1 at `5b019c0ff7daab13de703567b237913fd25c6e5e`, scope MATHLY-VIS-001–005 and MATHLY-R-006–009, exclusions as HANDOVER Scope. No approval received for this exact packet yet. All later approval/checkpoint records stay outside the packet.
