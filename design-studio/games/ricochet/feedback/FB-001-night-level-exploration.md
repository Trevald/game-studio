# FB-001 — Night level exploration (H-001-v1)

- Kind: completion-report
- State: resolved (awaiting owner playtest; no acceptance implied)
- Game / packet version / requirement IDs: Ricochet / H-001-v1 / RIC-N-001 – RIC-N-007
- Implementation issue or PR / code commit: straight to main — `ed8c9aa` (brief), `05b4f6f` (N1–N3 + tools), `16f065f` (lab intro, shots), `c7f1cfc` (reviewer fixes), night log commit `tiltstones: night 4`
- Raised by / date: night studio (03:50 shift), 2026-10-21
- Blocking scope: none
- Play: https://claude.ai/artifact/VAXzjHmZLmMTJS5zQsRJH4 (Level Lab → N1, N2, N3 at the top)

## Observation or question

No board note dispatched Ricochet; the shift built H-001-v1 because STATUS records it as approved for one
overnight exploration shift. If hand-overs should only be built after a board note, say so and the studio will wait.

The published artifact was still the night-3 build, so the S/H/P baseline from `11ce07d` was not playable from the
link until tonight. It is now (same URL).

## Candidates (final v5, 14 × 9, standard speed, 0.5 s dip, combo unchanged)

```
N1 Twin Harbours       N2 Red Door Circuit    N3 Return Ticket
..............         .bb...aa....bb         ..aa..........
.##aaa..bbb##.         ......##......         .#bb#....####.
.#a.*a..b*.b#.         .a..b....a..b.         .#aa#.**..bb..
.#aa......bb#.         ....#..##.....         .#bb#.....##..
.###..#B#.###.         .##.#B####b###         ....aa..aa..b.
...a...#..b...         ..b..#a...a...         ..####..####..
..a...##...b..         .##..##..##.a.         .a.b......b.a.
...a..o...b...         ...b...o....#.         ..b......o....
.#A#..##..##..         .#A#.......##.         .#A#.#B#..##..
```

- **N1 — compact two-destination crossing.** Two mirrored H-style harbours; you enter each from below through its
  mouth and rattle inside a 3-row pocket. The red well sits on a stone pillar in the chimney between the mouths, so a
  crossing passes it; dipping early is recoverable through the reusable blue well.
- **N2 — shortcut circuit.** A stone shelf splits the field into two floors that both hold blue and red. As blue the
  way up is the pair of left gaps; once red, breaking the red door at (10,4) opens a short right-hand route between
  floors. The red well sits on the shelf, entered from above.
- **N3 — colour-route puzzle.** A vault of red caps holds blue next to the blue well, and a red plug sits on that
  well. You need red to open the vault and the plug, then return to blue to finish the vault. Never a soft-lock:
  both wells are reusable and the plug is red.

Recommended directions: **N1** (most readable, shortest waiting at 1×) and **N2** (two floors, a door that changes
the route). N3 is the weakest: a shrunken shell, and the return also appears in S2/S3 play.

## Implementation completion

| Requirement | Implemented behavior | Check actually run | Result / evidence |
|---|---|---|---|
| RIC-N-001 | N1–N3 added first in the Level Lab; no existing map touched | Map diff vs `reference-levels.json` (S1/S2/S3/H1/H2 identical); reviewer diff vs `ed8c9aa` (only LAB insert + intro text); `node games/tiltstones/lab/witness.mjs design-studio/.../solution-witnesses.json` | 5/5 witnesses won with 3 lives. Distinct decisions: N1 crossing between two harbours, N2 floor circuit with a door, N3 colour return through a vault |
| RIC-N-002 | Persistent stone roofs/pillars in every candidate; paint approaches from above | `measure.mjs`, `trace.mjs` cleared-board snapshot | Longest 1× flight 5.0–5.7 rows (S1–S3: 7.3–8.4 at night-3 baseline). Open run after clearing is 9 rows in all three, caused by the open edge columns (same as S1–S3); a stone nub at the N1 edge created a dead-end pocket the solver could not leave (v3), so it was removed |
| RIC-N-003 | N2 red door; N3 red vault caps and plug | `node games/tiltstones/lab/access.mjs` before/after runs | N2: blue ball at lower right → upper blue (9,2): door closed 3.7 s (left route), door open 0.9 s. N3: blue ball can't reach vault blue (2,2) until red breaks the caps; route paint red → caps → paint blue → (2,2). N1 has no such block (only two required) |
| RIC-N-004 | Blue/red in all; reusable A and B wells, all entered from above with solid sides; N3 needs blue → red → blue | `trace.mjs` (paint/dip events), reviewer fuzz | N3 route paints red at 7.8 s and blue again at 20.4 s (v3 trace). Reviewer: 30/30 random-play prefixes recoverable; no unrecoverable state |
| RIC-N-005 | Witnesses, 1× keyboard bot, visual checks | `make-witness.mjs` → `lab/night4-witnesses.json`, replayed with `witness.mjs`; `play1x.mjs N1/N2/N3` (Playwright, real key presses, planner decides every 0.2 s); `night4/shots-n.mjs` phone 390×844 + desktop 1280×800; reviewer agent real-time keys and touch | Witnesses 3/3 won, 3 lives (13.8 / 13.3 / 28.7 s). All runs are **bot play, not human play**. Screenshots: `games/tiltstones/lab/night4/*.jpg`. Phone fits with no horizontal scroll, ~24 px cells |
| RIC-N-006 | 5 versions, each revised after play | `lab/night4/v1…v5.json`; metrics below | See revision table |
| RIC-N-007 | Published, ranked, questions | Artifact publish with all 16 assets; studio QA `node tools/qa/playtest.mjs games/tiltstones/index.html` | 17/17 checks, 35 levels solvable; ranking and questions in this file and on the board |

### Revisions (solver clear / dead %; 1× bot clear / dead % / worst gap — single samples, ±30% run-to-run)

| | v1 | v2 | v3 | v4 | v5 (final) |
|---|---|---|---|---|---|
| N1 | 19.1 s / 33% | (same map) 1×: 17.9 / 38% / 5.7 | crossing blocks added: 13.8 s / 18%; 1×: 19.5–26.6 / 45% / 5.1–5.4 | well moved to central pillar, harbours mirrored: 13.8 / 29%; 1×: 14.8–20.1 / 21–38% / 2.1–6.5 | inner columns open from below: 13.7 / 28%; 1×: 13.1 / 19% / 2.1 |
| N2 | "Grey Gate" wall: 14.4 / 26% | two floors + trapdoor: 13.6 / 28%; 1×: 18.8–31.7 / 37–64% / 2.9–16.9 | upper ribs: 13.5 / 24%; 1×: 14.2–20.0 / 23–47% / 2.0–4.5 | — | red door, left gaps: 13.2 / 29%; 1×: 20.6 / 41% / 3.6 |
| N3 | 19.9 / 21% | vault on the right: 29.2 / 40% | vault next to blue well, red well centred: 23.7 / 28%; 1×: 22.2–30.6 / 25–37% / 2.7–4.7 | — | start greys removed: 28.7 / 38%; 1×: 28.9 / 33% / 2.7 |

Deaths: 0 in every run (no skulls). Same-night 1× bot on S1/S2/S3: 15.8 / 19.9 / 20.2 s.

### Reviewer (separate agent, on v4)
Verdict "ship with fixes". Fixed tonight: greys broke in the first seconds (N2 trapdoor → red door; N3 greys
removed), N1 pocket cleanup (6.9 s gap), N3 hint implied a commitment that doesn't exist and named the R key on
phone. Not fixed: N3 still resembles the shell family; phone cells are small (orientation open).

### Deviations, limitations
- No speed variant, no size comparison, no controlled variation (time).
- Solver and 1× numbers are bot runs on a 2-core machine; parallel runs distorted times, so final runs were sequential.
- Dead-time metric limits from H-001 apply.

## Owner playtest questions
1. After you know the plan, which is nicer to steer through: N1's two harbours or N2's two floors with the red door?
2. N1's red well sits in the chimney between the harbours, so you often turn red early and come back for blue. Fun detour or annoying?
3. Should N3's return idea be dropped, or redesigned around a real route choice?

## Resolution and closure
Owner playtest pending. The studio will fold answers into the next night only through a new approved hand-over or a board note.
