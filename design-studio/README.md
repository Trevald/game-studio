# Game Design Studio

A GitHub-first home for mobile puzzle game design, shared across computers and handed to Claude Code through reviewed implementation PRs.

**Start here:** [Setup](SETUP.md) · [Project index](PROJECTS.md) · [Working workflow](studio/WORKFLOW.md) · [Handover protocol](studio/HANDOVER-PROTOCOL.md)

This starter kit is integrated under `design-studio/` in `trevald/game-studio`. See [repository integration](REPOSITORY-INTEGRATION.md) before using it. Mathly, Ricochet, and Auguru are registered by name only. Their mechanics, current code, assets, and repository locations have not been inspected. Nothing here is approved for implementation.

## Structure

```text
AGENTS.md                   Shared design-agent instructions
CLAUDE.md                   Claude entry point for this studio
PROJECTS.md                 Game registry and repository mapping
studio/                     Shared standards and protocols
  WORKFLOW.md
  DESIGN-STANDARD.md
  HANDOVER-PROTOCOL.md
  SESSION-PROMPTS.md
  decisions/                Decisions about studio operation only
templates/game/             Copyable project skeleton
  PROJECT.md                Identity, scope, constraints, repo mapping
  STATUS.md                 Current checkpoint and next action
  DESIGN.md                 Game specification
  CLAUDE.md                 Game-specific instruction entry point
  decisions/                Game design decisions
  assets/manifest.json      Asset identity, provenance, usage, rights
  levels/                   Level schema, examples, tuning evidence
  handovers/                Immutable approved handover versions
  feedback/                 Implementation questions and results
games/{mathly,ricochet,auguru}/  Initialized project folders
integration/                Safe instructions for implementation repos
.github/                    PR template and feedback issue template
```

## Source of truth

GitHub's merged studio branch is the shared design record. Open branches and local work are drafts. Each game's code repository is the authority for implementation and test results. A copied handover is a versioned delivery snapshot, not a second editable design master. Chat is a working surface; decisions and next steps belong in files before switching projects or computers.

The owner approves design; the design agent develops and records it; Claude Code implements only approved scope and returns evidence. No multi-agent setup is required. Shared policy lives in `studio/`; game mechanics and exceptions live under that game.
