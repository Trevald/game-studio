# Acceptance checklist and evidence

Packet check: python3 -B data/validate.py; shasum -a256 -c SHA256SUMS.txt. These are independent design checks only.

| Requirement | Production acceptance |
|---|---|
| MC-020 | Fresh and legacy saves: no sticker/book/badge/toast/award/action/asset requests. Legacy data preserved verbatim. |
| MC-021 | Each authored level loads with correct mask/operation/targets/witness; no4-level same-target blocks. Classic unchanged. Actual engine replays every included full solution route and scores match. |
| MC-022 | No selection through void; segmented gravity survivor order, fresh draw order, blast across hole, clipped wrapped/combo, jelly removed once by direct/blast hits, no respawn; jelly win on last move wins. |
| MC-023 | Advance only valid clears, after feedback; refill legal for NEW target; invalid/hint/cancel unchanged; Undo and reload restore correct index; final target no phantom transition. |
| MC-024 | Region paths/labels/order,44px targets, accurate thumbnails, frontier/locks/stars, current node visible above sticky shelf, manual scroll stable, keyboard map access; no blocked Next at preview10. |
| MC-025 | Normal/reduced-motion clips, hidden/pause behavior, no unreadable numbers, bounded lock≤900ms and idle particles; effects never consume RNG. |
| MC-026 | Multiplication legal/illegal expression fixtures, distinct operation/scoring multiplier, trailing1 legal, product-aware solvability/repair, no mixed operators. PhaseD gated until tested. |
| MC-027 | Old core-v1 attempt exact resume; old stars/records remain Classic; journey separate; unknown-version archive; corrupted and storage-blocked cases; atomic win and Undo snapshots;360×640,390×844,1280×800,150%text and keyboard/screen-reader checks. |
| MC-028 | Per-ID completion report with actual commands, engine commit, private playable URL, screenshots/recordings, deferred scope and owner playtest questions. |

Explicit boundaries: duplicate selected ID; diagonal or across-hole jump; touching a void; ninth tile; addition target10 with2+3=5; product12 with2×3=6; valid product1×3×4=12; charged invalid on final move; zero-move successful jelly clear; overlapping blasts on same patch; fresh reward immunity; changing-target repair; old target chain submitted after transition; interrupted animation reload; quit preview then resume Classic; phaseD installed after preview10 completion.

Keep existing node tools/qa/playtest.mjs checks; extend engine tests to masks/objectives/operations/target sequences and record results. Don't reuse old36-level completion claim: current Classic12, Journey preview10/12 must be counted separately. Do not call independent-model witness scores production tests.

Playtest comparing short-chain and long-chain strategies, with/without special planning. At least one normal-speed, non-solver playthrough per new mechanic; report dead waiting, wrong-target attempts, unhelpful specials,1-padding in multiplication and mistaken jelly-as-number interactions. Never equate automated input speed with human difficulty. Need real device/audio/screen reader evidence separately; mark not run if unavailable.

Morning report path ../../feedback/FB-006-journey.md. Frozen packet stays unchanged; propose deviations and tuning separately. Only complete the phase whose requirements actually pass.
