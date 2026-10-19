# Sweepvault — night log

## Night 1 — 2026-10-19

**Job:** new game — "Minesweeper inspired game for mobile" (find a key before exiting through the door; power-ups)

**Shipped:**
- Minesweeper core (numbers, flags, zero flood, chording on a satisfied number) where the goal is a search: a visible locked vault door, key(s) hidden under safe tiles, exit once you hold them all. You never have to clear the board.
- Hidden items announce themselves: a revealed number shows a small item icon (key / gem / lantern / heart) when that item is hidden next to it, so you deduce where the key is as well as where the mines are.
- Items: lantern (arm it, next dig lights a safe 3×3 and marks its mines), heart (+1), gems (optional per-level collectible).
- 8 levels from fixed seeds, each accepted only if pure logic can solve it (no guessing), the opening and the door never hand out keys, one dig never yields two keys, and the key hunt takes a minimum number of digs. 3 hearts per level, undo, instant restart, progress + mute saved.
- Phone: tap dig, long-press or Flag mode to flag; desktop: click / right-click; keyboard cursor (arrows/WASD, Space, F, L, U/Z, R, N, M). Light/dark, reduced motion, WebAudio sounds, ripple reveal, item pop + HUD bump, board shake on a mine.

**QA:** 17/17 checks passed · 3 rounds · all 8 levels completable via `solve()` · known issues: none open.

**Reviewer:** ship with fixes — the key hunt is the core when it works (triangulating the key from glinting numbers was the best moment); flagged door/key giveaways and powerless items. Fixed: ghost tap on the "Out of hearts" card on touch (pointerup preventDefault + 450 ms card guard), door as free opening / two keys from one dig (generator rejects these; key bias removed; minDigs now counts digs before the last key), stale events replaying on no-op actions, undo no longer refunds hearts, glints are now item icons and the collected-item dot is gone; also chording, pickup pop, long-press limited to touch. Not fixed: lanterns still never necessary (boards are guess-free) — moved to Later and asked below.

**Assumptions:** undo kept (RULES.md) but a heart lost to a mine stays lost; door visible from the start; gems are a badge only; level 8 is a long dig (40-ish taps, chording helps).

**Questions for Benji:** 1) Should lanterns become necessary, e.g. one deliberate 50/50 per level that only a lantern (or a heart) gets you through? 2) Next night: more item types (compass, chests, monsters à la Mamono Sweeper) or an endless/daily board?

**Play:** https://claude.ai/artifact/4UtwbypmnfbQBmTpWb1N66
