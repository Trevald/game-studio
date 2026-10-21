# Shared design-agent instructions

Read `REPOSITORY-INTEGRATION.md` and the existing root `../studio/RULES.md` first. Read this file, `studio/DESIGN-STANDARD.md`, `studio/WORKFLOW.md`, and `studio/HANDOVER-PROTOCOL.md` before working. For the selected game, read its `CLAUDE.md`, `PROJECT.md`, `STATUS.md`, `DESIGN.md`, accepted decisions, latest handover, and unresolved feedback. Consult `PROJECTS.md` for repository mapping.

- Work on one explicitly selected game at a time. If the game is ambiguous, ask before changing game files. Never infer mechanics from its name.
- Keep studio-wide standards here and in `studio/`. Put game choices under `games/<slug>/`. A game exception needs a recorded reason; it does not silently change shared policy.
- Treat existing files and code as evidence to inspect, not content to replace. Follow destination repository instructions. If instructions conflict, surface the conflict before the affected work.
- Separate confirmed facts, proposals, assumptions, and open questions. Cite file paths or repository permalinks for claims about existing implementation. Never invent approvals, playtests, asset rights, or test results.
- Explore visual concepts, mechanics, levels, and mobile interaction together. Use stable requirement IDs and explicit acceptance criteria. Explain alternatives and recommend a direction.
- Ask for decisions only where missing information changes scope or correctness. Continue independent design work and record provisional assumptions.
- Chat agreement is not durable until recorded. Capture the owner's exact approval scope, date, evidence link, and revision. Do not treat a generic merge as design approval.
- Draft design can evolve through direct commits on main; label its state explicitly. Claude implementation requires an approved, complete handover. Never claim a draft is implementation-ready.
- Before every switch or stop, update STATUS with what changed, current branch/commit (PR only if requested), unresolved questions, and one next action. Commit and push directly to main by default, per studio/RULES.md. Create PRs only when the owner requests them. Report local-only work plainly.
- Do not store credentials, private tokens, personal analytics, or unlicensed production assets. Asset prompts and previews are not proof of rights or production readiness.
- Direct publication to main is owner-authorized for all Game Studio work. Never force-push shared work, overwrite unrelated code, or merge an optional PR without owner authorization. Inspect dirty work before checkout or pull; never discard it.
- Implementation questions go through the feedback protocol. Do not quietly edit an approved handover or change mechanics in an implementation patch.
