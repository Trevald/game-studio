# Math Crush — status
Updated: 2026-10-23. **Sweet play v1 is a draft design exploration for owner review; not an implementation handover.**

## Current design review

- Review: `explorations/sweet-play-v1/index.html` (seven interactive scenes), `overview.html`, `DESIGN.md` (MC-010–019), and `VALIDATION.md`.
- Captures: `explorations/sweet-play-v1/previews/`. Related playtest: root `games/math-crush/qa/playtest-2026-10-22.md`.
- Decision record: `decisions/ADR-002-play-first.md`. Owner requested learn-through-play and designs covering tips, special blocks, tools, temporary bonuses, achievements and speed/star changes. Exact chat wording and approval boundary are recorded there. Individual mechanics and constants remain proposed.
- Current runtime is Match-only, per owner direction recorded in `feedback/FB-002-match-only.md`; do not restore the removed modes. FB-001 reports the H-001-v1 implementation and the unresolved Level 2 star ceiling (687 versus 900). The old status below is retained as historical authorization, not current implementation status.
- Work based on b3bab94; publishing from main after d636a14, preserving the intervening Pip Push work. This package is identified by the commit adding `sweet-play-v1`; publication follows the standing direct-main preference. It changes design material and saves playtest evidence, not the game runtime or frozen packet.
- Checks: all seven prototype scenes at 360, 390 and 1280 widths; no horizontal overflow or enabled button below 44×44; key interactions and JavaScript syntax checked. Not child-tested or balanced; see VALIDATION.md.
- Unresolved: first-release scope, final naming, authored tutorial boards and star tuning. Caramel, linked gummies and Licorice Split need further rules before implementation. No approval or implementation dispatch is implied by publishing the draft.
- **Next action:** owner reviews the design study and selects scope; then prepare a new bounded handover, preserving H-001-v1.

## Historical H-001-v1 authorization (21 October 2026)

Approved handover: `handovers/H-001-v1/HANDOVER.md`, scope MC-001–009 with the phase priorities and prototype defaults recorded there. Publication target: main, direct push, no PR. Packet hash manifest: handovers/H-001-v1/SHA256SUMS.txt. Delivered revision is the commit adding this packet on main; verify the manifest before implementation.

## Owner authorization
Benji, this Codex chat `01a15e41-fe8f-7601-902e-c3250203b5a9`, 21 October 2026: “Create the hand-over to the Game Studio so they can work on this tonight. Any assets that can't be created as SVG should be included. Use the folder in the repo for the handover. If you can just push this main without a PR I would appreciate it.”

Earlier direction: Candy Theme was really good; refine it; multipliers for more than two blocks; explore explosive special blocks. He requested improved between-game screens and gameplay state visuals. This is direct authorization to prepare and deliver a buildable overnight iteration, overriding the normal PR/exact-commit approval ceremony for this packet. It is not a claim Benji reviewed the final written constants: multiplier, spawn, stars and optional timing rules are designer-selected prototype defaults within that iteration. Final balancing and acceptance await playtest.

## Intake and checkpoint
Inspected latest main at42a9a88, Night1 report, runtime entry points and open R1–R3. Owner's candy preference takes precedence over the earlier reviewer's preference for Clear. Existing art reused; reference previews bundled. Baseline data preserved. No production code changed by this delivery. Existing v1 approval history is not retroactively invented.

R1 partially addressed by chain rewards; cancellation and Clear warning unchanged. R2 repeated levels remains open. R3 fourth prototype deferred. Timer optional/off by default, no rush mode. No blocker for the bounded iteration; thresholds need engine-based verification and human playtest.

Next action: night studio reads H-001-v1 from main and implements Phase A then B, Phase C if time allows; returns feedback/FB-001-candy-refinement.md. No dispatch to external ideas board is claimed by this file.
