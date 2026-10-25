# Acceptance and return checklist

| ID | Required evidence |
|---|---|
| MC-010 | Play and Next directly reach board; no modal tutorial; witness and alternate route complete lessons; replay doesn't repeat; invalid L1 free and L4 charged; tap/keyboard equivalence; pause/inactivity |
| MC-011 | Validate all level data; real-engine 3-star route per level without tools/speed; L1 clean pair route 400→3 stars; score meter matches final rating; no completion star before win |
| MC-012 | Starting stripe/wrapped fixtures; earn at threshold; numeric contribution only selected; fresh reward immune; closure once per ID; winning reward no refill; Undo exact |
| MC-013 | Run JSON combos; overlaps counted once; multiple-pair priority/tie order; invalid sum inert; wrapped edge clipping; preview union equals commit |
| MC-014 | Confirm/cancel; charge atomic once; hammer no score/quota/move and no special trigger; seeded refill solvable; Undo restores charge/RNG; Perfect Batch tool usage monotonic |
| MC-015 | Run Rush fixtures; no charge during active; no consumption for wrong/tool/time; starts L8 charge2; win with unused charges no bonus/carry; pause/save/Undo |
| MC-016 | Stage vs win commit; failure/restart discard; undo event rollback; toolsUsed remains; six sticker predicates; no duplicate unlocks; badge selection; blocked storage |
| MC-017 | Immediate replay; final-level Next becomes trail; optional challenge only after completion; first/record/slower times; pause/hidden/resolution excluded; old score not time; no timed/untimed mid-run conversion |
| MC-019 | Save migration preserving old records/removed modes/unlocks/archived active; corrupt/blocked storage; atomic animation reload; all states at360×640,390×844,1280×800,150% text;44px targets; keyboard/focus/live announcements/reduced motion |

Run existing `node games/math-crush/qa/engine-tests.mjs` and `node tools/qa/playtest.mjs games/math-crush/index.html`, updating assertions only where the new contract intentionally supersedes old behavior. Extend __qa for new state/actions and use actual engine functions. Existing baseline three-star evidence is not a substitute for testing implemented rules. Take screenshots of every changed state including hammer target/cancel, Rush charge/expiry, locked/earned book, timed win and failure/Undo. Run schema/hash checks before implementation.

Actual package-preparation checks: see VALIDATION.md. Implementation must report actual commands and results, not copy this checklist as passed. Return `feedback/FB-003-sweet-play.md` with packet hash, code commit, per-ID phase status, screenshots/play URL, failures and deviations. Phase boundaries are allowed; claims must match deployed behavior. Owner acceptance remains separate.
