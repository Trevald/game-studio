# Ricochet (tiltstones) — night log

## Night 2 — 2026-10-19

**Job:** iteration on notes: "Design hand-off is complete … Tonight: phase 1 — rename to Ricochet, the new look, grey blocks and the pot dip-and-rebound, and World 1's 8 designer levels" (ricochet-design-v2)

**Shipped:**
- Renamed to **Ricochet** everywhere. New title screen with the designer's logo and start background, Play, Worlds (World 1 level list with PB/par; worlds 2-4 shown as "coming later"), Gear and Records shown as locked "Soon".
- New look: Meadow Ruins background behind a stone-and-moss board frame, code-drawn glossy jewel blocks with suit symbols (blue ◆, red ♥, green ♣, gold ♠) on blocks and ball, glowing ball with trail, glass paint pots, crystal diamonds, mossy walls, gold key/lock, skulls. Single dark look, gold primary and outlined secondary buttons.
- Grey blocks (`g`): break with any colour, never count toward clearing (1-2 and 1-7 can be won with grey still standing).
- Paint pots: the ball dips into the jar (0.13 s, deterministic), takes its colour with a splash, and bounces back out. Pots stay and are reusable.
- World 1's 8 designer levels loaded exactly from levels.json (no tile changed). HUD: level id + world, hearts, running clock mm:ss.hh + PB, score + combo (x2…x5), restart, pause. Win screen (stars, time/score/max combo with New Best badges, Next/Replay/World Map), Out of lives (Try Again/Back to World), Pause panel, tutorial callouts on 1-1.
- When the ball can't turn blue again and the level has no skull, a board panel offers "Restart level".

**QA:** 17/17 checks passed · 3 rounds · all 8 levels completable by `solve()` with no gear · autopilot clear times: 1-1 6.8 s, 1-2 7.7 s, 1-3 5.4 s, 1-4 15.4 s, 1-5 27.2 s, 1-6 7.7 s, 1-7 9.5 s, 1-8 30.2 s (all well under the designer pars of 25–65 s). Known issues: tilt still blocked inside the claude.ai viewer (◀ ▶ work); combo/score/star rules are placeholders.

**Reviewer:** ship with fixes — the steer-only core and colour ordering work, 1-8 is the best level; 1-1/1-2 nearly play themselves and 1-3 is easy to soft-lock. Fixed: on-board stuck panel with Restart, combo text overlap (newest only), callouts moved off the 1-1 diamond/ball path, HUD spacing + score label, stone/moss board frame, duplicate "World Map" on the last win panel, New Best on first clear, dip splash. Not fixed (designer's call, filed in design/REQUESTS.md): pars far too generous (R2); key in 1-7/1-8 sits straight above the start and the lock is optional (R1). Not done: clock starting on first input (DESIGN.md asks for a running clock).

**Assumptions:** clock runs in game time from level start, across lost lives; combo = same colour within 1.5 s, x2–x5, reset by paint (provisional); scores 100 × combo per block, grey 50, diamond 500, key/lock 200; `starsFor`: 3 at/under par, 2 within 1.5× par, else 1; restart and 3 lives kept as before.

**Questions for Benji:** 1) How should time, score and stars relate? With the current pars every clear is 3 stars (R2 has measured times). 2) Should the key/lock in 1-7/1-8 be required (R1 asks the designer)? 3) Next shift: phase 2 (world map, per-level records) or straight to gear?

**Play:** https://claude.ai/artifact/VAXzjHmZLmMTJS5zQsRJH4

## Night 1 — 2026-10-18

**Job:** new game — "A mobile version of the 1990 Mac game Diamonds" (gyro steering)

**Shipped:**
- Diamonds-style core: ball bounces vertically on its own, you steer only left/right. Colour blocks (break only when the ball matches), paint pots, diamonds (breakable once all colour is gone), skulls, walls, key + lock.
- Tilt steering from the phone's gyro (gamma axis, 3° deadzone, full speed at 22°), zeroed to how you hold the phone when a level starts, with a live tilt meter in the HUD. Hold ◀ ▶ buttons, tapping either half of the board, and ←/→ / A/D as alternatives.
- 8 hand-made levels teaching one rule at a time (base colour → paint → "blue first" ordering → wall gap → skulls → key/lock → mixed → finale). Instant restart (↻ / R), 3 lives per attempt, progress and mute remembered.
- Juice: block pops with rising-pitch combo blips, colour-change ring pulse + chord, diamond sparkle, flash on clear; reduced-motion respected. Each colour also has a glyph (● ▲ ■ +) for colour-blind readability.
- Warning line when the ball can no longer turn blue ("hit a skull or press ↻").

**QA:** 17/17 checks passed · 5 rounds · all 8 levels completable by the search autopilot in `solve()` · known issues: tilt does not work inside the claude.ai artifact viewer (its frame blocks motion sensors), so the published link falls back to ◀ ▶ buttons; tilt works when `index.html` is opened directly in a phone browser (iOS asks for motion permission on the Play tap).

**Reviewer:** ship with fixes — steering is the core of play and the colour rules read clearly; flagged dead travel time and bare tilt. Fixed: level 5 spawned under a skull (moved start + 0.5 s hover after respawn), tilt calibration + meter + stale "no tilt" message, ↻/R on the title skipping the tilt/audio request, silent dead-end when painted too early (now a warning), slow travel (vertical speed 7.5→9 cells/s, gentle snap to column centre when not steering, level 7 diamond moved out of a skull column). Not fixed: real ordering puzzles beyond "blue first", sensitivity/invert settings, landscape (scoped to Later).

**Assumptions:** no time bonus/timer (RULES.md); 3 lives per level and losing them only restarts that level; original name and levels not reused (working title Tiltstones); undo replaced by instant restart since it's real-time.

**Questions for Benji:** 1) Tilt can't reach the game inside the Claude artifact viewer — want it hosted somewhere you can open directly on your phone (e.g. GitHub Pages for this repo), or are on-screen buttons fine there? 2) Should the next night deepen the puzzle side (one-shot paint pots, colour ordering that matters) or add more levels/block types from the original? 3) Is ball speed right, or should it bounce faster still?

**Play:** https://claude.ai/artifact/VAXzjHmZLmMTJS5zQsRJH4
