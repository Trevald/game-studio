# Screen and asset implementation map

Screens in references/*.png are **look only**: retain candy palette, board prominence, cream panels and raspberry actions, not screenshot typography measurements or sample scores. Live implementation rules in HANDOVER.md win. references/EXPLORATION.md is historical context, not an instruction source.

| State | Layout / behavior | Reference |
|---|---|---|
| Home | Existing candy identity; Play/Continue primary, map and book secondary, settings quiet; no instructions | Existing home preserved |
| Level map | Existing 1–12 trail; selecting an unlocked level immediately starts it; no briefing | Existing map preserved |
| First move | Stable HUD, board, one small cue beneath; highlight valid starting route; use hand.svg beside path, not covering number | first-move.png |
| Longer chain | Same layout, three highlighted numbers, “Try a longer chain”; success points pop only, no formula | longer-chains.png |
| Special select | Solid selected route, dashed blast footprint; sum counts selected numbers only; live special icon at last selected cell for reward | specials.png |
| After clear | Brief removal/points, model already committed, seeded refill; stable HUD without layout jump | Interaction rules |
| Over target | Keep editable chain; “Too high · slide back”; on commit apply free/charged invalid rule | Interaction rules |
| Hammer | Toolbar uses supplied hammer.svg and charge count; target highlight then confirm/cancel panel; same number visible behind panel | power-ups.png |
| Rush charge / active | Fixed meter slot below objective; absent before L8; empty/1/2 pips then active purple strip with gold rush.svg, ×2, remaining uses | sugar-rush.png (active) |
| Win | Stars, actual score, optional time row only for timed finish, Next primary, Play again secondary; speed challenge separate secondary action | success.png |
| Loss | Existing retry style, immediate Retry, Undo if possible, Levels; no shame/assistance badge | Existing failure style |
| Book | Cream scrapbook, six SVG stickers, locked desaturated with visible outline; condition text on tap; badge selection and Back | stickers.png |
| Pause | Resume, Restart, Help, Settings, Book, Levels; clock paused; do not add new tutorial modal | Existing pause style |
| Loading/error | Existing lightweight loading, art fallback with live numbered tiles, in-memory notice, restore error and restart | Existing recovery style |

## Corrections to the design previews

- “Reset demo” is replaced by real Undo, not shipped as a game control.
- Score progress uses real per-level ticks; completion star stays hollow until success.
- No “New sticker” unlock toast before committed success; reference depicts visual styling only.
- The preview's disabled hammer candy is actually removed/refilled in runtime.
- Replace Unicode/emoji placeholders with packet SVGs. Do not crop text or controls from PNGs.
- Actual speed challenge runs a timer; 0:42/1,240 are illustrative, not fixed values.
- Keep complete numbers above stripe/wrapped overlay; opacity may be reduced locally if needed to preserve contrast, not erased.

## Asset layering and dimensions

Background: match-bg.webp cover, with cream veil where needed. Candy: crop regions in match-atlas.json at native aspect; at 390px each cell is roughly 60–66px. Overlay stripe-overlay.svg or wrapped-overlay.svg covers same tile bounds, pointer-events none. Live numeric label above both, high-contrast plum outline. Selected route and ordinal above overlay but away from numeric center. Buttons use live labels with icons at 24px; sticker art 64–80px. Full target area minimum44px regardless of icon size. tokens.css supplies palette, not a replacement stylesheet.

CSS/plain SVG particles are sufficient: 120–220ms pop for a standard clear, up to 350ms for combo; reduced motion ≤80ms static fade. Commit and pause timing excludes resolution. No audio assets required: retain existing optional synthesized cues or silence. No new font assets required: use current system rounded font stack. All required raster art is bundled, unchanged from repository sources.
