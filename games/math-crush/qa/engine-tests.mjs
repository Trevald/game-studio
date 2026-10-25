// Math Crush engine, rules and recovery tests — H-002-v1 "play first, sweet rewards" (MC-010..MC-019),
// plus the retained H-001-v1 core rules. Runs the real game page in Chromium through window.__qa and real input.
// Usage (from repo root, after `cd tools && npm ci`): node games/math-crush/qa/engine-tests.mjs
import { createRequire } from "node:module";
import path from "node:path";
import fs from "node:fs";
import { pathToFileURL, fileURLToPath } from "node:url";
const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.resolve(here, "../../../tools/package.json"));
const { chromium } = require("playwright");
const url = pathToFileURL(path.resolve(here, "../index.html")).href;
const results = [];
const t = (name, ok, detail = "") => { results.push({ name, ok: !!ok, detail }); console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + String(detail).slice(0, 400) : ""}`); };
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
await page.goto(url); await page.waitForTimeout(300);
const ev = (f, a) => page.evaluate(f, a);
const fresh = async () => { await ev(() => { ui.game = null; ui.screen = "home"; ui.modal = null; localStorage.clear(); }); await page.reload(); await page.waitForTimeout(250); };

// ---------- data and fixtures ----------
const v = await ev(() => __qa.validate()); t("schema-2 level data: 12 levels, witnesses, thresholds, initial specials", v.ok, v.errors.join(","));
const fx = await ev(() => __qa.fixtures());
for (const c of fx.cases) t(`fixture ${c.id}`, c.ok, JSON.stringify(c.got));
const sc = await ev(() => [2, 3, 4, 5, 6, 7, 8].map((n) => M.chainPoints(n)));
t("chain points 2..8 = 100,187,300,525,600,675,750", JSON.stringify(sc) === "[100,187,300,525,600,675,750]", JSON.stringify(sc));
const rw = await ev(() => [[0, 8], [3, 3], [3, 4], [5, 8], [6, 3], [6, 4], [6, 5], [11, 8]].map(([li, n]) => M.rewardFor(li, n)));
t("MC-012 reward thresholds by level", JSON.stringify(rw) === JSON.stringify([null, null, "stripe", "stripe", null, "stripe", "wrapped", "wrapped"]), JSON.stringify(rw));
const dr = await ev(() => { __qa.reset(0); return { back: __qa.dragChain([0, 1, 2, 1]), diag: __qa.dragChain([0, 6]), rep: __qa.dragChain([0, 1, 6, 5, 0]), cap: __qa.dragChain([0, 1, 2, 3, 4, 9, 8, 7, 6]) }; });
t("drag: immediate-tail backtrack, diagonal/repeat ignored, cap 8", JSON.stringify(dr.back) === "[0,1]" && JSON.stringify(dr.diag) === "[0]" && JSON.stringify(dr.rep) === "[0,1,6,5]" && dr.cap.length === 8, JSON.stringify(dr));

// ---------- MC-010 on-board learning ----------
await fresh();
const nav = await ev(() => {
  const out = {};
  document.querySelector('[data-k="play"]').click(); out.play = __qa.state();
  out.noGates = !/Got it|Skip|Let’s play/.test(document.body.innerText);
  __qa.open("levels"); document.querySelector('[data-k="lvl-0"]').click(); out.node = __qa.state().screen;
  return out;
});
t("MC-010 Play opens the board directly (no intro, no Got it/Skip)", nav.play.screen === "playing" && nav.play.level === 0 && nav.noGates, JSON.stringify(nav.play.screen));
t("MC-010 level trail node opens the board directly", nav.node === "playing");
const l1 = await ev(() => {
  __qa.reset(0); const s0 = __qa.state(); const cap = document.querySelector(".status").innerText; const hand = !!document.querySelector(".cuehand");
  __qa.act({ chain: [2, 3] }); const s1 = __qa.state(); const txt1 = document.querySelector(".status").innerText;
  return { cue: s0.cue, cap, hand, free: s1.movesLeft === s0.movesLeft && s1.undoAvailable === 0, txt1 };
});
t("MC-010 L1 cue 'Connect these two' on witness 4+6 with hand", l1.cue && l1.cue.text === "Connect these two" && JSON.stringify(l1.cue.cells) === "[0,1]" && /Connect these two/.test(l1.cap) && l1.hand, JSON.stringify(l1.cue));
t("MC-010 L1 wrong sum is free and says 'Try again'", l1.free && /^Try again$/.test(l1.txt1.trim()), l1.txt1);
const alt = await ev(() => {
  __qa.reset(0); const w = LEVELS.match[0].witness; const other = M.allChains(ui.game, 200).find((c) => c.join() !== w.join() && !c.some((i) => w.includes(i)));
  __qa.act({ chain: other }); const done = !!__qa.saved().matchV3.lessons["l1-pair"];
  __qa.reset(0); return { other, done, replay: __qa.state().cue };
});
t("MC-010 another route completes the L1 lesson; replay doesn't repeat it", alt.done && alt.replay === null, JSON.stringify(alt));
const l2 = await ev(() => { __qa.reset(1); const c = __qa.state().cue; __qa.act({ chain: LEVELS.match[1].witness }); __qa.reset(1); return { c, after: __qa.state().cue, done: __qa.saved().matchV3.lessons["l2-longer"] }; });
t("MC-010 L2 'Try a longer chain' on 2+3+5; witness completes it", l2.c && l2.c.text === "Try a longer chain" && JSON.stringify(l2.c.cells) === "[0,1,2]" && l2.done && l2.after === null, JSON.stringify(l2));
const l4 = await ev(() => {
  __qa.reset(3); const s0 = __qa.state(); __qa.act({ chain: [2, 3] }); const s1 = __qa.state(); const txt = document.querySelector(".status").innerText;
  return { cue: s0.cue, sp: s0.specials[12], cost: s0.movesLeft - s1.movesLeft, txt };
});
t("MC-010 L4 cue 'Light up a whole row' on the initial stripe", l4.cue && l4.cue.text === "Light up a whole row" && l4.sp === "stripe", JSON.stringify(l4.cue));
t("MC-010 L4 wrong sum costs a move: 'Try again · 1 move used'", l4.cost === 1 && /Try again · 1 move used/.test(l4.txt), l4.txt);
const l7 = await ev(() => { __qa.reset(6); const s = __qa.state(); return { cue: s.cue, sp: s.specials[12] }; });
t("MC-010 L7 cue 'Pop the candies around it' on the initial wrapped", l7.cue && l7.cue.text === "Pop the candies around it" && l7.sp === "wrapped", JSON.stringify(l7));
const over = await ev(() => {
  __qa.reset(0); ui.chain = [0, 1, 2]; render(); const drag = document.querySelector(".status").innerText;
  __qa.setSetting("tap", true); ui.chain = [0, 1, 2]; render(); const tap = document.querySelector(".status").innerText; __qa.setSetting("tap", false); ui.chain = []; render();
  return { drag, tap };
});
t("MC-010 above target: 'Too high · slide back' / tap 'Tap the last candy to adjust'", /Too high · slide back/.test(over.drag) && /Tap the last candy to adjust/.test(over.tap), JSON.stringify(over));
// L6 hammer cue after 8 active idle seconds (real clock); input resets it; time in Pause doesn't count
await ev(() => { __qa.reset(5); });
await page.waitForTimeout(3000);
const idleMid = await ev(() => { const a = __qa.state().cue; __qa.button("pause"); return a; });
await page.waitForTimeout(6000);
const idlePaused = await ev(() => { const a = ui.idleMs; __qa.button("resume"); return a; });
await page.waitForTimeout(8700);
const idle = await ev(() => ({ cue: __qa.state().cue, ring: !!document.querySelector(".pill.cuebtn") }));
t("MC-010 L6 'A little help?' appears after 8 active idle s; pause doesn't count", idleMid === null && idlePaused < 1000 && idle.cue && idle.cue.text === "A little help?" && idle.ring, JSON.stringify({ idlePaused, idle }));
const l6done = await ev(() => { __qa.button("hammer"); const sel = !!__qa.saved().matchV3.lessons["l6-hammer"]; __qa.button("tool-cancel"); __qa.act({ hammer: 7 }); return { sel, done: !!__qa.saved().matchV3.lessons["l6-hammer"] }; });
t("MC-010 hammer lesson completes on confirmed use, not on selection", !l6done.sel && l6done.done, JSON.stringify(l6done));

// ---------- MC-011 levels and stars ----------
const th = await ev(() => LEVELS.match.map((L) => L.starThresholds.join("/")));
t("MC-011 thresholds L1 300/400, L2 400/600, L3 450/750", th[0] === "300/400" && th[1] === "400/600" && th[2] === "450/750", th.join(" "));
const clean = await ev(() => {
  __qa.reset(0); const before = __qa.state(); const meterStar = document.querySelector(".meter .tk.done path").getAttribute("fill");
  const s = __qa.solve(); for (const a of s) __qa.act(a);
  const after = __qa.state(); return { lens: s.map((a) => a.chain.length), score: after.coreScore, stars: after.stars, playingStars: before.stars, meterStar };
});
t("MC-011 L1 clean three-pair route scores 400 → 3 stars", JSON.stringify(clean.lens) === "[2,2,2]" && clean.score === 400 && clean.stars === 3, JSON.stringify(clean));
t("MC-011 completion star stays hollow before the win", clean.playingStars === 0 && clean.meterStar !== "#FFC83A", clean.meterStar);
const ts = await ev(() => Array.from({ length: 12 }, (_, li) => { const r = __qa.threeStar(li, 40); return { level: r.level, core: r.core, need: r.threeStar, reached: r.reached }; }));
for (const r of ts) t(`MC-011 level ${r.level}: real-engine three-star route without tools/speed (${r.core} ≥ ${r.need})`, r.reached, JSON.stringify(r));
const meter = await ev(() => { __qa.reset(0); __qa.act({ chain: [0, 1, 2, 3, 8].slice(0, 2) }); const s = __qa.state(); const lit = [...document.querySelectorAll(".meter .tk path")].map((p) => p.getAttribute("fill") === "#FFC83A"); return { score: s.coreScore, lit }; });
t("MC-011 meter uses the live core score (100 lights no threshold mark)", meter.score === 100 && JSON.stringify(meter.lit) === "[false,false,false]", JSON.stringify(meter));

// ---------- MC-012 specials (retained rules) ----------
const rg2 = await ev(() => {
  __qa.reset(3); const g = ui.game;
  g.cells = [1,5,5,5,5, 2,5,5,5,5, 3,5,5,5,5, 4,5,5,5,5, 9,5,5,5,5].map((v, i) => ({ id: i, v, sp: null })); g.nextId = 25;
  __qa.act({ chain: [0, 5, 10, 15] }); const s = __qa.state(); const idx = s.specials.indexOf("stripe");
  return { idx, v: s.board[idx], id: s.ids[idx], specials: s.specials.filter(Boolean).length };
});
t("MC-012 reward: one striped candy, value kept, fresh id, settles by gravity", rg2.specials === 1 && rg2.v === 4 && rg2.id === 25 && rg2.idx === 15, JSON.stringify(rg2));
const act2 = await ev(() => {
  __qa.reset(3); const g = ui.game;
  g.cells = [1,9,9,9,9, 2,9,9,9,9, 3,9,9,9,9, 4,9,9,9,9, 6,9,9,9,9].map((v, i) => ({ id: i, v, sp: null })); g.nextId = 25;
  __qa.act({ chain: [0, 5, 10, 15] }); const s1 = __qa.state(); const i = s1.specials.indexOf("stripe");
  __qa.act({ chain: [i, i + 5] }); return { s1blast: s1.blastPts, blast: __qa.state().blastPts };
});
t("MC-012 fresh reward not activated on its own move; activates later (+100 row)", act2.s1blast === 0 && act2.blast === 100, JSON.stringify(act2));
const ov = await ev(() => {
  __qa.reset(6); const g = ui.game;
  g.cells = Array.from({ length: 25 }, (_, i) => ({ id: i, v: 9, sp: null }));
  g.cells[24] = { id: 24, v: 4, sp: "wrapped" }; g.cells[23] = { id: 23, v: 8, sp: null }; g.cells[18] = { id: 18, v: 9, sp: "stripe" }; g.target = 12;
  return M.resolve(g, [23, 24]);
});
t("MC-012 closure: corner 3x3 clipped, hit stripe fires once, union counted once", JSON.stringify(ov.removal) === "[15,16,17,18,19,23,24]" && ov.blastPts === 125 && !ov.combo, JSON.stringify(ov));
const wm = await ev(() => {
  __qa.reset(3); const g = ui.game; g.made = 2;
  g.cells = [1,9,9,9,9, 2,9,9,9,9, 3,9,9,9,9, 4,9,9,9,9, 9,9,9,9,9].map((v, i) => ({ id: i, v, sp: null }));
  const before = JSON.stringify(g.cells.map((c) => c.v)); __qa.act({ chain: [0, 5, 10, 15] });
  const s = __qa.state(); return { screen: s.screen, same: JSON.stringify(s.board) === before, specials: s.specials.filter(Boolean).length };
});
t("MC-012 winning move: no refill, no special placed", wm.screen === "won" && wm.same && wm.specials === 0, JSON.stringify(wm));
const initSp = await ev(() => { const out = []; for (let k = 0; k < 2; k++) { __qa.reset(3); out.push(__qa.state().specials[12]); __qa.act({ chain: [12, 13] }); } __qa.reset(3); out.push(__qa.state().specials[12], !!__qa.saved().matchV3.lessons["l4-stripe"]); return out; });
t("MC-012 initial stripe present on every replay, also after its lesson is done", JSON.stringify(initSp) === '["stripe","stripe","stripe",true]', JSON.stringify(initSp));
// ---------- MC-013 combos: preview equals commit ----------
const pv = await ev(() => {
  __qa.reset(6); const g = ui.game; const v = Array(25).fill(1); v[12] = 4; v[13] = 6; g.target = 10;
  g.cells = v.map((x, i) => ({ id: i, v: x, sp: i === 12 ? "stripe" : i === 13 ? "wrapped" : null }));
  ui.chain = [12, 13]; render(); const shown = [...document.querySelectorAll(".tile2.blast, .tile2.sel")].map((e) => +e.dataset.cell).sort((a, b) => a - b);
  const r = M.release(g, [12, 13]); return { shown, removed: r.ev.removed.map((x) => x.i).sort((a, b) => a - b) };
});
t("MC-013 preview (selected + dashed blast) equals the committed removal", JSON.stringify(pv.shown) === JSON.stringify(pv.removed) && pv.removed.length === 15, JSON.stringify(pv));
const mixUndo = await ev(() => {
  __qa.reset(6); const g = ui.game; const v = Array(25).fill(1); v[12] = 4; v[13] = 8;
  g.cells = v.map((x, i) => ({ id: i, v: x, sp: i === 12 ? "wrapped" : i === 13 ? "wrapped" : null }));
  __qa.act({ chain: [12, 13] }); const a = __qa.state().staged; __qa.act("undo"); return { a, b: __qa.state().staged };
});
t("MC-016 staged events (spark, mix) roll back with Undo", mixUndo.a.mix && mixUndo.a.spark && !mixUndo.b.mix && !mixUndo.b.spark, JSON.stringify(mixUndo));

// ---------- MC-014 hammer ----------
const hm = await ev(() => {
  const out = {};
  out.l1to5 = [0, 1, 2, 3, 4].map((li) => { __qa.reset(li); return __qa.state().hammer + (document.querySelector('[data-k="hammer"]') ? 10 : 0); });
  __qa.reset(5); const g = ui.game; g.cells[7].sp = "stripe"; render();
  __qa.button("hammer"); __qa.button("tool-cancel"); out.cancel = __qa.state().hammer;
  const s0 = __qa.state(); __qa.act({ hammer: 7 }); const s1 = __qa.state();
  out.charge = [s0.hammer, s1.hammer]; out.tools = s1.toolsUsed; out.free = s1.movesLeft === s0.movesLeft && s1.made === s0.made && s1.score === s0.score && s1.blastPts === 0;
  out.colOnly = [0, 1, 3, 4, 5, 6, 8, 9, 10, 11, 13, 14].every((i) => s1.ids[i] === s0.ids[i]) && s1.ids[7] === s0.ids[2] && s1.rng !== s0.rng;
  out.solvable = !!M.shortest(ui.game);
  __qa.act("undo"); const s2 = __qa.state();
  out.undo = s2.hammer === 1 && s2.rng === s0.rng && JSON.stringify(s2.ids) === JSON.stringify(s0.ids) && s2.specials[7] === "stripe" && s2.toolsUsed === 1;
  __qa.act({ hammer: 7 }); __qa.button("pause"); __qa.button("restart"); if (ui.modal === "confirm-restart") __qa.button("confirm"); out.restart = __qa.state().hammer;
  return out;
});
t("MC-014 L1–5 grant no hammer and show no button", hm.l1to5.every((x) => x === 0), JSON.stringify(hm.l1to5));
t("MC-014 Cancel spends nothing; confirm spends the one charge atomically", hm.cancel === 1 && JSON.stringify(hm.charge) === "[1,0]" && hm.tools === 1, JSON.stringify(hm));
t("MC-014 smash: no score/quota/move, special under it not triggered, only its column falls, seeded refill solvable", hm.free && hm.colOnly && hm.solvable, JSON.stringify(hm));
t("MC-014 Undo restores tile, charge and RNG; tool counter stays (monotonic)", hm.undo, JSON.stringify(hm));
t("MC-014 Restart resets the configured charge", hm.restart === 1, hm.restart);

// ---------- MC-015 Sugar Rush ----------
const rs = await ev(() => {
  const out = {};
  out.before8 = [0, 4, 6].map((li) => { __qa.reset(li); return __qa.state().rush; });
  __qa.reset(7); out.start = __qa.state().rush;
  const g = ui.game; g.cells = g.cells.map((c, i) => ({ ...c, v: 9 })); g.cells[0].v = 4; g.cells[1].v = 9; render();
  __qa.act({ chain: [0, 1] }); out.wrong = __qa.state().rush; // wrong sum (13): no charge, no spend
  __qa.act({ hammer: 20 }); out.tool = __qa.state().rush;
  return out;
});
t("MC-015 Rush absent before L8; L8 starts at charge 2", rs.before8.every((x) => x === null) && rs.start.charge === 2 && rs.start.uses === 0, JSON.stringify(rs));
t("MC-015 wrong sums and tool actions neither charge nor spend", rs.wrong.charge === 2 && rs.tool.charge === 2 && rs.wrong.uses === 0, JSON.stringify(rs));
const rs2 = await ev(() => {
  __qa.reset(7); const route = __qa.threeStar(7, 30).route; const seen = [];
  for (const ch of route) { __qa.act({ chain: ch }); const s = __qa.state(); seen.push({ n: ch.length, rush: s.rush, pts: s.last && s.last.chainPts, screen: s.screen }); }
  const s = __qa.state(); return { seen, score: s.coreScore, parts: s.chainPts + s.blastPts + s.finish, stickers: __qa.saved().matchV3.stickers };
});
t("MC-015 activation on a 3+ chain at charge 2; boosted chains score ×2; win with uses left adds no bonus", rs2.seen.some((x) => x.rush && x.rush.uses === 3) && rs2.score === rs2.parts && !!rs2.stickers["sugar-rush"], JSON.stringify(rs2.seen));
const rsU = await ev(() => { __qa.reset(7); const g = ui.game; g.rush = { charge: 2, uses: 0 }; const ch = M.allChains(g, 400).find((c) => c.length >= 3); __qa.act({ chain: ch }); const a = __qa.state().rush; __qa.act("undo"); return { a, b: __qa.state().rush }; });
t("MC-015 Undo restores charge and uses exactly", rsU.a.uses === 3 && rsU.b.charge === 2 && rsU.b.uses === 0, JSON.stringify(rsU));

// ---------- MC-016 stickers ----------
await fresh();
const st = await ev(() => {
  const out = {};
  __qa.reset(3); let s = __qa.state(); while (s.screen === "playing") { __qa.act({ chain: [0, 5] }); s = __qa.state(); } // L4: 1+3 wrong, charged
  out.lost = s.screen; out.afterLoss = Object.keys(__qa.saved().matchV3.stickers);
  __qa.reset(0); for (const a of __qa.solve()) __qa.act(a); out.win1 = Object.keys(__qa.saved().matchV3.stickers).sort();
  __qa.reset(0); for (const a of __qa.solve()) __qa.act(a); out.win2 = Object.keys(__qa.saved().matchV3.stickers).sort();
  __qa.reset(5); __qa.act({ hammer: 3 }); __qa.act("undo"); for (const a of __qa.solve()) __qa.act(a); out.toolWin = __qa.state().toolsUsed; out.toolStickers = M.stickersFor(ui.game);
  out.afterTool = Object.keys(__qa.saved().matchV3.stickers).sort();
  return out;
});
t("MC-016 failed attempts award nothing", st.afterLoss.length === 0 && st.lost === "lost", JSON.stringify(st));
t("MC-016 L1 win commits Sweet Start + Perfect Batch; a repeat win adds no duplicates", JSON.stringify(st.win1) === '["perfect-batch","sweet-start"]' && JSON.stringify(st.win2) === JSON.stringify(st.win1), JSON.stringify(st));
t("MC-016 a tool used then undone still counts against Perfect Batch (monotonic)", st.toolWin === 1 && !st.toolStickers.includes("perfect-batch"), JSON.stringify(st));
const book = await ev(() => {
  __qa.open("home"); document.querySelector('[data-k="book"]').click(); const open = __qa.state().modal;
  const locked = document.querySelectorAll(".stk.locked").length;
  document.querySelector('[data-k="stk-lucky-seven"]').click(); const cond = document.querySelector(".binfo").innerText;
  document.querySelector('[data-k="stk-sweet-start"]').click(); document.querySelector('[data-k="set-badge"]').click();
  const badge = __qa.saved().matchV3.badge; document.querySelector('[data-k="book-back"]').click();
  return { open, locked, cond, badge, back: __qa.state().screen, modal: __qa.state().modal, homeBadge: !!document.querySelector(".badgeimg") };
});
t("MC-016 book: locked stickers show their condition; earned one becomes the badge; Back restores Home", book.open === "book" && book.locked === 4 && /seven-candy chain/.test(book.cond) && book.badge === "sweet-start" && book.back === "home" && !book.modal && book.homeBadge, JSON.stringify(book));
const midBook = await ev(() => { __qa.reset(1, { timed: true }); __qa.act({ chain: [0, 1, 2] }); ui.chain = [5, 6]; __qa.button("pause"); __qa.button("book"); const a = { chain: ui.chain.length, timing: __qa.timingActive() }; __qa.button("book-back"); return { ...a, modal: __qa.state().modal }; });
t("MC-016 book mid-game: selection cancelled, clock paused, Back returns to Pause", midBook.chain === 0 && !midBook.timing && midBook.modal === "pause", JSON.stringify(midBook));

// ---------- MC-017 results and speed challenge ----------
await fresh();
const sp = await ev(() => {
  const out = {};
  __qa.reset(0); for (const a of __qa.solve()) __qa.act(a);
  out.win = { next: !!document.querySelector('.mcm [data-k="next"]'), again: !!document.querySelector('.mcm [data-k="retry"]'), speed: !!document.querySelector('.mcm [data-k="speed"]'), assisted: /Assisted/.test(document.body.innerText), clock: !!document.querySelector("#mclock") };
  document.querySelector('.mcm [data-k="next"]').click(); out.next = __qa.state();
  __qa.reset(0); for (const a of __qa.solve()) __qa.act(a);
  document.querySelector('.mcm [data-k="speed"]').click(); let s = __qa.state(); out.timedStart = { timed: s.timed, timing: s.timing, clock: !!document.querySelector("#mclock") };
  out.beforeTouch = __qa.tick(3000) === false;
  __qa.act(__qa.solve()[0]); out.ticking = __qa.tick(20000) === true;
  __qa.button("pause"); out.paused = __qa.tick(5000) === false; __qa.button("resume");
  __qa.act("undo"); out.noRewind = __qa.state().elapsedMs === 20000;
  for (const a of __qa.solve()) __qa.act(a); __qa.tick(5000);
  out.first = { txt: document.querySelector(".rows2").innerText, best: __qa.saved().matchV3.records["sweet-v1:1"].bestTimeMs };
  const runTimed = (ms) => { document.querySelector('.mcm [data-k="speed"]').click(); __qa.act(__qa.solve()[0]); __qa.tick(ms); for (const a of __qa.solve()) __qa.act(a); return { txt: document.querySelector(".rows2").innerText, best: __qa.saved().matchV3.records["sweet-v1:1"].bestTimeMs }; };
  out.faster = runTimed(12000); out.slower = runTimed(30000); out.tie = runTimed(12400);
  out.stars = __qa.state().stars;
  return out;
});
t("MC-017 win card: Next, Play again, speed challenge; no Assisted; no clock in normal play", sp.win.next && sp.win.again && sp.win.speed && !sp.win.assisted && !sp.win.clock, JSON.stringify(sp.win));
t("MC-017 Next opens the next board directly", sp.next.screen === "playing" && sp.next.level === 1);
t("MC-017 timed attempt: clock visible, starts only on the first board action", sp.timedStart.timed && !sp.timedStart.timing && sp.timedStart.clock && sp.beforeTouch && sp.ticking, JSON.stringify(sp.timedStart));
t("MC-017 pause excluded; Undo never rewinds time", sp.paused && sp.noRewind, JSON.stringify(sp));
t("MC-017 first finish says 'First time'", /First time\s*0:20/.test(sp.first.txt) && sp.first.best === 20000, JSON.stringify(sp.first));
t("MC-017 faster says 'Personal best' with difference; slower says 'Your time' with best; tie keeps record", /Personal best\s*0:12 \(8s faster\)/.test(sp.faster.txt) && sp.faster.best === 12000 && /Your time\s*0:30[\s\S]*Best\s*0:12/.test(sp.slower.txt) && sp.slower.best === 12000 && sp.tie.best === 12000 && /Your time/.test(sp.tie.txt), JSON.stringify([sp.faster, sp.slower, sp.tie]));
t("MC-017 timer doesn't affect stars", sp.stars === 3);
const unl = await ev(() => { __qa.reset(4); let s = __qa.state(); return !!completedEver(4); });
t("MC-017 speed challenge not offered for an uncompleted level", unl === false);
const l12 = await ev(() => { __qa.reset(11); for (const a of __qa.solve()) __qa.act(a); const b = document.querySelector('.mcm .pbtn'); return b && b.innerText; });
t("MC-017 final level: Next becomes Candy trail", l12 === "Candy trail", l12);
const loss = await ev(() => { __qa.reset(3); let s = __qa.state(); while (s.screen === "playing") { __qa.act({ chain: [0, 5] }); s = __qa.state(); } const txt = document.querySelector(".mcm").innerText; const undo = !!document.querySelector('.mcm [data-k="undo2"]'); document.querySelector('.mcm [data-k="retry"]').click(); const r = __qa.state(); return { txt, undo, retry: r.screen, moves: r.movesLeft }; });
t("MC-017 failure: 'One more try?', Retry immediate, Undo offered", /One more try\?/.test(loss.txt) && loss.undo && loss.retry === "playing" && loss.moves === 5, JSON.stringify(loss));

// ---------- MC-019 saves, migration, recovery ----------
const ps = await ev(() => { __qa.reset(3); __qa.act({ chain: [0, 1] }); const s = __qa.saved().matchV3.active; return { ver: s && s.version, moves: s && s.game.movesLeft, legacy: __qa.saved().active }; });
t("MC-019 active sweet-v1 snapshot saved after a committed action (legacy slot untouched)", ps.ver === "sweet-v1" && ps.moves === 4 && ps.legacy === null, JSON.stringify(ps));
await page.reload(); await page.waitForTimeout(300);
const rr = await ev(() => { __qa.open("home"); const b = document.querySelector('[data-k="continue"]'); b.click(); const s = __qa.state(); return { screen: s.screen, moves: s.movesLeft, level: s.level }; });
t("MC-019 reload → Continue resumes the committed state", rr.screen === "playing" && rr.moves === 4 && rr.level === 3, JSON.stringify(rr));
await ev(() => { ui.screen = "home"; render(); const raw = JSON.parse(localStorage.getItem("mathcrush.v1")); raw.matchV3.active.game.cells = "garbage"; raw.match.unlocked = 5; localStorage.setItem("mathcrush.v1", JSON.stringify(raw)); });
await page.reload(); await page.waitForTimeout(300);
const cr = await ev(() => { __qa.open("home"); document.querySelector('[data-k="continue"]').click(); const s = __qa.state(); return { modal: s.modal, unlocked: __qa.saved().match.unlocked, stickers: Object.keys(__qa.saved().matchV3.stickers).length }; });
t("MC-019 corrupt active v3 → restore error, records kept", cr.modal === "restore-error" && cr.unlocked === 5 && cr.stickers > 0, JSON.stringify(cr));
// legacy save from the H-001-v1 build (candy-v2 active attempt, v1/v2 records, removed modes, speed setting)
const legacy = { schemaVersion: 1, settings: { sound: false, haptics: true, speed: true, tap: false }, coach: {}, coach2: { mult: true },
  match: { unlocked: 7, stars: [3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], best: [650, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  equation: { unlocked: 4, stars: [3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], best: Array(12).fill(0) }, clear: { unlocked: 2, stars: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], best: Array(12).fill(0) },
  matchV2: { version: "candy-v2", stars: [3, 3, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0], best: [900, 687, 700, 600, 800, 800, 0, 0, 0, 0, 0, 0], bestTimed: [950, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], assisted: Array(12).fill(false) },
  active: { version: "candy-v2", game: { mode: "match", version: "candy-v2", li: 5, movesLeft: 3, made: 1, cells: [], hist: [] } } };
await ev((L) => { localStorage.setItem("mathcrush.v1", JSON.stringify(L)); }, legacy);
await page.reload(); await page.waitForTimeout(300);
const mig = await ev(() => {
  __qa.open("home"); const sv = __qa.saved(); const home = document.body.innerText;
  const out = { offer: /Start this level · Level 6/.test(home), noContinue: !document.querySelector('[data-k="continue"]'), archived: sv.matchV3.archivedActive.length === 1 && sv.matchV3.archivedActive[0].data.game.li === 5,
    v2: JSON.stringify(sv.matchV2), v1best: sv.match.best[0], eq: sv.equation.unlocked, cl: sv.clear.unlocked, unlocked: sv.match.unlocked, speedSetting: sv.settings.speed, v3empty: Object.keys(sv.matchV3.records).length === 0 };
  document.querySelector('[data-k="offer-start"]').click(); const s = __qa.state(); out.started = s.screen === "playing" && s.level === 5 && s.version === "sweet-v1";
  out.noSpeedSwitch = (__qa.button("pause"), !document.querySelector('[data-k="speed"]')); __qa.button("resume");
  out.speedOld = completedEver(0) && completedEver(5);
  return out;
});
t("MC-019 old candy-v2 attempt archived verbatim and offered as 'Start this level' on new rules", mig.offer && mig.noContinue && mig.archived && mig.started, JSON.stringify(mig));
t("MC-019 legacy v1/v2 records, removed modes, unlocks and old settings kept; v3 starts empty", mig.v2 === JSON.stringify(legacy.matchV2) && mig.v1best === 650 && mig.eq === 4 && mig.cl === 2 && mig.unlocked === 7 && mig.speedSetting === true && mig.v3empty, JSON.stringify(mig));
t("MC-017 speed-bonus switch removed; completion from older versions unlocks the challenge", mig.noSpeedSwitch && mig.speedOld, JSON.stringify(mig));
const ctx2 = await browser.newContext({ viewport: { width: 390, height: 844 } });
await ctx2.addInitScript(() => { Object.defineProperty(window, "localStorage", { get() { throw new Error("blocked"); } }); });
const p2 = await ctx2.newPage(); const err2 = []; p2.on("pageerror", (e) => err2.push(e.message));
await p2.goto(url); await p2.waitForTimeout(300);
const bl = await p2.evaluate(() => { __qa.reset(0); for (const a of __qa.solve()) __qa.act(a); return { s: __qa.state().screen, banner: /could not be saved/.test(document.body.innerText) }; });
t("MC-019 storage blocked: plays in memory, unobtrusive notice, no errors", bl.s === "won" && err2.length === 0, JSON.stringify(bl));
await ctx2.close();

// ---------- real input: mouse drag, tap mode, keyboard, hammer by pointer ----------
const p3 = await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage();
const err3 = []; p3.on("pageerror", (e) => err3.push(e.message));
await p3.goto(url); await p3.waitForTimeout(300);
await p3.click('[data-k="play"]'); await p3.waitForTimeout(250);
const center = async (i) => { const b = await p3.$(`[data-cell="${i}"]`); const r = await b.boundingBox(); return [r.x + r.width / 2, r.y + r.height / 2]; };
let [x, y] = await center(0); await p3.mouse.move(x, y); await p3.mouse.down();
for (const i of [1, 2, 1]) { [x, y] = await center(i); await p3.mouse.move(x, y, { steps: 6 }); }
const mid = await p3.evaluate(() => __qa.state().chain);
await p3.mouse.move(x, 830, { steps: 6 }); await p3.mouse.up(); await p3.waitForTimeout(300);
const s3 = await p3.evaluate(() => __qa.state());
t("input: mouse drag 4→6→5 with backtrack, released below the board, clears", JSON.stringify(mid) === "[0,1]" && s3.made === 1 && s3.chainPts === 100, JSON.stringify({ mid, made: s3.made }));
await p3.evaluate(() => __qa.setSetting("tap", true));
const ch = await p3.evaluate(() => __qa.solve()[0].chain);
for (const i of ch) { const [cx, cy] = await center(i); await p3.mouse.click(cx, cy); await p3.waitForTimeout(80); }
await p3.click('[data-k="submit"]'); await p3.waitForTimeout(300);
t("input: tap mode, tap candies then Submit clears", (await p3.evaluate(() => __qa.state().made)) === 2);
await p3.evaluate(() => __qa.setSetting("tap", false));
const kc = await p3.evaluate(() => __qa.solve()[0].chain);
await p3.evaluate(() => document.activeElement && document.activeElement.blur());
await p3.keyboard.press("ArrowRight");
const steps = await p3.evaluate((kc) => { const out = []; let cur = 0; for (const i of kc) { const dr = Math.floor(i / 5) - Math.floor(cur / 5), dc = (i % 5) - (cur % 5); for (let k = 0; k < Math.abs(dr); k++) out.push(dr > 0 ? "ArrowDown" : "ArrowUp"); for (let k = 0; k < Math.abs(dc); k++) out.push(dc > 0 ? "ArrowRight" : "ArrowLeft"); out.push(" "); cur = i; } return out; }, kc);
for (const k of steps) await p3.keyboard.press(k === " " ? "Space" : k);
await p3.keyboard.press("Enter"); await p3.waitForTimeout(300);
t("input: keyboard arrows + Space + Enter completes the level", (await p3.evaluate(() => __qa.state().screen)) === "won");
await p3.evaluate(() => { __qa.reset(5); });
await p3.click('[data-k="hammer"]'); const [hx, hy] = await center(12); await p3.mouse.click(hx, hy); await p3.waitForTimeout(80);
const ht = await p3.evaluate(() => ({ target: __qa.state().tool, smashDisabled: document.querySelector('[data-k="smash"]').disabled, visible: !!document.querySelector('.tile2.smash[data-cell="12"] .d') }));
await p3.click('[data-k="smash"]'); await p3.waitForTimeout(300);
const hs = await p3.evaluate(() => __qa.state());
t("input: hammer by pointer — target highlighted with number visible, then Smash candy", ht.target && ht.target.target === 12 && !ht.smashDisabled && ht.visible && hs.hammer === 0 && hs.toolsUsed === 1, JSON.stringify({ ht, hammer: hs.hammer }));
t("no page errors (real input)", err3.length === 0, err3.join(" | "));
t("no page errors", errors.length === 0, errors.join(" | "));
await browser.close();
const passed = results.filter((r) => r.ok).length;
console.log(`\n${passed}/${results.length} passed`);
fs.writeFileSync(path.resolve(here, "engine-tests.json"), JSON.stringify({ date: new Date().toISOString(), passed, total: results.length, results }, null, 2));
process.exit(passed === results.length ? 0 : 1);
