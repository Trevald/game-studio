# H-001-v1 — Mathly / Playful Deck + Adaptive rows

- State: **IN REVIEW — exact-revision approval candidate; not yet authorized for implementation**
- Owner / approver: Benji. Prepared 2026-10-21.
- Repository: `Trevald/game-studio`; implementation `games/mathly-trails/index.html`.
- Inspected source revision: `51710591d7ab5dec44c0d31e7c13ff4a838f6c1f`.
- Delivery: read this folder in place on main under the studio night-shift convention. Do not create a duplicate packet or a PR.
- Approval record: outside this frozen candidate, in Mathly STATUS and decisions. Do not infer approval from presence on main.

## Scope

Refresh the current web prototype with the selected Playful Deck materials and Adaptive rows. Scope is MATHLY-VIS-001–005 and MATHLY-R-006–009 below. Gameplay and completion screens receive the exact layout contract; other existing screens receive the same palette/components without new navigation/features.

This packet replaces conflicting appearance, gameplay geometry and page/selection behavior from the historical handover for this bounded refresh only. Preserve all 12 existing authored boards, card IDs, arithmetic rules, navigation, local progress, collection access and QA hooks. Specified safe-area, text-size and page-boundary behavior is part of this refresh, not permission to build unrelated features.

Excluded: new puzzles, difficulty tuning, Daily/practice generation, purchases, accounts/sync, factorial, analytics, native app packaging, new audio or haptics, persisted undo history, monetization or rule changes. No automated instruction to start Claude is issued by this packet.

## Read in order

1. `design/SPEC.md`: complete scoped visual/interaction/layout contract.
2. `design/tokens.json` and `design/atlas.html`: exact palette and illustrative state layouts. Open atlas locally; its controls are review controls, not app features.
3. `data/ui-fixtures.json`: explicit card IDs, expected states and boundary examples. Existing data/schema/engine cases are copied alongside as regression inputs, not replacement content.
4. `assets/README.md` and `assets/manifest.json`: runtime files, source art and provenance.
5. `verification/CHECKLIST.md`: required implementation checks and completion report.

Authority: written SPEC and tokens define behavior and geometry; the measured atlas illustrates them; the generated PNG in references establishes material/art character only. Known PNG mistakes (extra success check, tray shifts, ambiguous selection) must not be copied. The atlas is not game code or proof of native accessibility.

## Requirements and coverage

| ID | Requirement | Contract | Acceptance / verification |
|---|---|---|---|
| MATHLY-VIS-001 | Playful Deck hierarchy, materials and typography | SPEC §1; tokens.json | Jade expression area; cream numbers, mint operator tokens; coral reusable palette; yellow target. Hint is not yellow. Compare empty/partial/full/invalid states to atlas. |
| MATHLY-VIS-002 | Distinct editable tokens, fixed five-slot tray and visible caret/selection | SPEC §2–4 | Five stable card identities including duplicate 3s; selection has outline + text; every token ≥44px. Tray top unchanged across empty/partial/full at a fixed viewport/state-panel size. |
| MATHLY-VIS-003 | Restrained feedback and unambiguous solve/review state | SPEC §3,5 | One primary check in result; 600ms in-place solve then completion; no edits while solved/reviewing; reduced motion removes transforms. |
| MATHLY-VIS-004 | Accessible responsive presentation | SPEC §2,6 | Safe-area/layout matrix, 44px controls, contrast/focus, text enlargement, keyboard and screen-reader walkthroughs. |
| MATHLY-VIS-005 | Adaptive rows with explicit paging | SPEC §2,4 | 375×667/390×844 nominal: 7 columns ×3 rows. 320×568 nominal: 6×2. 19-token fixture fits taller screens, compact splits 12+7. No shrinking targets. |
| MATHLY-R-006 | Ship actual runtime raster and preserve vector/live UI | assets/README.md, manifest | WebP loads offline using relative URL; fallback solid jade; no flattened UI/background base64; runtime packet assets <1MiB. |
| MATHLY-R-007 | Preserve arithmetic/content/persistence | SPEC §7; data/ | All 12 existing boards still solvable; exact fractions, invalid cases and require-all unchanged; saved completion and current attempt survive update/reload. |
| MATHLY-R-008 | Consistent existing shell screens | SPEC §5 | Home, collections/detail, completion, help/settings use tokens; no dead Daily/purchase entries or new features. |
| MATHLY-R-009 | Verification and implementation feedback | CHECKLIST | Report code commit, this packet/version, each criterion, actual commands/results, environment/screenshots and known limitations; distinguish not run from passed. |

## Implementation entry points

Inspected `games/mathly-trails/index.html`: CSS and `cellGeometry`/`renderPlay` govern layout; `placeCaret`, `clickToken`, drag functions and page state govern selection; `onSolved` transitions after 600ms; `renderDone`, `renderHome`, `renderCollections`, `renderCollection`, settings/help sheets cover the shell. `analyse`, rational helpers, E edit transactions, embedded LEVELS and `SAVE_KEY = mathly.v1` are existing behavior to preserve. Keep `window.__qa` hooks operational. Do not use the atlas as a replacement engine.

Before coding, inspect latest main for concurrent changes and report discrepancies against the pinned baseline. Commit implementation directly to main under studio rules, only after this exact candidate is approved. Read packet in place; copy only runtime assets to the game assets directory. Do not edit the frozen packet to resolve implementation questions: raise an FB record with affected IDs.

## Owner decisions and remaining questions

Playful Deck was selected explicitly; Adaptive rows was selected explicitly. Owner said the v2 refinement “looks really good” and requested this handover and non-SVG assets. Those statements authorize this preparation and establish direction, not approval of every newly specified detail. Exact packet revision approval remains the only pre-implementation gate for this scope.

Historical O1–O9 product questions are not silently resolved: this refresh preserves current prototype rules, uses no native store/backend, and changes only the scoped presentation/editing contract. There is no new release platform claim. Asset provenance is recorded honestly; no independent copyright/legal clearance is asserted.

## Readiness

- [x] Repository, current code and shared instructions inspected.
- [x] Scope, exclusions, requirement IDs and checks supplied.
- [x] Screen states, adaptive geometry and boundary editing behavior specified.
- [x] Existing level schema/data and invalid/boundary fixtures included.
- [x] Runtime bitmap, source PNG, SVG icons, prompts and provenance packaged.
- [x] Generated-reference discrepancies identified; written specification wins.
- [x] Candidate material can be reviewed independently of chat.
- [ ] Exact candidate commit approved by Benji (record externally).
- [ ] Implementation and device/accessibility verification completed by Claude.

## Suggested Claude kickoff after approval

“Read root CLAUDE.md, studio/RULES.md, Mathly STATUS and the approved packet at design-studio/games/mathly/handovers/H-001-v1/. Confirm the approval revision and scope MATHLY-VIS-001–005 / MATHLY-R-006–009. Report a short implementation plan and blockers, then implement that scope in games/mathly-trails. Preserve puzzles, arithmetic and saves. Publish directly to main and provide the requirement-by-requirement completion evidence in a feedback record.”
