// node gen.mjs [seed]  → levels.json. Each level: unique answer (exact cover) and solvable by the two human steps.
import { makeLevel, rng } from "./core.mjs";
import fs from "node:fs";
const seed = Number(process.argv[2] || 2810);
const r = rng(seed);
const pool = (W, H, n, maxWalls, extra = {}) => { const out = []; let t = 0; while (out.length < n && t < n * 8) { t++; const L = makeLevel(W, H, r, { maxWalls, ...extra }); if (L) out.push({ ...L, b: L.rounds - L.singles, ones: L.regions.filter((c) => c.length === 1).length }); } return out; };
const levels = [];
const take = (list, k, key) => list.sort(key).slice(0, k);
// 4x3 first board: small regions, at most one lookahead round
const p3 = pool(4, 3, 30, 2, { sizes: [2, 3, 3, 4], maxOnes: 1 });
levels.push(take(p3.filter((L) => L.b <= 1), 1, (a, b) => a.walls.length - b.walls.length)[0]);
// 4x4 tutorial: few walls, little lookahead, at least one lone 1
const p4 = pool(4, 4, 40, 3);
const t4 = take(p4.filter((L) => L.ones >= 1), 2, (a, b) => a.walls.length + a.b * 2 - (b.walls.length + b.b * 2));
levels.push(...t4.sort((a, b) => a.b - b.b || a.walls.length - b.walls.length));
const p5 = pool(5, 5, 30, 4);
levels.push(...take(p5.filter((L) => L.b >= 1), 2, (a, b) => a.walls.length - b.walls.length || b.b - a.b).sort((a, b) => a.b - b.b));
const p6 = pool(6, 6, 40, 6);
levels.push(...take(p6.filter((L) => L.b >= 2 && L.ones <= 1), 3, (a, b) => a.walls.length - b.walls.length || b.b - a.b).sort((a, b) => a.b - b.b));
const p7 = pool(7, 7, 40, 9);
levels.push(...take(p7.filter((L) => L.b >= 3 && L.ones <= 2), 3, (a, b) => a.walls.length - b.walls.length || b.b - a.b).sort((a, b) => a.b - b.b));
const out = levels.map((L) => ({ w: L.W, h: L.H, d: L.dig.join(""), walls: L.walls.map((k) => k.split("-").map(Number)), regions: L.regions, steps: L.b }));
fs.writeFileSync(new URL("./levels.json", import.meta.url), JSON.stringify(out));
console.log(out.map((L, i) => `L${i + 1} ${L.w}x${L.h} walls ${L.walls.length} lookahead-rounds ${L.steps} regions ${L.regions.length}`).join("\n"));
console.log("pools", p4.length, p5.length, p6.length, p7.length);
