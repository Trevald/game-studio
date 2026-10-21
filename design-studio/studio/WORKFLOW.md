# Session, project switching, and publishing workflow

## Standing publishing preference

Since 2026-10-21, Benji prefers direct commits and pushes to `main` for all Game Studio work. See root `studio/RULES.md`. This replaces earlier PR-first instructions. Create a PR only when explicitly requested. Drafts can live on main: publication never implies design approval or implementation readiness.

## Start or resume

1. Name the game/task. Inspect repository, branch, dirty work and remote access. Read the project registry and checkpoint.
2. Fetch remote state. With a clean checkout, update main by fast-forward-only pull. Inspect divergence; never reset, discard changes or force-push. Preserve unfinished work before switching; never auto-stash and forget it.
3. Prefer the existing suitable checkout. An isolated worktree or temporary branch is fine when needed to preserve concurrent work; publish only reviewed, intended commits to main with an ordinary fast-forward push. Fetch and reconcile if another session advances main.
4. Read accepted decisions and open feedback. State the goal, facts and blocking unknowns.

## Work and review

Update design, decisions, assets and STATUS together. Review the diff for unrelated changes, accidental game edits, secrets, unsupported claims and missing assets. Run relevant checks, commit a coherent change and push to main. Do not create a PR merely to record progress or obtain design approval.

For handover approval, present the exact candidate commit, packet version, requirement scope and exclusions. Capture the owner's approval from chat or another durable source, including exact wording, approver, date and evidence link, in STATUS outside the frozen packet. Changing covered files requires approval of the new revision. See HANDOVER-PROTOCOL.md.

## Switch games or computers

Before leaving, update STATUS with completed work, publishing branch/commit, latest handover, feedback, blockers and one next action. Publish the checkpoint to main and verify remote main contains the expected commit. If offline, say **local only**, identify the local branch and publish before continuing elsewhere.

On another computer, fetch current main and read STATUS. Preserve concurrent work and accepted decisions when reconciling changes; seek review when approved meaning changes. Never force-push as a synchronization shortcut.

## Close an implementation cycle

Claude links the implementation commit and test evidence to the handover ID (PR only if requested). The design agent checks requirement coverage; the owner accepts or requests changes. STATUS distinguishes implemented, verified and owner-accepted. Code on main alone is not design acceptance.
