# Pip Push — night log

## Night 2 — 2026-10-23

**Job:** the studio's own game, continued (night 2 of max 3). Benji's queue was empty: no `building` idea, no pending
notes, no queued ideas, and every approved hand-over already has its completion report. Input was the night-1
review's leftovers and the brief's "Later" list.

**Shipped:**
- **Hint** button (lightbulb, or H): shows the next push from where you are now: a ring where to stand, an arrow
  for the push, which number comes up, and how many pushes the best finish takes. Searches in a Web Worker so the
  page never freezes; along the stored solution it's instant.
- **Dead ends are announced**: after a push that makes the level unfinishable, the tip says so with an
  "Undo N moves" button that goes back to just before that push.
- **Par is the true minimum pushes**, proven by a new push-level solver (`lab/push.mjs`); `solve()` lands on par.
  (Night 1's par turned out to be the minimum already on all 10 levels.)
- **Levels 11–15** (now 15): four three-dice rooms and one two-dice room (par 10–20), from `lab/gen3.mjs`
  (rejects repeated push loops; faces raise the minimum pushes 2.5–4x over "any number").
- Win card says "No hints used" or how many; keyboard hint line hidden on touch screens; level name wraps.

**QA:** 17/17 playtest checks passed (15/15 levels solved by `solve()`) · 3 rounds · plus `qa/hints.mjs` (hints alone
win every level in exactly par, also from random positions: 38/38), `qa/dead.mjs` (dead-end notice, Undo-N, instant
and worker hints through real clicks: 5/5), `qa/interact.mjs` 7/7, `qa/screens.mjs` (390×844, 360×640 dark,
1280×800: no overflow, no errors). The dead-end check only claims "can't be finished" after a full search, so it never
cries wolf; in big positions where it gives up (15 000 states) it stays quiet. Known issues: none. Note: the local
Playwright needed a browsers-path shim (scratchpad) because its pinned headless shell differs from the preinstalled one.

**Reviewer:** ship with fixes — par and hints verified with its own solver; faces really are the puzzle. Fixed:
hint froze the page on phones (now a worker + stored-plan reuse), silent dead ends (now announced), stuck hint didn't
say how far back (Undo-N button), arrow hid a side number and ring blended with goal outlines, plus nice-to-haves
("n comes up", one hint per position, "no hints used", keys line hidden on touch). Not fixed: the phone board could
use more of the empty space below the controls (layout tweak, Later).

**Assumptions:** more levels + hints are the least committal next step while night 1's questions are unanswered;
hints show only the next push; dead-end notices are on for everyone (no setting).

**Questions for Benji:**
1. Keep going with Pip Push (one studio night left)? If yes: a daily generated room, or new tiles (ice, "any odd" goals)?
2. Are the dead-end notices welcome, or do they spoil the puzzle? (Easy to make them a setting.)

**Play:** https://claude.ai/artifact/VVo5tuwzGmbM7Qbq8sTsVQ

## Night 1 — 2026-10-22

**Job:** new game (studio pitch). Benji's queue was empty: no queued ideas, every approved hand-over already has its
completion report (Math Crush FB-001/002, Mathly FB-001, Ricochet FB-001). The only `pending` board note,
`ricochet-h001`, asks for the N1–N3 exploration that the 21 Oct 03:50 shift already built and reported in
`design-studio/games/ricochet/feedback/FB-001`, so it was marked used instead of being rebuilt.
Pitch picked from three (runners-up: "Shift Suguru", "Wall-less Suguru"): a pure logic puzzle, no timer, fits a night.

**Shipped:**
- Sokoban with real dice: each push tips the die (the side you push against comes up), goals ask for a number on top.
  Dice show their four side faces as small digits so moves can be planned.
- 10 levels from a seeded generator + BFS solver (`lab/`), each stored with its shortest solution; par = its pushes.
- Phone: tap a free square to walk there (never pushes, one Undo step), swipe or tap next to a die to push, pad with
  hold-to-repeat. Desktop: arrows/WASD, Z undo, R restart, N next.
- Unlimited Undo, instant Restart (undoable), level picker with best pushes, help with a "hide side faces" option,
  sound with mute, light/dark, reduced motion.

**QA:** 17/17 playtest checks passed (10/10 levels solved by `solve()`) · 3 rounds · plus `qa/interact.mjs`
(tap-to-walk, die taps, win-card delay, next level: 7/7) and `qa/screens.mjs` (390×844, 360×640 dark, 1280×800:
no overflow, no errors) · known issues: none.

**Reviewer:** ship with fixes — the face rule really is the puzzle (level 2's "aha"; BFS shows faces raise the
minimum pushes 2–4× on most levels), but later levels were repeated 4-push loops and phone play was one swipe per
square. Fixed: tap-to-walk; levels 4–10 re-picked with a generator that rejects repeated push loops, plus an easier
step (Turnaround, 4 pushes) with a tip before the jump; win card waits 0.7 s so you see the die land; goals show
digits like the side faces; confetti cleared on level change; Undo stops a pad hold. Not fixed: par as the true
minimum pushes (it equals the shortest-steps solution's pushes on all 10 levels), a "next push" hint button (Later).

**Assumptions:** Sokoban rules (push only, one die at a time); side faces shown by default; par shown, never required.

**Questions for Benji:**
1. Keep going with Pip Push? If yes: more levels and a daily generated room, or new tiles (ice, "any odd" goals)?
2. Is the side-face display (small digits around each die) readable on your phone, or would you rather plan blind?

**Play:** https://claude.ai/artifact/VVo5tuwzGmbM7Qbq8sTsVQ
