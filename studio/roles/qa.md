# QA

Run `node tools/qa/playtest.mjs games/<slug>/index.html` and treat every FAIL as a bug to fix.

What it checks: allowed CDNs, banned APIs, boot at desktop and phone size, console errors and
exceptions, horizontal overflow, the `__qa` hook, 400 random actions without crashing, and
(when `solve()` exists) that every level is completable.

What it can't check, so you do it by looking at `games/<slug>/qa/*.png` with Read each round:

- Is everything visible and legible on the phone screenshot? Nothing clipped or overlapping?
- Does the first screen make clear what to do?
- After random play, does the screen still look like a sane game state?
- Do win and lose states show clearly, with an obvious way to continue?

Also read the code once for: game logic tied to frame rate or wall clock, input handlers that can
fire twice (touch + click), and state that isn't reset on restart.

Write the final pass/fail summary and any known issues into tonight's NIGHTS.md entry.
