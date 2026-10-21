# Assets included

## Runtime

- `runtime/felt-jade-v1.webp`: 1024×1536 jade felt, the only new runtime raster. Copy to `games/mathly-trails/assets/felt-jade-v1.webp`; use a relative URL. Keep existing felt until no old screen references it.
- `runtime/icons/*.svg`: ten existing vector icons snapshotted from the game for offline implementation. Keep live SVG/currentColor; give controls accessible names. Reuse existing paths where appropriate. No bitmap icons are needed.

Cards, rails, shadows, plaques, gradients, wordmark, mathematical symbols and selection/caret are CSS/live text or SVG. Do not export them into bitmaps. No extra paper texture, confetti image, audio file, font download or decorative props are needed. Runtime asset budget: under 1 MiB including this bitmap and SVGs. Source/reference PNGs do not ship.

## Source and review files

`source/felt-jade-v1.png` is the unmodified built-in imagegen output. `source/felt-prompt.txt` is the exact prompt. The WebP was encoded at quality 82, method 6, retaining original dimensions; no visual edits or resizing. `../references/art-direction-v2.png` is the owner-endorsed concept, not a spritesheet. Its prompt and reference provenance are retained. Other reference PNGs are locally rendered atlas screenshots for geometry review. PNGs must never be used as production screens.

Provenance and SHA-256 hashes are in manifest.json. The felt was generated for this task with no input image or third-party logo. The concept uses the prior in-repository Mathly concepts as references. SVGs originate in the existing game at the pinned source commit. These are provenance records, not a claim of independent legal clearance or exclusivity. Asset use is scoped to this prototype handover; verify any additional production/store requirements separately.

Texture load: show solid jade immediately; the image adds subtle fibers below a uniform wash. Failure leaves the readable solid fallback and unchanged geometry. High contrast disables texture. Do not inline binary art as base64 or fetch from an external image host.
