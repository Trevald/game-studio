// Picks the chosen generator outputs, solves each with BFS and writes levels.json for the game.
import { solve, pushes } from "./solve.mjs";
import fs from "node:fs";
const L = [
  { name: "First roll", map: ["#######", "#@o..3#", "#######"], dice: [[2, 1, 1, 2, 3]], goals: [[5, 1, 3]] },
  { name: "Side step", map: ["######", "#....#", "#@.o.#", "#...6#", "######"], dice: [[3, 2, 4, 1, 5]], goals: [[4, 3, 6]] },
  { name: "Nook", map: ["######", "#.#.@#", "#.o..#", "#...3#", "######"], dice: [[2, 2, 4, 2, 1]], goals: [[4, 3, 3]] },
  { name: "Corner three", map: ["######", "#...3#", "#....#", "##o..#", "#.@..#", "######"], dice: [[2, 3, 5, 6, 4]], goals: [[4, 1, 3]] },
  { name: "Two dice", map: ["######", "#@6..#", "#....#", "#.o..#", "#3.o.#", "######"], dice: [[2, 3, 3, 5, 1], [3, 4, 4, 6, 2]], goals: [[1, 4, 3], [2, 1, 6]] },
  { name: "Long way round", map: ["#######", "#6.@..#", "#....##", "#.#o..#", "#.....#", "#######"], dice: [[3, 3, 4, 2, 1]], goals: [[1, 1, 6]] },
  { name: "Tight shelf", map: ["#######", "##..o6#", "#..o3##", "#.#...#", "#.@...#", "#######"], dice: [[4, 1, 2, 3, 1], [3, 2, 3, 6, 5]], goals: [[5, 1, 6], [4, 2, 3]] },
  { name: "Pillar", map: ["#######", "#.....#", "#.#@o.#", "#1o5..#", "#.....#", "#######"], dice: [[4, 2, 1, 3, 5], [2, 3, 1, 5, 4]], goals: [[3, 3, 5], [1, 3, 1]] },
  { name: "Twin twos", map: ["#######", "#..@.##", "#..2..#", "##.oo.#", "##2..##", "#######"], dice: [[4, 3, 6, 4, 5], [3, 3, 5, 4, 1]], goals: [[3, 2, 2], [2, 4, 2]] },
  { name: "Cellar", map: ["#######", "#..#..#", "##.#..#", "#.6o..#", "#.@o..#", "#1#...#", "#######"], dice: [[3, 3, 2, 6, 3], [3, 4, 5, 3, 6]], goals: [[1, 5, 1], [2, 3, 6]] },
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
