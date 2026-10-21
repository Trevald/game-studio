# Playful Deck implementation contract

## 1. Art and hierarchy

Use the enclosed tokens. Jade felt fills the game canvas with a uniform jade wash: CSS background `linear-gradient(rgba(20,117,95,.58),rgba(20,117,95,.58)), url(felt-jade-v1.webp) center/cover`. No tiling assumption. High contrast/image failure uses flat `#094C3C`. Keep texture out of labels, cards and icons. Use recessed solid deep jade for the expression area, thin muted mint border; no large cream workspace.

Target: yellow, dark ink, label TARGET. Result: cream with dark ink, label RESULT. Number tokens: cream top/bottom, dark bold rounded system numerals, 8px radius, short 3px lower edge. Operator/parenthesis tokens: mint, same interaction footprint, no serif ambiguity. Palette: coral; signs remain dark ink. Gold is absent. Hint/Undo/Restart all use quiet cream controls. Avoid decorative props, currency symbols, badges with game-like meaning, and noisy inset outlines. Keep source cards upright and unrotated. Logo is live `Mathly` in Georgia bold, with system-serif fallback; no external fonts. Body is system sans; numerals use rounded system sans where present, otherwise system sans, weight 800 and tabular figures. Wordmark differences between operating systems are acceptable.

Main number text 28px/1.1; source 30px; target/result 36px (compact 32px); body 16px/1.35; labels 12px/1.3. Token text can use 20px for multi-digit source values to avoid clipping; never shrink below 20px at default text size. Long exact values use a labelled details dialog with selectable/wrapping full value; summary must be explicitly shortened (ellipsis), not a rounded value that suggests equality. Preserve current finite-decimal/fraction formatting.

## 2. Responsive geometry

All values are CSS pixels. `U = visual viewport height minus actual safe top/bottom insets`. Apply safe insets exactly once, outside inner canvas padding. Desktop portrait canvas max width 440; height uses available viewport (no artificial 667px cap). Outer padding 12px each side; normal inter-section gap 10px; compact (U<620 or width<350) gap 8px. Header 44px; target/result row 72px normal, 64px compact; source tray 56/48px; operator row 48/44px; bottom actions 44px. Five gaps connect six vertical sections: header, plaques, workspace, sources, palette, actions. Workspace receives all remaining height, never pushes tray downward because tokens were added. No extra banner rows outside this allocation.

Workspace: 6px padding; 44px top strip, token grid, a reserved 24px one-line status area, 44px selection strip; 6px gaps between those four regions. Top strip contains label/count in the middle and 44px previous/next page controls at its edges. On a single page, hide arrows visually but reserve their space and remove from tab order. Selection strip reserves its geometry when idle; show brief guidance instead of disabled buttons. When selected, show Before / After / Remove / Done with equal width, minimum 44px height. Number/label text must not overlap these controls.

Grid: 44px square cells, 4px gaps in both axes. Columns = floor((workspace content width + 4)/48), at least one. At width 375 the content width is 339px and seven columns fit; at width 320 content width is 284px and six fit. Standard viewport height yields workspace ~329px at 375×667 and ~260px at 320×568 (without OS safe insets). Cap rows at three: use 3 if workspace height ≥300 and canvas width ≥350; otherwise 2 if height ≥240; otherwise 1 if height ≥192. These thresholds reserve status/action space and breathing room, beyond raw grid fit. Row count depends on usable space, never expression length. At 390×844: three rows, extra space remains breathing room. Do not spread cells vertically to fill the well.

With OS insets or expanded copy the available height may reduce the row count. No promise that every 375-wide device gets three rows. If the workspace would be <192px, use the accessible section layout below instead of clipping/shrinking. If width <320 or enlarged text breaks 44px cells, use the same accessible section layout.

Landscape (width>height and usable width≥568): two columns with 12px gap and 12px outer padding; header spans both. Left width 60% of remaining content: plaques then workspace; right: stable five-slot tray, palette (3×2 if six 44px controls cannot fit), actions. If the tray cannot fit five slots, show its five cards over two rows in the right column, retaining source order. Use available workspace thresholds above, maximum three rows. If these groups exceed usable height, use section layout. Nothing may be hidden by orientation locking.

Accessible section layout: target/result stay above three explicit tabs, Expression / Cards / Controls, each ≥44px. Only selected section occupies the remaining area; preserve caret, selection and page when switching. Expression contains one or more rows as space permits plus page/selection controls; Cards has all five identifiable source cards; Controls has operator palette and Undo/Hint/Restart. Selecting a card/operator returns to Expression and follows insertion. At 200%/400% text do not force fixed-height labels or shrink fonts. Allow page scrolling as a final accessibility escape hatch, keeping target/result sticky where it does not consume the whole viewport. All actions remain keyboard/screen-reader accessible; no essential action is gesture-only.

## 3. Screen/state contract

| State | Visible content | Actions / transition |
|---|---|---|
| Empty | Target; result —; five available cards; caret at 0; “Place a number to begin” | Insert, Hint and Restart as current; Undo disabled with empty history |
| Partial valid | Exact result; cream number/mint operator tokens; used ghosts; count | Edits remain available; palette insertion/replacement rules below |
| Selected | 3px dark ink outline inside cream/yellow selected token, labelled “Selected: [value]”; coral caret with cream edge | Before/After move caret; Remove deletes one token; Done deselects |
| Target matched early | Exact target value; “Use all 5 cards to finish” | No check/transition; keep editing |
| Incomplete | RESULT “Incomplete”; “Last valid: [value]” only if a valid prefix of this current expression exists | Never display a stale unlabelled number; unmatched parentheses not auto-fixed |
| Invalid | RESULT “No value”; “Cannot divide by zero” or current parser explanation | Never show numeric success; editing and undo stay available |
| All used, missed | Exact result; “Target [target] · try another arrangement” | Rearrange or hint, no lose state |
| Hint | An accessible inline panel in workspace with current step and Next hint/Close | Reserve actual panel height before recalculating row count; if it will not fit, use scrollable dialog; retain target/result and restore focus on close. Do not move tray or mutate tokens |
| Solved moment | Result exact target + **one** check and “Solved”; fine yellow workspace outline | Lock editing immediately; cancel drag; 600ms then completion. Hide selection controls but reserve strip. No second floating check on workspace |
| Review expression | Solved board, all pages navigable; clear “Review” label | No edits, no repeated celebration; Back / Try another way reachable |
| Asset load/failure | Solid jade fallback immediately | No blocking screen; geometry unchanged; failed texture must not hide content |

Status text normally fits one line. Longer parser/hint text must be accessible in an expandable explanation/dialog; never truncate without a way to read it. Render text as live content. Retain all source slots at fixed positions across the states above. Token insertion snap 140ms and removal return 180ms are maximum durations; reduced motion uses immediate placement and static outline. Sound defaults off and retains existing setting. No new audio/haptic asset is required.

## 4. Paging and editing

Token IDs and array order are authoritative. Example two-row page capacity at 320 is 12; a 19-token expression splits 0–11 and 12–18. Newlines and pages do not change arithmetic. Show “Page 1 of 2” and visible token range; no truncation of the expression array. First/last page arrows disabled. Removing the final token of the final page clamps to the last nonempty page; empty expression has page 1 of 1.

Tap unused source inserts that exact card ID at caret; its source slot becomes Used. Operators copy from palette indefinitely. Tap token selects it and shows selection strip; Before sets caret=index, After=index+1; Done deselects without modifying expression. Selected operator + palette operator replaces one operator; selected number + palette operator inserts normally at caret. Remove returns a number to its original source slot; removing an operator destroys only that instance. No automatic multiplication, concatenation or parentheses insertion. Undo remains one committed transaction including Restart. Page browsing and selection are not undo history.

At a row/page break the end of the previous row and start of the next are the same logical boundary. Show a single caret at the selected visible boundary. Insertion after page-end follows the inserted token onto its new page. After explicit page navigation, retain logical selection/caret; if selection is off-page, replace selection strip with “Selection on page N” and a 44px “Go to selection” action rather than permitting hidden-token deletion. Resize/reflow follows selected token if any, otherwise caret; no token loss or duplicate insertion.

Drag starts after 8px movement; original card remains ghosted, preview above finger. Drop preview does not mutate data. Drop in expression inserts/moves at closest valid boundary; dragging a token onto source tray removes it; drop outside valid zones cancels. Do not use operator palette as an accidental delete target in this refresh. For moving forward, remove original before adjusting destination index. Drop on original position/adjacent equivalent boundary is a no-op, no new undo entry. Pointercancel, app background or resize mid-drag cancels cleanly.

During drag, hover/dwell 500ms on enabled previous/next page arrow to turn one page; rearm only after leaving that arrow, so it never races through pages. Page turn alone is not a commit; cancel restores original tokens and pre-drag page/caret/selection. Keyboard PageUp/PageDown invokes equivalent page browsing. All drag operations also work through tap selection, Before/After, Remove and reinsert.

Preserve keyboard mappings of the prototype, including Ctrl/Cmd+Z, restart and hint. Within expression, arrows navigate logical token positions; Home/End, selection, deletion, paging stay usable. Math shortcuts act only with workspace focus. Never steal keys from dialog or form controls. Duplicate card values remain distinct in accessible labels. This visual refresh does not alter the prototype's first-free duplicate-number keyboard shortcut.

## 5. Existing shell and completion

Home retains Continue/Collections/help/settings and existing persistence behavior; use jade, cream cards and coral primary button. Hide absent Daily/practice features as current prototype does. Collections retain four open collections and their completion counts; no paid/locked appearance. Collection tiles show a check + text for completed, never disabled styling. No new illustration, world map or raster required.

Completion uses jade background, one cream/yellow check medallion, “Nicely worked.”, exact wrapping expression, and existing Next puzzle / Back to collection / Review expression / Try another way actions. Main CTA coral; secondary cream/outline. Next after last board follows current navigation; do not create a practice generator. Review is read-only; Try another way creates a new attempt while keeping earned completion. Assisted flag displays “With hint” without penalty. Help/settings use cream surfaces with dark ink, actual labelled switches and existing sound/high-contrast choices. Menus/dialogs may scroll; the no-scroll requirement applies to standard gameplay canvases.

## 6. Accessibility and feedback

Contrast: ordinary text ≥4.5:1 and large text ≥3:1; interactive outlines/focus ≥3:1. Verify actual rendered gradients/textures; tokens include tested base pairs. High contrast disables texture, shadow, gradients and decorative animation: deep jade background, cream cards, dark text, solid visible borders. Mark Used, Selected, invalid and Solved with text/icons, never colour alone.

Minimum hit regions 44×44 with no overlap; visible glyph can be smaller. Use button semantics for actions, accessible names for icon-only controls; SVG decorative to screen readers. Focus ring: 2px cream outer + 2px dark inner; do not clip it. Screen-reader order target, result, expression/pager/selection, sources, palette, actions. Result polite live region, debounce 250ms after committed edit; no drag-preview chatter. Announce page/selection changes once. Dialogs focus heading/first relevant control, trap focus, Escape closes, return to invoker. Text expansion may trigger section layout; never hide full error text or exact values.

## 7. Preserved engine and content contract

A board is five uniquely identified cards and an exact rational target. Use all five once, reusable + − × ÷ and parentheses. Standard precedence, left associative equal-precedence operations; exact reduced BigInt rational equality; no eval or float tolerance. Divide by zero invalid, incomplete syntax remains editable. Negative/fractional intermediates remain supported. This is the current prototype baseline, not a new release-rule decision. No scores, stars, timer or currency.

Keep localStorage key/schema/completed flags/current attempt as current implementation. A visual update must not clear progress or require a reset. Preserve reload/Continue, exact card identities, collections and existing sound/contrast settings; undo persistence across reload remains out of scope. Existing loaded content remains the 12 supplied levels; do not relabel layout fixtures as shipped puzzles. Data fixtures are QA only. All new CSS uses relative asset paths; no external fonts/CDNs are needed.
