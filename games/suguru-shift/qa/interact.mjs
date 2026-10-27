// Interaction tests: node games/suguru-shift/qa/interact.mjs
import { chromium } from "../../../tools/node_modules/playwright/index.mjs";
import path from "node:path"; import { pathToFileURL, fileURLToPath } from "node:url";
const dir = path.dirname(fileURLToPath(import.meta.url));
const url = pathToFileURL(path.join(dir, "..", "index.html")).href;
const browser = await chromium.launch();
const results = [];
const ok = (name, cond, detail = "") => { results.push({ name, ok: !!cond }); console.log((cond ? "PASS " : "FAIL ") + name + (detail ? " — " + detail : "")); };
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const page = await ctx.newPage();
const errs = []; page.on("pageerror", (e) => errs.push(e.message));
await page.goto(url); await page.waitForTimeout(200);
ok("help opens on first visit", await page.locator("#help.open").count() === 1);
await page.click("#helpClose");
const S = () => page.evaluate(() => window.__qa.state());
// keyboard: L1 solution via cursor + shift-arrow
await page.evaluate(() => window.__qa.reset(0));
const sol = await page.evaluate(() => window.__qa.solve());
const row = +sol[0][1];
await page.focus("#board");
await page.keyboard.press("ArrowDown"); // shows cursor at 0
for (let i = 0; i < row; i++) await page.keyboard.press("ArrowDown");
await page.keyboard.press(sol[0].endsWith("R") ? "Shift+ArrowRight" : "Shift+ArrowLeft");
await page.waitForTimeout(300);
ok("keyboard Shift+arrow solves L1", (await S()).screen === "won");
await page.keyboard.press("z"); await page.waitForTimeout(50);
let s = await S(); ok("Z undoes the winning slide", s.screen === "playing" && s.slides === 0);
// pad: tap a number in the row, then the pad arrow
const b = await page.locator("#board").boundingBox(), cs = b.width / 4;
await page.touchscreen.tap(b.x + cs * 0.5, b.y + cs * (row + 0.5));
await page.waitForTimeout(50);
await page.click(sol[0].endsWith("R") ? "#padR" : "#padL"); await page.waitForTimeout(300);
ok("tap + pad arrow solves L1", (await S()).screen === "won");
// a multi-step drag counts each step; a full wrap counts zero
await page.evaluate(() => window.__qa.reset(3));
const g0 = (await S()).grid.join();
await page.mouse.move(b.x + 10, b.y + 10); await page.mouse.down();
const cs5 = b.width / 5;
await page.mouse.move(b.x + 10 + cs5 * 2, b.y + 12, { steps: 8 }); await page.mouse.up(); await page.waitForTimeout(300);
s = await S(); ok("2-step drag = 2 slides", s.slides === 2, "slides " + s.slides);
await page.click("#undoBtn"); await page.waitForTimeout(50);
s = await S(); ok("undo reverts the whole drag", s.slides === 0 && s.grid.join() === g0);
await page.mouse.move(b.x + 10, b.y + 10); await page.mouse.down();
await page.mouse.move(b.x + 10 + cs5 * 5, b.y + 12, { steps: 10 }); await page.mouse.up(); await page.waitForTimeout(300);
s = await S(); ok("full wrap drag = no slide", s.slides === 0 && s.grid.join() === g0);
// restart is undoable
await page.evaluate(() => { window.__qa.act("r0L"); window.__qa.act("c1U"); window.__qa.act("restart"); });
s = await S(); ok("restart clears slides", s.slides === 0 && s.grid.join() === g0);
await page.evaluate(() => window.__qa.act("undo")); s = await S();
ok("undo after restart brings the slides back", s.slides === 2);
// hint: following hints solves every level at par from the start
const NL = await page.evaluate(() => window.__qa.levels());
for (let lv = 0; lv < NL; lv++) {
  await page.evaluate((l) => window.__qa.reset(l), lv);
  let n = 0;
  for (; n < 12; n++) { const h = await page.evaluate(() => window.__qa.hint()); if (!h) break; await page.evaluate((m) => window.__qa.act(m), h); if ((await S()).screen === "won") { n++; break; } }
  s = await S(); ok(`hints solve level ${lv + 1} at par`, s.screen === "won" && s.slides === s.par, `${s.slides}/${s.par}`);
}
// hint from a wandered state still leads home
await page.evaluate(() => { window.__qa.reset(10); for (const m of ["r0R","c2D"]) window.__qa.act(m); });
const h = await page.evaluate(() => window.__qa.solve());
ok("hint path from 2 stray slides exists", Array.isArray(h) && h[0] !== "restart", (h || []).length + " slides");
await page.evaluate(() => { window.__qa.reset(11); for (const m of ["r0R","r1R","c2D","c3U","r5L","c0D"]) window.__qa.act(m); });
const dt = await page.evaluate(() => { const t = performance.now(); window.__qa.hint(); return Math.round(performance.now() - t); });
const tip = await page.locator("#tip").textContent();
ok("far hint points at Undo or Restart quickly", /Undo|Restart/.test(tip) && dt < 600, dt + " ms: " + tip);
// two stray slides on level 12: the hint says how many undos get back on track
await page.evaluate(() => { window.__qa.reset(11); const s = window.__qa.solve(); window.__qa.act(s[0]); window.__qa.act("r0R"); window.__qa.act("c2D"); window.__qa.act("r3L"); });
const h2 = await page.evaluate(() => window.__qa.hint());
const tip2 = await page.locator("#tip").textContent();
ok("drifted hint gives a slide or an undo count", !!h2 || /Undo( \d times)?/.test(tip2), tip2);
// Enter on a focused Next button advances exactly one level
await page.evaluate(() => { window.__qa.reset(1); for (const m of window.__qa.solve()) window.__qa.act(m); });
await page.focus("#nextBtn"); await page.keyboard.press("Enter"); await page.waitForTimeout(100);
ok("Enter on Next goes to the next level only", (await S()).level === 2, "level " + (await S()).level);
await page.focus("#hintBtn"); await page.keyboard.press(" "); await page.waitForTimeout(100);
ok("Space on Hint presses Hint", /Hint:/.test(await page.locator("#tip").textContent()));
// pins (level 13+): locked lines can't move by act, pad or drag
await page.evaluate(() => window.__qa.reset(12));
s = await S();
const pin = s.pins[0], W13 = 5, prow = Math.floor(pin / W13), pcol = pin % W13;
ok("pinned lines are not in actions()", !(await page.evaluate(() => window.__qa.actions())).some((a) => a === "r" + prow + "L" || a === "c" + pcol + "U"));
await page.evaluate((r) => window.__qa.act("r" + r + "L"), prow);
ok("act on a pinned row does nothing", (await S()).slides === 0);
const b13 = await page.locator("#board").boundingBox(), c13 = b13.width / 5;
await page.mouse.move(b13.x + c13 * ((pcol + 2) % 5 + 0.5), b13.y + c13 * (prow + 0.5)); await page.mouse.down();
await page.mouse.move(b13.x + c13 * ((pcol + 2) % 5 + 0.5) + c13 * 1.6, b13.y + c13 * (prow + 0.5), { steps: 8 }); await page.mouse.up(); await page.waitForTimeout(300);
s = await S(); ok("dragging a pinned row slides nothing and says why", s.slides === 0 && /pin/.test(s.hintText), s.hintText);
await page.touchscreen.tap(b13.x + c13 * (pcol + 0.5), b13.y + c13 * ((prow + 2) % 5 + 0.5)); await page.waitForTimeout(50);
await page.click("#padU"); await page.waitForTimeout(250);
s = await S(); ok("pad on a pinned column slides nothing", s.slides === 0 && /Column/.test(s.hintText), s.hintText);
ok("pinned lines are striped", await page.locator(".cell.lockline").count() === 9);
ok("pinned tile is drawn dark", await page.locator("#tiles .tile.pin").count() === s.pins.length);
// two-step hint: clue first, direction second
await page.evaluate(() => window.__qa.reset(5));
await page.click("#hintBtn"); s = await S();
ok("first hint gives a clue, no direction", s.hintStage === 1 && !/(left|right|up|down)/.test(s.hintText) && await page.locator(".cell.hint").count() > 0, s.hintText);
await page.click("#hintBtn"); s = await S();
ok("second hint names the direction", s.hintStage === 2 && /(left|right|up|down)/.test(s.hintText), s.hintText);
// live drag preview: on L1, holding the row at the right step shows every region green before release
await page.evaluate(() => window.__qa.reset(0));
const sol1 = await page.evaluate(() => window.__qa.solve()), r1 = +sol1[0][1], bb = await page.locator("#board").boundingBox(), c1 = bb.width / 4;
await page.mouse.move(bb.x + c1 * 1.5, bb.y + c1 * (r1 + 0.5)); await page.mouse.down();
await page.mouse.move(bb.x + c1 * 1.5 + c1 * 0.9 * (sol1[0].endsWith("R") ? 1 : -1), bb.y + c1 * (r1 + 0.5), { steps: 8 });
const okEarly = await page.locator(".cell.ok").count();
await page.waitForTimeout(400);
const okCells = await page.locator(".cell.ok").count();
ok("preview waits for the line to rest", okEarly < 16, okEarly + " green cells at once");
ok("drag preview shows the result before release", okCells === 16 && (await S()).slides === 0, okCells + " green cells");
await page.mouse.up(); await page.waitForTimeout(300);
ok("release commits the previewed slide", (await S()).screen === "won");
// ---- night 3: daily board ----
const pool = await page.evaluate(() => {
  const bad = [], seen = new Set(), base = Date.UTC(2026, 9, 28);
  for (let i = 0; i < 364; i++) {
    const d = new Date(base + i * 864e5), key = d.toISOString().slice(0, 10), L = dailyLevel(key), dow = d.getUTCDay();
    const want = dow === 1 || dow === 2 ? [5, 3] : dow === 0 ? [6, 5] : [6, 4];
    let g = L.start; for (const m of L.solution) g = applyMove(g, L.w, L.h, m);
    const size = regionSizes(L.regions), a = analyse(g, L.w, L.h, L.regions, size);
    const sp = pathBetween(L.start, L.goal, L.w, L.h, [], 400000);
    const k = L.start.join("") + L.regions.join(",");
    if (L.w !== want[0] || L.par !== want[1] || L.solution.length !== L.par || !a.valid || g.join() !== L.goal.join() || !sp || sp.length !== L.par || seen.has(k)
      || analyse(L.start, L.w, L.h, L.regions, size).valid) bad.push(key);
    seen.add(k);
  }
  const cyc = dailyLevel("2027-10-27").start.join() === dailyLevel("2026-10-28").start.join();
  return { bad, cyc };
});
ok("all 364 daily boards: weekday size, par = shortest, solution reaches a valid goal, no repeats", !pool.bad.length, pool.bad.slice(0, 5).join(" "));
ok("daily pool repeats after 52 weeks", pool.cyc);
const p3 = await ctx.newPage(); const e3 = []; p3.on("pageerror", (e) => e3.push(e.message));
await p3.goto(url + "?day=2026-11-01"); await p3.waitForTimeout(200);
await p3.evaluate(() => document.getElementById("help").classList.remove("open"));
await p3.click("#levelBtn"); await p3.waitForTimeout(100);
const tTxt = await p3.locator("#todayBtn").innerText();
ok("picker shows today's board on top", /Today/.test(tTxt) && /1 Nov/.test(tTxt) && /par 5/.test(tTxt), tTxt.replace(/\n/g, " "));
await p3.click("#todayBtn"); await p3.waitForTimeout(100);
let d3 = await p3.evaluate(() => window.__qa.state());
ok("Today opens the daily board (Sunday 6×6 par 5)", d3.daily === "2026-11-01" && d3.par === 5 && d3.grid.length === 36 && /Daily/.test(await p3.locator("#levelBtn").innerText()));
await p3.evaluate(() => { for (const m of window.__qa.solve()) window.__qa.act(m); }); await p3.waitForTimeout(100);
d3 = await p3.evaluate(() => window.__qa.state());
const wt = await p3.locator("#winTitle").innerText(), nb = await p3.locator("#nextBtn").innerText();
ok("daily win card", d3.screen === "won" && /Today's board at par/.test(wt) && nb === "All levels", wt + " / " + nb);
const stored = await p3.evaluate(() => JSON.parse(localStorage.getItem("suguru-shift.v1")));
ok("daily best saved per date, campaign bests untouched", stored.daily["2026-11-01"] === 5 && !stored.best[17], JSON.stringify(stored.daily));
await p3.click("#nextBtn"); await p3.waitForTimeout(100);
ok("All levels opens the picker with today's best", await p3.locator("#picker.open").count() === 1 && /best 5/.test(await p3.locator("#todayBtn").innerText()));
await p3.click("#pickGrid .lv >> nth=16"); await p3.waitForTimeout(100);
await p3.evaluate(() => { for (const m of window.__qa.solve()) window.__qa.act(m); }); await p3.waitForTimeout(100);
ok("last campaign level leads to All levels", (await p3.locator("#nextBtn").innerText()) === "All levels" && (await p3.locator("#levelBtn").innerText()) === "Level 17/17");
ok("no errors on the daily page", !e3.length, e3.join());
// storage blocked
const ctx2 = await browser.newContext(); const p2 = await ctx2.newPage();
await p2.addInitScript(() => { Object.defineProperty(window, "localStorage", { get() { throw new Error("blocked"); } }); });
const e2 = []; p2.on("pageerror", (e) => e2.push(e.message));
await p2.goto(url); await p2.waitForTimeout(200);
await p2.evaluate(() => { window.__qa.reset(0); for (const m of window.__qa.solve()) window.__qa.act(m); });
ok("plays with storage blocked", (await p2.evaluate(() => window.__qa.state())).screen === "won" && !e2.length, e2.join());
ok("no page errors", !errs.length, errs.join());
await browser.close();
const failed = results.filter((r) => !r.ok).length;
console.log(failed ? `${failed} FAILED` : `ALL ${results.length} PASSED`);
process.exit(failed ? 1 : 0);
