// Pip Push night-2 checks through real input: dead-end notice (worker), "Undo N moves" button, hint via the
// button on and off the stored plan, page stays responsive. node games/pip-push/qa/dead.mjs
import { chromium } from "../../../tools/node_modules/playwright/index.mjs";
import path from "node:path"; import { pathToFileURL, fileURLToPath } from "node:url";
const dir = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = []; p.on("pageerror", (e) => errs.push(e.message));
await p.goto(pathToFileURL(path.join(dir, "..", "index.html")).href);
let fails = 0; const ok = (name, c, d = "") => { console.log((c ? "PASS " : "FAIL ") + name + (d ? "  " + d : "")); if (!c) fails++; };
const st = () => p.evaluate(() => window.__qa.state());
const tip = () => p.evaluate(() => document.getElementById("tip").textContent);
await p.evaluate(() => window.__qa.reset(1)); // Side step: pushing right first is a dead end
await p.keyboard.press("ArrowRight"); await p.keyboard.press("ArrowRight");
await p.waitForTimeout(400);
let s = await st(); ok("dead end is announced after the push", s.dead && /can't be finished/.test(await tip()), await tip());
await p.click("[data-rewind]"); await p.waitForTimeout(100); s = await st();
ok("Undo button goes back to before the push", !s.dead && s.pushes === 0 && s.dice[0][0] === 3, JSON.stringify(s.dice));
await p.screenshot({ path: path.join(dir, "shot-phone-dead.png") });
// hint on the stored plan: instant
await p.evaluate(() => window.__qa.reset(14));
let t = Date.now(); await p.click("#hintBtn"); await p.waitForTimeout(50); s = await st();
ok("hint at the start of level 15 is instant (stored plan)", s.hint && s.hint.left === 20 && Date.now() - t < 400, `${Date.now() - t} ms`);
// off the plan: worker search, page stays responsive
await p.evaluate(() => { const q = window.__qa; q.reset(14); }); // Three ways
for (const k of ["ArrowUp", "ArrowRight", "ArrowRight", "ArrowDown"]) await p.keyboard.press(k);
await p.waitForTimeout(400);
s = await st(); const dead = s.dead;
t = Date.now(); await p.click("#hintBtn");
const thinking = await tip();
await p.waitForFunction(() => window.__qa.state().hint !== null, null, { timeout: 8000 });
s = await st(); ok("off-plan hint answers via the worker", s.hint !== null, `${Date.now() - t} ms, first tip "${thinking}", dead=${dead}, hint=${JSON.stringify(s.hint)}`);
await p.screenshot({ path: path.join(dir, "shot-phone-hint2.png") });
ok("no page errors", errs.length === 0, errs.join(" | "));
await b.close(); process.exit(fails ? 1 : 0);
