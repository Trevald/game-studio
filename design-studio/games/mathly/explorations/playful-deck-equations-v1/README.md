# Playful Deck — long-equation study v1

2026-10-21. Design exploration only, not game implementation or a handover.

`preview.fragment.html` is the source of the interactive conversation preview; `adaptive-375.png` shows the 19-token case in Adaptive rows. `layout-check.json` records local headless Chrome measurements. No dependencies or runtime changes are added to the game.

## What to compare

Two rows + pages preserves a stable two-row token area. Adaptive rows uses three rows at 375×667 / 390×844 and two at 320×568. Recommend Adaptive rows for further review: the complete long expression stays visible on taller phones without shrinking targets, and compact phones preserve room for controls. This changes the existing spec's two-row maximum and therefore requires explicit layout approval in a future packet.

Expression tokens are 44×44 CSS px with 4 px horizontal and 6 px vertical gaps. The source tray remains separate and stable. Seven columns fit at 375/390; six at 320. A normal full expression `5+(4×3)−3÷2` has 11 tokens and equals 15.5. The stress example `((((5+(4×3)−3÷2))))` has 19 tokens and the same value; redundant parentheses test overflow rather than suggest good puzzle content. Target 16 is deliberately missed, so the expression remains editable instead of triggering completion. These are layout fixtures, not changes to authored levels.

Two rows hold 14 tokens on 375/390 and 12 on 320. Adaptive rows holds 21 on taller canvases, 12 on compact. Larger expressions continue on explicit pages. Target and live-result plaques remain visible and unchanged between pages. Source card order is [5,4,3,3,2], all marked Used. Selected tokens remain cream/yellow; coral is reserved for the operator palette. All copy and numbers are live text.

## Preview interactions and limits

Example/phone selectors are design-review controls outside the game. Page arrows, token selection and Before/After insertion positioning work. Header, operator palette, source ghosts, Undo/Hint/Restart are display-only; no arithmetic editing, drag/drop, undo engine or progression is implemented. Result is a fixture, not a computed live engine. Selection on a hidden page disables Before/After until a visible token is selected. No claim of a complete accessible editor.

## Verification

Local Chrome checked 12 combinations (2 examples × 3 phone canvases × 2 variants): no phone/workspace overflow, token rectangles inside their grid, all expression targets at least 44×44, bottom controls within phone bounds. Paging to tokens 13–19 and selecting token 13 / placing the caret after it passed. No JS errors. The 375×667 adaptive screenshot was visually inspected. An initial three-row compact attempt crowded controls; the final compact design falls back to two rows.

These are synthetic canvas checks with 12/16 px padding, not real-device safe-area tests. Text enlargement, screen readers, landscape, drag-across-page behavior, multi-digit/fractional cards, longer numeric values, grouping comprehension and real-user usability still require verification. The color treatment is a code-native approximation of the selected image, not final production art.

## Proposed acceptance scope — MATHLY-VIS-005

For this draft layout: the 11-token fixture remains on one page at all three canvases; the 19-token fixture is fully visible on taller canvases in Adaptive rows and spans 12+7 tokens at 320×568. Page navigation must preserve order, selected identity and result. Tokens never become smaller to avoid paging. Boundary cases: first/last page arrows disabled; selection and caret must remain identifiable at a row/page boundary. Future implementation must additionally test delete/move across boundaries and dynamic usable height after safe areas/text enlargement. This is pending owner approval, not an executable Claude contract.
