# Mathly — status

- Updated: 2026-10-21
- Stage: **H-001-v1 approved and delivered in place; awaiting Claude implementation**
- Goal: implement approved Playful Deck + Adaptive rows refresh.
- Publishing: direct commits to `main` under studio-wide owner preference; no PR required.
- Approved handover: [H-001-v1](handovers/H-001-v1/HANDOVER.md).
- Approved candidate: `5b019c0ff7daab13de703567b237913fd25c6e5e`.
- Approved scope: **MATHLY-VIS-001–005 and MATHLY-R-006–009**.
- Owner / date: Benji, 2026-10-21. [Exact approval and delivery record](handovers/APPROVAL-H-001-v1.md).
- Delivery destination: same packet path on main; read in place, no copy.
- Implementation: not started by this session; no implementation commit or acceptance yet.

## Completed

Selected Playful Deck (ADR-002), Adaptive rows (ADR-003), and the v2 refinement (ADR-004). Prepared the scoped packet with screen/interaction/layout contract, tokens, atlas, exact fixtures and all required runtime assets. Owner explicitly approved the candidate commit and requirement scope. Verified frozen packet checksums and no changes from approved candidate to published main; recorded approval outside the packet.

Packet checks passed: 54 static layout/state/safe-inset combinations with stable tray, 12 exact authored solutions, 11 UI fixtures, 8 base contrast pairs, raster decode/hash and runtime budget (344,388 bytes). These are design checks, not actual implementation/device accessibility results.

## Existing implementation and unresolved items

Implementation is `games/mathly-trails/index.html`; historical [Night 2 log](../../../games/mathly-trails/NIGHTS.md) and [QA](../../../games/mathly-trails/qa/report.json) record earlier phase 1 and 17/17 checks. They do not verify this new refresh. The old handover is preserved for history; approved H-001-v1 wins only within its explicit scope.

The full visual/interaction contract for this refresh is now approved. Historical O1–O9 product questions outside that scope remain unresolved; current arithmetic/puzzles are preserved. Daily/practice, Starter variety, persisted undo and original-site compatibility remain outside this implementation. No unresolved question blocks starting the approved scope; Claude must report newly discovered discrepancies through feedback rather than changing the packet.

Existing REQUESTS R1 remains answered by the historical handover. New implementation reports/questions go in `feedback/FB-NNN-*.md`.

## Next action

Claude Code reads H-001-v1 and the external approval record, reports a short plan/blockers, and implements the approved scope in `games/mathly-trails`, with requirement-by-requirement completion evidence.

## Session checkpoint

Approval and in-place delivery are recorded on main. Packet bytes are frozen and unchanged. Only records and an implementation-design pointer changed in this session; no game code was edited and no Claude session was launched. Runtime assets, source art and verification references are available in the packet.
