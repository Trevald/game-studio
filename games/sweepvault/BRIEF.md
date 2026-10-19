---
title: Sweepvault
slug: sweepvault
idea_id: t04rsyxc53uvmu1k02do
artifact: https://claude.ai/artifact/4UtwbypmnfbQBmTpWb1N66
---

# Sweepvault

## The idea
> Minesweeper inspired game for mobile — Instead of just clearing all tiles without mines you would search for multiple things. And you need to find certain things to complete the level. For example find a key before you can exit through the door. Power ups and other perks would be cool.

A phone-first Minesweeper where the goal isn't clearing the board: you dig through a minefield to find the key(s) hidden under safe tiles, then walk out through the door — picking up lanterns, hearts and gems on the way.

## References
- No links in the idea. *Minesweeper* (named) — numbers count adjacent mines, flags, flood-reveal on zeros; the studio knows it well.
- Searched for Minesweeper variants with goals/items: *Mamono Sweeper* (numbers count monster levels, you level up as you clear), *Dungeon Sweeper Roguelike* and *DragonSweeper* style itch.io games (a minefield used as a dungeon with items and an objective). Took from them: the board is a place you explore toward a goal rather than a chore to finish; items under tiles change what you can afford to risk. Nothing copied.

## Tonight (night 1)
1. Logic core: classic numbers, flags, zero flood-fill; every board is generated from a fixed seed and only kept if it is solvable by pure logic (no forced guesses).
2. The goal twist: a locked door is visible from the start; hidden key(s) under safe tiles; revealed numbers next to an unfound item glint so you know where to search. Exit through the door once you hold all keys — you don't have to clear the board.
3. Items: lantern (next dig uncovers a 3×3 safely, auto-flagging mines), heart (+1 life), gems (optional collectible, shown per level).
4. 3 hearts per level: a mine costs a heart instead of ending the run. Undo (any move, including the fatal one) and instant restart.
5. 8 levels that introduce one thing at a time; phone controls (tap dig, long-press or flag mode to flag) and keyboard; light/dark, mute.

## Assumptions
- Undo is in (RULES.md: undo in any puzzle game). Since every board is guess-free, undo is a mistake-forgiver, not a way to scout mines; the level-clear screen shows how many undos and hearts you used.
- The door is visible from the start (so the goal is clear) and its tile shows a number like any other; keys are hidden.
- Gems are optional and only count toward a per-level "all gems" badge. No currency, no shop.
- After review: undo brings tiles back but not a heart lost to a mine (the mine stays revealed), so hearts matter while undo still forgives misclicks. Undo is off on the "Out of hearts" screen; Retry restarts the same board.

## Later
- Endless/daily random board, more item types (compass pointing to the key, x-ray, chests that need a key, monsters à la Mamono Sweeper).
- Give lanterns real stakes (e.g. one deliberate 50/50 per level a lantern can resolve).
- Bigger boards with pinch-zoom, level select grid, best-score tracking.

## Design
### Core loop
Tap a hidden tile to dig. Numbers tell you how many of the 8 neighbours are mines; use them to find safe tiles and flag mines. Every few digs you choose *where to push*: toward the glinting numbers that hide the key, toward a lantern that buys a safe 3×3, or straight at the door once the key is in hand.

### The twist
The board is a search, not a clean-up. You only have to uncover what the goal needs: the key(s), then the door. Revealed numbers next to a hidden item glint in the item's colour, so you can deduce *where* the item is as well as where the mines are. Ending the level early (leaving the board half-cleared) is the skill.

### Controls
- Phone (one hand): tap = dig, long-press (0.35 s) = flag/unflag. A ⚑ toggle switches tap to flag mode. Tap the door to exit. Lantern button arms the lantern; next dig uses it.
- Desktop: click = dig, right-click = flag. Keyboard: arrows/WASD move a cursor, Space/Enter dig, F flag, L lantern, U or Z undo, R restart, N next level, M mute.
- Undo ↶ and Restart ↻ buttons always visible.

### Progression
Seeded generated boards, one fixed seed range per level, checked solvable at load by the same logic solver `solve()` uses:
1. 6×6, 4 mines, key — tutorial (start area is wide open, 3 hearts).
2. 7×8, 7 mines, key + gem.
3. 7×9, 9 mines, key + lantern + 2 gems.
4. 8×10, 12 mines, key + heart + 2 gems.
5. 8×10, 13 mines, 2 keys.
6. 8×11, 15 mines, key + lantern + heart + 3 gems.
7. 8×12, 16 mines, 2 keys + lantern + 3 gems.
8. 8×12, 18 mines, 3 keys + lantern + heart + 3 gems.

### Win / lose / restart
Win: tap the door while holding every key → "Vault opened" card with hearts left, gems found, undos used, Next. Lose: hearts reach 0 → "Out of hearts" card with Undo last move and Retry. Restart is instant (same board).

### Feel
1. Flood reveal ripples outward from the dug tile (CSS delay by distance), with a soft rising blip.
2. Item pickup: the tile pops, the item flies to the HUD, a chime per item type; the door glows when the last key is collected.
3. Mine hit: board shake + red flash + low thud, a heart breaks in the HUD. Reduced motion: no shake/ripple.

### QA plan
- `state()`: `{screen: "playing"|"won"|"lost", level, w, h, hearts, keys, keysNeeded, gems, gemsTotal, lanterns, lampArmed, flagMode, revealed, hidden, moves, undos}`
- actions: `{t:"dig",x,y}` (every hidden unflagged tile, and the door), `{t:"flag",x,y}`, `{t:"lamp"}` when a lantern is held, `"undo"` when history exists. All synchronous, no wall clock.
- `solve()`: the logic solver (single-number rules + subset rule between neighbouring numbers) run on a copy of the current state: digs only proven-safe tiles until all keys are held, then digs the door. Every level's seed is accepted only if this solver can collect all keys and reach the door from the start without guessing, so a level `solve()` can't finish can't ship.
