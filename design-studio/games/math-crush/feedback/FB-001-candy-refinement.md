# FB-001 — Math Crush
Kind: completion-report (+ one balance question, MC-006)
Packet: H-001-v1 (SHA256SUMS.txt verified OK before implementation)
Code commit / private playable URL: code at `c1621f4` on main (night-2 log commit follows it); private build https://claude.ai/artifact/D5kYHgsZbouMh73g1VMLTj (version 2). Runtime: `games/math-crush/index.html`, assets copied per ASSETS.json (`match-atlas.json` now names `match-atlas.webp`; `controls.svg` added).

## Requirement IDs and implemented/deferred/failed results
| ID | Result | Notes |
|---|---|---|
| MC-001 shell + six views | Implemented | Home (Continue + Choose level when a save exists; settings icon; quiet "All modes"), Candy trail 1→12 in order (snake path), Intro (target/quota/moves, ★★/★★★ thresholds, example chain, coach cards for multiplier L1 / striped L4 / wrapped L7 with Skip), Pause/Settings, Success, Retry ("One more try?"), plus Confirm, Help, Loading, Art-failure, Save-error and Restore-error states. Cream #FFF3DD panels, plum #4A1736 live text, raspberry #C81758 primary buttons; only tile_0..5 come from the atlas. Main title "Math Crush", mode label "Candy Match"; mode picker kept and Match marked Recommended. Equation/Clear untouched. |
| MC-002 gameplay + feedback | Implemented | 5×5, drag with immediate-tail backtrack, central-80 % hit area, no diagonals/interpolation, release anywhere evaluates, OS cancel free, one tile free. Sum card: live expression; "N missing" / "Release to clear" / "Too high · slide back to adjust". Feedback row: candies ×multiplier, points, blast and reward preview; blast-only cells get a soft glow without ordinal; reward preview badge on the last cell. Fixed HUD positions. Tap-to-select (Settings) and keyboard both use Submit. Pause cancels an uncommitted gesture. No filled stars during play. |
| MC-003 chain scoring | Implemented | floor((100+25(n−2))×{1,1.5,2,3}); 2..8 → 100,187,300,525,600,675,750 (tested). Blast bonus separate, finish 50×unused moves, quota once per chain, points → quota → zero-moves order. |
| MC-004 earning specials | Implemented | L1–3 none; L4–6 n≥4 striped; L7–12 n=4 striped, n≥5 wrapped; one per move on the last cell, keeps value, fresh id, then gravity; not activated the same move; on a winning move no refill and no placement (badge/announcement only). |
| MC-005 activation/resolution | Implemented | Chain or blast closure activates; stripe = row, wrapped = clipped 3×3; row-major closure, each once; union counted once; blast = 25 × (removal − chain); wrong sum activates nothing; refill seeded; "Board refreshed" replacement drops specials, no penalty. |
| MC-006 score stars | Implemented, **one level fails the 3★ check** | 1★ completion, 2★ ≥200×quota, 3★ ≥300×quota; Assisted shown and saved separately, no cap. 3★ route verified with the real engine for 11/12 levels; **level 2 cannot reach 900** (see question). Level data unchanged. |
| MC-007 speed bonus | Implemented (Phase C) | Off by default; Pause/Settings toggle "Speed bonus (experimental)", applies to next attempt; count-up clock beside the level label from the first committed move; counts only active play (pause, hidden tab, resolution, results excluded); elapsed ms persisted, never wall clock; bonus floor(100×max(0,1−s/(30×quota))) on success only, shown as its own row, excluded from stars; separate timed best. |
| MC-008 Undo/saves/a11y | Implemented | Unlimited Undo of committed moves (also from the Retry card), full snapshot incl. RNG, marks Assisted, never after a win, never rewinds time. Active attempt + undo stack + timing saved after every commit (before animation); Continue resumes; corrupt save → "Could not restore this attempt"; blocked storage plays in memory with a notice. Scores versioned `candy-v2` in `matchV2`; legacy v1 Match stars/bests kept untouched and shown as "Legacy best" on the intro. 44 px+ targets, plum focus ring, safe areas, live labels/announcements, colour-independent ordinals/stripes/wraps, reduced motion → ≤80 ms fades. |
| MC-009 evidence | Done | See below. |

## Commands actually run and outcomes
- `sha256sum -c SHA256SUMS.txt` (packet folder): all OK.
- `node tools/qa/playtest.mjs games/math-crush/index.html`: ALL CHECKS PASSED (18/18; 36/36 levels solved by `solve()`; 400 + 60 random actions; no console errors).
- `node games/math-crush/qa/engine-tests.mjs`: 53/53 passed (`qa/engine-tests.json`). Covers all 7 packet fixtures through the real `M.release/M.resolve/M.extend` (ordinary-four 300, stripe 325, wrapped-edge 350, recursive 425, wrong-sum, diagonal, repeated), the 36 v1 witnesses, scoring table, reward thresholds, backtrack / 9th tile, free single tile, wrong-sum cost, zero-move success, exact Undo + deterministic replay, reward placement + gravity, fresh-reward immunity, later stripe activation, overlapping specials + corner clipping, final-move success without refill, stars, speed timing (start, pause, no rewind, 45 s → 50), save/reload/Continue, corrupt save, legacy best, blocked storage, and real mouse drag (backtrack, release outside), tap mode and keyboard.
- `python3 data/validate.py` was not re-run tonight; the same data is checked by the engine tests above.
- Exhaustive search of level 2 (every valid-chain sequence, 3,100 nodes): best no-assist core 687.

## Phone/desktop screenshots and interaction evidence
`games/math-crush/qa/screens/` from `node games/math-crush/qa/screens.mjs`: phone 390×844, small 360×640, desktop 1280×800 and 150 % text (rem-scaled) for home, levels, intro, idle, selecting, exact chain with blast/reward preview, over target, after clear, wrong sum, pause, success, retry, confirm, tap mode, speed success. The script's audit found no targets under 44 px, no clipped labels, no horizontal overflow. Harness shots: `games/math-crush/qa/*.png`.

## Correction 22 Oct — visual match to the references
Benji reported the night-2 build did not look like the H-001-v1 references. Cause: the studio implemented from the written spec and did not open `references/menus.jpg` / `references/gameplay-states.jpg`. All six Match views and the gameplay states were redone against those images (see NIGHTS.md, "Night 2 follow-up"); the written corrections in SCREENS.md still win where the images differ. Engine, tests and data unchanged (playtest all pass, engine tests 53/53). New screenshots in `games/math-crush/qa/screens/`.

## Deviations, unresolved questions and proposed resolution
1. **Question — MC-006 level 2 three stars are unreachable.** Level 2 (target 10, quota 3, moves 5) tops out at 687 points with any route (exhaustive search), against 900. All other levels reach 3★ (L1 1112, L3 1225, L4–12 1,725–3,300, about double the bar). Proposal: either set level 2's 3★ to 650 (and consider ~700 for L1/L3), or replace level 2's board under R2. Studio did not change data or thresholds.
2. Deviation (layout): Match views use a flowing, scrollable page (max 480 px, centred on desktop) instead of the night-1 scaled 390×844 stage, so targets stay ≥44 px at 360×640 and text can grow 150 %. Geometry follows SCREENS.md proportions rather than exact pixel coordinates.
3. Deviation (copy): with tap/keyboard mode the exact-sum line reads "Submit to clear"; over target it reads "Too high · tap the last candy to step back". Above target the preview row says "Wrong sum · releasing now costs 1 move" (reviewer finding).
4. Hint still shows the shortest legal chain (v1 rule, unchanged). The reviewer suggested pointing it at the best-scoring chain to teach the multiplier: designer's call.
5. Reviewer note for the designer: levels 1–3 have no tension beyond stars (moves = quota + 2, legal chain always guaranteed, unlimited Undo). In-play star threshold ticks were suggested. Related to open R1/R2.
6. R2 (repeated starter levels) and R3 (fourth prototype) remain open; not touched.

Owner acceptance: pending
