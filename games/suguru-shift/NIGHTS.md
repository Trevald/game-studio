# Suguru Shift — night log

## Night 1 — 2026-10-26

**Job:** new game, the studio's own pitch. Benji's queue was empty: no `building` idea, no pending notes, no queued
ideas (Sweepvault is parked), and every approved hand-over has its completion report (Math Crush FB-003, Mathly
FB-001, Ricochet FB-001). Pip Push had its 3 nights, so the producer pitched a new game: "Shift Suguru", a runner-up
from the Pip Push pitch.

**Shipped:**
- A solved Suguru scrambled by wrapping row/column slides. Regions stay put, numbers ride along. Regions turn green
  when they hold 1..N; red rings mark equal numbers touching (also diagonally). Any valid Suguru wins.
- 12 generated levels (`lab/gen.mjs`, seed 2026), 4×4 to 6×6, par 1–6. Each is proven by search: no valid grid within
  par−1 slides, exactly one valid grid at par.
- Drag a row or column (live wrap-around, snaps to steps, a full loop counts as nothing); tap a number + arrow pad;
  keyboard cursor with Shift+arrow or Space-then-arrow. Undo (whole drag), instant Restart (undoable), Hint (next
  slide, by a bidirectional search to the answer; points at Undo when you have wandered too far).
- Level picker with solved/at-par marks, best per level in localStorage (works without it), mute, light/dark, phone
  landscape layout.

**QA:** playtest ALL CHECKS PASSED (12/12 levels by `solve()`) · `qa/interact.mjs` 27/27 (keyboard, tap+pad, mouse
drags incl. multi-step and full wrap, undo/restart, hints solve every level at par, far hint → Undo in under 600 ms,
Enter/Space on buttons, blocked storage) · `qa/screens.mjs` at 390×844, 360×640, 1280×800, 844×390 with no
scrolling · 4 rounds · known issues: none.

**Reviewer:** ship with fixes. It delivers the twist on levels 1–8 ("every slide reads as a small 'was it this row?'
test"); the old 6×6 levels were a wall of red. Fixed: (1) Enter on a focused button ran twice and skipped a level, Space
on buttons armed a slide; (2) Hint froze up to 0.6 s and gave up, now a smaller search and an Undo/Restart pointer;
(3) levels 8–12 regenerated to keep ≥3 regions intact, ≤12 touching cells and a right first slide among the 3 best
board-improving slides; (4) win card no longer pushes the controls off a desktop screen (Undo/Play again/Next on the
card); (5) region walls are SVG strokes now, no corner notches. Also the level-2 tip no longer mentions red rings (that
board has none) and help says each step is one slide. Not done: live "regions if you drop here" preview while dragging
(nice to have).

**Assumptions:** any valid Suguru wins; a 2-step drag is 2 slides; all levels open from the start.

**Questions for Benji:** Keep going with Suguru Shift (daily board, 7×7, locked lines), or park it? · Should the hint
explain the deduction ("this region has two 3s") instead of naming the slide?

**Play:** https://claude.ai/artifact/7jkceHja8XRU1AYpyABWkS
