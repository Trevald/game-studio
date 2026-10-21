// Plays lab levels in real time (1×) with real keyboard events, like a careful player:
// every 0.2 s it reads the board, picks a direction with the game's own planner, and holds that key.
// Also records dead time / longest flight on the live game. usage: node play1x.mjs [L1 ...]  (needs tools/node_modules)
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(join(here, "../../../tools/package.json"));
const { chromium } = require("playwright");
const url = "file://" + join(here, "..", "index.html");
const shots = join(here, "shots"); mkdirSync(shots, { recursive: true });
const browser = await chromium.launch(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {});
const ids = process.argv.slice(2);
async function run(id) {
  // landscape maps (wider than tall) are played on a desktop viewport, portrait maps on a phone
  const map = JSON.parse(readFileSync(join(here, "levels.json"), "utf8")).find((L) => L.id === id)?.map;
  const viewport = map && map[0].length > map.length ? { width: 1440, height: 900 } : { width: 390, height: 844 };
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2, hasTouch: false });
  const page = await ctx.newPage();
  await page.goto(url);
  await page.click("#labBtn");
  const idx = await page.evaluate((id) => LEVELS.findIndex((L) => L.id === id), id);
  await page.click(`[data-lab="${idx}"]`);
  if (id === "L1") await page.screenshot({ path: join(shots, "card-L1.png") });
  await page.evaluate(() => {
    window.__m = { log: [], pos: [], hits: [], flights: [], travel: 0, lastY: null, lastVy: null, deaths: 0 };
    const orig = window.step;
    window.step = function (g, s) {
      const r = orig(g, s);
      if (g === game) {
        const m = window.__m, t = g.steps * DT;
        if (m.lastY != null) m.travel += Math.abs(g.ball.y - m.lastY);
        let contact = m.lastVy != null && Math.sign(g.ball.vy) !== Math.sign(m.lastVy);
        for (const e of g.ev) { if (e.t !== "win") contact = true; if (["break", "grey", "diamond", "key", "unlock", "paint"].includes(e.t)) { m.hits.push(t); m.log.push([+t.toFixed(2), e.t, Math.floor(e.x), Math.floor(e.y)]); } if (e.t === "die") m.deaths++; }
        if (contact) { m.flights.push(m.travel); m.travel = 0; }
        if (g.steps % 30 === 0) m.pos.push([+t.toFixed(1), +g.ball.x.toFixed(1), +g.ball.y.toFixed(1), g.ball.color]);
        m.lastY = g.ball.y; m.lastVy = g.ball.vy;
      }
      return r;
    };
  });
  await page.click("#cPlay");
  await page.screenshot({ path: join(shots, `start-${id}.png`) });
  const t0 = Date.now(); let held = null, shot = false;
  while (Date.now() - t0 < 240000) {
    const st = await page.evaluate(() => {
      if (screen === "stuck") return { screen: "stuck" };
      if (screen !== "playing") return { screen: game.screen === "playing" ? screen : game.screen };
      const planning = cloneGame(game);
      // P2's intended strategy: prepare the blue return before considering red.
      // This constrains only the test planner; the live board and collisions stay intact.
      if (LEVELS[game.level].id === "P2" && game.grid[7 * W + 2] === "a")
        planning.grid = planning.grid.map(ch => ch === "B" ? "#" : ch);
      const p = planStep(planning);
      return { screen: "playing", a: p ? p.acts[0] : "stay", t: game.steps * DT };
    });
    if (st.screen !== "playing") break;
    const key = st.a === "left" ? "ArrowLeft" : st.a === "right" ? "ArrowRight" : null;
    if (key !== held) { if (held) await page.keyboard.up(held); if (key) await page.keyboard.down(key); held = key; }
    if (!shot && st.t > 6) { shot = true; await page.screenshot({ path: join(shots, `play-${id}.png`) }); }
    await page.waitForTimeout(200);
  }
  if (held) await page.keyboard.up(held);
  const res = await page.evaluate(() => {
    const m = window.__m, t = game.steps * DT, gaps = []; let last = 0;
    for (const h of m.hits) { gaps.push(h - last); last = h; }
    return { screen: game.screen, ui: screen, time: t, deaths: m.deaths, dead: gaps.reduce((s, x) => s + Math.max(0, x - 1), 0), maxGap: Math.max(0, ...gaps), maxFlight: Math.max(0, ...m.flights), log: m.log, pos: m.pos };
  });
  await page.screenshot({ path: join(shots, `end-${id}.png`) });
  await ctx.close();
  writeFileSync(join(here, `play1x-${id}.json`), JSON.stringify({ id, ...res }, null, 1));
  return { id, ...res };
}
const all = ids.length ? ids : ["L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8", "L9", "L10"];
const out = await Promise.all(all.map(run));
for (const r of out) console.log(`${r.id.padEnd(4)} ${r.screen === "won" ? "won " : r.screen.padEnd(4)} 1x-time ${r.time.toFixed(1).padStart(5)}s deaths ${r.deaths} dead ${r.dead.toFixed(1).padStart(4)}s (${Math.round(100 * r.dead / r.time)}%) maxGap ${r.maxGap.toFixed(1)}s maxFlight ${r.maxFlight.toFixed(1)} rows`);
writeFileSync(join(here, "play1x-last.json"), JSON.stringify(out, null, 1));
await browser.close();
