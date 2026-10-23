# Design-study validation

Completed across 22–23 October 2026. These checks concern the HTML review prototype, not the production game or proposed balance.

## Browser checks performed

- Opened and inspected all seven scenes in the in-app browser.
- First move: 4 + 6 increments chains and displays 100 points; keyboard Enter on both candies also completed the move.
- Longer chain: tapping 2, 3, 5 displayed 187 points, one chain, and the example achievement toast. Fixed an initial tap-selection reset that prevented this sequence.
- Stripe: selecting 4 and 6 displayed Row cleared, 175 points, and a First Spark toast.
- Hammer: selected tool, selected target, saw confirmation, confirmed; target was dimmed/disabled and charge marked Used without increasing chain count.
- Sugar Rush: 4 + 6 displayed 200 points and reduced remaining bonus moves to two.
- Sticker book: Mix Master became the selected badge; selecting locked Perfect Batch displayed its earning condition.
- Reviewed the saved seven-scene contact sheet and the success-screen capture visually.
- All seven scenes checked at 360×640, 390×844 and 1280×800: no document horizontal overflow; no enabled button dimensions below 44×44 CSS pixels. Fixed the initial narrow-screen grid overflow. Long content uses normal scrolling.
- Browser error log: no errors observed during the checked session.
- Restored temporary viewport override after checking.

## File checks

- Extracted the inline JavaScript and ran `node --check`: passed.
- Checked local src/href references in index.html and overview.html: all resolve.
- Copied art comes from the existing repository; no external library/font dependency.
- No runtime game HTML or frozen handover changed.

## Limits

No physical-device testing, automated touch gesture test, screen-reader session, 150% text-size audit, or child playtest performed. Reduced-motion styling exists but was not separately exercised. Special combinations and later mechanics are described, not simulated. Timing, real refill, persistent progression, complete pause/recovery, new level solutions and balance require production implementation and testing. No claim of three-star attainability is made for this prototype.
