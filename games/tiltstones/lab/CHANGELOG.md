# Level Lab: changelog and measurements (night 3, 19–20 Oct)

Source of truth: `levels.json`. Older versions: `levels-v1.json` … `levels-v3.json`.
To change a level, edit the JSON, then run `node games/tiltstones/lab/build.mjs`, which injects it into `index.html`.
To measure: `node games/tiltstones/lab/measure.mjs` (headless solver route; `all` adds World 1) and
`node games/tiltstones/lab/play1x.mjs` (Playwright, real key presses at 1×, a careful bot that decides every 0.2 s).
Raw output for each round is in `v*-metrics.txt` and `v*-play1x.txt`.

## Metrics (final, v4)

The metrics are:

- **Dead time:** the sum of every gap between useful hits (break, grey, diamond, key, lock, paint) minus 1 s each.
- **Max flight:** the longest vertical travel with no contact at all, in rows.
- **Open run:** the longest straight column of air once every breakable tile is gone. It is a static check of how much space opens up late in the level.
- **Ratio:** coloured / grey / stone / empty, in % of cells.
- **Solver** is the fast, ideal route. **1×** is the careful bot playing with real keys. Runs are single samples.

| Lab | Direction | Ratio col/grey/stone/empty | Solver | Solver dead | 1× time | 1× dead | 1× worst gap | 1× max flight | Open run | Contacts per hit |
|---|---|---|---|---|---|---|---|---|---|---|
| L1 | Rattle Rows | 40/9/17/32 | 27.9 s | 9% | 39.9 s | 41% | 5.4 s | 6.4 | 7 | 3.6 |
| L2 | Switchback | 32/5/24/37 | 24.8 s | 18% | 36.5 s | 34% | 4.4 s | 3.4 | 5 | 5.1 |
| L3 | Pockets | 41/3/20/34 | 29.3 s | 20% | 44.2 s | 42% | 5.7 s | 3.9 | 6 | 4.4 |
| L4 | Shafts | 34/19/23/23 | 25.6 s | 12% | 24.7 s | **6%** | **1.8 s** | 3.6 | 9 | 3.9 |
| L5 | Grey Scaffold | 25/32/21/20 | 27.1 s | 9% | 31.6 s | 30% | 5.7 s | 5.6 | 11 | 4.5 |
| L6 | Colour Onion | 34/6/21/36 | 32.1 s | 20% | 47.3 s | 38% | 8.0 s | 5.1 | 7 | 4.5 |
| L7 | Stone Heavy | 29/0/36/34 | 29.3 s | 30% | 53.5 s | 60% | 7.6 s | 8.8 | 13 | 8.7 |
| L8 | Brick Wall | 56/5/18/19 | 36.0 s | 9% | 40.9 s | 27% | 7.0 s | 4.5 | 8 | 3.3 |
| L9 | Narrow Eight (8 col) | 35/9/14/39 | 18.4 s | 3% | 28.5 s | 41% | 5.8 s | 5.4 | 7 | 2.5 |
| L10 | Open Field (contrast) | 7/1/0/89 | 12.3 s | 20% | stuck at 6.8 s* | 30% | 1.8 s | 7.4 | 14 | 2.5 |
| *1-1…1-8* | *World 1, for comparison* | *6–9% coloured, 82–93% empty* | *5–24 s* | *0–42%* | | | | *7–13* | | |

\* The L10 1× bot touched the red pot in the open with blue left and soft-locked; that's the contrast level working as a warning.
Deaths: 0 in every run (no lab level uses skulls; the risk in the lab is painting too early, not dying).

## Per level: v1 → v4

- **L1 Rattle Rows**
  - v1: full-width bands with 1-row channels. As bands cleared they merged into a 10×9 hall: 12-row flights, 22% dead time.
  - v2: added stone ribs every 4 rows. Dead time 22% → 4%, flights 12 → 7 rows.
  - v3: the guarded pot sat right above a channel, so at 1× the ball fell into it the moment the guard broke (soft-lock). The pot moved to the end of a channel, with stone above and below it, so it can only be reached sideways.
  - v4: the reviewer found the row-7 rib had 5 gaps. Cut each rib to 2 gaps, staggered between ribs. Open run 11 → 7.
- **L2 Switchback**
  - v1: a snake of 1-row channels with walls you can break, 63% → 18% dead after the solver fix. Flights 10 rows.
  - v2: the shelves are now stone with grey shortcuts. Flights 10 → 4.4.
  - v3: the pot moved from the top shelf to the end of a channel (side entry). It soft-locked at 1× in v2.
- **L3 Pockets**
  - v1: 2×2 rooms fenced by blue blocks. Once the fences broke, the field was a hall (flights 12).
  - v2: stone posts at the room corners.
  - v2b: fence holes staggered between floors.
  - v4: one more stone post in column 4, where four breakable fence cells lined up. Open run 9 → 6, flights 11 → 4.4.
- **L4 Shafts**
  - v1: shafts between stone columns, with grey ribs that were too easy to break into one 12-row shaft.
  - v2: blue plugs in the floors, staggered so a shaft never opens straight through. Flights 12 → 7.
  - v4: the reviewer found blue blocks stacked in the outer columns that could only be broken by side hits (65 s straggler hunts). They are grey now, so they can't hold up the finish. 1× dead time is 6%, the best of the lab.
- **L5 Grey Scaffold**
  - v1: 44% grey. Carving opened halls (flights 12).
  - v2: stone ribs, grey down to 33%.
  - v3: a pot at a dead end that walled off the last blue (unsolvable) was fixed, and the pot is side-entry.
  - v4: ribs closed in columns 1 and 7. Flights 11 → 4.4, dead time 18% → 9%.
- **L6 Colour Onion**
  - v1: layers with pots in the middle of a column. The solver ping-ponged between pots, and one red block could only be reached from the side.
  - v2: ribs between the layers, with pots in the ribs.
  - v3: pots are side-entry from a 1-cell slot. The reviewer failed it twice at 1×.
  - v4: every pot is now at the end of the channel the ball already runs along (blue → red pot bottom right, red → green pot left, green → gold pot right). The bottom-right blue straggler is now grey. It clears at 1×.
- **L7 Stone Heavy**
  - v1: unsolvable (blue blocks sealed behind diamonds).
  - v2: the top row was reopened. It stays heavy on purpose, as the "too much stone" comparison point.
- **L8 Brick Wall**
  - v1: almost solid bricks. 153 s with 64 s of dead time, because carving made one big hall.
  - v2: two stone ribs. 153 s → 36 s, dead time 42% → 9%.
  - v3: the pot is side-entry.
- **L9 Narrow Eight**
  - v1: the L1 idea on 8 columns.
  - v2: ribs.
  - v3: side-entry pot.
  - v4: the top-right red straggler (needed a pixel-precise entry) was removed, and a stone-free column was closed. Open run 14 → 7, solver dead time 12% → 3%.
- **L10 Open Field**
  - v2: a red pot and red blocks were added, so the speed route has an order decision. Otherwise it is deliberately sparse.

## Tooling changes that came out of measuring
- **Solver:** the old greedy search (0.1 s look-ahead plans) stalled for about 15 s at a time in dense levels. All the "gaps" it reported were really the solver failing. It was replaced by a macro planner: "steer to column c and hold until something useful happens", choosing the fastest safe column, with a two-step fallback and a corridor-distance fallback. It is about 50× faster and has no stalls, and it now clears all 18 levels.
- **Grid size per level** (`W`/`H` come from the map), so the 8-column test is real.
