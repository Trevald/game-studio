# FB-006 — Math Crush
Kind: completion-report
Packet: H-003-v1 ("a sweeter journey", MC-020–028), frozen revision `e030f63`, read in place. `sha256sum -c SHA256SUMS.txt` clean and `python3 -B data/validate.py` all PASS before building.
Code commit / private playable URL: night 5 commits on main from `62170ac` (brief) to the `math-crush: night 5` commit; runtime baseline `1d3543c`. Playable: https://claude.ai/artifact/D5kYHgsZbouMh73g1VMLTj (private, version 7).

Phases: **A, B and D implemented; C partly** (real-engine replay and automated QA done; the owner playtest that decides promotion is still needed). Journey stays a separate, secondary "Journey · New · preview" entry on Home. Classic stays the main Play button and is unchanged apart from the sticker removal and the new map.

Requirement IDs and implemented/deferred/failed results:

| ID | Result | What was done |
|---|---|---|
| MC-020 stickers | Implemented | No Stickers button, Home badge, Pause "Sticker book", collection, toasts, award logic, announcements, `__qa` book action or sticker assets in the published build. Stored `matchV3.stickers`/`badge` stay verbatim as inert data. Tested on fresh and legacy saves, on a win, and on a 7-candy chain with a combo. |
| MC-021 authored variety | Implemented | `data/levels.json` schema 3 inlined verbatim (a test compares it to the packet file). Separate `journey-v1` content with stable IDs 1–12. Each level has its own on-board cue at its opening witness; the cue only shows while the opening board is untouched, never forces a move and never gates play. Free wrong answers on L1–3 and L11. Classic data unchanged. |
| MC-022 shapes and jelly | Implemented | Active masks with voids as `null` cells. Voids break adjacency and can't be touched. Segmented gravity runs per column segment, so nothing falls through a void; candies spawning in a lower segment pop in rather than fall. Stripes cross voids; wrapped/combo areas are clipped to active cells. Jelly sits under candies: a halo, a translucent jelly layer on the tile, the count in the objective bar, and a "−N jelly" pop with shards when cleared. Jelly is removed once per patch, never respawns and is never restored by rewards. A jelly win is tested before running out of moves. |
| MC-023 changing targets | Implemented | The HUD shows the current target and Next, and "Final target" on the last step. The model advances once per valid clear, before the refill. The refill is repaired for the new target. The HUD holds the old target while the clear resolves, slides the new one in after settling, and blocks input during the transition. Undo restores target index, board and RNG together. Reload mid-transition shows the committed target. Help lists all targets. |
| MC-024 map | Implemented | One vertical scroll of three painted chapters (supplied WebP backdrops, two drifting clouds, sparkles). Live cream path through the SCREENS.md node centres. 64 px numbered nodes with a true mask thumbnail, jelly marks and a × for products. Stars come from that campaign's own records. Raspberry frontier node with a breathing you-are-here pin; muted locked nodes with the supplied lock. Sticky chapter label follows scroll. Bottom Continue shelf names the exact level and campaign. A chapter reveal ribbon with confetti plays once (600 ms, never blocks). Unlocked nodes start immediately. Classic uses the same chapters with its own contents (full boards, no jelly or ×). |
| MC-025 motion | Implemented | Selection pulse, chain pop staggered in path order, stripe row/column sweep (row-blast.svg), wrapped burst, combo areas, jelly crack and shards, distance-based fall with a land bounce, 250 ms score count-up, 180 ms target slide. Idle effects (glint every 5–8 s, special wobble, clouds, pin breath) are cosmetic only: they never touch gameplay RNG or the model, and they stop while selecting, in dialogs and when hidden. Synthesized sounds per MOTION.md (≤ 4 voices); one haptic pulse per commit. A new "Reduce motion" switch follows the OS until changed. Input lock is 480 ms for an ordinary clear, 560 ms for a combo and 660 ms with a target change, all ≤ 900 ms. Pause or hiding the page resolves the presentation at once. Frame grabs at 60/220/420/700 ms are in `qa/screens/phone-m-*`. |
| MC-026 multiplication (phase D) | Implemented, behind the after-10 unlock | L11 ×12 and L12 18→12→24. Persistent × label, "Multiply to make 12", × in the expression, "Score ×1.5" bonus chip. Product pruning keeps a trailing 1 legal, there is no eval, and repair injects the smallest factor pair. Specials are off and there are no mixed operators. Finishing preview 10 unlocks 11 (stored even before phase D, so no replay needed); the result card says "Next: Multiplication preview". `JOURNEY_PHASE_D` switches 11–12 back to "Coming later". |
| MC-027 saves and usability | Implemented | New `matchJourney` namespace with `journey-v1:<id>` records, its own unlocks, active attempt, archive and lessons. Classic `matchV3` is never written by Journey. A night-4 save loads verbatim and its core-v1 attempt resumes exactly. An unknown journey schema is preserved under `matchJourneyUnknown`. An older-version journey attempt is archived verbatim with "Restart level N" and is not called damaged. Blocked storage still plays in memory. 360×640 layout: board 280, compact HUD, everything above the fold, no target under 44 px. The keyboard cursor skips voids. |
| MC-028 verification and report | Done (this file) | See the commands below. |

Commands actually run and outcomes:
- Packet: `sha256sum -c SHA256SUMS.txt` all OK; `python3 -B data/validate.py` 12/12 PASS plus boundary checks.
- `node games/math-crush/qa/journey-tests.mjs`: **82/82**. All 12 witnesses replayed through the real engine with full snapshot equality against the oracle (board, specials, jelly, RNG, moves, made, score, status, events). Production also checks IDs are unique. Five gravity/repair fixtures computed with `model.py settle()` (ring and hourglass gravity, additive repair, factor-pair repair, changing-target repair) match exactly. The QA.md boundaries are covered: duplicate, diagonal, across-hole and void touch, ninth tile, 2+3≠10, 2×3≠12, 1×3×4=12, charged invalid on the final move, last-move jelly win, overlapping blasts, reward on jelly, changing-target repair, old-target chain after the transition, reload mid-animation, quit preview then resume Classic, and node 11 opening after preview 10. Map, motion and 360×640 input checks are included.
- `node games/math-crush/qa/engine-tests.mjs` (Classic): **86/86**. Sticker tests replaced by MC-020 removal tests; three-star routes still reachable on all 12 Classic levels.
- `node tools/qa/playtest.mjs games/math-crush/index.html`: all checks passed, 24 levels solved (Classic 12 + Journey 12; Journey `solve()` uses the packet routes from a fresh start).
- `node games/math-crush/qa/screens.mjs`: phone, 360×640, 1280×800 and 150 % text, 36 states each plus motion frames; no layout problems.
- Separate reviewer agent: "ship with fixes" (see below).

Phone/desktop screenshots and interaction evidence: `games/math-crush/qa/screens/` (`*-v0x` maps, `*-j0x/j1x` journey levels, `*-w0x` results, `phone-m-*` motion frames) and `qa/journey-tests.json`, `qa/engine-tests.json`. Methods: automated Chromium (`__qa` and real mouse/keyboard input) plus the reviewer agent's mouse, tap-mode and keyboard play. No human played the game.

Deviations, unresolved questions and proposed resolution:
- **Reviewer findings that conflict with the packet; not changed tonight (designer/owner call):**
  1. Board shapes feel barely different: hourglass removes 2 cells, ring removes 1. Proposal: larger voids, islands or corridors in a later packet.
  2. No difficulty curve: targets 8–15, moves = quota + 2 throughout; a shortest-chain bot wins every level, mostly with 1 star. Proposal: fewer spare moves, bigger targets later, minimum chain lengths.
  3. Multiplication 1-padding: 3 × 1 × 4 = 12 scores like a 3-chain, so high multiplication scores are easy. RULES.md asks to watch this in playtest before restricting; it shows up immediately.
  4. Journey is the secondary entry. The reviewer wants it to be the main path; HANDOVER/SCREENS require it to stay opt-in until owner acceptance.
- Reviewer findings fixed: jelly was hard to read (now a full translucent jelly layer plus a stronger halo); "−N jelly" now shows even when a blast bonus also shows; win confetti no longer carries into the next attempt.
- Implementation choices to confirm:
  - Home's Journey card opens the Journey map rather than starting a level.
  - A chapter reveal plays once per campaign; Classic gets it too.
  - Fresh candies in a lower segment pop in instead of falling past the void.
  - Map captions show for the current node, and on hover or focus for the others.
  - The input lock after a clear is 480 ms; fast tappers are briefly ignored.
- Not run: real device, sound/haptics by ear, screen reader, human difficulty.

Owner acceptance: pending (owner playtest decides whether Journey replaces Classic as the default)
