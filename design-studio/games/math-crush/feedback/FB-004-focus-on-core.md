# FB-004 — Focus on chains and special candies

Date: 28 October 2026. Status: **owner-requested scope change; development team to implement**. This record contains feedback and acceptance expectations, not a completed implementation or replacement frozen handover.

Game: Candy Match / Math Crush. Baseline runtime: `1c4d9c5`, reviewed on main `add10f5`. Related packet: H-002-v1, especially MC-014, MC-015, MC-016, MC-017 and MC-019. Playtest evidence: [28 October report](../../../../games/math-crush/qa/playtest-2026-10-28.md), published at `0c1a2f0`.

## Owner direction

Benji, Codex chat `01a16481-97fa-7390-92c7-f627ee7ecc0a`, 28 October 2026:

> I agree with most of your feedback. I think for now we can remove the hammer and the suger rush and the time challenge. They all seem like side tracks for the time being

Then clarified responsibility:

> Don't do any code challenges. Thats for the development team to fix. Just write up the feedback to they can act on it

Interpretation: remove these three features for now; focus the game on making chains, creating/combining special candies and earning stars. Design work in this chat is documentation only. “Most” does not approve every earlier proposal or numeric example.

## Requested changes and acceptance expectations

| ID | Change | What the team should verify |
|---|---|---|
| FB-004-A | Remove the hammer (MC-014). | No hammer button, inventory/charge, targeting/confirmation flow, tutorial or help reference. No keyboard or restored-save path can invoke it. |
| FB-004-B | Remove Sugar Rush (MC-015). | No charge meter, bonus-use strip, activation cue or Rush multiplier. Normal long-chain multipliers and striped/wrapped blast scoring remain. Old active Rush states cannot resume with the bonus. |
| FB-004-C | Remove the time challenge portion of MC-017. | No speed challenge entry point, gameplay clock, time record/result row or related help copy. Keep Next, Play again, score and star results. Normal play remains untimed. |
| FB-004-D | Review dependent stickers (MC-016). | Sugar Rush must not remain an impossible collection goal. Perfect Batch currently means “finish without using a tool”; removing the only tool makes that condition automatic everywhere. Recommended: retire both from the active collection for now, retaining earned history. Do not invent a replacement mechanic just to keep six stickers. Check book totals and previously selected badges. This sticker treatment is a designer recommendation, not a separately quoted owner decision. |
| FB-004-E | Preserve progress and verify balance (MC-019 / MC-011). | Preserve unlocked levels, earned stars, existing sticker history and legacy records. Decide explicitly how to archive/restart incompatible active attempts and distinguish earlier Rush-boosted best scores from current scores. No corrupt-save message for a valid older attempt solely because the rules changed. Verify reachable three-star routes without Rush on L8–12; report any threshold adjustments and their evidence. |

## Keep the core intact

Keep direct-to-board starts, brief contextual tutorials for chains/specials, drag and tap selection, Hint, Undo, stripes, wrapped candies, special combinations, score-based stars and the remaining relevant stickers. Preserve readable digits and phone control space after removing the extra controls. No new assets are needed for the requested removal itself.

## Earlier feedback still open

Target-number variety remains a strong next design priority. Current targets are 10 for L1–4, 12 for L5–8 and 15 for L9–12. The suggested mixed sequence in the playtest report is illustrative, not approved or validated level data. Board values, refill behavior and star thresholds need to be considered with any target changes.

Frosting/blockers, longer showcase levels, stronger special/combo feedback and changing targets within a level remain proposals. Do not add them as part of this removal request. The earlier recommendation to improve Rush's duration is superseded by the owner's decision to remove Rush.

## Development follow-up

The development team owns implementation. Use this record as the explicit owner scope update when planning the next revision; keep H-002-v1 frozen. Return a completion report linking the implementation commit, save-migration behavior, remaining sticker choices, three-star reachability evidence and phone screenshots of gameplay/results/collection. Report deferred questions plainly. This feedback is not a claim that the code has changed or passed new tests.
