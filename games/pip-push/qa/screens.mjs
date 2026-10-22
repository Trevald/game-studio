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
  for (const [lv, steps] of [[1, 0], [4, 12], [9, 0], [9, 40]]) {
    await p.evaluate(([lv, steps]) => { const q = window.__qa; q.reset(lv); const sol = q.solve(); for (const a of sol.slice(0, steps)) q.act(a); }, [lv, steps]);
    await p.waitForTimeout(250);
    await p.screenshot({ path: path.join(dir, `shot-${name}-L${lv + 1}-${steps}.png`) });
  }
  const ov = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  console.log(name, "overflow", ov, "errors", errs.length, errs.slice(0, 3));
  await ctx.close();
}
await b.close();
