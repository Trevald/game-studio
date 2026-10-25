# H-002-v1 — Math Crush: play first, sweet rewards

25 October 2026. Implementation handover for the owner's requested iteration. Runtime: `games/math-crush/index.html` in Trevald/game-studio. Baseline inspected: 5dcac8e. Read this packet in place; no duplicate delivery folder. Working title Math Crush, Candy Match only. Final balance and shipped result require playtest and owner acceptance.

## Authority, scope and priority

Owner request in Codex chat `01a16481-97fa-7390-92c7-f627ee7ecc0a`, 25 October 2026: “Create the hand-over with all needed assets”, following the published Sweet play design review and explanation that a versioned implementation handover was the next step. This authorizes preparing/delivering this iteration. Numeric constants below are designer-selected prototype defaults, not a claim that the owner individually approved each constant. Publication to Trevald/game-studio main follows the owner's prior explicit “Push” and standing publishing preference. No external message or night-shift scheduling is claimed.

Included: MC-010–013, hammer subset of MC-014, MC-015–017 and MC-019. MC-018 and other tool/bonus concepts are explicitly excluded, documented in BACKLOG.md. This packet overrides H-001-v1 for the included behavior; it does not restore Equation/Clear or erase their saves. Preserve old packet unchanged. Rules here and SCREENS.md override illustrative screenshots and the historical exploration copy.

Implement in coherent phases; a phase is not complete until its acceptance checks pass:
1. **A — learn and succeed:** MC-010/011/017/019; level data, fair stars, immediate board entry/replay, optional time records and migrations.
2. **B — candy reactions:** MC-012/013 and hammer MC-014; existing special rules plus combinations and authored introduction.
3. **C — longer-term delight:** MC-015/016; move-based Rush and sticker collection. Preserve previous working behavior for unfinished phases, report deferred IDs. Never imply all phases shipped when only one did.

No new title/logo, expanded campaign, purchases, currency, energy, daily deadlines, accounts, analytics, network calls, compulsory countdown, leaderboard or character-shop subsystem. Existing painted art is included; new SVGs replace the exploration's Unicode icon placeholders. No runtime code changes are part of this delivery.

## Shared core contract (retained unless overridden below)

5×5, values 1–9, orthogonal chains of 2–8 distinct tiles; sum must equal target. Drag has immediate-tail backtrack, central 80% cell hit area, no diagonal/interpolation. Tap and keyboard selection have explicit Submit and cancel. One tile, backtrack to one and OS cancellation are free. Pause clears uncommitted selection. A wrong multi-tile release outside the board still follows the wrong-sum rule, except free introductory levels below.

Base chain points = floor((100+25×(n−2))×multiplier), multiplier 1/1.5/2/3 for n=2/3/4/5–8. Thus 100/187/300/525/600/675/750. Blast-only points =25 per unique removed tile not directly selected. Finish bonus=50×unused moves. Never multiply blast or finish points. Every valid chain consumes one move and advances quota once, regardless of blast size. Apply points, then success, then zero-moves failure. Seeded downward gravity preserves survivor order; refill uses existing mulberry32/draw order. Fresh special placement follows blast closure, then gravity. If no legal chain remains after normal refill, regenerate with the existing deterministic solvability repair and show “Board refreshed”; Undo restores the pre-action state. Do not make refill nondeterministic.

Hint/Undo remain free; no star cap or visible Assisted label. Track assistance metadata for optional record details. Unlimited full-model Undo before committed success, including from failure. No undo of an already-persisted winning result.

## MC-010 — On-board learning

Play/Continue/Next open the board directly. Remove introduction screens and all Got it/Skip gates. Target, quota, moves and score are enough to start. First encounter highlights the configured opening witness with the supplied hand/path cue and a short caption; another legal chain is always allowed. No forced gesture or hidden tutorial mode. A successful relevant action completes its lesson; persist lesson IDs separately from scoring and don't replay completed tips on retries. Hint remains available.

L1 “Connect these two”, witness 4+6. L2 “Try a longer chain”, witness 2+3+5. L4 “Light up a whole row” on the supplied initial stripe. L7 “Pop the candies around it” on initial wrapped. L6 “A little help?” by hammer only after inactivity; tool tutorial completes on confirmed use, not mere selection. L8 “Three moves of extra sweet” on first Rush activation. Only one cue visible, anchored away from the selected path. First required lesson appears immediately; if dismissed by action, subsequent optional hints wait 8 active idle seconds. Reset inactivity on input; pause/hidden/resolution don't count. Never focus-steal.

L1–3 wrong sums cost no move; show “Try again”. L4 onward costs one move and shows “Try again · 1 move used”. Do not add a lecture explaining the transition. Above-target live selection says “Too high · slide back”; tap mode says “Tap the last candy to adjust”. Reduced motion uses static path markers. At 150% text the caption wraps without covering the board.

## MC-011 — Levels, score stars and visible progress

Use `data/levels.json` schema 2 as the complete 12-level configuration; keep IDs/seeds unless this packet changes values. L1 top-left pair becomes 4,6; L2 starts 2,3,5. L3 is practice. L4/L7 seed an initial stripe/wrapped for guaranteed discovery. Remaining board values are retained. This is a bounded tutorial revision, not a claim to resolve the entire campaign repetition issue.

Each level provides explicit two/three-star thresholds. L1=300/400 (a clean three-pair solve earns three stars), L2=400/600, L3=450/750; remaining thresholds in JSON. Completion always earns one. Before completion, the completion star stays hollow; threshold marks may light to show score eligibility. Meter uses actual core score, including current chain/blast points; preview future finish bonus only if explicitly labelled. At success include finish bonus and award actual rating. Never display a guaranteed three-star outcome before completion.

The included validator found no-tool/no-speed baseline three-star routes for all 12 revised boards. This is a lower-bound witness search, not exhaustive maxima or child-tested balance. Implemented combos can change later boards; rerun the routes or discover replacement routes in the real new engine before claiming balance. Rush can only add points but still requires verification with the final mechanics. Keep data constants fixed unless reporting a failed witness and a proposed correction; no silent tuning.

## MC-012 — Special candies

L1–3 no earned specials. L4–6 chains of 4+ earn one stripe. L7–12 exactly four earns stripe; five to eight earns wrapped. Reward retains last selected tile's value, receives fresh ID and is placed after removal closure; then gravity. Never activated in its creation move. Winning moves only display reward badge, no refill. Initial specials in JSON are explicit exceptions to “earned only”, present on every replay independent of tip completion.

Stripe activates its full row; wrapped activates clipped 3×3. Activation requires a valid selected chain or another blast. A special number contributes only if directly selected. Preview selected numbers with solid connection/ordinal marks; blast-only cells get dashed halos and no added value. Each special fires once, union removes each tile once; process newly hit specials in row-major order.

## MC-013 — Combinations

When at least two specials are directly selected in the same valid chain, choose exactly one pair: wrapped+wrapped first, then stripe+wrapped, then stripe+stripe. Within a type choose the lexicographically earliest pair of selection positions. Both members are consumed by the combo and do not also emit their individual effect. Other existing specials hit by the resulting union activate individually, never form secondary combos.

- Stripe+stripe: union of both rows AND both columns through the pair.
- Stripe+wrapped: three full rows centred on the wrapped tile, clipped at board edge.
- Wrapped+wrapped: clipped 5×5 centred on the later-selected member of the chosen pair.

Compute on pre-gravity board, then closure of other specials; unique blast-only scoring remains 25. Fresh earned reward still created after closure. A chain summing above/below target activates nothing. Preview must exactly match the removal set. `data/mechanics-fixtures.json` contains exact combo removal/score examples.

## MC-014 — One level-granted hammer

Only hammer ships in this packet; L6–12 grant one per attempt, L1–5 zero. No inventory/shop. Select hammer → select target → highlight it with confirm “Smash candy” and Cancel. Confirm clears exactly that tile; no points, quota progress or ordinary move consumed; does not activate a special under it. Resolve gravity/refill with seeded RNG and repair solvability. Spend charge atomically with the model commit; disable confirmation while resolving. Cancel spends nothing. Restart resets configured charge; Undo restores tile, charge, counters and RNG. Tool use disqualifies Perfect Batch for that attempt even if undone (usage counter is monotonic, like hints/undos). Tool-using runs retain star eligibility.

## MC-015 — Sugar Rush

Enabled L8–12 only, starting charge from JSON (L8 starts at 2 to make the first activation visible within its four-chain level; L9–12 start at 0). A normal valid chain of 3+ adds one charge. At charge 3, reset charge to 0 and arm next three valid chains; triggering chain itself is normal. Active Rush doubles rounded chain points (3-candy=374), not blast/finish. Each valid chain spends one Rush use, regardless of length; cannot charge while active. Wrong sums, tool actions, cancelled gestures, pause, hints and time passing spend none. After third use, return to empty meter. No across-level carry; winning with uses remaining has no conversion bonus. Save/Undo restore charge and uses exactly. Keep one compact meter in a fixed slot; active state shows “Sugar Rush ×2” and remaining move pips. No flashing or countdown.

## MC-016 — Stickers

Six IDs/assets in `data/achievements.json`. Stage eligibility during a run; persist unlocks only when a win is atomically committed. Sweet Start requires L1 win; First Spark requires an activated special; Mix Master a selected-pair combo; Perfect Batch a win with toolsUsed=0 (hints/Undo allowed); Sugar Rush an activation; Lucky Seven a valid exactly-seven-tile chain. Undo restores staged event eligibility along with the board; tool usage counter remains monotonic. Failed/restarted attempts award nothing. Repeated wins cannot duplicate an unlock.

After result commit, show at most one small nonblocking toast (queue multiple, 3 seconds each; dismissible). No misleading “Added to book” mid-level. The exploration's mid-level toast is a visual reference only. Book shows earned/locked stickers, names and earning condition on selecting a locked item. Choosing earned sticker sets local personal badge. No currency, duplicates or daily requirements. Book back restores prior screen; if accessed midgame, pause active time and cancel selection.

## MC-017 — Results and optional speed challenge

Success: stars, score/best, Next and Play again. Next at L12 becomes Candy trail. Neither opens a briefing. Failure: “One more try?”, Retry primary, Undo secondary if available, Levels. Retry is immediate from results; active-game Restart uses existing confirmation. Never put Assisted on the win celebration.

Offer Try speed challenge only after that level has been completed. Normal play hides clock. Explicit new timed attempt uses same level contentVersion/seed/tool configuration; first deliberate board pointer-down or keyboard selection (including tool target selection) starts active elapsed time. Earlier pause/help/clock toggle does not. Exclude hidden document, pause, resolution, book and any blocking tutorial (none should normally exist). No wall-clock accrual on reopen. Undo never rewinds elapsed time. Record uses time to committed win, independent of score/stars; lower is better. Tie retains previous record. Hint/tool/Undo usage lives in optional details, no disqualification. No switching a running normal game to timed. Best-time key includes level ID and contentVersion; completion-unlock is retained from older versions. Preserve old timed SCORE as archive, never reinterpret it as elapsed time. Remove experimental speed-bonus toggle from settings for new attempts; old settings remain preserved as legacy data.

42s replaces 50s; 55s does not. First recorded finish says “First time”; later improvement says “Personal best”, new time and difference. Slower finish says “Your time” with best beneath. Failure never stores time. Timer must not affect stars, unlocks, bonus meter or move limits.

## MC-019 — State, accessibility and integration

One offline index.html, relative assets. Native controls, 44px minimum actions, visible keyboard focus, 360×640/390×844/1280×800 and 150% text; scroll instead of shrinking. Live numbers/text, no baked numerals. Reduced-motion animations ≤80ms fades, no flashes/loops; optional sound and haptics never the only feedback. Polite announce one committed result, not pointer frames. Help is optional and reached in Pause. Retain existing loading, asset-error, corrupt-save and blocked-storage recovery patterns.

Use `sweet-v1` content version and new `matchV3` record namespace; retain legacy match/matchV2 and removed-mode data verbatim. Preserve maximum unlocked level. Preserve any old active attempt as archived data and offer “Start this level” on the new rules; do not deserialize it as v3 or silently erase it. Fresh v3 records start empty, unlocks remain. New active snapshot includes entire board/IDs/specials/RNG, score components, quota/moves, Rush, hammer charges, pending stickers and undo stack; monotonic tool/hint/Undo counters and elapsed time must not rewind. Lesson completion and permanently earned stickers do not undo. Persist model before effects; make wins and unlock commits idempotent. Corrupt active v3 state offers fresh same-level attempt and preserves recoverable records. Blocked storage continues in memory with an unobtrusive notice.

## Build guidance and delivery

Current entry points: LEVELS, M.start/release/resolve/undo, renderMatch, renderHome/renderLevels, settings/result renderer, persistActive and __qa in the single runtime HTML. Refactor helpers where needed but preserve deterministic model/QA boundaries. Copy only runtime assets using ASSETS.json destinations. Do not copy the baseline-engine snapshot or exploration UI into runtime; no browser eval hook shipped just for the packet.

Read SCREENS.md for all affected states; use QA.md for coverage and feedback location. Start by verifying SHA256SUMS.txt. Report implementation per ID and phase in `design-studio/games/math-crush/feedback/FB-003-sweet-play.md`, including actual checks, screenshots, code commit and unresolved issues. Never edit this frozen packet to match an implementation deviation. The remaining backlog does not block included scope.
