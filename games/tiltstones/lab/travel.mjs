// where does the longest contact-free flight happen? usage: node travel.mjs L3
import { readFileSync } from "node:fs";
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const code = html.slice(html.indexOf("// ======================= constants"), html.indexOf("// ======================= storage"));
const E = new Function(code + "\nreturn { LEVELS, newGame, step, solveFrom, DT };")();
for (const id of process.argv.slice(2)) {
  const i = E.LEVELS.findIndex((L) => L.id === id), w = E.LEVELS[i].map[0].length;
  const acts = E.solveFrom(E.newGame(i), 6000), g = E.newGame(i);
  let travel = 0, best = { d: 0 }, lastVy = g.ball.vy, lastY = g.ball.y, startT = 0;
  for (const a of acts) for (let k = 0; k < 6 && g.screen === "playing"; k++) {
    E.step(g, a === "left" ? -1 : a === "right" ? 1 : 0);
    travel += Math.abs(g.ball.y - lastY); lastY = g.ball.y;
    const contact = Math.sign(g.ball.vy) !== Math.sign(lastVy) || g.ev.length; lastVy = g.ball.vy; g.ev.length = 0;
    if (contact) { if (travel > best.d) best = { d: travel, t: g.steps * E.DT, x: g.ball.x, y: g.ball.y, grid: g.grid.slice() }; travel = 0; }
  }
  console.log(id, "flight", best.d.toFixed(1), "rows, ending at t", best.t.toFixed(1), "x", best.x.toFixed(1), "y", best.y.toFixed(1));
  for (let y = 0; y < best.grid.length / w; y++) console.log(best.grid.slice(y * w, y * w + w).join(""));
}
