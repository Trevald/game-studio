// Random level search for Pip Push. Usage: node gen.mjs <w> <h> <dice> <tries> <seed> [wallDensity]
// For each random room it explores every reachable state (BFS on player steps), then picks the goal
// numbers whose shortest solution is longest. Prints the best rooms as JSON lines.
import { ORIENTS, encode, step } from "./core.mjs";
const [W, H, K, TRIES, SEED, DENS, TARGET] = process.argv.slice(2).map(Number);
let s = SEED || 1;
const rnd = () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648);
const CAP = 1500000;

function randomRoom() {
  const walls = new Set();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++)
    if (x === 0 || y === 0 || x === W - 1 || y === H - 1 || rnd() < (DENS || 0.18)) walls.add(y * W + x);
  const free = [...Array(W * H).keys()].filter((i) => !walls.has(i));
  // connectivity
  const seen = new Set([free[0]]), q = [free[0]];
  while (q.length) { const c = q.pop(); for (const d of [1, -1, W, -W]) { const n = c + d; if (!walls.has(n) && !seen.has(n)) { seen.add(n); q.push(n); } } }
  if (seen.size !== free.length || free.length < K * 2 + 4) return null;
  const pick = () => free.splice((rnd() * free.length) | 0, 1)[0];
  const player = pick();
  const interior = (p) => { const x = p % W, y = (p / W) | 0; let open = 0; for (const d of [1, -1, W, -W]) if (!walls.has(p + d)) open++; return open; };
  const dice = [], goals = [];
  for (let i = 0; i < K; i++) { let p, t = 0; do { p = pick(); t++; } while (interior(p) < 3 && t < 20); dice.push({ p, o: (rnd() * 24) | 0 }); }
  for (let i = 0; i < K; i++) goals.push(pick());
  return { w: W, h: H, walls, player, dice, goals };
}

function explore(L) {
  const start = { player: L.player, dice: L.dice };
  const seen = new Set([encode(start.player, start.dice)]);
  let frontier = [start], depth = 0, anyDepth = -1;
  const best = new Map(); // tuple -> depth
  const goalSet = L.goals;
  while (frontier.length && seen.size < CAP) {
    const next = [];
    for (const st of frontier) {
      // goal check
      let ok = true; const tops = [];
      for (const g of goalSet) { const d = st.dice.find((q) => q.p === g); if (!d) { ok = false; break; } tops.push(ORIENTS[d.o][0]); }
      if (ok) { if (anyDepth < 0) anyDepth = depth; const k = tops.join(""); if (!best.has(k)) best.set(k, depth); }
      for (const d of "UDLR") {
        const r = step(L, st.player, st.dice, d); if (!r) continue;
        const k = encode(r.player, r.dice); if (seen.has(k)) continue; seen.add(k); next.push(r);
      }
    }
    frontier = next; depth++;
  }
  return { best, anyDepth, states: seen.size, capped: seen.size >= CAP };
}

const out = [];
for (let t = 0; t < TRIES; t++) {
  const L = randomRoom(); if (!L) continue;
  const r = explore(L); if (r.capped || r.anyDepth < 0) continue;
  let bt = null, bd = -1, sc = -1e9;
  for (const [k, d] of r.best) {
    if (TARGET && (d < TARGET * 0.85 || d > TARGET * 1.15)) continue;
    const v = TARGET ? d - r.anyDepth : d; if (v > sc) { sc = v; bd = d; bt = k; } }
  if (bt === null) continue;
  out.push({ rank: sc, score: bd, any: r.anyDepth, tuples: r.best.size, states: r.states, L, tops: bt });
}
out.sort((a, b) => b.rank - a.rank);
for (const o of out.slice(0, 6)) {
  const { L } = o; const rows = [];
  for (let y = 0; y < H; y++) { let row = ""; for (let x = 0; x < W; x++) { const p = y * W + x; const gi = L.goals.indexOf(p); const di = L.dice.findIndex((d) => d.p === p);
    row += L.walls.has(p) ? "#" : p === L.player ? "@" : di >= 0 ? (gi >= 0 ? "*" : "o") : gi >= 0 ? o.tops[gi] : "."; } rows.push(row); }
  console.log(JSON.stringify({ score: o.score, any: o.any, tuples: o.tuples, states: o.states, map: rows, dice: L.dice.map((d) => [d.p % W, (d.p / W) | 0, ...ORIENTS[d.o]]), goals: L.goals.map((g, i) => [g % W, (g / W) | 0, +o.tops[i]]) }));
}
