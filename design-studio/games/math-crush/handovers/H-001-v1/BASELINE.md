# Mobile Math Puzzle Studio Handoff

Build three separate portrait mobile prototypes and compare their interaction quality. This package defines MVP behavior, authored starter levels, visual layouts, raster environments, and acceptance checks. Final prototype handoff • 19 October 2026.

The three experiences share navigation and accessibility conventions, but retain distinct core loops. The recommended implementation order is rules and validation, then touch interaction, then visual polish. All gameplay decisions below are normative for this prototype release.

Package guide: docs contains editable Word and Markdown specifications; designs contains 21 editable SVG screens and PNG previews plus an HTML gallery; assets contains the three painted PNG environments and three transparent sprite atlases containing 48 reusable regions; data contains 36 starter levels and their witnesses. README and asset inventory explain integration.

MVP: 12 levels per concept, local progress, tutorial, pause, retry, result screens, hints, sound and haptic toggles. No accounts, ads, purchases, lives, daily events, leaderboard or live service. No audio recordings are required: use optional synthesized interface tones.

Use the supplied raster materials for tile faces, plaques, buttons, medallions and reward stars. Keep numbers, labels, selection ordinals, paths and small effects as native text/vectors. This keeps arithmetic legible and permits localization. Screens supplied are design specifications, not executable games.

# Shared interaction and navigation

Home > level selection > tutorial on first play > gameplay > success or failure. Pause overlays gameplay and offers Resume, Restart, Levels, Sound and Haptics. Restart or Levels from an active run opens a confirmation: Restart this level? / Leave this level? Confirm discards current attempt; Cancel restores pause. Back from level selection returns Home. Back during gameplay pauses.

Home shows title, short mechanic description and Play. Play opens the level grid with the next unlocked level highlighted. A saved active attempt adds Continue, which resumes the last committed state. Levels unlock sequentially on success; unlocked levels remain replayable. Level 12 success replaces Next with Back to levels.

Tutorial uses a fixed demonstration board and one guided successful action, then Start level. Skip starts the same level immediately. Tutorial is replayable through a Help control on pause. Tutorial completion never awards score or unlocks a level.

Resolve the complete next stable board and counters, then persist them atomically before animation. Never save a half-collapsed board or empty refill slots. Disable input during resolve. OS interruption cancels an uncommitted gesture or expression and pauses. Save level ID, state, seed, refill index, score, round, hints and undo history after every committed move. On relaunch offer Continue. Never spend a move for an interrupted selection.

No timers in MVP. A tap requires release within the same hit area with travel under 10 logical points. Swipe starts after travel of 10 points; one pointer owns the gesture. Ignore additional pointers. Destructive actions require confirmation; arithmetic mistakes never open confirmations. Match invalid chains and Equation wrong submissions count as committed counter changes and must be saved.

# Match to Make Target rules

Objective: complete the level quota of successful chains before using all moves. A 5 by 5 board contains integers 1 through 9. The target stays fixed for the level. Touch a number and drag through orthogonally adjacent cells; diagonals are never adjacent. A chain uses 2 to 8 distinct tiles, and its sum must equal the target. Addition is automatic. There are no operator controls.

While dragging, show the ordered equation and running sum. Entering the immediately previous tile removes the last tile from the chain. Entering any other already selected tile is ignored. Nonadjacent entries are ignored; do not interpolate across skipped cells. A tile enters the chain only when the pointer enters its central 80 percent rectangle. Release anywhere evaluates the current chain; OS pointer cancellation clears it without evaluation.

A single-tile release or cancelled gesture clears the selection without cost. Releasing a chain of 2–8 tiles with the wrong sum consumes one move, restores all tiles and shows the evaluated sum. If moves reach zero, fail; otherwise return to play. Allow over-target selection and backtracking; do not auto-submit at the target. An exact release removes the selected tiles, awards score, consumes one move and advances the quota once.

Resolve order: lock input; commit removal, score and moves; test quota success first; if quota not met and moves are zero, fail; otherwise collapse columns downward, preserving surviving tile order, then refill empty cells from the top. Reveal a new board only after solvability validation. No automatic cascades or incidental matches.

Guarantee one legal chain after each refill. Search every start tile using depth-first search up to length 8 with positive-sum pruning. If none exists, rebuild the whole board using a seeded fresh draw and inject a guaranteed adjacent pair in row 1: a=max(1,target-9), b=target-a. Show Board refreshed. No move, score or hint penalty. This is a replacement board, not a shuffle of existing values. Entering a ninth distinct tile is ignored until the player backtracks; the chain stays capped at eight.

# Match progression scoring and feedback

Levels 1–4: target 10, quota 3, moves 5. Levels 5–8: target 12, quota 4, moves 6. Levels 9–12: target 15, quota 5, moves 7. Board stays 5 by 5; values remain 1–9. All levels permit chains of length 2–8. Difficulty tuning after playtests may change distributions without changing rules.

Each valid chain awards 100 + 25 × (tile count − 2). On success add 50 × unused moves. No streak multiplier. Wrong-sum chains award zero and spend one move; cancelled gestures and single-tile releases spend nothing. One star for completion; two for completion with at least one move left and no hints; three for completion with at least two moves left and no hints. Award the highest qualifying tier.

Hint highlights the shortest legal chain, with row-major lexicographic tie breaking. Hints are unlimited but mark the attempt assisted and cap it at one star. Hints do not consume moves or automatically clear tiles. No undo after a successful chain; backtracking before release is unlimited.

Trace feedback: colored tile with white outlined numeral, golden ring, ordinal badge and connecting stroke. Sum below target uses neutral copy; equal target displays Ready; above target displays Too high. Always include words and value, not color alone. Clear animation 180 ms, gravity 180 ms and refill 160 ms; reduced motion resolves with an 80 ms fade.

Future only: changing targets, multiplication tiles, obstacles, timed events and combos. Operator selection is explicitly outside this prototype. Acceptance example: adjacent 2,3,5 released in that order clears for target 10; 2,3 released restores both and consumes one move.

# Equation Builder rules

Objective: solve three authored rounds before making three wrong submissions in total. Each round offers six number tiles and three reusable operator buttons: +, − and ×. Tap tiles to fill an alternating expression of 2 or 3 operands. Number tiles are distinct by ID and may be used once per expression; duplicate values on separate tiles are valid. No adjacency requirement.

Start expects a number. After a number, expect an operator or allow Submit equation when at least two operands exist. After an operator, expect a number. After the third number, disable operators. No parentheses, unary signs, concatenation, division, exponentiation or implicit operations. Operators remain reusable, so 2+3+4 is valid.

Evaluate with standard precedence: multiplication before addition and subtraction; addition and subtraction left to right. Integers are exact; negative intermediate or final results are allowed, but authored targets are positive. Example: 2+3×4=14, not 20. Parse tokens; never use unrestricted eval.

Submit equation is enabled only for complete expressions with 2 or 3 operands. A correct result consumes the round, awards score and loads the next authored tray with a 350 ms success transition. After round 3, win. A wrong result loses one of three attempts, retains the expression for editing and shows the evaluated result. At zero attempts, fail. Incomplete input cannot spend an attempt.

Back removes the final token and releases its number tile if applicable. Clear removes all tokens. Tapping a used number is ignored; editing in the middle is not supported. A selected number dims in its tray and carries an ordinal badge. The target is never part of the expression. '=' is a label on the result display, not an input tile.

# Equation progression scoring and feedback

Levels 1–4 teach addition and subtraction, targets 5–12; all three operators remain available so solutions are not arbitrarily rejected. Levels 5–8 demonstrate multiplication, targets 12–24. Levels 9–12 teach mixed expressions, targets 14–30. Each level has three deterministic trays with a stored witness. Starter data uses representative targets within each band.

Accept every syntactically valid expression that equals the target, regardless of the stored witness or operand count. Never require a particular intended solution. Before shipping a tray enumerate ordered permutations of 2 and 3 distinct tile IDs and all operator combinations; at least one solution must exist.

Each solved round earns 200 points. On level success add 100 × attempts remaining. One star for completion; two for completion with two attempts remaining and no hints; three for completion with all three attempts remaining and no hints. Hints cap the attempt at one star.

Hint clears the partial expression and demonstrates one full valid expression in a temporary strip. It does not auto-submit, spend attempts or solve the round. Choose the shortest witness with a stable tile-ID/operator ordering. Allow unlimited hints; prompt no confirmation because editing is reversible.

Use warm sandstone tiles, wood-and-parchment action buttons and amber selection rings. Keep tray digits and operators live text. Provide a small persistent note: × before + and −. Error copy example: This makes 17. Try for 14. Do not shake the whole screen. Future only: division with explicit rational rules, parentheses, longer expressions, limited operator inventories and refill boards.

# Clear the Board rules

Objective: remove every tile from a finite board. Select any 2 or 3 distinct remaining tiles whose sum equals the fixed target, then tap Clear. Tiles need not be adjacent. Levels 1–4 allow pairs only; levels 5–12 allow pairs or triples. A group cannot contain one tile even if its value equals the target.

Tap a tile to toggle selection. At the selection cap, additional tile taps are ignored with Choose at most 2 or Choose at most 3. Show selected count, running sum and target continuously. Clear is enabled only for a legal cardinality and exact sum. There are no wrong-submission attempts and no move limit.

A valid Clear removes selected tiles and leaves holes in their original grid cells. There is no gravity, rearrangement, spawn or refill. Selected count returns to zero. An empty board wins immediately. Otherwise enumerate all remaining legal groups; if none exists, show the Stuck overlay with Undo, Restart and Levels.

Undo restores the last removed group to its exact IDs and positions and subtracts its score. Unlimited undo is available during play and from Stuck. Each undo increments the assistance count; restarting resets assistance. Hint clears selection and highlights a group that belongs to a complete solution of the remaining board.

If legal groups remain but the board has no complete partition, allow continued play; a hint instead says This position cannot be cleared. Undo a move. Do not automatically undo or replace tiles. This distinction preserves the finite-board puzzle and avoids promising a winning hint in an unsolvable state.

Use exact-cover search over legal pairs/triples to find full partitions. Memoize by remaining tile-ID bitmask, choose the lowest remaining ID, and try groups containing it in lexicographic order. With at most 16 tiles this is bounded for the prototype. On success, Hint returns the first group of that solution.

# Clear progression scoring and recovery

Levels 1–4 use a 4 by 4 board, 16 tiles, target 10 and pairs only. Levels 5–8 use 12 tiles in a 4 by 3 board, target 10 and pairs or triples. Levels 9–12 use 15 tiles in a 5 by 3 board, target 12 and pairs or triples. Every authored board has a complete partition stored in the starter data.

Score 50 points per tile removed, independent of grouping. Completion bonus is 200. Undo subtracts exactly the points previously earned for the restored group. This prevents score farming. There is no scoring penalty for selection changes. Three stars for completion with no hints or undo; two with one assistance action; one with two or more. Every Hint tap counts once, even when it returns the unsolvable-position message.

Pairs-only boards that are authored as complementary pairs cannot become stuck through valid pairing; they teach interaction rather than strategy. Mixed pair/triple boards introduce meaningful wrong choices. Example target 10: [1,2,3,4,4,6] can clear as [1,3,6] and [2,4,4]. Taking [4,6] first leaves [1,2,3,4], with no legal group. Undo restores the board.

Ice tiles use pale blue faces, deep navy numerals and cyan rims. Selection uses both a thick outline and ordinal badge. Removed spaces retain a subtle recessed cell. Clear emits vector ice shards and a short dissolve; no raster effects or sprite sheets are needed.

Future only: spatial adjacency constraints, locked tiles, limited undo, challenge seeds and larger boards. Do not introduce a move counter or failure for a merely incorrect sum. Stuck is a recoverable state, not a permanent loss.

# Screen layout and visual system

Use the supplied concept drawing as the art-direction reference: dimensional multicolored candy tiles, carved jungle stone and a luminous ice world. The revised screens restore compact HUDs, visible environments, beveled surfaces, gold highlights and strong star rewards. Use the reference for appearance; the gameplay rules in this document control behavior. Reference multiplication in Match, refill in Clear and Equation parentheses are not MVP features.

Canvas is 390 × 844 logical points with 44 top and 34 bottom safe-area reserves. All content reflows within the actual device safe area. Core grid uses at least 44-point hit targets. On short screens scroll the game content below the HUD; on narrow screens reduce gaps and frame padding. Layout is portrait only. At 320 points, a five-column grid fits five 48-point tiles with four 6-point gaps and 28-point side margins.

Typography uses a rounded system sans with Arial fallback. White candy digits use a dark outline; stone and ice digits use dark blue. Tile numerals 29/34 bold, target numeral 46/52 bold, HUD labels 12/16, controls 19/24 bold, helper copy 16/22. Support 150 percent text through wrapping and scrolling; do not shrink tap areas. No numbers or game labels are baked into raster assets.

Candy uses caramel frames, gold trim, pink #FF42AC, blue #2777EE, orange #FF961C, violet #7147DB and green #65C748 tiles. Jungle uses sandstone #E8DBBC, timber #352A17, emerald #18985B and golden highlights. Ice uses #80DAFA, #A4EAFF, #BDB1FF and #F1B3ED tile faces with navy #164D92 numerals, cyan highlights and violet #8054EC actions.

Each tile has an inset highlight, 4-point lower shadow, rounded bevel and 1.5-point rim. Selection adds a 4-point warm gold outline, glow and ordinal badge; the trace line is visual only. Invalid selection adds Too high or Try again text, never color alone. Tile color is decorative and never determines arithmetic. Star, tile and button materials come from the PNG atlases; glints, paths and all text remain editable.

The full-screen environment stays behind every screen. Composite atlas tile faces over the dark board well, then live digits and selection rings. No separate board-frame asset is required. The opaque HUD plaques protect text contrast. Reduce glow, scaling and star bursts in reduced-motion mode.

# Annotated screen specifications

The 21 SVG screens and their 2× PNG previews specify the revised visual direction. Gameplay previews show a valid active selection rather than an empty idle state. Annotated gameplay sheets mark the HUD, board and actions; runtime data replaces sample values. All coordinates below use the 390 × 844 logical canvas.

01 Home: world label centered at y=130; two-line title at y=186 and 230; tile vignette at (27,272,336,336); mechanic subtitle y=630; Play at (66,674,258,52). When a save exists, show Continue at y=674 and move Play to y=738. Continue resumes the last committed state. Preserve visible scenery around the vignette.

02 Levels: Back at (20,58,75,44), carved heading at (105,60,265,50). Twelve 58-point nodes in three columns centered x=74,194,314, with rows y=195,339,483,627. A dotted route joins the nodes. Display Locked or best stars below. Only unlocked nodes accept input; announce the unlock requirement for locked nodes.

03 Tutorial: use the gameplay layout with a valid example selection. Match highlights 2,3,5; Equation shows 2×3×4=24; Clear shows 1+9=10. Coach overlay (16,705,358,111), instruction y=733 and Start level at (55,750,280,48). Skip at (296,53,74,44). Production starts with an unselected board, guides the action, then reveals Start level after completion. The supplied screenshot represents the demonstration/completion view.

04 Gameplay HUD: pause circle centered (43,75), level y=77, central target plaque (99,103,192,103), side plaques (15,125,76,73) and (299,125,76,73). Match shows Moves and Score; Equation shows Round and Attempts; Clear shows Tiles remaining and Score. A three-star rating preview sits at y=224. Hollow stars indicate rating not yet earned; fill only on completion.

04 Gameplay board: board well (26,266,338,342). Match uses five columns of 56-point tiles with 8-point gaps, origin (39,278). Clear uses four columns of 70-point tiles with 8-point gaps, origin (43,280); later 5-column boards use the Match dimensions. Equation shows an expression plaque (42,271,306,61), six 89×74 number tiles in 3×2 at (52,350), column pitch 98, row pitch 85; three 89×68 operator tiles begin at y=523.

04 Actions: Match sum plaque (54,641,282,55), quota/release instruction y=724 and Hint centered (195,766). Equation precedence note y=643, Back/Clear at y=663, Hint centered (50,761) and Submit equation at (100,735,265,58). Clear sum plaque matches Match; Hint at (49,761), Undo at (341,761), Clear pair at (99,735,192,58). Use Clear group when triples unlock. Idle Submit/Clear and unavailable Undo have disabled styling and semantics; valid-selection previews show them enabled.

05 Pause: dark scrim over gameplay, textured modal (31,249,328,408), heading y=314. Resume, Restart and Levels at y=324,390,456. Sound/Haptics at y=551, Help at y=581. Make each toggle a separate 44-point target. Confirmation dialogs reuse this modal shell with an explicit question and Confirm/Cancel actions.

06 Success: same modal shell, heading y=314, three gold stars around y=353–369, score y=479, Next level y=516 and Levels y=584. At level 12 replace Next level with Back to levels. 07 Failure: cause-specific title, recovery copy y=348, Retry or Undo y=394, Levels or Restart y=464; Clear also includes Levels y=534. Clear uses Stuck, never a punitive loss. All modal actions restore sensible focus.

# Motion accessibility and implementation

Use 60 fps targets with 100 ms maximum input-to-feedback budget on representative devices. Tile press scales to 0.96 over 70 ms, releases over 90 ms. Modal fades 150 ms. Success uses vector stars/confetti for 600 ms and skippable reveal; buttons become usable after 200 ms. Reduced motion removes travel, scale and confetti. Never lock input longer than required to commit and resolve.

Provide tap-to-select accessibility mode for Match: tap adjacent tiles to append, tap previous tile to backtrack, and use an explicit Submit button at (99,735,192,58), moving Hint to (49,761). Use the same validation as drag release. Screen reader labels include row, column, value and selection ordinal. Announce running sum after selection without interrupting every animation.

Equation reads expression tokens in order; every used tile announces Used. Ice announces remaining count after Clear and Undo. Modals move focus to heading and restore it to triggering control on close. Haptics and sound default to device preference and remain independently switchable. No audio-only instructions.

Model each game independently: Idle > Selecting > Resolving > Idle or Result. Equation adds AwaitingNumber/AwaitingOperator; Clear adds Stuck. Derive UI from model, never from animation completion callbacks. Protect commits using a move sequence number to prevent duplicate taps and double scoring.

Persist schemaVersion=1 and concept/level IDs. Match stores board IDs, RNG state, refill count and move counters; Equation stores round and attempts with the round tray; Clear stores removed-group stack. Save only committed model state. Corrupt or incompatible saves fall back to level start with a clear message and preserve unlocked progress.

Raster environments are opaque sRGB PNGs; sprite atlases are RGBA PNGs with transparent padding. Preserve alpha and avoid dark fringes. Read actual dimensions from asset inventory. Use linear filtering, clamp wrapping and background-only cover cropping. Keep vector UI sharp at native resolution. Load only the active concept background; one 1024×1536 RGBA decode costs approximately 6 MiB. Downscale copies at build time for lower memory devices; retain the supplied master PNGs. Use the accompanying atlas JSON source rectangles with top-left pixel origin. Render native labels above sprites. Keep icon art uniform; plaques may be stretched as shown, or split at quiet interior regions for nine-slicing. Do not stretch decorative corners independently.

# Build acceptance and delivery checklist

Rules checks: Match rejects diagonal jumps and repeated non-tail tiles, supports immediate backtracking, accepts exact sums only on release, validates new boards and prioritizes success on the last move. Wrong-sum chains spend one move; single-tile releases and cancellations spend none. Equation computes 2+3×4 as 14, supports repeated values on separate IDs, rejects incomplete submission and accepts alternate solutions. Clear leaves holes, checks zero tiles before Stuck, restores IDs on Undo and never spawns.

Recovery checks: pause during each interaction; background and restore during animation; tap Submit equation twice rapidly; interrupt a swipe; restart at each result state. Counters and score must change once only. Test no-solution refill replacement, corrupted saves, hint on an unsolvable ice position and success on the final move or final attempt.

Visual checks: verify 320-point and 430-point widths, tall and short safe areas, 150 percent text, all three palettes, screen reader order, reduced motion and color-independent selection. No text may overlap artwork or depend on rasterized digits. Check all seven screens per concept plus locked levels, confirmations and settings states.

Starter data validation is delivered in data/validation-report.txt. It checks board dimensions, Match legal paths, equation witnesses using exact integer precedence, and full coverage of every Ice partition. The supplied sample data is implementation seed content, not playtest-balanced content. Studio must run runtime checks above after implementation.

Playtest separately with at least five participants per concept. Observe first unaided legal move, misunderstanding of operators or adjacency, accidental selection rate, level completion, hint use and willingness to retry. Ask which mechanic they would play again before comparing visual preferences. Collect only consented anonymous session metrics.

Deliverable acceptance: 36 loadable levels; each round or board has a validated solution; local save recovery works; all seven revised screen families are implemented; every required raster reference resolves from inventory; no future mechanics appear in MVP. A studio implementation and device testing are the next phase, outside this design package.

# Asset contract and source precedence

The approved rendered proof in reference/approved-art-direction.png governs mood, material richness and environment. The final SVG layouts govern implementable geometry and editable labels. The rules in this document govern behavior. The proof is not a layered runtime screen; its sample numbers and decorative star states are not level logic. The final atlas art is a coordinated redraw, not an extraction of layers from the proof.

Three environment PNGs and three transparent PNG atlases supply all required bitmap materials for the MVP. Each atlas has 16 named regions: six blank tile faces, HUD plaque, primary button, Hint, Undo, reward star, selection glow, modal, calculation badge, check and back medallions. Runtime regions are defined in assets/*-atlas.json; the full PNG is the source of truth. No external art download is needed.

Screen SVGs embed their raster sources and preserve live labels and shapes. PNG previews are 780×1688; annotated gameplay sheets use the 390×844 logical coordinate system. All seven states are provided per concept. The Equation tray in visual examples is a demonstration of target 24, not the first starter level; runtime always reads the level data.

Import atlas textures as sRGB with alpha, linear filtering and clamp wrapping. Do not enable rotation when repacking. Add 2–4 pixels of extruded padding if repacking; avoid neighboring sprite bleed and test glow edges on both dark and light surfaces. Read actual master dimensions from inventory.json. Keep one active theme resident. Build pressed state with 0.96 scale, disabled with reduced saturation/opacity plus disabled semantics, selected with native gold ring and ordinal. The extra glow region is optional decoration.

Fonts use a locally available rounded system sans or Arial fallback; no font binaries or commercial font license are included. Runtime UI text remains localizable. No custom recorded audio is required. Raster PNGs and editable layout SVGs are prototype-ready assets; device performance, font metrics and gameplay tuning still require studio validation.