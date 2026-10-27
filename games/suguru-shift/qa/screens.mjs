// Screenshots of key states: node games/suguru-shift/qa/screens.mjs
import { chromium } from "../../../tools/node_modules/playwright/index.mjs";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
const dir = path.dirname(fileURLToPath(import.meta.url));
const url = pathToFileURL(path.join(dir, "..", "index.html")).href;
const browser = await chromium.launch();
const sizes = { phone: [390, 844, true], small: [360, 640, true], desktop: [1280, 800, false], landscape: [844, 390, true] };
const errors = [];
for (const [name, [w, h, mobile]] of Object.entries(sizes)) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(name + ": " + e.message));
  await page.goto(url); await page.waitForTimeout(300);
  if (name === "phone") await page.screenshot({ path: path.join(dir, `shot-${name}-help.png`) });
  await page.evaluate(() => window.__qa.reset(0));
  await page.waitForTimeout(150);
  await page.screenshot({ path: path.join(dir, `shot-${name}-L1.png`) });
  // mid-drag on row 2 of level 1
  const b = await page.locator("#board").boundingBox();
  const st = await page.evaluate(() => window.__qa.state());
  const cs = b.width / 4, sol = await page.evaluate(() => window.__qa.solve());
  const row = +sol[0][1];
  await page.mouse.move(b.x + cs * 1.5, b.y + cs * (row + 0.5));
  await page.mouse.down();
  await page.mouse.move(b.x + cs * 1.5 + 20, b.y + cs * (row + 0.5), { steps: 3 });
  await page.mouse.move(b.x + cs * 1.5 + cs * 0.6 * (sol[0].endsWith("R") ? 1 : -1), b.y + cs * (row + 0.5), { steps: 5 });
  await page.screenshot({ path: path.join(dir, `shot-${name}-L1-drag.png`) });
  await page.mouse.move(b.x + cs * 1.5 + cs * 1.0 * (sol[0].endsWith("R") ? 1 : -1), b.y + cs * (row + 0.5), { steps: 3 });
  await page.mouse.up(); await page.waitForTimeout(400);
  const won = await page.evaluate(() => window.__qa.state());
  if (won.screen !== "won") errors.push(name + ": real drag did not solve L1: " + JSON.stringify(won));
  await page.screenshot({ path: path.join(dir, `shot-${name}-L1-won.png`) });
  await page.evaluate(() => window.__qa.reset(11)); await page.waitForTimeout(150);
  await page.screenshot({ path: path.join(dir, `shot-${name}-L12.png`) });
  await page.evaluate(() => window.__qa.hint()); await page.waitForTimeout(100);
  await page.screenshot({ path: path.join(dir, `shot-${name}-L12-hint.png`) });
  await page.evaluate(() => window.__qa.reset(15)); await page.waitForTimeout(150);
  await page.screenshot({ path: path.join(dir, `shot-${name}-L16-pins.png`) });
  await page.evaluate(() => window.__qa.hint()); await page.waitForTimeout(100);
  await page.screenshot({ path: path.join(dir, `shot-${name}-L16-hint1.png`) });
  await page.evaluate(() => window.__qa.hint()); await page.waitForTimeout(100);
  await page.screenshot({ path: path.join(dir, `shot-${name}-L16-hint2.png`) });
  // night 3: today's board (a Sunday 6x6 par 5 via ?day=) and its win card
  await page.goto(url + "?day=2026-11-01"); await page.waitForTimeout(200);
  await page.evaluate(() => { document.getElementById("help").classList.remove("open"); window.__qa.reset(window.__qa.levels() - 1); });
  await page.waitForTimeout(150);
  await page.screenshot({ path: path.join(dir, `shot-${name}-daily.png`) });
  await page.evaluate(() => window.__qa.hint()); await page.waitForTimeout(100);
  await page.screenshot({ path: path.join(dir, `shot-${name}-daily-hint.png`) });
  await page.evaluate(() => { window.__qa.act("restart"); for (const m of window.__qa.solve()) window.__qa.act(m); }); await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(dir, `shot-${name}-daily-won.png`) });
  if (name === "phone") { await page.click("#levelBtn"); await page.waitForTimeout(100); await page.screenshot({ path: path.join(dir, `shot-${name}-picker.png`) }); }
  const ov = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1 || document.documentElement.scrollHeight > innerHeight + 1);
  if (ov) errors.push(name + ": page scrolls");
  await ctx.close();
}
await browser.close();
console.log(errors.length ? "PROBLEMS\n" + errors.join("\n") : "screens ok");
