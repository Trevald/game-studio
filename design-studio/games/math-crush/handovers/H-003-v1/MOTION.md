# Motion, effects and audio specification
Model commits atomically; this timeline is presentation only. Record a normal-speed clip of each effect. Match the existing candy textures with original gloss, soft elastic movement and readable anticipation. Do not copy branded animations or audio.

| Moment | Timing / behavior | Asset / implementation |
|---|---|---|
| Pointer press |70ms scale face0.96; release90ms; hit box remains fixed | CSS transform on inner face |
| Extend chain |60ms connector draw, selection ring120ms settle, tiny pitched click | native SVG line, existing optional synthesized tone |
| Eligible reward preview |180ms badge scale0.85→1; one shine sweep | existing special overlay + glint.svg |
| Valid ordinary clear |80ms anticipation to1.04,160ms pop/fade; path follows selected order20ms stagger capped80 | candy atlas; burst.svg sparingly |
| Stripe |80ms charge,140ms directional sweep from candy toward both edges; hit candies pulse once | row-blast.svg clipped to row, not whole board flash |
| Wrapped |100ms squash,180ms radial burst to affected footprint; one small camera-free impulse | burst.svg, max12 particles |
| Combination |100ms pair-link anticipation then240ms area effect; other fired specials40ms stagger capped120 | union-of-area clipping, same SVG kit |
| Jelly removed |160ms crack/fade,2–4 shard fragments per patch,≤20 total | jelly.svg/jelly-shard.svg, no new texture needed |
| Fall |distance-based120–240ms ease-in;90ms settle bounce of face≤3px | transform; IDs remain tied to stable slots |
| Score |250ms count-up in HUD, one popup outside selected digits900ms; chain/blast shown distinctly | live text, no image numerals |
| New target |after settle,180ms old→new slide/crossfade; next chip shifts; no input until done | target-next.svg, live text |
| Region unlock |600ms maximum cream path reveal and8–12confetti pieces; tap skips | native path mask + confetti.svg |

Total resolving input lock budget≤900ms even for combinations (coalesce secondary effects to meet it). Give pointer feedback within100ms. No endless chain-of-animations blocking the game. Pause/visibility interruption resolves presentation immediately to committed state; resume does not repeat scores.

Idle: cloud.svg drift8–14px over12–18s alternate, max2 layers. Scenery sparkle every6–10s, one at a time, opacity0→.55→0 over900ms. One tile glint every5–8s,≤2px face movement, never changes numbers or suggests a hint; choose deterministic cosmetic rotation separate from gameplay RNG. Special candy wobble±2degrees over900ms once every5s, no slot translation. Current map pin breathes scale1→1.04 over2.8s, no pulsating lock nodes. Stop all board idle effects while selecting; stop global loops in modal/hidden. Don't consume gameplay RNG, save history or idle time for these effects.

Reduced motion: no loops, travel, scale, rotation, confetti or camera movement;≤80ms fades. Target changes instantly with one polite announcement. Preserve all blast previews and numeric feedback statically. Never flash at3Hz+. Sound: short synthesized pop; stripe ascending sweep; wrapped low soft thump; combo short two-note accent. Existing mute respected, no external audio recordings needed, no overlap beyond4voices, no loudness jump on combo. Haptics only optional navigator.vibrate where present, at most one short pulse per commit.

Supply screenshots at anticipation/impact/settle as well as video. Judge whether the game feels responsive, not just whether CSS keyframes exist. Do not make the whole board shake to compensate for weak candy effects.

assets/motion.css supplies reference keyframes; production must wire visibility/selection/reduced-motion state and sequence effects. It is not an autonomous animation engine.
