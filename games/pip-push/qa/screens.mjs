// Extra screenshots for Pip Push: node games/pip-push/qa/screens.mjs
import { chromium } from "../../../tools/node_modules/playwright/index.mjs";
import path from "node:path"; import { pathToFileURL, fileURLToPath } from "node:url";
const dir = path.dirname(fileURLToPath(import.meta.url));
const url = pathToFileURL(path.join(dir, "..", "index.html")).href;
const b = await chromium.launch();
for (const [name, vp, scheme] of [["phone", { width: 390, height: 844 }, "light"], ["small", { width: 360, height: 640 }, "dark"], ["desktop", { width: 1280, height: 800 }, "light"]]) {
  const ctx = await b.newContext({ viewport: vp, colorScheme: scheme, hasTouch: name !== "desktop" });
  const p = await ctx.newPage(); const errs = []; p.on("pageerror", (e) => errs.push(e.message)); p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  await p.goto(url);
  for (const [lv, steps, hint] of [[1, 0], [9, 40], [14, 30, true], [15, 0], [17, 0], [18, 14], [20, 0], [20, 40, true]]) {
    await p.evaluate(([lv, steps, hint]) => { const q = window.__qa; q.reset(lv); const sol = q.solve(); for (const a of sol.slice(0, steps)) q.act(a); if (hint) q.act("hint"); }, [lv, steps, hint]);
    await p.waitForTimeout(250);
    await p.screenshot({ path: path.join(dir, `shot-${name}-L${lv + 1}-${steps}${hint ? "-hint" : ""}.png`) });
  }
  // mid-slide (night 3): level 16, first push, real key, screenshot during the animation
  await p.evaluate(() => window.__qa.reset(15)); await p.keyboard.press("ArrowRight"); await p.waitForTimeout(140);
  await p.screenshot({ path: path.join(dir, `shot-${name}-L16-midslide.png`) });
  const ov = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  console.log(name, "overflow", ov, "errors", errs.length, errs.slice(0, 3));
  await ctx.close();
}
await b.close();
// night 3 review: landscape phone — controls must be on screen without scrolling
{
  const b2 = await chromium.launch(); const ctx = await b2.newContext({ viewport: { width: 844, height: 390 }, hasTouch: true }); const p = await ctx.newPage();
  await p.goto(url);
  for (const lv of [0, 14, 20]) {
    await p.evaluate((lv) => window.__qa.reset(lv), lv); await p.waitForTimeout(150);
    await p.screenshot({ path: path.join(dir, `shot-landscape-L${lv + 1}.png`) });
    const r = await p.evaluate(() => { const c = document.querySelector(".controls").getBoundingClientRect(), bd = document.getElementById("board").getBoundingClientRect();
      return { ctlBottom: c.bottom, boardBottom: bd.bottom, h: innerHeight, scrollH: document.documentElement.scrollHeight, overlapX: bd.right > c.left && c.top < bd.bottom }; });
    console.log("landscape L" + (lv + 1), JSON.stringify(r), r.ctlBottom <= r.h && r.boardBottom <= r.h && r.scrollH <= r.h + 1 ? "PASS" : "FAIL");
  }
  await b2.close();
}
