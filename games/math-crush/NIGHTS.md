# Math Crush — night log

## Night 3 — 2026-10-25

**Job:** approved hand-over not yet built — `design-studio/games/math-crush/handovers/H-002-v1` ("play first, sweet rewards"),
phases A, B and C. No pending board notes; packet checksums verified.

**Shipped:**
- No more intro screens: Play, the trail, Next and Retry open the board. On-board cues teach L1, L2, L4, L7, the L6 hammer
  (after 8 s idle) and L8 Sugar Rush, once each. L1–3 wrong sums are free.
- New schema-2 levels with explicit star thresholds and a live score meter (hollow completion star until the win).
- Special combos (stripe+stripe, stripe+wrapped, wrapped+wrapped) with exact previews; a one-use hammer on L6–12.
- Sugar Rush on L8–12 (3 charges → next three chains ×2) and a six-sticker book with a Home badge.
- New results (Next / Play again / Try speed challenge), a separate timed speed challenge with best times, `matchV3`
  saves; old saves kept and an old attempt offered as "Start this level".

**QA:** playtest all checks passed · engine tests 95/95 · real-engine ★★★ route on all 12 levels · 34 states × 4 sizes
screenshot audit clean · 3 rounds. Known issues: none open in code; balance questions below.

**Reviewer:** ship with fixes — the idea's core (mental addition chains) holds and combos during Sugar Rush are the best
moment, but there's no tension and the hammer has no job. Fixed: tap-mode Submit pushed off-screen on phones (now
Clear/Submit replace the toolbar while selecting), Hint pointing at the weakest chain, sticker toast following into the
next attempt. Not fixed (designer, in FB-003): two spare moves everywhere, three targets only, hammer purpose, Perfect
Batch automatic on L1–5, same colour for different values.

**Assumptions:** Play opens the highest unlocked level; L1/L2 lessons complete on any clear, L4/L7 on activating a special;
book opens as a dialog; Hint now prefers special/3+ chains.

**Questions for Benji:** see the board report.

**Play:** https://claude.ai/artifact/D5kYHgsZbouMh73g1VMLTj

## Daytime change — 2026-10-22 (Benji: "focus on only the first concept Candy Match and remove the other two")

Removed Equation and Clear: their engines, renderers, levels, the scaled-stage UI they used, the "All modes"
picker and their runtime art (`assets/{equation,clear}-*`). The game boots straight into the Candy Match home.
Save key unchanged; Equation/Clear progress in old saves is left in storage, untouched (engine test 17b).
`__qa.levels()` is now 12. index.html 160 KB → 108 KB. Checks: playtest all pass (12/12 levels solved),
engine tests 54/54, `qa/screens.mjs phone` no layout problems. Designer told in FB-002.

## Night 2 follow-up — 2026-10-22 (Benji: "looks nothing like the design updates")

The night-2 build followed HANDOVER.md/SCREENS.md text but the studio never opened the packet's reference images
(`references/menus.jpg`, `references/gameplay-states.jpg`). Reworked every Match view against them: logo home with
"A little maths. A lot of sweet." and 2 + 3 + 5 tiles, Candy trail drawn on the scenery (blue done nodes with stars,
raspberry current, stone locked), compact Level card (Target box, Make N chains / Moves, Example, Let's play / Back),
"Take a moment" pause with Restart|Levels and icon setting rows, "Sweet success!" with atlas stars and score box,
"One more try?" with candy tiles, gameplay HUD + chains bar with hollow stars, pill sum card with ×N chip, status
line, Hint/Undo pills, row-bonus popup. Kept the spec's corrections to the images (cream pause button, hollow stars
in play, 1→12 order, Undo on Retry, no ambiguous X on Retry). Engine unchanged: playtest all pass, engine tests 53/53.
Lesson for the runbook: look at every image in a hand-over before building.

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
