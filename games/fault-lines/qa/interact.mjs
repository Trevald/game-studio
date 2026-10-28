// node games/fault-lines/qa/interact.mjs — level proofs + real pointer/keyboard tests + screenshots.
import { createRequire } from "node:module";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.join(here, "../../../tools/package.json"));
const { chromium } = require("playwright");
const core = await import(pathToFileURL(path.join(here, "../lab/core.mjs")));
const url = pathToFileURL(path.join(here, "../index.html")).href;
const results = [];
const check = (name, ok, info = "") => { results.push({ name, ok: !!ok, info }); console.log((ok ? "PASS " : "FAIL ") + name + (info ? "  — " + info : "")); };

// ---- level proofs (re-run the generator's checks on the embedded data) ----
const html = fs.readFileSync(path.join(here, "../index.html"), "utf8");
const LEVELS = JSON.parse(html.match(/const LEVELS = (\[[\s\S]*?\n\]);/)[1]);
LEVELS.forEach((L, k) => {
  const N = L.w * L.h, walls = new Set(L.walls.map(([a, b]) => core.wkey(a, b))), dig = [...L.d].map(Number);
  const cands = core.candidates(L.w, L.h, dig, walls), sols = core.solveCover(N, cands, 2), h = core.humanSolve(N, cands);
  const ans = L.regions.map((c) => c.slice().sort((a, b) => a - b).join()).sort().join("|");
  const got = sols.length ? sols[0].map((q) => cands[q].join()).sort().join("|") : "";
  check(`L${k + 1} ${L.w}x${L.h}: exactly one answer, it is the stored one, solvable without guessing`, sols.length === 1 && got === ans && h.ok, `walls ${L.walls.length}, lookahead rounds ${h.rounds - h.singles}`);
  // every pair of equal numbers is apart (a real Suguru) and every region holds 1..N
  let touch = 0; for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) { const dx = Math.abs(i % L.w - j % L.w), dy = Math.abs(((i / L.w) | 0) - ((j / L.w) | 0)); if (dx <= 1 && dy <= 1 && dig[i] === dig[j]) touch++; }
  if (touch) check(`L${k + 1} no touching equal numbers`, false, touch + " pairs");
});

const browser = await chromium.launch();
async function open(vp, opts = {}) {
  const ctx = await browser.newContext({ viewport: vp, hasTouch: !!opts.touch, isMobile: !!opts.touch });
  const page = await ctx.newPage();
  const errors = []; page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(url);
  return { ctx, page, errors };
}
async function center(page, i) {
  return page.evaluate((i) => { const r = document.querySelector(`#board rect[data-i="${i}"]`).getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }, i);
}
async function drag(page, cells, { release = true } = {}) {
  let [x, y] = await center(page, cells[0]);
  await page.mouse.move(x, y); await page.mouse.down();
  for (const c of cells.slice(1)) { const [nx, ny] = await center(page, c); await page.mouse.move(nx, ny, { steps: 6 }); }
  if (release) await page.mouse.up();
}
const st = (page) => page.evaluate(() => window.__qa.state());

// ---- desktop: pointer play ----
{
  const { ctx, page, errors } = await open({ width: 1280, height: 800 });
  check("help shows on first visit", await page.isVisible("#helpOv.on"));
  await page.click("#closeHelp");
  check("help closes", !(await page.isVisible("#helpOv.on")));
  await page.evaluate(() => window.__qa.reset(0));
  const L1 = LEVELS[0];
  // a real answer region of L1, dragged along a path
  let reg;
  // order the region's cells into a walk (all L1 regions are paths or near-paths; fall back to region: action)
  const walk = (cells) => { for (const s of cells) { const p = [s], rec = () => { if (p.length === cells.length) return true; const last = p[p.length - 1]; for (const q of cells) if (!p.includes(q) && (Math.abs(q - last) === L1.w || (Math.abs(q - last) === 1 && ((q / L1.w) | 0) === ((last / L1.w) | 0)))) { p.push(q); if (rec()) return true; p.pop(); } return false; }; if (rec()) return p; } return null; };
  reg = L1.regions.find((c) => c.length >= 2 && walk(c));
  const w = reg && walk(reg);
  check("L1 has a region drawable as one stroke", !!w, JSON.stringify(reg));
  await drag(page, w);
  let s = await st(page);
  check("dragging the cells of an answer region makes one green region", s.regions.length === 1 && s.statuses[0] === "good" && s.regions[0].length === reg.length, JSON.stringify(s.regions));
  // retract: drag 3 cells then back one
  await page.evaluate(() => window.__qa.reset(0));
  const col = [0, L1.w, 2 * L1.w];
  await drag(page, [col[0], col[1], col[2], col[1]]);
  s = await st(page);
  check("dragging back takes the last cell out of the stroke", s.regions.length === 1 && s.regions[0].length === 2, JSON.stringify(s.regions));
  // tap a free cell → one-cell region; tap again → free
  await page.evaluate(() => window.__qa.reset(0));
  const [tx, ty] = await center(page, 5);
  await page.mouse.click(tx, ty); s = await st(page);
  check("tap a free cell makes a one-cell region", s.regions.length === 1 && s.regions[0].length === 1);
  await page.mouse.click(tx, ty); s = await st(page);
  check("tap it again frees it", s.regions.length === 0 && s.free === L1.w * L1.h);
  // grow from an existing region
  await page.evaluate(() => window.__qa.reset(0));
  await drag(page, [col[0], col[1]]); await drag(page, [col[1], col[2]]);
  s = await st(page);
  check("dragging from a region grows it", s.regions.length === 1 && s.regions[0].length === 3, JSON.stringify(s.regions));
  // tap a cell in the middle of a 3-region: frees it and the rest splits
  await page.evaluate(() => window.__qa.reset(0));
  const line = [0, 1, 2];
  await drag(page, line);
  const [mx, my] = await center(page, 1); await page.mouse.click(mx, my); s = await st(page);
  check("freeing the middle cell splits the region in two", s.regions.length === 2 && s.free === L1.w * L1.h - 2, JSON.stringify(s.regions));
  // fixed wall can't be crossed
  const [wa, wb] = L1.walls[0];
  await page.evaluate(() => window.__qa.reset(0));
  await drag(page, [wa, wb]); s = await st(page);
  check("a stroke can't cross a fixed wall", !s.regions.some((r) => r.includes(wa) && r.includes(wb)), JSON.stringify(s.regions));
  // a region that wraps around a fixed wall is red and can't win
  {
    const k = LEVELS.findIndex((L) => L.walls.length), L = LEVELS[k], [a, b] = L.walls[0], W = L.w;
    const nbs = (i) => [i - W, i + W, i % W ? i - 1 : -1, i % W < W - 1 ? i + 1 : -1].filter((q) => q >= 0 && q < L.w * L.h);
    const prev = new Map([[a, null]]), q = [a];
    while (q.length) { const c = q.shift(); if (c === b) break; for (const n of nbs(c)) if (!prev.has(n) && !(c === a && n === b)) { prev.set(n, c); q.push(n); } }
    const path = []; for (let c = b; c != null; c = prev.get(c)) path.unshift(c);
    await page.evaluate((k) => window.__qa.reset(k), k);
    await page.evaluate((p) => window.__qa.act("region:" + p.join(",")), path);
    s = await st(page);
    const r = s.regions.findIndex((r) => r.includes(a) && r.includes(b));
    check("a region wrapped around a fixed wall turns red", r >= 0 && s.statuses[r] === "bad", JSON.stringify({ path, st: s.statuses[r] }));
  }
  // undo + restart
  await page.evaluate(() => window.__qa.reset(0));
  await drag(page, [w[0], w[1]]); await page.click("#undoBtn"); s = await st(page);
  check("Undo removes the stroke", s.regions.length === 0);
  await drag(page, [w[0], w[1]]); await page.click("#restartBtn"); s = await st(page);
  check("Restart clears the board", s.regions.length === 0);
  await page.click("#undoBtn"); s = await st(page);
  check("Restart can be undone", s.regions.length === 1);
  // hints: a wrong region first, then the next answer region
  await page.evaluate(() => window.__qa.reset(4));
  const L5 = LEVELS[4], ans5 = new Array(L5.w * L5.h); L5.regions.forEach((c, k) => c.forEach((i) => (ans5[i] = k)));
  let wrong = null;
  for (let i = 0; i < L5.w * L5.h && !wrong; i++) for (const q of [i + 1, i + L5.w]) { if (q >= L5.w * L5.h || (q === i + 1 && q % L5.w === 0)) continue; if (ans5[i] !== ans5[q] && !L5.walls.some(([a, b]) => (a === i && b === q) || (a === q && b === i))) { wrong = [i, q]; break; } }
  await page.evaluate((c) => window.__qa.act("region:" + c.join(",")), wrong);
  await page.click("#hintBtn"); s = await st(page);
  check("Hint marks a region that can't be right", s.hint && s.hint.kind === "wrong" && s.hints === 1, JSON.stringify(s.hint));
  await page.click("#undoBtn"); await page.click("#hintBtn"); s = await st(page);
  check("Hint then marks the first region you can deduce", s.hint && s.hint.kind === "next" && s.hint.cells.join() === L5.regions[0].join(), JSON.stringify(s.hint));
  // following hints solves the board
  for (let k = 0; k < 40 && s.screen === "playing"; k++) { const h = await page.evaluate(() => window.__qa.hintFor()); await page.evaluate((h) => window.__qa.act(h.kind === "wrong" ? "undo" : "region:" + h.cells.join(",")), h); s = await st(page); }
  check("following hints alone solves level 5", s.screen === "won");
  check("win card shows with Next", await page.isVisible("#win.on #nextBtn"));
  await page.click("#nextBtn"); s = await st(page);
  check("Next opens level 6", s.level === 5 && s.screen === "playing");
  // persistence
  await page.evaluate(() => window.__qa.act("tap:0"));
  await page.reload(); s = await st(page);
  check("reload keeps the level and the board", s.level === 5 && s.regions.length === 1);
  check("solved level marked in the picker", await page.evaluate(() => { document.getElementById("levelsBtn").click(); return document.querySelectorAll(".lv.done").length >= 1; }));
  await page.keyboard.press("Escape");
  check("no console errors (desktop)", errors.length === 0, errors.join(" | "));
  await ctx.close();
}

// ---- keyboard: solve L1 with the pen ----
{
  const { ctx, page, errors } = await open({ width: 1280, height: 800 });
  await page.click("#closeHelp"); await page.evaluate(() => window.__qa.reset(0));
  await page.focus("#board");
  const L = LEVELS[0];
  let cur = 0;
  const go = async (to) => { while (cur !== to) { const cx = cur % L.w, cy = (cur / L.w) | 0, tx = to % L.w, ty = (to / L.w) | 0; const k = tx > cx ? "ArrowRight" : tx < cx ? "ArrowLeft" : ty > cy ? "ArrowDown" : "ArrowUp"; await page.keyboard.press(k); cur += { ArrowRight: 1, ArrowLeft: -1, ArrowDown: L.w, ArrowUp: -L.w }[k]; } };
  // pen strokes along walks of each answer region
  const walkOf = (cells) => { for (const s of cells) { const p = [s], rec = () => { if (p.length === cells.length) return true; const last = p[p.length - 1]; for (const q of cells) if (!p.includes(q) && (Math.abs(q - last) === L.w || (Math.abs(q - last) === 1 && ((q / L.w) | 0) === ((last / L.w) | 0)))) { p.push(q); if (rec()) return true; p.pop(); } return false; }; if (rec()) return p; } return null; };
  const isAdj = (p, q) => Math.abs(p - q) === L.w || (Math.abs(p - q) === 1 && ((p / L.w) | 0) === ((q / L.w) | 0));
  for (const reg of L.regions) {
    // grow the region one cell at a time: pen down on a cell already in it, step to the next, pen up
    const done = [reg[0]];
    await page.keyboard.press("Escape");
    await go(reg[0]); await page.keyboard.press("Space"); await page.keyboard.press("Space"); // tap: one-cell region
    while (done.length < reg.length) {
      const nxt = reg.find((c) => !done.includes(c) && done.some((d) => isAdj(c, d)));
      const from = done.find((d) => isAdj(d, nxt));
      await go(from); await page.keyboard.press("Space"); await go(nxt); await page.keyboard.press("Space");
      done.push(nxt);
    }
  }
  const s = await st(page);
  check("keyboard pen solves level 1", s.screen === "won", JSON.stringify(s.regions));
  await page.keyboard.press("Enter");
  check("Enter on the win card goes to level 2", (await st(page)).level === 1);
  await page.keyboard.press("h"); check("H gives a hint", !!(await st(page)).hint);
  check("no console errors (keyboard)", errors.length === 0, errors.join(" | "));
  await ctx.close();
}

// ---- screenshots at four sizes ----
const sizes = { phone: [{ width: 390, height: 844 }, true], small: [{ width: 360, height: 640 }, true], desktop: [{ width: 1280, height: 800 }, false], landscape: [{ width: 844, height: 390 }, true] };
for (const [name, [vp, touch]] of Object.entries(sizes)) {
  const { ctx, page, errors } = await open(vp, { touch });
  const shot = (n) => page.screenshot({ path: path.join(here, `shot-${name}-${n}.png`) });
  if (name === "phone") await shot("help");
  await page.evaluate(() => document.getElementById("closeHelp").click());
  await page.evaluate(() => window.__qa.reset(0)); await shot("L1");
  const L = LEVELS[0], reg = L.regions[0];
  await page.evaluate((c) => window.__qa.act("region:" + c.join(",")), reg.slice(0, 2));
  const sc = await center(page, L.regions[1][0]); await page.mouse.move(...sc); await page.mouse.down();
  const sc2 = await center(page, L.regions[1][1]); await page.mouse.move(...sc2, { steps: 5 });
  await shot("L1-drag"); await page.mouse.up();
  await page.evaluate(() => { for (const a of window.__qa.solve()) window.__qa.act(a); }); await shot("L1-won");
  await page.evaluate(() => window.__qa.reset(6));
  await page.evaluate(() => { const r = window.__qa.solve(); for (const a of r.slice(0, 4)) window.__qa.act(a); window.__qa.act("hint"); }); await shot("L7-hint");
  await page.evaluate(() => window.__qa.reset(10)); await shot("L11");
  if (name === "phone") { await page.evaluate(() => document.getElementById("levelsBtn").click()); await shot("picker"); }
  const over = await page.evaluate(() => { const b = document.getElementById("board").getBoundingClientRect(); const t = [...document.querySelectorAll("#tools button, header button")].map((e) => e.getBoundingClientRect()); return { scrollX: document.documentElement.scrollWidth > innerWidth, scrollY: document.documentElement.scrollHeight > innerHeight + 1, boardOff: b.bottom > innerHeight || b.right > innerWidth, small: t.filter((r) => r.width < 44 || r.height < 44).length }; });
  check(`${name}: no scroll, board on screen, buttons ≥ 44px`, !over.scrollX && !over.scrollY && !over.boardOff && !over.small, JSON.stringify(over));
  check(`${name}: no console errors`, errors.length === 0, errors.join(" | "));
  await ctx.close();
}
await browser.close();
const failed = results.filter((r) => !r.ok);
fs.writeFileSync(path.join(here, "interact.json"), JSON.stringify({ passed: results.length - failed.length, total: results.length, results }, null, 1));
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
