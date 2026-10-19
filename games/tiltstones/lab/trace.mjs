import { readFileSync } from "node:fs";
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const code = html.slice(html.indexOf("// ======================= constants"), html.indexOf("// ======================= storage"));
const E = new Function(code + "\nreturn { LEVELS, newGame, step, solveFrom, counts, DT, applyAction };")();
const [id, from, to] = [process.argv[2], +process.argv[3], +process.argv[4]];
const i = E.LEVELS.findIndex((L) => L.id === id);
const acts = E.solveFrom(E.newGame(i), 6000);
const g = E.newGame(i); let n = 0;
for (const a of acts) { E.applyAction(g, a); n++; const t = n / 10;
  if (t >= from && t <= to && n % 5 === 0) console.log(t.toFixed(1), a, g.ball.x.toFixed(2), g.ball.y.toFixed(2), g.ball.vy > 0 ? "v" : "^");
  if (t > to) break; }
const w = E.LEVELS[i].map[0].length; for (let y = 0; y < g.grid.length / w; y++) console.log(g.grid.slice(y * w, y * w + w).join(""));
