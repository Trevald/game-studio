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
for (let lv = 0; lv < 12; lv++) {
  await page.evaluate((l) => window.__qa.reset(l), lv);
  let n = 0;
  for (; n < 12; n++) { const h = await page.evaluate(() => window.__qa.hint()); if (!h) break; await page.evaluate((m) => window.__qa.act(m), h); if ((await S()).screen === "won") { n++; break; } }
  s = await S(); ok(`hints solve level ${lv + 1} at par`, s.screen === "won" && s.slides === s.par, `${s.slides}/${s.par}`);
}
// hint from a wandered state still leads home
await page.evaluate(() => { window.__qa.reset(10); for (const m of ["r0R","c2D","r5L"]) window.__qa.act(m); });
const h = await page.evaluate(() => window.__qa.solve());
ok("hint path from 3 stray slides exists", Array.isArray(h) && h[0] !== "restart", (h || []).length + " slides");
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
