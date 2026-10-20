# ADR-001 — Explore a more expressive card-table presentation

- State: proposed
- Date: 2026-10-20
- Decision owner: Benji
- Approval evidence and revision: none; exploration only, revision 1
- Related requirements / feedback: MATHLY-VIS-001–004 below; owner request in this Mathly chat, 2026-10-20
- Supersedes / superseded by: none; existing handover stays unchanged

## Context

Owner: “Lets explore some design improvements. I'm thinking that this card/casino theme could work as one. The game needs to look more exciting.” This authorizes exploration, not selection of a theme or implementation. The current [key screens](../../../../games/mathly-trails/design/handover-v1/key-screens.jpg) already use felt, brass and cream. Design assessment: similar panel weights and broad empty felt make the composition feel quiet. This is a design judgement, not a playtest finding.

## Options

[Concept comparison](../assets/concepts/visual-directions-v1.png) — generated raster exploration, not a layout specification or production art.

| Direction | Intended character | Tradeoff |
|---|---|---|
| Grand Table | Emerald felt, warm pool of light, ivory cards, brass target and restrained burgundy rail | Strong continuity and tactile atmosphere; too many gold borders could make it busy |
| Midnight Club | Navy/plum, cyan light and geometric cards | Strong contrast and energy; glow could distract or tire players |
| Playful Deck | Jade/coral, cream chunky cards, yellow target, graphic shadows | Friendly and readable; less of the intimate card-room character |

## Recommendation — pending owner choice

Develop Grand Table first, with simpler controls and fewer metallic outlines than the image. Concentrate detail on the target and number cards. Keep decoration in the margins. Playful Deck is the alternative if warmth and approachability matter more than a premium table atmosphere. These are comparison options, not a proposal to build three selectable skins.

The mockup uses a valid partial state: 4+3=7, target 26, source cards [2,3,3,3,4] with slots 2 and 5 used. The title Starter · 03 is illustrative, not an instruction to change that authored level. No changes to arithmetic, progression, scoring, monetization or existing open rule decisions are proposed.

## Draft requirements for a subsequent design pass

These IDs are proposals, not an implementation-ready contract.

| ID | Proposed behavior | Acceptance example / boundary | Dependencies |
|---|---|---|---|
| MATHLY-VIS-001 | Make target, live result and editable cards visually distinct; reserve strongest brass treatment for the target | In empty, partial, invalid and solved states, labels distinguish destination from current value; no state relies on colour alone | Owner selects direction; define actual tokens and verify contrast |
| MATHLY-VIS-002 | Use tactile upright number cards, quieter operator tokens and stable source ghosts | A duplicate 3 retains its card identity when placed/returned; full five-card expression and long parenthesized expression remain editable with existing paging and at least 44 px targets | Responsive layout spec at 320×568, 375×667, 390×844 and landscape |
| MATHLY-VIS-003 | Add restrained physical feedback to placement and solving | Proposed 140 ms placement settle and a single 600 ms warm outline/check on exact completion; reduced motion uses a static check, no movement; sound optional/off by default | Reconcile with existing interaction timing; storyboard before approval |
| MATHLY-VIS-004 | Keep table atmosphere subordinate to reading and access | High contrast removes texture, glow and decorative rail; labels, focus and used-card states remain visible; text enlargement works without clipping | Contrast, keyboard, screen-reader and 200%/400% zoom checks |

## Review findings and limitations

The generated comparison correctly displays target 26, result 7, 4+3, three remaining cards, six operators and the bottom actions. It is not a measured phone layout. Large expression cards show only a short expression; the full five-card expression remains untested. The generated plus is visually bare and needs an explicit editable token treatment in a functional design. Used-ghost contrast needs checking. Midnight and Playful add environmental props; these are not proposed runtime assets. The Grand Table render is more ornate than recommended. Image text is illustrative; shipped labels and numerals must remain live text.

No new usability, accessibility or gameplay tests were run. No final palette, motion implementation, asset clearance or owner preference has been established. Built-in imagegen created the image; exact prompt is saved beside it and provenance is in the asset manifest.

## Next step and handover gate

Owner chooses the strongest direction and desired amount of ornament. Then produce a measured empty/partial/full-expression/solved screen set, interaction storyboard and acceptance checks. Any implementation needs a new scoped handover with explicit owner approval; this concept is not sufficient for Claude Code to implement.
