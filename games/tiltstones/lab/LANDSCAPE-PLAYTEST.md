# Landscape prototypes — 20 October 2026

**Current revision: feedback pass 5 below.** The initial blue-only pass is retained here as history; its grids and results have been superseded.

Status: playable local experiments; awaiting owner desktop playtest. These are not approved campaign replacements.

Authorization: in this chat, Benji approved prototyping two islands, a central structure and staggered shelves: “Go ahead. Just keep in mind that testing by playing is a huge part but maybe we can test play the landscape one on desktop computer”. The Diamonds screenshots are visual references, not imported level data or assets.

## Scope

H1–H3 are 18 columns × 10 rows in `levels.json`, shown first in the Level Lab. Physics remain 9 cells/s vertically and up to 5.5 horizontally. All three use blue only in this first pass to isolate layout and travel; colour-order decisions are a subsequent experiment. Existing campaign and L1–L10 grids remain intact. Landscape boards expand on desktop and shrink to fit phone widths.

- H1 Twin Islands: two separate targets with a broad crossing and multiple approaches.
- H2 Open the Heart: a layered central structure that opens as it is cleared.
- H3 Across the Terraces: staggered shelves with persistent bounce surfaces and end openings.

## Play on desktop

Serve the repository (`python3 -m http.server 8765 --bind 127.0.0.1`) and open http://127.0.0.1:8765/games/tiltstones/. Choose Level Lab, then H1, H2 or H3. Steer with left/right arrows or A/D; R restarts; P/Escape pauses. Each level is freely selectable.

Play each once without hints beyond the level card, then once more with a deliberate route. Record:

1. Did you see where you wanted to travel next?
2. Did crossing between targets feel purposeful or like waiting?
3. Which approach felt awkward, especially reaching the final few blocks?
4. Which layout would you replay? Does its width feel useful?

Do not use automated completion times as human pars. Choose a favourite after actual play, then adapt that layout to portrait for comparison. The winner and portrait adaptation are pending, not inferred from bot scores.

## Verification

Simulation solver: H1 17.6 s, H2 32.3 s, H3 23.9 s; all completed without deaths.

Normal-speed desktop Chrome, 1440 × 900, actual keyboard events from the existing planner (one sample each):

| Level | Complete | Time | Deaths | Longest gap between useful hits |
| --- | --- | --- | --- | --- |
| H1 | yes | 19.1 s | 0 | 3.6 s |
| H2 | yes | 31.3 s | 0 | 1.6 s |
| H3 | yes | 24.6 s | 0 | 2.5 s |

These are automated playthroughs with board knowledge, not human playtests or evidence of enjoyment. Start screenshots were visually inspected. H1–H3 and the existing L1 fit horizontally at 1440 × 900, 390 × 844 and 844 × 390 with no JavaScript errors. Phone usability has not been established by these layout checks.

Reproduce: `node games/tiltstones/lab/measure.mjs H1 H2 H3` and `node games/tiltstones/lab/play1x.mjs H1 H2 H3`. The latter uses desktop viewports for H-prefixed levels; `PLAYWRIGHT_CHANNEL=chrome` can select installed Chrome. Playwright must be available to Node.

Runtime entry: `../index.html`. Level source: `levels.json`; run `node games/tiltstones/lab/build.mjs` after edits.


## Feedback pass 2 — colours, stone lanes and earned multipliers

Owner feedback: one colour is too boring beyond a tutorial; later levels need keys; multiplier is too easy; more solid geometry should guide/hinder and produce fast ping-pong rebounds.

H1 and H2 now use blue then red, with a side-entry red pot behind a blue guard. Painting early can still strand remaining blue: the level card explicitly tells the player to finish blue first. H3 adds a key on the left and a full-height partition whose only opening is the lock; the red chamber and paint are on the right. No new physics or tile types were introduced.

Stone occupancy increased from 4/2/14% to 14/14/24% for H1/H2/H3. Stone caps, floors and H2's central spine preserve short rebounds while wider routes connect them. Solver traces recorded 30/141/35 vertical reversals within 150 ms of the prior reversal, respectively. These counts demonstrate short-bounce sections, not human enjoyment.

Global scoring tuning: the same-colour break window is now 0.7 s instead of 1.5 s. Multipliers rise every three additional hits: hits 1–3 score x1, 4–6 x2, 7–9 x3, 10–12 x4, and 13 onward x5. Timeout, repaint and respawn clear the chain. Grey and stone contacts do not extend it. Tests in `check-combo.mjs` cover thresholds, score totals, the exact window boundary and resets.

Records use a new revision suffix so old scores and old H-level times do not compete with the revised rules/layouts. Earlier records remain stored and campaign progression is retained.

Validation: simulation clears H1/H2/H3 in 13.9/26.9/22.3 s; normal-speed desktop Chrome keyboard bot clears in 20.2/32.4/25.9 s, no deaths. Solver events confirm one paint transition each, plus one key and one unlock on H3. Solver peak multipliers were x5/x4/x3: high chains remain possible, but now need sustained hits. Automated play is not human playtesting. H2's browser run had a 6.5 s gap between productive hits; watch for awkward late cleanup during the next human playtest.

Next: refresh the desktop preview and replay H1–H3. Assess colour ordering, controllability in the short passages and whether multipliers feel earned.

## Feedback pass 3 — purposeful layers and reusable dipping wells

Owner requested that breaking coloured blocks reveal or open access to other colours, that the ball enter paint before rebounding, and that several levels require switching colours back and forth.

New selectable prototypes (listed first):

- H4 Layer Cake: enclosed blue → red → blue rings around a diamond.
- H5 Opposite Vaults: two enclosed vaults, blue outside red on one and red outside blue on the other. Opening both requires returning to a colour.
- H6 Three-way Return: blue → red → green → blue around a diamond.

These are spatial layers of solid tiles, not multiple blocks occupying one tile. Breaking the outer blocks exposes the next ring, which cannot be reached from outside without opening its enclosure. Existing H1–H3 remain for short-bounce and key-gate comparison; a proposed new combined key/colour variant was dropped because the automated planner struggled with it. H3 remains the key example.

New legend symbol `A` is persistent blue paint. A/B/C wells sit on the bottom boundary with solid blocks on either side, so entry is from above. Each dip takes 0.5 seconds: the simulated ball moves from the collision boundary into the bucket to 65% of its cell height, changes colour halfway through, and returns to the original boundary before resuming its reflected trajectory. The bucket mouth is wider; the ball shrinks slightly visually at depth and is drawn under the bucket foreground. Existing side-entry pots remain supported for earlier levels. The UI and solver no longer declare unfinished blue irrecoverable when an A well exists.

`check-dip.mjs` verifies midpoint position and colour, return position, reflected velocity, cloning mid-dip, blue repaint and the legacy no-blue-paint stuck case. `check-combo.mjs` still passes with delayed painting. A Chrome midpoint screenshot was inspected to confirm the ball is visible inside the paint.

Simulation clears: H4 65.5 s, H5 71.9 s, H6 83.1 s, all without deaths. These longer exploratory levels are not assigned human pars. Next human test: does opening a layer feel purposeful, are paint trips too long, and is entering/exiting the paint readable?


Final browser verification for pass 3 (1440 × 900, real keyboard events at 1×): H4 won in 54.6 s, H5 in 65.9 s, H6 in 92.0 s, all with zero deaths. Solver traces confirm repeated repainting and blue returns in all three. H6 had a 9.5 s largest gap between productive hits and 47% of its bot run counted as dead time; paint-trip length and cleanup remain human-playtest concerns, not a proven pacing improvement. New boards and old L1 fit horizontally at 1440 × 900, 390 × 844 and 844 × 390 without browser errors. Legacy H1–H3 still clear in simulation with the longer dip. No claim of human playtesting is made.

## Feedback pass 4 — compact rebound layouts and speed comparisons

Owner found the nested layouts too similar and travel too slow; requested more permanent and temporary rebound blocks, roofs near paint, smaller grids/faster motion, and an acceleration experiment.

Added three 14 × 9 boards (previous H4–H6 were 20 × 12): S1 Paint Shuttle (low lane and paired paint roofs), S2 Broken Staircase (offset ledges and grey steps), S3 Switchyard (irregular stone pockets and a disposable roof above blue paint). Both paints are reusable. These are authored arrangements, not random placement at runtime. Stone occupies 13–17%, up from roughly 3% in H4–H6. Grey blocks offer a one-use rebound and then open space. Existing H experiments remain selectable.

S1F and S1A copy S1's exact grid for a controlled comparison. S1 uses the existing 9 cells/s vertical, 5.5 sideways. S1F uses 12 vertical and 7 sideways. S1A starts at 9 vertical, accelerates by 10 cells/s² up to 16 during free flight, and resets vertical magnitude to 9 on every tile or boundary impact; sideways remains 5.5. Paint dipping remains 0.5 s and does not accelerate. Respawn restores the level's initial speed. Movement settings are per-level, so campaign and earlier prototypes retain their prior physics. Variant IDs keep their records separate.

`check-motion.mjs` checks standard/fast velocity, acceleration cap, tile and boundary impact reset, and respawn. `check-rebounds.mjs` verifies that the permanent S1 roof and disposable S3 roof each return a ball from directly below the roof into blue paint in 0.20 s; the stone persists and grey is consumed. Existing dip and combo tests pass.

Simulation clears without deaths: S1 16.1 s, S2 18.5 s, S3 18.5 s, S1F 20.5 s, S1A 17.1 s. Faster movement does not guarantee faster solver completion: compare controllability and felt waiting, not just completion time. Screenshots of all three layouts were visually inspected.

Next human comparison: play S1, then S1F and S1A on the same grid; pick the movement feel before changing global physics. Then compare S2 and S3 for layout variety, whether roofs make repainting quick, and whether preserving a grey block creates an interesting choice.

Final normal-speed desktop keyboard bot results: S1 20.9 s, S2 21.8 s, S3 17.5 s, S1F 18.2 s, S1A 24.1 s; all won without deaths. On the controlled shuttle comparison, the fast variant had a 2.7 s longest productive-hit gap versus 3.6 s standard and 4.1 s accelerating. This single automated sample favours testing constant-fast first; it does not establish human preference. Horizontal-fit/browser-error checks passed at 1440 × 900, 390 × 844 and 844 × 390 for all five new entries.

## Feedback pass 5 — planning puzzles

Owner approved exploring puzzle decisions while keeping the compact board. Added P1–P3, each 14 × 9 with standard movement, shown first in the Lab. Player-facing text asks a question or frames the problem without providing the full solution.

- P1 Keep the Return is a soft planning experiment: retain the grey roof above blue paint until the red vault has been opened. Breaking it early remains recoverable. With the ball immediately below the roof, return to the well takes 0.20 s while intact versus 0.40 s after removal. A simulation also completes after removing the roof at the start. This is a modest timing benefit, not a mandatory key-access trick; perpetual vertical bouncing makes most removed rebound surfaces recoverable.
- P2 Open Your Way Back requires opening the blue plug above the blue well before taking red. The red vault contains blue blocks, so an early repaint truly strands the player. The authored `blueReturnSeal` coordinate records that one plug; runtime failure detection shows an explanation and restart panel. Preparing the well first leaves blue reachable. The failure text is shown only after the mistake.
- P3 Unlock the Loop uses a locked horizontal shelf. The key below is necessary to reach red paint above. Red opens a small blue-core vault; the player must return through the gate for blue. An earlier narrow side-entry vault/vertical partition was rejected after solver and browser difficulty. The final version has a vertical passage through a shelf and open vault approaches.

Verification: `check-puzzles.mjs` proves the wrong-order blue-well seal, access after opening it, the required gate and accessible key, and runtime stuck detection/reset conditions. Its connectivity checks are optimistic point reachability, not a ball-motion proof; separate engine/browser clears supply the latter evidence. A browser check confirmed the P2 failure explanation with no JS errors.

Simulation clears: P1 23.7 s, P2 25.5 s (before the new seal detector), final P3 16.0 s. Normal-speed desktop keyboard bot clears: P1 26.2 s, P2 32.1 s, P3 45.1 s, all with zero deaths. P2's original greedy bot made the intended early-paint mistake; its successful run uses an explicit prepare-the-well-first planning policy, implemented only in the test planner, not by changing the live board. P3's bot had a 26.4 s maximum productive-hit gap despite the fast simulation clear; gate execution remains a human-playtest concern. No human acceptance is inferred.

Next: play P2 first for the strongest order dependency, then P3 for a planned return journey. Evaluate whether P1's modest timing benefit is enough to make preservation interesting. Ask whether the player formed a plan before moving and understood the consequence of a wrong order.
