#!/usr/bin/env node
// Game Studio automated playtest.
// Usage: node tools/qa/playtest.mjs games/<slug>/index.html [--out games/<slug>/qa] [--steps 400]
//
// Checks a single-file HTML game against the studio's build contract:
//   1. Static: file size, allowed script hosts, banned APIs (alert/confirm/prompt/print).
//   2. Boot: loads at desktop and phone size with no console errors or uncaught exceptions.
//   3. QA hook: window.__qa exists and exposes state()/actions()/act().
//   4. Fuzz: plays random valid actions; the game must never throw or reach an invalid state.
//   5. Completability: if __qa.solve() exists, every level is solved by its own solution.
// Writes report.json and screenshots to the out dir. Exit code 1 when any check fails.

import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
const opt = (name, def) => {
  const i = args.indexOf("--" + name);
  return i >= 0 ? args[i + 1] : def;
};
if (!file) {
  console.error("usage: playtest.mjs <game.html> [--out dir] [--steps n]");
  process.exit(2);
}
const gamePath = path.resolve(file);
const outDir = path.resolve(opt("out", path.join(path.dirname(gamePath), "qa")));
const fuzzSteps = Number(opt("steps", 400));
fs.mkdirSync(outDir, { recursive: true });

const report = { game: path.relative(process.cwd(), gamePath), at: new Date().toISOString(), checks: [], screenshots: [] };
const check = (name, ok, detail = "") => {
  report.checks.push({ name, ok: !!ok, detail: String(detail).slice(0, 2000) });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + String(detail).slice(0, 300) : ""}`);
};

// ---------- 1. static checks ----------
const html = fs.readFileSync(gamePath, "utf8");
const sizeKb = Math.round(Buffer.byteLength(html) / 1024);
check("file under 2 MB", sizeKb < 2048, `${sizeKb} KB`);
const ALLOWED = ["https://cdnjs.cloudflare.com/", "https://cdn.jsdelivr.net/npm/", "https://unpkg.com/", "https://fonts.googleapis.com/", "https://fonts.gstatic.com/"];
const urls = [...html.matchAll(/(?:src|href)\s*=\s*["'](https?:\/\/[^"']+)["']/g)].map((m) => m[1]);
// links (<a href>) to other sites are fine; only flag script/link/img loads
const blockedResources = [...html.matchAll(/<(script|link|img|audio|video|source|iframe)[^>]+(?:src|href)\s*=\s*["'](https?:\/\/[^"']+)["']/gi)]
  .map((m) => m[2]).filter((u) => !ALLOWED.some((a) => u.startsWith(a)));
check("external resources only from allowed CDNs", blockedResources.length === 0, blockedResources.join(", "));
check("library versions pinned", !urls.some((u) => /@latest|\/latest\//.test(u)), urls.filter((u) => /latest/.test(u)).join(", "));
const banned = [...html.matchAll(/\b(alert|confirm|prompt)\s*\(|window\.print\s*\(|<iframe/g)].map((m) => m[0]);
check("no alert/confirm/prompt/print/iframe", banned.length === 0, [...new Set(banned)].join(", "));
check("has a <title>", /<title>[^<]{2,}<\/title>/i.test(html));
check("declares window.__qa", /__qa/.test(html));

// ---------- 2-5. runtime ----------
const browser = await chromium.launch();
const viewports = [
  { name: "desktop", width: 1280, height: 800, isMobile: false, hasTouch: false },
  { name: "phone", width: 390, height: 844, isMobile: true, hasTouch: true },
];

for (const vp of viewports) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.isMobile, hasTouch: vp.hasTouch, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push("console: " + m.text()); });
  page.on("pageerror", (e) => errors.push("exception: " + (e.stack || e.message)));
  page.on("dialog", (d) => { errors.push("dialog opened: " + d.type()); d.dismiss().catch(() => {}); });
  page.on("requestfailed", (r) => {
    const u = r.url();
    if (!u.startsWith("file:") && !u.startsWith("data:")) errors.push("request failed: " + u);
  });

  await page.goto(pathToFileURL(gamePath).href, { waitUntil: "load" });
  await page.waitForTimeout(800);
  const shot = async (label) => {
    const p = path.join(outDir, `${vp.name}-${label}.png`);
    await page.screenshot({ path: p });
    report.screenshots.push(path.relative(process.cwd(), p));
  };
  await shot("01-load");

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  check(`[${vp.name}] no horizontal scroll`, !overflow);

  const hook = await page.evaluate(() => {
    const q = window.__qa;
    if (!q) return null;
    return { state: typeof q.state, actions: typeof q.actions, act: typeof q.act, solve: typeof q.solve, levels: typeof q.levels, reset: typeof q.reset };
  });
  check(`[${vp.name}] __qa hook present`, hook && hook.state === "function" && hook.actions === "function" && hook.act === "function", JSON.stringify(hook));
  if (!hook || hook.state !== "function") {
    check(`[${vp.name}] boots without errors`, errors.length === 0, errors.join("\n"));
    await ctx.close();
    continue;
  }

  const st0 = await page.evaluate(() => window.__qa.state());
  report[`${vp.name}_initialState`] = st0;
  check(`[${vp.name}] state() is serializable with a screen field`, st0 && typeof st0.screen === "string", JSON.stringify(st0).slice(0, 300));

  // fuzz with random valid actions (desktop only; phone just checks boot + a short run)
  const steps = vp.name === "desktop" ? fuzzSteps : Math.min(60, fuzzSteps);
  const fuzz = await page.evaluate(async (n) => {
    const q = window.__qa;
    const seen = new Set();
    let resets = 0;
    for (let i = 0; i < n; i++) {
      let acts;
      try { acts = q.actions(); } catch (e) { return { ok: false, step: i, err: "actions() threw: " + e.message }; }
      if (!Array.isArray(acts)) return { ok: false, step: i, err: "actions() did not return an array" };
      if (acts.length === 0) {
        if (typeof q.reset === "function") { q.reset(); resets++; continue; }
        break;
      }
      const a = acts[Math.floor(Math.random() * acts.length)];
      try { await q.act(a); } catch (e) { return { ok: false, step: i, err: "act(" + JSON.stringify(a) + ") threw: " + e.message }; }
      let s;
      try { s = q.state(); JSON.stringify(s); } catch (e) { return { ok: false, step: i, err: "state() failed after act: " + e.message }; }
      seen.add(s.screen);
      if (["won", "lost"].includes(s.screen) && typeof q.reset === "function") { q.reset(); resets++; }
    }
    return { ok: true, screensSeen: [...seen], resets };
  }, steps);
  check(`[${vp.name}] survives ${steps} random actions`, fuzz.ok, fuzz.ok ? `screens seen: ${fuzz.screensSeen.join(", ")}; resets: ${fuzz.resets}` : `step ${fuzz.step}: ${fuzz.err}`);
  await page.waitForTimeout(300);
  await shot("02-after-play");

  if (vp.name === "desktop" && hook.solve === "function") {
    const levels = hook.levels === "function" ? await page.evaluate(() => window.__qa.levels()) : 1;
    const results = await page.evaluate(async (count) => {
      const q = window.__qa;
      const out = [];
      for (let lv = 0; lv < count; lv++) {
        try {
          if (typeof q.reset === "function") q.reset(lv);
          const seq = await q.solve();
          if (!Array.isArray(seq)) { out.push({ lv, ok: false, err: "solve() did not return an action list" }); continue; }
          for (const a of seq) await q.act(a);
          const s = q.state();
          out.push({ lv, ok: s.screen === "won", moves: seq.length, screen: s.screen });
        } catch (e) { out.push({ lv, ok: false, err: e.message }); }
      }
      return out;
    }, levels);
    const failed = results.filter((r) => !r.ok);
    check(`every level completable via solve() (${levels} levels)`, failed.length === 0, failed.length ? JSON.stringify(failed).slice(0, 600) : results.map((r) => `L${r.lv + 1}:${r.moves}`).join(" "));
    report.solveResults = results;
    await shot("03-solved");
  }

  check(`[${vp.name}] no console errors or exceptions`, errors.length === 0, errors.join("\n"));
  await ctx.close();
}

await browser.close();
report.passed = report.checks.every((c) => c.ok);
fs.writeFileSync(path.join(outDir, "report.json"), JSON.stringify(report, null, 2));
console.log(`\n${report.passed ? "ALL CHECKS PASSED" : "SOME CHECKS FAILED"} — report: ${path.relative(process.cwd(), path.join(outDir, "report.json"))}`);
process.exit(report.passed ? 0 : 1);
