// BFS solver: node solve.mjs '<level json>' -> shortest move string (by steps) and push count.
import { ORIENTS, OIDX, encode, step } from "./core.mjs";
export function parse(lv) {
  const h = lv.map.length, w = lv.map[0].length, walls = new Set(); let player = -1;
  lv.map.forEach((row, y) => [...row].forEach((c, x) => { if (c === "#") walls.add(y * w + x); if (c === "@") player = y * w + x; }));
  const dice = lv.dice.map(([x, y, t, n, e]) => ({ p: y * w + x, o: OIDX.get([t, n, e].join()) }));
  const goals = lv.goals.map(([x, y, n]) => ({ p: y * w + x, n }));
  return { w, h, walls, player, dice, goals };
}
export function solve(lv, cap = 3e6) {
  const L = parse(lv);
  const won = (dice) => L.goals.every((g) => { const d = dice.find((q) => q.p === g.p); return d && ORIENTS[d.o][0] === g.n; });
  const k0 = encode(L.player, L.dice);
  const prev = new Map([[k0, null]]);
  let frontier = [{ player: L.player, dice: L.dice, k: k0 }];
  while (frontier.length && prev.size < cap) {
    const next = [];
    for (const st of frontier) {
      if (won(st.dice)) { let path = "", k = st.k; while (prev.get(k)) { const [pk, m] = prev.get(k); path = m + path; k = pk; } return path; }
      for (const d of "UDLR") { const r = step(L, st.player, st.dice, d); if (!r) continue; const k = encode(r.player, r.dice); if (prev.has(k)) continue; prev.set(k, [st.k, d]); next.push({ ...r, k }); }
    }
    frontier = next;
  }
  return null;
}
export function pushes(lv, path) {
  const L = parse(lv); let pl = L.player, dice = L.dice, n = 0;
  for (const d of path) { const r = step(L, pl, dice, d); if (r.push) n++; pl = r.player; dice = r.dice; }
  return n;
}
if (import.meta.url === `file://${process.argv[1]}` && process.argv[2]) { const lv = JSON.parse(process.argv[2]); const p = solve(lv); console.log(JSON.stringify({ sol: p, moves: p && p.length, pushes: p && pushes(lv, p) })); }
