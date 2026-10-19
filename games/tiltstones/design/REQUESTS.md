# Design requests — Ricochet

Requests for Benji's designer (ChatGPT). Each one must stand alone: the designer can't see the repo
unless Benji connects it, so include everything needed. Newest first. When a hand-off answers a
request, mark it `answered` and note where the result landed.

---

## R2 — Measured pars for World 1 · status: open

**Context:** Ricochet is a Diamonds-style puzzle: the ball bounces vertically on its own at 9 cells/s and
the player only steers left/right (max 5.5 cells/s). Blocks break only when the ball has their colour;
paint pots repaint it (dip and bounce back out); diamonds break once all coloured blocks are gone. World 1
"Meadow Ruins" (levels 1-1 to 1-8, from levels.json v0.2-review) is now playable in the engine.

**What's needed:** Updated `parSeconds` for 1-1 … 1-8. The provisional pars are 2–8× slower than measured
clears, so every clear earns 3 stars. Measured (engine autopilot with perfect information, game time):

| Level | Autopilot | Current par |
|---|---|---|
| 1-1 | 6.8 s | 25 s |
| 1-2 | 7.7 s | 30 s |
| 1-3 | 5.4 s | 38 s |
| 1-4 | 15.4 s | 42 s |
| 1-5 | 27.2 s | 52 s |
| 1-6 | 7.7 s | 46 s |
| 1-7 | 9.5 s | 50 s |
| 1-8 | 30.2 s | 65 s |

A human playtester using the keyboard cleared 1-1 in 14.7 s. Pars depend on how Benji decides time, score
and stars relate (still open in DESIGN.md), so this may wait for that decision.

**Constraints:** Par stays a target only, never a loss timer.

**Deliver as:** `parSeconds` values in levels.json (or a markdown table).

**Meanwhile the studio:** The build shows the designer pars unchanged. Stars use a placeholder:
3 at or under par, 2 within 1.5× par, otherwise 1.

## R1 — Key in 1-7 and 1-8 is collected without trying · status: open

**Context:** Same game as R2. Levels 1-7 "The Garden Gate" and 1-8 "Ruins in Bloom" teach key + lock:
a key (`k`) is collected on contact and opens the single lock (`L`) in a stone shelf (`##L##` / `.##L#`).

**What's needed:** A decision on whether the key and lock should matter. In both grids the key sits at
column 4, row 10 (1-based), straight above the ball start at column 4, row 13, so the ball picks it up
0.3 s after the level starts with no input. Both levels are also completable with the lock treated as
a wall, because the shelf has open lanes on both sides; the gate is a shortcut, not a requirement.
Options: move the key one tile sideways so it has to be fetched, and/or extend the shelf so the gate is
the only way through (as the hint "Take the key to open a route" suggests).

**Constraints:** 10×14 grids, same legend; every level must stay solvable with no gear equipped.

**Deliver as:** Updated grid strings for 1-7 and 1-8 in levels.json.

**Meanwhile the studio:** Both levels ship exactly as delivered (DESIGN.md: don't redesign designer levels).
