# Math Crush opening-flow playtest — 22 October 2026

Build: b3bab94. Tested the pulled local build through the browser, bypassing an initially cached older page. Completed levels 1 and 2; inspected level 3 briefing and level 1 replay. Used the narrow browser layout. This is an adult heuristic playtest, not testing with children or a full campaign balance audit. Existing local progress from the previous attempt was present; level 1 was restarted through Choose level. No game code changed.

## Main finding

The updated home is concise. The largest reading burden is the first-level scoring tutorial, and the teaching does not align with the reward system: examples and hints teach pairs, while stars require much stronger chains.

## Observations and recommendations

1. **Teach the gesture before score arithmetic.** The level 1 briefing combines target, quota, moves, pair example, star thresholds, multipliers, and `3 + 3 + 4 = 10 → 125 ×1.5 = 187`. It offers Got it, Skip, Let's play, and Back. Replace the tutorial with an on-board highlighted first chain and one instruction: “Drag these candies to make 10.” Introduce longer chains after the first success. Keep exact scoring in optional help. The displayed integer 187 also obscures rounding from 187.5, which is unnecessary teaching friction.

2. **Align early rewards with the taught strategy.** Level 1: three valid pairs, no hints or Undo, two moves remaining, 400 points, one star. Level 2: a pair plus two three-candy chains, two moves remaining after Undo, 574 points, one star; thresholds were 600 and 900. The latter was marked Assisted. These results do not prove three stars are impossible; they show the basic lesson does not prepare players to earn them. Tune the opening levels for a satisfying learning curve and demonstrate the strategy needed for higher stars.

3. **Make star progress visible while playing.** The board shows three empty stars, with accessibility text saying stars are awarded at the end. Fill a score-progress meter against the thresholds so longer chains have a legible benefit before the result screen.

4. **Reduce repeated briefing screens.** Next level opens another Let's play briefing. Levels 2 and 3 repeat target 10, three chains, five moves, and the same 1 + 9 example. Continue directly to the board when no new mechanic is introduced; show a compact objective banner there.

5. **Fix tutorial dismissal semantics.** Starting level 1 via Let's play without Got it or Skip leaves the full tutorial visible when replaying the completed level. Starting/completing the lesson should count as having seen it, with help available on demand.

6. **Support experimentation without a penalty label.** Over-target selections consume a move, but Undo restores it correctly. Hint visibly highlights a pair. The result labels assistance “Assisted.” For the first teaching level, let invalid chains reset without charging a move. Keep assistance tracking out of the main celebration; use hints to demonstrate longer chains once basic pairing is understood.

7. **Offer immediate replay.** The observed win dialog offers Next level and Levels but no Retry. Add a secondary Replay button for players chasing stars.

## Timing: checked separately in implementation

The current build defaults Speed bonus off. Stars use core score and exclude the optional speed bonus. The timer counts up; it does not cause a loss. The stored timed record is a best combined score (`core + speedBonus`), not a fastest completion time. If the ambition is to beat a personal best time, record and display that separately. These timing findings are from code inspection, not a timed gameplay trial.

## Keep

- The concise updated home and prominent Continue action.
- Large, readable candy numbers and the prominent target.
- Visible hint highlighting and functional Undo.
- Short in-play feedback and positive win headline.

## Suggested first-session flow

Play → board with “Make 10” → guided pair → celebration → guided longer chain → finish and reward. Introduce each special candy only when it becomes available. Put score formulas and advanced rules in optional help.

Evidence: `playtest-2026-10-22-briefing.png` shows the level 1 replay briefing after completion.
