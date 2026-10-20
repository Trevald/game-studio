# Session, project switching, and PR workflow

## Start or resume

1. Name the game and task. Inspect repository location, current branch, working-tree changes, and remote access. Read the project registry and checkpoint.
2. Fetch remote state. With a clean working tree, update the default branch using a fast-forward-only pull. If local history diverges, inspect it and reconcile explicitly; do not reset it. If work is uncommitted, preserve it on its current branch or a named WIP commit before switching. Never auto-stash and forget work.
3. Continue the checkpoint's open PR branch when appropriate, or create `design/<game>/<topic>` from the updated default branch. Studio-wide work uses `studio/<topic>`. Inspect existing instructions and code when the task depends on implementation.
4. State the current goal, known facts, and blocking unknowns. Read accepted decisions and open feedback before revisiting settled choices.

## Work and review

Develop concepts, mobile flows, visual references, mechanics, and testable levels. Update DESIGN, decisions, and asset records together. Put current progress in STATUS. Review the diff for unrelated games, accidental code edits, secrets, unsupported claims, and missing assets.

Commit a coherent change, push its branch, and open a draft PR early if useful. Use `.github/pull_request_template.md`. The PR must distinguish draft exploration, a design decision, a handover approval request, and a feedback resolution. An agent may prepare/publish an authorized PR; the owner controls approval and merge.

For handover approval, the owner records the exact candidate Git commit and packet version in a PR comment (see protocol). Any subsequent change to that candidate's covered files invalidates its approval and requires another review. Keep approval records outside the frozen packet so recording approval does not change the approved content.

## Switch games or computers

Before leaving, update STATUS with completed work, branch, PR URL, latest handover, open feedback, blockers, and a single concrete next step. Commit and push the checkpoint on the working branch, keeping drafts visible as drafts. If offline, say **local only**, identify the local branch, and publish before continuing on another computer.

After publishing, verify the remote PR contains the expected latest commit. A PR URL added after creation can be a follow-up checkpoint commit. End the session with: game, result, PR or local path, unresolved decision, next step.

On the other computer, fetch and check out the same branch, then read STATUS. Do not start from stale local main. If two devices changed the same design, compare both versions, preserve accepted decisions, resolve conflicts on a branch, and request review when meaning changes. Never use force-push as a synchronization shortcut.

## Close an implementation cycle

Claude links its implementation PR and evidence to the handover ID. The design agent checks behavior against requirement IDs; the owner accepts or requests changes. Update STATUS to distinguish implemented from verified from owner-accepted. Merge of code alone is not proof of design acceptance.
