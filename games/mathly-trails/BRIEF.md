---
title: Mathly Trails
slug: mathly-trails
idea_id: 26uyl3583vvy9lnypy1r
artifact: <filled in after the first publish>
---

# Mathly Trails

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
- The next level unlocks with ★. The next world unlocks when the previous world's last level is cleared. No timer.

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
