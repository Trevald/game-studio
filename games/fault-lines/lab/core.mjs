// Fault Lines — generator/solver core (node). Cells are i = y*W + x. Walls are "a-b" keys with a < b.
export const MAXN = 5;

export function rng(seed) { // mulberry32
  let a = seed >>> 0;
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
export const wkey = (a, b) => (a < b ? a + "-" + b : b + "-" + a);
export function nbrs(W, H, i) {
  const x = i % W, y = (i / W) | 0, out = [];
  if (y > 0) out.push(i - W); if (x < W - 1) out.push(i + 1); if (y < H - 1) out.push(i + W); if (x > 0) out.push(i - 1);
  return out;
}
function nbrs8(W, H, i) {
  const x = i % W, y = (i / W) | 0, out = [];
  for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
    if (!dx && !dy) continue; const nx = x + dx, ny = y + dy;
    if (nx >= 0 && ny >= 0 && nx < W && ny < H) out.push(ny * W + nx);
  }
  return out;
}
function shuffle(a, r) { for (let i = a.length - 1; i > 0; i--) { const j = (r() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; }

// A random Suguru solution: regions (sizes 1..5) + digits, equal digits never touch (8-neighbourhood).
export function randomSuguru(W, H, r, opt = {}) {
  const N = W * H, maxOnes = opt.maxOnes ?? Math.max(1, Math.round(N / 18));
  for (let tries = 0; tries < 2000; tries++) {
    const reg = new Array(N).fill(-1), regions = [];
    const order = shuffle([...Array(N).keys()], r);
    for (const s of order) {
      if (reg[s] >= 0) continue;
      const want = opt.sizes ? opt.sizes[(r() * opt.sizes.length) | 0] : [2, 3, 3, 4, 4, 4, 5, 5, 5, 5][(r() * 10) | 0];
      const cells = [s]; reg[s] = regions.length;
      while (cells.length < want) {
        const fr = [];
        for (const c of cells) for (const n of nbrs(W, H, c)) if (reg[n] < 0 && !fr.includes(n)) fr.push(n);
        if (!fr.length) break;
        const n = fr[(r() * fr.length) | 0]; reg[n] = regions.length; cells.push(n);
      }
      regions.push(cells);
    }
    // merge stray singles into a neighbour region with room, when possible
    let ones = regions.filter((c) => c.length === 1).length;
    if (ones > maxOnes) continue;
    const dig = new Array(N).fill(0), regOf = new Array(N);
    regions.forEach((c, k) => c.forEach((i) => (regOf[i] = k)));
    let steps = 0;
    const opts = (i) => { const cells = regions[regOf[i]], o = [];
      for (let d = 1; d <= cells.length; d++) if (!cells.some((q) => q !== i && dig[q] === d) && !nbrs8(W, H, i).some((n) => dig[n] === d)) o.push(d);
      return o; };
    const place = (left) => {
      if (++steps > 3000) return false;
      if (!left) return true;
      let best = -1, bo = null;
      for (let i = 0; i < N; i++) if (!dig[i]) { const o = opts(i); if (!bo || o.length < bo.length) { bo = o; best = i; if (o.length <= 1) break; } }
      if (!bo.length) return false;
      for (const d of shuffle(bo, r)) { dig[best] = d; if (place(left - 1)) return true; }
      dig[best] = 0;
      return false;
    };
    if (!place(N)) continue;
    return { W, H, dig, regions: regions.map((c) => c.slice().sort((a, b) => a - b)) };
  }
  return null;
}

// Every connected set of <= 5 cells whose digits are exactly 1..size and that no wall cuts through.
export function candidates(W, H, dig, walls) {
  const N = W * H, seen = new Set(), out = [];
  const ok2 = (a, b) => !walls.has(wkey(a, b));
  for (let s = 0; s < N; s++) {
    const stack = [[s]];
    while (stack.length) {
      const set = stack.pop();
      const key = set.slice().sort((a, b) => a - b).join(",");
      if (seen.has(key)) continue; seen.add(key);
      const ds = set.map((c) => dig[c]);
      if (Math.max(...ds) === set.length) out.push(key.split(",").map(Number));
      if (set.length === MAXN) continue;
      const have = new Set(ds);
      for (const c of set) for (const n of nbrs(W, H, c)) {
        if (n <= s || set.includes(n) || have.has(dig[n]) || dig[n] > MAXN) continue;
        if (set.some((q) => !ok2(q, n))) continue; // a wall between two cells of one region is impossible
        stack.push([...set, n]);
      }
    }
  }
  return out;
}

// Exact cover: up to `limit` solutions (arrays of candidate indices).
export function solveCover(N, cands, limit = 2) {
  const byCell = Array.from({ length: N }, () => []);
  cands.forEach((c, k) => c.forEach((i) => byCell[i].push(k)));
  const covered = new Uint8Array(N), dead = new Int32Array(cands.length), sols = [], cur = [];
  const rec = () => {
    if (sols.length >= limit) return;
    let best = -1, bestN = 1e9;
    for (let i = 0; i < N; i++) if (!covered[i]) {
      let n = 0; for (const k of byCell[i]) if (!dead[k]) n++;
      if (n < bestN) { bestN = n; best = i; if (n === 0) break; }
    }
    if (best < 0) { sols.push(cur.slice()); return; }
    if (bestN === 0) return;
    for (const k of byCell[best]) {
      if (dead[k]) continue;
      const killed = [];
      for (const i of cands[k]) { covered[i] = 1; for (const k2 of byCell[i]) { if (!dead[k2]) killed.push(k2); dead[k2]++; } }
      cur.push(k); rec(); cur.pop();
      for (const i of cands[k]) { covered[i] = 0; for (const k2 of byCell[i]) dead[k2]--; }
      if (sols.length >= limit) return;
    }
  };
  rec();
  return sols;
}

// "Human" solver: (A) a cell with only one shape left takes it; (B) a shape that would leave some other cell with no
// shape is crossed out. Returns {ok, order: [regions in the order found], singles, lookahead}.
export function humanSolve(N, cands) {
  let alive = cands.map((_, k) => k);
  const covered = new Uint8Array(N), order = [];
  let singles = 0, lookahead = 0, rounds = 0, firstSingle = false;
  const byCellAlive = () => { const m = Array.from({ length: N }, () => []); for (const k of alive) for (const i of cands[k]) m[i].push(k); return m; };
  const fix = (k) => { order.push(cands[k]); for (const i of cands[k]) covered[i] = 1; const s = new Set(cands[k]); alive = alive.filter((q) => !cands[q].some((i) => s.has(i))); };
  while (true) {
    if (covered.every((v) => v)) return { ok: true, order, singles, lookahead, rounds, firstSingle };
    rounds++;
    const m = byCellAlive();
    let did = false;
    for (let i = 0; i < N; i++) if (!covered[i]) {
      if (m[i].length === 0) return { ok: false, order, singles, lookahead, rounds, why: "dead cell" };
      if (m[i].length === 1) { if (rounds === 1) firstSingle = true; fix(m[i][0]); singles++; did = true; break; }
    }
    if (did) continue;
    // (B) one-step lookahead
    const kill = [];
    for (const k of alive) {
      const s = new Set(cands[k]);
      let bad = false;
      for (let i = 0; i < N && !bad; i++) {
        if (covered[i] || s.has(i)) continue;
        if (!m[i].some((q) => !cands[q].some((c) => s.has(c)))) bad = true;
      }
      if (bad) kill.push(k);
    }
    if (!kill.length) return { ok: false, order, singles, lookahead, rounds, why: "stuck" };
    lookahead += kill.length;
    const ks = new Set(kill); alive = alive.filter((k) => !ks.has(k));
  }
}

// Build a level: unique answer (adding fixed walls where needed, then dropping unneeded ones) + human-solvable.
export function makeLevel(W, H, r, opt = {}) {
  const sol = randomSuguru(W, H, r, opt);
  if (!sol) { (globalThis.WHY ||= {}).nosol = (WHY.nosol || 0) + 1; return null; }
  const N = W * H, regOf = new Array(N);
  sol.regions.forEach((c, k) => c.forEach((i) => (regOf[i] = k)));
  const walls = new Set();
  for (let guard = 0; guard < 40; guard++) {
    const cands = candidates(W, H, sol.dig, walls);
    const sols = solveCover(N, cands, opt.sample ?? 300);
    if (sols.length === 1) break;
    // cut the join (absent from the true answer) that the most other answers use
    const cnt = new Map();
    for (const s of sols) for (const k of s) { const c = cands[k]; for (const a of c) for (const b of c) if (a < b && nbrs(W, H, a).includes(b) && regOf[a] !== regOf[b]) { const w = wkey(a, b); cnt.set(w, (cnt.get(w) || 0) + 1 + r() * 0.5); } }
    const joins = [...cnt.entries()].sort((x, y) => y[1] - x[1]).map((e) => e[0]);
    if (!joins.length) return null;
    walls.add(joins[0]);
    if (walls.size > (opt.maxWalls ?? 6) * 2) { (globalThis.WHY ||= {}).manyA = (WHY.manyA || 0) + 1; return null; }
  }
  // drop every wall that isn't needed
  for (const w of shuffle([...walls], r)) {
    walls.delete(w);
    if (solveCover(N, candidates(W, H, sol.dig, walls), 2).length !== 1) walls.add(w);
  }
  if (walls.size > (opt.maxWalls ?? 6)) { (globalThis.WHY ||= {}).many = (WHY.many || 0) + 1; return null; }
  const cands = candidates(W, H, sol.dig, walls);
  if (solveCover(N, cands, 2).length !== 1) return null;
  const h = humanSolve(N, cands);
  if (!h.ok) { (globalThis.WHY ||= {})['h' + walls.size] = (WHY['h' + walls.size] || 0) + 1; return null; }
  return { W, H, dig: sol.dig, walls: [...walls].sort(), regions: h.order, singles: h.singles, lookahead: h.lookahead, rounds: h.rounds, firstSingle: h.firstSingle, cands: cands.length };
}
