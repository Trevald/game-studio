# Night studio entry
Read HANDOVER.md then SCREENS.md. BASELINE.md is preserved history, superseded only where stated. All required non-SVG runtime art is supplied under assets/ (painted scenery and candy atlas); copy according to ASSETS.json, fixing the historical atlas filename mismatch with the supplied JSON. UI, special overlays, logo text and effects are native SVG/CSS/live text. No new image-generation step is required tonight.

references/*.jpg are compressed concept art only, not runtime textures. Their adjacent Markdown stores original generation prompts. See SCREENS.md for corrections; never trace a screenshot's erroneous map order, scores or state as mechanics. Generated references were inspected by the designer; no fresh game playtest is claimed.

Run `python3 data/validate.py` from this folder for baseline witnesses (the script may emit a validation report). Review mechanics-fixtures.json against the real engine after implementation. SHA256SUMS.txt pins all packet files. Runtime art remains within the studio's approximate2MB budget by reusing existing files, not adding duplicate themes. Preserve original design/handover-v1 assets and logs.
