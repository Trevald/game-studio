// Pip Push interaction checks: tap-to-walk, die taps, win-card delay. node games/pip-push/qa/interact.mjs
import { chromium } from "../../../tools/node_modules/playwright/index.mjs";
import path from "node:path"; import { pathToFileURL, fileURLToPath } from "node:url";
const dir = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = []; p.on("pageerror", (e) => errs.push(e.message));
await p.goto(pathToFileURL(path.join(dir, "..", "index.html")).href);
let fails = 0; const ok = (name, c, d = "") => { console.log((c ? "PASS " : "FAIL ") + name + (d ? "  " + d : "")); if (!c) fails++; };
// get geometry: canvas covers columns 0.5..w-0.5
const geo = async () => p.evaluate(() => { const c = document.getElementById("board").getBoundingClientRect(); return { left: c.left, top: c.top, width: c.width }; });
async function tap(x, y, w) { const g = await geo(); const cell = g.width / (w - 1); await p.touchscreen.tap(g.left + x * cell, g.top + y * cell); await p.waitForTimeout(80); }
await p.evaluate(() => window.__qa.reset(3)); // Turnaround 6x5, player (1,2), die (3,2)
let s = await p.evaluate(() => window.__qa.state());
await tap(4, 3, 6); s = await p.evaluate(() => window.__qa.state());
ok("tap far free square walks there", s.player.join() === "4,3" && s.pushes === 0, JSON.stringify(s.player) + " moves " + s.moves);
await p.evaluate(() => document.getElementById("undoBtn").click()); s = await p.evaluate(() => window.__qa.state());
ok("one undo reverts the whole walk", s.player.join() === "1,2" && !s.canUndo);
await tap(3, 2, 6); s = await p.evaluate(() => window.__qa.state());
ok("tap on a far die does nothing", s.player.join() === "1,2" && s.moves === 0);
await tap(2, 2, 6); await tap(3, 2, 6); s = await p.evaluate(() => window.__qa.state());
ok("tap next to a die pushes once", s.pushes === 1 && s.dice[0][0] === 4, JSON.stringify(s));
// win card delay on level 1
await p.evaluate(() => window.__qa.reset(0));
for (let i = 0; i < 3; i++) await p.keyboard.press("ArrowRight");
const hidden0 = await p.evaluate(() => document.getElementById("winSheet").hidden);
await p.waitForTimeout(900);
const hidden1 = await p.evaluate(() => document.getElementById("winSheet").hidden);
ok("win card waits, then shows", hidden0 && !hidden1);
await p.screenshot({ path: path.join(dir, "shot-phone-win.png") });
await p.keyboard.press("n"); await p.waitForTimeout(300); s = await p.evaluate(() => window.__qa.state());
ok("N goes to next level", s.level === 1 && s.screen === "playing");
ok("no page errors", errs.length === 0, errs.join("; "));
await b.close(); process.exit(fails ? 1 : 0);
