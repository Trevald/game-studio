# Mathly — design hand-over (v1.1, Card Table)

This document is Benji's. It overrides BRIEF.md and the night-1 "Mathly Trails" build wherever they
disagree. The designer's full spec is **`design/handover-v1/DESIGN.md`** — read it all before building,
especially §1 (Decided / Proposed / Open), §2 (rules and engine), §3 (interaction) and §10 (screens).
Then open `design/handover-v1/mockups/index.html` (screen atlas) and look at
`design/handover-v1/key-screens.jpg` (Benji's pick of the three key screens: home, play, complete).

The folder and slug stay `mathly-trails` so links and history keep working. The game is called
**Mathly** on every screen and in `<title>`.

## What changes from the night-1 build
The old merge-two-tiles / star-gated trail model is **replaced**:
- A puzzle is a target plus **five number cards**. The player builds an expression by placing cards and
  reusable operators (+ − × ÷) and parentheses, and can freely rearrange it (drag and drop + keyboard).
- **Use all five cards exactly once** (proposed default O1 — build it behind `requireAllNumbers`).
- Live result always visible. Exact rational arithmetic with a real parser — **no `eval`**, no floats
  for equality (§2 has the grammar, states and result copy; `data/engine-cases.json` are parser tests).
- Completion is automatic (no Submit), a single checkmark, optional "With hint". **No stars, no
  score, no timer** (O7 default).
- Four **collections** (Starter, Multiplication, Division, Mastery) instead of worlds and a trail map.
  Each has authored boards plus endless "Practice this collection".
- Undo, restart and a three-step hint (§6).

## Use as delivered
- **Levels:** `design/handover-v1/data/levels.json` (12 boards: all 8 Starter + 4 samples) — load as is.
  `python3 design/handover-v1/tools/verify_levels.py` must keep passing (it does on 19 Oct).
  Also make the game's own solver agree with `data/verification.json`.
- **Art:** runtime files are in `games/mathly-trails/assets/` (felt.webp, logo.svg, table-mark.svg,
  icons/*.svg). Load them with relative URLs and publish them alongside the page (same rule as
  Ricochet: never inline as base64; see NIGHT_SHIFT.md step 7).
- **Look:** `design/handover-v1/design/screens.css` and `tokens.json` are the visual system — adapt them
  into the page rather than re-inventing colours, type or card styling. Fallback felt colour `#12513D`.

## Studio decisions for the web prototype (Benji may change these)
- **No purchase flow.** The one-time unlock (§8) needs an app store; this is a web prototype, and
  RULES.md forbids shops. All four collections are open. Don't build the offer or restore screens.
- **Daily without a server.** §7 assumes a backend. Instead pick today's board deterministically from
  the **UTC date** (fixed seed + bundled board pool or a seeded generator with a fixed algorithm, never
  `Math.random` or local time), so everyone gets the same puzzle on the same date. Label it "Daily".
  Share = copy the spoiler-free text (§7), no native share sheet needed.
- Progress in `localStorage` (try/catch), no accounts or sync.
- Open items O2 (factorial), O3 (fractions range), O8 (long expressions) — use the designer's
  recommended defaults; don't decide beyond them.

## Constraints that still apply
Phone-first portrait, keyboard + touch, 44 px hit areas, instant restart, single HTML file for code with
art in `assets/`. `window.__qa` and `solve()` must work for the new model: actions are token placements/
moves, and `solve()` returns a token sequence that builds a verified solution for each board.

## Suggested phasing
1. New engine (parser, exact rationals, states) + play screen + completion screen with the Card Table
   look, Starter's 8 boards. Home → Starter → play → complete.
2. Collections screen, the other three collections with practice generation, daily, hints.
3. How to play, settings, accessibility variants (large text/cards, high contrast).
