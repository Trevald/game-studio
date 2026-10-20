# Mathly — design index and intake baseline

State: baseline documented; future changes DRAFT. This is not an implementation handover.

## Authoritative existing design

Read [game integration DESIGN](../../../games/mathly-trails/DESIGN.md), then [handover v1.1](../../../games/mathly-trails/design/handover-v1/DESIGN.md). [Screen atlas](../../../games/mathly-trails/design/handover-v1/mockups/index.html), [key screens](../../../games/mathly-trails/design/handover-v1/key-screens.jpg), and [tokens](../../../games/mathly-trails/design/handover-v1/design/tokens.json) remain in place. Do not create a second design master here.

## Current baseline

The handover records owner-selected Mathly naming, green felt and tactile cream cards, five starting cards, freely rearrangeable expressions, reusable operators/parentheses, live result, collections, keyboard/touch access and 44 px targets. These are historical statements in the handover, not newly collected approval evidence.

The current code uses all five cards to match a target, + − × ÷ and parentheses, exact BigInt fractions and automatic completion. The handover still labels all-five completion, numeric domain, no factorial, completion/hint policy and expression paging as proposed defaults. Existing implementation does not constitute owner approval.

The web integration explicitly specifies no purchase flow, all collections open, localStorage, and a future deterministic UTC Daily without a server. The full handover describes native purchases and a canonical backend Daily. Use the web integration for this prototype; revisit those scope differences explicitly before any production/native handover. The integration's claim that RULES forbids shops is stronger than the current RULES text; the explicit game-specific no-purchase instruction is the basis here.

## Existing content and status

Twelve authored boards: eight Starter, one Multiplication, two Division, one Mastery. [Level schema/data and verification](../../../games/mathly-trails/design/handover-v1/data/) stay authoritative. See STATUS for shipped behavior and limitations. No new requirement IDs are assigned to an unchanged baseline; future changes need stable MATHLY-R IDs and acceptance criteria.

## Proposal for the next design discussion

Recommend reviewing Starter variety and resolving core defaults before expanding the library. The night reviewer reports all eight Starter boards feel alike. First define the intended learning progression, then propose two or three contrasting boards and verify their solutions and difficulty hypotheses. Alternative: prioritize Daily/practice breadth, which adds generator, repeatability and rollover decisions before the introductory experience has been reviewed. Neither option is approved.

## Open decisions

Choose the next milestone. Resolve relevant O1–O9 in the existing handover before approving affected scope, especially all-five completion, factorial, rational domain, scoring/hints and paging. Native pricing/restore remain outside the current web prototype. Original-site Daily compatibility is unknown. No accepted ADRs or new approved packets exist in this studio folder.

## Visual exploration — 2026-10-20

The owner has requested a more exciting presentation and suggested the card/casino theme as one possibility. [ADR-001](decisions/ADR-001-visual-direction.md) compares Grand Table, Midnight Club and Playful Deck with [a concept image](assets/concepts/visual-directions-v1.png). Recommendation: refine Grand Table with quieter controls. Selection and implementation approval are pending; the historical design master is unchanged.
