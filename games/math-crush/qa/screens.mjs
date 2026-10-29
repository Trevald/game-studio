// Screenshots of every H-003-v1 state (MC-020..MC-028: map, journey levels, results, motion frames) plus retained Classic states at phone, small phone, desktop and 150 % text, with a
// target-size / clipping / overflow audit. Usage: node games/math-crush/qa/screens.mjs  → games/math-crush/qa/screens/*.jpg
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
      for (const b of root.querySelectorAll("button")) { const r = b.getBoundingClientRect(); if (!r.width) continue; if ((r.width < 44 || r.height < 44)) bad.push("small target " + (b.dataset.k || b.textContent) + ` ${Math.round(r.width)}x${Math.round(r.height)}`); if (b.scrollWidth > b.clientWidth + 2 && !b.classList.contains("mnode")) bad.push("clipped " + b.dataset.k); }
      if (document.documentElement.scrollWidth > innerWidth + 1 || root.scrollWidth > root.clientWidth + 1) bad.push("horizontal overflow");
      return bad;
    });
    if (audit.length) problems.push(`${name}/${label}: ${audit.join("; ")}`);
    await page.screenshot({ path: path.join(out, `${name}-${label}.jpg`), type: "jpeg", quality: 55 });
  };
  const setBoard = (vals, sp = {}) => `(() => { const g = ui.game; g.cells = ${JSON.stringify(vals)}.map((v,i)=>({id:i,v,sp:(${JSON.stringify(sp)})[i]||null})); })()`;
  await snap("v01-home", () => { localStorage.clear(); progress.settings.motion = "full"; __qa.open("home"); });
  await snap("v02-classic-map", () => { progress.match.unlocked = 5; for (let k = 0; k < 4; k++) setRec(k, { stars: [3, 2, 1, 1][k], best: 500, wins: 1 }); ui.mapScroll = {}; __qa.open("levels", "classic"); });
  await snap("v03-journey-map-start", () => { ui.mapScroll = {}; __qa.open("levels", "journey"); });
  await snap("v04-journey-map-ch2-reveal", () => { JN().unlocked = 6; for (let k = 0; k < 5; k++) setRecC("journey", k, { stars: 3 - (k % 2), best: 900, wins: 1 }); ui.mapScroll = {}; __qa.open("levels", "journey"); });
  await snap("v05-journey-map-after-reveal", () => { render(); });
  await snap("v06-journey-map-ch3", () => { JN().unlocked = 11; for (let k = 0; k < 10; k++) setRecC("journey", k, { stars: 3, best: 900, wins: 1 }); progress.mapUi.journey.revealed[2] = true; ui.mapScroll = {}; __qa.open("levels", "journey"); });
  await snap("v07-home-journey-progress", () => { __qa.open("home"); });
  await snap("j01-L1-first", () => { JN().lessons = {}; __qa.reset(12); });
  await snap("j02-L3-hourglass", () => { __qa.reset(14); });
  await snap("j03-L4-ring-stripe-preview", () => { __qa.reset(15); ui.chain = [11, 10]; render(); });
  await snap("j04-L5-jelly", () => { __qa.reset(16); });
  await snap("j05-L5-jelly-preview", () => { ui.chain = [12, 13]; render(); });
  await snap("j06-L8-sequence", () => { __qa.reset(19); });
  await snap("j07-L8-after-first", () => { ui.chain = []; __qa.act({ chain: [0, 1] }); __qa.flush(); });
  await snap("j08-L8-final-target", () => { __qa.act({ chain: M.shortest(ui.game) }); __qa.flush(); });
  await snap("j09-L10-four-targets", () => { __qa.reset(21); });
  await snap("j10-L11-multiply", () => { __qa.reset(22); });
  await snap("j11-L11-multiply-select", () => { ui.chain = [0, 1, 2]; render(); });
  await snap("j12-L11-wrong-free", () => { ui.chain = []; mCommit([3, 4]); });
  await snap("j13-L12-product-sequence", () => { __qa.reset(23); });
  await snap("j14-help-L10", () => { __qa.reset(21); mButton("help"); });
  await snap("w01-success", () => { __qa.reset(0); for (const a of __qa.solve()) __qa.act(a); });
  await snap("w02-jelly-cleared", () => { __qa.reset(16); for (const a of __qa.solve()) __qa.act(a); });
  await snap("w03-L10-next-multiplication", () => { __qa.reset(21); for (const a of __qa.solve()) __qa.act(a); });
  await snap("w04-failure-jelly", () => { __qa.reset(16); for (let k = 0; k < 7; k++) __qa.act({ chain: [0, 5] }); });
  await snap("w05-final-journey-win", () => { __qa.reset(23); for (const a of __qa.solve()) __qa.act(a); });
  await snap("w06-L8-win-old-rush-best", () => { setRec(7, { stars: 3, best: 0, wins: 1, rushBest: 1572 }); __qa.reset(7); for (const a of __qa.solve()) __qa.act(a); });
  await snap("c01-L1-classic", () => { V3().lessons = {}; __qa.reset(0); });
  await snap("c02-combo-preview", () => { __qa.reset(6); const g = ui.game; g.cells[12].sp = "stripe"; g.cells[13].sp = "wrapped"; ui.chain = [12, 13]; render(); });
  await snap("p01-pause", () => { __qa.reset(2); mOpenModal("pause", "pause"); render(); });
  await snap("p02-settings", () => { ui.modal = "settings"; render(); });
  await snap("p03-tapmode", () => { ui.modal = null; progress.settings.tap = true; ui.chain = [6, 7]; render(); progress.settings.tap = false; });
  await snap("p04-restore-old", () => { ui.chain = []; ui.restoreOld = true; ui.restoreLi = 4; ui.modal = "restore-error"; render(); });
  // MC-025 frames: anticipation / impact / settle of a stripe clear and of a sequence target change (normal speed)
  if (name === "phone") {
    for (const [lbl, setup, chain] of [["stripe", () => __qa.reset(15), [11, 10]], ["target", () => __qa.reset(19), [0, 1]], ["jelly", () => __qa.reset(16), [12, 13]]]) {
      await page.evaluate(setup); await page.evaluate(() => { ui.modal = null; ui.busyUntil = 0; render(); });
      await page.evaluate((c) => mCommit(c), chain);
      for (const ms of [60, 220, 420, 700]) { await page.waitForTimeout(ms === 60 ? 60 : ms === 220 ? 160 : ms === 420 ? 200 : 280); await page.screenshot({ path: path.join(out, `${name}-m-${lbl}-${ms}ms.jpg`), type: "jpeg", quality: 55 }); }
    }
  }
  await ctx.close();
}
await browser.close();
console.log(problems.length ? "PROBLEMS:\n" + problems.join("\n") : "no layout problems found");
