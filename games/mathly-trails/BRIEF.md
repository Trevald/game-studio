---
title: Mathly
slug: mathly-trails
idea_id: 26uyl3583vvy9lnypy1r
artifact: https://claude.ai/artifact/3ouYeSyBQsbEQ46theZZck
---

# Mathly

> **Night 2 onward:** Benji's designer hand-over (`DESIGN.md` → `design/handover-v1/DESIGN.md`) replaces the
> night-1 merge-tiles model. Where this brief and DESIGN.md disagree, DESIGN.md wins. The night-1 brief is kept
> below under "Night 1 (superseded)".

## Tonight (night 3) — from Benji's note "mathly-h001"
Build the approved hand-over **H-001-v1** (Playful Deck + Adaptive rows), read in place from
`design-studio/games/mathly/handovers/H-001-v1/`. Approved by Benji on 2026-10-21 at candidate `5b019c0`, scope
**MATHLY-VIS-001–005 and MATHLY-R-006–009** (record: `design-studio/games/mathly/handovers/APPROVAL-H-001-v1.md`).
It wins over DESIGN.md and the night-2 Card Table look inside that scope. Goals, in order:
1. VIS-001 / R-006: Playful Deck palette and materials from `tokens.json`: jade felt (`felt-jade-v1.webp`, relative URL,
   solid `#094C3C` fallback), yellow TARGET, cream RESULT, cream number tokens, mint operator tokens, coral palette,
   quiet cream Undo/Hint/Restart, live `Mathly` wordmark in Georgia, rounded system numerals. No base64 art.
2. VIS-005 / VIS-002: the exact six-section geometry of SPEC §2 (header 44, plaques 72/64, workspace = rest, tray 56/48,
   palette 48/44, actions 44), workspace with a 44px page strip, a fixed 44px grid of cells (columns from width,
   rows 3/2/1 from workspace height thresholds 300/240/192), a reserved 24px status line and a reserved 44px
   selection strip. Explicit pages ("Page 1 of 2 · 1–12"), selection outline + "Selected: 3" text, "Go to selection".
3. VIS-003: one check in RESULT + "Solved", yellow workspace outline, editing locked, 600 ms then completion; Review is
   read-only and labelled.
4. VIS-004: landscape two-column layout and the accessible section layout (Expression / Cards / Controls tabs) when
   the workspace would fall under 192px, focus ring, 44px targets, high contrast without texture.
5. R-008: Home, collections, collection detail, completion, settings and How to play restyled with the same tokens;
   completion gets the existing "Try another way". No new features.
6. R-007 / R-009: engine, 12 boards, saves (`mathly.v1`) untouched; run the checklist and write the completion report
   in `design-studio/games/mathly/feedback/FB-001-*.md`.

Out of scope (packet exclusions): new puzzles, Daily/practice, purchases, new audio, persisted undo, rule changes.

### Assumptions (night 3)
- The 44px header holds back, the `Mathly` wordmark and settings (as in the atlas). The board name ("Starter · 01")
  moves to a small line under the wordmark inside the same 44px, so the player still knows where they are.
- With a token selected the caret sits right after it (as the atlas draws it), so a tapped card goes after the
  selected token, as before.
- Old Card Table art (`felt.webp`, `logo.svg`, `table-mark.svg`) is no longer referenced and is removed from the game
  folder (git keeps it).

## Tonight (night 2) — from Benji's note "mathly-design-v1"
Goal: **phase 1** of the hand-over, in the Card Table look.
1. New engine: five card instances with IDs, reusable + − × ÷ ( ), a real recursive-descent parser over tokens
   (no `eval`), exact BigInt rational arithmetic, the result states of §2 (empty, valid, target matched early,
   incomplete with "Last valid", divide by zero, solved). `requireAllNumbers` on.
2. Play screen (§3, §4, 05–12 mockups): target + result plaques, expression well with caret, five stable source
   slots with "Used" ghosts, operator palette, Undo / Hint / Restart. Tap-to-insert at caret, tap an expression
   token for Before / After / Remove / Done (+ Replace for operators), drag and drop to insert, move and remove,
   keyboard inside the workspace. Undo covers every edit including Restart. Automatic completion, 600 ms in-place
   success, then the completion screen (13) with Next puzzle / Review expression.
3. Starter's 8 boards from `data/levels.json`, loaded as is; Home (01) → Starter (03) → play → complete.
4. Only if cheap after 1–3: the other 4 sample boards as their collections, a three-step hint, settings with sound
   and high contrast.

Out of scope tonight (phase 2/3 in DESIGN.md): practice generation, daily, How to play pages, large-text layouts,
landscape two-column board.

## References
- `games/mathly-trails/DESIGN.md` and `design/handover-v1/` — the designer's spec, mockups, tokens, levels and art.
- https://mathly.trevald.com — tried again tonight with WebFetch; the request wasn't allowed to complete, so
  nothing new was read. The hand-over (built from Benji's own screenshots) is the source of truth.

## Assumptions (night 2)
- Studio decisions in DESIGN.md hold: no purchase flow, all collections open, progress in localStorage.
- Open items use the designer's defaults: no factorial (O2), exact rationals allowed (O3), expression paging (O8).

## Design (night 2)
### Core loop
Look at target and five cards, place cards and operators into the expression, watch the live result, rearrange
until all five cards make exactly the target. Nothing is irreversible: every token stays editable.
### The twist
One expression, freely rearranged, with all five cards: precedence and parentheses do the work that merges did.
### Controls
- Touch/mouse: tap a card or operator to insert it at the gold caret; drag any card/operator into a gap in the well;
  drag an expression token to another gap to move it, or onto the card tray to remove it. Tap an expression token to
  select it: Before / After (move caret), Remove, Done; with an operator selected, tapping a palette operator
  replaces it.
- Keyboard (workspace focused on board start): ← → move caret / selection, Home/End, Enter selects, Delete/Backspace
  removes, Esc deselects, + - * / ( ) insert, number keys insert a uniquely identified unused card, 1st-free
  for duplicates via Tab to the source slot, Ctrl/Cmd+Z undo, R restart, H hint.
### Progression
Starter 1-1 … 1-8 as authored (all selectable, next = first incomplete). Samples: Multiplication 2-1, Division
3-1 and 3-2, Mastery 4-1.
### Win / lose / restart
Win = valid, all five used, exactly the target. No lose. Restart is instant and undoable.
### Feel
1. 140 ms snap of a placed token, gold caret. 2. Solve: gold outline and ✓ on the result for 600 ms, then the brass
medallion. 3. Clear words for incomplete/invalid states.
### QA plan
- `state()`: `{screen: "home"|"collection"|"playing"|"won", level, levelId, target, tokens:["n1","+",…],
  expression, result: {state, value, reason}, used, caret, solved}`
- actions while playing: `{t:"card", id, at}`, `{t:"op", op, at}`, `{t:"remove", at}`, `{t:"move", from, to}`,
  `"undo"`, `"restart"`. Home: `"continue"`, `"starter"`; collection: `{t:"level", i}`.
- `levels()` = 12 (8 Starter + 4 samples). `reset(i)` opens board i in play.
- `solve()`: `["restart", …inserts]` from the level's stored verified solution, cross-checked by an independent
  exhaustive solver (all binary trees over the five cards).

---

# Night 1 (superseded)


## The idea
> Full game version of Mathly — Daily challenge but also some way to play more challenges. Either just by randomizing one board at the time like Auguru or even better would be to expand it on to a game with worlds and levels which you travel through. Or just use the concept as inspiration for a game where you encounter these math challenges. It can start easy with just few operators and fewer numbers and then it gets more difficult when you continue.
> Url to game: https://mathly.trevald.com

A math puzzle with a daily challenge plus a trail of worlds you travel through, starting with few numbers and only + and −, and adding operators and numbers as you go.

## References
- https://mathly.trevald.com — **couldn't read it.** The page is rendered by JavaScript and WebFetch only returned the title, "Mathly - Daily math challenge", and a viewport tag. No rules, board or style came through. I didn't scrape it another way.
- "Auguru" (named, not linked): a web search found nothing by that name. I read it as "a new random board every time you ask".
- Because I couldn't see Mathly itself, the core is a reading of Benji's own words ("numbers and operators", "few operators and fewer numbers", "daily challenge"). It uses the well-known make-the-target format (Countdown numbers round, NYT Digits, the 24 game): combine number tiles with operators to reach a target.

## Tonight (night 1)
1. Core puzzle: a target number and a hand of number tiles. Pick a tile, an operator and a second tile, and the two merge into the result. Reach the target. Use **every** tile for a perfect ★★★.
2. Four worlds on a travel trail, 8 levels each (32 levels). The first world starts with 3 tiles and + only. The later worlds add −, then ×, then ÷, with more and bigger numbers. Levels come from a seeded generator, so they're the same for everyone and every one has a guaranteed all-tiles solution.
3. Daily challenge, seeded by the date: 6 tiles, all operators, a three-digit target. The same puzzle for everyone today, with a ★ record per day.
4. Endless "Random board" practice for any unlocked world (the "Auguru" reading).
5. Undo, instant restart, phone and keyboard controls, light and dark themes, sound with a mute toggle.

## Assumptions
- I couldn't see Mathly, so its exact rules may differ. This is the make-the-target puzzle (see References), and this is the first thing to confirm.
- Results must be positive whole numbers. ÷ only works when it divides exactly, and − only from the larger tile. This keeps the game tidy, as in Countdown.
- Stars: reach the target = ★, with one tile left over = ★★, using every tile = ★★★. Reaching the target with tiles to spare shows a Finish button, so you can stop there or keep going for ★★★.
- The next level unlocks with ★. Travelling to the next world needs its last level cleared **and 14★ of 24** in the world (added after review, so ★★★ matters). No timer.
- Hint button (H) shows the next merge of an all-numbers route; using it caps that board at ★★.
- Difficulty: each board allows at most a set number of all-tile routes (40 for 4 tiles, 150 for 5, 300 for 6), has no one-merge shortcut, and boards within a world are ordered easiest first. Trail boards are precomputed into the file; the daily and random boards use the same generator live.

## Later
- Hints, a share-your-daily result string, streaks.
- More worlds (fractions, powers, negative numbers), and hand-made levels from Benji.
- Matching the real Mathly's look and rules once Benji confirms them.

## Design
### Core loop
Look at the target and the tiles, spot a route (`7 × 6 = 42, 42 − 2 = 40`), and make it one merge at a time. Each merge shrinks the hand. The interesting part is using *every* tile: easy targets are reachable in two moves, but finding the route that uses all the tiles is the real puzzle.

### The twist
The ★★★ "use every number" rule turns a quick arithmetic game into a planning puzzle (24-game style). Every level is generated so that such a route exists, and the generator rejects routes that are trivial (just adding everything up) once − is available.

### Controls
- Touch or mouse: tap a tile, tap an operator, tap a second tile. Tapping the same tile again deselects it. Undo ↶, restart ↻ and Finish buttons.
- Keyboard: 1–6 picks a tile by position, + - * / (or x) picks an operator, U or Backspace undoes, R restarts, Enter finishes or continues, Esc goes back.

### Progression
- W1 Addition Meadow (+, −): 3–5 tiles of 1–9, targets 10–40. 1-1 is a tutorial with 3 tiles and + only.
- W2 Times Hills (+ − ×): 4–5 tiles of 1–12, targets 20–150.
- W3 Divide Dunes (+ − × ÷): 4–6 tiles, including 25 and 50, targets 30–300.
- W4 Summit (all four): 5–6 tiles from 1–10, 25, 50, 75 and 100, targets 100–999.
- Each world's construction uses its newest operator at least once. Plus a Daily and Random boards.

### Win / lose / restart
Win: a tile equals the target. One tile left that equals the target finishes automatically; otherwise Finish ends the level. There's no losing. A dead end (one tile, wrong number) says so and points at undo and restart. Restart and undo are instant.

### Feel
1. Merging: tile A flies into tile B, and B pops with the new number, with a rising blip.
2. Target made: the target ring fills and glows. Finish plays a chord, and ★★★ gets a bigger flourish.
3. Invalid merges (a non-integer ÷, or a − that would go negative) shake the tile and show a short reason.

### QA plan
- `state()`: `{screen: "title"|"map"|"playing"|"won", world, level, target, tiles:[numbers], ops:[...], moves, made: bool, stars}`
- actions while playing: `{a, op, b}` merges (indexes into the current tiles, only valid results), plus `"undo"` and `"finish"` when the target is made. Title/map: `"start"`.
- `levels()` = 33 (32 trail levels + today's daily). `reset(i)` starts level i.
- `solve()`: depth-first search over merges from the current hand for an all-tiles route to the target, returned as merge actions. The generator guarantees one exists, so a level `solve()` can't finish is broken.
