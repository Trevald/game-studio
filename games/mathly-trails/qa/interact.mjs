// H-001-v1 checklist automation: node games/mathly-trails/qa/interact.mjs [shotDir]
// Real pointer/keyboard input where it matters; prints PASS/FAIL lines and exits 1 on any FAIL.
import { createRequire } from "module";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.join(here, "../../..");
const require = createRequire(path.join(repo, "tools/package.json"));
const { chromium } = require("playwright");
const url = "file://" + path.join(here, "../index.html");
const shots = process.argv[2] || path.join(here, "screens");
fs.mkdirSync(shots, { recursive: true });
const packet = path.join(repo, "design-studio/games/mathly/handovers/H-001-v1");
let fails = 0;
const ok = (name, cond, info = "") => { console.log((cond ? "PASS  " : "FAIL  ") + name + (info ? "  — " + info : "")); if (!cond) fails++; };

const browser = await chromium.launch();
async function open(w, h, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: !!opts.touch, ...opts.ctx });
  if (opts.blockTexture) await ctx.route("**/felt-jade-v1.webp", (r) => r.abort());
  if (opts.init) await ctx.addInitScript(opts.init);
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error" && !/felt-jade-v1|ERR_FAILED/.test(m.text())) errors.push(m.text()); });
  await page.goto(url);
  return { ctx, page, errors };
}
const st = (page) => page.evaluate(() => __qa.state());
const setToks = (page, li, toks) => page.evaluate(([li, toks]) => { __qa.reset(li); toks.forEach((t, i) => __qa.act(/^n\d$/.test(t) ? { t: "card", id: t, at: i } : { t: "op", op: t, at: i })); }, [li, toks]);

// ---------- 1. engine cases against the real engine ----------
{
  const { ctx, page } = await open(390, 844);
  const cases = JSON.parse(fs.readFileSync(path.join(packet, "data/engine-cases.json"))).cases;
  const res = await page.evaluate((cases) => {
    const { analyse, rFmt, rParse } = __qa._engine;
    return cases.map((c) => {
      // expression string → tokens; digits become cards valued by the digit; unsupported chars are reported as such
      const toks = [], vals = {}; let n = 0, bad = null;
      for (const ch of c.expression.replace(/\s+/g, (m) => (m ? " " : ""))) {
        if (ch === " ") { toks.push({ sp: 1 }); continue; }
        if (/\d/.test(ch)) { const id = "c" + n++; vals[id] = +ch; toks.push({ k: "n", id }); }
        else if ("+-*/()".includes(ch)) toks.push({ k: "o", v: ch });
        else bad = ch;
      }
      const t = toks.filter((x) => !x.sp);
      if (bad) return { c, got: "not representable (" + bad + ")", pass: c.state === "invalid" };
      const r = analyse(t, (id) => vals[id]);
      let pass = r.state === c.state;
      if (c.exact) pass = pass && rFmt(r.value, true) === rFmt(rParse(c.exact), true);
      return { c, got: r.state + (r.value ? " " + rFmt(r.value, true) : "") + (r.reason ? " (" + r.reason + ")" : ""), pass };
    });
  }, cases);
  for (const r of res) ok(`engine case "${r.c.expression}" → ${r.c.state}${r.c.exact ? " " + r.c.exact : ""}`, r.pass, r.got);
  // UI fixtures (accept/reject) through the real edit functions
  const fx = JSON.parse(fs.readFileSync(path.join(packet, "data/ui-fixtures.json"))).fixtures;
  const fr = await page.evaluate((fx) => {
    const { R, E, analyse, rFmt, rParse } = __qa._engine;
    return fx.map((f) => {
      const g = { board: { cards: f.cards, target: rParse(f.target) }, tokens: [], caret: 0, sel: -1, hist: [], solved: false };
      g.board.cards = f.cards;
      let rejected = false;
      const used = new Set();
      const toks = [];
      for (const t of f.tokens) {
        if (/^n\d$/.test(t)) { if (used.has(t) || !f.cards.some((c) => c.id === t)) { rejected = true; break; } used.add(t); toks.push({ k: "n", id: t }); }
        else toks.push({ k: "o", v: t });
      }
      if (rejected) return { id: f.id, pass: f.expectedState === "rejected", got: "rejected" };
      const r = analyse(toks, (id) => f.cards.find((c) => c.id === id).value);
      const all = used.size === 5, match = r.state === "valid" && rFmt(r.value, true) === rFmt(rParse(f.target), true);
      const state = r.state !== "valid" ? r.state : match && all ? "solved" : match ? "early" : all ? "missed" : "valid";
      const val = r.value ? rFmt(r.value, true) : null;
      const exp = f.expectedValue == null ? null : rFmt(rParse(f.expectedValue), true);
      return { id: f.id, pass: state === f.expectedState && val === exp, got: state + " " + val };
    });
  }, fx);
  for (const r of fr) ok(`ui fixture ${r.id}`, r.pass, r.got);
  // every shipped board: independent solver agrees with verification.json
  const ver = JSON.parse(fs.readFileSync(path.join(packet, "data/verification.json")));
  const solv = await page.evaluate(() => Array.from({ length: __qa.levels() }, (_, i) => { const b = __qa._engine.boardOf(i); return { id: b.id, found: !!__qa._engine.solveBoard(b) }; }));
  ok("independent solver finds a solution for all 12 boards", solv.every((s) => s.found) && solv.length === 12, solv.map((s) => s.id).join(" "));
  ok("verification.json present for comparison", !!ver);
  await ctx.close();
}

// ---------- 3. capacity / paging / boundaries (320×568: 6×2 = 12 per page) ----------
{
  const { ctx, page, errors } = await open(320, 568, { touch: true });
  await page.evaluate(() => __qa.reset(9));
  const s0 = await st(page);
  const N = s0.layout.perPage;
  ok("320×568 capacity is 6×2 = 12", N === 12, JSON.stringify(s0.layout));
  for (const count of [N - 1, N, N + 1, 2 * N + 1]) {
    const toks = Array.from({ length: count }, () => "(");
    await setToks(page, 9, toks);
    const s = await st(page);
    const expPages = Math.max(1, Math.ceil(count / N));
    ok(`${count} tokens → ${expPages} page(s), caret page follows insertion`, s.layout.pages === expPages && s.layout.page === expPages - 1, JSON.stringify(s.layout));
  }
  // remove last token on last page clamps (13 → 12 tokens: back to 1 page)
  await setToks(page, 9, Array.from({ length: N + 1 }, () => "("));
  await page.evaluate(() => __qa.act({ t: "remove", at: 12 }));
  let s = await st(page);
  ok("removing the only token on the last page clamps to page 1 of 1", s.layout.pages === 1 && s.layout.page === 0, JSON.stringify(s.layout));
  // boundary: select the first token of page 2 with a real tap, Remove, one undo entry restores
  await setToks(page, 9, ["(", "(", "(", "(", "n1", "+", "(", "n2", "*", "n3", ")", "-", "n4", "-", "n5", ")", ")", ")", ")"]);
  s = await st(page);
  ok("19-token fixture splits 12 + 7", s.layout.pages === 2 && s.layout.page === 1);
  const depth0 = s.undoDepth;
  await page.tap("#cells .tok[data-i='12']");
  s = await st(page);
  ok("tap first token of page 2 selects index 12", s.sel === 12 && (await page.textContent("#statusTxt")).startsWith("Selected: "));
  await page.tap("#eRemove");
  s = await st(page);
  ok("Remove deletes one token, returns card n4 to its slot, one undo entry", s.tokens.length === 18 && !s.tokens.includes("n4") && s.undoDepth === depth0 + 1, s.tokens.join(""));
  await page.tap("#bUndo");
  s = await st(page);
  ok("Undo restores token and its caret", s.tokens.length === 19 && s.tokens[12] === "n4" && s.undoDepth === depth0 && s.caret === 13, "caret " + s.caret);
  // selection off-page → "Go to selection"
  await page.tap("#cells .tok[data-i='13']");
  await page.tap("#pgPrev");
  ok("browsing away from the selection shows Go to selection (no hidden delete)", await page.isVisible("#eGo") && !(await page.isVisible("#eRemove")));
  { const b4 = (await st(page)).tokens.join(""); await page.tap("#palette button:nth-child(3)"); const s3 = await st(page);
    ok("palette tap while the selection is off-page edits nothing and returns to it", s3.tokens.join("") === b4 && s3.layout.page === 1, s3.tokens.join(""));
    await page.tap("#pgPrev"); await page.focus("#well"); await page.keyboard.press("Delete");
    ok("Delete while the selection is off-page deletes nothing", (await st(page)).tokens.join("") === b4); await page.tap("#pgPrev"); }
  await page.tap("#eGo");
  s = await st(page);
  ok("Go to selection returns to page 2 with selection kept", s.layout.page === 1 && s.sel === 13);
  await page.tap("#eDone");
  // caret at page end then insert: follows onto next page
  await setToks(page, 9, Array.from({ length: 11 }, () => "("));
  await page.evaluate(() => __qa.act({ t: "op", op: ")", at: 11 })); // 12 tokens, caret 12 → page 1 end
  s = await st(page);
  ok("caret after token 12 shows at end of page 1 (shared boundary)", s.layout.page === 0 && s.caret === 12 && s.layout.pages === 1);
  await page.tap("#palette button:nth-child(1)");
  s = await st(page);
  ok("inserting at page end moves to the new page", s.layout.page === 1 && s.layout.pages === 2 && s.tokens.length === 13);
  // duplicate 3s: insert both, distinct IDs and labels
  await page.evaluate(() => __qa.reset(8));
  const labels = await page.$$eval("#tray .tok", (els) => els.map((e) => e.getAttribute("aria-label")));
  ok("duplicate 3s have distinct accessible labels", new Set(labels).size === 5, labels.join(" | "));
  await page.tap("#tray > :nth-child(2)"); await page.tap("#palette button:nth-child(1)"); await page.tap("#tray > :nth-child(3)");
  s = await st(page);
  ok("tapping both 3s inserts n2 and n3, both slots Used", s.tokens.join(",") === "n2,+,n3" && (await page.$$eval("#tray .ghost", (e) => e.length)) === 2);
  // drag to tray removes; drag onto palette cancels
  const box = async (sel) => { const b = await page.locator(sel).boundingBox(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; };
  async function mouseDrag(from, to) { const a = await box(from), b = await box(to); await page.mouse.move(a.x, a.y); await page.mouse.down(); await page.mouse.move(a.x + 12, a.y + 4, { steps: 3 }); await page.mouse.move(b.x, b.y, { steps: 8 }); await page.mouse.up(); }
  await mouseDrag("#cells .tok[data-i='0']", "#palette button:nth-child(3)");
  s = await st(page);
  ok("drop on operator palette cancels (no delete, no undo entry)", s.tokens.join(",") === "n2,+,n3" && s.undoDepth === 3);
  await mouseDrag("#cells .tok[data-i='0']", "#tray > :nth-child(1)");
  s = await st(page);
  ok("drag token onto tray removes it (one undo entry)", s.tokens.join(",") === "+,n3" && s.undoDepth === 4);
  await page.evaluate(() => __qa.act("undo"));
  { const a = await box("#cells .tok[data-i='0']"); await page.mouse.move(a.x, a.y); await page.mouse.down(); await page.mouse.move(a.x + 14, a.y + 6, { steps: 4 }); await page.mouse.up(); } // dropped back on its own place
  s = await st(page);
  ok("drag onto its own/adjacent boundary is a no-op", s.tokens.join(",") === "n2,+,n3" && s.undoDepth === 3, s.tokens.join(","));
  await mouseDrag("#tray > :nth-child(5)", "#cells .tok[data-i='0']");
  s = await st(page);
  ok("drag a source card into the expression inserts it at the nearest boundary", s.tokens[0] === "n5" || s.tokens[1] === "n5", s.tokens.join(","));
  // pointercancel mid-drag + resize mid-drag preserve data
  const before = (await st(page)).tokens.join(",");
  { const a = await box("#cells .tok[data-i='0']"); await page.mouse.move(a.x, a.y); await page.mouse.down(); await page.mouse.move(a.x + 30, a.y + 30, { steps: 4 });
    await page.setViewportSize({ width: 330, height: 568 }); await page.waitForTimeout(80); await page.mouse.move(a.x + 60, a.y + 200, { steps: 3 }); await page.mouse.up(); }
  s = await st(page);
  ok("resize mid-drag cancels cleanly", s.tokens.join(",") === before && !(await page.$(".float")));
  await page.setViewportSize({ width: 320, height: 568 });
  await page.evaluate(() => { const t = document.querySelector("#cells .tok"); const r = t.getBoundingClientRect(); t.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, clientX: r.x + 5, clientY: r.y + 5, pointerId: 7 }));
    document.dispatchEvent(new PointerEvent("pointermove", { clientX: r.x + 40, clientY: r.y + 60, pointerId: 7 })); document.dispatchEvent(new PointerEvent("pointercancel", { pointerId: 7 })); });
  s = await st(page);
  ok("pointercancel mid-drag restores", s.tokens.join(",") === before && !(await page.$(".float")));
  // dwell paging fires once per entry
  await setToks(page, 9, ["(", "(", "(", "(", "n1", "+", "(", "n2", "*", "n3", ")", "-", "n4", "-", "n5", ")", ")", ")", ")"]);
  await page.tap("#pgPrev");
  { const a = await box("#cells .tok[data-i='0']"), nx = await box("#pgNext"); await page.mouse.move(a.x, a.y); await page.mouse.down(); await page.mouse.move(a.x + 20, a.y, { steps: 3 }); await page.mouse.move(nx.x, nx.y, { steps: 4 });
    await page.waitForTimeout(1300); const p1 = (await st(page)).layout.page; await page.mouse.move(a.x, a.y + 300, { steps: 3 }); await page.mouse.up();
    const s2 = await st(page);
    ok("dwell 500 ms on Next turns exactly one page, cancel restores page and tokens", p1 === 1 && s2.layout.page === 0 && s2.tokens.length === 19, `during ${p1}, after ${s2.layout.page}`); }
  ok("no JS errors (320×568 interaction run)", errors.length === 0, errors.join(" | "));
  await ctx.close();
}

// ---------- 4/6. keyboard-only solve, Before/After, restart→undo, solve hold, review, try another way ----------
{
  const { ctx, page, errors } = await open(390, 844);
  await page.evaluate(() => __qa.reset(8)); // 2-1: cards 2 3 3 3 4, target 26
  await page.focus("#well");
  await page.keyboard.type("(4+3)*3+3"); // first-free duplicate shortcut
  let s = await st(page);
  ok("keyboard builds (4+3)*3+3", s.expression === "(4 + 3) * 3 + 3", s.expression);
  await page.keyboard.press("Home"); await page.keyboard.press("Enter");
  s = await st(page);
  ok("Enter selects a token from the keyboard", s.sel === 0, "sel " + s.sel);
  await page.keyboard.press("Escape");
  await page.keyboard.press("End");
  await page.keyboard.press("r");
  s = await st(page);
  ok("R restarts", s.tokens.length === 0);
  await page.keyboard.press("Control+z");
  s = await st(page);
  ok("Ctrl+Z after restart restores the expression in one step", s.expression === "(4 + 3) * 3 + 3");
  // selecting then Done keeps the player's caret (SPEC §4)
  { const c0 = (await st(page)).caret; await page.click("#cells .tok[data-i='1']"); await page.click("#eDone"); const s4 = await st(page);
    ok("select + Done leaves the caret where it was", s4.caret === c0 && s4.sel === -1, `${c0} → ${s4.caret}`); }
  // settings dialog does not get shortcuts
  await page.click("#sPlay [data-settings]");
  await page.keyboard.press("r"); await page.keyboard.press("+");
  s = await st(page);
  ok("shortcuts do not fire while Settings is open", s.expression === "(4 + 3) * 3 + 3");
  await page.keyboard.press("Escape");
  ok("Escape closes settings and returns focus", await page.evaluate(() => document.getElementById("shSettings").hidden));
  await page.focus("#well");
  await page.keyboard.press("End");
  const t0 = Date.now();
  await page.keyboard.type("+2");
  s = await st(page);
  ok("solve by keyboard: one check in result, editing locked", s.solved && (await page.$$eval("#pResultBox .ico", (e) => e.length)) === 1 && (await page.$$eval("#well .ico", (e) => e.length)) === 0);
  await page.keyboard.type("+"); await page.keyboard.press("Backspace");
  s = await st(page);
  ok("no edits during the 600 ms hold", s.expression === "(4 + 3) * 3 + 3 + 2");
  await page.screenshot({ path: path.join(shots, "390x844-solve-moment.png") });
  await page.waitForFunction(() => !document.getElementById("sDone").hidden, null, { timeout: 2000 });
  const dt = Date.now() - t0;
  ok("completion shows after the hold", dt >= 550 && dt < 1500, dt + " ms");
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("mathly.v1")));
  ok("one completion record saved", saved.done["2-1"] && Object.keys(saved.done).length === 1);
  await page.click("#dReview");
  s = await st(page);
  ok("Review is read-only and labelled", s.screen === "review" && (await page.textContent("#statusTxt")).includes("Review") && await page.isDisabled("#palette button:first-child"));
  await page.click("#rAgain");
  s = await st(page);
  const saved2 = await page.evaluate(() => JSON.parse(localStorage.getItem("mathly.v1")));
  ok("Try another way: new attempt, completion kept", s.screen === "playing" && s.tokens.length === 0 && !!saved2.done["2-1"]);
  // hint stays non-mutating; assisted flag
  await page.click("#bHint");
  s = await st(page);
  ok("hint opens inline without moving the tray or changing tokens", s.tokens.length === 0 && s.assisted && await page.isVisible("#hintPanel"));
  await page.screenshot({ path: path.join(shots, "390x844-hint.png") });
  ok("no JS errors (keyboard run)", errors.length === 0, errors.join(" | "));
  await ctx.close();
}

// ---------- short landscape: section layout keeps the selection strip on screen ----------
{
  const { ctx, page, errors } = await open(568, 320, { touch: true });
  await setToks(page, 8, ["n5", "+", "n2"]);
  await page.tap("#cells .tok[data-i='0']");
  const r = await page.evaluate(() => { const b = document.getElementById("eRemove").getBoundingClientRect(); return { bottom: b.bottom, h: innerHeight, mode: __qa.state().layout.mode, scroll: document.documentElement.scrollHeight - innerHeight }; });
  ok("568×320: Before/After/Remove/Done visible without scrolling", r.bottom <= r.h && r.scroll <= 0, JSON.stringify(r));
  await page.screenshot({ path: path.join(shots, "568x320-selected.png") });
  await page.tap("#tabCards"); await page.screenshot({ path: path.join(shots, "568x320-cards.png") });
  await page.tap("#tray > :nth-child(1)");
  ok("568×320: tapping a card in Cards inserts it and returns to Expression", (await st(page)).layout.tab === "expr" && (await st(page)).tokens.length === 4);
  await page.tap("#tabControls"); await page.screenshot({ path: path.join(shots, "568x320-controls.png") });
  ok("no JS errors (568×320)", errors.length === 0, errors.join(" | "));
  await ctx.close();
}
{
  const { ctx, page } = await open(320, 568);
  await setToks(page, 8, ["n5", "+"]);
  const r = await page.evaluate(() => { const e = document.getElementById("pResult"); return { sw: e.scrollWidth, cw: e.clientWidth, t: e.textContent }; });
  ok("320×568: RESULT word 'Incomplete' fits without truncation", r.sw <= r.cw + 1, JSON.stringify(r));
  await ctx.close();
}

// ---------- 2. tray stability across states at a fixed viewport ----------
for (const [w, h] of [[375, 667], [320, 568]]) {
  const { ctx, page } = await open(w, h);
  const tops = [];
  for (const toks of [[], ["n5", "+"], ["n5", "+", "n2", "*", "n3", "-", "n4", "+", "n1"], Array.from({ length: 30 }, () => "(")]) {
    await setToks(page, 8, toks);
    tops.push(await page.evaluate(() => Math.round(document.getElementById("tray").getBoundingClientRect().top)));
  }
  ok(`${w}×${h} tray top stable across empty/partial/full/long`, new Set(tops).size === 1, tops.join(","));
  await ctx.close();
}

// ---------- 7. pre-update save survives; denied storage still plays ----------
{
  const seed = () => { try { localStorage.setItem("mathly.v1", JSON.stringify({ done: { "1-1": { assisted: false }, "1-2": { assisted: true } }, cur: { li: 2, tokens: [{ k: "n", id: "n5" }, { k: "o", v: "+" }] }, settings: { sound: false, contrast: true } })); } catch (e) {} };
  const { ctx, page, errors } = await open(390, 844, { init: `if(!sessionStorage.getItem('seeded')){(${seed})();sessionStorage.setItem('seeded','1')}` });
  await page.click("#bContinue");
  const s = await st(page);
  ok("night-2 save: Continue resumes board 1-3 with its tokens", s.levelId === "1-3" && s.tokens.join(",") === "n5,+");
  ok("night-2 save: high-contrast setting kept", await page.evaluate(() => document.documentElement.classList.contains("hc")));
  await page.screenshot({ path: path.join(shots, "390x844-high-contrast.png") });
  await page.reload();
  await page.click("#bCollections");
  const txt = await page.textContent("#collList");
  ok("night-2 save: completions kept (Starter 2/8)", txt.includes("2/8"), txt.replace(/\s+/g, " ").slice(0, 80));
  ok("no JS errors (save run)", errors.length === 0, errors.join(" | "));
  await ctx.close();
}
{
  const deny = () => { Object.defineProperty(window, "localStorage", { get() { throw new Error("denied"); } }); };
  const { ctx, page, errors } = await open(390, 844, { init: `(${deny})()` });
  await page.click("#bContinue");
  await page.evaluate(() => __qa.solve().forEach((a) => __qa.act(a)));
  ok("storage denied: a board can be played and solved", (await st(page)).solved);
  ok("storage denied: no unhandled exception", errors.length === 0, errors.join(" | "));
  await ctx.close();
}

// ---------- 8. texture blocked / offline: solid fallback, same geometry ----------
{
  const a = await open(375, 667), b = await open(375, 667, { blockTexture: true });
  const geo = (p) => p.evaluate(() => { __qa.reset(8); return ["well", "tray", "palette"].map((id) => JSON.stringify(document.getElementById(id).getBoundingClientRect())).join(); });
  ok("texture blocked: identical geometry", (await geo(a.page)) === (await geo(b.page)));
  await b.page.screenshot({ path: path.join(shots, "375x667-no-texture.png") });
  ok("texture blocked: no JS errors", b.errors.length === 0, b.errors.join(" | "));
  await a.ctx.close(); await b.ctx.close();
  const html = fs.readFileSync(path.join(here, "../index.html"), "utf8");
  ok("no base64 art, no http(s) asset URLs", !/data:image|base64,/.test(html) && !/(src|url)\(?=?["']?https?:/.test(html));
  const files = ["felt-jade-v1.webp", ...fs.readdirSync(path.join(here, "../assets/icons")).map((f) => "icons/" + f)];
  const total = files.reduce((n, f) => n + fs.statSync(path.join(here, "../assets", f)).size, 0);
  ok("runtime raster + SVGs under 1 MiB", total < 1048576, total + " bytes");
}

// ---------- reduced motion: no snap animation ----------
{
  const { ctx, page } = await open(390, 844, { ctx: { reducedMotion: "reduce" } });
  await page.evaluate(() => __qa.reset(8));
  await page.click("#tray > :nth-child(1)");
  const anim = await page.$eval("#cells .tok", (e) => getComputedStyle(e).animationName);
  ok("reduced motion: placement is immediate", anim === "none", anim);
  await ctx.close();
}
await browser.close();
console.log(fails ? `\n${fails} FAILED` : "\nALL INTERACTION CHECKS PASSED");
process.exit(fails ? 1 : 0);
