# FB-002 — Math Crush
Kind: question (owner decision that changes H-001-v1 scope)
Packet: H-001-v1
Code commit / private playable URL: see `git log -- games/math-crush/index.html` on main (22 Oct 2026); build https://claude.ai/artifact/D5kYHgsZbouMh73g1VMLTj is unchanged until the next publish.
Requirement IDs and implemented/deferred/failed results:
- MC-001 "Keep existing mode picker reachable … never remove Equation/Clear saves or access": **changed by the owner.** Benji, claude.ai Game Studio chat, 22 Oct 2026 20:54 CEST: "The game is getting better and we can now also focus on only the first concept Candy Match and remove the other two." Equation, Clear and the mode picker are removed from the runtime; the game opens on the Candy Match home. Saves: Equation/Clear records already stored in `mathcrush.v1` are left untouched (not deleted, not migrated).
- MC-002–MC-009: unchanged.
Commands actually run and outcomes:
- `node tools/qa/playtest.mjs games/math-crush/index.html` — all checks passed, 12/12 levels completable.
- `node games/math-crush/qa/engine-tests.mjs` — 54/54 (adds 17b: old Equation/Clear progress survives a save, no mode picker).
- `node games/math-crush/qa/screens.mjs phone` — no layout problems.
Phone/desktop screenshots and interaction evidence: `games/math-crush/qa/screens/` (phone set regenerated).
Deviations, unresolved questions and proposed resolution:
- Please record the owner's Match-only decision in STATUS / the next hand-over so future packets don't ask for Equation/Clear access again.
- Designer material for the three concepts (`games/math-crush/design/handover-v1/`, BASELINE.md in the packet) is untouched; whether to archive it is the designer's call.
- The "★ n / 36" star counter on Home now counts Match only (12 levels × 3).
Owner acceptance: given in chat (the instruction above).
