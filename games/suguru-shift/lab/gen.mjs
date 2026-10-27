// Level generator: random Suguru → random scramble → verify par (min slides) equals scramble length
// and that only one valid grid is reachable at par. Usage: node gen.mjs > levels.json
import { apply, isValid, solveFrom, countSolutions, moveList, analyse, inverse } from "./core.mjs";

let seed = +(process.argv[2] || 2026);
const rnd = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const pick = (a) => a[Math.floor(rnd() * a.length)];
const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

function partition(W, H) {
  const reg = new Array(W * H).fill(-1), size = [];
  const nb = (k) => { const x = k % W, y = (k / W) | 0, o = []; if (x > 0) o.push(k - 1); if (x < W - 1) o.push(k + 1); if (y > 0) o.push(k - W); if (y < H - 1) o.push(k + W); return o; };
  for (;;) {
    const free = reg.map((r, k) => (r < 0 ? k : -1)).filter((k) => k >= 0);
    if (!free.length) break;
    const start = pick(free), want = pick([2, 3, 3, 4, 4, 4, 5, 5, 5, 5]), id = size.length, cells = [start];
    reg[start] = id;
    while (cells.length < want) {
      const fr = [...new Set(cells.flatMap(nb))].filter((k) => reg[k] < 0);
      if (!fr.length) break;
      const k = pick(fr); reg[k] = id; cells.push(k);
    }
    size.push(cells.length);
  }
  return { reg, size };
}
function fill(W, H, reg, size) {
  const N = W * H, g = new Array(N).fill(0);
  const near = [...Array(N).keys()].map((k) => {
    const x = k % W, y = (k / W) | 0, o = [];
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue; const nx = x + dx, ny = y + dy;
      if (nx >= 0 && nx < W && ny >= 0 && ny < H) o.push(ny * W + nx);
    }
    for (let j = 0; j < N; j++) if (j !== k && reg[j] === reg[k] && !o.includes(j)) o.push(j);
    return o;
  });
  let steps = 0;
  const cands = (k) => { let m = 0; for (const j of near[k]) if (g[j]) m |= 1 << g[j]; const o = []; for (let v = 1; v <= size[reg[k]]; v++) if (!(m & (1 << v))) o.push(v); return o; };
  function bt() {
    if (++steps > 50000) return false;
    let best = -1, bc = null;
    for (let k = 0; k < N; k++) if (!g[k]) { const c = cands(k); if (!bc || c.length < bc.length) { best = k; bc = c; if (c.length <= 1) break; } }
    if (best < 0) return true;
    for (const v of shuffle(bc)) { g[best] = v; if (bt()) return true; }
    g[best] = 0; return false;
  }
  return bt() ? g : null;
}
function make(W, H, k, opts = {}) {
  const stat={part1:0,fill:0,valid:0,par:0,ends:0,bad:0};
  for (let tries = 0; tries < 40000; tries++) {
    const { reg, size } = partition(W, H);
    if (size.filter((s) => s === 1).length > 1) { stat.part1++; continue; }
    const sol = fill(W, H, reg, size);
    if (!sol) { stat.fill++; continue; }
    // scramble: k random moves on distinct lines (or a forced kind for tutorials)
    const moves = moveList(W, H).filter((m) => !opts.kind || m[0] === opts.kind);
    let g = sol, seq = [], used = new Set();
    while (seq.length < k) {
      const m = pick(moves), line = m.slice(0, -1);
      if (used.has(line) && !opts.repeat) continue;
      used.add(line); seq.push(m); g = apply(g, W, H, m);
    }
    if (isValid(g, W, H, reg, size)) { stat.valid++; continue; }
    const a = analyse(g, W, H, reg, size);
    { const ok0 = size.length - a.badRegions.size;
      if (opts.minOk && ok0 < opts.minOk) continue;
      if (opts.maxClash && a.clash.size > opts.maxClash) continue;
      if (opts.greedyTop) {
        const score = (gg) => { const b = analyse(gg, W, H, reg, size); return (size.length - b.badRegions.size) * 10 - b.clash.size; };
        const inv = new Set(seq.map(inverse));
        const top = moveList(W, H).map((m) => [m, score(apply(g, W, H, m))]).sort((x, y) => y[1] - x[1]).slice(0, opts.greedyTop);
        if (!top.some(([m]) => inv.has(m))) continue;
      } }
    const best = solveFrom(g, W, H, reg, size, k);
    if (!best || best.length !== k) { stat.par++; continue; }
    const c = countSolutions(g, W, H, reg, size, k);
    if (c.ends !== 1) { stat.ends++; continue; }
    if (opts.minBad && a.badRegions.size < opts.minBad) continue;
    const okCount = size.length - a.badRegions.size;
    if (opts.minOk && okCount < opts.minOk) continue;
    if (opts.maxClash && a.clash.size > opts.maxClash) continue;
    let rank = 0;
    if (opts.greedyTop) {
      // a player who picks the slide that improves the board most should find a right first slide in the top N
      // (commuting moves mean any line of the solution can come first)
      const score = (gg) => { const b = analyse(gg, W, H, reg, size); return (size.length - b.badRegions.size) * 10 - b.clash.size; };
      const good = new Set(best);
      const ranked = moveList(W, H).map((m) => [m, score(apply(g, W, H, m))]).sort((x, y) => y[1] - x[1]);
      rank = ranked.findIndex(([m]) => c.firsts.has(m) || good.has(m) && c.firsts.size === 0) + 1;
      if (rank < 1 || rank > opts.greedyTop) continue;
    }
    return { w: W, h: H, regions: reg, sizes: size, goal: sol, start: g, solution: best, par: k, scramble: seq, seqs: c.seqs, rank, okRegions: size.length - a.badRegions.size, badRegions: a.badRegions.size, clashes: a.clash.size };
  }
  console.error(JSON.stringify(stat));
  throw new Error("no level " + W + "x" + H + " k" + k);
}
const LATE = { minOk: 3, maxClash: 12, greedyTop: 3 };
const plan = [
  [4, 4, 1, { kind: "r" }], [4, 4, 1, { kind: "c" }], [4, 4, 2], [5, 5, 2], [5, 5, 2, { minBad: 3 }],
  [5, 5, 3], [5, 5, 3, { minBad: 4 }], [6, 6, 3, LATE], [6, 6, 4, LATE], [6, 6, 4, LATE], [6, 6, 5, LATE], [6, 6, 6, LATE],
];
// Night 2: pinned levels. A pin fixes its number's row and column. Keep only boards where the pins matter:
// without them the board has more than one valid grid at par, or a shorter solution.
function makePinned(W, H, k, np, opts = {}) {
  const stat = { matter: 0, par: 0, ends: 0, q: 0 };
  for (let tries = 0; tries < 400000; tries++) {
    const { reg, size } = partition(W, H);
    if (size.filter((s) => s === 1).length > 1) continue;
    const sol = fill(W, H, reg, size);
    if (!sol) continue;
    const pins = [];
    while (pins.length < np) {
      const c = Math.floor(rnd() * W * H);
      if (pins.some((p) => p % W === c % W || ((p / W) | 0) === ((c / W) | 0))) continue;
      pins.push(c);
    }
    const moves = moveList(W, H, pins);
    let g = sol, seq = [], used = new Set();
    while (seq.length < k) {
      const m = pick(moves), line = m.slice(0, -1);
      if (used.has(line)) continue;
      used.add(line); seq.push(m); g = apply(g, W, H, m);
    }
    if (isValid(g, W, H, reg, size)) continue;
    const a = analyse(g, W, H, reg, size);
    if (opts.minOk && size.length - a.badRegions.size < opts.minOk) { stat.q++; continue; }
    if (opts.maxClash && a.clash.size > opts.maxClash) { stat.q++; continue; }
    if (opts.minBad && a.badRegions.size < opts.minBad) { stat.q++; continue; }
    const score = (gg) => { const b = analyse(gg, W, H, reg, size); return (size.length - b.badRegions.size) * 10 - b.clash.size; };
    if (opts.greedyTop) {
      const inv = new Set(seq.map(inverse));
      const top = moves.map((m) => [m, score(apply(g, W, H, m))]).sort((x, y) => y[1] - x[1]).slice(0, opts.greedyTop);
      if (!top.some(([m]) => inv.has(m))) { stat.q++; continue; }
    }
    const best = solveFrom(g, W, H, reg, size, k, Infinity, pins);
    if (!best || best.length !== k) { stat.par++; continue; }
    const c = countSolutions(g, W, H, reg, size, k, pins);
    if (c.ends !== 1) { stat.ends++; continue; }
    // do the pins matter?
    const free = solveFrom(g, W, H, reg, size, k);
    const freeEnds = free && free.length === k ? countSolutions(g, W, H, reg, size, k).ends : 0;
    if (!(free.length < k || freeEnds > 1)) { stat.matter++; continue; }
    return { w: W, h: H, regions: reg, sizes: size, goal: sol, start: g, pins, solution: best, par: k, scramble: seq, seqs: c.seqs,
      freePar: free.length, freeEnds, okRegions: size.length - a.badRegions.size, badRegions: a.badRegions.size, clashes: a.clash.size };
  }
  console.error(JSON.stringify(stat));
  throw new Error("no pinned level " + W + "x" + H + " k" + k);
}
const PL = { minOk: 3, maxClash: 14, greedyTop: 4 };
const plan2 = [[5, 5, 2, 1, { minBad: 2 }], [5, 5, 3, 1, { minBad: 3 }], [5, 5, 3, 2, {}], [6, 6, 3, 2, PL], [6, 6, 4, 2, PL], [6, 6, 5, 1, { minOk: 3, maxClash: 16, greedyTop: 6 }]];
const out = [];
if (process.argv[3] === "pins") {
  for (const [W, H, k, np, o] of plan2) {
    const t = Date.now();
    let lv; try { lv = makePinned(W, H, k, np, o); } catch (e) { console.error(e.message); continue; }
    console.error(`pinned ${W}x${H} par ${k} pins ${np}: free par ${lv.freePar} free ends ${lv.freeEnds} ok ${lv.okRegions}/${lv.sizes.length} clash ${lv.clashes} ${Date.now() - t}ms`);
    out.push(lv);
  }
  console.log(JSON.stringify(out)); process.exit(0);
}
for (const [W, H, k, o] of plan) {
  const t = Date.now();
  const lv = make(W, H, k, o);
  console.error(`${W}x${H} par ${k} rank ${lv.rank} ok ${lv.okRegions}/${lv.sizes.length} seqs ${lv.seqs} bad ${lv.badRegions} clash ${lv.clashes} ${Date.now() - t}ms`);
  out.push(lv);
}
console.log(JSON.stringify(out));
