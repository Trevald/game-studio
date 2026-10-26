// Night-3 level search with ICE: a die pushed onto ice keeps rolling until it leaves the ice or is blocked.
// Same push-level exploration as gen3.mjs, plus ice strips; keeps rooms whose minimum-push solution
// really uses the ice (several multi-square slides) and whose faces matter (min pushes well above "any number").
// Usage: node gen4.mjs <w> <h> <dice> <tries> <seed> <density> <targetPushes> <strips> <minSlides>
import { pushSolve } from "./push.mjs";
const [W, H, K, TRIES, SEED, DENS, TP, STRIPS = 2, MINSL = 2] = process.argv.slice(2).map(Number);
let s = SEED >>> 0 || 1;
const rnd = () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
const ROLL = ([t, n, e], d) => d === "R" ? [7 - e, n, t] : d === "L" ? [e, n, 7 - t] : d === "U" ? [7 - n, t, e] : [n, 7 - t, e];
const ORI = (() => { const m = new Map([["1,2,3", [1, 2, 3]]]), q = [[1, 2, 3]]; while (q.length) { const o = q.shift(); for (const d of "UDLR") { const r = ROLL(o, d); if (!m.has(r.join())) { m.set(r.join(), r); q.push(r); } } } return [...m.values()]; })();
const DV = { U: -W, D: W, L: -1, R: 1 };
function room() {
  const walls = new Set(), ice = new Set();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (!x || !y || x === W - 1 || y === H - 1 || rnd() < DENS) walls.add(y * W + x);
  for (let k = 0; k < STRIPS; k++) { // straight strips of ice, 2-4 long
    const horiz = rnd() < 0.5, len = 2 + ((rnd() * 3) | 0), x0 = 1 + ((rnd() * (W - 2)) | 0), y0 = 1 + ((rnd() * (H - 2)) | 0);
    for (let i = 0; i < len; i++) { const x = horiz ? x0 + i : x0, y = horiz ? y0 : y0 + i; if (x < W - 1 && y < H - 1 && !walls.has(y * W + x)) ice.add(y * W + x); }
  }
  if (ice.size < 2) return null;
  const free = [...Array(W * H).keys()].filter((i) => !walls.has(i));
  const seen = new Set([free[0]]), q = [free[0]];
  while (q.length) { const c = q.pop(); for (const d of [1, -1, W, -W]) { const n = c + d; if (!walls.has(n) && !seen.has(n)) { seen.add(n); q.push(n); } } }
  if (seen.size !== free.length || free.length < K * 2 + 6) return null;
  const pool = free.filter((p) => !ice.has(p)); // dice and goals start off the ice
  const pick = (noCorner, list) => { for (let t = 0; t < 50; t++) { const i = (rnd() * list.length) | 0, p = list[i];
    if (p == null) return null;
    if (noCorner && ((walls.has(p - 1) || walls.has(p + 1)) && (walls.has(p - W) || walls.has(p + W)))) continue; list.splice(i, 1); return p; } return null; };
  const player = pick(false, pool), dice = [], goals = [];
  for (let i = 0; i < K; i++) { const p = pick(true, pool); if (p == null) return null; dice.push({ p, o: ORI[(rnd() * 24) | 0] }); }
  for (let i = 0; i < K; i++) { const p = pick(false, pool); if (p == null) return null; goals.push(p); }
  return { w: W, h: H, walls, ice, player, dice, goals };
}
function slideTo(L, occ, p, d, o) { let tp = p + DV[d], o2 = ROLL(o, d); while (L.ice.has(tp) && !L.walls.has(tp + DV[d]) && !occ.has(tp + DV[d])) { tp += DV[d]; o2 = ROLL(o2, d); } return [tp, o2]; }
function explore(L, cap = 600000) {
  const N = W * H;
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
        const [tp, o2] = slideTo(L, occ, dd.p, d, dd.o);
        const dice = st.dice.slice(); dice[i] = { p: tp, o: o2 }; const ar = area(dd.p, dice), k = key(ar.min, dice);
        if (seen.has(k)) continue; seen.add(k); nx.push({ dice, ar }); } });
      if (seen.size > cap) return { capped: true };
    }
    fr = nx; depth++; }
  return { best, any };
}
function pushSeq(L, moves) { // die index + dir (+ slide length) for each push
  let pl = L.player; const ds = L.dice.map((d) => ({ ...d })), out = []; let slides = 0;
  for (const d of moves) { const n = pl + DV[d], i = ds.findIndex((q) => q.p === n);
    if (i >= 0) { const occ = new Set(ds.map((q) => q.p)); const [tp, o2] = slideTo(L, occ, n, d, ds[i].o); const len = Math.abs(tp - n) / Math.abs(DV[d]); if (len >= 2) slides++; ds[i] = { p: tp, o: o2 }; out.push(i + d + len); }
    pl = n; }
  return { seq: out, slides };
}
// night-3 review: also reject any 4-push direction pattern or exact 3-push run that appears twice (repeated circuits / swaps)
const repeats = (seq) => { const seen = new Set(), dirs = seq.map((x) => x.slice(0, 2)); for (let i = 0; i + 4 <= dirs.length; i++) { const k = dirs.slice(i, i + 4).join(" "); if (seen.has(k)) return true; seen.add(k); } seen.clear(); for (let i = 0; i + 3 <= seq.length; i++) { const k = seq.slice(i, i + 3).join(" "); if (seen.has(k)) return true; seen.add(k); } return false; };
const loopy = (seq) => { for (let i = 0; i + 8 <= seq.length; i++) if (seq.slice(i, i + 4).join() === seq.slice(i + 4, i + 8).join()) return true; return false; };
const res = []; const dbg = { room: 0, ex: 0, cand: 0 };
for (let t = 0; t < TRIES; t++) {
  const L = room(); if (!L) continue; dbg.room++; const r = explore(L); if (r.capped || r.any < 0) continue; dbg.ex++;
  const cands = [...r.best].filter(([, d]) => Math.abs(d - TP) <= 3 && d >= r.any + 2).sort((a, b) => b[1] - a[1]).slice(0, 3);
  dbg.cand += cands.length ? 1 : 0;
  for (const [tops, depth] of cands) {
    const goals = L.goals.map((p, i) => ({ p, n: +tops[i] }));
    const sol = pushSolve({ ...L, goals }); if (!sol || sol.capped) continue;
    const { seq, slides } = pushSeq(L, sol.moves); if (loopy(seq) || repeats(seq)) { dbg.loopy = (dbg.loopy||0)+1; continue; } if (slides < MINSL) { dbg.sl = (dbg.sl||0)+1; if (process.env.DBG2) console.error(seq.join(" "), [...L.ice]); continue; }
    if (new Set(seq.map((x) => x[0])).size !== K) continue;
    // ice must matter: the same room with the ice melted needs a different number of pushes (or can't be done)
    const melted = pushSolve({ ...L, ice: new Set(), goals }, 400000); const iceMatters = !melted || melted.capped || melted.pushes !== depth;
    if (!iceMatters) { dbg.melt = (dbg.melt||0)+1; continue; }
    const map = []; for (let y = 0; y < H; y++) { let row = ""; for (let x = 0; x < W; x++) { const p = y * W + x; row += L.walls.has(p) ? "#" : p === L.player ? (L.ice.has(p) ? "&" : "@") : L.ice.has(p) ? "~" : "."; } map.push(row); }
    const lv = { map, dice: L.dice.map((d) => [d.p % W, (d.p / W) | 0, ...d.o]), goals: goals.map((g) => [g.p % W, (g.p / W) | 0, g.n]) };
    res.push({ rank: slides * 1.5 + (depth - r.any) / 2 - Math.abs(depth - TP), pushes: depth, any: r.any, slides, melted: melted && !melted.capped ? melted.pushes : null, moves: sol.moves.length, lv, seq: seq.join(" ") });
    break;
  }
}
if (process.env.DBG) console.error(dbg);
res.sort((a, b) => b.rank - a.rank);
for (const o of res.slice(0, 4)) console.log(JSON.stringify(o));
