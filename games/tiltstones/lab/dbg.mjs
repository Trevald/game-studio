import { readFileSync } from "node:fs";
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const code = html.slice(html.indexOf("// ======================= constants"), html.indexOf("// ======================= storage"));
const E = new Function(code + "\nreturn { LEVELS, newGame, step, solveFrom, counts, DT, applyAction, evalGame, cloneGame, wantedTargets, distField };")();
const i = E.LEVELS.findIndex((L) => L.id === "L1");
const acts = E.solveFrom(E.newGame(i), 6000);
const g = E.newGame(i); for (const a of acts.slice(0, 240)) E.applyAction(g, a);
const c = E.counts(g); const base = { ...c, lives: g.lives, color: g.ball.color, stuck: false };
console.log(g.ball, [...E.wantedTargets(g)], E.evalGame(g, base));
const d = E.distField(g, E.wantedTargets(g)); for (let y = 0; y < 14; y++) console.log(d.slice(y * 10, y * 10 + 10).map((v) => String(v).padStart(3)).join(""));
for (const p of [["right", 9, "stay"], ["stay", 9, "stay"], ["left", 5, "stay"]]) { const t = E.cloneGame(g); const ev = []; for (let k = 0; k < 24; k++) { E.applyAction(t, k < p[1] ? p[0] : p[2]); if (k % 2) ev.push(Math.round(E.evalGame(t, base))); } console.log(p.join(","), ev.join(" "), t.ball.x.toFixed(1)); }
