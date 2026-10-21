# Math Crush — night log

## Night 2 — 2026-10-21

**Job:** Benji's board note `math-crush-h001`: build the approved hand-over
`design-studio/games/math-crush/handovers/H-001-v1` (Candy Match refinement), Phase A, then B, then C.

**Shipped (Match only; Equation/Clear unchanged):**
- New candy shell in cream/plum/raspberry with live text: Home with Continue, Candy trail 1→12, level Intro with
  star thresholds and coach cards (multiplier, striped, wrapped), Pause/Settings, Success with Chain / Blast / Moves /
  Speed rows and an Assisted chip, Retry ("One more try?" with Undo last move), Confirm, Help, Loading/art-failure,
  save-error and restore-error states. Flowing phone-width layout instead of the scaled stage.
- Chain multipliers (×1.5 / ×2 / ×3), striped and wrapped candies with deterministic closure, blast bonus, reward
  placement + gravity; score-based stars (200×/300× quota); unlimited Undo; saved active attempt + Continue;
  candy-v2 scores beside the untouched legacy v1 bests; optional speed bonus (off by default).
- Tap-to-select mode with Submit; keyboard play focuses the board.

**QA:** playtest 18/18 passed (36/36 levels solved) · 4 rounds · engine tests 53/53 (`qa/engine-tests.mjs`, all 7
designer fixtures) · screenshots for 4 sizes in `qa/screens/`. Fixed during QA: hub `.card` class colliding with
the intro card, trace line crossing digits, tap-mode footer, rem-based text for the 150 % check.
**Known issue:** level 2 can't reach three stars (best possible 687 < 900); reported in FB-001, data unchanged.

**Reviewer:** ship with fixes — the long chain into a wrapped candy is the best moment; levels 1–3 lack tension.
Fixed: keyboard Space/Enter pressing the focused Pause button (board now takes focus), refill candies drawn over the
HUD (board clipped), points popup covering the blast (moved below the board), "would score" shown for over-target
chains, "1 moves" plural, stale win announcement, hub card text overlap, blast preview now a soft glow.
Not fixed (designer): Hint points to the shortest chain; levels 1–3 tension / in-play star ticks; level 2 threshold.

**Assumptions:** flowing layout for Match; tap-to-select as a Settings switch; legacy bests shown on the intro only.

**Report:** `design-studio/games/math-crush/feedback/FB-001-candy-refinement.md`.

**Play:** https://claude.ai/artifact/D5kYHgsZbouMh73g1VMLTj

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
