# Design requests — Math Crush (working title)

Requests for Benji's designer (ChatGPT). Each one must stand alone: the designer can't see the repo
unless Benji connects it, so include everything needed. Newest first. When a hand-off answers a
request, mark it `answered` and note where the result landed.

Context for all requests: Math Crush is the "Candy Crush but math based" idea, built from the designer's
hand-over v1 (19 Oct) as three portrait prototypes in one page: **Match** (drag orthogonal chains that sum to
the target; refill), **Equation** (six number tiles + reusable + − ×, standard precedence, three rounds),
**Clear** (pick pairs/triples anywhere that sum to the target; finite board; Undo; Stuck). Night 1 (20 Oct)
implemented the hand-over's rules and loaded all 36 starter levels as delivered. A separate reviewer
playtest found the issues below. The studio has not changed rules or level data; it is asking.

---

## R3 — Fourth prototype: operators on a board? · status: open

**Context:** Benji's idea says the hard part is "match numbers *and operators* on that board". Of the three
prototypes, Match and Clear are addition-only boards, and Equation has operators but no board (a fixed
6-tile tray, nothing consumed or refilled). None of them tests operators on a board that empties or refills.

**What's needed:** Decide whether a fourth comparison prototype is wanted, and if so its rules. One cheap
candidate the studio can build on the Clear engine: "a group of 2 may combine as a+b, a−b or a×b to make the
target" (operator chosen implicitly, no extra input), finite board, Undo, Stuck.

**Constraints:** Same shell, screens and scoring style as the others; no timers, no lives.

**Deliver as:** a short rules section in the hand-over's format plus 4–12 boards with partition witnesses.

**Meanwhile the studio:** nothing built; the three delivered prototypes only.

## R2 — Starter levels repeat and barely ramp · status: open

**Context:** The hand-over says the starter data is "seed content, not playtest-balanced". Playing it confirms that.

**What's needed:** Revised level data where each level is distinct and harder than the one before:
- **Clear:** levels 1–4, 5–8 and 9–12 are each the same multiset of values reordered. Levels 1–4 (pairs only,
  complementary) can never get stuck: 200/200 random playthroughs won. Levels 5–12 are the fun part (random
  play gets Stuck ~50%).
- **Equation:** level 12's rounds equal level 9's; several trays repeat (1.1 = 1.2 = 4.1 = 4.2; 5.1 = 6.2 = 7.3
  …). "Mixed" levels 9–12 are often solvable with two numbers.
- **Match:** every board opens with its witness pair in the top-left corner (cells 0–1).

**Constraints:** Keep the JSON schema of `starter-levels.json` (match: values/seed/target/quota/moves/witness;
equation: rounds with values/target/witness; clear: values/rows/cols/maxGroup/partition).

**Deliver as:** a replacement `starter-levels.json` plus validator run.

**Meanwhile the studio:** loads the v1 data unchanged.

## R1 — Tension in Match and dead-end warning in Clear · status: open

**Context:** Reviewer playtest of the spec as written.

**What's needed:** decisions on three rule details the studio should not change on its own:
1. **Match has no pressure.** Boards hold 16–86 valid chains, a valid chain is guaranteed after each refill
   and there are 2 spare moves, so which chain you pick never matters. Fewer spare moves? Score/quota that
   rewards longer chains? Something else?
2. **Match cancel.** "Release anywhere evaluates the chain", so once two tiles are selected a change of mind
   costs a move unless you drag back to one tile. Should releasing outside the board (or on the first tile)
   cancel for free?
3. **Clear dead ends.** The spec deliberately lets play continue when legal groups remain but no full clear
   exists, so players can be doomed several moves before Stuck. Should the game say so as soon as it happens
   (the solver already knows), or keep it as hint-only?

**Constraints:** no timers, no lives; keep Undo unlimited in Clear.

**Deliver as:** a short rules amendment.

**Meanwhile the studio:** implements the v1 spec exactly (release evaluates; Clear warns only via Hint/Stuck).
