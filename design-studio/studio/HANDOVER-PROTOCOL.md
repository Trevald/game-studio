# Handover and feedback protocol

## Roles and gates

The owner approves design scope and accepts the result. The design agent prepares specifications and resolves design questions. Claude Code inspects the implementation repository, implements approved requirements, tests them, and reports evidence. Direct publication to main is authorized by the studio-wide preference in root studio/RULES.md; publication is separate from design approval. PRs are optional only when explicitly requested.

Use these states: draft → in review → approved → delivered → implementing → verification → accepted. Blocked may apply at any stage with a reason. Rejected or superseded packets remain in history.

## Freeze, approve, deliver

1. Copy `handovers/HANDOVER-TEMPLATE.md` into a new version folder such as `handovers/H-001-v1/HANDOVER.md`. Add a self-contained snapshot of every in-scope requirement, necessary screen/interaction specification, level examples, relevant accepted decisions, and asset records. Put large assets at verified immutable locations if they cannot be included. No essential instruction may depend on a chat or an unpinned main-branch link.
2. Complete the readiness checklist. A partial scope is allowed only when explicitly bounded and independent of unresolved questions. Mark the packet as an approval candidate and commit it. The commit pins the whole packet; do not attempt to embed its own final commit hash in its contents.
3. Publish the candidate to main, clearly marked as awaiting approval. Ask the owner to approve in chat or another durable source: `Approved H-001-v1 for GAME, packet at COMMIT_SHA, scope [requirement IDs], exclusions [list].` Record approver identity, date, exact commit, exact approval wording and evidence link in STATUS (chat link is valid). A published draft or generic “looks good” without identifiable scope is insufficient. If covered files change, request approval for the new revision. Do not let an agent approve itself.
4. Before delivery, verify the approved folder is unchanged on main. Record the published source commit and compare packet contents against the approved candidate. If content changed, re-approve. Freeze the packet at its path; corrections go into a new version.
5. In the existing game's implementation repository, inspect repository instructions, current code, dirty work, and destination collisions. Follow the destination repository publishing rules; in Game Studio, commit directly to main. Copy the approved packet into a new `docs/design/studio/H-001-v1/` folder. Include a DELIVERY.md receipt with studio URL, approved candidate SHA, published source SHA, original packet path, approval evidence link, and delivery commit URL (PR URL only if requested). Use `integration/DELIVERY-TEMPLATE.md`.
6. Publish the approved packet using the destination rules; for Game Studio, commit and push directly to main. Do not overwrite existing instructions or implementation. Add a compatible CLAUDE pointer only after reviewing current rules. Record the verified target commit in studio STATUS through a direct main commit. If source or destination publication is incomplete, STATUS remains delivery pending; verify remote state before retrying to avoid duplicate packets. For a game implemented in Game Studio, follow REPOSITORY-INTEGRATION.md and the night-shift in-place packet convention; do not create a redundant delivery copy.
7. Start Claude with the exact destination packet path and version. Claude first reports the implementation plan and any blockers. It must not treat future edits to DESIGN as changes to the approved scope.

## Claude's completion report

Use the feedback template. Link the implementation commit (PR only if requested), code commit, packet version, and requirement IDs. Report what was implemented, tests run and actual outcomes, device/simulator checks, screenshots or recordings, deviations, remaining work, and steps to reproduce. Distinguish not run from passed. Keep evidence durable in the implementation repository or linked evidence artifacts.

## Questions, deviations, and corrections

Create a feedback record or issue with a stable ID, packet version, affected requirements, observed behavior, expected behavior, evidence, impact, and proposed options. Record it in STATUS. Mark whether it blocks all work or only a named requirement; Claude may continue independent approved work.

Implementation bugs that violate a clear requirement can be fixed within the same approved scope. Changes to mechanics, UX, level intent, acceptance criteria, scope, or asset usage require a design decision. The design agent proposes a resolution; the owner approves it; a new handover version carries any changed implementation contract through a new versioned delivery commit (PR only if requested). Never silently patch an old approved packet.

Close feedback only after linking the resolution, implementation commit, verification evidence, and owner acceptance where required. Document out-of-scope suggestions as backlog items. Feedback in the code repository is authoritative for observations; studio records link to it and retain the resulting design decision.
