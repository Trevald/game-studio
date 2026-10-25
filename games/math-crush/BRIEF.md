---
title: Math Crush (working title)
slug: math-crush
idea_id: 3u0kk09h3uemtxj8us8c
artifact: https://claude.ai/artifact/D5kYHgsZbouMh73g1VMLTj
---

# Math Crush (working title)

## The idea
> **Candy Crush but math based** — Instead of aligning three of the same you need to align numbers that
> somehow make up another number. I've been exploring this multiple times but haven't find a good way to
> implement operators. Maybe it doesn't need to be about aligning. Could also be a board full of numbers and
> you need to match numbers and operators on that board to make another number. As tiles are being consumed
> they disappear and either new ones come or you should empty the board.

A candy-crush-feeling board where you drag chains of touching numbers that add up to the target; longer
chains score more and leave striped and wrapped candies. (Started as three prototypes — Match, Equation,
Clear — and Benji picked Candy Match.)

**Owner decision, 22 Oct 2026:** Benji chose Candy Match as the game and asked to remove the other two
concepts. Equation and Clear (mode picker, rules, levels, runtime art) are gone from `index.html` and
`assets/`; the game opens on the Candy Match home. Old saves keep their Equation/Clear records untouched.
This overrides H-001-v1 MC-001's "never remove Equation/Clear saves or access"; don't restore them. Recorded
for the designer in `design-studio/games/math-crush/feedback/FB-002-match-only.md`.

## References
- No links in the idea or notes. The design source is Benji's designer hand-over:
  `DESIGN.md` → `design/handover-v1/docs/Studio-Handoff.md` (rules, scoring, layout coordinates),
  `design/handover-v1/designs/` (21 screens), `reference/approved-art-direction.jpg`, runtime art in `assets/`.
- Math Crush is **not registered** in `design-studio/PROJECTS.md` yet (no approved hand-over there), so
  `games/math-crush/DESIGN.md` is in force. Design questions go to `design/REQUESTS.md`. *(Night 1. Superseded
  on 21 Oct: see Night 2.)*
- **Night 2:** the approved hand-over `design-studio/games/math-crush/handovers/H-001-v1/` (HANDOVER.md,
  SCREENS.md, mechanics-fixtures.json, assets/; SHA256SUMS verified) is the design source, read in place.
  Authorization: `design-studio/games/math-crush/STATUS.md` (Benji, 21 Oct). Reports go to
  `design-studio/games/math-crush/feedback/FB-NNN-*.md`. No URLs in the idea or tonight's note.

- **Night 3:** approved hand-over `design-studio/games/math-crush/handovers/H-002-v1/` (play first, sweet
  rewards), read in place; SHA256SUMS verified clean before building. Authorization: STATUS.md (Benji, 25 Oct,
  "Create the hand-over with all needed assets"). Picked as job 1b (approved hand-over with no completion report;
  no pending board notes). Report: `design-studio/games/math-crush/feedback/FB-003-sweet-play.md`. No URLs.

## Tonight (night 3) — H-002-v1 "play first, sweet rewards"
1. **Phase A (MC-010/011/017/019):** schema-2 level data (12 levels, explicit star thresholds, initial specials,
   free wrong sums L1–3); no intro screen — Play/level/Next/Retry open the board; on-board lesson cues
   (L1, L2, L4, L7, L6 hammer after 8 s idle, L8 Rush) persisted separately; live star meter with ticks and a
   hollow completion star; new results (Next / Play again / Try speed challenge, no Assisted chip); speed
   challenge as a separate timed attempt with best-time records; `matchV3` records + `sweet-v1`, legacy
   data and old active attempt kept as archive.
2. **Phase B (MC-012/013/014):** combos (stripe+stripe, stripe+wrapped, wrapped+wrapped) with exact preview,
   one level-granted hammer on L6–12 with target → confirm/cancel, full Undo.
3. **Phase C (MC-015/016):** Sugar Rush (L8–12, ×2 for three chains) and the six-sticker book with badge,
   staged during a run, committed on win, toasts after the result.
4. Runtime assets copied to ASSETS.json destinations; engine tests and playtest updated; FB-003 report.

## Tonight (night 2) — H-001-v1 candy refinement (Match only)
Board note `math-crush-h001`: build the approved hand-over, Phase A then B, C if time allows.
1. **Phase A:** MC-001 new cream/plum/raspberry shell for Match: Home (Continue when saved), Candy trail
   level map 1→12, level Intro (thresholds, coach cards), Pause/Settings, Success, Retry, Loading/art-failure
   and save-error states; flowing phone-width layout (not the scaled stage) so targets stay ≥44px at 360×640
   and 150 % text scrolls. MC-002 gameplay feedback (live expression, sum, multiplier, missing/Release/Too high
   copy, fixed HUD), MC-003 chain multipliers, MC-006 score stars, MC-008 Undo + saved active attempt +
   candy-v2 score versioning beside legacy bests + accessibility.
2. **Phase B:** MC-004/005 striped and wrapped candies (earning, activation, closure, blast bonus, reward
   placement, gravity), engine tests against `mechanics-fixtures.json`, MC-009 evidence.
3. **Phase C (if A/B pass):** MC-007 optional speed bonus, off by default.
4. FB-001-candy-refinement.md completion report per MC-ID. Equation and Clear unchanged.

## Night 1 plan (history)
DESIGN.md phase 1, slightly stretched because the level data is ready to load:
1. Shared shell: mode picker → mode home → level grid → gameplay → pause (Resume / Restart / Levels with
   confirmation, Sound, Haptics, Help) → success / failure (Clear: Stuck).
2. All three core loops playable, exactly per the spec's rules and scoring, in their own themes using the
   designer's backgrounds and atlas sprites with live text.
3. Load all 12 authored levels per mode (36) as delivered; the game's own solver must agree with the witnesses.
4. Hints for all three modes, Undo for Clear, progress (unlocks + best stars) in localStorage.
5. Keyboard play for all three modes (studio contract), `window.__qa` covering all 36 levels.

## Assumptions (night 2)
- Match screens render in a normal scrolling page (max 480 px wide, centred on desktop) instead of the
  night-1 scaled 390×844 stage, because SCREENS.md requires 44 px targets at 360×640 and 150 % text. The
  mode picker, Equation and Clear keep the stage unchanged.
- Tap-to-select is a "Tap to select" switch in Settings (spec: tap/keyboard mode adds Submit); keyboard
  play turns the same Submit on automatically.
- Legacy (v1) Match stars and bests stay in their old fields, shown as "Legacy" on the intro card; v2 stars
  drive the level map. Unlocks are shared.

## Assumptions (night 1)
- One page, three modes; a small "Math Crush" mode picker sits in front of the spec's per-mode Home screens
  (the spec has no shared hub; DESIGN.md asks for one).
- Restart asks for confirmation only once the attempt has progress (spec: confirm; RULES/DESIGN.md: instant
  restart). Retry on result screens is instant.
- Tutorial is a coach line on level 1 of each mode plus "Help" in pause, not the full guided demo (phase 2).
- Match keyboard play doubles as the spec's tap-to-select mode: arrows move, Space adds/backtracks, Enter submits.

## Later
- (night 2) R2 level data, R3 fourth prototype: designer requests, unchanged.
- Guided tutorials (fixed demo board, Skip / Start level), Continue (saving an active attempt), corrupted-save
  message, screen reader announcements beyond labels, 150 % text pass, short-screen scrolling.
- Phase 3 polish and the spec's recovery and visual checks; playtest balancing of the starter data.

## Design
Rules, scoring and layout are the designer's (Studio-Handoff.md) and are implemented as written; this
section only records how the studio maps them onto the build.

### Core loop
- **Match** (Candy Forest): drag an orthogonal chain of 2–8 tiles whose sum is the target; release to
  clear; columns fall and refill. Make the quota of chains within the move limit.
- **Equation** (Jungle Temple): tap number tiles and reusable + − × into `a op b (op c)`; submit; × binds
  first. Three rounds per level, three wrong submissions allowed in total.
- **Clear** (Crystal Cavern): pick 2 (or 3) tiles anywhere that sum to the target and Clear them; holes stay.
  Empty the board. Wrong order can leave you Stuck — Undo is unlimited.

### The twist
The target number replaces colour-matching: every move is a small sum you have to see on the board.
Three variants of where the operators live (none / in your hand / implicit pairs) are the experiment.

### Controls
- Match: drag (touch or mouse); backtrack by re-entering the previous tile. Keyboard: arrows move a cursor,
  Space adds the tile (or backtracks), Enter submits, H hint.
- Equation: tap tiles/operators; Back, Clear, Submit. Keyboard: 1–6 tiles, + − * (or x) operators,
  Backspace back, Delete clear, Enter submit, H hint.
- Clear: tap to toggle selection, Clear button. Keyboard: arrows + Space, Enter clears, U undo, H hint.
- Everywhere: Esc pauses / goes back, Tab + Enter works on all buttons.

### Progression
Authored data from the designer: 12 levels per mode, unlock in order, replayable. Match 1–4 target 10,
5–8 target 12, 9–12 target 15. Equation 1–4 + and −, 5–8 ×, 9–12 mixed. Clear 1–4 pairs on 4×4,
5–8 pairs/triples on 4×3, 9–12 on 5×3 with target 12. Level 1 of each mode can't be failed by accident:
Match wrong sums cost a move but quota 3 / moves 5 leaves room, Equation allows 3 misses, Clear never fails.

### Win / lose / restart
Match: quota reached → win (checked before out-of-moves); moves at 0 → "Out of moves". Equation: round 3
solved → win; 0 attempts → "Out of attempts". Clear: empty board → win; no legal group → Stuck (Undo /
Restart / Levels). Retry is instant.

### Feel
1. Match trace: gold ring + ordinal badge + connecting stroke and a live "2 + 3 + 5 = 10 · Ready" plaque,
   rising tone per tile.
2. Clears: candy pop + gravity drop (180 ms), ice shards, stone plaque flash; reduced motion = 80 ms fade.
3. Success: atlas stars pop in with vector confetti.

### QA plan
- `levels()` = 36: 0–11 Match, 12–23 Equation, 24–35 Clear. `reset(n)` starts that level in play.
- `state()`: `{screen, mode, level, …}`; screen is `hub|home|levels|paused|playing|won|lost|stuck`.
- Actions: Match `{chain:[cellIdx…]}` or `"hint"`; Equation `"n0".."n5"`, `"+"`, `"-"`, `"*"`, `"back"`,
  `"clear"`, `"submit"`, `"hint"`; Clear `"t<i>"`, `"clear"`, `"undo"`, `"hint"`.
- `solve()`: Match simulates the seeded refills and plays the shortest legal chain each move; Equation
  enumerates the shortest solution per round; Clear runs the exact-cover search. `__qa.validate()` checks the
  game's evaluator against every designer witness.

### Night 2 design notes (Match, H-001-v1)
Rules, constants and screens are the designer's (HANDOVER.md MC-001–009, SCREENS.md); this records the mapping.
- **Core loop:** unchanged drag chain to the target; now longer chains pay more (×1.5 / ×2 / ×3) and chains of
  4+ (from level 4) leave a striped candy, 5+ (from level 7) a wrapped candy. Using a special in a later chain
  blasts its row / 3×3 for a separate +25 per extra candy.
- **Twist served:** the decision is now "short safe chain vs. long chain that pays and builds a special".
- **Controls:** drag; Settings → "Tap to select" (tap adjacent tiles, tap the last to step back, Submit);
  keyboard arrows/Space/Enter, U undo, H hint, Esc pause.
- **Win/lose:** quota before moves run out; Retry card offers Undo last move. Stars from score thresholds
  (200×/300× quota), shown on the intro and result. Undo/Hint mark the attempt Assisted, no star cap.
- **Juice tonight:** blast band preview while holding, reward badge preview, score popup split chain/blast.
- **QA plan:** `state()` adds `chainPts, blastPts, coreScore, specials[], undoCount, assisted, elapsedMs`;
  actions add `"undo"`; `__qa.fixtures()` runs mechanics-fixtures.json through the real `M.resolve` engine;
  `__qa.tick(ms)` advances speed-timer time deterministically; `__qa.threeStar(li)` searches for a no-speed
  3-star route with the real engine. `solve()` unchanged (shortest chains).

## Assumptions (night 3)
- Home **Play** opens the board of the highest unlocked level; the trail stays a secondary "Levels" button.
- L1/L2 lessons complete on any valid clear; L4/L7 lessons on activating a special; the cue only shows
  while the opening board is untouched (another route simply hides it). L8's Rush lesson completes when
  Rush first activates. L6's hammer cue appears after 8 active idle seconds while a charge is left.
- A free wrong sum (L1–3) is not an Undo step (nothing changed).
- Book opens as a dialog (from Home or Pause); Back returns to where it was opened. Time is paused while open.
- Speed challenge is offered on the win card and on Pause → no; only on results (never converts a running game).
