// Pip Push — shared rules for the level generator (the game embeds the same logic).
// Orientation = [top, north, east]; opposite faces sum to 7.
export const DIRS = { U: [0, -1], D: [0, 1], L: [-1, 0], R: [1, 0] };
export function roll([t, n, e], d) {
  if (d === "R") return [7 - e, n, t];
  if (d === "L") return [e, n, 7 - t];
  if (d === "U") return [7 - n, t, e];
  return [n, 7 - t, e]; // D
}
// all 24 orientations reachable from [1,2,3]
export const ORIENTS = (() => {
  const seen = new Map([["1,2,3", [1, 2, 3]]]), q = [[1, 2, 3]];
  while (q.length) { const o = q.shift(); for (const d of "UDLR") { const r = roll(o, d), k = r.join(); if (!seen.has(k)) { seen.set(k, r); q.push(r); } } }
  return [...seen.values()];
})();
export const OIDX = new Map(ORIENTS.map((o, i) => [o.join(), i]));

// level: {w,h,walls:Set(idx), player:idx, dice:[{p,o}], goals:[{p,n}]}
export function encode(player, dice) {
  // dice sorted by position; key = player + each (pos*24+orient)
  const ds = dice.map((d) => d.p * 24 + d.o).sort((a, b) => a - b);
  let k = player;
  for (const v of ds) k = k * 2048 + v; // pos<85 -> pos*24+o < 2048
  return k;
}
export function step(L, player, dice, d) {
  const [dx, dy] = DIRS[d];
  const x = player % L.w, y = (player / L.w) | 0, nx = x + dx, ny = y + dy;
  if (nx < 0 || ny < 0 || nx >= L.w || ny >= L.h) return null;
  const np = ny * L.w + nx;
  if (L.walls.has(np)) return null;
  const di = dice.findIndex((q) => q.p === np);
  if (di < 0) return { player: np, dice, push: false };
  const bx = nx + dx, by = ny + dy;
  if (bx < 0 || by < 0 || bx >= L.w || by >= L.h) return null;
  const bp = by * L.w + bx;
  if (L.walls.has(bp) || dice.some((q) => q.p === bp)) return null;
  const nd = dice.slice();
  nd[di] = { p: bp, o: OIDX.get(roll(ORIENTS[dice[di].o], d).join()) };
  return { player: np, dice: nd, push: true };
}
