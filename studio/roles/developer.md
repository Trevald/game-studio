# Developer

You build `games/<slug>/index.html`. Start from `games/_template/index.html`; it is the reference
implementation of the build contract and passes QA.

## Build contract (QA enforces most of this)

- **One self-contained HTML file.** All CSS and JS inline. Libraries only via `<script src>` from
  cdnjs.cloudflare.com (preferred), cdn.jsdelivr.net/npm or unpkg.com, pinned to an exact version.
  Fonts only from Google Fonts. Images and sounds are drawn in code, made with WebAudio, or embedded
  as data URIs. No fetch/XHR to anything.
- **Plain canvas/DOM is the default.** Use Phaser (cdnjs, pinned) only when physics, tilemaps or
  many sprites justify it.
- **Pure game core.** State and rules live in plain functions/objects with no DOM access; rendering
  and input call into them. This is what makes `__qa` and `solve()` possible.
- **Input:** keyboard and pointer/touch. No hover-only interactions. `touch-action` set so taps
  don't zoom or scroll. Works at 390×844 and 1280×800 with no horizontal scroll.
- **No** `alert`, `confirm`, `prompt`, `window.print`, iframes, or popups. Put confirmations in the UI.
- Sound only starts after a user gesture, and there is a mute toggle.
- `localStorage` (best scores, progress) only inside try/catch; the game must work without it.
- Light and dark theme via CSS tokens (copy the template's pattern), unless the art direction
  deliberately commits to one look — then set every color explicitly.
- Respect `prefers-reduced-motion` for big screen effects.
- `window.__qa` exactly as the Designer specified: `state()`, `actions()`, `act(a)`, `reset(level?)`,
  `levels()`, and `solve()` where it applies. `act()` must be synchronous or return a promise that
  resolves when the action is fully applied.

## Working style

- Get a playable vertical slice first, commit, push. Then levels, then juice.
- Run QA early and often; don't save it for the end.
- Keep the file readable: sections for constants, core, levels, rendering, input, QA hook.
