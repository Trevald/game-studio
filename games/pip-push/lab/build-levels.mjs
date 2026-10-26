// Picks the chosen generator outputs, solves each with BFS and writes levels.json for the game.
import { solve, pushes } from "./solve.mjs";
import fs from "node:fs";
import { pushSolve } from "./push.mjs";
import { toS } from "./check-par.mjs";
const L = [
  { name: "First roll", map: ["#######", "#@o..3#", "#######"], dice: [[2, 1, 1, 2, 3]], goals: [[5, 1, 3]] },
  { name: "Side step", map: ["######", "#....#", "#@.o.#", "#...6#", "######"], dice: [[3, 2, 4, 1, 5]], goals: [[4, 3, 6]] },
  { name: "Nook", map: ["######", "#.#.@#", "#.o..#", "#...3#", "######"], dice: [[2, 2, 4, 2, 1]], goals: [[4, 3, 3]] },
  // re-picked after the night-1 review (gen2.mjs: no repeated push loops)
  { name: "Turnaround", map: ["######", "#....#", "#@...#", "#....#", "######"], dice: [[3, 2, 2, 6, 3]], goals: [[4, 1, 6]] },
  { name: "Wander", map: ["#######", "#...#.#", "#..@..#", "##....#", "#.....#", "#######"], dice: [[2, 2, 2, 1, 4]], goals: [[1, 2, 2]] },
  { name: "Two dice", map: ["######", "#@6..#", "#....#", "#.o..#", "#3.o.#", "######"], dice: [[2, 3, 3, 5, 1], [3, 4, 4, 6, 2]], goals: [[1, 4, 3], [2, 1, 6]] },
  { name: "Crossing", map: ["######", "#....#", "#@...#", "#....#", "##..##", "######"], dice: [[2, 2, 4, 6, 2], [2, 3, 5, 3, 6]], goals: [[1, 1, 4], [4, 3, 3]] },
  { name: "Open floor", map: ["#######", "##....#", "#.....#", "#.....#", "#...@.#", "#######"], dice: [[4, 2, 1, 3, 5], [4, 3, 5, 6, 4]], goals: [[2, 4, 4], [5, 3, 1]] },
  { name: "Post", map: ["#######", "#.....#", "#.....#", "#.#...#", "#...@##", "#######"], dice: [[3, 2, 5, 6, 4], [4, 2, 4, 5, 6]], goals: [[1, 2, 4], [5, 2, 2]] },
  { name: "Cellar", map: ["#######", "#.#...#", "#...@.#", "#.#..##", "#.....#", "#...#.#", "#######"], dice: [[2, 2, 4, 1, 5], [3, 4, 4, 1, 5]], goals: [[3, 1, 6], [5, 4, 4]] },
  // night 2 (gen3.mjs, push-level search; first three-dice rooms)
  { name: "Three's company", map: ["######", "#.@..#", "#....#", "#....#", "#....#", "######"], dice: [[1, 2, 2, 3, 1], [4, 2, 3, 6, 5], [2, 3, 6, 3, 2]], goals: [[1, 4, 6], [1, 1, 4], [4, 1, 1]], push: true },
  { name: "Pillar walk", map: ["#######", "#..@..#", "#.#...#", "#.....#", "#.....#", "#######"], dice: [[4, 3, 3, 1, 2], [3, 3, 6, 3, 2]], goals: [[4, 2, 4], [1, 1, 4]], push: true },
  { name: "Notch", map: ["######", "#....#", "#...##", "#....#", "#..@.#", "######"], dice: [[3, 3, 6, 4, 5], [2, 1, 3, 1, 2], [2, 2, 1, 2, 3]], goals: [[1, 2, 6], [4, 3, 6], [4, 1, 4]], push: true },
  { name: "Dock", map: ["#######", "#.....#", "#....@#", "#.....#", "#..#..#", "#######"], dice: [[2, 2, 5, 1, 3], [5, 3, 3, 2, 6], [3, 3, 6, 2, 4]], goals: [[4, 4, 6], [4, 1, 5], [5, 4, 2]], push: true },
  { name: "Three ways", map: ["#######", "#.....#", "#.@...#", "#.....#", "#..#..#", "#######"], dice: [[4, 3, 6, 3, 2], [3, 2, 2, 6, 3], [4, 1, 4, 1, 5]], goals: [[3, 1, 5], [2, 3, 4], [5, 3, 2]], push: true },
  // night 3: ice (gen4.mjs) — a die pushed onto ice keeps rolling until it leaves the ice or is blocked
  { name: "First slide", map: ["#########", "#@.~~~..#", "#########"], dice: [[2, 1, 2, 3, 1]], goals: [[7, 1, 6]], push: true },
  { name: "Short cut", map: ["#######", "#..~.##", "#@.~.~#", "#..~~~#", "#######"], dice: [[2, 2, 1, 3, 5]], goals: [[2, 3, 4]], push: true },
  { name: "Ice lane", map: ["#######", "#.#~.##", "#..~..#", "#@.~..#", "#.~~#.#", "#######"], dice: [[2, 2, 4, 1, 5]], goals: [[4, 3, 6]], push: true },
  { name: "Skid row", map: ["########", "#..~..~#", "#..~..##", "#..~~.~#", "#.@~~..#", "########"], dice: [[5, 3, 3, 5, 1]], goals: [[5, 4, 6]], push: true }, // re-picked after review (no repeated circuits)
  { name: "Two on ice", map: ["#######", "#....@#", "#..~..#", "#..~~.#", "#...#.#", "#######"], dice: [[2, 2, 5, 4, 1], [2, 3, 6, 5, 3]], goals: [[5, 2, 1], [1, 3, 1]], push: true },
  { name: "Rink", map: ["#######", "#.#@.##", "#.....#", "#..~..#", "#..~~.#", "#######"], dice: [[4, 2, 6, 4, 5], [2, 2, 5, 3, 6]], goals: [[2, 3, 1], [2, 4, 2]], push: true }, // re-picked after review
];
const out = [];
for (const lv of L) {
  const map = lv.map.map((r) => r.replace(/[^#@~&]/g, "."));
  const clean = { ...lv, map };
  const min = pushSolve(toS(clean), 3e6); // true minimum pushes = par (night 2)
  if (!min || min.capped) throw new Error("unsolvable: " + lv.name);
  const sol = lv.push ? min.moves : solve(clean); // night-1 levels keep their step-shortest solution
  if (!sol || pushes(clean, sol) !== min.pushes) throw new Error("solution is not minimum-push: " + lv.name);
  delete clean.push;
  out.push({ ...clean, sol, par: min.pushes });
  console.log(lv.name.padEnd(16), "moves", sol.length, "pushes", out.at(-1).par);
}
fs.writeFileSync(new URL("./levels.json", import.meta.url), JSON.stringify(out));
