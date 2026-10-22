// H-001-v1 screen matrix: node games/mathly-trails/qa/screens.mjs [outDir]
// Captures every fixture state at each viewport, measures geometry, and writes screens.json.
import { createRequire } from "module";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.join(here, "../../../tools/package.json"));
const { chromium } = require("playwright");
const out = process.argv[2] || path.join(here, "screens");
fs.mkdirSync(out, { recursive: true });
const url = "file://" + path.join(here, "../index.html");

const F = { // H-001-v1 data/ui-fixtures.json, mapped onto shipped boards with the same cards
  empty: [8, []], partial: [8, ["n5", "+", "n2"]], selected: [8, ["n5", "+", "n2"], 2], early: [8, ["n1", "+", "n2", "*", "n3"]],
  incomplete: [8, ["n5", "+"]], invalid: [8, ["n5", "/", "(", "n2", "-", "n3", ")"]],
  full: [9, ["n1", "+", "(", "n2", "*", "n3", ")", "-", "n4", "-", "n5"]], // fixture target 16 vs board 15.5: "/" → "-" keeps it missed
  long: [9, ["(", "(", "(", "(", "n1", "+", "(", "n2", "*", "n3", ")", "-", "n4", "-", "n5", ")", ")", ")", ")"]],
  solved: [8, ["(", "n5", "+", "n2", ")", "*", "n3", "+", "n4", "+", "n1"]],
};
const VIEWS = { "320x568": [320, 568], "375x667": [375, 667], "390x844": [390, 844], "1280x800": [1280, 800], "568x320": [568, 320], "844x390": [844, 390] };

const browser = await chromium.launch();
const results = [];
for (const [vn, [w, h]] of Object.entries(VIEWS)) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: w < 900 });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(url);
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
  for (const [fn, [li, toks, sel]] of Object.entries(F)) {
    await page.evaluate(([li, toks]) => {
      __qa.reset(li);
      toks.forEach((t, i) => __qa.act(/^n\d$/.test(t) ? { t: "card", id: t, at: i } : { t: "op", op: t, at: i }));
    }, [li, toks]);
    if (sel != null) await page.evaluate((s) => { __qa._ui.game.sel = s; __qa._ui.game.caret = s + 1; __qa._ui.followCaret = true; }, sel);
    await page.evaluate(() => window.dispatchEvent(new Event("resize")));
    await page.waitForTimeout(60);
    const shots = [fn];
    if (fn === "long") shots.push("long-p2");
    for (const s of shots) {
      if (s === "long-p2") { await page.evaluate(() => __qa.act("pageNext")); }
      if (s === "long") await page.evaluate(() => { while (__qa.state().layout.page > 0) __qa.act("pagePrev"); });
      await page.waitForTimeout(30);
      const m = await page.evaluate(() => {
        const q = (s) => document.querySelector(s), r = (el) => el && el.getBoundingClientRect();
        const toks = [...document.querySelectorAll("#cells .tok, #tray > *, #palette button, .actions button, .pagebtn:not(.off), .strip button, .circle")].filter((e) => e.offsetParent);
        const small = toks.map(r).filter((b) => b.width < 43.5 || b.height < 43.5).length;
        const st = __qa.state();
        return { state: st.result && st.result.state, layout: st.layout, trayTop: Math.round(r(q("#tray")).top), wsH: Math.round(r(q("#well")).height),
          hscroll: document.documentElement.scrollWidth > innerWidth, vscroll: document.documentElement.scrollHeight > innerHeight + 1,
          under44: small, status: q("#statusTxt").textContent, label: q("#pLabel").textContent, result: q("#pResult").textContent,
          clipped: [...document.querySelectorAll("#sPlay button")].filter((e) => e.offsetParent && (r(e).right > innerWidth + 0.5 || r(e).left < -0.5)).length };
      });
      await page.screenshot({ path: path.join(out, `${vn}-${s}.png`) });
      results.push({ view: vn, fixture: s, ...m });
    }
  }
  // review, completion
  await page.evaluate(() => { __qa.reset(8); __qa.solve().forEach((a) => __qa.act(a)); });
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(out, `${vn}-complete.png`) });
  await page.evaluate(() => __qa.act("review")); await page.waitForTimeout(50);
  await page.screenshot({ path: path.join(out, `${vn}-review.png`) });
  results.push({ view: vn, fixture: "review", screen: await page.evaluate(() => __qa.state().screen) });
  if (errors.length) results.push({ view: vn, errors });
  await ctx.close();
}
await browser.close();
fs.writeFileSync(path.join(out, "screens.json"), JSON.stringify(results, null, 1));
for (const r of results) console.log(JSON.stringify(r));
