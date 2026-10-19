# Raster asset inventory and integration

| Theme | Environment | Transparent atlas | Region map |
|---|---|---|---|
| Candy forest | match-bg.png | match-atlas.png | match-atlas.json |
| Jungle stone | equation-bg.png | equation-atlas.png | equation-atlas.json |
| Ice cavern | clear-bg.png | clear-atlas.png | clear-atlas.json |

All master dimensions, channel formats and alpha ranges are recorded in inventory.json. Each atlas includes tile_0 through tile_5, hud, button, hint, undo, star, selection, modal, badge, check and back. Sixteen regions per theme, 48 total. Tile color has no mathematical meaning. Stone tile_5 is the gold operator face. Regions are top-left-origin pixel rectangles x,y,w,h; pivots are centered. Bounds intentionally retain soft edge pixels. The region maps, not an assumed equal grid, govern import.

Render background with cover cropping. Place a dark native board well, then sprite faces, live numbers, native gold selection outline and ordinal badge. Put HUD sprites behind live labels. Place medallions and live accessible labels on top of the background. The modal face uses dark text; ice HUD uses white text. Never use the full concept proof as a runtime screenshot.

Import as sRGB RGBA, straight source alpha; let the renderer premultiply at sampling/compositing time. Use linear filtering and clamp wrapping. Repack only if required by the engine, adding 2–4 pixels extrusion around source regions; keep original masters. Screen SVGs embed the same atlas source and crop via viewBox, leaving native text editable. All regions can be imported directly as multiple sprites in a game engine. No Photoshop files or editable painted layers are supplied.

Tiles fit their square/rectangular screen bounds. Scale medallions and stars uniformly. HUD and button sprites stretch to the documented control rectangles; for a production responsive UI, nine-slice the quiet center while preserving decorative ends. Reserve at least 12 logical points of inner label padding; wrap localized text instead of shrinking hit targets below 44 points. Use the modal region for tall dialogs, not the shallow HUD plaque.

Pressed state: 0.96 scale. Disabled state: lower saturation and opacity, with disabled input semantics. Selected state: native 4-point gold ring and ordinal; optional selection glow sprite below the tile. Hollow stars use native vector outlines; earned stars use atlas art. Glints, trace lines, confetti, pause glyph and arithmetic operators are native vectors/text. No additional raster effect animations are required. Use synthesized optional tones; no recorded audio dependency.

Generation prompts are retained in generation-prompts.json. These assets are AI-generated prototype material. Inspect final edge filtering and font contrast on the target devices as part of integration. Peak decoded texture memory is width×height×4 per active texture; load one theme at a time and use scaled build variants on constrained devices.
