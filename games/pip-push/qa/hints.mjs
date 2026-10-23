// Pip Push hint checks (night 2). node games/pip-push/qa/hints.mjs
// For every level: from the start and from a few random positions, follow only the hints (walk to the
// ring, push the arrow's way) and check the level is won in exactly the promised number of pushes, that
// par equals the hint's count from the start, and how long a hint takes. Also checks a stuck position.
import { chromium } from "../../../tools/node_modules/playwright/index.mjs";
import path from "node:path"; import { pathToFileURL, fileURLToPath } from "node:url";
const dir = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = []; p.on("pageerror", (e) => errs.push(e.message));
await p.goto(pathToFileURL(path.join(dir, "..", "index.html")).href);
let fails = 0; const ok = (name, c, d = "") => { console.log((c ? "PASS " : "FAIL ") + name + (d ? "  " + d : "")); if (!c) fails++; };
const res = await p.evaluate(() => {
  const qa = window.__qa, out = [];
  let seed = 7; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  function followHints() { // returns {won, pushes, promised, maxMs}
    let promised = null, pushes = 0, maxMs = 0;
    for (let guard = 0; guard < 80; guard++) {
      const t = performance.now(); qa.act("hint"); maxMs = Math.max(maxMs, performance.now() - t);
      const h = qa.state().hint; if (!h || typeof h === "string") return { won: false, h, promised, pushes, maxMs };
      if (promised == null) promised = h.left;
      // walk to the ring by steps along a BFS path the game itself uses for taps
      const st = qa.state(); const path = qa.walk(h.stand[0], h.stand[1]);
      if (!path) return { won: false, why: "no walk", promised, pushes, maxMs };
      for (const d of path) qa.act(d);
      qa.act(h.d); pushes++;
      if (qa.state().screen === "won") return { won: true, pushes, promised, maxMs };
    }
    return { won: false, why: "guard", promised, pushes, maxMs };
  }
  for (let L = 0; L < qa.levels(); L++) {
    qa.reset(L); const par = qa.par(L);
    const a = followHints();
    out.push({ L, from: "start", par, ...a });
    for (let k = 0; k < 3; k++) {
      qa.reset(L);
      for (let i = 0; i < 6 + k * 6; i++) { const acts = qa.actions().filter((x) => "UDLR".includes(x)); if (!acts.length) break; qa.act(acts[(rnd() * acts.length) | 0]); if (qa.state().screen !== "playing") break; }
      if (qa.state().screen !== "playing") continue;
      qa.act("hint"); const h = qa.state().hint;
      if (h === "stuck") { out.push({ L, from: "random", stuck: true }); continue; }
      const r = followHints(); out.push({ L, from: "random", ...r });
    }
  }
  return out;
});
for (const r of res) {
  if (r.from === "start") ok(`L${r.L + 1} hints from start win in par (${r.par})`, r.won && r.pushes === r.par && r.promised === r.par, JSON.stringify(r));
  else if (r.stuck) console.log(`info L${r.L + 1} random position is stuck (hint says so)`);
  else ok(`L${r.L + 1} hints from a random position win as promised`, r.won && r.pushes === r.promised, JSON.stringify(r));
}
const maxMs = Math.max(...res.filter((r) => r.maxMs != null).map((r) => r.maxMs));
ok("slowest hint under 1.5 s", maxMs < 1500, maxMs.toFixed(0) + " ms");
// a position that can't be finished: level 1, push the die into the end wall past the goal? (corridor: push 3x lands on goal)
await p.evaluate(() => { window.__qa.reset(2); });
// Nook: push die into a corner -> stuck
const stuck = await p.evaluate(() => { const qa = window.__qa; qa.reset(0); qa.act("R"); qa.act("R"); qa.act("R");
  // level 1 is won after 3; use level 4 instead: push the die right twice into the wall corner region
  qa.reset(3); for (const d of "URRRDDLL") qa.act(d); qa.act("hint"); return { s: qa.state(), tip: document.getElementById("tip").textContent }; });
console.log("info stuck probe:", JSON.stringify(stuck.s.dice), stuck.s.hint, "|", stuck.tip);
await p.evaluate(() => { const qa = window.__qa; qa.reset(6); qa.act("hint"); });
await p.waitForTimeout(300); await p.screenshot({ path: path.join(dir, "shot-phone-hint.png") });
ok("no page errors", errs.length === 0, errs.join(" | "));
await b.close(); process.exit(fails ? 1 : 0);
