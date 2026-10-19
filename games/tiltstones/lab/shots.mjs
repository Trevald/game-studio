import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(join(here, "../../../tools/package.json"));
const { chromium } = require("playwright");
const url = "file://" + join(here, "..", "index.html");
const b = await chromium.launch();
for (const [name, vp] of [["phone", { width: 390, height: 844 }], ["desktop", { width: 1280, height: 800 }]]) {
  const p = await (await b.newContext({ viewport: vp })).newPage();
  const errs = []; p.on("pageerror", (e) => errs.push(e.message)); p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  await p.goto(url); await p.waitForTimeout(300);
  await p.screenshot({ path: join(here, "shots", `${name}-title.png`) });
  await p.click("#labBtn"); await p.waitForTimeout(200);
  await p.screenshot({ path: join(here, "shots", `${name}-lab.png`), fullPage: name === "phone" });
  const i9 = await p.evaluate(() => LEVELS.findIndex((L) => L.id === "L9"));
  await p.click(`[data-lab="${i9}"]`); await p.waitForTimeout(200);
  await p.screenshot({ path: join(here, "shots", `${name}-card-L9.png`) });
  await p.click("#cPlay"); await p.keyboard.down("ArrowLeft"); await p.waitForTimeout(1500); await p.keyboard.up("ArrowLeft"); await p.waitForTimeout(1500);
  await p.screenshot({ path: join(here, "shots", `${name}-play-L9.png`) });
  // finish via QA solve to see the lab win panel
  await p.evaluate(() => { __qa.reset(LEVELS.findIndex((L) => L.id === "L6")); for (const a of __qa.solve()) __qa.act(a); });
  await p.waitForTimeout(400);
  await p.screenshot({ path: join(here, "shots", `${name}-won-L6.png`) });
  console.log(name, "errors:", errs.length ? errs : "none", "scrollW", await p.evaluate(() => document.documentElement.scrollWidth));
}
await b.close();
