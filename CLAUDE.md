# Game Studio

This repo is a small game studio run by Claude overnight for Benji.

- Running the nightly shift? Follow `studio/NIGHT_SHIFT.md` exactly.
- Benji's standing preferences: `studio/RULES.md` (overrides role files).
- Publishing for all Game Studio work: commit and push directly to `main` by default; create a PR only when Benji explicitly requests it. Preserve concurrent work and never force-push.
- Ideas board (artifact database): `studio/BOARD.md`.
- Build contract and reference game: `studio/roles/developer.md`, `games/_template/index.html`.
- Games index: every push to `main` that touches `games/` republishes all games plus an index page to GitHub
  Pages (`.github/workflows/pages.yml`, builder `tools/pages/build.mjs`). The card text is the summary line
  in each `BRIEF.md` under "The idea"; keep it current. `pages: hidden` in a brief's front matter hides a game.
- Automated playtest: `node tools/qa/playtest.mjs games/<slug>/index.html` (run `npm ci` in `tools/` first).

## Design comes from Benji's designer (since 20 Oct)
- The design record for each game lives in **`design-studio/games/<game>/`**, owned by the designer.
  Benji approves exact design scope and revisions; record that evidence in the design files. Approved, frozen hand-overs sit in
  `design-studio/games/<game>/handovers/<ID>/`. Mapping to studio folders: `design-studio/PROJECTS.md`.
- **Ownership:** the designer owns `design-studio/` and `games/<slug>/design/`. The studio owns game code,
  `BRIEF.md`, `NIGHTS.md` and `qa/`. The studio writes in `design-studio/` only to add feedback records
  (`design-studio/games/<game>/feedback/FB-NNN-*.md`). Never edit a design, STATUS or a hand-over there.
- How night shifts pick the design source: `studio/NIGHT_SHIFT.md`, "Which design to build from".

Layout: one folder per game under `games/<slug>/` with `index.html` (the whole game), `BRIEF.md`,
`NIGHTS.md` (night log, newest first) and `qa/` (latest playtest report and screenshots).

Commit messages end with the session attribution lines the environment provides.

## Owner-led design and approved handovers

The reusable design workspace is in [design-studio/](design-studio/README.md).
For an owner-led design session, read `design-studio/AGENTS.md` and
`design-studio/REPOSITORY-INTEGRATION.md`, then select a project there.
The existing night-shift runbook and game folders remain in place.
