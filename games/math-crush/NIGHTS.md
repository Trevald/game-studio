# Math Crush — night log

## Night 1 — 2026-10-20

**Job:** new game (first queued idea, order 3: "Candy Crush but math based"), built from the designer's
hand-over v1 per `DESIGN.md` (Math Crush isn't registered in `design-studio/` yet, so DESIGN.md is in force).

**Shipped:**
- Mode picker → three prototypes, each with its own theme from the designer's art: **Match** (Candy Forest),
  **Equation** (Jungle Temple), **Clear** (Crystal Cavern). Per mode: Home, level grid with unlocks and best stars,
  gameplay HUD at the spec's coordinates, Pause (Resume / Restart / Levels with confirmation, Sound, Haptics, Help),
  Success, Out of moves / Out of attempts, and Clear's Stuck (Undo / Restart / Levels).
- All 36 authored levels loaded as delivered. Rules and scoring implemented as specified: Match drag chains with
  backtracking, central-80% hit areas, 8-tile cap, seeded refill with solvability check and "Board refreshed"
  replacement; Equation token parser with × precedence, three rounds, three attempts; Clear exact-cover solver,
  holes, unlimited Undo, Stuck. Hints in all three modes (cap stars as specified).
- Keyboard play for all modes; WebAudio tones, `navigator.vibrate` haptics, candy pop + gravity drop, ice shards,
  confetti; reduced-motion respected. Progress in localStorage.
- `__qa.validate()` checks the game's evaluator/solvers against every designer witness: all pass.

**QA:** 18/18 checks passed (36/36 levels solved by `solve()`) · 3 rounds · fixed: Google Fonts blocked in the
sandbox (now system rounded font), decorative SVG blocking clicks on the level grid, coach text covering controls.
Known issues: none from the harness.

**Reviewer:** ship with fixes — solid and good-looking; Clear 5–12 is the strongest loop; Match has no tension and
the starter levels repeat. Fixed: Equation no longer shows the result before Submit ("= ?" until you submit),
modal heading focus outline, Equation result heading clipping the frame, "Attempts" label overflow, scrim now dims
the whole window on desktop. Not fixed (designer decisions, filed in `design/REQUESTS.md`): R1 Match tension /
free cancel / Clear early dead-end warning, R2 repeating and flat level data, R3 a fourth prototype with operators
on a board. Hollow stars under the target stay hollow during play (spec).

**Assumptions:** mode picker in front of the spec's per-mode Home; Restart confirms only when the attempt has
progress; tutorial is a coach line on level 1 + Help, not the guided demo; Continue (saving an active attempt) is
for a later night; equation shows "= ?" instead of a live result (spec text over the mockup).

**Questions for Benji:** see the report.

**Play:** https://claude.ai/artifact/D5kYHgsZbouMh73g1VMLTj
