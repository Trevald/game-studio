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
  for (let tries = 0; tries < 4000; tries++) {
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
    const best = solveFrom(g, W, H, reg, size, k);
    if (!best || best.length !== k) { stat.par++; continue; }
    const c = countSolutions(g, W, H, reg, size, k);
    if (c.ends !== 1) { stat.ends++; continue; }
    if (opts.minBad && a.badRegions.size < opts.minBad) continue;
    return { w: W, h: H, regions: reg, sizes: size, goal: sol, start: g, solution: best, par: k, scramble: seq, seqs: c.seqs, badRegions: a.badRegions.size, clashes: a.clash.size };
  }
  console.error(JSON.stringify(stat));
  throw new Error("no level " + W + "x" + H + " k" + k);
}
const plan = [
  [4, 4, 1, { kind: "r" }], [4, 4, 1, { kind: "c" }], [4, 4, 2], [5, 5, 2], [5, 5, 2, { minBad: 3 }],
  [5, 5, 3], [5, 5, 3, { minBad: 4 }], [6, 6, 3], [6, 6, 4], [6, 6, 4, { minBad: 5 }], [6, 6, 5], [6, 6, 6],
];
const out = [];
for (const [W, H, k, o] of plan) {
  const t = Date.now();
  const lv = make(W, H, k, o);
  console.error(`${W}x${H} par ${k} seqs ${lv.seqs} bad ${lv.badRegions} clash ${lv.clashes} ${Date.now() - t}ms`);
  out.push(lv);
}
console.log(JSON.stringify(out));
