// Pip Push — push-level solver (night 2). The game embeds a copy of pushSolve(); keep them in sync.
// Searches by pushes, not steps: the player's position is collapsed to the area it can walk to, so a
// state is (dice, player area). BFS over pushes gives the fewest pushes; walks between pushes are shortest
// walks. Input: {w, h, walls:Set<idx>, goals:[{p, n}], player: idx, dice:[{p, o:[top,north,east]}]}.
// Returns {moves: "UDLR...", pushes, firstPush: {stand, d, die}} or null (no solution / cap hit -> {capped}).
export function pushSolve(S, cap = 400000) {
  const { w, h, walls, goals } = S, N = w * h;
  const DV = { U: -w, D: w, L: -1, R: 1 };
  const inb = (p, d) => !(d === "L" && p % w === 0) && !(d === "R" && p % w === w - 1) && p + DV[d] >= 0 && p + DV[d] < N;
  const roll = ([t, n, e], d) => d === "R" ? [7 - e, n, t] : d === "L" ? [e, n, 7 - t] : d === "U" ? [7 - n, t, e] : [n, 7 - t, e];
  const won = (dice) => goals.every((g) => dice.some((q) => q.p === g.p && q.o[0] === g.n));
  function area(player, dice) { // flood fill, returns {seen: Int32Array prev-dir map, min}
    const occ = new Set(dice.map((q) => q.p)), prev = new Int8Array(N).fill(-1), q = [player]; prev[player] = 4; let min = player;
    for (let i = 0; i < q.length; i++) { const c = q[i]; if (c < min) min = c;
      for (let k = 0; k < 4; k++) { const d = "UDLR"[k]; if (!inb(c, d)) continue; const n = c + DV[d];
        if (walls.has(n) || occ.has(n) || prev[n] >= 0) continue; prev[n] = k; q.push(n); } }
    return { prev, min };
  }
  function walk(prev, to) { let s = ""; let c = to; while (prev[c] !== 4) { const d = "UDLR"[prev[c]]; s = d + s; c -= DV[d]; } return s; }
  // numeric keys (much faster Map lookups); each die = pos*216 + orientation code < 2^14 on boards up to 75 cells
  const code = (q) => q.p * 216 + (q.o[0] - 1) * 36 + (q.o[1] - 1) * 6 + (q.o[2] - 1);
  const numeric = N <= 75 && S.dice.length <= 3;
  const key = (min, dice) => { const c = dice.map(code).sort((a, b) => a - b);
    if (!numeric) return min + "|" + c.join(","); let k = min; for (const v of c) k = k * 16384 + v; return k; };
  const start = { player: S.player, dice: S.dice.map((q) => ({ p: q.p, o: q.o.slice() })) };
  const a0 = area(start.player, start.dice);
  const seen = new Map([[key(a0.min, start.dice), null]]);
  let frontier = [{ ...start, k: key(a0.min, start.dice), ar: a0 }];
  if (won(start.dice)) return { moves: "", pushes: 0, firstPush: null };
  let depth = 0;
  while (frontier.length) {
    depth++; const next = [];
    for (const st of frontier) {
      const occ = new Set(st.dice.map((q) => q.p));
      for (let i = 0; i < st.dice.length; i++) {
        const b = st.dice[i].p;
        for (const d of "UDLR") {
          if (!inb(b, d)) continue; const to = b + DV[d];
          if (walls.has(to) || occ.has(to)) continue;
          const opp = { U: "D", D: "U", L: "R", R: "L" }[d]; if (!inb(b, opp)) continue;
          const stand = b - DV[d]; if (st.ar.prev[stand] < 0) continue;
          const dice = st.dice.slice(); dice[i] = { p: to, o: roll(st.dice[i].o, d) };
          const ar = area(b, dice), k = key(ar.min, dice);
          if (seen.has(k)) continue;
          seen.set(k, { pk: st.k, walk: walk(st.ar.prev, stand) + d, stand, d, die: i });
          if (won(dice)) {
            let moves = "", kk = k, first = null; while (seen.get(kk)) { const e = seen.get(kk); moves = e.walk + moves; first = e; kk = e.pk; }
            return { moves, pushes: depth, firstPush: { stand: first.stand, d: first.d, die: first.die } };
          }
          next.push({ player: b, dice, k, ar });
          if (seen.size > cap) return { capped: true };
        }
      }
    }
    frontier = next;
  }
  return null;
}
