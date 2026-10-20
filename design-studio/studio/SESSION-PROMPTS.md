# Reusable session prompts

## Resume design

Work on GAME in the game-design-studio repository. Read AGENTS.md, the shared workflow, and games/SLUG/{CLAUDE,PROJECT,STATUS,DESIGN}.md, accepted decisions, latest handover, and unresolved feedback. Fetch and inspect repository state without discarding local changes. Continue from the recorded checkpoint. Today's goal: GOAL. Record assumptions and finish by updating STATUS and preparing a PR.

## Switch projects

Checkpoint the current game: record work completed, unresolved questions, branch/PR, latest handover, and one next action. Publish the checkpoint if access is authorized; otherwise clearly report local-only work. Then load GAME from its own files and summarize its next action before proceeding. Do not transfer another game's decisions into it.

## Prepare approval

Prepare a complete, versioned handover for GAME covering REQUIREMENT_IDS. Check the readiness checklist and identify blocking gaps. Open a studio review PR with an exact candidate commit. Keep it draft until the owner explicitly approves that revision and scope.

## Implement with Claude Code

In IMPLEMENTATION_REPO, first read existing repository instructions and inspect current code. Use the approved packet at docs/design/studio/HANDOVER_ID/HANDOVER.md and its DELIVERY.md receipt. Verify the approval link and source revision. Implement only its in-scope requirements on a new branch, respecting existing architecture. Report contradictions or missing critical details through the feedback protocol, continuing independent approved work. Open an implementation PR and include requirement coverage, actual test results, visual evidence, deviations, and remaining work. Do not merge without authorization.

## Review implementation

Compare IMPLEMENTATION_PR at CODE_COMMIT with HANDOVER_ID. Check each acceptance criterion, mobile interaction, visuals, and level behavior. Separate implementation defects from proposed design changes. Return traceable feedback, update STATUS, and ask the owner to accept the verified result. Do not claim checks passed unless evidence supports them.
