# Ricochet (tiltstones) — night log

## Night 4 — 2026-10-21 (03:50 shift)

**Job:** build the approved design hand-over H-001-v1 (design-studio/games/ricochet, RIC-N-001–007): one night of compact level exploration. The board had no pending notes or queued ideas; the studio read Benji's 20 Oct approval ("for one overnight exploration shift") as tonight's job rather than pitching a studio game.

**Shipped:**
- Three new Level Lab candidates at the top of the lab, all 14 × 9, standard speed, current 0.5 s dip and combo:
  - **N1 Twin Harbours** — two mirrored stone harbours (blue left, red right) with the red well on a pillar between their mouths.
  - **N2 Red Door Circuit** — a stone shelf splits two floors; as blue you go up through the left gaps; once red, breaking the red door on the right opens a short way between floors.
  - **N3 Return Ticket** — a red-capped vault next to the blue well keeps blue inside, and a red plug sits on the blue well: blue → red → blue.
- All existing levels (World 1, L1–L10, H1–H6, S1–S3, S1F/S1A, P1–P3) unchanged; the five H-001 witnesses replay (5/5 won, 3 lives).
- The published build was still night 3's; it now also carries the designer baseline (H/S/P levels, 0.5 s dip, combo tiers) that had only been on main.
- Lab tools: `witness.mjs` (replay witnesses), `make-witness.mjs`, `trace.mjs` (solver route with events), `access.mjs` (before/after access check), `night4/shots-n.mjs`; `play1x.mjs` now picks desktop/phone viewport from map orientation and logs events.
- Versions v1–v5 of N1–N3 in `lab/night4/`, witnesses in `lab/night4-witnesses.json`.

**Results (final v5; single samples, bot not human):**

| Level | Solver clear / dead | 1× bot clear / dead / worst gap | Longest 1× flight | Colours |
|---|---|---|---|---|
| N1 Twin Harbours | 13.7 s / 28% | 13.1 s / 19% / 2.1 s | 5.7 rows | B→R (early red dip → B) |
| N2 Red Door Circuit | 13.2 s / 29% | 20.6 s / 41% / 3.6 s | 5.1 rows | B→R |
| N3 Return Ticket | 28.7 s / 38% | 28.9 s / 33% / 2.7 s | 5.0 rows | B→R→B |
| S1 / S2 / S3 tonight | — | 15.8 / 19.9 / 20.2 s | | |

**Studio ranking:** N1, N2, N3. Reviewer (on v4, before fixes): N2, N1, N3.

**QA:** 17/17 checks · 2 rounds · 35 levels completable by solve() · known issues: 1× bot times vary ±30% between runs on this 2-core machine; open run after clearing is 9 rows in every N level (edge columns stay open, as in S1–S3).

**Reviewer:** ship with fixes — readable, no soft-locks (30/30 random-prefix recoveries), but greys broke in the first seconds so breaking had no purpose, N1 had a 6.9 s pocket cleanup, N3 repeats the shell idea and its hint promised a risk that doesn't exist and named the R key on phone. Fixed: N2 trapdoor → red door (closed 3.7 s vs open 0.9 s to the upper floor), N3 start greys removed and hint rewritten, N1 inner harbour columns opened from below (1× worst gap 6.5 → 2.1 s), "↻" instead of R. Not fixed: N3 is still a small shell (kept as the return-colour candidate RIC-N-004 asks for; ranked last); phone tiles are ~24 px (orientation is open).

**Assumptions:** the approved hand-over counts as Benji's job without a board note; RIC-N-003 evidence is solver before/after access runs.

**Questions for Benji:** see the board report and FB-001.

**Play:** https://claude.ai/artifact/VAXzjHmZLmMTJS5zQsRJH4

## Night 3 — 2026-10-19 (22:30 shift)

**Job:** iteration on note "ricochet-level-lab": "I'm not happy with the World 1 level designs. Tonight: build a Level Lab — 8 or more levels, each a different level-design direction … dense … corridors … little open space … better balance between breakable and unbreakable … Keep World 1 playable for comparison."

**Shipped:**
- **Level Lab** on the start screen: 10 directions with name, family, one-line idea and a block-ratio bar showing the real colour split. Each opens on a direction card (idea, ratio, PB, Play) and has its own clock and PB. The lab uses the Crystal Caverns background. Lab levels have no par or stars.
- **The directions:**
  - 9 dense-corridor variations: Rattle Rows, Switchback, Pockets, Shafts, Grey Scaffold, Colour Onion, Stone Heavy, Brick Wall, Narrow Eight (a real 8-column grid).
  - 1 contrast: Open Field.
  - Only existing tiles are used. World 1 is unchanged.
- **Engine:** grid size is now set per level.
- **Solver:** rewritten as a macro planner ("steer to column c and hold until something useful happens"). The old search stalled for about 15 s at a time in dense levels. The new one is about 50× faster, and it now clears all 18 levels.
- **Lab tools in `lab/`:**
  - `levels.json` + `build.mjs`: levels are edited as JSON and injected into the game.
  - `measure.mjs`: headless metrics.
  - `play1x.mjs`: Playwright with real key presses at 1×, using a careful bot that decides every 0.2 s.
  - `gaps.mjs` / `travel.mjs`: debugging.
  - `CHANGELOG.md`: the v1→v4 changelog per level and the full metrics table.

**Results (final):**

| Direction | Ratio col/grey/stone/empty | Solver | Solver dead | 1× time | 1× dead | 1× max flight |
|---|---|---|---|---|---|---|
| L1 Rattle Rows | 40/9/17/32 | 27.9 s | 9% | 39.9 s | 41% | 6.4 rows |
| L2 Switchback | 32/5/24/37 | 24.8 s | 18% | 36.5 s | 34% | 3.4 |
| L3 Pockets | 41/3/20/34 | 29.3 s | 20% | 44.2 s | 42% | 3.9 |
| L4 Shafts | 34/19/23/23 | 25.6 s | 12% | 24.7 s | 6% | 3.6 |
| L5 Grey Scaffold | 25/32/21/20 | 27.1 s | 9% | 31.6 s | 30% | 5.6 |
| L6 Colour Onion | 34/6/21/36 | 32.1 s | 20% | 47.3 s | 38% | 5.1 |
| L7 Stone Heavy | 29/0/36/34 | 29.3 s | 30% | 53.5 s | 60% | 8.8 |
| L8 Brick Wall | 56/5/18/19 | 36.0 s | 9% | 40.9 s | 27% | 4.5 |
| L9 Narrow Eight | 35/9/14/39 | 18.4 s | 3% | 28.5 s | 41% | 5.4 |
| L10 Open Field | 7/1/0/89 | 12.3 s | 20% | soft-lock | 30% | 7.4 |

World 1 for comparison: 82–93% empty, 0–42% dead time on the solver route, flights of 7–13 rows.

**Studio top 3:**
1. **Shafts:** best real-time run (6% dead, worst gap 1.8 s, short flights). Stone columns keep the corridors after clearing.
2. **Switchback:** the only layout whose corridors fully survive clearing (open run 5 rows). Steady, but stone-heavy.
3. **Brick Wall:** densest (56% coloured), every bounce breaks something, with nothing left to hunt at the end.

The reviewer ranked them Switchback, Brick Wall, Shafts, and the worst two Stone Heavy and Open Field. That confirms Benji's read that the reference has too much stone: Stone Heavy has 60% dead time at 1×.

**What we learned:**
1. **Corridors made only of breakable blocks don't last.** Every v1 level turned into a hall once its bands were cleared, with 10–12-row flights. Permanent stone or grey ribs every 3–4 rows, with 1–2 staggered gaps, fixed that.
2. **Pots and density don't mix.** In a dense channel, breaking the blue block in front of a pot puts the ball in the pot within 0.1 s, so 4 of 7 pot levels soft-locked at human pace. Pots that can only be entered from the side, at the end of a channel, fixed most of it.
3. **The solver route understates waiting** by 2–4×. Most of the 1× dead time is the straggler hunt in the last 20% of the level.

**Next to try:**
- A "skeleton" direction: Shafts/Switchback stone structure filled with Brick Wall density, using 3–4 interleaved colours (most lab levels are only blue → red).
- Proposals (new mechanics, not built):
  - A cracked stone that takes 2 hits.
  - Blue Return gear, or a "blue pot", as the answer to painting too early.
  - A last-5-blocks pulse, to cut the straggler hunt.

**QA:** 17/17 checks · 4 rounds · all 18 levels (8 World 1 + 10 lab) completable by `solve()`. All 10 lab levels were also played at 1× with real key presses: 9 cleared. Open Field soft-locked by painting early, which is part of the contrast.

**Reviewer:** ship with fixes.
- **Fixed:**
  - Cleared levels turning into halls: ribs closed or staggered in L1, L3, L5, L9.
  - Stragglers: L9's top-right red removed; L4's side-only outer blues are now grey.
  - L6 pots that could only be reached through a 1-cell slot: moved to channel ends.
  - Solver-only metrics: added a 1× table, plus "open run after clear" and "last-fifth dead time" columns.
  - The rainbow ratio bar: it now shows the real colour split.
- **Not done:**
  - More colour interleaving (noted as the next direction).
  - Dead-time readout on the win screen.

**Assumptions:**
- Lab levels are ungated, have no par or stars, and use the Crystal Caverns background.
- "Dead time" = the sum of each gap between useful hits minus 1 s.
- The human-style run is a bot with 0.2 s decisions on real key events. That is a proxy, not a person.

**Questions for Benji:**
1. Which 1–2 directions should we take forward? (Studio pick: Shafts' stone skeleton filled with Brick Wall density.)
2. How should painting too early be handled in dense levels: side-entry pots only, a skull reset nook, or a Blue Return item?
3. Is the 8-column grid worth keeping? Tiles are 43 px instead of 34 px on the phone.

**Play:** https://claude.ai/artifact/VAXzjHmZLmMTJS5zQsRJH4

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
