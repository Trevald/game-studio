# Playful Deck visual refinement v2

Date: 2026-10-21. State: proposed, not approved. Owner requested another look at visual improvements. Playful Deck and Adaptive rows remain accepted directions.

## Design assessment

Compared the selected concept sheet with the later equation-layout study. The study proves limited geometry but loses material character: large cream workspace, similar button/card shapes, strong Hint emphasis and technical selection copy. This is a designer assessment, not player research.

## Proposed refinement

- Recess the expression area into the jade table instead of filling it with a large cream panel.
- Use tactile cream number cards and quieter pale-mint operator/parenthesis tiles, keeping equal touch targets.
- Reserve yellow for the target and solve feedback; give Hint the same quiet cream treatment as Undo/Restart.
- Retain coral for the reusable operator palette. Simplify decorative treatment elsewhere.
- Use a brief warm outline/check for the solve moment within the existing timing proposal; no timing or behavior change is approved here.
- Preserve Adaptive rows and the stable source tray. Short expressions do not justify enlarging the editing tokens beyond the long-expression layout.

See [concept sheet](../../assets/concepts/playful-deck-refinement-v2.png) and [exact prompt](../../assets/concepts/playful-deck-refinement-v2-prompt.txt). Built-in imagegen used the v1 layout screenshot and prior three-theme sheet as references. No production assets are delivered.

## Review of generated output

Both states have target 26. Left shows 4+3=7 and remaining source cards 2,3,3; slots 2 and 5 are Used. Right shows (4+3)×3+3+2=26, eleven tokens over two rows, all five source slots Used. Arithmetic and card counts were visually checked.

The image remains illustrative: header/result blocks could be smaller, the editing strip contrast is unmeasured, and token selection is not clearly indicated despite contextual controls. In the right solve moment, editing controls should be inactive or absent according to the approved behavior, not interpreted as a new editable solved state. There are two checkmarks; simplify to one primary success indicator. The tray shifts vertically between states in the generated image; a measured follow-up must retain a fixed tray position. Do not reproduce those artifacts as requirements.

No measured 44px sizing, safe-area fit, contrast or three-row layout verification is claimed for this raster. Previous v1 geometry tests do not validate v2. The 19-token stress case, compact fallback, landscape and enlarged text need a code-native layout pass after the owner responds.

## Next action

Review the recessed jade workspace and cream/mint hierarchy with Benji. If preferred, carry those treatments into the measured Adaptive rows study and test full expressions. New refinements remain proposed; no implementation authorization.
