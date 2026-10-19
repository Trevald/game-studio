# Design requests — Mathly Trails

Requests for Benji's designer (ChatGPT). Each one must stand alone: the designer can't see the repo
unless Benji connects it, so include everything needed. Newest first. When a hand-off answers a
request, mark it `answered` and note where the result landed.

---

## R1 — Full design hand-off for Mathly Trails · status: answered (2026-10-19, see DESIGN.md and design/handover-v1/)

Paste everything below the line to the designer.

---

You're the designer for **Mathly Trails**, a mobile-first math puzzle. It's the "full game" version of Benji's daily puzzle **Mathly**. Please produce a design hand-off a developer can build from directly.

**Links**
- The original daily game: https://mathly.trevald.com
- The current studio build (night 1): https://claude.ai/artifact/3ouYeSyBQsbEQ46theZZck

Open both. Mathly is the source of truth for rules and feel. The studio couldn't read mathly.trevald.com (it's rendered in JavaScript), so the current build is a guess.

**What the build does now (so you know what you're correcting)**
- Each board has a target number and 3–6 number tiles. Tap a tile, an operator (+ − × ÷), then a second tile. The two tiles merge into the result.
- Results must be positive whole numbers.
- Making the target earns ★, with one tile left over ★★, and using every tile ★★★. Players can finish as soon as the target is made, or keep going for ★★★.
- There are 4 worlds of 8 levels on a trail map:
  1. Addition Meadow: + and −, 3–5 small numbers.
  2. Times Hills: adds ×.
  3. Divide Dunes: adds ÷ and the numbers 25 and 50.
  4. The Summit: 6 numbers up to 100, three-digit targets.
- To travel to the next world you need 14 of the 24 stars in the current one.
- Also: a daily challenge (seeded by date, the same for everyone), endless random boards for each unlocked world, a hint (shows the next merge and caps that board at ★★), undo and restart.
- The look is plain placeholder styling: a mint/teal palette, white tiles and a yellow selection colour, with light and dark themes.

**1. Rules: confirm or correct against Mathly**
- How does a Mathly puzzle work: board shape, how numbers and operators are used, what counts as solved, and any scoring?
- What should carry over into the full game unchanged? Where should the game differ from the daily, and why?
- If Mathly is not a make-the-target puzzle, describe its core loop precisely enough to rebuild it.
- Say how difficulty should grow: operators, how many numbers, number size, target size, and any new mechanics per world.

**2. Structure**
- Worlds: how many, their names and themes, and the order operators and mechanics are introduced in.
- Levels: hand-made or generated? If hand-made, give World 1 as data (see deliverables).
- Stars and unlocking: what earns stars, and what unlocks levels and worlds.
- The daily challenge: how it relates to the trail, and whether there are streaks or sharing.
- Benji's rules for the studio: no timers unless the idea is about time, no ads, no fake currencies, no energy systems. Undo and instant restart must always be available.

**3. Look and screens**
- A visual direction that feels like Mathly: palette, type, tile and operator style, motion and feedback.
- Mockups for these screens:
  - Title
  - Trail map, including locked and completed states
  - Gameplay at 390×844 portrait: target, tiles, operators, a selected tile, made-target state, dead-end state
  - Level complete, with stars and the route taken
  - Daily challenge, before and after solving
  - Hint state
  - Settings or pause, if any
- It must work one-handed on a phone and also with a keyboard on desktop. Tap targets should be at least 44 px.

**4. Deliverables**
1. `DESIGN.md`: the rules above with "Decided" and "Open" sections. Anything you leave open, the studio will propose rather than invent.
2. Mockup images (PNG). Label them "illustrative" or "spec".
3. Runtime art, if any. Formats and limits:
   - Backgrounds: WebP at 1024×1536.
   - Logo: SVG.
   - Icons: SVG, 64×64.
   - Keep the total under about 1 MB. The game is one HTML file and loads art from an `assets/` folder by relative URL.
4. World 1 levels as JSON, if they're hand-made:
   ```json
   {"id": "1-1", "name": "…", "tiles": [8, 8, 7], "ops": ["+"], "target": 23, "solution": ["8 + 8 = 16", "16 + 7 = 23"]}
   ```
   Every level needs at least one solution that uses all the tiles.
5. A short README listing every file and how to use it.
