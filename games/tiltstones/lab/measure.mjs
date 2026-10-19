// Headless metrics for Ricochet levels, using the engine code from index.html (constants → solver).
// usage: node games/tiltstones/lab/measure.mjs [id ...]   (default: all lab levels; "all" includes World 1)
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const here = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(here, "..", "index.html"), "utf8");
const code = html.slice(html.indexOf("// ======================= constants"), html.indexOf("// ======================= storage"));
const E = new Function(code + "\nreturn { LEVELS, newGame, step, applyAction, solveFrom, counts, ratio, cloneGame, DT, STEPS_PER_ACTION, LIVES, get W() { return W; }, get H() { return H; } };")();

const PRODUCTIVE = new Set(["break", "grey", "diamond", "key", "unlock", "paint"]);
export function measureRun(level, actions) {
  const g = E.newGame(level);
  let lastHit = 0, gaps = [], contacts = 0, hits = 0, travel = 0, maxTravel = 0, lastY = g.ball.y, lastVy = g.ball.vy, lastVx = g.ball.vx;
  const hitTimes = [];
  for (const a of actions) {
    for (let i = 0; i < E.STEPS_PER_ACTION && g.screen === "playing"; i++) {
      E.step(g, a === "left" ? -1 : a === "right" ? 1 : 0);
      const t = g.steps * E.DT;
      let contact = Math.sign(g.ball.vy) !== Math.sign(lastVy) || (lastVx !== 0 && g.ball.vx === 0 && g.ev.length);
      for (const e of g.ev) {
        if (e.t !== "win") contact = true;
        if (PRODUCTIVE.has(e.t)) { hits++; gaps.push(t - lastHit); lastHit = t; hitTimes.push(t); }
      }
      g.ev.length = 0;
      travel += Math.abs(g.ball.y - lastY);
      if (contact) { contacts++; maxTravel = Math.max(maxTravel, travel); travel = 0; }
      lastY = g.ball.y; lastVy = g.ball.vy; lastVx = g.ball.vx;
    }
  }
  const time = g.steps * E.DT;
  const cut = hitTimes[Math.floor(hitTimes.length * 0.8)] || 0;
  let lastDead = 0, prev = 0; for (const h of hitTimes) { if (h > cut) lastDead += Math.max(0, h - prev - 1); prev = h; }
  const dead = gaps.reduce((s, x) => s + Math.max(0, x - 1), 0);
  return { won: g.screen === "won", time, deaths: E.LIVES - g.lives + (g.screen === "lost" ? 0 : 0), lostAll: g.screen === "lost",
    hits, contacts, maxGap: Math.max(0, ...gaps), dead, deadPct: time ? dead / time : 0, maxTravel, contactsPerHit: hits ? contacts / hits : 0,
    gapsOver1: gaps.filter((x) => x > 1).length, lastDead };
}
export function measureLevel(i) {
  const L = E.LEVELS[i];
  const t0 = Date.now();
  const acts = E.solveFrom(E.newGame(i), 6000);
  const m = measureRun(i, acts);
  // longest straight vertical run of air once every breakable is gone (stone, pots, skulls stay)
  const keep = (ch) => ch === "#" || "BCDx".includes(ch);
  let openRun = 0; const w = L.map[0].length;
  for (let x = 0; x < w; x++) { let run = 0; for (const row of L.map) { run = keep(row[x]) ? 0 : run + 1; openRun = Math.max(openRun, run); } }
  return { id: L.id, name: L.name, ratio: E.ratio(L.map), openRun, cpu: Date.now() - t0, actions: acts, ...m };
}
const f1 = (x) => x.toFixed(1);
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const idx = E.LEVELS.map((L, i) => i).filter((i) => args.includes("all") || (args.length ? args.includes(E.LEVELS[i].id) : E.LEVELS[i].set === "lab"));
  console.log("id   name             col/grey/wall/empty  won  time  deaths  maxGap  dead(s) dead%  >1s-gaps  maxTravel  contacts/hit  openRunAfterClear  lastFifthDead  cpu");
  for (const i of idx) {
    const r = measureLevel(i), q = r.ratio;
    console.log(`${r.id.padEnd(4)} ${r.name.padEnd(16)} ${String(q.col).padStart(3)}/${String(q.grey).padStart(2)}/${String(q.wall).padStart(2)}/${String(q.empty).padStart(2)}${q.other ? "+" + q.other : "  "}        ${r.won ? "yes" : "NO "}  ${f1(r.time).padStart(5)}  ${r.deaths}       ${f1(r.maxGap).padStart(4)}    ${f1(r.dead).padStart(5)}  ${String(Math.round(r.deadPct * 100)).padStart(3)}%   ${String(r.gapsOver1).padStart(3)}       ${f1(r.maxTravel).padStart(4)}       ${f1(r.contactsPerHit).padStart(4)}       ${String(r.openRun).padStart(2)}                 ${f1(r.lastDead).padStart(4)}s       ${r.cpu}ms`);
  }
}
