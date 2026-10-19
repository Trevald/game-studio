// Debug: where do the long no-hit gaps happen on the solver route?  usage: node gaps.mjs L1 [L2 ...]
import { readFileSync } from "node:fs";
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const code = html.slice(html.indexOf("// ======================= constants"), html.indexOf("// ======================= storage"));
const E = new Function(code + "\nreturn { LEVELS, newGame, step, solveFrom, counts, DT, STEPS_PER_ACTION };")();
const P = new Set(["break", "grey", "diamond", "key", "unlock", "paint"]);
for (const id of process.argv.slice(2)) {
  const i = E.LEVELS.findIndex((L) => L.id === id);
  const acts = E.solveFrom(E.newGame(i), 6000);
  const g = E.newGame(i); let last = 0, lastPos = [g.ball.x, g.ball.y], lastEv = "start";
  console.log(`== ${id}`);
  for (const a of acts) for (let k = 0; k < 6 && g.screen === "playing"; k++) {
    E.step(g, a === "left" ? -1 : a === "right" ? 1 : 0);
    const t = g.steps * E.DT;
    for (const e of g.ev) if (P.has(e.t)) {
      if (t - last > 1) { const c = E.counts(g); console.log(`gap ${(t - last).toFixed(1)}s  ${last.toFixed(1)}→${t.toFixed(1)}  from ${lastEv}@(${lastPos.map((v) => v.toFixed(1))}) to ${e.t}@(${e.x.toFixed(1)},${e.y.toFixed(1)})  colours left ${c.colorTotal} ball ${g.ball.color} lives ${g.lives}`); }
      last = t; lastPos = [e.x, e.y]; lastEv = e.t;
    }
    g.ev.length = 0;
  }
  const rows = []; for (let y = 0; y < E.LEVELS[i].map.length; y++) rows.push(g.grid.slice(y * E.LEVELS[i].map[0].length, (y + 1) * E.LEVELS[i].map[0].length).join(""));
  if (g.screen !== "won") console.log("NOT WON. final grid:\n" + rows.join("\n"), "ball", g.ball);
}
