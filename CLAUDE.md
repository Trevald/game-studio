# Night Studio

This repo is a small game studio run by Claude overnight for Benji.

- Running the nightly shift? Follow `studio/NIGHT_SHIFT.md` exactly.
- Benji's standing preferences: `studio/RULES.md` (overrides role files).
- Ideas board (artifact database): `studio/BOARD.md`.
- Build contract and reference game: `studio/roles/developer.md`, `games/_template/index.html`.
- Automated playtest: `node tools/qa/playtest.mjs games/<slug>/index.html` (run `npm ci` in `tools/` first).

Layout: one folder per game under `games/<slug>/` with `index.html` (the whole game), `BRIEF.md`,
`NIGHTS.md` (night log, newest first) and `qa/` (latest playtest report and screenshots).

Commit messages end with the session attribution lines the environment provides.
