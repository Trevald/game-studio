---
title: Fault Lines
slug: fault-lines
idea_id: studio-fault-lines
artifact: <filled in after the first publish>
---

# Fault Lines

## The idea
> Fault Lines: a finished Suguru with every number filled in but no walls; draw the regions back so each region of
> N cells holds 1..N once
> (studio pitch, 28 Oct 2026 — Benji's queue was empty and Suguru Shift had its 3 nights. Runners-up: "Sum Trail",
> draw one path through every cell where checkpoints show the running total you must hit; and "Hitori Rooms", shade
> cells so each room keeps exactly one of each number.)

A Suguru run backwards: the numbers are all there, the walls are gone, and you draw the regions back in.

Why this one: Suguru is Benji's favourite family, and this flips the deduction (from "which number goes here" to
"which cells belong together") instead of reusing Suguru Shift's sliding. Earlier pitches passed on a wall-less
Suguru because drawing regions *and* numbers is heavy on a phone; with every number given, the only input is
dragging cells together, which works with one thumb. Levels can be generated and proven unique by exact-cover search
in one night. Sum Trail needs heavy arithmetic per move; Hitori Rooms is close to plain Hitori.

## References
- No links in the pitch. Suguru/Tectonic rules (region of N cells holds 1..N; equal numbers never touch, also
  diagonally) are known; nothing fetched.

## Tonight (night 1)
1. Core: every cell numbered, drag across cells to group them into a region, live feedback (a region that holds
   exactly 1..N turns green, a region with a repeated number or more than 5 cells turns red), win when every cell
   is in a green region.
2. 11 generated levels, 4×3 to 7×7, each with exactly one answer, solvable by deduction without guessing (proven by
   `lab/gen.mjs`). Some levels show a few fixed walls where they are needed to make the answer unique.
3. Drag on touch/mouse (drag from a region to grow it, back over a cell to take it back, tap to free a cell);
   keyboard cursor + pen.
4. Undo, instant restart, hint (marks the next region you can deduce, or a region that can't be right), level picker.

## Assumptions
- Max region size 5 (numbers 1–5), as in most Suguru books.
- The original Suguru's "equal numbers never touch" rule holds in every grid (the generator makes real Suguru
  solutions), but the player never has to check it: it's not a clue here, only the region rule is.
- Fixed walls ("given" walls, orange) are allowed as clues where the numbers alone allow two answers; the generator keeps
  as few as it can.
- No par or move count; the win card shows hints used. All levels open from the start.

## Later
- Blank cells (draw the region *and* fill the missing number) for harder levels.
- Daily board, 8×8 boards.

## Design
### Core loop
Scan for a forced shape (a number with only one way to collect the 1..N it needs, a 5 that needs a 4, 3, 2 and
1 within reach, a cell that only one shape can still cover), drag those cells together, watch it turn green, which
leaves fewer free cells for the rest. (Equal numbers never touch in a Suguru, so a "lone 1" only happens behind
fixed walls.)

### The twist
The numbers are the whole clue. A region's size is the largest number in it, so every number is a promise about
the size of the region it belongs to, and every free cell must end up in some green region.

### Controls
- Touch/mouse: press on a free cell and drag through neighbouring cells: they become one new region on release.
  Press on a cell already in a region and drag: the cells you cross join that region. Dragging back onto the
  previous cell takes it back out of the stroke. Fixed walls can't be crossed. Tap a free cell: it becomes a
  one-cell region. Tap a cell in a region: it leaves the region (the rest splits if it falls apart).
- Keyboard: arrows move the cursor; Space/Enter puts the pen down at the cursor (then arrows add cells) and lifts
  it again; Backspace/Delete frees the cursor cell; Z undo, R restart, H hint, N next level.

### Progression
`lab/gen.mjs` (fixed seed) builds a random Suguru solution, then uses exact cover (all connected shapes of up to 5
cells whose numbers are exactly 1..size) to check that the regions are the only answer, adding a fixed wall where a
second answer exists and removing every fixed wall that isn't needed. A level is kept only if a "human" solver
finishes it using two kinds of step: *only one shape fits this cell*, and *this shape would leave a cell with no
shape*, and only if the very first step is of the first kind (there is always a forced first region). Order: 1 4×3, 2–3 4×4, 4–5 5×5, 6–8 6×6, 9–11 7×7, rising in look-ahead steps needed (0–7), 1–5 fixed walls.
Tips on the first levels: "drag across cells to make a region", "a region's biggest number is its size", "orange
lines are fixed walls", "find a number with only one way to collect what it needs".

### Win / lose / restart
Win when every cell is in a green region. A region with a fixed wall inside it (drawn around the wall's end) is red,
so the win is always the unique answer. Card: hints
used, Next. No lose state; Undo is unlimited, Restart is instant and undoable.

### Feel
- The stroke shows live as you drag (outline follows the finger, cells tint).
- A region snaps green with a soft chord when it becomes 1..N; a short tick on every new region; win chord
  (WebAudio after the first gesture, mute toggle).
- The solved board fades its tints and leaves only the walls, like a finished Suguru page.

### QA plan
- `state()`: `{screen: "playing"|"won", level, size, regions: [[cells]], free, good, bad, hints}`.
- Actions: `"tap:<i>"`, `"join:<i>:<j>"` (stroke from cell i to neighbour j), `"region:<i,j,...>"` (make these
  cells one region), `"undo"`, `"restart"`, `"hint"`. `actions()` lists taps and joins (not region:).
- `solve()`: `["restart", "region:..." for each answer region in the deduction order]`. Every level must finish.
