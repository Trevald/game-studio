# Mathly Trails — night log

## Night 1 — 2026-10-19

**Job:** new game: "Full game version of Mathly" (an extra daytime shift started by Benji)

**Shipped:**
- A make-the-target puzzle: merge two number tiles with an operator, and the result replaces them. Reach the target for ★, have one tile left over for ★★, use every number for ★★★. Finish appears as soon as the target is made. Undo, restart and a dead-end message are included.
- A trail of 4 worlds × 8 levels: Addition Meadow (+ −), Times Hills (+ − ×), Divide Dunes (+ − × ÷ and 25/50) and The Summit (6 numbers up to 100, three-digit targets). It starts with 3 tiles and + only. Every board has an all-numbers route, no one-merge shortcut and a cap on how many routes exist, and each world is ordered easiest first.
- A daily challenge seeded by the date (6 numbers, all operators) and endless Random boards for each unlocked world.
- A hint button (the next merge of a full route, which caps the board at ★★), keyboard play (position badges 1–6, + − * /, U, H, R, Enter), and light and dark themes with sound and a mute toggle.

**QA:** 17/17 checks passed · 3 rounds · all 33 boards (32 trail plus the daily) completable via `solve()` using every number. No known issues.

**Reviewer:** ship with fixes. The worlds, daily and random boards deliver the idea, and the best moments are the tight late boards. The reviewer flagged repeated or trivial early boards and uneven difficulty.
- Fixed: Enter on "target made" skipping the result screen; number keys being unclear (position badges added); ★★★ being optional (world star gate, Finish made a secondary button); trivial boards (route cap, no one-merge targets, no repeated targets in a world, at most two of a number, easiest first); no help (hint button); long titles on phone.
- Not done: a shareable daily result string and streaks (Later).

**Assumptions:** I couldn't read mathly.trevald.com: it renders with JavaScript and WebFetch got only its title. So the rules are a Countdown/Digits-style reading of the idea. Results stay positive whole numbers. "Auguru" wasn't found; I read it as "random board on demand".

**Questions for Benji:** 1) Are these Mathly's rules? I couldn't open the site, so if Mathly works differently (a grid, an equation to fill in), tell me and the next night will rebuild the core around it. 2) Is the 14★ gate per world right, or should worlds open with just ★? 3) Should the daily get a share string and a streak next?

**Play:** https://claude.ai/artifact/3ouYeSyBQsbEQ46theZZck
