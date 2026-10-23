// Compares stored par with the true minimum pushes (push-level solver). node check-par.mjs
import { pushSolve } from "./push.mjs";
import { parse, pushes } from "./solve.mjs";
import { ORIENTS } from "./core.mjs";
import fs from "node:fs";
export function toS(lv) { const L = parse(lv); return { w: L.w, h: L.h, walls: L.walls, player: L.player, goals: L.goals, dice: L.dice.map((d) => ({ p: d.p, o: ORIENTS[d.o] })) }; }
if (import.meta.url === `file://${process.argv[1]}`) {
  const lvls = JSON.parse(fs.readFileSync(new URL("./levels.json", import.meta.url)));
  for (const lv of lvls) { const t = Date.now(); const r = pushSolve(toS(lv)); console.log(lv.name.padEnd(14), "par", lv.par, "min", r.pushes, "moves", r.moves.length, "check", pushes(lv, r.moves), Date.now() - t + "ms"); }
}
