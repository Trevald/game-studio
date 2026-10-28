# Fault Lines — night log

## Night 1 — 2026-10-28 (22:30 shift)

**Job:** the studio's own game, new pitch. Nothing from Benji was waiting: no `building` idea, no pending notes, no
queued ideas (Sweepvault parked), and every approved hand-over already has its completion report (Math Crush FB-003,
Mathly FB-001, Ricochet FB-001). Suguru Shift had its 3 nights, so the studio pitched a new game.
Candidates: **Fault Lines** (a filled-in Suguru with the walls gone; draw the regions back), Sum Trail (one path
through every cell, checkpoints show the running total), Hitori Rooms (shade cells so each room keeps one of each
number). Picked Fault Lines: Benji's favourite family, a reversed deduction rather than Suguru Shift's sliding, a
one-thumb input (drag cells together), and levels that can be proven unique by exact cover in one night.

**Shipped:**
- Every cell numbered, no walls. Drag across cells to make a region; drag from a region to grow it; drag back to
  take a cell out of the stroke; tap a free cell for a one-cell region, tap a region cell to free it (the rest
  splits if it falls apart). A live line under the board reads the stroke ("3 cells: 1 2 3 · ✓ holds 1 to 3").
- Green = the region holds 1..N; red = a number repeats, more than 5 cells, or a fixed wall runs through it.
  Win when every cell is in a green region; the solved board drops its tints and keeps only the walls.
- 11 generated levels (`lab/gen.mjs 2810`): 4×3, two 4×4, two 5×5, three 6×6, three 7×7, with 1–5 orange fixed
  walls. Each is proven: exactly one answer by exact cover, solvable by two human steps (only one shape fits this
  cell / this shape would leave a cell with no shape), and the first step is always a forced region.
- Undo (unlimited), Restart (instant, undoable), Hint (first a region that can't be right, else the next region the
  deduction finds, outlined), level picker with solved marks, progress and boards kept per level, help on first
  visit, keyboard (arrows, Space/Enter pen, Backspace, Z/R/H/N/L), sound with mute, light/dark.

**QA:** playtest ALL CHECKS PASSED (11/11 levels by `solve()`) · `qa/interact.mjs` 45/45 (re-proves every level's
uniqueness and no-guess path from the embedded data, real mouse drags, retract, tap/free/split, wall blocking, a
region wrapped around a fixed wall turns red, undo/restart, both hint kinds, hint-only solve of level 5, win card,
Next, reload keeps the board, keyboard pen solves level 1) · screenshots at 390×844, 360×640, 1280×800, 844×390 with
no scrolling and 44 px buttons · 3 rounds · known issues: none. Tooling: as on earlier nights, `tools/` pins a
Playwright whose headless shell isn't in this container; QA ran with a container-only symlink to the preinstalled one.

**Reviewer:** ship with fixes. Best moment: L1's single wall that shows the obvious row-by-row split is wrong.
Fixed: (1) a tip claimed "a 1 with no 2 beside it stands alone", which is false (a 1 can reach its 2 through other
cells); tips rewritten; (2) fixed walls weren't enforced, so a region drawn around a wall's end could win with a
wrong answer (several answers per level in play); such regions are now red; (3) no forced first move on 9 of 11
levels; levels regenerated so every one starts with a forced region; (4) the "wrong" hint boxed each cell and read
badly on one-cell regions; now one outline around the region and "this cell belongs in a bigger region" copy;
(5) fixed walls looked like the player's borders; now orange with round ends. Also done: an "every cell is grouped,
but some regions are wrong" line. Not done: lifting the board higher on tall phones (the buttons stay at the bottom
for the thumb).

**Assumptions:** numbers 1–5; the "equal numbers never touch" rule holds in every grid but isn't a clue; fixed walls
are clues where the numbers allow two answers, kept as few as possible; no par or move count, the win card shows
hints used; all levels open from the start.

**Questions for Benji:** Keep going with Fault Lines (it gets two more studio nights), or park it? Next night: blank
cells (draw the region and fill the missing number) for harder boards, or a daily board?
