# FB-005 — Math Crush
Kind: completion-report
Packet: H-002-v1 as changed by owner scope update FB-004 (focus on chains and special candies)
Code commit / private playable URL: night 4 commits on main (`math-crush: night 4`, preceded by `remove hammer, Sugar Rush and speed challenge (FB-004)`), baseline `1c4d9c5`. Playable: https://claude.ai/artifact/D5kYHgsZbouMh73g1VMLTj (private, version 6).

Requirement IDs and implemented/deferred/failed results:

| ID | Result | What was done |
|---|---|---|
| FB-004-A hammer (MC-014) | Implemented | No hammer button, charge, targeting/confirm flow, L6 cue, help copy, keyboard path or `__qa` action. Engine `M.hammer` and level `tools` data removed. Restored older saves drop the hammer fields. |
| FB-004-B Sugar Rush (MC-015) | Implemented | No charge bar, ×2, activation cue/sound, L8 lesson or Rush fixtures. Long-chain multipliers and stripe/wrapped blast scoring unchanged. An old attempt with Rush state (L8–12) cannot resume (see E). |
| FB-004-C time challenge (MC-017 speed) | Implemented | No "Try speed challenge" button, clock, time rows or record, no active-time ticker. Results keep Next, Play again, score and stars. Play is untimed. |
| FB-004-D stickers (MC-016) | Implemented as recommended | Perfect Batch and Sugar Rush retired: never awarded; book shows 4 active stickers ("n of 4 discovered"). Earned ones stay in history, still usable as the badge, and show under "Retired · earned under the old rules" only for players who earned them. No replacement sticker invented. |
| FB-004-E saves and balance (MC-019 / MC-011) | Implemented | New rules version `core-v1` for records and attempts; one-time migration on load. Unlocks, stars, wins, sticker history and the old `sweet-v1` records (including best times) are kept verbatim. Best scores carry over for L1–7 (no Rush there; the hammer never scored). For L8–12 the old best moves to `rushBest`, shown on the result card as "Best with Sugar Rush (old rules)"; the current best starts at 0. An unfinished L1–7 attempt continues (hammer/Rush/clock fields stripped, same scoring, Undo history kept). An unfinished L8–12 attempt is archived and offered as "Start this level" with "Your stars and levels are safe. Your unfinished round was played under the old rules, so it starts fresh." No damaged-save message. Three-star reachability without Rush re-verified on all 12 levels (real-engine beam search, width 40): L8 1812 ≥ 1200, L9 3075, L10 3600, L11 3025, L12 3050 ≥ 1500. No threshold changes. |

Commands actually run and outcomes:
- `node tools/qa/playtest.mjs games/math-crush/index.html`: all checks passed (12/12 levels solved).
- `node games/math-crush/qa/engine-tests.mjs`: 85/85. Includes new FB-004 checks: no hammer/Rush UI, copy, state or action on any level; L8+ chains score unboosted; no speed button/clock/time rows; retired stickers never awarded; migration of a sweet-v1 save with an L3 attempt and with an L9 attempt.
- `node games/math-crush/qa/screens.mjs`: phone, small phone, desktop and 150 % text; no layout problems.
- Separate reviewer agent: "ship it". It made real saves in the previous build and opened them in this one; carry-over confirmed.

Phone/desktop screenshots and interaction evidence: `games/math-crush/qa/screens/` (`*-h01-L6-toolbar-no-hammer`, `*-r01-L8-no-rush`, `*-r02-L8-after-3-chain`, `*-w03-L8-win-old-rush-best`, `*-b04-book-retired`, `*-p06-old-attempt-offer`) and `qa/engine-tests.json`.

Deviations, unresolved questions and proposed resolution:
- The "Best with Sugar Rush (old rules)" line keeps the Rush name visible on L8–12 for players who had one. FB-004-E asks to distinguish these scores, so it stays; the reviewer suggested dropping it. Designer call.
- Reviewer findings outside this scope (proposals only, not built): flat L5–12 curve (same target/quota/moves/thresholds; 4-candy chains alone give ★★★ on 11 of 12 levels), the loss card's three example tiles don't relate to the loss, the same colour for different values (n mod 6, still open from FB-003), the post-blast ghosts and popup overlap for a moment, no non-addition operators yet.
- Not run: real device, sound/haptics by ear, screen reader.

Owner acceptance: pending
