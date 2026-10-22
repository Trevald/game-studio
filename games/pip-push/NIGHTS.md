# Pip Push — night log

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
