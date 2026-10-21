# Gameplay state exploration

Concept sheet: gameplay-states.png. Created 21 October 2026 with the built-in image generation tool. Visual proposal, not an implemented or approved mechanics change.

Six states: ready; partial selection; exact four-tile chain with proposed ×2 reward; over-target selection with backtracking; striped candy activation preview; row clear and refill.

Verified visual arithmetic: 2+3=5, 2+3+1+4=10, 2+3+1+6=12. Selection paths are orthogonal. The fifth row-clear tile (7) is excluded from the sum. 175×2=350 uses the existing four-tile base score with a proposed multiplier.

Refinements before implementation: use the new cream pause-button style; add explicit “Release to clear” to the exact-chain state; retain hollow rating stars until completion; disable Hint during resolution; settle special-candy spawn placement and row-bonus scoring before coding. The 350 displayed represents chain points only, with the separate row bonus unresolved. Screen proportions are illustrative and must be adapted to the actual phone viewport. Specials are independent state studies, not a continuous move sequence. Do not change existing rules based solely on raster artwork.

## Generation prompt

Use case: ui-mockup. Make a polished high resolution visual design sheet for Math Crush candy mobile gameplay, SIX portrait screens in 3 columns x 2 rows. Each screen true tall phone proportion about 390:844, with small external numbered state captions in margins. Overall sheet near square. No device frames. Reference 1 supplies approved NEW UI: cream panels, dark plum type, raspberry accents, thin warm edges, gentle shadows. Reference 2 supplies the existing candy gameplay world, glossy numbered square candies and 5x5 board. Preserve candy landscape and tile appeal, redesign HUD to be calmer and compact. No thick orange frames, gold-rim teal buttons, giant logo, menus or modals.
All screens have identical layout: top small pause icon and 'Level 4'; compact cream HUD Moves 5 / Target 10 / Score 0 (except explosion state Moves 4 Score 350); narrow progress strip '0 / 3 chains' (explosion 1 / 3 chains); centered large exactly 5-column x 5-row candy board with legible white numbers, subtle dark plum board well; cream running-sum strip underneath; short feedback text; restrained cream Hint button near bottom. Background is pastel candy hills, soften behind UI. Match the same layout across screens and make every screen complete with top and bottom visible. Keep numbers unobscured, links run in gaps or behind numbers. Tiny sparkle effects, no chaotic giant text.
Use exact board in first five screens, row major:
2 3 1 4 7
4 1 6 2 8
5 3 2 9 1
7 2 4 3 6
1 5 2 4 8.
SIX STATES:
1 caption '01 · Ready'. Unselected board, running strip 'Make 10', instruction 'Connect neighbouring candies'. Hint action.
2 caption '02 · Building a chain'. Select first two tiles in top row 2 and 3 with warm gold outlines and a continuous connector. Other tiles normal. Strip '2 + 3 = 5', instruction '5 more to reach 10'. No multiplier yet.
3 caption '03 · Longer chain reward'. Top row first FOUR tiles 2,3,1,4 selected and connected horizontally. Strip '2 + 3 + 1 + 4 = 10', elegant raspberry badge '×2', instruction 'Release to clear', little secondary line '175 × 2 = 350 points'. Subtle striped-candy reward preview beside label 'Striped candy earned'. This is still held before release so counters unchanged.
4 caption '04 · Too high — backtrack'. Select top row first TWO tiles 2,3 and then row2 column2 value1 and row2 column3 value6, continuous legal right/down/right path, sum 12. Use amber edging rather than harsh red. Strip '2 + 3 + 1 + 6 = 12', instruction 'Too high · slide back to adjust'. No point award and moves remain 5 while dragging.
5 caption '05 · Special candy preview'. Top row third tile value1 now has clearly visible horizontal candy stripes while retaining number. Select the first four top-row tiles, same valid 2+3+1+4=10; all five cells of first row have a subtle translucent horizontal effect preview, selected four have strong gold outlines, fifth tile value7 has light preview glow ONLY and is NOT connected or included in expression. Strip '2 + 3 + 1 + 4 = 10', instruction 'Release to clear the row', secondary 'Extra candies do not change your sum'. 
6 caption '06 · Pop & refill'. Show immediately after successful special chain: top row breaking into small candy sparkles with 5 clear column-aligned ghost slots and restrained downward trails indicating incoming tiles, other 20 numbered tiles stable in 4 rows. Floating '350' and smaller 'Row bonus' without invented numeric bonus. Moves4, Score350 and progress1/3. Strip 'Sweet chain! ×2', feedback 'Row cleared · new candies incoming'. No interactable boost controls.
Presentation looks like premium final mobile game visual design, rich candy illustrations with crisp typography and coherent restrained UI. No ads, currencies, lives, timers, purchases, operator buttons, diagonal paths. These are state studies not a sequential recording, but each screen must be arithmetically correct. Do not add extra columns or rows.
