// Math Crush engine, rules and recovery tests — H-002-v1 "play first, sweet rewards" (MC-010..MC-019) as changed by
// FB-004 (no hammer, no Sugar Rush, no speed challenge; rules core-v1), plus the retained H-001-v1 core rules. Runs the real game page in Chromium through window.__qa and real input.
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
const l6 = await ev(() => { __qa.reset(5); ui.idleMs = 20000; render(); return { cue: __qa.state().cue, ring: !!document.querySelector(".cuebtn") }; });
t("FB-004-A no hammer cue on L6 after idling", l6.cue === null && !l6.ring, JSON.stringify(l6));

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
for (const r of ts) t(`MC-011 level ${r.level}: real-engine three-star route under core-v1 (no Rush, no hammer) (${r.core} ≥ ${r.need})`, r.reached, JSON.stringify(r));
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
  const before = JSON.stringify(__qa.state().specials); __qa.act({ chain: [12, 13] }); const a = __qa.state().specials.filter(Boolean).length; __qa.act("undo"); return { a, restored: JSON.stringify(__qa.state().specials) === before };
});
t("MC-013 Undo after a combo restores both consumed specials exactly", mixUndo.restored, JSON.stringify(mixUndo));

// ---------- FB-004-A/B removal: hammer and Sugar Rush ----------
const rm = await ev(() => {
  const out = { levels: [] };
  for (let li = 0; li < 12; li++) {
    __qa.reset(li); const s = __qa.state(), txt = document.body.innerText;
    out.levels.push({ li, hammerBtn: !!document.querySelector('[data-k="hammer"],[data-k="smash"]'), rushBar: !!document.querySelector(".rushbar"), words: /Sugar Rush|Hammer|Smash/i.test(txt),
      stateKeys: ["hammer", "rush", "tool", "toolsUsed", "timed", "elapsedMs"].filter((k) => k in s), hamAct: __qa.actions().some((a) => a && a.hammer !== undefined) });
  }
  out.engine = ["hammer", "rushActive"].filter((k) => typeof M[k] === "function");
  out.data = LEVELS.match.some((L) => "tools" in L || "rushEnabled" in L);
  __qa.reset(7); const g = ui.game; g.cells = g.cells.map((c) => ({ ...c, v: 9, sp: null })); [3, 3, 6].forEach((v, i) => { g.cells[i].v = v; });
  const pts = []; for (let k = 0; k < 4; k++) { const ch = M.allChains(ui.game, 400).find((c) => c.length >= 3) || M.shortest(ui.game); const before = __qa.state().chainPts; __qa.act({ chain: ch }); pts.push({ n: ch.length, pts: __qa.state().chainPts - before, exp: M.chainPoints(ch.length) }); if (__qa.state().screen !== "playing") break; }
  out.l8 = pts;
  __qa.button("pause"); __qa.button("help"); out.help = document.querySelector(".mcm").innerText; __qa.button("closehelp"); __qa.button("resume");
  return out;
});
t("FB-004-A/B no hammer or Sugar Rush button, bar, copy, state field or action on any level", rm.levels.every((x) => !x.hammerBtn && !x.rushBar && !x.words && !x.stateKeys.length && !x.hamAct) && !rm.engine.length && !rm.data, JSON.stringify(rm.levels.filter((x) => x.hammerBtn || x.rushBar || x.words || x.stateKeys.length || x.hamAct)) + JSON.stringify(rm.engine));
t("FB-004-B L8+ chains score plain chain points (never doubled)", rm.l8.length >= 2 && rm.l8.every((x) => x.pts === x.exp), JSON.stringify(rm.l8));
t("FB-004-A/B/C help copy mentions no hammer, Sugar Rush or timing", !/hammer|Sugar Rush|speed|\btime/i.test(rm.help), (rm.help.match(/.{0,60}(hammer|Sugar Rush|speed|\btime).{0,60}/i) || [""])[0]);

// ---------- MC-020 sticker system removed (H-003-v1) ----------
await fresh();
const st = await ev(() => {
  const out = {};
  __qa.open("home"); out.home = { book: !!document.querySelector('[data-k="book"]'), words: /sticker|badge|collection/i.test(document.body.innerText), badge: !!document.querySelector(".badgeimg") };
  __qa.reset(0); __qa.button("pause"); out.pause = /sticker|badge|collection/i.test(document.querySelector(".mcm").innerText) || !!document.querySelector('.mcm [data-k="book"]'); __qa.button("resume");
  for (const a of __qa.solve()) __qa.act(a); // L1 win (used to award Sweet Start)
  out.win = { stickers: Object.keys(__qa.saved().matchV3.stickers).length, toast: !!document.querySelector(".stoast"), sr: document.getElementById("sr").textContent };
  // a 7-candy chain + a combo on L7 (used to award Lucky Seven / Mix Master / First Spark)
  __qa.reset(6); const g = ui.game; const v = Array(25).fill(9); [0, 1, 2, 3, 4, 9, 8].forEach((i) => { v[i] = 1; }); v[8] = 4; g.target = 10;
  g.cells = v.map((x, i) => ({ id: i, v: x, sp: i === 1 ? "wrapped" : i === 3 ? "wrapped" : null }));
  __qa.act({ chain: [0, 1, 2, 3, 4, 9, 8] }); out.seven = { made: __qa.state().made, stickers: Object.keys(__qa.saved().matchV3.stickers).length, sr: document.getElementById("sr").textContent };
  out.qa = ["modal"].length && typeof M.stickersFor === "undefined" && typeof ACHIEVEMENTS === "undefined";
  out.assets = performance.getEntriesByType("resource").map((e) => e.name).filter((n) => /sticker|book\.svg/.test(n));
  return out;
});
t("MC-020 Home: no Stickers entry, badge or collection words", !st.home.book && !st.home.words && !st.home.badge, JSON.stringify(st.home));
t("MC-020 Pause: no sticker book", !st.pause);
t("MC-020 a win never awards or announces a sticker", st.win.stickers === 0 && !st.win.toast && !/sticker/i.test(st.win.sr), JSON.stringify(st.win));
t("MC-020 a 7-candy chain with a combo never awards or announces a sticker", st.seven.made === 1 && st.seven.stickers === 0 && !/sticker/i.test(st.seven.sr), JSON.stringify(st.seven));
t("MC-020 no sticker award code or data in the runtime", st.qa);
t("MC-020 no sticker image requests", st.assets.length === 0, JSON.stringify(st.assets));

// ---------- MC-017 results (FB-004-C: no speed challenge) ----------
await fresh();
const sp = await ev(() => {
  const out = {};
  __qa.reset(0); for (const a of __qa.solve()) __qa.act(a);
  out.win = { next: !!document.querySelector('.mcm [data-k="next"]'), again: !!document.querySelector('.mcm [data-k="retry"]'), speed: !!document.querySelector('.mcm [data-k="speed"]'), assisted: /Assisted/.test(document.body.innerText), clock: !!document.querySelector("#mclock, .clock"), time: /time|First time|Personal best/i.test(document.querySelector(".mcm").innerText) };
  document.querySelector('.mcm [data-k="next"]').click(); out.next = __qa.state();
  __qa.button("speed"); out.afterSpeedKey = __qa.state().screen;
  out.rec = __qa.saved().matchV3.records["core-v1:1"];
  return out;
});
t("MC-017/FB-004-C win card: Next and Play again only; no speed challenge, clock, time rows or Assisted", sp.win.next && sp.win.again && !sp.win.speed && !sp.win.assisted && !sp.win.clock && !sp.win.time, JSON.stringify(sp.win));
t("MC-017 Next opens the next board directly", sp.next.screen === "playing" && sp.next.level === 1);
t("FB-004-C core-v1 record has stars/best/wins and no time fields", sp.rec && sp.rec.stars === 3 && sp.rec.best === 400 && !("bestTimeMs" in sp.rec), JSON.stringify(sp.rec));
const l12 = await ev(() => { __qa.reset(11); for (const a of __qa.solve()) __qa.act(a); const b = document.querySelector('.mcm .pbtn'); return b && b.innerText; });
t("MC-017 final level: Next becomes Level map", l12 === "Level map", l12);
const loss = await ev(() => { __qa.reset(3); let s = __qa.state(); while (s.screen === "playing") { __qa.act({ chain: [0, 5] }); s = __qa.state(); } const txt = document.querySelector(".mcm").innerText; const undo = !!document.querySelector('.mcm [data-k="undo2"]'); document.querySelector('.mcm [data-k="retry"]').click(); const r = __qa.state(); return { txt, undo, retry: r.screen, moves: r.movesLeft }; });
t("MC-017 failure: 'One more try?', Retry immediate, Undo offered", /One more try\?/.test(loss.txt) && loss.undo && loss.retry === "playing" && loss.moves === 5, JSON.stringify(loss));

// ---------- MC-019 saves, migration, recovery ----------
const ps = await ev(() => { __qa.reset(3); __qa.act({ chain: [0, 1] }); const s = __qa.saved().matchV3.active; return { ver: s && s.version, moves: s && s.game.movesLeft, legacy: __qa.saved().active }; });
t("MC-019 active core-v1 snapshot saved after a committed action (legacy slot untouched)", ps.ver === "core-v1" && ps.moves === 4 && ps.legacy === null, JSON.stringify(ps));
await page.reload(); await page.waitForTimeout(300);
const rr = await ev(() => { __qa.open("home"); const b = document.querySelector('[data-k="continue"]'); b.click(); const s = __qa.state(); return { screen: s.screen, moves: s.movesLeft, level: s.level }; });
t("MC-019 reload → Continue resumes the committed state", rr.screen === "playing" && rr.moves === 4 && rr.level === 3, JSON.stringify(rr));
await ev(() => { ui.screen = "home"; render(); const raw = JSON.parse(localStorage.getItem("mathcrush.v1")); raw.matchV3.active.game.cells = "garbage"; raw.match.unlocked = 5; localStorage.setItem("mathcrush.v1", JSON.stringify(raw)); });
await page.reload(); await page.waitForTimeout(300);
const cr = await ev(() => { __qa.open("home"); document.querySelector('[data-k="continue"]').click(); const s = __qa.state(); return { modal: s.modal, unlocked: __qa.saved().match.unlocked, stickers: Object.keys(__qa.saved().matchV3.stickers).length }; });
t("MC-019 corrupt active v3 → restore error, records kept", cr.modal === "restore-error" && cr.unlocked === 5, JSON.stringify(cr));
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
  document.querySelector('[data-k="offer-start"]').click(); const s = __qa.state(); out.started = s.screen === "playing" && s.level === 5 && s.version === "core-v1";
  out.noSpeedSwitch = (__qa.button("pause"), !document.querySelector('[data-k="speed"]')); __qa.button("resume");
  return out;
});
t("MC-019 old candy-v2 attempt archived verbatim and offered as 'Start this level' on new rules", mig.offer && mig.noContinue && mig.archived && mig.started, JSON.stringify(mig));
t("MC-019 legacy v1/v2 records, removed modes, unlocks and old settings kept; v3 starts empty", mig.v2 === JSON.stringify(legacy.matchV2) && mig.v1best === 650 && mig.eq === 4 && mig.cl === 2 && mig.unlocked === 7 && mig.speedSetting === true && mig.v3empty, JSON.stringify(mig));
t("MC-017 speed-bonus switch stays removed", mig.noSpeedSwitch, JSON.stringify(mig));
// FB-004-E: a sweet-v1 save (H-002-v1 build) with Rush-boosted bests, retired stickers as badge and an active attempt
const sweet = (activeLi) => ({ schemaVersion: 1, settings: { sound: false, haptics: true, speed: false, tap: false }, coach: {}, coach2: {},
  match: { unlocked: 10, stars: Array(12).fill(0), best: Array(12).fill(0) }, matchV2: { version: "candy-v2", stars: Array(12).fill(0), best: Array(12).fill(0), bestTimed: Array(12).fill(0), assisted: Array(12).fill(false) },
  matchV3: { contentVersion: "sweet-v1", records: { "sweet-v1:1": { stars: 3, best: 400, bestTimeMs: 21000, timeDetails: null, wins: 2 }, "sweet-v1:6": { stars: 3, best: 1450, bestTimeMs: 0, timeDetails: null, wins: 1 }, "sweet-v1:8": { stars: 3, best: 1572, bestTimeMs: 0, timeDetails: null, wins: 1 } },
    lessons: { "l1-pair": true, "l8-rush": true, "l6-hammer": true }, stickers: { "sweet-start": "2026-10-28", "perfect-batch": "2026-10-28", "sugar-rush": "2026-10-28", "first-spark": "2026-10-28" }, badge: "sugar-rush",
    active: null, archivedActive: [], offerStart: null }, active: null });
const mkActive = (li) => ({ version: "sweet-v1", game: (() => { const G = { mode: "match", version: "sweet-v1", li, rows: 5, cols: 5, target: LEVELS.match[li].target, quota: LEVELS.match[li].quota, moves: LEVELS.match[li].moves, movesLeft: LEVELS.match[li].moves - 1, made: 1, chainPts: 187, blastPts: 0, finish: 0,
  cells: LEVELS.match[li].values.map((v, i) => ({ id: i, v, sp: null })), nextId: 25, rng: 77, refills: 1, hammer: li >= 5 ? 1 : 0, rush: li >= 7 ? { charge: 0, uses: 3 } : null, ev: { spark: false, mix: false, rush: li >= 7, seven: false }, hints: 0, undos: 0, toolsUsed: 0, status: "playing", last: null, seq: 1, timed: false, timing: false, elapsed: 0, hist: [] };
  G.hist = [{ ...JSON.parse(JSON.stringify(G)), movesLeft: G.moves, made: 0, chainPts: 0, seq: 0, hist: undefined }]; delete G.hist[0].hist; return G; })() });
for (const li of [2, 8]) {
  const save = await ev(([li, a, b]) => { const S = eval("(" + a + ")")(li); S.matchV3.active = eval("(" + b + ")")(li); return S; }, [li, sweet.toString(), mkActive.toString()]);
  await ev((S) => { ui.game = null; ui.screen = "home"; ui.modal = null; localStorage.setItem("mathcrush.v1", JSON.stringify(S)); }, save);
  await page.reload(); await page.waitForTimeout(300);
  const m = await ev(() => {
    __qa.open("home"); const sv = __qa.saved(), v3 = sv.matchV3, home = document.body.innerText, out = {};
    out.rules = v3.rules; out.old = v3.records["sweet-v1:1"] && v3.records["sweet-v1:1"].bestTimeMs === 21000 && v3.records["sweet-v1:8"].best === 1572;
    out.r1 = v3.records["core-v1:1"]; out.r6 = v3.records["core-v1:6"]; out.r8 = v3.records["core-v1:8"];
    out.stickers = Object.keys(v3.stickers).sort().join(); out.badge = v3.badge; out.homeBadge = !!document.querySelector(".badgeimg") || /badge|sticker/i.test(home); out.unlocked = sv.match.unlocked;
    out.offer = /Start this level/.test(home); out.cont = !!document.querySelector('[data-k="continue"]'); out.archived = v3.archivedActive.length; out.damaged = false;
    if (out.cont) { document.querySelector('[data-k="continue"]').click(); const s = __qa.state(); out.resumed = { screen: s.screen, level: s.level, made: s.made, score: s.chainPts, version: s.version, keys: ["hammer", "rush", "timed", "toolsUsed"].filter((k) => k in ui.game) }; out.damaged = s.modal === "restore-error";
      __qa.act("undo"); out.undo = __qa.state().made; }
    __qa.open("levels", "classic"); out.trail = [...document.querySelectorAll(".mnode")].slice(0, 8).map((n) => n.getAttribute("aria-label"));
    __qa.open("home");
    __qa.reset(7); for (const a of __qa.solve()) __qa.act(a); out.result = document.querySelector(".scorebox").innerText;
    return out;
  });
  if (li === 2) {
    t("FB-004-E migration: stars/wins kept; L1–7 best kept; L8–12 best moved to rushBest; sweet-v1 records untouched", m.rules === "core-v1" && m.old && m.r1.stars === 3 && m.r1.best === 400 && m.r1.wins === 2 && m.r6.best === 1450 && m.r8.stars === 3 && m.r8.best === 0 && m.r8.rushBest === 1572 && m.unlocked === 10, JSON.stringify(m));
    t("FB-004-E L1–7 active attempt continues under core-v1 (hammer/Rush/clock fields dropped), Undo works, no damaged-save message", m.cont && !m.damaged && m.resumed.screen === "playing" && m.resumed.level === 2 && m.resumed.made === 1 && m.resumed.version === "core-v1" && !m.resumed.keys.length && m.undo === 0, JSON.stringify(m.resumed));
    t("MC-020 legacy stickers and badge kept verbatim in storage (inert), never shown", m.stickers === "first-spark,perfect-batch,sugar-rush,sweet-start" && m.badge === "sugar-rush" && !m.homeBadge, JSON.stringify({ stickers: m.stickers, badge: m.badge, shown: m.homeBadge }));
    t("FB-004-E map keeps earned stars", /^Level 1,.*3 of 3 stars/.test(m.trail[0]) && /^Level 6,.*3 of 3 stars/.test(m.trail[5]), JSON.stringify(m.trail));
    t("FB-004-E L8 result shows the old Rush best separately", /Best with Sugar Rush \(old rules\) 1572/.test(m.result), m.result);
  } else {
    t("FB-004-E L8–12 active attempt (Rush state) archived and offered as 'Start this level', not 'damaged'", !m.cont && m.offer && m.archived === 1 && !m.damaged, JSON.stringify({ offer: m.offer, cont: m.cont, archived: m.archived }));
  }
}
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
await p3.mouse.move(x, 830, { steps: 6 }); await p3.mouse.up(); await p3.waitForTimeout(700); // H-003-v1 MC-025: input waits for the clear to settle
const s3 = await p3.evaluate(() => __qa.state());
t("input: mouse drag 4→6→5 with backtrack, released below the board, clears", JSON.stringify(mid) === "[0,1]" && s3.made === 1 && s3.chainPts === 100, JSON.stringify({ mid, made: s3.made }));
await p3.evaluate(() => __qa.setSetting("tap", true));
const ch = await p3.evaluate(() => __qa.solve()[0].chain);
for (const i of ch) { const [cx, cy] = await center(i); await p3.mouse.click(cx, cy); await p3.waitForTimeout(80); }
await p3.click('[data-k="submit"]'); await p3.waitForTimeout(700);
t("input: tap mode, tap candies then Submit clears", (await p3.evaluate(() => __qa.state().made)) === 2);
await p3.evaluate(() => __qa.setSetting("tap", false));
const kc = await p3.evaluate(() => __qa.solve()[0].chain);
await p3.evaluate(() => document.activeElement && document.activeElement.blur());
await p3.keyboard.press("ArrowRight");
const steps = await p3.evaluate((kc) => { const out = []; let cur = 0; for (const i of kc) { const dr = Math.floor(i / 5) - Math.floor(cur / 5), dc = (i % 5) - (cur % 5); for (let k = 0; k < Math.abs(dr); k++) out.push(dr > 0 ? "ArrowDown" : "ArrowUp"); for (let k = 0; k < Math.abs(dc); k++) out.push(dc > 0 ? "ArrowRight" : "ArrowLeft"); out.push(" "); cur = i; } return out; }, kc);
for (const k of steps) await p3.keyboard.press(k === " " ? "Space" : k);
await p3.keyboard.press("Enter"); await p3.waitForTimeout(300);
t("input: keyboard arrows + Space + Enter completes the level", (await p3.evaluate(() => __qa.state().screen)) === "won");
t("no page errors (real input)", err3.length === 0, err3.join(" | "));
t("no page errors", errors.length === 0, errors.join(" | "));
await browser.close();
const passed = results.filter((r) => r.ok).length;
console.log(`\n${passed}/${results.length} passed`);
fs.writeFileSync(path.resolve(here, "engine-tests.json"), JSON.stringify({ date: new Date().toISOString(), passed, total: results.length, results }, null, 2));
process.exit(passed === results.length ? 0 : 1);
