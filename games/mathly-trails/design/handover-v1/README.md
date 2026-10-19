# Mathly — developer handover

Visual revision 1.1: warmer brass accents, tactile card faces and restrained tabletop detailing. See DESIGN.md section 13.

Open **mockups/index.html** in a browser for the complete screen atlas. Read **DESIGN.md** before implementation, especially the Decided, Proposed and Open sections. This package is a design handover with editable static screen sources; it is not a playable game or a store/backend implementation.

## Package contents

- `DESIGN.md` — rules, evidence, interaction contract, responsive and accessibility behavior, content/progression, daily service, purchase flows and acceptance criteria.
- `mockups/index.html` — local visual atlas. Individual numbered HTML files are editable static layouts; same-name PNGs are rendered SPEC mockups. PNGs are exported at 2× density: e.g. the 375×667 logical layout is a 750×1334 image. The 320×568, 390×844 and 568×320 variants are explicit. `contact-sheet.jpg` is a visual overview.
- `design/screens.css` — shared screen/component geometry and visual styling; relative asset paths work offline. `screens.json` maps names to logical dimensions. `components.svg` is the vector component plate. `tokens.json` contains base design tokens. `layout-qa.json` records static overflow checks; `QA.json` records asset and contrast checks.
- `assets/felt.webp` — actual 1024×1536 raster texture. `logo.svg` — outlined logo. `table-mark.svg` — decorative four-operation roundel. `icons/*.svg` — twelve 64×64 viewBox icons. `ART-NOTES.md` contains generation method, final prompt and provenance. `asset-manifest.json` lists sizes and SHA-256 hashes.
- `data/levels.json` — twelve boards including all eight Starter levels and four advanced examples. `levels.schema.json` defines the data shape; semantic uniqueness/solution checking is handled by the verifier. `verification.json` contains exact arithmetic results. `daily-example.json` is a canonical payload fixture, not a real published daily. `engine-cases.json` contains production parser acceptance cases.
- `references/` — two recovered original screenshots plus source/evidence notes. Do not ship these in the game.
- `tools/verify_levels.py` — dependency-free Python solution/card-ID verifier.
- `tools/render_mockups.cjs` — optional PNG exporter (Node + Playwright + installed Chromium). No network or app backend needed; it opens only local HTML files. Set `MATHLY_CHROME` to a Chromium executable if Playwright's default browser is not installed.
- `FILE-MANIFEST.md` — exhaustive list of files and purpose groups, including every numbered screen and icon.

## Use in the app

Copy only runtime SVG/WebP artwork into the app's `assets/` directory. Load felt from `assets/felt.webp`, logo from `assets/logo.svg`, icons from `assets/icons/NAME.svg`. Adapt the CSS primitives and tokens to the app framework; do not flatten UI into screenshots. Background fallback is #12513D; high contrast uses #09382B. UI numbers, operator symbols, buttons and cards remain vector/text. The runtime artwork total is below 1 MB; documentation images are excluded from that budget.

No external font, icon CDN or image service is required. The felt asset was generated using the built-in image tool; the final prompt is in assets/ART-NOTES.md. New SVG artwork is included in editable form.

## Verify

Run `python3 tools/verify_levels.py` from this directory (or provide its full path). It checks all five card IDs exactly once, allowed operators, token/expression agreement and exact target equality, plus five arithmetic regressions. It uses a restricted Python AST evaluator for offline verification; the game should implement the grammar in DESIGN.md.

Optional render: install Playwright in your development environment, then run `node tools/render_mockups.cjs`. This writes PNGs and the layout report; screenshots are static, not interaction tests. Native accessibility, purchase sandbox, daily service, generator quality and device tests remain release work.

## Decisions to resolve

Owner approval is still needed for all-five completion, factorial, numeric domain, paid-content size/access policy, price, original-site daily compatibility, scoring/hint policy, editor paging and cross-platform sync. Defaults are fully specified so the team can prototype without silently inventing rules. Do not treat proposed defaults or placeholder store text as approved production content.

The correct reference equation is **5+(4×3)−3÷2=15.5**. The source board's target 26 has a separate verified solution: **(4+3)×3+3+2=26**.
