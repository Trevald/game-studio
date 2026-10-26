// Shared Suguru Shift core (same logic is inlined in index.html).
export function moveList(W, H) {
  const m = [];
  for (let r = 0; r < H; r++) m.push("r" + r + "L", "r" + r + "R");
  for (let c = 0; c < W; c++) m.push("c" + c + "U", "c" + c + "D");
  return m;
}
export function parseMove(mv) {
  return { t: mv[0], i: +mv.slice(1, -1), d: mv[mv.length - 1] };
}
export function inverse(mv) {
  const { t, i, d } = parseMove(mv);
  return t + i + ({ L: "R", R: "L", U: "D", D: "U" })[d];
}
export function apply(g, W, H, mv) {
  const { t, i, d } = parseMove(mv), n = g.slice();
  if (t === "r") {
    for (let c = 0; c < W; c++) {
      const src = d === "R" ? (c - 1 + W) % W : (c + 1) % W;
      n[i * W + c] = g[i * W + src];
    }
  } else {
    for (let r = 0; r < H; r++) {
      const src = d === "D" ? (r - 1 + H) % H : (r + 1) % H;
      n[r * W + i] = g[src * W + i];
    }
  }
  return n;
}
export function analyse(g, W, H, reg, size) {
  // returns {valid, badRegions:Set, clashCells:Set}
  const R = size.length, seen = new Array(R).fill(0), bad = new Array(R).fill(false);
  for (let k = 0; k < g.length; k++) {
    const r = reg[k], v = g[k], b = 1 << v;
    if (v > size[r] || seen[r] & b) bad[r] = true;
    seen[r] |= b;
  }
  const clash = new Set();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const v = g[y * W + x];
    for (const [dx, dy] of [[1, 0], [0, 1], [1, 1], [-1, 1]]) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || nx >= W || ny >= H) continue;
      if (g[ny * W + nx] === v) { clash.add(y * W + x); clash.add(ny * W + nx); }
    }
  }
  const badRegions = new Set();
  bad.forEach((b, i) => b && badRegions.add(i));
  return { valid: badRegions.size === 0 && clash.size === 0, badRegions, clash };
}
export function isValid(g, W, H, reg, size) {
  const R = size.length, seen = new Int32Array(R);
  for (let k = 0; k < g.length; k++) {
    const r = reg[k], b = 1 << g[k];
    if (g[k] > size[r] || seen[r] & b) return false;
    seen[r] |= b;
  }
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const v = g[y * W + x];
    if (x + 1 < W && g[y * W + x + 1] === v) return false;
    if (y + 1 < H) {
      if (g[(y + 1) * W + x] === v) return false;
      if (x + 1 < W && g[(y + 1) * W + x + 1] === v) return false;
      if (x > 0 && g[(y + 1) * W + x - 1] === v) return false;
    }
  }
  return true;
}
// canonical-sequence pruning: no undoing the last move; consecutive moves of the same kind on
// different lines commute, so their line index must not decrease; at most floor(n/2) repeats of one move.
export function allowed(prev, mv, runLen, W, H) {
  if (!prev) return true;
  if (mv === inverse(prev)) return false;
  const a = parseMove(prev), b = parseMove(mv);
  if (a.t === b.t && b.i < a.i) return false;
  if (mv === prev) {
    const n = a.t === "r" ? W : H;
    if (runLen + 1 > Math.floor(n / 2)) return false;
    if (n % 2 === 0 && runLen + 1 === n / 2 && (b.d === "L" || b.d === "U")) return false;
  }
  return true;
}
// iterative deepening: shortest list of moves to any valid grid, or null within maxDepth / budget.
export function solveFrom(g, W, H, reg, size, maxDepth, budgetMs = Infinity) {
  if (isValid(g, W, H, reg, size)) return [];
  const moves = moveList(W, H), t0 = Date.now();
  let nodes = 0, out = null, timedOut = false;
  const path = [];
  function dfs(cur, depth, prev, run) {
    if (depth === 0) return isValid(cur, W, H, reg, size);
    if ((++nodes & 4095) === 0 && Date.now() - t0 > budgetMs) { timedOut = true; return false; }
    for (const mv of moves) {
      if (!allowed(prev, mv, run, W, H)) continue;
      path.push(mv);
      if (dfs(apply(cur, W, H, mv), depth - 1, mv, mv === prev ? run + 1 : 1)) return true;
      path.pop();
      if (timedOut) return false;
    }
    return false;
  }
  for (let d = 1; d <= maxDepth; d++) {
    if (dfs(g, d, null, 0)) { out = path.slice(); break; }
    if (timedOut) break;
  }
  return out;
}
// count distinct valid grids reachable in exactly `depth` canonical moves (and solutions)
export function countSolutions(g, W, H, reg, size, depth) {
  const moves = moveList(W, H), ends = new Set();
  let seqs = 0;
  function dfs(cur, d, prev, run) {
    if (d === 0) { if (isValid(cur, W, H, reg, size)) { seqs++; ends.add(cur.join("")); } return; }
    for (const mv of moves) {
      if (!allowed(prev, mv, run, W, H)) continue;
      dfs(apply(cur, W, H, mv), d - 1, mv, mv === prev ? run + 1 : 1);
    }
  }
  dfs(g, depth, null, 0);
  return { seqs, ends: ends.size };
}
