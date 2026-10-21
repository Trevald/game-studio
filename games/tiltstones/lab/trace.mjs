// Solver-route trace: every useful event with time and cell, ASCII snapshots at each repaint and at the end.
// usage: node trace.mjs ID [--snap]
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const here = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(here, "..", "index.html"), "utf8");
const code = html.slice(html.indexOf("// ======================= constants"), html.indexOf("// ======================= storage"));
const E = new Function(code + "\nreturn { LEVELS, newGame, step, solveFrom, DT, STEPS_PER_ACTION, get W() { return W; } };")();
const id = process.argv[2], snap = process.argv.includes("--snap");
const i = E.LEVELS.findIndex((L) => L.id === id);
const acts = E.solveFrom(E.newGame(i), 6000);
const g = E.newGame(i);
const pic = () => { const W = E.W, rows = []; for (let y = 0; y < g.grid.length / W; y++) { let r = ""; for (let x = 0; x < W; x++) r += Math.floor(g.ball.x) === x && Math.floor(g.ball.y) === y ? "@" : g.grid[y * W + x]; rows.push("   " + r); } return rows.join("\n"); };
const names = ["blue", "red", "green", "gold"];
for (const a of acts) for (let k = 0; k < E.STEPS_PER_ACTION && g.screen === "playing"; k++) {
  E.step(g, a === "left" ? -1 : a === "right" ? 1 : 0);
  for (const e of g.ev) if (e.t !== "tick" && e.t !== "thud") {
    console.log(`${(g.steps * E.DT).toFixed(1).padStart(5)}s ${e.t.padEnd(7)} (${Math.floor(e.x)},${Math.floor(e.y)})${e.t === "paint" ? " → " + names[e.color] : ""}`);
    if (snap && (e.t === "paint" || e.t === "grey")) console.log(pic());
  }
  g.ev.length = 0;
}
console.log(`end: ${g.screen} at ${(g.steps * E.DT).toFixed(1)} s`); console.log(pic());
