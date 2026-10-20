# Mathly — night log

## Night 2 — 2026-10-20

**Job:** iteration on notes: "The designer's hand-over for Mathly is in … Next: phase 1 — new engine, play and completion screens in the Card Table look, Starter's 8 boards."

**Shipped:**
- The game is now **Mathly**, built from the designer's hand-over. The night-1 merge-tiles game, trail map and stars are gone. You get a target and five cards, and you build one expression with + − × ÷ and parentheses, which you can use as often as you like. You must use all five cards. The result updates live. The puzzle finishes by itself (no Submit button), with a check, "Solved", a 600 ms moment on the board, then the completion screen: Next puzzle, Back to collection, Review expression and Try another way.
- A new engine: a tokenizer and recursive-descent parser (no `eval`) with exact BigInt fractions. It covers every result state in §2: empty, valid, target matched early, all five used but the target missed, incomplete with "Last valid", and divide by zero. All 10 parser fixtures in `engine-cases.json` agree, and all 12 boards agree with `verification.json`. A separate exhaustive solver finds a solution to every board.
- Card Table look: the play screen follows key-screens.jpg and mockups 05–13. That means the brass target plaque, dark result plaque, expression well with the table-mark roundel, five stable source slots with "Used" ghosts, the operator palette, and Undo/Hint/Restart. The felt, logo, roundel and icons load from `assets/`.
- Editing: tap to insert at the gold caret, tap a placed card for Before/After/Remove/Done, and tap an operator while an operator is selected to replace it. Drag and drop inserts, moves, and removes (drop on the tray). Undo covers every edit, including Restart. The expression pages when it gets long. Keyboard play works in the workspace.
- Home → Collections → collection → play → complete. Starter's 8 boards come from `levels.json` as delivered, and the other 4 sample boards are the Multiplication, Division and Mastery collections. There is a three-step hint ("With hint" is recorded, nothing is lost), How to play, and settings (sound off by default, high contrast). Progress and the current attempt are saved locally.

**QA:** 17/17 checks passed · 3 rounds · all 12 boards completable via `solve()`. I also checked real taps, mouse drags, keys and reload/continue in a separate script, and looked at screenshots at 390×844, 375×667, 320×568, 1280×800 and 844×390. Known issues: landscape is a stacked, scrolling stopgap rather than the two-column board in the spec. Undo history doesn't survive a reload (only the expression does).

**Reviewer:** ship with fixes. Phase 1 delivers the hand-over, and Multiplication 01 is the best moment. All eight Starter boards play the same way (add the big cards, take away the small ones), and there's almost nothing after them yet.
- Fixed:
  - Landscape layout overlapping the tray (stopgap: stack and scroll).
  - The dragged card hid the drop caret. The card now floats above the finger and the drop point gets a glowing caret.
  - "Last valid" could show a value from an earlier expression. It now comes from the current expression's valid start, or is left out.
  - A focus ring on the completion heading.
  - Completed level tiles looked disabled. They now get a brass check.
- Not fixed: no Daily and no practice yet (phase 2). Starter boards all feel alike, which is designer content, so it's a question for Benji.

**Assumptions:**
- Number keys place the first free card of that value, even with duplicates. The spec asks you to select duplicates first, but they are interchangeable.
- I hid the Daily card on Home until phase 2 instead of showing a dead entry.
- I couldn't read mathly.trevald.com again tonight (the fetch wasn't allowed), so the hand-over is the only source.

**Questions for Benji:** 1) Go ahead with phase 2 (UTC Daily, Practice for each collection, more Multiplication/Division/Mastery boards)? 2) All 8 Starter boards play the same way. Should the studio make 2–3 of them need a different move, or ask the designer?

**Play:** https://claude.ai/artifact/3ouYeSyBQsbEQ46theZZck

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
