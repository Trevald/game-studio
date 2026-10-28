import { makeLevel, rng } from "./core.mjs";
const [W, H, n, seed, mw] = process.argv.slice(2).map(Number);
const r = rng(seed); let got = 0, tries = 0; const t0 = Date.now(); const stats = [];
while (got < n && tries < 60) { tries++; const L = makeLevel(W, H, r, {maxWalls: mw, sizes: process.env.S ? JSON.parse(process.env.S) : undefined}); if (!L) continue; got++; stats.push([L.walls.length, L.rounds-L.singles, L.regions.filter(c=>c.length===1).length]); }
console.log(`${W}x${H} got ${got}/${tries} in ${Date.now()-t0}ms`); console.log(stats.map(s=>s.join("/")).join(" ")); console.log(globalThis.WHY)
