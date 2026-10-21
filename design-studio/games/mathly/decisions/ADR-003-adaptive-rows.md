# ADR-003 — Select Adaptive rows

- State: accepted — layout direction
- Date: 2026-10-21 (Europe/Stockholm)
- Decision owner / approver: Benji
- Approval evidence: owner message “Yes Adaptive rows” in [this Mathly chat](codex://threads/01a15879-c850-79e0-868d-b07f7116dfe9), following the equation-layout comparison. Preview interaction state alone is not the approval evidence.
- Approved reference revision: Adaptive rows in `explorations/playful-deck-equations-v1/preview.fragment.html` at commit `7237e90c714cafafa2df8dbbe9eaa4d02d644543`.
- Related requirement: MATHLY-VIS-005 — direction selected; detailed implementation contract remains to be completed.
- Supersedes: fixed two-row maximum for the proposed Playful Deck redesign only. Historical handover remains unchanged.

## Decision

Use Adaptive rows for Playful Deck. The reviewed examples use three rows at 375×667 and 390×844, and two rows with paging at 320×568. Keep expression tokens at least 44×44 CSS px, preserve ordered tokens across row/page boundaries, and keep target and result visible. The 11-token fixture fits on one page at all three sizes; the 19-token fixture fits on one page on the taller canvases and pages 12+7 on the compact canvas.

## Approval boundary

This selects the reviewed layout approach. It does not approve every detail of the illustrative preview, introduce new arithmetic rules, authorize a merge, or approve a complete implementation handover. The real responsive rule must account for usable height, safe areas and enlarged text rather than relying only on the three demo presets. Existing O1–O9 decisions are unaffected except the selected row-layout direction within O8; broader long-expression usability remains unverified.

## Next action

Prepare the scoped Playful Deck design packet with adaptive-row geometry, empty/partial/full/invalid/solved states, selection and drag behavior across boundaries, accessibility fallbacks and requirement checks. Resolve packet-specific blockers before requesting exact-version implementation approval for Claude Code.
