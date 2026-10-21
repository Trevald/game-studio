// Phone + desktop screenshots of the night-4 candidates: lab list, card, play, won.  usage: node shots-n.mjs N1 N2 N3
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(join(here, "../../../../tools/package.json"));
const { chromium } = require("playwright");
const url = "file://" + join(here, "..", "..", "index.html"), out = join(here, "..", "shots");
const b = await chromium.launch();
for (const [name, vp] of [["phone", { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }], ["desktop", { viewport: { width: 1280, height: 800 } }]]) {
  const p = await (await b.newContext(vp)).newPage();
  const errs = []; p.on("pageerror", (e) => errs.push(e.message)); p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  await p.goto(url); await p.waitForTimeout(300);
  await p.click("#labBtn"); await p.waitForTimeout(200);
  await p.screenshot({ path: join(out, `${name}-lab.png`) });
  for (const id of process.argv.slice(2)) {
    const i = await p.evaluate((id) => LEVELS.findIndex((L) => L.id === id), id);
    await p.evaluate(() => openLab()); await p.waitForTimeout(150);
    await p.click(`[data-lab="${i}"]`); await p.waitForTimeout(200);
    await p.screenshot({ path: join(out, `${name}-card-${id}.png`) });
    await p.click("#cPlay"); await p.waitForTimeout(1200);
    await p.screenshot({ path: join(out, `${name}-play-${id}.png`) });
    await p.evaluate((i) => { __qa.reset(i); for (const a of __qa.solve()) __qa.act(a); }, i);
    await p.waitForTimeout(400);
    await p.screenshot({ path: join(out, `${name}-won-${id}.png`) });
  }
  console.log(name, "errors:", errs.length ? errs : "none", "scrollW", await p.evaluate(() => document.documentElement.scrollWidth));
}
await b.close();
