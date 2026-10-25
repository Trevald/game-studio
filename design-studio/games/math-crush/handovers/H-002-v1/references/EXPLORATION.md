# Sweet play v1 — Math Crush design exploration

State: **draft for visual/mechanical review, not an approved implementation handover**. Created 22 October 2026 on main, based on runtime commit b3bab94. Open `index.html` via a local HTTP server. All art dependencies are in `assets/`; no network libraries or fonts. Seven interactive scenes plus special-candy, combination and tool galleries. Working title remains Math Crush: Prime Pop and Sweet Pie are naming candidates, not approved names.

## Direction and authority

Owner, Codex chat `01a16481-97fa-7390-92c7-f627ee7ecc0a`, 22 October 2026:
- “I don't think the instructions are neccessary. Better to just start play and learn. Or these tips could be added in game on the first levels in a turorial kind of style”
- “Create some designs for the changes we discussed. Tips, special blocks and everything else”

These authorize this design exploration and establish the learn-through-play direction. They do not approve every mechanic or balance constant below. Earlier conversation requests achievements, power-ups, temporary bonuses and more special blocks; speed should remain attractive to players chasing records without making stars difficult. Child-friendly candy play is the audience for this exploration, overriding the generic adult audience in studio/RULES.md for this game. Specific age and reading level remain unconfirmed. Assume short portrait phone sessions, with responsive desktop support.

Match-only is already the owner-directed runtime scope per ../../feedback/FB-002-match-only.md. Do not restore the removed mode selector. H-001-v1 remains frozen; this draft does not modify its implementation contract.

## Evidence and known problem

Current runtime: `games/math-crush/index.html` at b3bab94. Observed playtest: `games/math-crush/qa/playtest-2026-10-22.md`. Current scoring has optional/off-by-default speed, excluded from stars, and Hint/Undo mark a run Assisted. The opening walkthrough demonstrates pairs despite star thresholds rewarding long chains. In the observed playtest L1 earned 400 and L2 574, both one star.

The separate studio report ../../feedback/FB-001-candy-refinement.md reports exhaustive L2 search: maximum 687 versus a 900-point three-star threshold. This is reported prior evidence, not a new exhaustive test performed during this design session. Correcting this is a balance dependency before claiming fair stars; added effects do not fix it.

## Visual system

Retain painted candy forest, atlas candies, plum #4A1736, cream #FFF3DD, raspberry #C81758 and gold highlights. The board is the main object; surrounding chrome is quieter. Real numbers remain readable on every special. Use stripe, ribbon, bubbles, shell cracks and matching link marks, not color alone. Keep special decoration behind the number; reserve small corners for charge indicators. No new brand lockup until a name is selected.

The study's external scene tabs, design notes and Reset demo are review controls, not intended game UI. The preview uses live HTML/CSS and repository art. It is a state/interaction demonstrator, not the game engine: boards do not refill, scores are illustrative, only the shown special/tool interactions run, speed is a layout preview, and demo reset is not production Undo. Catalog items are visual specifications rather than usable game buttons. The result's 1,240 and 0:42 are clearly illustrative sample data, not measured playtest results.

## Proposed requirements and acceptance examples

### MC-010 — Play first; contextual learning

Home Play/Continue and result Next go directly to a board. Remove routine pre-level briefings. Stable HUD: moves, target, score, objective progress. First-level board starts with a guaranteed visible 4 + 6 pair. Initial prompt “Connect these two” appears on board, with highlight/path cue; no modal and no acknowledgement button. A correct action removes the cue and says “Sweet!” New mechanics get at most one short prompt where they occur, not a paragraph before the level. Offer help in Pause for readers who want it.

First 3 levels: invalid sums reset selection without consuming a move; success conditions remain. From L4, retain ordinary invalid-release cost, introduced by a one-time contextual “Try again · 1 move used” response rather than a pre-game rules screen. This transition needs child playtesting. All one-tile selections, OS cancellations and backtracks to one remain free. Never force the highlighted route; another valid route dismisses the nudge. Tutorial persistence is marked on the relevant successful action, so replay does not show a completed lesson again. Before success, an inactivity cue may reappear after 8 active seconds. Pause, animation and hidden time do not count.

Acceptance: Play reaches a usable board without any intervening instructions; wrong first-level attempt consumes zero moves; another correct route advances progress; replay after completing the lesson shows no tutorial. Keyboard/tap receives the same lesson without requiring a drag gesture. Touch path cues have static equivalents for reduced motion.

### MC-011 — Introduce longer chains and readable star progress

L1 teaches connection with a generous completion reward. L2 visibly sets up 2 + 3 + 5 = 10. Replace formula exposition with a larger clear reaction and a compact point pop. Show a score meter with two/three-star threshold marks, filling progressively; completion guarantees the first star. Do not light the completion star before the objective is met. The exploratory UI approximates score progress with sample values; production must use the level's actual thresholds.

Tune stars per authored level, not a universal quota formula. For existing L2, proposed temporary thresholds are 400/650 instead of 600/900; 650 is below the studio-reported maximum 687 but remains a draft, pending rerun against the current engine. Redesign first 3 starter boards around lessons rather than simply repeating target/quota. Preserve legacy results separately under a scoring revision; do not silently compare old and new records.

Acceptance: each level has an engine-verified attainable three-star route without speed or consumables; visible score meter equals final star calculation; hints can demonstrate a longer chain once basic pairing is learned. Verify a reasonable ordinary child route as well as theoretical attainability before final tuning.

### MC-012 — Two familiar specials, introduced through action

Retain existing stripe/wrapped rules as the baseline: four selected candies earn a stripe; five or more earn wrapped once unlocked; one fresh reward maximum per move, created after blast resolution, carrying the last selected cell's number and subject to gravity. Reward never explodes in the same turn it is made. Stripe clears its row; wrapped clears a clipped 3×3 square. Quota increments once per valid chain, independent of blast size. Special is activated by a valid chain or blast, never a wrong sum. Blast-only digits do not enter the equation.

Introduce stripe around L4 and wrapped around L7, with deliberately authored easy creation and activation opportunities. On first appearance, a short prompt says “Light up a whole row” or “Pop the candies around it.” Preview impact while selecting; no blocking coach card. Winning-move rewards celebrate without leaving an unusable special behind.

Acceptance: a chain containing a striped 4 plus ordinary 6 is valid and previews the entire stripe row; selecting only the 4 never activates it. An edge bonbon clips safely. Undo restores all affected tiles and generated reward exactly.

### MC-013 — Special combinations

Trigger a combo when two specials are directly selected in the same valid chain. Proposed effects:
- stripe + stripe: union of rows and columns through both specials;
- stripe + wrapped: three complete rows centred on wrapped;
- wrapped + wrapped: clipped 5×5 square centred on the last selected wrapped candy.

If more than two are selected, only one combo triggers: choose wrapped+wrapped, then stripe+wrapped, then stripe+stripe; ties resolve by selection order. Other specials activate individually. Compute union on the pre-gravity board, fire each special once, and score each blast-only candy once under existing blast scoring. No recursive combos for two specials merely struck by an explosion. New reward creation remains after closure. Show the same union in the pre-release preview. Invalid chains never trigger a combo.

Acceptance: overlapping stripes do not double-count; 5×5 burst at a corner clips; a chain summing 11 with a stripe and wrapped does nothing except ordinary invalid-release handling; Undo is deterministic. Prototype galleries illustrate combos; the study only demonstrates the single-row stripe interaction.

### MC-014 — Power-ups granted by the level

No currency, inventory shop, ads, energy, purchase prompts or scarcity economy. Level configuration grants a fixed tool and charge count; restart restores the configured starting loadout. First release: one hammer on selected levels. Tool selection → target preview → confirm/cancel. Hammer clears one tile without advancing quota or consuming a normal move; no score, no special activation on tool-cleared tiles. Resolve gravity/refill and validate solvability. Undo restores the charge and board. Tool-assisted runs retain stars.

Secondary proposed tools: Swap exchanges two tile objects including specials; Shuffle reorders existing tile objects and preserves all specials; both consume one charge, no normal move, no score and no quota. Shuffle must produce a solvable board or cancel without charging. Cherry on Top adds 1 to a numbered tile (max 9, so a 9 is disabled); preserves its special. Licorice Split remains unscoped because a full 5×5 board has no empty destination: do not implement until placement/displacement rules are designed.

Acceptance: cancel loses nothing; unavailable targets cannot confirm; one charge cannot be spent twice during animation; Undo restores exact RNG and charge; hammer on a bonbon does not explode it. The study implements a target-and-confirm visual hammer demonstration; Swap is an explanatory preview only.

### MC-015 — Sugar Rush, a move-based bonus

Recommended first bonus: valid chains of 3+ fill one pip of a three-pip meter. Three filled pips grant double chain points for the next three valid chains. The triggering chain is not doubled. During Rush, do not refill the meter; at expiry reset it to empty. Bonus never doubles blast/finish points, never creates extra quota credit and never expires with time. Invalid attempts do not spend Rush charges. Undo restores all bonus state. Pause and reopen preserve it. Reduced motion changes the effect, not the reward.

Acceptance: three qualifying normal chains arm Rush; the next valid two-candy chain gets 200 chain points and consumes one charge; wrong sums, reading, pause and tool use consume none; last of three charges returns to normal state. To avoid conflicting score targets, introduce after the authored tutorial sequence and validate stars with the enabled mechanic set. No mandatory streak to retain benefits.

Later alternatives, not simultaneous first-release systems: Golden Batch gives three gold-ring candies for three valid moves, +25 each when cleared once (including blasts); Rainbow Round grants one wildcard after a combo; Sweet Streak can be a purely visual celebration without loss punishment. Mystery Sweet should disclose its possible effects in optional help and never introduce a harmful surprise. These are backlog concepts needing separate tuning, not hidden requirements.

### MC-016 — Achievement sticker book

Six initial stickers: Sweet Start (finish first level), First Spark (activate first special), Mix Master (first combo), Perfect Batch (finish without a tool; hints/Undo allowed), Sugar Rush (first activation), Lucky Seven (valid chain containing exactly seven candies). Distinct geometric sticker marks and names; locked stickers show the earning condition when selected. Earned stickers can be chosen as a personal badge. Achievements are permanent once a level's result is committed; queue one small post-action toast, persist unlock once, and do not steal input focus. First-launch lesson may show a provisional celebration, but achievement commit follows the level result. No duplicates or daily streak deadlines.

Acceptance: repeat achievement does not duplicate unlock or toast; restarting mid-level does not keep provisional unlocks; blocked storage works in-session; choosing a badge has no gameplay effect. Optional character/candy-shop decoration remains a future cosmetic extension, earned directly with achievements rather than currency.

### MC-017 — Results, replay and independent speed records

Celebrate completion, star rating and best score; primary Next level, secondary Play again. Both go straight to the board. Remove Assisted from the celebration; if needed, retain assistance metadata only in optional record details. Keep accessible Undo during an attempt including failure; no undo after committed success. Failure gives instant retry and an Undo option, without an interstitial lesson.

Normal play hides the clock. Offer a separate optional speed challenge after completion. Count active time from first deliberate board input (including beginning a selection, to avoid free planning before first commit), stopping on win; exclude pause, hidden page, tutorial, resolution and results. New challenge runs use the same seed/mechanic/tool configuration to compare fairly. Keep a per-level best elapsed time separately from best score. Hints and Undo are permitted; record details carry their usage so comparisons can be contextualized without shaming. No leaderboard in this scope. A first record says “First time”; later improvements show previous/new times. No time target gates stars or unlocks. Existing speed-bonus score records stay archived and labelled rather than reinterpreted as times.

Acceptance: 42s win updates a previous 50s time to 42s, independently of score; 55s does not replace it; pause adds zero; toggling speed cannot convert a mid-run untimed attempt into a record; replay begins immediately. The design study's timer does not run and its sample 0:42 is illustrative.

### MC-018 — Later candy family

Exploratory assets/ideas only, behind the first-release scope:
- Rainbow Drop: exactly one wildcard in a chain, resolved to target minus ordinary values if in 1–9. Requires at least one numbered tile. Below/above range invalid; never silently adjust another number.
- Fizz: three charges from separate adjacent valid chain clears (orthogonal adjacency, one per move); on third, clears its row and column. No charging from its own blast.
- Caramel: a two-hit shell around a usable numbered candy; qualifying chain inclusion or blast removes one layer per resolution. Needs a separate collectible/shell objective if retained shell inclusion also counts toward chains. This objective interaction is open, blocking implementation of caramel.
- Gummy Twins: matching loop marks identify the linked pair. Valid direct activation clears partner as blast-only; partner's number is excluded unless directly selected. Needs explicit generation and orphan rules before implementation.

No new random blocker should leave the board without a legal action. Model fixtures and solvability checks are prerequisites to adding any of these.

### MC-019 — Accessibility, persistence and presentation

390×844 and 360×640 phone layouts plus desktop; actions remain reachable through ordinary page scrolling rather than shrinking targets. Minimum 44px actionable targets, numbers readable at 150% text, safe areas and visible keyboard focus. Native interactive controls, short polite announcements on commit, no per-frame speech. Color-independent marks for selection, specials and charges. Sound/haptics optional. Reduced motion uses brief static emphasis/fades, no continuous flashing. Keep pause available while learning; OS interruption cancels uncommitted input.

Production Undo restores board, special/bonus/tool state, scores and RNG together; elapsed record time does not rewind. Atomic committed-state persistence before animation, idempotent win/unlock writes, migration preserves old records. Loading/error/pause/recovery views retain existing patterns, with no new pre-play instruction screens. Offline is the default; no accounts or new analytics in scope. Localized prompts must fit at 150% text; exact English copy here is provisional.

## Scope and recommendation

1. Foundation: MC-010/011/017 and prerequisite balance correction. Learn by doing, visible progress, immediate replay, separated records.
2. First delight release: MC-012/013, hammer subset of MC-014, MC-015 and MC-016. Introduce progressively, with one new concept per level.
3. Later experiments: additional tools, MC-018, Golden Batch/Rainbow Round/Mystery Sweet, companion and decoration. Test one at a time.

Simpler alternative: ship only foundation plus existing stripe/wrapped combinations. This is the smallest coherent improvement if the bonus meter and collection distract from arithmetic. Recommendation: foundation first, then add the small first-delight set after playtesting. No production mechanics, new campaign, renamed brand, or implementation dispatch are included in this design commit.

## Validation and remaining decisions

See VALIDATION.md for checks actually performed on this study. This is not child-tested, fully balanced, a production asset export, or an approved handover. Before implementation: agree the first-release scope, author and validate starter boards, rerun L2 maximum-score check, settle score thresholds with the chosen bonuses, and create a new versioned handover. Caramel, twins and Licorice Split are deliberately not implementation-ready.
