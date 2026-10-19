---
title: Ricochet (was Tiltstones)
slug: tiltstones
idea_id: szh7gjlgrh5ebj6oudix
artifact: https://claude.ai/artifact/VAXzjHmZLmMTJS5zQsRJH4
---

# Ricochet (was Tiltstones)

> Design v2 hand-over: see DESIGN.md, which overrides this brief.

## The idea
> A mobile version of the 1990 Mac game Diamonds — Instead of using arrow keys to control the ball we can use the gyro of a mobile phone.

A Diamonds-style brick puzzle where the ball bounces up and down by itself and you steer it sideways by tilting your phone (arrow keys / touch buttons as fallback).

## References
- 1990 Mac game *Diamonds* (named, not linked; looked up via Wikipedia "Diamonds (video game)") — the ball bounces vertically on its own, the player only controls horizontal motion. Coloured blocks only break when the ball has the same colour; brush blocks repaint the ball; diamonds can only be broken once every coloured block is gone; skulls cost a life. The ball starts each level/life in its base colour and nothing paints it back, so base-colour blocks must be cleared first (or you lose a life on purpose). Keys/locks and solid blocks also exist in the original; the page didn't detail them.
- *Diamonds PD* (Playdate remake, itch.io page) — confirms the control scheme (left/right only, crank as analog input) and that a 1-axis analog input fits the game. Page has no rules detail.

## Tonight (night 3) — Level Lab (from Benji's note "ricochet-level-lab" + DESIGN.md "Level Lab")
1. A **Level Lab** reachable from the start screen: 10 lab levels, each a different level-design
   direction (not a progression), every one open from the start. World 1 stays exactly as it is.
2. Most directions are variations of Benji's direction: **dense, corridor-based, little open space,
   a better balance of breakable vs unbreakable than the density reference**. One contrasting direction
   (open field / speed routes) for comparison. One lab level tests a **narrow 8-column grid**.
3. Each lab level opens on a **direction card** (name, one-line idea, block ratio, PB) before play,
   and has its own clock/PB. Only existing tiles (colour, grey, pots, diamonds, skulls, walls, key/lock).
4. **Play, measure, improve:** per level — solver time, a 1× keyboard run by a human-paced bot,
   deaths, dead time (s with no block hit), longest travel without contact, ratio
   (coloured : grey : wall : empty), contacts per hit, safe vs fast. Change every level at least once
   from the measurements; keep a v1 → v2 changelog (`lab/CHANGELOG.md`).
5. Report: direction table with metrics, the studio's top 3, what to try next; ask Benji which 1–2 to take forward.

### Lab design (night 3)
- **Corridor idiom:** bands of blocks alternating with 1–2-row channels. The ball bounces vertically
  by itself, so in a 1-row channel it rattles against the band above and below on every bounce (0.05–0.15 s
  between contacts); steering slides it along the channel. Walls and grey shape the corridors so they
  survive after the coloured blocks are gone (otherwise a cleared band turns into open space).
- **Guarded pots:** a paint pot sits in a nook behind one blue "guard" block, so the order puzzle is
  "break the guard last". Blue-only directions skip paint entirely to isolate the spatial feel.
- **Engine change:** grid size is now per level (`W`/`H` read from the map) so the 8-column test is
  real; World 1 is untouched (10×14).
- **Measurement tool:** `lab/measure.mjs` runs the engine headless (solver = fast route) and
  `lab/play1x.mjs` drives Playwright with real key presses at 1× (careful route, 0.2 s decisions).
- `__qa`: `levels()` now covers World 1 + Lab (ids `L1`…); `reset(n)` skips the direction card; on the
  card `actions()` is `["start"]`. `state()` adds `set` (`"w1"` | `"lab"`) and screen `"card"`.

### Assumptions (night 3)
- The lab uses the Crystal Caverns background so it never looks like World 1 (no world 2 content is invented).
- Lab levels have no par and no stars (Benji hasn't decided what stars mean); they show time, score and PB.

## Tonight (night 2) — Ricochet phase 1 (from Benji's note "ricochet-design-v2" + DESIGN.md)
1. Rename to **Ricochet** everywhere (title, screens). Folder/slug stay `tiltstones`.
2. New look: designer logo + start background on the title screen, Meadow Ruins background behind the
   board (with the designer's scrim), code-drawn jewel tiles with suit symbols (blue ◆, red ♥, green ♣,
   gold ♠) on blocks and ball, glass paint pots, gold primary / outlined secondary buttons. Single dark look.
3. Grey blocks (`g`): break with any colour, never count toward clearing.
4. Paint pot dip-and-rebound: the ball dips into the pot (short, deterministic 0.13 s dip), takes its
   colour and bounces back out. Pots stay and are reusable.
5. World 1's 8 designer levels from `design/levels/levels.json`, loaded exactly, replacing the old 8.
6. HUD: level id + world name, hearts, running clock (mm:ss.hh) with PB, pause, score + combo.
   Win screen (stars via placeholder `starsFor`, time / score / max combo with New Best badges,
   Next / Replay / World Map) and Out-of-lives screen (Try Again / Back to World). Tutorial callouts on 1-1.

Not tonight (phases 2-4): world map beyond a simple World 1 level list, gear, slots, records screen.

### QA plan (night 2 additions)
- `state()` adds `id`, `dip`, `time`, `combo`, `maxCombo`, `left.grey`; screens: `title | worlds | playing | paused | won | lost`.
- Actions unchanged (`left | stay | right`, 0.1 s each); `start` from title/worlds, `resume` from pause. The dip is part of the fixed-step sim, so `solve()` replays exactly.

### Assumptions (night 2)
- Clock runs in game time (fixed sim steps), across lost lives, from level start to the last diamond;
  restart resets it. PB = best clear time per level.
- Combo (provisional, phase 4 is Benji's call): breaking a block of the same colour within 1.5 s of the
  previous break raises the multiplier up to x5; a different colour, a paint pot or 1.5 s without a break
  resets it. Coloured block 100 × multiplier, grey 50, diamond 500, key/lock 200.
- `starsFor(time, score)` placeholder: 3 stars at or under par, 2 within 1.5 × par, otherwise 1.
- Pause opens a small panel (Resume / Restart / World Map / sound) styled like the mockup.
- Title "Worlds" opens a World 1 level list (PB vs par); Worlds 2-4 show as "coming later";
  Gear and Records buttons show as locked "Soon".

## Tonight (night 1)
1. Playable core: auto-bouncing ball, horizontal steering, colour blocks, brushes, diamonds, skulls, walls, key + lock.
2. Tilt steering via the phone's gyro (DeviceOrientation, gamma axis), with permission prompt on iOS from the Play tap; on-screen hold buttons and keyboard as fallback.
3. 8 hand-made levels teaching the rules in order; instant restart.
4. Works at 390×844 and 1280×800, light/dark, mute toggle.

## Assumptions
- No timer/time bonus (the original had one; RULES.md says no mandatory timers).
- 3 lives per level attempt; losing them all just restarts that level (no global game over). Losing a life on purpose is the way to get the base colour back, as in the original.
- Original title not reused; working title "Tiltstones", original levels and art.

## Later
- Tilt sensitivity / calibration settings, landscape play.
- More block types from the original (reverse-controls, moving blocks), level select grid, more levels, level editor.
- Scores/high-score table.

## Design
### Core loop
The ball bounces up and down on its own between walls and blocks. Every bounce is a chance to hit a block; you tilt to choose which column the ball lands in next. Each level is a little ordering puzzle: which colour to clear first, when to grab a brush, how to avoid skulls on the way.

### The twist
Colour ordering under continuous motion: a block only breaks when the ball's colour matches; brushes repaint the ball and you can't paint back to the base colour. Steering by tilting the phone makes the hand-feel of the original's arrow keys physical.

### Controls
- Phone: tilt left/right (gamma, deadzone 3°, full speed at 22°). Also two large hold buttons ◀ ▶ under the board (override tilt while held).
- Desktop: ←/→ or A/D. R restarts the level, M mutes, Enter/Space starts/continues.

### Progression
8 hand-authored levels (10×14 grid): 1 base colour only + diamonds (tutorial, no hazards) · 2 first brush · 3 two colours, order matters · 4 walls to steer around · 5 skulls · 6 key and lock · 7 mixed · 8 finale.

### Win / lose / restart
Win: all coloured blocks then all diamonds broken → "Level clear" with Next. Lose a life on a skull: ball respawns at start in base colour. 0 lives → "Out of lives", tap to retry instantly. R / ↻ restarts anytime.

### Feel
1. Blocks pop with a short shrink + particle burst and a pitched blip (pitch rises with combo).
2. Brush hit: ball changes colour with a ring pulse and a chord.
3. Diamonds sparkle; final diamond → bright flash and arpeggio. Invalid hit (wrong colour) gives a dull thud. Reduced motion: no particles/flash.

### QA plan
- `state()`: `{screen: "title"|"playing"|"won"|"lost", level, lives, color, keys, ball:{x,y}, left:{color, diamonds}, steps}`
- actions: `"left" | "right" | "stay"` each advancing the simulation 6 fixed steps (0.1 s) deterministically; `"start"` on title, `"next"`/`"retry"` on won/lost screens are handled by reset in fuzz.
- `solve()`: a deterministic search autopilot — simulates on a cloned state, at each 0.1 s decision tries short rollouts of left/right/stay and keeps the one that makes the most progress (blocks removed, no life lost, distance to the next wanted target). Returns the action list; QA replays it.
- While `__qa` drives, the real-time loop stops stepping so results are reproducible.
