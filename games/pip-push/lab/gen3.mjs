// Night-2 level search (handles 3 dice): push-level exploration instead of step BFS.
// For each random room it explores every reachable (dice, player area) state, records the fewest pushes
// for each combination of top numbers on the goals, picks combinations whose minimum is near TARGET and
// clearly above the "any numbers" minimum, then rejects solutions with repeated push loops.
// Usage: node gen3.mjs <w> <h> <dice> <tries> <seed> <density> <targetPushes>
import { pushSolve } from "./push.mjs";
const [W, H, K, TRIES, SEED, DENS, TP] = process.argv.slice(2).map(Number);
let s = SEED >>> 0 || 1;
const rnd = () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
const ROLL = ([t, n, e], d) => d === "R" ? [7 - e, n, t] : d === "L" ? [e, n, 7 - t] : d === "U" ? [7 - n, t, e] : [n, 7 - t, e];
const ORI = (() => { const m = new Map([["1,2,3", [1, 2, 3]]]), q = [[1, 2, 3]]; while (q.length) { const o = q.shift(); for (const d of "UDLR") { const r = ROLL(o, d); if (!m.has(r.join())) { m.set(r.join(), r); q.push(r); } } } return [...m.values()]; })();
function room() {
  const walls = new Set();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (!x || !y || x === W - 1 || y === H - 1 || rnd() < DENS) walls.add(y * W + x);
  const free = [...Array(W * H).keys()].filter((i) => !walls.has(i));
  const seen = new Set([free[0]]), q = [free[0]];
  while (q.length) { const c = q.pop(); for (const d of [1, -1, W, -W]) { const n = c + d; if (!walls.has(n) && !seen.has(n)) { seen.add(n); q.push(n); } } }
  if (seen.size !== free.length || free.length < K * 2 + 6) return null;
  // dice never start in a corner (a cornered die can't move)
  const pick = (noCorner) => { for (let t = 0; t < 50; t++) { const i = (rnd() * free.length) | 0, p = free[i];
    if (noCorner && ((walls.has(p - 1) || walls.has(p + 1)) && (walls.has(p - W) || walls.has(p + W)))) continue; free.splice(i, 1); return p; } return null; };
  const player = pick(false), dice = [], goals = [];
  for (let i = 0; i < K; i++) { const p = pick(true); if (p == null) return null; dice.push({ p, o: ORI[(rnd() * 24) | 0] }); }
  for (let i = 0; i < K; i++) { const p = pick(false); if (p == null) return null; goals.push(p); }
  return { w: W, h: H, walls, player, dice, goals };
}
function explore(L, cap = 600000) {
  const N = W * H, DV = { U: -W, D: W, L: -1, R: 1 };
  const area = (pl, dice) => { const occ = new Set(dice.map((q) => q.p)), seen = new Uint8Array(N), q = [pl]; seen[pl] = 1; let min = pl;
    for (let i = 0; i < q.length; i++) { const c = q[i]; if (c < min) min = c; for (const d of "UDLR") { const n = c + DV[d]; if (L.walls.has(n) || occ.has(n) || seen[n]) continue; seen[n] = 1; q.push(n); } } return { seen, min }; };
  const key = (min, dice) => min + "|" + dice.map((q) => q.p * 1000 + q.o[0] * 100 + q.o[1] * 10 + q.o[2]).sort((a, b) => a - b).join(",");
  const a0 = area(L.player, L.dice), seen = new Set([key(a0.min, L.dice)]); const best = new Map(); let any = -1, depth = 0;
  let fr = [{ dice: L.dice, ar: a0 }];
  while (fr.length) { const nx = [];
    for (const st of fr) {
      const tops = []; for (const g of L.goals) { const d = st.dice.find((q) => q.p === g); if (!d) { tops.length = 0; break; } tops.push(d.o[0]); }
      if (tops.length === L.goals.length) { if (any < 0) any = depth; const k = tops.join(""); if (!best.has(k)) best.set(k, depth); }
      const occ = new Set(st.dice.map((q) => q.p));
      st.dice.forEach((dd, i) => { for (const d of "UDLR") { const to = dd.p + DV[d], stand = dd.p - DV[d];
        if (L.walls.has(to) || occ.has(to) || L.walls.has(stand) || !st.ar.seen[stand]) continue;
        const dice = st.dice.slice(); dice[i] = { p: to, o: ROLL(dd.o, d) }; const ar = area(dd.p, dice), k = key(ar.min, dice);
        if (seen.has(k)) continue; seen.add(k); nx.push({ dice, ar }); } });
      if (seen.size > cap) return { capped: true };
    }
    fr = nx; depth++; }
  return { best, any };
}
function pushSeq(L, moves) { // die index + dir for each push
  const DV = { U: -W, D: W, L: -1, R: 1 }; let pl = L.player; const pos = L.dice.map((d) => d.p), out = [];
  for (const d of moves) { const n = pl + DV[d], i = pos.indexOf(n); if (i >= 0) { pos[i] += DV[d]; out.push(i + d); } pl = n; } return out;
}
const loopy = (seq) => { for (let i = 0; i + 8 <= seq.length; i++) if (seq.slice(i, i + 4).join() === seq.slice(i + 4, i + 8).join()) return true; return false; };
const res = [];
for (let t = 0; t < TRIES; t++) {
  const L = room(); if (!L) continue; const r = explore(L); if (r.capped || r.any < 0) continue;
  const cands = [...r.best].filter(([, d]) => Math.abs(d - TP) <= 3 && d >= r.any + 3).sort((a, b) => b[1] - a[1]).slice(0, 3);
  for (const [tops, depth] of cands) {
    const goals = L.goals.map((p, i) => ({ p, n: +tops[i] }));
    const sol = pushSolve({ ...L, goals }); if (!sol || sol.capped) continue;
    const seq = pushSeq(L, sol.moves); if (loopy(seq)) continue;
    const usesAll = new Set(seq.map((x) => x[0])).size === K; if (!usesAll) continue;
    const grams = new Set(); for (let i = 0; i + 3 <= seq.length; i++) grams.add(seq.slice(i, i + 3).join(""));
    const variety = grams.size / Math.max(1, seq.length - 2);
    const map = []; for (let y = 0; y < H; y++) { let row = ""; for (let x = 0; x < W; x++) { const p = y * W + x; row += L.walls.has(p) ? "#" : p === L.player ? "@" : "."; } map.push(row); }
    const lv = { map, dice: L.dice.map((d) => [d.p % W, (d.p / W) | 0, ...d.o]), goals: goals.map((g) => [g.p % W, (g.p / W) | 0, g.n]) };
    res.push({ rank: variety * 10 + (depth - r.any) / 2 - Math.abs(depth - TP), pushes: depth, any: r.any, moves: sol.moves.length, variety: +variety.toFixed(2), lv, seq: seq.join(" ") });
    break;
  }
}
res.sort((a, b) => b.rank - a.rank);
for (const o of res.slice(0, 4)) console.log(JSON.stringify(o));
