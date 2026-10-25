// Snapshot of pure model from runtime at 5dcac8e; ONLY for baseline witness validation. Not the new implementation.
const LEVELS={match:require("../data/levels.json").levels};
function mulberry32(s) { // returns [value in [0,1), next state]
  s = (s + 0x6D2B79F5) | 0;
  let t = Math.imul(s ^ (s >>> 15), 1 | s);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return [((t ^ (t >>> 14)) >>> 0) / 4294967296, s];
}

// ---------- Match to Make Target — candy-v2 (H-001-v1: MC-002..MC-008) ----------
// Pure model. Every committed move returns a new state; the previous committed state is kept in g.hist
// (full snapshot: board, IDs, specials, RNG, counters, score) so Undo is exact.
const MATCH_VERSION = "candy-v2";
const M = {
  start(li, opts = {}) {
    const L = LEVELS.match[li];
    return { mode: "match", version: MATCH_VERSION, li, rows: L.rows, cols: L.cols, target: L.target, quota: L.quota, moves: L.moves,
      movesLeft: L.moves, made: 0, chainPts: 0, blastPts: 0, finish: 0, speedBonus: 0,
      cells: L.values.map((v, i) => ({ id: i, v, sp: null })), nextId: L.values.length, rng: L.seed, refills: 0,
      assisted: false, hints: 0, undos: 0, status: "playing", last: null, seq: 0,
      speed: !!opts.speed, timing: false, elapsed: 0, hist: [] };
  },
  adjacent(g, a, b) {
    const ra = Math.floor(a / g.cols), ca = a % g.cols, rb = Math.floor(b / g.cols), cb = b % g.cols;
    return Math.abs(ra - rb) + Math.abs(ca - cb) === 1;
  },
  neighbors(g, i) { // ascending index order => lexicographic DFS
    const r = Math.floor(i / g.cols), c = i % g.cols, out = [];
    if (r > 0) out.push(i - g.cols); if (c > 0) out.push(i - 1); if (c < g.cols - 1) out.push(i + 1); if (r < g.rows - 1) out.push(i + g.cols);
    return out;
  },
  // drag / tap rule: immediate-tail backtrack, ignore repeats, non-adjacent and a 9th tile
  extend(g, chain, i) {
    if (i < 0 || i >= g.cells.length) return chain;
    if (!chain.length) return [i];
    if (chain.length >= 2 && i === chain[chain.length - 2]) return chain.slice(0, -1);
    if (chain.includes(i) || chain.length >= 8 || !M.adjacent(g, chain[chain.length - 1], i)) return chain;
    return chain.concat([i]);
  },
  validChain(g, chain) {
    if (!Array.isArray(chain) || chain.length < 2 || chain.length > 8 || new Set(chain).size !== chain.length) return false;
    if (!chain.every((i) => Number.isInteger(i) && i >= 0 && i < g.cells.length)) return false;
    for (let k = 1; k < chain.length; k++) if (!M.adjacent(g, chain[k - 1], chain[k])) return false;
    return true;
  },
  sum(g, chain) { return chain.reduce((s, i) => s + g.cells[i].v, 0); },
  // MC-003
  mult(n) { return n <= 2 ? 1 : n === 3 ? 1.5 : n === 4 ? 2 : 3; },
  base(n) { return 100 + 25 * (n - 2); },
  chainPoints(n) { return Math.floor(M.base(n) * M.mult(n)); },
  // MC-004: level 1-3 none; 4-6 n>=4 stripe; 7-12 n==4 stripe, n>=5 wrapped
  rewardFor(li, n) {
    const lv = li + 1;
    if (lv <= 3 || n < 4) return null;
    if (lv <= 6) return "stripe";
    return n === 4 ? "stripe" : "wrapped";
  },
  // MC-005: blast area of one special on the pre-gravity board
  area(g, i, sp) {
    const r = Math.floor(i / g.cols), c = i % g.cols, out = [];
    if (sp === "stripe") { for (let cc = 0; cc < g.cols; cc++) out.push(r * g.cols + cc); }
    else if (sp === "wrapped") {
      for (let rr = r - 1; rr <= r + 1; rr++) for (let cc = c - 1; cc <= c + 1; cc++)
        if (rr >= 0 && rr < g.rows && cc >= 0 && cc < g.cols) out.push(rr * g.cols + cc);
    }
    return out;
  },
  // closure: activate specials in row-major order, each once, until nothing new is hit
  closure(g, chain) {
    const removal = new Set(chain), done = new Set();
    for (;;) {
      const pending = [...removal].filter((i) => g.cells[i].sp && !done.has(i)).sort((a, b) => a - b);
      if (!pending.length) break;
      const i = pending[0]; done.add(i);
      for (const j of M.area(g, i, g.cells[i].sp)) removal.add(j);
    }
    const all = [...removal].sort((a, b) => a - b);
    return { removal: all, activated: [...done].sort((a, b) => a - b), blastOnly: all.filter((i) => !chain.includes(i)) };
  },
  // what an exact chain would do (used for the live preview and by release)
  resolve(g, chain) {
    const n = chain.length, cl = M.closure(g, chain), type = M.rewardFor(g.li, n);
    return { n, base: M.base(n), mult: M.mult(n), chainPts: M.chainPoints(n), blastPts: 25 * cl.blastOnly.length,
      removal: cl.removal, blastOnly: cl.blastOnly, activated: cl.activated,
      reward: type ? { cell: chain[n - 1], value: g.cells[chain[n - 1]].v, type } : null };
  },
  shortest(g) { // shortest legal chain, row-major lexicographic tie-break
    const n = g.cells.length;
    for (let L = 2; L <= 8; L++) {
      for (let s = 0; s < n; s++) {
        const path = [s], used = new Set([s]);
        const dfs = (sum) => {
          if (path.length === L) return sum === g.target;
          for (const nb of M.neighbors(g, path[path.length - 1])) {
            if (used.has(nb)) continue;
            const ns = sum + g.cells[nb].v;
            if (ns > g.target) continue;
            path.push(nb); used.add(nb);
            if (dfs(ns)) return true;
            path.pop(); used.delete(nb);
          }
          return false;
        };
        if (g.cells[s].v <= g.target && dfs(g.cells[s].v)) return path.slice();
      }
    }
    return null;
  },
  allChains(g, cap = 30) {
    const out = [], n = g.cells.length;
    for (let s = 0; s < n && out.length < cap; s++) {
      const path = [s], used = new Set([s]);
      const dfs = (sum) => {
        if (out.length >= cap) return;
        if (path.length >= 2 && sum === g.target) out.push(path.slice());
        if (path.length >= 8) return;
        for (const nb of M.neighbors(g, path[path.length - 1])) {
          if (used.has(nb)) continue;
          const ns = sum + g.cells[nb].v; if (ns > g.target) continue;
          path.push(nb); used.add(nb); dfs(ns); path.pop(); used.delete(nb);
        }
      };
      dfs(g.cells[s].v);
    }
    return out;
  },
  draw(g) { const [r, s] = mulberry32(g.rng); g.rng = s; return 1 + Math.floor(r * 9); },
  snap(g) { const { hist, ...rest } = g; return JSON.parse(JSON.stringify(rest)); },
  core(g) { return g.chainPts + g.blastPts + g.finish; },
  score(g) { return g.chainPts + g.blastPts + g.finish; },
  thresholds(quota) { return [200 * quota, 300 * quota]; },
  // Release a chain. Returns {g, ev}. Atomic: g is the next stable committed state.
  release(g0, chain) {
    if (g0.status !== "playing") return { g: g0, ev: null };
    if (!Array.isArray(chain) || chain.length < 2) return { g: g0, ev: { type: "cancel" } }; // single tile: free
    if (!M.validChain(g0, chain)) return { g: g0, ev: { type: "cancel" } };
    const g = M.snap(g0);
    g.hist = g0.hist.concat([M.snap(g0)]);
    g.seq++;
    if (g.speed) g.timing = true;
    const sum = M.sum(g, chain);
    if (sum !== g.target) { // wrong sum: one move, nothing activates
      g.movesLeft--; g.last = { type: "wrong", sum, chain: chain.slice() };
      if (g.movesLeft <= 0) { g.status = "lost"; g.timing = false; }
      return { g, ev: { type: "wrong", sum, chain } };
    }
    const R = M.resolve(g, chain);
    const removed = R.removal.map((i) => ({ i, v: g.cells[i].v, sp: g.cells[i].sp, chain: chain.includes(i) }));
    // points before quota, quota before zero-moves failure
    g.chainPts += R.chainPts; g.blastPts += R.blastPts; g.movesLeft--; g.made++;
    g.last = { type: "clear", chain: chain.slice(), chainPts: R.chainPts, blastPts: R.blastPts, mult: R.mult, reward: R.reward ? R.reward.type : null };
    const ev = { type: "clear", chain: chain.slice(), removed, blastOnly: R.blastOnly, chainPts: R.chainPts, blastPts: R.blastPts, mult: R.mult, base: R.base, reward: R.reward };
    if (g.made >= g.quota) {
      g.status = "won"; g.timing = false; g.finish = 50 * g.movesLeft;
      if (g.speed) g.speedBonus = M.speedBonus(g.elapsed, g.quota);
      ev.won = true; return { g, ev };
    }
    if (g.movesLeft <= 0) { g.status = "lost"; g.timing = false; return { g, ev }; }
    // remove union, place reward on the last selected cell, collapse, refill
    const cur = g.cells.slice();
    for (const i of R.removal) cur[i] = null;
    if (R.reward) cur[R.reward.cell] = { id: g.nextId++, v: R.reward.value, sp: R.reward.type, fresh: true };
    const next = new Array(cur.length);
    for (let c = 0; c < g.cols; c++) {
      const col = [];
      for (let r = 0; r < g.rows; r++) { const t = cur[r * g.cols + c]; if (t) col.push(t); }
      const fresh = [];
      for (let k = col.length; k < g.rows; k++) fresh.push({ id: g.nextId++, v: M.draw(g), sp: null });
      const full = fresh.concat(col);
      for (let r = 0; r < g.rows; r++) next[r * g.cols + c] = full[r];
    }
    g.cells = next.map((t) => ({ id: t.id, v: t.v, sp: t.sp || null }));
    g.refills++;
    if (!M.shortest(g)) { // replacement board (specials are lost), guaranteed pair in row 1
      ev.refreshed = true;
      g.cells = g.cells.map(() => ({ id: g.nextId++, v: M.draw(g), sp: null }));
      const a = Math.max(1, g.target - 9), b = g.target - a;
      g.cells[0].v = a; g.cells[1].v = b;
    }
    return { g, ev };
  },
  undo(g0) {
    if (!g0.hist.length || g0.status === "won") return { g: g0, ev: null };
    const prev = g0.hist[g0.hist.length - 1];
    const g = JSON.parse(JSON.stringify(prev));
    g.hist = g0.hist.slice(0, -1);
    g.assisted = true; g.undos = g0.undos + 1; g.hints = g0.hints;
    g.elapsed = g0.elapsed; g.timing = !!g.speed; // a move was committed: clock keeps running, never rewinds
    g.seq = g0.seq + 1; g.status = "playing"; g.last = { type: "undo" };
    return { g, ev: { type: "undo" } };
  },
  hint(g0) {
    if (g0.status !== "playing") return { g: g0, chain: null };
    const g = { ...g0, assisted: true, hints: g0.hints + 1 };
    return { g, chain: M.shortest(g) };
  },
  speedBonus(ms, quota) { return Math.floor(100 * Math.max(0, 1 - ms / 1000 / (30 * quota))); },
  // MC-006: completion 1, core >= 200*quota 2, >= 300*quota 3
  stars(g) { if (g.status !== "won") return 0; const [t2, t3] = M.thresholds(g.quota), c = M.core(g); return c >= t3 ? 3 : c >= t2 ? 2 : 1; },
  hasProgress(g) { return g.hist.length > 0 || g.hints > 0; },
  // structural check for a restored save
  validSave(g) {
    try {
      if (!g || g.mode !== "match" || g.version !== MATCH_VERSION) return false;
      const L = LEVELS.match[g.li]; if (!L) return false;
      if (!Array.isArray(g.cells) || g.cells.length !== L.rows * L.cols) return false;
      if (!g.cells.every((c) => c && Number.isInteger(c.v) && c.v >= 1 && c.v <= 9 && Number.isInteger(c.id) && (c.sp === null || c.sp === "stripe" || c.sp === "wrapped"))) return false;
      for (const k of ["movesLeft", "made", "chainPts", "blastPts", "rng", "nextId", "seq", "elapsed"]) if (!Number.isFinite(g[k])) return false;
      if (!["playing", "lost"].includes(g.status) || !Array.isArray(g.hist)) return false;
      return g.movesLeft >= 0 && g.movesLeft <= L.moves && g.made < L.quota;
    } catch (e) { return false; }
  },
};



module.exports={M};
