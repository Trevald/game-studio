# Project registry

| Game | Studio folder | Implementation repository | State |
|---|---|---|---|
| Mathly | [games/mathly](games/mathly/PROJECT.md) | this repo, `games/mathly-trails/` (owner-confirmed 20 Oct) | Intake needed |
| Ricochet | [games/ricochet](games/ricochet/PROJECT.md) | this repo, `games/tiltstones/` (owner-confirmed 20 Oct; folder kept from the old name Tiltstones) | Intake needed |
| Auguru | [games/auguru](games/auguru/PROJECT.md) | separate repo `Trevald/Auguru` — not built by the night studio | Intake needed |
| Math Crush (working title) | not registered yet | this repo, `games/math-crush/` | Not registered |

**Same-repo games (Mathly, Ricochet, Math Crush):** the night studio reads approved hand-overs in place from
`design-studio/games/<game>/handovers/<ID>/`; no copy into `docs/design/studio/` and no delivery PR.
It commits game code to main under the owner's standing authorization, and reports in this game's
`feedback/` folder. Existing design material to take in during intake: `games/<slug>/DESIGN.md`,
`games/<slug>/design/` (hand-overs, levels, REQUESTS.md) and `games/<slug>/NIGHTS.md`.

Studio repository: https://github.com/trevald/game-studio. Default branch: inspect after creation; setup examples use `main`.

A device's active chat or branch is not a studio-wide active-game flag. Each game's STATUS is the durable checkpoint; the user selects the game at the start of each session.
