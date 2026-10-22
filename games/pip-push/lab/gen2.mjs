// Second-pass search (night 1, after review): like gen.mjs, but solves each candidate and rejects
// solutions that repeat a push loop (the same 4 pushes twice in a row, or one die pushed in the same
// 4-direction cycle 3+ times). Ranks by push count near TARGET and by variety of the push sequence.
// Usage: node gen2.mjs <w> <h> <dice> <tries> <seed> <density> <targetPushes>
import { ORIENTS, encode, step } from "./core.mjs";
import { solve, parse } from "./solve.mjs";
const [W, H, K, TRIES, SEED, DENS, TP] = process.argv.slice(2).map(Number);
let s = SEED >>> 0 || 1;
const rnd = () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
function room() {
  const walls = new Set();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (!x || !y || x === W - 1 || y === H - 1 || rnd() < DENS) walls.add(y * W + x);
  const free = [...Array(W * H).keys()].filter((i) => !walls.has(i));
  const seen = new Set([free[0]]), q = [free[0]];
  while (q.length) { const c = q.pop(); for (const d of [1, -1, W, -W]) { const n = c + d; if (!walls.has(n) && !seen.has(n)) { seen.add(n); q.push(n); } } }
  if (seen.size !== free.length || free.length < K * 2 + 5) return null;
  const pick = () => free.splice((rnd() * free.length) | 0, 1)[0];
  const player = pick(), dice = [], goals = [];
  for (let i = 0; i < K; i++) dice.push({ p: pick(), o: (rnd() * 24) | 0 });
  for (let i = 0; i < K; i++) goals.push(pick());
  return { w: W, h: H, walls, player, dice, goals };
}
function explore(L) {
  const seen = new Set([encode(L.player, L.dice)]); let fr = [{ player: L.player, dice: L.dice }], depth = 0, any = -1; const best = new Map();
  while (fr.length && seen.size < 1.5e6) { const nx = [];
    for (const st of fr) { let ok = true; const tops = [];
      for (const g of L.goals) { const d = st.dice.find((q) => q.p === g); if (!d) { ok = false; break; } tops.push(ORIENTS[d.o][0]); }
      if (ok) { if (any < 0) any = depth; const k = tops.join(""); if (!best.has(k)) best.set(k, depth); }
      for (const d of "UDLR") { const r = step(L, st.player, st.dice, d); if (!r) continue; const k = encode(r.player, r.dice); if (seen.has(k)) continue; seen.add(k); nx.push(r); } }
    fr = nx; depth++; }
  return { best, any, capped: seen.size >= 1.5e6 };
}
function toLevel(L, tops) {
  const map = []; for (let y = 0; y < H; y++) { let r = ""; for (let x = 0; x < W; x++) { const p = y * W + x; r += L.walls.has(p) ? "#" : p === L.player ? "@" : "."; } map.push(r); }
  return { map, dice: L.dice.map((d) => [d.p % W, (d.p / W) | 0, ...ORIENTS[d.o]]), goals: L.goals.map((g, i) => [g % W, (g / W) | 0, +tops[i]]) };
}
function pushSeq(lv, path) { const L = parse(lv); let pl = L.player, dice = L.dice; const out = [];
  for (const d of path) { const r = step(L, pl, dice, d); if (r.push) { const di = dice.findIndex((q) => q.p === r.player); out.push(di + d); } pl = r.player; dice = r.dice; } return out; }
function loopy(seq) {
  for (let i = 0; i + 8 <= seq.length; i++) if (seq.slice(i, i + 4).join() === seq.slice(i + 4, i + 8).join()) return true;
  return false;
}
const res = [];
for (let t = 0; t < TRIES; t++) {
  const L = room(); if (!L) continue; const r = explore(L); if (r.capped || r.any < 0) continue;
  const cands = [...r.best].sort((a, b) => b[1] - a[1]).slice(0, 4);
  for (const [tops, depth] of cands) {
    const lv = toLevel(L, tops); const sol = solve(lv); if (!sol) continue;
    const seq = pushSeq(lv, sol); if (loopy(seq)) continue;
    const pushes = seq.length; if (Math.abs(pushes - TP) > 3) continue;
    const grams = new Set(); for (let i = 0; i + 3 <= seq.length; i++) grams.add(seq.slice(i, i + 3).join(""));
    const variety = grams.size / Math.max(1, seq.length - 2);
    res.push({ rank: variety * 10 + (depth - r.any) / 10 - Math.abs(pushes - TP), pushes, moves: sol.length, variety: +variety.toFixed(2), any: r.any, lv, seq: seq.join(" ") });
    break;
  }
}
res.sort((a, b) => b.rank - a.rank);
for (const o of res.slice(0, 4)) console.log(JSON.stringify(o));
