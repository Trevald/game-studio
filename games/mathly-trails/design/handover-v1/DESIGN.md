# Mathly — development handover
Version 1.1 · 19 October 2026 · Card Table direction

**Status: build-ready visual and interaction specification, with explicit proposed game rules.** The owner has selected the name and visual direction, not approved every rule below. Implement proposed rules behind versioned configuration; resolve the Open table before release. All mockups are labelled SPEC for this proposed implementation, not evidence of owner approval.

## 1. Evidence and decision register

Read the full accessible ten-turn history of “Create Mathly Concept” (conversation 6ad64b6a-aa90-83ed-8ad8-bf960c54e589) and inspected both recovered screenshots, included in references/. The empty screenshot shows target 26; numbers 2,3,3,3,4; +,−,×,÷,!, (,); and an empty insertion slot. The partial screenshot shows 2+3=5, three remaining cards 3,3,4, and the same palette. Screenshots establish visible UI, not the complete rule engine. Both original URLs were attempted on 19 October 2026 but the page reader could not access them. No claim of playing or reverse-engineering the original is made.

### Decided — explicit owner requirements

- Name is **Mathly**, with no subtitle. Green felt table, tactile cream cards. Simple collections; no illustrated world map needed.
- Exactly five starting number cards. Construct and freely rearrange an expression by drag and drop. Unlimited reusable operators and parentheses; never merge cards into a new number.
- Always-visible live result. Compact, non-scrolling default phone play. Easier play always remains available; increasing difficulty never strands a player.
- Shared daily challenge. One-time full unlock supported. No ads, currencies, energy or pressure timers. Undo and instant restart remain available.
- Primary interactions accessible by touch and keyboard. Minimum 44 CSS px/dp hit areas.
- Correct example: **5+(4×3)−3÷2=15.5**. It does not make 26. A separate valid source-board example is **(4+3)×3+3+2=26**.

### Proposed defaults — explicit design decisions, not historical facts

- Use all five cards exactly once to solve; reusable + − × ÷ and parentheses. Each repeated value has its own ID.
- Standard arithmetic precedence, rational intermediate values including zero and negatives; no implicit multiplication, concatenation, unary minus, exponentiation or factorial in proposed v1.
- Automatically recognise completion, no Submit. One completion checkmark, with an optional “With hint” annotation. No stars or hint penalty.
- Four collections: Starter, Multiplication, Division, Mastery. Same felt throughout. Collections represent increasing difficulty; no separate Easy/Medium/Hard toggle.
- Starter and today's daily are free. Full unlock grants every collection and unlimited practice at every difficulty immediately. No skill gates on paid content. Starter practice remains unlimited for everyone.
- Daily rollover at 00:00 UTC, not each player's local midnight. No streak pressure or public leaderboard in v1.

### Open — product owner must decide before release

| ID | Unresolved rule | Recommended default / implementation consequence |
|---|---|---|
| O1 | Must all five cards be used? | Yes. Matching the target early says “Target matched · use all 5 cards”. Config `requireAllNumbers`. |
| O2 | Factorial visible in source screenshot | Exclude from v1 pending confirmation. If included, define postfix precedence, integer domain, repeated ! semantics, magnitude limits, palette layout and generator coverage. Do not silently add it. |
| O3 | Fractional/negative intermediates and targets | Allow exact rationals; early targets positive integers, later optional halves/quarters. Define range in content config. Source screenshots do not settle this. |
| O4 | Collection count and unlock model | Four collections; all paid collections immediately available after purchase, eight authored Starter levels. Remaining collection sizes require content planning. |
| O5 | One-time price and storefront terms | Product/commerce owner supplies localized store price and legal links. No invented price. No subscription. |
| O6 | Daily compatibility with existing Mathly | Use canonical UTC payload for everyone in this app. Sharing the exact daily with the existing website requires its owner/API/rules agreement; currently unverified. |
| O7 | Scores, stars, streaks and hints | Checkmark only; progressive hints, no penalty, no timer. Old star-gated trail model is superseded by this proposed collection model. |
| O8 | Unlimited expression length on compact screen | Palette supply is unlimited. Paginate expression cells, not the whole screen. Usability-test this with real players; unlimited parentheses cannot all remain visible simultaneously at 44 px. |
| O9 | Restore/sync scope | Native store restore, local progress; cross-platform entitlement/account sync is not assumed. Decide whether an account service is needed. |

## 2. Rules and engine contract

A puzzle is a target plus five numbered card instances. Each number is an atomic value, including future multi-digit cards. Taking n3 into the expression leaves its indexed source slot empty. Moving it back restores that slot. Two cards showing 3 remain distinct. Operators copy from the palette; expression operators move. Removing an operator deletes just that instance. Parentheses are separate reusable tokens. Undo reverses every committed edit, including restart; drag previews do not enter history.

Grammar: `expression := term ((+|−) term)*`; `term := factor ((×|÷) factor)*`; `factor := NUMBER | '(' expression ')'`. Equal-precedence operators associate left to right. Do not call a host-language `eval`. Parse tokens by card ID into an AST; exact reduced integer numerator/denominator arithmetic; divide by zero is invalid. Equality uses exact rationals, never rounded display or float epsilon. Use arbitrary-precision integers, including cross-cancellation before multiply. Guard computational work with cancellable worker tasks, not silent arithmetic truncation. “Calculation paused — simplify the expression” is a recoverable state if a resource budget is exceeded; all editing remains available.

States and result copy:

| State | Result area | Completion |
|---|---|---|
| Empty | “—” / “Place a number to begin” | No |
| Valid, target not matched | Exact value / “3 of 5 cards used” | No |
| Target matched early | Target value / “Use all 5 cards to finish” | No under proposed O1 |
| Incomplete, e.g. 5+ | “Incomplete” + “Last valid: 5” | No; stale value is labelled |
| Invalid, e.g. 5÷(3−3) | “Cannot divide by zero” / no current numeric value | No |
| Valid and all five used and exact target | Value + check + “Solved” | Yes, once per attempt |

Incomplete syntax includes adjacent numbers, trailing operator or unmatched parentheses. Do not silently insert multiplication or auto-delete tokens. Identify the first repair point and speak a brief explanation. A complete legal expression missing the target is **not a dead end**: “Result 19 · target 26. Rearrange or try a hint.” There are no irreversible states, because every token remains editable.

Formatting: use × and ÷ visually, serialize * and /. Use locale decimal separator for display, dot in data. Show exact finite decimals up to six decimal places; otherwise show a reduced fraction. Never let a rounded number trigger success. A “Value details” action opens a paged exact-value view for long values; result summary remains pinned. Sample 1/3 renders ⅓ or 1/3, never an unmarked 0.33. Fraction typography must preserve spoken numerator/denominator. No automatic solve while a pointer is down or composition is tentative. On valid committed match, mark solved immediately; show in-place success for 600 ms, then completion panel. Reduced motion retains the same feedback without movement. “Review expression” returns to a read-only solved board; “Try another way” creates a new attempt without removing earned completion.

## 3. Touch, pointer and keyboard interaction

1. New board opens with target/result pinned, empty workspace, five stable source slots and six palette controls. The insertion caret starts at expression index 0.
2. Pointer-down highlights a card. Moving >8 px starts drag; no long press required. Float preview 12 px above finger, scale 1.04, shadow 0 6 12 #0004. Keep original slot as a ghost. Native page pan is disabled only within draggable controls.
3. Closest valid insertion boundary receives a 3 px gold caret and 8 px gap. Row wrap follows token order left-to-right, then next row; insert boundaries at row ends map to the same logical index. Candidate gaps use nearest-cell hit testing, not overlapping enlarged hit areas.
4. Drop commits atomically and recalculates. Dropping outside workspace or return/delete zone cancels. Numbers cannot duplicate. Dragging to their tray returns them; dragging an operator to the tray/delete zone removes it. Accessible Delete action is always available on selection.
5. Tap a source/palette item to insert at caret. Tap an expression item to select; a compact action strip replaces the workspace footer: “Before”, “After”, “Remove”, “Done”. Operator selection also exposes “Replace” using the existing palette; no hidden gesture is required. Use the Before/After controls to position the caret explicitly. Selecting does not itself change arithmetic.
6. Undo reverses one transaction and returns caret/focus to the affected token. Restart immediately clears the expression; Undo can restore the whole previous attempt. No confirmation dialog is needed. No gesture-only reset.
7. Expression paging: 44×44 cells plus 4 px gaps. At 375 width, 7 columns × 2 rows = 14 cells per page; at 320×568, 6×2 = 12 cells. Header/footer page controls are always 44 px high. Use at most two token rows per page in the baseline and compact layouts; remaining workspace height provides stable breathing room and room for inline feedback. The workspace includes visible “1 / 2” and previous/next. During a drag, dwell 500 ms over next/previous page to turn; announce once, never continuously flip. Tap users choose a page then a caret. Keep current result/target and used-card count fixed across pages. Empty page inserts at end; removing tokens clamps to last occupied page. No arbitrary inventory limit on operators. The full expression remains one logical token array.
8. Keyboard: Tab reaches navigation, workspace, source cards, palette, Undo, Hint, Restart. Workspace is a roving-tabindex grid: arrows move logical selection (up/down by column); Home/End first/last token; Enter selects/places; Insert or Before/After chooses caret; Delete/Backspace removes selected token; Escape cancels. Ctrl/Cmd+Z undo. +,-,*,/,(,) insert only while workspace has focus; not globally. Number keys are optional shortcuts only when uniquely identifying an unused card; duplicates require selection. PageUp/PageDown changes editor page. Visible keyboard help in How to play.
9. Commit feedback: 140 ms snap, optional light haptic; invalid placement returns in 180 ms without vibration. Solve uses one gentle haptic and a gold outline; no flashing or confetti required. Sound/haptics independently configurable, sound off by default. App backgrounding cancels active drag and persists last committed state.

## 4. Layout and responsive contract

All dimensions are logical CSS px/dp, not physical pixels. Design baseline 375×667; also supplied 320×568 and 390×844. No device frame is included in exported PNG dimensions. The static spec includes 24 px simulated top and bottom safe areas, replaced at runtime by actual safe-area insets. Never add both simulated and native insets.

Gameplay grid at 375×667: safe top 24; navigation 44; target/result 80; workspace 311 (including labels, pager and padding); number tray 76; operator tray 56; bottom actions 52; safe bottom 24. Horizontal padding 16. Workspace expands as the flexible region, not as document height. Navigation: back left, collection/level centered, settings right. Target and current result share equal-width columns. Bottom actions are Undo, Hint, Restart, each 1/3 width. There is no Submit. Number cards 52×64; source tray uses five equal slots. Six operators use equal-width controls, at least 44×44. The tactile shadows stay within allocated gaps.

At 320 width use 12 px outer padding; 5 number cards at 48×60 with 6 px gaps; 6 operators at 44 with 4 px gaps. At 568 height workspace holds 2 rows plus pager; compact margins, never reduce hit targets. At 390×844 add workspace breathing room; do not enlarge all controls or separate the bottom actions from thumb reach. At widths ≥768 center a 440 px game canvas; desktop keyboard instructions can sit outside. Landscape uses a two-column board: target/expression left, source/palette/actions right; require at least 568×320. At less than the supported minimum usable area, keep target/result pinned and paginate secondary control groups. Do not lock orientation.

At 320×568, safe padding in the supplied mockup is 12 px per edge; navigation 44, result 64, workspace 276, source 68, palette 48, actions 44. Actual native insets replace the simulated padding; if they consume more space, reduce expression rows and paginate before reducing touch targets. At 375×667, the workspace has 4 px inner padding to fit seven 44 px cells plus six 4 px gaps. Expression paging sample 24 shows the final number 2 and four closing parentheses of `((((5+(4*3)-3/2))))`, a 19-token expression split after token 14. Its entire logical expression still equals 15.5.

**Large text exception:** do not shrink user text or clip it to preserve a screenshot. At 200% text, use a deliberate paged accessible layout (Expression / Cards / Controls), with target/result fixed on every page and the same logical editor. Labels wrap, pages have explicit previous/next actions. Extreme zoom may use browser scrolling as an accessibility escape hatch; compact no-scroll is the default viewport contract, not permission to break text enlargement. Screen-reader order remains target, result, expression, source, operators, actions. Validate 200% and 400% zoom in production.

## 5. Accessibility and localization

- Cream #FFF4DB on deep green #09382B; dark ink #163A2D on cream cards. Text contrast checked in QA.json. Gold is an accent, never the only state cue. Selected card: 3 px gold border + visible “Selected”; completion has a check and “Solved”; errors have explicit words.
- Focus ring 3 px cream with 2 px dark offset, always visible. Every control at least 44×44, non-overlapping. No hover-only content. Source slots preserve layout when empty and announce “Card 3 used”.
- Label duplicate cards “3, card 2 of 5” and “3, card 3 of 5”. Expression items announce position, value and selected state. Parentheses announce “open parenthesis”, not an unexplained symbol.
- Result is a polite live region, debounced 250 ms after committed edit; don't speak drag previews or repeat unchanged values. Error and success announce once. Announce source count separately only when changed.
- Modal/panel entry moves focus to heading; trap modal focus, Escape closes non-store dialogs, restore focus to invoker. Never hide Undo/Restart behind a destructive warning. Restoring purchase returns focus to status text.
- Respect reduced motion, increased contrast, text size and platform screen readers. Increased contrast disables felt texture, uses flat deep green and visible card borders. Haptics/sound never carry essential information.
- UI strings externalized, allow 40% expansion. Use locale dates and store price. Mathematical expression order stays LTR even inside RTL UI. English mockups are reference copy, not a localization lock.

## 6. Progression, content and replay

Collections replace worlds and the trail map. Home → Collections → collection detail → authored level / practice → gameplay → completion. Daily has a parallel entry from Home. Settings and How to play return to the invoking screen. Purchase success returns to the locked collection the player chose.

| Collection | Intended puzzle difficulty | Availability |
|---|---|---|
| Starter | Small positive targets, five cards 1–9; solutions using + and −; all palette tools still available | Free, eight supplied authored boards, endless practice |
| Multiplication | Cards 1–12, multiplication/precedence useful, targets usually ≤100 | Full unlock |
| Division | Exact division and useful grouping; later halves/quarters | Full unlock |
| Mastery | Five cards up to 50, nested grouping and mixed operations, targets usually ≤500 | Full unlock |

These are generator design ranges, not proof of human difficulty. Rank authored boards through playtesting and solver metrics (minimum operation complexity, grouping depth, alternative solution count). Do not increase starting card count. Within an available collection, all authored levels are selectable; suggested next is first incomplete. Completion never locks older levels. “Practice this collection” generates another board at that collection's range forever, including after finishing the authored set. Hint use and failed attempts never restrict replay. Purchase grants access, not automatic completion.

The twelve sample levels include the complete eight-level Starter collection, one Multiplication board matching the source cards, two Division boards including the corrected decimal example, and one Mastery example. They are sample content, not the full paid library. Every solution consumes five unique card IDs and passes the verifier. All six palette tools remain available in these samples; introductory solution simplicity does not imply hiding operators.

Generation: choose five cards within collection range, build a legal expression tree using each once, compute exact rational target, reject disallowed target/domain/complexity, solve independently to assess alternatives, deduplicate normalized boards, then publish. Keep seed, generatorVersion, rulesVersion and immutable puzzle ID. Random generation alone does not guarantee challenge quality; test the solver and human difficulty before production. Offline practice uses a versioned bundled pool if generation fails; label “Practice” rather than claiming a new unique board.

Hints have three steps: strategy sentence; useful group such as “Try grouping 4+3”; reveal a complete verified expression. No forced edits. Hints must reference a solution to the original board, not pretend the current partial expression is on that path. “This suggests a fresh approach; Undo and Restart remain available.” On completion record `assisted=true` if any hint was opened, without reducing access or awarding fewer stars. Mockups show hint as an inline workspace panel so target/result and editing controls stay visible.

## 7. Shared daily challenge

Canonical backend payload keyed by UTC date and rulesVersion, with five ordered card instances, operators, exact target, contentVersion and integrity metadata. All users receive the same immutable published payload; do not seed random generation from device locale/timezone or use language-specific random functions. Example fixture is not a claim about the real daily of that date. Fetch on entry/foreground, cache today's payload and attempt; backend response time sets rollover. UTC is shown near the date, with localized “Next puzzle” time available in details. Avoid a ticking countdown.

If offline with cached current daily: continue, mark completion locally and sync idempotently by puzzle ID. If no current payload: show “Today's puzzle needs a connection” with Retry and Free practice. Do not invent a local daily. If midnight passes mid-puzzle: let that date's attempt finish; show “New daily available” after completion. Never replace cards in progress. Replay same daily and review solution remain free. No daily archive promise in the purchase offer.

Store one completion per daily ID; replay doesn't inflate totals. Share opens native share sheet only on explicit user tap. Suggested spoiler-free copy: “Mathly · 19 Oct 2026 · Solved ✓” and optional “With hint”, with approved canonical link. Do not share target, cards, expression or time by default. Cancellation is silent; fallback copies text with a visible confirmation. Streak policy is open and absent from v1.

## 8. One-time full unlock and persistence

Offer copy: “Make room for every challenge. All collections. Unlimited practice. One purchase.” CTA “Unlock · {localized store price}”. Do not ship mockup {Store price} literally. Include Restore purchases and Not now. Starter and today's daily remain playable on dismissal. Product ID example `mathly.full_unlock` is provisional; store setup and legal links are release dependencies.

State machine: locked → loading product → ready → purchasing → verified entitlement / cancelled / pending / error. Loading price disables purchase with “Loading price…”; failure shows Retry and Not now. Purchase button disabled while transaction is active to prevent duplicates. Native store sheet handles confirmation. Cancel returns to unchanged offer. Pending says “Purchase pending — you can keep playing Starter.” Grant entitlement only after verified transaction. Persist verified entitlement for offline use; do not silently relock based solely on network failure. Handle refunds/revocations on a later authoritative refresh and preserve all progress. Restore: working → restored / nothing to restore / failed, with meaningful copy and retry. Do not promise cross-store restore.

Local save schema: schemaVersion, rulesVersion, completed level IDs, per-level assisted flag, current puzzle ID, ordered expression tokens, caret/page, undo history (bounded persisted tail allowed), collection last selection, daily attempts by ID, settings, entitlement cache with verification timestamp. Debounce after committed action and flush on lifecycle pause. Migrate by version, never discard saved progress because art changed. Invalid/corrupt active attempt resets that attempt only with explanation; completed flags remain recoverable. Production backup/account/privacy policy remains a release decision.

## 9. Visual system and assets

Token source: design/tokens.json. Main felt #12513D; deep panels #09382B/#0C3C2E; cream #FFF4DB; ink #163A2D; pale secondary #C5DDCC; accent #F1CC76; error #FFD2C5. Texture sits under a uniform green translucent wash; never bake labels or shadows into the bitmap. One raster background is sufficient. Cards are vector/CSS rounded rectangles: 8 px radius, 1 px #D8C9A8 rim, 0 3 0 #C6B792 edge, 0 5 8 #0003 shadow. Selected adds 3 px gold outline without changing layout. Source ghost uses dashed cream outline at 45% opacity with explicit Used label for accessibility.

UI font system sans-serif, 16/22 body, 13/18 secondary, 20/26 screen headings, tabular numerals 28/34 cards and 32/38 result. Georgia serif can be used only for editorial hero text. Runtime logo supplied as outlined SVG, with no font download dependency. Headings “Mathly” in screenshots may use the wordmark asset. Buttons 12 px radius, 48 px min height. Panels 16 px. Spacing grid 4,8,12,16,24,32. Icons supplied in 64×64 viewBox, 3-unit stroke; render 24×24 inside 44×44 button. Set explicit accessible button names. Logo decorative if an adjacent heading already says Mathly.

Runtime bitmap: assets/felt.webp, 1024×1536, generated wool felt, compressed within total runtime art budget <1 MB (see asset-manifest.json). Display cover, center; no tiling seam required. Fallback flat #12513D, no layout change on load. No bitmap text, cards, icons, confetti, or logos. No separate paper texture is needed; cream fill/rim/shadow supply the tactile card appearance. Original references and mockup PNGs are documentation, not runtime assets. Keep them out of app bundle. SVG assets and CSS tokens are the authoritative scalable components; PNGs show arrangement and state.

## 10. Screen inventory and transitions

See mockups/index.html for the full visual atlas and mockups/*.png for individually labelled SPEC screens. Every screen uses the same 375×667 compact canvas unless its filename gives another size.

| Screen/state | Entry → exit / key behavior |
|---|---|
| 01 Home | Continue restores attempt; Collections opens index; Daily opens dated intro; help/settings reachable |
| 02 Collections | Shows completed free collection and paid lock; choose Starter or open full unlock |
| 03 Collection detail | Eight numbered levels with complete/current/unplayed states, practice CTA; Back returns index |
| 04 How to play | Paged instructions, no scroll; first board tutorial uses same controls, skip available |
| 05 Empty game | All five source cards present, result —, disabled Undo |
| 06 Partial game | 5+4=9, used source ghosts, current result visible |
| 07 Drag insertion | Gold gap, lifted operator and stable source slots; drop inserts, cancel restores |
| 08 Long expression | Correct 15.5 example, wrapping in logical reading order |
| 09 Incomplete | Stale numeric result explicitly labelled; edit remains possible |
| 10 Invalid | Division-by-zero explanation; no misleading current number |
| 11 Target early | Target matched but unused cards remain; no success under O1 |
| 12 Solved | Checkmark and exact result, then completion |
| 13 Level complete | Checkmark, full expression, Next / Practice / Review; no stars under proposed O7 |
| 14 Daily before | UTC date, shared challenge promise, Start daily; no purchase gate |
| 15 Daily after | Solved record, Replay / Share / Home |
| 16 Hint | Strategy + next hint, no mutation of expression |
| 17 Pause/settings | Sound, haptics, contrast, motion and help; resume returns unchanged attempt |
| 18 Full unlock | Benefits, real store-price placeholder, Restore, Not now |
| 19 Purchase pending | Keep playing Starter, no duplicate purchase |
| 20 Purchase error | Retry, Restore, Not now; progress preserved |
| 21 Restore result | Explicit restored/nothing-found/error copy variants in state spec |
| 22 Offline daily | Retry + Free practice, never generates a substitute daily |
| 23 Target missed | All five used, editable complete expression, Try a hint |
| 24 Editor page 2 | Fixed result, page navigation, continuation labels |
| 25 Large text | Paged controls, target/result pinned, no text shrink |
| 26 Purchase success | All collections available; Continue to requested collection |
| 27 Product loading | Loading price; disabled buy; dismiss remains available |

Mockups are state designs, not a functioning game or store integration. The atlas is a local review artifact, not a published website. Additional purchase cancellation reuses 18; restored success reuses 26; restore failure reuses 20 with restore-specific copy. General loading uses inline skeleton within the owning panel; never replace the whole board during active play.

## 11. Release acceptance

- Verify every sample expression and unique card ID; regression-test the 15.5 example and the separate 26 source board.
- Test exact 1/3 arithmetic, zero denominator, left associativity (8/4/2=1), unmatched brackets, duplicates, early target, all-five match, redo not required, restart→undo, drag cancellation, insertion across wrap and page boundary.
- Fit 320×568, 375×667, 390×844 and landscape 568×320 with real safe insets; no clipped controls or page scrolling at default text size. Test software keyboard avoidance (no text entry required).
- Manual VoiceOver/TalkBack, switch/tap-only and keyboard walkthroughs; 200%/400% text/zoom, RTL and long strings. Validate actual component contrast and focus, not just token ratios.
- Daily fixtures in two time zones, offline cached/uncached, wrong device clock, rollover mid-attempt, repeat sync. Everyone receives identical canonical payload.
- Store sandbox: success, cancel, pending, unavailable price, network failure, restore success/empty/error, verified offline entitlement, revoked entitlement. No price hardcoding.
- Runtime art under 1 MB; all relative links resolve offline. Production content generator, backend, store integration and accessibility tests remain engineering work; supplied verification covers assets, sample data and static layout only.

## 12. Supplementary screen specs

31 and 32 complete the three-step How to play flow. 33 is the high-contrast variant. 34 shows exact-value detail. 35 and 36 show the Cards and Controls pages of the large-text adaptation. Large-text screenshots demonstrate layout structure; they are not evidence of native 200% scaling verification. Back/previous-page controls must remain distinct 44 px buttons in the implementation. Settings rows become labelled switches, not clickable decorative spans. Atlas controls are deliberately static.

The layout renderer exports at 2× pixel density and checks DOM overflow against each phone canvas. This verifies static geometry, not the runtime safe-area implementation. Responsive treatment beyond supplied screens is specified in section 4 and must be validated on-device.

## 13. Visual refinement 1.1 — restrained tabletop character

This section supersedes conflicting visual values in section 9; rules, navigation and touch dimensions remain unchanged. The goal is a small increase in warmth and personality, not a casino theme.

- Primary buttons: brass gradient #F7DC99 → #E7BC65; 1 px #FFE8B1 rim; 3 px #AD8139 lower edge. Target plaque: #F3D488 → #D8B76E, dark ink #163A2D. Current result remains a dark plaque with a brass rim, so destination and current state are visibly distinct.
- Cards: #FFF9E9 → #F4E6C6 face, 1 px #E9DAB7 rim, inset light line and 3 px #BA9F6F lower edge. Numerals use Georgia, bold, tabular spacing when available; surrounding controls remain system sans. Small 6 px diamond corner pip is purely decorative, hidden from accessibility. Operators use warm #E7DCC3 → #CABC9C paper and dark #214C3D symbols. No additional bitmap is necessary.
- Table detail: a subtle inset rail at 8 px (4 on compact, 3 landscape), pointer-events:none. The new assets/table-mark.svg is a four-operation engraved roundel under the workspace at opacity .075, maximum 110 px. It has no game meaning, animation or hit target. Hide it from accessibility and in high contrast. It never overlays the cards or result.
- Home: a quiet patterned card back behind the decorative hand, one gold italic phrase, and a small calendar card on the daily entry. The mockup uses day 19; production derives the number from the canonical daily payload, with an accessible full date. Card-back pattern and calendar are CSS/vector primitives, not new raster assets.
- Collection marks resemble small brass plaques, rotated at most 4 degrees. Gameplay cards retain aligned rectangular touch targets; no gameplay control is rotated for decoration. Completion uses a small embossed brass check medallion. It remains a completion indicator, never a currency.
- High contrast removes texture, rail and roundel and returns card faces to flat cream. Existing reduced-motion settings remain unchanged. No decorative animation has been added.

Authoritative updated geometry and fills are in screens.css, tokens.json, table-mark.svg and the refreshed PNGs. All 36 screens are re-rendered. assets/felt.webp is the original generated texture; this refinement adds no new raster dependency.

Revision 1.1 compact adjustments: Home and completion body stacks use 12 px gaps; Home decorative hand reserves 96 px height. The completion medallion remains 76×76 px. These keep secondary navigation within the original safe-area bounds.
