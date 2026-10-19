# Ricochet — design hand-over (v2)

Working title **Ricochet** (was Tiltstones). The folder and slug stay `tiltstones` so links and history keep working.

This document is Benji's. It overrides BRIEF.md wherever they disagree. The visual reference is
[`design/mockup-v2.png`](design/mockup-v2.png), an AI-generated mockup: use it for look, layout and
screen inventory, not as a spec. Its text has typos, and its tile art is raster. Recreate the look in
code (canvas/CSS/SVG); don't try to embed or trace the image.

## Decided

**Name and core rules**
- The game is called **Ricochet** on every screen and in `<title>`.
- The core movement stays exactly as now: the ball bounces vertically by itself and the player only
  steers left/right. The curved dotted lines in the mockup only illustrate movement; they are not a
  new physics model and not an aiming line.
- Colour rules stay: a block breaks only when the ball has its colour; paint pots recolour the ball;
  diamonds break once all colour is gone; skulls cost a life; keys open locks.

**Look (from the mockup)**
- Dark, deep-blue/indigo world with bevelled, glossy tiles and soft glows. A single dark look is fine
  (no light theme needed).
- Each colour has a fixed suit symbol, used on both blocks and the ball (panel 9):
  blue ◆, red ♥, green ♣, yellow ♠. The ball shows its current colour and symbol.
- Other tiles: wall (indestructible, dark), diamond (collect), paint pot, key, lock, skull. The
  mockup's grey "breakable" block is a new tile: breaks with any ball colour. Use it sparingly.
- Gold primary buttons, outlined secondary buttons, rounded panels (see panels 1, 4, 5, 6).

**Levels**
- Diamonds-style layouts, not Breakout: blocks spread through the whole field so the ball bounces off
  blocks mid-air most of the time; pockets, corridors and shelves; little dead travel time.
  Panels 2–4 show the density to aim for.
- Levels are grouped into named worlds with level ids like `2-4` and a world name in the HUD
  ("Crystal Caverns", "Brass Factory").

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

## Open (don't decide these; build so they're easy to change)

- **How time and score relate, and what stars mean.** Benji will decide. Until then: track and show
  both with separate bests; draw the 3-star row on the win screen but award stars by a single
  placeholder function (`starsFor(time, score)`) that's easy to replace, and say in the report what
  placeholder rule you used.
- **Gear other than Magnet.** The mockup names Feather Feet, Colour Sight, Time Warp, Shield,
  Extra Life, Chain Extender and Prism without rules. Propose effects and numbers in the brief and mark
  them provisional. Note: anything that changes the clock (Time Warp) interacts with PBs; flag it
  rather than resolving it.
- **How gear and slots are earned** (which levels award which item, when slots unlock). Propose,
  mark provisional.
- **World map, pause, records and settings screens.** Not in the mockup; match its style.
- **Tilt.** Not shown in the mockup; keep tilt steering plus the on-screen ◀ ▶ buttons.

## Constraints that still apply
- Every level must be solvable with no gear equipped; `solve()` must clear every level with an empty loadout.
- Instant restart, phone-first portrait, single self-contained HTML file.

## Suggested phasing
1. Rename + new look (tiles, symbols, HUD with clock/PB, win and lose screens) on the existing levels.
2. Worlds + new Diamonds-style levels (first world of 8).
3. Gear: Magnet + 2 provisional items, gear screen, 1 slot unlocking to 3.
4. Score/combo/stars once Benji has decided how they matter.
