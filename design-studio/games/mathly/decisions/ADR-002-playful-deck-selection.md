# ADR-002 — Select Playful Deck as the visual direction

- State: accepted — visual direction only
- Decision owner / approver: Benji
- Recorded: 2026-10-21 (Europe/Stockholm)
- Evidence: owner message in [this Mathly chat](codex://threads/01a15879-c850-79e0-868d-b07f7116dfe9): “Playful Deck is the clear winner for me. Would love to see how the longer equations can fit”. Recorded on resume; no claim about the original message timestamp.
- Approved reference revision: right-hand Playful Deck concept in `assets/concepts/visual-directions-v1.png`, introduced in commit `1da3f35586e093f3aa6fd3c0f069d85508743104`; provenance/hash in the manifest.
- Supersedes: ADR-001 recommendation to pursue Grand Table, for visual direction selection only. Its draft requirements are not accepted by this choice.

## Decision and scope

Continue with Playful Deck: jade table, coral controls, cream tactile cards, yellow target and bold readable numerals. Owner selection is explicit. It does not approve every pixel, decorative prop, layout, animation, rule, asset use or requirement from the exploratory comparison. No implementation packet is approved, and no merge is authorized by this message.

## Next design work

Owner requested long-equation exploration. [Layout study v1](../explorations/playful-deck-equations-v1/README.md) compares two-row paging with adaptive rows. Subsequent decision: ADR-003 selects Adaptive rows; MATHLY-VIS-005 still needs a complete implementation contract. Existing historical handover remains unchanged. A new approved packet is required before Claude implements the selected visual system and layout.
