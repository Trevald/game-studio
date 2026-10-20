# Game Studio

An overnight game studio. Drop an idea on the board before bed; by morning there's a playable build.

## How it works

1. **Ideas board** — a private Claude artifact where you add ideas, order the queue,
   leave notes on builds, and park games you're done with.
2. **Night shift** — two scheduled tasks start a fresh Claude session at 22:30 and 03:50 Stockholm time (one per usage window) and follows
   [`studio/NIGHT_SHIFT.md`](studio/NIGHT_SHIFT.md). Each night is one job:
   iterate the game you left notes on, or start the next idea in the queue.
3. **The roles** — Producer (scope), Designer (mechanics), Developer (build), QA (automated
   playtest in headless Chromium), and a Reviewer that runs as a separate agent and plays the
   build cold.
4. **Morning** — the build is published as a private artifact; its link, a short report and the
   studio's questions land on the idea's card and in the notification from the run.

## Steering the studio

- Your notes on a card are tonight's to-do list for that game.
- `studio/RULES.md` is your standing taste file: things to always/never do. It overrides everything.
- Every game's history is in `games/<slug>/NIGHTS.md`.

## Layout

```
studio/            runbook, rules, roles, templates
games/_template/   reference game that passes QA (the build contract in code)
games/<slug>/      index.html, BRIEF.md, NIGHTS.md, qa/
tools/qa/          playtest.mjs — automated playtest
```

## Owner-led design and approved handovers

The reusable design workspace is in [design-studio/](design-studio/README.md).
For an owner-led design session, read `design-studio/AGENTS.md` and
`design-studio/REPOSITORY-INTEGRATION.md`, then select a project there.
The existing night-shift runbook and game folders remain in place.
