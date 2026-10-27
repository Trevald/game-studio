# Suguru Shift — night log

## Night 3 — 2026-10-27 (22:30 shift)

**Job:** the studio's own game, night 3 of 3 (last planned). Nothing from Benji was waiting: no `building` idea, no
pending notes, no queued ideas (Sweepvault parked), every approved hand-over has its completion report (Math Crush
FB-003, Mathly FB-001, Ricochet FB-001). Last night's question (daily board or 7×7) had no answer, so the studio chose
the daily board. Input: the brief's "Later" list and the reviewer's open nice-to-have.

**Shipped:**
- **Daily board.** A "Today" card at the top of the level picker opens one board per calendar day (the player's local
  date). Mon/Tue 5×5 par 3, Wed–Sat 6×6 par 4, Sun 6×6 par 5. 364 boards (52 weeks, from 28 Oct 2026) made by
  `lab/gen.mjs 2027 daily` and baked into the file, each proven like the campaign: par is the shortest solution and
  exactly one valid grid is reachable at par; 6×6 days keep ≥3 intact regions, ≤12 touching cells and a right first
  slide among the 3 best. Best per date, ★ at par. The page moves on to the new board at midnight. No streaks or
  countdowns.
- **Bigger hint text on tall phones** (night 2 nice-to-have): 18 px, centred in the empty band above the arrows.
- A small dot on the level button while today's board is unplayed.

**QA:** playtest ALL CHECKS PASSED (18/18 levels by `solve()`, today's board included) · `qa/interact.mjs` 58/58
(adds: all 364 daily boards checked for weekday size, par = shortest path, solution reaches a valid goal, no repeats;
pool repeats after 52 weeks; Today card, daily win card, per-date best, last level → All levels; one-cell hint wording
over every move of every daily board; bad `?day=` ignored; midnight rollover with a fake clock; waiting dot) ·
`qa/screens.mjs` at 390×844, 360×640, 1280×800, 844×390 with no scrolling, plus daily, daily hint and daily win shots ·
3 rounds · known issues: none. Tooling note: as last night, `tools/` pins a Playwright whose headless shell isn't in
this container; QA ran with a container-only symlink to the preinstalled one.

**Reviewer:** ship with fixes. Best moment: the Sunday 6×6 par 5, "the last two slides clear all the red at once".
Fixed: (1) "Today" went stale if the page stayed open past midnight; it now rolls over; (2) hints said "a 5 in only 1
cells"; one-cell regions now read "the one-cell region holding a 5 (a lone cell must be 1)"; (3) the bigger hint
text barely changed (16 px); now 18 px and centred in the gap. Also done from the nice-to-haves: the waiting dot, and
`?day=` rejects impossible dates. Not done: a "next board tomorrow" line or a pointer to the next unsolved level on
the daily win card. Noted, not changed: Mon/Tue boards are a warm-up (a greedy bot solves 47% at par, 19% on
Sundays), and 250 of 364 boards have a one-cell region, which makes the first move loud.

**Assumptions:** daily over 7×7 (7×7 needs a faster par solver); the day is the player's local date; only today's
board is playable (no archive); the pool is baked in (about 45 KB) so every board carries a par proof, and it repeats
after 52 weeks.

**Questions for Benji:** This was the studio's last planned night on Suguru Shift. Keep it on the bench (it needs your
notes), or park it? · Mon/Tue are easy warm-ups and Sunday is the hard one: is that the right week shape?

**Play:** https://claude.ai/artifact/7jkceHja8XRU1AYpyABWkS

## Night 2 — 2026-10-27 (03:50 shift)

**Job:** the studio's own game, night 2 of 3. Nothing from Benji was waiting: no `building` idea, no pending notes,
no queued ideas (Sweepvault parked), every approved hand-over has its completion report. Input: last night's open
nice-to-have (live drag preview), the brief's "Later" list (pins, explaining hints) and last night's hint question.

**Shipped:**
- **Pins.** A dark number with a yellow dot is pinned: it is in its right place, and its row and column can't slide
  (those lines are striped). Dragging a pinned line wiggles and the tip says why; the pad tells you which arrows still
  work. Five new levels, 13–17 (5×5 and 6×6, par 2–4, one or two pins), from `lab/gen.mjs 2026 pins`. Each is proven:
  with the pins exactly one valid grid at par, without them two. So the pin is the clue that decides the answer.
- **Live drag preview.** While you drag, once the line rests on a step for 0.3 s, the colours, rings and the
  "Regions / touching" line show the board as it would be if you let go there.
- **Two-step hint.** First press: the clue and the line, with the region tinted ("one slide of column 2 mends the
  region with a 5 in only 4 cells", or "… can only be mended in one slide by row 3" when no other slide would).
  Second press: the direction. Off track, it now says how many undos get back within reach ("Press Undo 2 times").

**QA:** playtest ALL CHECKS PASSED (17/17 levels by `solve()`) · `qa/interact.mjs` 44/44 (adds pinned act/drag/pad,
striped lines, two-step hint, preview waits for rest then matches the release, undo-count hint, hints solve all 17
levels at par) · `qa/screens.mjs` at 390×844, 360×640, 1280×800, 844×390 with no scrolling · 3 rounds · known
issues: none. Tooling note: `tools/` pins a Playwright whose headless shell isn't in this container; QA ran by
pointing that path at the preinstalled one (container only, nothing in the repo changed).

**Reviewer:** ship with fixes. "Dragging the right row halfway on level 1 and the whole board turns green before you
let go" was the best moment; pins read well. Fixed: (1) the hint named a line without telling it apart from others;
it now says what the slide mends and whether only that line can; (2) pinned lines are now striped, not found by
bumping into them; (3) the preview made scrubbing free, so colours now follow only after a 0.3 s rest;
(4) level 17 was a wall of red (14 touching, 3/9 regions), regenerated under the 6×6 limits (2 touching, 5/9);
(5) the hint gave up after 2–3 stray slides on 11–12; it now counts the undos back, with a time cap so it never
freezes past ~0.35 s. Also: live status line while dragging, wrap-around copy keeps its colour, picker marks pinned
levels with a small dot, brief says five levels. Not done: bigger hint text in the phone's empty space (nice to have).

**Cut:** a sixth pinned level (6×6, par 5): the generator found none that needed the pins within 400k tries.

**Assumptions:** a pin locks both its row and column (no separate locked-line rule); the hint is two-step, each press
counts; the preview waits 0.3 s on a step.

**Questions for Benji:** Is the 0.3 s preview delay right, or should the preview be instant (or gone)? · Night 3 is
the studio's last planned night here: daily board or 7×7 boards?

**Play:** https://claude.ai/artifact/7jkceHja8XRU1AYpyABWkS

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
