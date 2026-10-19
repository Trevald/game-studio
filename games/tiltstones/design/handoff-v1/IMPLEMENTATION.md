# Ricochet visual asset handoff — v1.0

16 final-delivery assets: one text-free start background, four world backgrounds, ten individual gear SVGs, and one separate RICOCHET SVG logo. Backgrounds were generated with the built-in image generator; icons and wordmark are original, editable vector geometry. No previous reference artwork was available in the referenced chat; this pack interprets its premium neon/crystalline direction.

## Delivery status
The files in assets/ are finished artwork, not illustrative placeholders. The contact sheet is documentation, not an in-game screen. No gameplay or integration testing has been performed because the game source was not supplied. Validate legibility against actual blocks, ball trails and effects before release. Gear symbols represent the supplied item names; they do not define or change mechanics.

## Size and format
- Raw runtime assets: 839,345 bytes.
- All 16 assets as base64 data URIs, including URI prefixes: 1,119,549 bytes.
- Limit: 1,500,000 bytes; remaining asset budget: 380,451 bytes.
- This budget covers assets only, not the game code, manifest, preview, or documentation. Do not embed the ZIP or contact sheet.
- Backgrounds: opaque RGB WebP, 1024 × 1536, exactly 2× a 512 × 768 CSS pixel portrait surface. They remain 2× only at that display size or smaller. Landscape and larger displays are not bespoke art variants.
- Icons: transparent SVG, 64 × 64 viewBox, 3-unit strokes. Recommended 32–64 CSS px; avoid below 24 px. No external fonts, scripts, raster images or linked resources.
- Logo: transparent SVG, 400 × 108 viewBox, path-based lettering. Recommended 240–400 CSS px wide; preserve aspect ratio. RICOCHET is the only intentional lettering in runtime artwork.

## Placement and contrast
Use a midnight #080f20 base. Render backgrounds at full opacity. Use background-size: cover and background-position: center for portrait. Cropping is expected outside 2:3; use contain over the base colour when preserving edge architecture matters. Do not stretch. Keep menu text near the centre and out of the bright start-screen arch.

World detail sits at the perimeter. Keep the gameplay board within the central region where possible. If bright effects or edge blocks lose contrast, put a separate rgba(4,10,24,.25) scrim between the art and board; tune in the live game. Do not dim the blocks or gear together with the background. The start image is deliberately more luminous and is not intended behind gameplay.

## Embedding
Encode each file once with base64, store the data URI under its manifest ID, and reuse it. Prefix WebP with data:image/webp;base64, and SVG with data:image/svg+xml;base64,. Use CSS background-image for decorative backgrounds and img for icons/logo. External SVG img preserves namespace isolation; when inlining multiple logos, make the gradient ID unique per instance. Allow data: in img-src if a Content Security Policy is configured.

Example (ASSETS is your build-generated map of data URI strings):

```js
screen.style.backgroundImage = `url("${ASSETS['meadow-ruins']}")`;
icon.src = ASSETS['magnet'];
icon.alt = ''; // when the adjacent visible label already says Magnet
logo.src = ASSETS['ricochet-logo'];
logo.alt = 'Ricochet';
```

```css
.game-screen { background-color:#080f20; background-size:cover; background-position:center; }
.gear-icon { width:32px; height:32px; object-fit:contain; }
.brand-logo { width:min(80%,400px); height:auto; }
```

Decorative backgrounds need no accessible label. Give gear buttons visible item names or accessible names; colour alone must not identify an item. Keep interactive hit areas at least 44 × 44 CSS px independently of icon size. Apply disabled styling at component level, not by changing the source files. The assets are static and contain no animation.

## Gear mapping
| ID | Visible name | Motif |
|---|---|---|
| magnet | Magnet | Horseshoe magnet |
| feather-feet | Feather Feet | Feather and motion strokes |
| colour-sight | Colour Sight | Eye and segmented iris |
| time-warp | Time Warp | Clock and reverse arc |
| shield | Shield | Faceted shield |
| extra-life | Extra Life | Heart and plus |
| chain-extender | Chain Extender | Linked chain and plus |
| prism | Prism | Triangular prism and split rays |
| blue-return | Blue Return | Return arrow and blue diamond |
| ghost-line | Ghost Line | Ghost and dashed trajectory |

## Verification
All five WebPs decoded at the required dimensions. All eleven SVGs parsed and rasterized successfully. Runtime SVGs contain no text nodes or scripts. All sixteen assets were visually reviewed in the contact sheet. Manifest SHA-256 hashes allow build-time integrity checks. Original generation prompts are included in generation-prompts.json for future art iterations.

## Confirmed paint-bucket behaviour — 19 October 2026

The ball dips inside the bucket, changes to the bucket colour, and bounces back out. It never passes through. Buckets persist and can be used repeatedly. The visual should show entry into the paint and exit on the rebound; static mockups do not establish collision boundaries or animation timing. Plan level routes around that rebound. No bucket restores blue; losing a life resets the ball to blue.
