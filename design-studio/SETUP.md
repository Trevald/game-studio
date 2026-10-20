# Installed in an existing repository

This kit is being added under `design-studio/` in `trevald/game-studio`. Follow [repository integration](REPOSITORY-INTEGRATION.md); skip the repository creation and initialization steps below for this installation. The remaining instructions are reusable guidance for a standalone studio.

# Set up and use the studio

## 1. Choose destinations

Selected studio repository: [trevald/game-studio](https://github.com/trevald/game-studio). Its existence, access, and visibility have not been verified. If creating it, choose visibility; private is a sensible starting choice for unpublished designs. Keep existing game repositories separate; add their URLs to PROJECTS.md and each PROJECT.md after checking them.

This kit has not created a repository or inspected any game code. GitHub access must be installed/connected or configured locally before publishing. Do not place credentials in these files.

## 2. Publish the kit

Check whether `trevald/game-studio` already exists. If it does, clone it and inspect its files before adding this kit on a branch. If it does not, create an empty repository at that destination. Copy the contents of this kit, including hidden `.github` and `.gitignore`, into a fresh local directory. Do not copy over an existing code repository. Using GitHub Desktop is fine: publish the new local repository and create review branches there.

For command-line Git, run these commands **only in the fresh studio directory**. If the remote already has files, clone it and add the kit on a branch after reviewing collisions instead of using this initialization sequence.

```sh
git init -b main
git add .
git commit -m "Bootstrap game design studio"
git remote add origin https://github.com/trevald/game-studio.git
git push -u origin main
```

The first empty-repository bootstrap is the only direct default-branch push in this setup. Subsequent changes use PRs. Where repository settings permit, protect the default branch against direct pushes and require review. A solo owner can approve design explicitly in a PR comment and merge their own PR; do not configure an impossible independent-review requirement.

## 3. Complete intake on a PR

Create `design/mathly/intake` (or the game you choose). Fill PROJECT and STATUS from existing material. Read the game's code repository before documenting its stack or implemented behavior. Import existing design references with provenance. Leave unknowns marked, then open a studio PR. Use the PR template. Approval of this setup does not approve a game's mechanics.

## 4. Use another computer

Clone the studio repository and the relevant implementation repository to that computer. Do not copy machine-specific absolute paths into tracked files. Read AGENTS, PROJECTS, and the selected game's STATUS. Fetch and inspect remote changes before starting. If continuing an open PR, check out its remote branch; otherwise branch from the updated default branch. Follow `studio/WORKFLOW.md` for dirty files and conflicts.

Git synchronizes committed files only. Local images, chat history, ignored files, and unpushed branches do not travel automatically. Keep required assets in Git or at durable versioned locations recorded in the manifest. For large binaries, deliberately configure Git LFS or external storage and verify access on the second computer before relying on it.

## 5. Deliver to Claude Code

Use `studio/HANDOVER-PROTOCOL.md` to freeze and approve a handover. Open a PR in the game's repository adding the versioned packet under `docs/design/studio/`. Do not replace an existing CLAUDE.md: review `integration/CLAUDE-ADDENDUM.md` and append a compatible pointer only after checking existing instructions. After the packet PR is merged, give Claude the implementation prompt in `studio/SESSION-PROMPTS.md` with real URLs and revisions.

## 6. Add a game

Copy `templates/game/` to a new `games/<slug>/` folder. Replace `{{GAME_NAME}}` and `{{GAME_SLUG}}`, register its repository in PROJECTS, and complete intake. Templates are scaffolding, never approval evidence. Record changes to studio policy in `studio/decisions/`; record game choices only in that game's decisions folder.
