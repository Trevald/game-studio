// Before/after access check (RIC-N-003): from a prepared state, how long does the solver's route take to reach
// an event, with a specific block present vs changed?
// usage: node access.mjs ID <ballColour 0-3> <bx,by> <event> [cell ...]
//   event: "paint:1" (paint to red), "break@x,y" (that cell breaks), "grey", ...
//   cell:  "x,y" removes the tile and "x,y=#" replaces it, in the CHANGED run only;
//          prefix "+" (e.g. "+3,4" or "+a") to prepare BOTH runs; "+a" removes every tile of that symbol.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const here = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(here, "..", "index.html"), "utf8");
const code = html.slice(html.indexOf("// ======================= constants"), html.indexOf("// ======================= storage"));
const E = new Function(code + "\nreturn { LEVELS, newGame, step, planStep, DT, STEPS_PER_ACTION, get W() { return W; } };")();
const [id, colour, at, evArg, ...cells] = process.argv.slice(2);
const i = E.LEVELS.findIndex((L) => L.id === id);
const both = cells.filter((c) => c.startsWith("+")).map((c) => c.slice(1)), only = cells.filter((c) => !c.startsWith("+"));
function apply(g, list) {
  for (const c of list) {
    if (!c.includes(",")) { g.grid = g.grid.map((ch) => (c.includes(ch) ? "." : ch)); continue; }
    const [xy, ch] = c.split("="); const [x, y] = xy.split(",").map(Number); g.grid[y * E.W + x] = ch || ".";
  }
}
function matches(e) {
  if (evArg.includes("@")) { const [k, xy] = evArg.split("@"); const [x, y] = xy.split(",").map(Number); return e.t === k && Math.floor(e.x) === x && Math.floor(e.y) === y; }
  const [k, col] = evArg.split(":"); return e.t === k && (col === undefined || e.color === +col);
}
function run(list) {
  const g = E.newGame(i); apply(g, list);
  const [bx, by] = at.split(",").map(Number);
  Object.assign(g.ball, { x: bx + 0.5, y: by + 0.5, color: +colour });
  const route = [];
  for (let n = 0; n < 80 && g.screen === "playing"; n++) {
    const p = E.planStep(g); if (!p) break;
    for (const a of p.acts) for (let k = 0; k < E.STEPS_PER_ACTION; k++) {
      E.step(g, a === "left" ? -1 : a === "right" ? 1 : 0);
      for (const e of g.ev) {
        if (["break", "grey", "paint", "unlock", "key", "diamond"].includes(e.t)) route.push(`${e.t}(${Math.floor(e.x)},${Math.floor(e.y)})`);
        if (matches(e)) return { t: g.steps * E.DT, route };
      }
      g.ev.length = 0;
    }
  }
  return { t: null, route };
}
const fmt = (r) => (r.t == null ? "not reached" : r.t.toFixed(1) + " s") + "  route: " + r.route.join(" ");
console.log(`${id} as is:            ${fmt(run(both))}`);
console.log(`${id} with ${only.join(" ")}: ${fmt(run([...both, ...only]))}`);
