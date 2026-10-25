// Screenshots of every H-002-v1 state (MC-010..MC-019) at phone, small phone, desktop and 150 % text, with a
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
      for (const b of root.querySelectorAll("button")) { const r = b.getBoundingClientRect(); if (!r.width) continue; if ((r.width < 44 || r.height < 44)) bad.push("small target " + (b.dataset.k || b.textContent) + ` ${Math.round(r.width)}x${Math.round(r.height)}`); if (b.scrollWidth > b.clientWidth + 2 && !b.querySelector(".lock")) bad.push("clipped " + b.dataset.k); }
      if (document.documentElement.scrollWidth > innerWidth + 1 || root.scrollWidth > root.clientWidth + 1) bad.push("horizontal overflow");
      return bad;
    });
    if (audit.length) problems.push(`${name}/${label}: ${audit.join("; ")}`);
    await page.screenshot({ path: path.join(out, `${name}-${label}.jpg`), type: "jpeg", quality: 55 });
  };
  const setBoard = (vals, sp = {}) => `(() => { const g = ui.game; g.cells = ${JSON.stringify(vals)}.map((v,i)=>({id:i,v,sp:(${JSON.stringify(sp)})[i]||null})); })()`;
  await snap("v01-home", () => { localStorage.clear(); __qa.open("home"); });
  await snap("v02-levels", () => { progress.match.unlocked = 5; for (let k = 0; k < 4; k++) setRec(k, { stars: [3, 2, 1, 1][k], best: 500, bestTimeMs: 0, timeDetails: null, wins: 1 }); __qa.open("levels"); });
  await snap("c01-L1-first-move", () => { V3().lessons = {}; __qa.reset(0); });
  await snap("c02-L1-too-high", () => { ui.chain = [0, 1, 2]; render(); });
  await snap("c03-L1-free-try-again", () => { ui.chain = []; mCommit([2, 3]); });
  await snap("c04-L2-longer-chain", () => { __qa.reset(1); });
  await snap("c05-L4-stripe-cue", () => { __qa.reset(3); });
  await snap("c06-L4-stripe-preview", () => { ui.chain = [12, 13]; render(); });
  await snap("c07-L4-charged-wrong", () => { ui.chain = []; mCommit([2, 3]); });
  await snap("c08-L7-wrapped-cue", () => { __qa.reset(6); });
  await snap("c09-combo-preview", () => { __qa.reset(6); const g = ui.game; g.cells[12].sp = "stripe"; g.cells[13].sp = "wrapped"; ui.chain = [12, 13]; render(); });
  await snap("c10-combo-after", () => { const ch = ui.chain.slice(); ui.chain = []; mCommit(ch); });
  await snap("h01-L6-hammer-cue", () => { V3().lessons["l6-hammer"] = false; __qa.reset(5); ui.idleMs = 9000; render(); });
  await snap("h02-hammer-pick", () => { mButton("hammer"); });
  await snap("h03-hammer-confirm", () => { pickTarget(7); render(); });
  await snap("h04-hammer-cancelled", () => { mButton("tool-cancel"); });
  await snap("r01-L8-rush-charge", () => { V3().lessons = {}; __qa.reset(7); });
  await snap("r02-rush-active", () => { const ch = M.allChains(ui.game, 400).find((c) => c.length >= 3); __qa.act({ chain: ch }); ui.busyUntil = 0; });
  await snap("r03-rush-last-use", () => { ui.rushCue = false; for (let k = 0; k < 2; k++) { const ch = M.shortest(ui.game); __qa.act({ chain: ch }); } });
  await snap("r04-rush-expired", () => { if (ui.game.status === "playing") __qa.act({ chain: M.shortest(ui.game) }); });
  await snap("w01-success", () => { __qa.reset(0); for (const a of __qa.solve()) __qa.act(a); });
  await snap("w02-timed-play", () => { nextSticker(); nextSticker(); mButton("speed"); __qa.act(__qa.solve()[0]); __qa.tick(23000); });
  await snap("w03-timed-win", () => { for (const a of __qa.solve()) __qa.act(a); });
  await snap("w04-failure-undo", () => { __qa.reset(4); for (let k = 0; k < 6; k++) __qa.act({ chain: [0, 5] }); });
  await snap("w05-final-level-win", () => { __qa.reset(11); for (const a of __qa.solve()) __qa.act(a); nextSticker(); nextSticker(); nextSticker(); });
  await snap("b01-book", () => { __qa.open("home"); mButton("book"); mButton("stk-mix-master"); });
  await snap("b02-book-earned", () => { mButton("stk-sweet-start"); });
  await snap("b03-book-badge", () => { mButton("set-badge"); });
  await snap("p01-pause", () => { mButton("book-back"); __qa.reset(2); mOpenModal("pause", "pause"); render(); });
  await snap("p02-help", () => { mButton("help"); });
  await snap("p03-confirm", () => { ui.modal = null; __qa.act({ chain: [0, 5] }); ui.modal = "confirm-restart"; render(); });
  await snap("p04-tapmode", () => { ui.modal = null; progress.settings.tap = true; ui.chain = [6, 7]; render(); progress.settings.tap = false; });
  await snap("p05-sticker-toast", () => { ui.stickerQueue = ["lucky-seven"]; nextSticker(); });
  await snap("p06-old-attempt-offer", () => { clearTimeout(stickerTimer); ui.stickerNow = null; V3().offerStart = 5; ui.game = null; V3().active = null; __qa.open("home"); });
  await ctx.close();
}
await browser.close();
console.log(problems.length ? "PROBLEMS:\n" + problems.join("\n") : "no layout problems found");
