---
title: Tiltstones
slug: tiltstones
idea_id: szh7gjlgrh5ebj6oudix
artifact: https://claude.ai/artifact/VAXzjHmZLmMTJS5zQsRJH4
---

# Tiltstones

## The idea
> A mobile version of the 1990 Mac game Diamonds — Instead of using arrow keys to control the ball we can use the gyro of a mobile phone.

A Diamonds-style brick puzzle where the ball bounces up and down by itself and you steer it sideways by tilting your phone (arrow keys / touch buttons as fallback).

## References
- 1990 Mac game *Diamonds* (named, not linked; looked up via Wikipedia "Diamonds (video game)") — the ball bounces vertically on its own, the player only controls horizontal motion. Coloured blocks only break when the ball has the same colour; brush blocks repaint the ball; diamonds can only be broken once every coloured block is gone; skulls cost a life. The ball starts each level/life in its base colour and nothing paints it back, so base-colour blocks must be cleared first (or you lose a life on purpose). Keys/locks and solid blocks also exist in the original; the page didn't detail them.
- *Diamonds PD* (Playdate remake, itch.io page) — confirms the control scheme (left/right only, crank as analog input) and that a 1-axis analog input fits the game. Page has no rules detail.

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
