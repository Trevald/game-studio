# H-001-v1 — Ricochet: one night of level-design exploration

State: approval candidate; not an approved campaign design. Prepared 20 October 2026.
Owner: Benji. Implementation: `games/tiltstones/` in `Trevald/game-studio`.
Baseline: commit `11ce07d28015c1ee58357f231916e6b4c8b1e987` (the complete playable exploration from this chat).

## Owner direction and approval boundary

Latest feedback, verbatim: “I think the S-levels are the ones that are most interesting. But also the H levels. This is tricky. Summarise what we explored and the game studio will keep working on level design this night.”

This authorizes preparing the summary and proposed overnight scope. It does not select a final design, approve this exact packet revision, authorize a campaign replacement, or approve a speed variant. Approval belongs outside this packet in STATUS. Source: this Codex chat, `01a1592e-dcf9-7571-92df-4caa00170625`, 20 October 2026.

Night integration source: `design-studio/integration/NIGHT-STUDIO.md` on `origin/main`, read after fetching. Shifts read **main only**, use an approved handover named in STATUS, and read it in place. Do not copy this packet to `docs/design/studio/`. Before dispatch, ensure both the baseline implementation and this approved packet are on main. A branch, localhost preview or open PR is not delivery. Do not replace the runtime with main's older version while merging this work.

## Session summary

1. **Diamonds references:** vertical autonomous bounce plus horizontal steering; recognisable islands, shelves, purposeful gaps and colour barriers. Landscape gives horizontal travel room. Screenshots supplied by Benji were look/structure references, not exact layouts to copy, and are not redistributable production assets.
2. **Existing World 1 and L1–L10:** sparse portrait targets first, then dense corridor experiments. More density and short flights alone did not establish better play. Preserve these for comparison, not as the preferred direction.
3. **H1–H3, 18 × 10:** two islands, a central structure and terraces. Initial blue-only versions were too boring beyond a tutorial. Added blue/red, permanent short-bounce walls and a required key gate on H3. Benji said the structures improved. Later he still found H interesting; he did not choose a specific H level or historical revision.
4. **Multiplier tuning:** ordinary clearing earned it too easily. Now same-colour breaks must be at most 0.7 s apart: hits 1–3 x1, 4–6 x2, 7–9 x3, 10–12 x4, 13+ x5. Repaint/timeout/respawn reset. This is implemented tuning, not final balance approval.
5. **H4–H6, 20 × 12:** nested colour shells and reusable blue paint introduced blue→red→blue and three-colour returns. Clearing reveals another colour. Benji found these too similar and travel too slow. They teach a useful dependency, but do not keep making concentric-shell levels or enlarge the board to add complexity.
6. **Paint:** Benji wanted the ball actually inside the paint. New wells are entered from above, with solid sides. The simulated ball enters, changes colour at the midpoint and rebounds out over 0.5 s; blue paint is reusable. Keep this behaviour. Earlier side-entry pots still work for older levels.
7. **S1–S3, 14 × 9:** Paint Shuttle, Broken Staircase and Switchyard. More permanent geometry, roofs above paint, irregular pockets and temporary grey rebound aids. Benji explicitly preferred the smaller board and found these more interesting. This is the strongest current starting point.
8. **S1F/S1A:** identical shuttle layout with fast constant movement or free-flight acceleration/reset on impact. Both playable; no owner preference recorded. One keyboard-bot sample favoured constant-fast, not acceleration. Do not turn that into a human preference or global default.
9. **P1–P3, 14 × 9:** preserve a disposable shortcut, open a blue return well before red, and unlock a colour loop. They explore planning; they are not the chosen direction. P1's shortcut saves only 0.2 s in the local test and is recoverable. P2 provides a genuine order constraint and a readable failure/restart message. P3's bot spent too long navigating despite a fast solver clear. Latest owner preference returns to S and H rather than promoting P into a campaign.

**Working synthesis:** pursue compact, lively S-style traversal with some recognisable H-style structures and occasional readable colour/route decisions. The level should be enjoyable to steer through even after its plan is understood. This synthesis is a proposal for exploration, not a settled design.

## One-shift scope

Produce **three meaningfully different candidate levels**, plus at most one controlled variation if time allows. Use new IDs `N1`–`N3` (check for collisions first); preserve all current examples and records. No campaign replacement, new world, art production, scoring overhaul, new tile system, global speed change or orientation lock.

Suggested experiments, not prescribed grids:

- Compact two-destination crossing: distinguish the destinations visually; paint roofs and alternate approaches prevent empty travel. Borrow H's recognisable structure without its large empty arena.
- Asymmetric shortcut circuit: temporary grey rebounds and permanent stone provide different route choices. Destroying a grey block should visibly alter the next trip, not merely add work.
- Small colour-route puzzle: one clear dependency changes which route is useful, while keeping both sides active. Prefer recoverable planning over hidden irreversible traps. Do not introduce a dependency solely through explanatory text.

Keep levels 14 × 9 by default. One deliberately justified compact size comparison is allowed, but do not repeat the 20 × 12 expansion. Keep standard speed 9 vertical/5.5 sideways as the control. If testing speed, duplicate one layout under a separate ID using the existing fast or accelerating mode. Keep the 0.5 s dip and current combo tuning fixed to avoid confounding layout results.

## Requirements and acceptance

| ID | Requirement | Acceptance / evidence |
|---|---|---|
| RIC-N-001 | Preserve baseline and provide three distinct compact candidates | Existing L/H/S/P maps and campaign unchanged; new IDs; explain each candidate's different traversal or planning decision. Palette swaps or rings with different colours do not count as distinct. |
| RIC-N-002 | Geometry reduces waiting | Each candidate has a deliberately placed persistent rebound aid and a useful paint approach. Inspect the cleared-board state as well as the initial state; explain long flights and cleanup gaps. |
| RIC-N-003 | Give breaking a purpose | In at least two candidates, clearing a specified block changes access or a subsequent approach. Demonstrate before/after state and a solution route; do not count merely reducing the remaining-block total. |
| RIC-N-004 | Keep colour interaction readable | Multiple colours; reusable blue where return is needed; pots visibly entered/dipped/rebounded. At least one candidate needs a return to an earlier colour. No unintended unrecoverable state. Any intended commitment has an understandable consequence and instant restart. |
| RIC-N-005 | Test through play, not only solving | Each final candidate has a deterministic solution witness, a normal-speed keyboard playthrough, visual inspection, and desktop/phone layout checks. Clearly distinguish bot play from human play. Observe missed approaches, paint detours and final-block cleanup. |
| RIC-N-006 | Iterate from evidence | Revise each candidate at least once after playing it. Report before/after, useful-hit gaps, clear time, deaths, longest flight and structural changes. One solver success alone is not acceptance. |
| RIC-N-007 | Deliver an actionable morning comparison | Publish the playable private build under the night runbook, preserve assets, and return a concise ranking with reasons, unresolved issues, and 2–3 specific owner playtest questions. Record requirement-by-requirement evidence in the design feedback file. |

No mandatory timer. Existing touch buttons/keyboard/tilt fallback, pause, instant restart and readability remain. Desktop landscape is an explicitly authorized exploration context; still verify fit at 390 × 844 and usable touch controls. Phone desirability and final orientation remain open.

## Baseline contract and files

Runtime is one `games/tiltstones/index.html`; assets remain under `games/tiltstones/assets/`. No new assets required. Existing art manifest: `games/tiltstones/design/handoff-v1/IMPLEMENTATION.md` at the baseline commit. Do not copy attached Diamonds artwork into runtime.

Level source is `games/tiltstones/lab/levels.json`; `node games/tiltstones/lab/build.mjs` injects it into the runtime. Each level has unique `id`, `name`, `family`, `idea`, `hint`, and rectangular `map` (top-to-bottom rows). Optional `motion` is `fast` or `accelerating`; absent means standard. Optional `blueReturnSeal: [x,y]` is an authored single blue plug sealing the only blue well, used by P2's failure detector; do not set it without proving that condition, and do not assume it is a general reachability detector.

Legend: `.` air, `o` one start, `#` permanent stone, `g` grey (breaks with any colour, excluded from win requirement), `a/b/c/d` blue/red/green/gold blocks, `A/B/C/D` reusable paint, `*` diamond, `k` key, `L` lock, `x` skull. Boundaries bounce. Keys are consumed by locks. Colour blocks break only on a matching ball; diamonds activate only after all colour blocks are gone. Start blue; all colour blocks and diamonds must clear. Pots/keys/diamonds rebound the ball. No gear is required.

`reference-levels.json` is an exact snapshot of S1/S2/S3/H1/H2 from the baseline, **reference examples**, not newly approved campaign content. `solution-witnesses.json` contains executable action sequences for those five, generated and replayed against that engine commit. `left/right/stay` each means six fixed 1/60 s steps (0.1 s). Load level by ID, create a fresh game, call `applyAction` for each action; expect `screen === "won"`, lives 3. Replay witnesses before interpreting any engine changes; regenerate for changed grids/physics. Other experiments and their tests remain pinned in the baseline commit.

Invalid cases to reject: unequal row lengths, unknown tile symbols, duplicate IDs, no/multiple starts, inaccessible required colour paint, keys insufficient for required locks, falsely configured return seal, and a level whose advertised safe route requires death. Deliberate P2-style failure must be tested separately from the winning route.

## Validation and limitations

Available commands:

- `node games/tiltstones/lab/build.mjs`
- `node games/tiltstones/lab/measure.mjs ID...`
- `node games/tiltstones/lab/play1x.mjs ID...` (Playwright; `PLAYWRIGHT_CHANNEL=chrome` may select installed Chrome)
- `node games/tiltstones/lab/check-motion.mjs`, `check-rebounds.mjs`, `check-combo.mjs`, `check-dip.mjs`, `check-puzzles.mjs`
- Normal studio QA: `node tools/qa/playtest.mjs games/tiltstones/index.html`

Update the playtest harness's desktop-ID selection for new N IDs (currently H/S/P) or make it derive viewport from map orientation. The P2 test planner deliberately prepares the return well before considering red; do not mistake that run for an unguided player. Local screenshots/JSON may be ignored by Git and are not guaranteed to travel. Reproduce needed evidence and keep delivered images modest.

Recorded normal-speed keyboard-bot results (single samples; **not human pars**):

| Family | Clear seconds | Interpretation |
|---|---|---|
| H1/H2/H3, after colours/stone | 20.2 / 32.4 / 25.9 | Earlier 0.13 s dip timing; not directly comparable with current 0.5 s dip. |
| H4/H5/H6 | 54.6 / 65.9 / 92.0 | Owner found similarity and travel problematic; H6 had a 9.5 s productive-hit gap. |
| S1/S2/S3 | 20.9 / 21.8 / 17.5 | Strongest owner preference; still 40–43% measured dead time in this sample. |
| S1F/S1A | 18.2 / 24.1 | Controlled layout comparison; fast longest gap 2.7 s vs standard 3.6 s and accelerating 4.1 s. No human selection. |
| P1/P2/P3 | 26.2 / 32.1 / 45.1 | P2 uses intended strategy; P3 maximum gap 26.4 s suggests execution/planner trouble, not necessarily a good puzzle. |

Dead time in current tools sums the part of each interval between useful hits exceeding 1 s. It is an imperfect proxy: planned travel may be useful, and a bot may navigate poorly. Tool gaps can differ from felt waiting; do not optimize this metric at the cost of control or variety. A zero-death run in a level without skulls is not evidence of challenge. Human feedback in this summary is qualitative; no human timings were recorded.

## Open decisions and defaults

Final speed/acceleration: open, standard-speed control tonight. Final portrait/landscape: open, compact landscape experiments with phone-fit checks. Campaign/tutorial sequence: open; candidates freely selectable. How much irreversible planning: open; prefer recoverable routes and one optional readable commitment. Winning level family: open; S first, H-informed alternatives, P ideas selectively. Names/branding: leave current Ricochet runtime/folder naming unchanged.

## Morning return

Write `design-studio/games/ricochet/feedback/FB-001-night-level-exploration.md` (use next available ID if taken), with RIC-N requirement results, commits, published play URL, exact commands actually run, solver witnesses, actual keyboard/bot/manual test methods, compact screenshots, before/after revisions, remaining issues, and the recommended 1–2 directions. Follow the night runbook for its code/log/board work. Do not modify this approved packet or designer STATUS during the shift. No follow-up approval or final campaign acceptance is implied by the overnight experiment.
