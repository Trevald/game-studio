# Working with the night studio (for the design agent)

Written by the night studio, 20 Oct 2026, at Benji's request. Read this once before designing for
Mathly, Ricochet or Math Crush. It explains how your approved work gets built in this same repository.

## Who builds, and when
- Two unattended Claude sessions ("night shifts") run every night, ~22:30 and ~03:50 Stockholm time.
  Each does one job and publishes a playable private build Benji tests in the morning.
- Shifts read **main only**. Drafts, branches and open PRs are invisible to them.
- A shift builds a game from **the approved hand-over** in `design-studio/games/<game>/handovers/<ID>/`
  when STATUS.md names it as approved with the approval record. Without one, the shift keeps using the
  old studio file `games/<slug>/DESIGN.md`. So: after intake, **an approved hand-over is what moves the
  game forward** — DESIGN.md edits alone don't reach the build.
- Shifts read hand-overs **in place**. Skip the kit's delivery step (copy to `docs/design/studio/` +
  delivery PR); it's for separate code repos. Shifts commit game code straight to main under Benji's
  standing authorization.

## Game ↔ folder mapping
| Game | Your folder | Game code | Existing material to take in at intake |
|---|---|---|---|
| Ricochet | `design-studio/games/ricochet/` | `games/tiltstones/` | `DESIGN.md`, `design/` (levels, concept art, REQUESTS.md), `assets/`, `NIGHTS.md` (incl. Level Lab results) |
| Mathly | `design-studio/games/mathly/` | `games/mathly-trails/` | `DESIGN.md`, `design/handover-v1/`, `assets/`, `NIGHTS.md` |
| Math Crush | not registered yet | `games/math-crush/` | `DESIGN.md`, `design/handover-v1/`, `assets/` |
Auguru is a separate repo (`Trevald/Auguru`); the night studio doesn't build it.

After intake, replace the body of `games/<slug>/DESIGN.md` with a pointer to your folder (keep the file).

## What makes a hand-over buildable overnight
Nobody can ask you a question during the night, so a hand-over has to stand on its own:
- **Stable requirement IDs** and acceptance examples — the shift reports per ID.
- **Levels as data**, not pictures: JSON with an explicit legend/schema, plus a solution witness per
  level. Shifts run an automated solver and playtest; a level the solver can't finish is reported back.
- **Explicit scope for one shift** (or name phases). One shift ≈ a few hours of building + testing.
  Oversized scope gets split by the studio and the rest continues the next night.
- **Open questions marked as open**, with the default you want the studio to use meanwhile.
- Visual references labelled as either *look only* or *exact layout*.

## Build constraints your designs must fit
- Browser games for phone first (portrait, ~390×844) and desktop; touch and keyboard; 44 px targets.
- One `index.html` per game for code. No servers, accounts, store, purchases, ads, or network calls.
  Anything "daily" is computed locally from the UTC date.
- Runtime art lives in `games/<slug>/assets/` and loads by relative URL. Prefer SVG; raster as WebP;
  keep a game's runtime art under ~2 MB total. Numbers and labels stay live text, not baked into images.
  Put runtime art there yourself, or list it in your hand-over's asset manifest and the studio copies it.
- Keep large previews/mockups modest (JPEG/WebP, not multi-MB PNG/SVG) — every shift clones the repo.
- Benji's standing taste file is `studio/RULES.md` (no dark patterns, no mandatory timers unless the game
  is about time, undo/instant restart, readable visuals). It applies to every design.

## What comes back to you
- Every shift that builds from your hand-over writes `design-studio/games/<game>/feedback/FB-NNN-*.md`
  (kind `completion-report` or `question`), using your template: requirement IDs, what was actually run,
  results, deviations, the play link. That is the only place the studio writes in `design-studio/`.
- The studio never edits your designs, STATUS, decisions or hand-overs. Fold its feedback into a new
  hand-over version; don't patch an approved one.
- Benji can also leave quick notes for the studio on the ideas board; those don't change your design
  record. If a board note conflicts with an approved hand-over, the shift follows the hand-over and asks.
