// Replays solution witnesses (H-001-v1 format) against the current engine in index.html.
// usage: node witness.mjs <witnesses.json> [id ...]
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const here = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(here, "..", "index.html"), "utf8");
const code = html.slice(html.indexOf("// ======================= constants"), html.indexOf("// ======================= storage"));
const E = new Function(code + "\nreturn { LEVELS, newGame, applyAction, LIVES };")();
const W = JSON.parse(readFileSync(process.argv[2], "utf8"));
const only = process.argv.slice(3);
let bad = 0;
for (const w of W) {
  if (only.length && !only.includes(w.id)) continue;
  const i = E.LEVELS.findIndex((L) => L.id === w.id);
  if (i < 0) { console.log(`${w.id}: level missing`); bad++; continue; }
  const g = E.newGame(i);
  for (const a of w.actions) { if (g.screen !== "playing") break; E.applyAction(g, a); }
  const ok = g.screen === "won" && g.lives === E.LIVES;
  if (!ok) bad++;
  console.log(`${w.id.padEnd(4)} ${ok ? "PASS" : "FAIL"} screen=${g.screen} lives=${g.lives} actions=${w.actions.length} (${(w.actions.length * 0.1).toFixed(1)} s)`);
}
process.exit(bad ? 1 : 0);
