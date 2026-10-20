# Ricochet — status

- Updated: 2026-10-20
- Stage: intake needed
- Current goal: establish verified project baseline
- Branch / PR: local starter kit; not published
- Latest approved handover / source commit / approval evidence: none
- Delivery PR / target commit: none
- Implementation PR / verification / owner acceptance: none

## Completed
Created the project skeleton. No game-specific design or implementation has been verified.

## Open questions and blockers
Implementation repository, existing design, milestone, and approver are unknown.

## Next action
Owner supplies the implementation repository and current concept; inspect both and fill PROJECT.md on an intake branch.

## Session checkpoint
Record the date, actual branch and PR URL, files changed, unresolved feedback IDs, and local-only files before each switch. Keep history in Git; keep this page focused on the current state.

## Owner-led prototype checkpoint — 2026-10-20

The owner authorized three landscape prototypes and emphasized desktop playtesting in the current chat. Work is local only on `design/mathly/intake-baseline`; no PR or campaign acceptance. The existing implementation used is `games/tiltstones/index.html`, with source levels in `games/tiltstones/lab/levels.json`. No handover was migrated or replaced.

Added H1 Twin Islands, H2 Open the Heart and H3 Across the Terraces, plus responsive landscape rendering. Simulation and normal-speed keyboard-driven Chrome bot runs completed all three. Desktop and phone-width clipping checks passed. Human playtesting and selecting a direction remain open. Detailed evidence and playtest prompts: `games/tiltstones/lab/LANDSCAPE-PLAYTEST.md`.

Next action: owner plays H1–H3 on desktop and identifies the most promising layout before portrait adaptation. Earlier intake placeholders above are historical and have not been fully reconciled by this bounded prototype task.

### Feedback pass 2 — same day
Owner requested multiple colours, later keys, harder multipliers and more permanent short-bounce geometry. H1/H2 now have blue→red progression; H3 includes a required key gate. Stone occupancy is 14/14/24%. Global combo tuning requires four quick hits for x2 and thirteen for x5, with a 0.7 s gap limit. Earlier records stay stored under their old keys; revised records are separate. Simulation and normal-speed desktop keyboard bot runs clear all three without deaths; chain boundary/reset assertions pass. Local only, same branch, no PR. Next action: owner replays the revised prototypes, particularly H2 cleanup and the short corridors.

### Feedback pass 3 — same day
Added H4 Layer Cake, H5 Opposite Vaults and H6 Three-way Return: enclosed spatial colour layers and reusable blue/red/green wells require return visits to colours. Ball position now enters paint and colour changes at the dip midpoint, before returning to the collision boundary; new pots have top-only approaches created by surrounding stone. Blue paint `A` is supported by rendering, simulation, solver and stuck detection. Dip and combo tests pass. All six H levels clear in simulation; H4/H5/H6 complete 1× desktop keyboard bot runs in 54.6/65.9/92.0 s with no deaths. Desktop/phone horizontal fit checks pass. H6's long gaps remain a pacing concern. The attempted combined key variant was replaced; H3 retains the key challenge. Work remains local on the same branch, no PR. Next action: owner plays H4–H6 and evaluates purposeful clearing, dipping readability and return-trip length.

### Feedback pass 4 — same day
Owner asked for less waiting, creative layouts, permanent/temporary rebound assists, compact boards and a speed/acceleration experiment. Added S1 Paint Shuttle, S2 Broken Staircase and S3 Switchyard at 14 × 9, plus exact-grid S1F (12 vertical/7 horizontal) and S1A (9→16 free-flight acceleration, reset to 9 on impacts). Earlier levels keep their physics. Permanent and grey paint roofs give a verified 0.20 s approach from directly beneath the roof; grey is consumed. Motion, rebound, dip and combo checks pass. All five win normal-speed desktop keyboard bot runs without deaths (20.9/21.8/17.5/18.2/24.1 s respectively). Desktop/phone-width fit checks pass. Local only, same branch, no PR. Next action: owner compares S1/S1F/S1A movement, then S2/S3 layout variety; no global speed choice has been made.

### Feedback pass 5 — same day
Owner approved compact planning puzzles. Added P1 Keep the Return (recoverable grey-roof shortcut), P2 Open Your Way Back (must open blue return well before red), and P3 Unlock the Loop (required key gate plus return for blue). P2 has authored seal detection and a specific failure explanation/restart panel. Live hints frame decisions without giving full solutions. Structural wrong-order checks and browser failure UI verification pass. Normal-speed keyboard bot wins all three without deaths: 26.2/32.1/45.1 s; P2 uses an explicit prepare-return-first test policy after the greedy bot demonstrated the intended mistake. P1 remains solvable after early roof removal; its timing benefit is modest. P3's bot exhibited a long gate-navigation gap, to check with human play. Local preview server restarted on port 8765. Local only on the existing branch; no PR. Next action: owner plays P2 then P3 and evaluates whether an actual plan was necessary and readable.
