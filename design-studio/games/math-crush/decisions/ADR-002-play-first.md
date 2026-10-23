# ADR-002 — Play-first candy exploration

22 October 2026. State: **proposed**, with owner direction captured below. Supersedes no frozen packet by itself.

Context: the current build's first-level tip explains multipliers before play; a repeated briefing separates levels. The owner requests learning by playing, optional in-game tutorial nudges, and designs for achievements, tools, bonuses and specials. Match-only is separately recorded in FB-002; this exploration follows it.

Owner evidence: Codex chat `01a16481-97fa-7390-92c7-f627ee7ecc0a`, 22 October 2026: “I don't think the instructions are neccessary. Better to just start play and learn. Or these tips could be added in game on the first levels in a turorial kind of style” and “Create some designs for the changes we discussed. Tips, special blocks and everything else”.

Proposal: explore MC-010–019 in `../explorations/sweet-play-v1/DESIGN.md`; seven interactive scenes and catalogs in its index.html. Remove pre-level instruction gates, introduce one concept at a time on the board, add combinations/tools/bonus/stickers gradually, separate speed records from stars, verify level-specific score thresholds. Retain the existing candy art; keep Math Crush as the working title pending a naming decision.

Alternative: only remove routine briefings and improve existing specials; defer Rush, tools and collection. This is lower scope and should be preferred if playtesting finds the new systems distracting.

Consequences: changes to current star display, tutorials, scoring targets and assistance labels require a new handover. Earlier MC-002/006 intentionally specified hollow stars until result and Assisted labels; do not silently modify H-001-v1. Existing saves must remain recoverable. Later special mechanics need authored levels and model validation.

Approval boundary: owner approved creating designs and expressed the learn-through-play direction. Individual numeric rules, release scope, naming and implementation are not approved by this record. Next: owner reviews the interactive study; prepare a bounded handover after scope selection.
