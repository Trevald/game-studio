# Math Crush — design hand-over (three prototypes)

This document is Benji's. Board idea: "Candy Crush but math based". Working title **Math Crush** until
Benji names it. The designer's full spec is **`design/handover-v1/docs/Studio-Handoff.md`** — read it all
before building. Screen gallery: `design/handover-v1/designs/index.html` (7 screens × 3 concepts, plus an
annotated gameplay sheet each); side-by-side: `design/handover-v1/designs/three-gameplay-screens.jpg`;
art direction: `design/handover-v1/reference/approved-art-direction.jpg`.

## What to build
**Three separate prototypes, so Benji can compare which core loop he wants.** Build them as three modes
of one game (one `index.html`): a home screen picks **Match**, **Equation** or **Clear**, each with its own
theme, levels, progress and screens. Rules per the spec:
- **Match** (candy theme): swipe orthogonal chains whose numbers add up to the target; addition only;
  board refills.
- **Equation** (jungle theme): six number tiles plus reusable + − ×, standard precedence (2+3×4 = 14),
  submit an equation that hits the target.
- **Clear** (ice theme): clear the board with pairs/triples that hit the target; no adjacency needed,
  no gravity, no refill; Undo; detect Stuck.

## Use as delivered
- **Levels:** `design/handover-v1/data/starter-levels.json` — 12 Match boards, 12 Equation levels (36
  rounds), 12 Clear boards, with solution witnesses. Load as is. `python3 design/handover-v1/data/validate.py`
  passes (19 Oct); the game's own solver must agree with the witnesses.
- **Art (runtime):** `games/math-crush/assets/` — `{match,equation,clear}-bg.webp` (backgrounds) and
  `{match,equation,clear}-atlas.webp` + `-atlas.json` (16 named sprite regions each: tile faces, plaques,
  buttons, stars, modal…). These are WebP conversions of the designer's PNG masters (same pixel size and
  coordinates; masters were 14 MB, these are 1.8 MB). Draw sprites from the atlas using the JSON regions
  (canvas `drawImage` or CSS `background-position`). **Numbers and labels stay live text**, never baked
  into images. Reference assets with relative URLs and publish them alongside the page (NIGHT_SHIFT.md
  step 7) — never inline as base64.
- The spec's "Build acceptance" section is the QA checklist for this game, on top of the studio's own.

## Studio decisions
- No haptics API in the web build beyond `navigator.vibrate` where it exists (toggle still shown).
- Progress in `localStorage` (try/catch). The spec forbids ads, purchases, lives, accounts, daily — keep it so.
- `window.__qa` must cover the active mode; `solve()` uses the level witnesses.
- Phone-first portrait, keyboard + touch, 44 px targets, instant restart.

## Suggested phasing
1. Shared shell (home with the 3 modes, level grid, pause, success/failure) + **all three core loops
   playable** with their first 4 levels each, in their themes. Benji compares the loops from this build.
2. All 12 levels per mode, tutorials, hints, save/continue, settings.
3. Polish and the spec's recovery and visual checks.
