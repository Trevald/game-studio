# Mathly H-001-v1 — approval and in-place delivery record

- State: **APPROVED / DELIVERED IN PLACE**
- Owner / approver: Benji
- Date: 2026-10-21 (Europe/Stockholm)
- Approved candidate: `5b019c0ff7daab13de703567b237913fd25c6e5e`
- Packet: `design-studio/games/mathly/handovers/H-001-v1/`
- Scope: MATHLY-VIS-001–005 and MATHLY-R-006–009.
- Approval evidence: [Mathly chat](codex://threads/01a15879-c850-79e0-868d-b07f7116dfe9).

Owner's exact message:

> Approved H-001-v1 for Mathly at 5b019c0, scope MATHLY-VIS-001–005 and MATHLY-R-006–009.

## Exclusions and frozen content

Exclusions remain as approved packet Scope: no new puzzles/difficulty tuning, Daily/practice generation, purchases, accounts/sync, factorial, analytics, native packaging, new audio/haptics, persisted undo history, monetization or arithmetic rule changes. This approval is design implementation authorization for the named requirements, not acceptance of an implementation that has yet to be built.

All packet files and SHA256SUMS verified; no differences between candidate and main at `76dfe84d0b27ba3938c06b4e9912c2257fa52fde`. This record is deliberately outside the packet. The frozen HANDOVER header/checklist still describes its pre-approval candidate state: this external exact-revision record is authoritative for approval. Never edit that header to mark it approved; changed covered files require a new version/review.

## In-place delivery

Implementation repository: https://github.com/Trevald/game-studio, same as source. Published packet source commit is the approved candidate above; source/main byte equality verified before recording approval. Per studio/NIGHT_SHIFT.md, Claude reads this approved folder in place. No duplicated delivery folder or PR is required. Runtime files are copied to the game only during implementation.

Claude first reads latest root instructions, Mathly STATUS and this packet, reports the implementation plan/blockers, then implements only the approved scope and publishes directly to main. Report results in a Mathly feedback completion record with packet/version, implementation commit and actual checks. No Claude session has been launched by this approval-recording step.
