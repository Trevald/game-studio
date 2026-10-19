# Ricochet — design hand-over (v2)

Working title **Ricochet** (was Tiltstones). The folder and slug stay `tiltstones` so links and history keep working.

This document is Benji's. It overrides BRIEF.md wherever they disagree. The designer's own notes are
in `design/HANDOFF-README.md` (start there) and `design/levels/LEVEL-DESIGNS.md`.

Visual references (AI-generated, illustrative — never a spec for rules or tile coordinates):
- **Gameplay look:** [`design/concept/approved-gameplay-direction.png`](design/concept/approved-gameplay-direction.png)
  is Benji's preferred direction for the playing screen: luminous ball, sculpted jewel blocks, glass
  paint pots, mossy ruin frame, polished blue HUD. This wins over the older mockup for gameplay.
- **Other screens:** [`design/concept/original-visual-concept.png`](design/concept/original-visual-concept.png)
  for start, gear, win and lose screens. Its text has typos.
Recreate the look in code (canvas/CSS/SVG); don't embed or trace these images.

**Rule precedence:** levels.json and the rules in this file beat anything an image seems to show.
Block symbols are identifiers only: blocks match on **colour**, not shape.

## Decided

**Name and core rules**
- The game is called **Ricochet** on every screen and in `<title>`.
- The core movement stays exactly as now: the ball bounces vertically by itself and the player only
  steers left/right. The curved dotted lines in the mockup only illustrate movement; they are not a
  new physics model and not an aiming line.
- Colour rules stay: a block breaks only when the ball has its colour; diamonds break once all colour
  is gone; skulls cost a life and reset the ball to blue; keys open locks.
- **Paint pots (confirmed):** the ball dips in, takes the pot's colour and **bounces back out — never
  passes through**. Pots stay and can be reused. No pot restores blue; only losing a life does.
  Show the dip and the rebound in the animation. (The current engine already treats pots as solid and
  reusable — keep that.)
- **Grey blocks (new tile `g`):** break with any ball colour and do **not** count toward clearing:
  diamonds unlock and the level is won with grey blocks still standing.
- Keys and diamonds also bounce the ball when collected. The bottom edge bounces; there are no pits.
- The ball starts blue, moving upward.

**Look (from the mockup)**
- Dark, deep-blue/indigo world with bevelled, glossy tiles and soft glows. A single dark look is fine
  (no light theme needed).
- Each colour has a fixed suit symbol, used on both blocks and the ball (panel 9):
  blue ◆, red ♥, green ♣, yellow ♠. The ball shows its current colour and symbol.
- Other tiles: wall (indestructible, dark), diamond (collect), paint pot, key, lock, skull. The
  mockup's grey "breakable" block is a new tile: breaks with any ball colour. Use it sparingly.
- Gold primary buttons, outlined secondary buttons, rounded panels (see panels 1, 4, 5, 6).

**Levels**
- **World 1 (Meadow Ruins) is designed:** `design/levels/levels.json` is authoritative — 8 levels, 10×14
  grids, with name, hint, teaching goal, solution, safe/fast route and provisional par for each. Load the
  grids exactly as given (same legend as the engine plus `g`). Replace the old 8 levels with these.
  `design/levels/screenshots/` are schematic renders of the grids, not the final art.
- Pre-check (19 Oct, scratch copy of the current engine with `g` added): the solver cleared all 8 in
  6.0–29.2 s of game time. Re-run after the rebuild; if any level stops being solvable, report it with
  the level id and where the solver got stuck. **Don't redesign a designer level** — small fixes (move one
  tile) only if unavoidable, and list them in the report.
- Pars: designer estimates (25–65 s). Show them as the level's target; flag in the report any par that
  looks far off once you can measure.
- Worlds 2–4 aren't designed yet. Don't invent them; the world map shows them as coming later.
- Level ids like `1-4` and the world name show in the HUD.
- Restart, life count and what persists after a death aren't in the designer's notes: keep the current
  behaviour (3 lives, instant restart).

**Timing**
- Every level is timed with a running clock (mm:ss.hh) and the personal best (PB) under it.
- No time limit; you can't lose to the clock.

**Score and combo** (shown in the mockup; Benji wants both time and score)
- Score is shown in the HUD and on the win screen.
- Combo: breaking blocks of the same colour in quick succession raises a multiplier
  (x2, x3 … x5, panel 8), shown in the HUD with a big effect.

**Gear**
- 3 equip slots, shown in the HUD (panel 7). Slots start locked and unlock as you progress
  (the mockup shows 1 slot open, 2 locked).
- Gear is found by playing, never bought (RULES.md). "Found Gear" shows on the win screen (panel 5).
- Gear screen with tabs (All / Movement / Scoring / Utility), a grid of items with locked ones
  greyed out, and a detail pane with stats and Equip (panel 6).
- **Magnet** is fully specified: nudges the ball slightly toward the nearest breakable block.
  Strength 10%, range 2 cells, only toward blocks the current ball can break.

**Screens** (mockup panels)
1. Start: title, Play, and Worlds / Gear / Records.
2. HUD: level id + world name, hearts, clock + PB, pause, gear slots, combo + score.
3. Out of lives: Try Again, Back to World.
4. Level complete: stars, time / score / max combo each with a "New Best!" badge, found gear,
   Next Level, Replay, World Map.
5. Gear selection (above).
6. First level: tutorial callouts ("Move left and right…", "Hit matching colour…").

## Art assets (designer hand-off v1 — final artwork, use as delivered)

Runtime files live in `games/tiltstones/assets/`. The designer's notes, manifest, prompts and contact
sheet are in `design/handoff-v1/` — read `design/handoff-v1/IMPLEMENTATION.md` and look at
`contact-sheet.jpg` before touching visuals. These replace any code-drawn version of the same thing.

| Asset | File | Use |
|---|---|---|
| Start background | `assets/backgrounds/start@2x.webp` | Start screen only, never behind gameplay |
| World backgrounds | `assets/backgrounds/{meadow-ruins,crystal-caverns,brass-factory,sky-gardens}@2x.webp` | Behind the board, one per world |
| Logo | `assets/brand/ricochet-logo.svg` | Start screen title (alt "Ricochet"), 240–400 px wide |
| Gear icons | `assets/icons/<gear-id>.svg` | Gear screen, HUD slots, "Found Gear" |

**Worlds** (order as the designer listed them): 1 Meadow Ruins · 2 Crystal Caverns · 3 Brass Factory · 4 Sky Gardens.

**Gear roster** (names fixed by the icons; rules still open, see below): Magnet, Feather Feet,
Colour Sight, Time Warp, Shield, Extra Life, Chain Extender, Prism, Blue Return, Ghost Line.

**How to use them (designer's rules, condensed)**
- Page base colour `#080f20`. Backgrounds: `background-size: cover; background-position: center`, full
  opacity, never stretched. World detail sits at the edges; keep the board in the centre.
- If blocks or effects lose contrast, add a separate `rgba(4,10,24,.25)` scrim between art and board.
  Never dim the blocks, ball or gear along with the background.
- Icons: show at 32–64 px (never under 24), always next to a visible name; hit areas at least 44×44 px.
  Locked/disabled state is styled on the button, never by editing the SVG.
- Tiles, ball, effects and UI chrome stay code-drawn, matched to this art and to the two concept images.

**How to load them (studio rule, overrides the designer's base64 advice)**
- Reference assets as **separate files with relative URLs** (`<img src="assets/icons/magnet.svg">`,
  `url('assets/backgrounds/…')`). Do **not** inline them as base64 in `index.html`: that would add ~1.1 MB
  of text to the file the studio has to read and edit every night.
- When publishing, pass every file under `assets/` to the Artifact tool's `files` map at the same
  relative path (see NIGHT_SHIFT.md step 7). QA loads them from disk the same way.
- Preload the current world's background before the level starts so it never pops in.

## Level Lab (night of 19–20 Oct) — explore level-design directions

Benji isn't happy with the World 1 levels and wants to try **different level-design directions** before
any more levels are built. For this job only, the "don't redesign a designer level" rule is lifted:
the studio designs its own levels.

**What to build**
- A **Level Lab**: 8–12 levels, each one a *different direction*, not a progression. Reach it from the
  start screen ("Level Lab"). Keep the designer's World 1 playable as it is, so Benji can compare.
- Each lab level shows its **direction name and a one-line idea** on a card before play
  (e.g. "Rattle pockets: tight 2-row pockets the ball bounces inside"), and has its own clock/PB.
- Use **only existing mechanics** (colour blocks, grey, paint pots, diamonds, skulls, walls, key/lock).
  New tile ideas go in the report as proposals, not in the build.
- Directions to choose from (pick 8+, swap in better ones): dense rattle pockets · vertical corridors/
  shafts · maze of walls with few targets · open field built for speed routes · grey scaffolding you
  carve through · colour "onion" (layers that force order) · key-and-gate chambers · skull gauntlet
  with safe detours · mirror/symmetric · one-screen puzzle where the order is the whole challenge ·
  closer homage to the original *Diamonds* layouts.

**Play it, measure it, improve it**
- Play every lab level for real, not just with `solve()`: drive Playwright with keyboard/pointer input
  at 1×, both a careful run and a fast run, and look at the screenshots.
- Measure per level: solver time, your human-style clear time, deaths, **dead time** (seconds with
  no block hit), bounces between hits, and how much faster the fast route is than the safe one.
- Iterate: change each level at least once based on what you measured and saw; keep a short
  changelog per level (v1 → v2: what changed and why).
- The reviewer agent plays the lab cold and ranks the directions.

**Report** (in NIGHTS.md and the board summary): a table of directions with the metrics, the studio's
top 3 and why, and what to try next. Ask Benji which 1–2 directions to take forward.

## Open (don't decide these; build so they're easy to change)

- **How time and score relate, and what stars mean.** Benji will decide. Until then: track and show
  both with separate bests; draw the 3-star row on the win screen but award stars by a single
  placeholder function (`starsFor(time, score)`) that's easy to replace, and say in the report what
  placeholder rule you used.
- **Gear other than Magnet.** The roster above has names and icons but no rules. Propose effects and numbers in the brief and mark
  them provisional. Note: anything that changes the clock (Time Warp) interacts with PBs; flag it
  rather than resolving it.
- **How gear and slots are earned** (which levels award which item, when slots unlock). Propose,
  mark provisional.
- **World map, pause, records and settings screens.** Not in the mockup; match its style.
- **Tilt.** Not shown in the mockup; keep tilt steering plus the on-screen ◀ ▶ buttons.

## Constraints that still apply
- Every level must be solvable with no gear equipped; `solve()` must clear every level with an empty loadout.
- Instant restart, phone-first portrait. One HTML file for code; art loads from `assets/` (see above).

## Suggested phasing
1. Rename + new look: logo + start background, Meadow Ruins background behind the board, jewel tiles
   with suit symbols, grey blocks, pot dip-and-rebound, HUD with clock/PB, win and lose screens —
   **with World 1's 8 designer levels** replacing the old ones.
2. World structure: world map, level select, PBs per level, pars shown.
3. Gear: Magnet + 2 provisional items, gear screen, 1 slot unlocking to 3.
4. Score/combo/stars once Benji has decided how they matter.
