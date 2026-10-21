// Screenshots of the six Match views and six gameplay states (H-001-v1 MC-001/002/009).
// Usage: node games/math-crush/qa/screens.mjs  → games/math-crush/qa/screens/*.png
import { createRequire } from "node:module";
import path from "node:path"; import fs from "node:fs";
import { pathToFileURL, fileURLToPath } from "node:url";
const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.resolve(here, "../../../tools/package.json"));
const { chromium } = require("playwright");
const url = pathToFileURL(path.resolve(here, "../index.html")).href;
const out = path.join(here, "screens"); fs.mkdirSync(out, { recursive: true });
const only = process.argv[2];
const sizes = [["phone", 390, 844, 1], ["small", 360, 640, 1], ["desktop", 1280, 800, 1], ["text150", 390, 844, 1.5]].filter((s) => !only || only.split(",").includes(s[0]));
const browser = await chromium.launch();
const problems = [];
for (const [name, w, h, zoom] of sizes) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: name !== "desktop" });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => problems.push(name + ": " + e.message));
  await page.goto(url); await page.waitForTimeout(300);
  if (zoom !== 1) await page.addStyleTag({ content: `html { font-size: ${zoom * 100}%; }` }); // 150 % text: every Match font size is in rem
  const snap = async (label, fn, arg) => {
    await page.evaluate(fn, arg); await page.waitForTimeout(450);
    // overlap / clipping / target-size audit of visible buttons
    const audit = await page.evaluate(() => {
      const bad = []; const root = document.getElementById("flow"); if (root.hidden) return bad;
      for (const b of root.querySelectorAll("button")) { const r = b.getBoundingClientRect(); if (!r.width) continue; if ((r.width < 44 || r.height < 44)) bad.push("small target " + (b.dataset.k || b.textContent) + ` ${Math.round(r.width)}x${Math.round(r.height)}`); if (b.scrollWidth > b.clientWidth + 2 && !b.querySelector(".lock")) bad.push("clipped " + b.dataset.k); }
      if (document.documentElement.scrollWidth > innerWidth + 1 || root.scrollWidth > root.clientWidth + 1) bad.push("horizontal overflow");
      return bad;
    });
    if (audit.length) problems.push(`${name}/${label}: ${audit.join("; ")}`);
    await page.screenshot({ path: path.join(out, `${name}-${label}.png`) });
  };
  const setBoard = (vals, sp = {}) => `(() => { const g = ui.game; g.cells = ${JSON.stringify(vals)}.map((v,i)=>({id:i,v,sp:(${JSON.stringify(sp)})[i]||null})); })()`;
  await snap("v1-home", () => { __qa.open("home"); });
  await snap("v2-levels", () => { progress.match.unlocked = 5; progress.matchV2.stars = [3, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0]; __qa.open("levels"); });
  await snap("v3-intro", () => { progress.coach2 = {}; __qa.open("intro", 3); });
  await snap("s1-idle", () => { __qa.reset(6); });
  await snap("s2-selecting", () => { const g = ui.game; g.cells = [1,2,3,1,4, 5,5,5,5,5, 9,9,9,9,9, 2,8,3,7,4, 6,1,9,1,9].map((v, i) => ({ id: i, v, sp: i === 1 ? "stripe" : i === 21 ? "wrapped" : null })); ui.chain = [0, 1, 2]; render(); });
  await snap("s3-exact-reward-blast", () => { ui.chain = [0, 1, 2, 3]; render(); }); // 1+2+3+1=7? set target 7
  await snap("s4-over", () => { ui.chain = [0, 1, 2, 3, 4, 9]; render(); });
  await snap("s5-after-clear", () => { ui.chain = []; ui.game.target = 7; mCommit([0, 1, 2, 3]); });
  await snap("s6-wrong", () => { mCommit([10, 15]); });
  await snap("v4-pause", () => { mOpenModal("pause", "pause"); render(); });
  await snap("v5-success", () => { __qa.reset(0); for (const a of __qa.solve()) __qa.act(a); });
  await snap("v6-retry", () => { __qa.reset(4); for (let k = 0; k < 6; k++) __qa.act({ chain: [0, 5] }); });
  await snap("v7-confirm", () => { __qa.reset(0); __qa.act({ chain: [0, 5] }); ui.modal = "confirm-restart"; render(); });
  await snap("v8-tapmode", () => { ui.modal = null; progress.settings.tap = true; ui.chain = [6, 7]; render(); progress.settings.tap = false; });
  await snap("v9-speed-success", () => { progress.settings.speed = true; __qa.reset(0); __qa.act({ chain: [0, 5] }); __qa.tick(20000); for (const a of __qa.solve()) __qa.act(a); progress.settings.speed = false; });
  await ctx.close();
}
await browser.close();
console.log(problems.length ? "PROBLEMS:\n" + problems.join("\n") : "no layout problems found");
