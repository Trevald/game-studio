# Tiltstones — night log

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
