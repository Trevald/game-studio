# Validation and completion evidence

## Packet checks already run (not implementation tests)

- `python3 verification/verify-data.py`: all 12 authored solutions checked with exact fractions; 11 UI fixtures cover empty/partial/selected/early/incomplete/invalid/missed/long/solved, duplicate and unknown IDs.
- `node verification/check-atlas.cjs` (Playwright + local Chrome): 54 combinations, 9 states × 3 portrait canvases × 2 safe-inset presets. Report in atlas-results.json: no overflow, no token <44px, no notice clipping, stable source tray and no JS errors. Pages 1/2 of compact long fixture captured. Renderer depends on Playwright; set MATHLY_CHROME to an installed Chrome if needed. Re-running writes screenshots/results, so copy the packet to a temporary folder for later checks after approval.
- `contrast.json`: calculated base-pair contrast, not a screenshot measurement of every gradient edge.
- Runtime assets decoded/inspected; manifest records dimensions, byte counts and SHA-256.
- Selected 375px and long 320px page-2 screenshots inspected visually. Atlas is intentionally not a full interactive engine.

## Claude must run after implementing

1. Run the existing studio QA (`node tools/qa/playtest.mjs games/mathly-trails/index.html`, following repository dependency instructions). All 12 boards solvable with existing hooks; no JS errors. Run copied exact arithmetic cases against actual engine, including 1/3, left associative division, zero divisor, repeated values and early match. Do not replace independent verification with stored solution insertion alone.
2. 320×568, 375×667, 390×844, 1280×800 desktop and 568×320 landscape; zero and realistic safe insets. Capture empty/partial/selected/incomplete/invalid/full/19-token pages/solved/review. Tray stays stable for same viewport; changing available height may reflow rows. No clipped controls or horizontal scroll in supported default layouts.
3. At capacity N test N−1,N,N+1 tokens and 2N+1. Select/remove/move first/last token across row/page boundary, duplicate-value cards, parentheses. Verify destination indices, no duplicate card, one undo transaction and restored caret. Removing last token on last page clamps page. Cancel drag outside, pointercancel, app background and resize all preserve data. Dwell paging fires once per entry.
4. Keyboard-only full solve, page navigation, Before/After/Remove/Done, Ctrl/Cmd+Z, restart→undo. Confirm shortcuts do not intercept settings/help. Screen-reader labels for duplicate cards, result/state announcements and selection; test VoiceOver or TalkBack on a real device and report device/version.
5. 200% and 400% text/zoom, long labels, multi-digit cards, long fractions/values and large safe insets. Test accessible section layout and dialogs with keyboard/screen reader. Never shrink hit targets; document actual measured targets. Check focus clipping, rendered contrast and high contrast with texture disabled.
6. Solve committed expression: one check, 600ms hold, no editing during hold, one completion record. Review has no edit or repeat animation. Try another way preserves earned completion; hints remain non-mutating and assisted flag survives.
7. Seed a pre-update local save, update/reload and Continue: retain completed boards, attempt IDs/tokens and settings. Do not claim persisted undo unless separately implemented/approved. Test denied localStorage: play remains possible without unhandled exception.
8. Block texture request and work offline: flat background, readable controls, no layout shift. Verify bundled art uses relative URLs and runtime bitmap+SVG total below 1MiB. No source/reference PNG is shipped. No new network dependency.
9. Home/collections/detail/help/settings/completion retain routes and actions; no new Daily/practice/shop, no new board or rule. Reduced motion immediate placement/static success; sound remains optional/off by default.

## Completion record

Create the next `design-studio/games/mathly/feedback/FB-NNN-*.md` as a completion report. Include handover H-001-v1 and approved candidate commit, implementation commit, requirement-by-requirement results, exact commands, actual environments, screenshots/recordings and reproduction steps. Mark tests not run explicitly. File deviations/questions before changing approved behavior; only the affected requirement is blocked if other work is independent. Owner acceptance remains separate from a passing automated report.
