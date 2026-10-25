# H-002-v1 — start here

Read HANDOVER.md, SCREENS.md, ASSETS.json, data/SCHEMA.md and QA.md. This is the self-contained play-first Candy Match implementation packet requested by Benji on 25 October 2026. Owner evidence is recorded in STATUS outside the frozen packet. Previous H-001-v1 remains intact.

- `assets/`: existing WebP candy art and atlas metadata, controls, 10 new SVG icons, six SVG stickers, stripe/wrapped overlays and CSS tokens.
- `asset-sheet.html`: inspect new SVGs in a browser.
- `references/`: seven screen references and contact sheet, plus frozen exploration/playtest context. Look only; HANDOVER/SCREENS win over mockup simplifications.
- `data/`: complete revised12-level configuration, full baseline solution witnesses, combo/Rush fixtures and achievement definitions.
- `checks/`: frozen baseline model and reproducible witness validator. Not runtime assets.
- `BACKLOG.md`: explicit later ideas, not hidden implementation work.
- `SHA256SUMS.txt`: all packet files except the manifest itself.

Copy runtime art to the exact ASSETS.json destinations; never slice screenshots into UI. No missing raster art, new fonts, sound files or external service is required for the included scope. Normal HTML/CSS/SVG effects and existing optional synthesized audio suffice. No image-generation assets or API keys required.
