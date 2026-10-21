# Mathly — project

- Studio slug: `mathly`; existing implementation slug: `mathly-trails`.
- Owner / design approver: Benji (owner-led session, 2026-10-20). Claude Code implements after explicit design approval; owner controls merge and final acceptance.
- Implementation repository: https://github.com/Trevald/game-studio, default branch `main`.
- Implementation: `games/mathly-trails/index.html`, single HTML/CSS/JavaScript game with BigInt arithmetic; runtime art in `games/mathly-trails/assets/`.
- Targets: phone-first portrait and desktop, keyboard and touch. Minimum browser/OS support remains unspecified.
- Existing packet: `games/mathly-trails/design/handover-v1/` (spec version 1.1). Preserve it.
- Future packet destination: `games/mathly-trails/design/studio/<handover-id>/`, following the existing `design/` convention. No packet delivered in this intake; check collisions again at delivery.

## Mapping evidence

Inspected repository revision `7b5e8306d66ebfc4dac02c8e357b05fcf58f5d2b` on 2026-10-20.
[Existing DESIGN](../../../games/mathly-trails/DESIGN.md) explicitly calls the game Mathly and requires keeping the `mathly-trails` folder for links/history. [BRIEF](../../../games/mathly-trails/BRIEF.md) also declares title Mathly and slug mathly-trails. This is an explicit repository mapping, not a name-based inference. Math Crush is separately identified in its own DESIGN.md.

## Source of truth

Root `CLAUDE.md` and `studio/RULES.md` govern existing studio work. The game's [DESIGN.md](../../../games/mathly-trails/DESIGN.md) supplies web-prototype adaptations to the [full handover](../../../games/mathly-trails/design/handover-v1/DESIGN.md). This studio folder indexes that design and records future proposals; it does not replace or duplicate the existing design master.

The original daily site, https://mathly.trevald.com, is a reference in the existing brief. Its implementation repository, current behavior and compatibility with this prototype are unverified; it was not inspected in this intake.

## Scope

Current task: identify the project and load its design/status. No new mechanic or implementation is approved. Next milestone remains the owner's choice. Standing preferences: adult puzzle audience, phone and desktop, clean visuals, undo and instant restart, no ads/currencies/energy or mandatory timers.

## Owner-directed publishing workflow — 2026-10-21

Benji instructed in this Mathly chat: “Stop doing PRs just commit directly to main”. For subsequent Mathly work, commit and push directly to `main`; do not create PRs. This explicit owner instruction overrides the shared design PR/default-branch restrictions for this work. Preserve concurrent changes, fetch before publishing, use ordinary fast-forward pushes, and never force-push. Design approval and Claude implementation gates still apply; publishing is not design approval.
