# Ricochet — consolidated development handoff

Updated 19 October 2026. Start here. This package supersedes the earlier separate ZIPs.

## Confirmed paint behaviour

**Dip inside → change colour → bounce back out. Never pass through.** The bucket stays and can be reused. No bucket changes the ball back to blue; losing a life does. Keys and diamonds also bounce the ball. Side/underside bucket collisions, the entry aperture and dip duration have not been specified.

The old pass-through assumption has been removed from the level JSON and design notes. Existing grids are unchanged and still need engine playtesting with this confirmed behaviour. Pars remain provisional. This package contains no game implementation or verified engine captures.

## What to use

- `visual-assets/assets/`: sixteen final-delivery runtime assets: five 2× WebP backgrounds, ten SVG gear icons, and the SVG logo.
- `visual-assets/manifest.json`: dimensions, sizes, hashes and identifiers. Runtime assets total 839,345 bytes, or 1,119,549 bytes as base64 data URIs, below the 1.5 MB asset target.
- `visual-assets/IMPLEMENTATION.md`: embedding, scaling and usage notes.
- `level-designs/levels.json`: authoritative eight 10 × 14 grids, hints, route descriptions, teaching goals and provisional pars.
- `level-designs/LEVEL-DESIGNS.md`: readable level design and testing notes.
- `level-designs/screenshots/` and its contact sheet: exact-grid schematic review renders, not the final visual styling.
- `visual-concept/approved-gameplay-direction.png`: the user's preferred gameplay visual direction, generated from the original concept and level layouts. Illustrative; use JSON rather than the generated image for tile coordinates.
- `visual-concept/original-visual-concept.png`: original visual reference supplied by the user.

The previous flat “finished design” mockups are omitted. The preferred concept uses luminous balls, sculpted jewel blocks, glass paint pots, mossy ruins and a polished blue HUD. These illustrative UI/tile treatments are not separately supplied production sprites. The production asset pack covers backgrounds, gear icons and the logo only.

## Rule precedence

Use the latest level rules and confirmed paint behaviour over text or apparent mechanics in concept images. In particular, the shapes embossed on coloured blocks are visual identifiers: the supplied rules require matching **colour**, not matching shape. Concept-image hearts, gear slots, controls, score displays and timers are visual proposals unless independently agreed. Do not infer rules from decorative artwork.

## Before release

Implement and test the bucket dip/repaint/rebound, reusable buckets, locked-diamond rebound, grey-block win-condition exclusion, key/lock opening, skull reset and colour order. Play each safe and faster route with the specified ball dimensions and speeds. Confirm restart recovery and tune pars from measured runs. Visual mockups are illustrative and the level layouts are review candidates, not a playability certification.

`FILES.sha256` records every other file in this package. The ZIP and documentation are not part of the embedded asset-size budget.
