// Picks the chosen generator outputs, solves each with BFS and writes levels.json for the game.
import { solve, pushes } from "./solve.mjs";
import fs from "node:fs";
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
];
const out = [];
for (const lv of L) {
  const map = lv.map.map((r) => r.replace(/[^#@]/g, "."));
  const clean = { ...lv, map };
  const sol = solve(clean);
  if (!sol) throw new Error("unsolvable: " + lv.name);
  out.push({ ...clean, sol, par: pushes(clean, sol) });
  console.log(lv.name.padEnd(16), "moves", sol.length, "pushes", out.at(-1).par);
}
fs.writeFileSync(new URL("./levels.json", import.meta.url), JSON.stringify(out));
