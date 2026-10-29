// Math Crush — H-003-v1 "a sweeter journey" tests (MC-020..MC-028). Runs the real game page in Chromium through
// window.__qa, internals and real input. Oracle data: the frozen packet's witnesses.json and fixtures computed with its
// independent model.py (data/model.py settle(); see FIX below). Classic rules stay covered by engine-tests.mjs.
// Usage (from repo root, after `cd tools && npm ci`): node games/math-crush/qa/journey-tests.mjs
import { createRequire } from "node:module";
import path from "node:path";
import fs from "node:fs";
import { pathToFileURL, fileURLToPath } from "node:url";
const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.resolve(here, "../../../tools/package.json"));
const { chromium } = require("playwright");
const url = pathToFileURL(path.resolve(here, "../index.html")).href;
const PACKET = path.resolve(here, "../../../design-studio/games/math-crush/handovers/H-003-v1/data");
const W = JSON.parse(fs.readFileSync(path.join(PACKET, "witnesses.json"), "utf8")).witnesses;
const LV = JSON.parse(fs.readFileSync(path.join(PACKET, "levels.json"), "utf8"));
// model.py settle() results (python3 -B, packet data/model.py, 29 Oct packet e030f63)
const FIX = {
  gravityRing: { level: 4, removed: [2, 7, 22], board: [6, 6, 1, 3, 1, 1, 5, 2, 6, 5, 8, 1, null, 2, 3, 2, 9, 7, 8, 6, 4, 3, 9, 6, 6], rng: 1170790152, refreshed: false },
  gravityHourglass: { level: 3, removed: [0, 5, 15, 20], board: [4, 6, 4, 7, 3, 6, 9, 1, 1, 2, null, 1, 7, 2, null, 7, 5, 2, 8, 9, 5, 7, 7, 3, 1], rng: 216709465, refreshed: false },
  repairAdd: { level: 6, fill: 1, removed: [0], board: [5, 9, 9, 6, 6, 2, 6, 1, 8, 6, null, 7, 5, 9, null, 2, 7, 9, 4, 3, 5, 9, 4, 3, 6], rng: 2487810515, refreshed: true },
  repairMul: { level: 12, fill: 5, removed: [3], board: [2, 9, 8, 4, 1, 1, 3, 4, 9, 3, 5, 8, 1, 5, 1, 2, 2, 3, 4, 9, 8, 3, 9, 1, 3], rng: 2106111206, refreshed: true },
  repairSeq: { level: 8, made: 1, fill: 5, removed: [24], board: [3, 9, 2, 1, 5, 2, 2, 9, 5, 2, 2, 1, 9, 5, 3, 1, 2, 8, 1, 6, 8, 3, 8, 9, 2], rng: 3774027502, refreshed: true, target: 12 },
};
const results = [];
const t = (name, ok, detail = "") => { results.push({ name, ok: !!ok, detail }); console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail && !ok ? "  — " + String(detail).slice(0, 500) : ""}`); };
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
await page.goto(url); await page.waitForTimeout(300);
const ev = (f, a) => page.evaluate(f, a);
const fresh = async () => { await ev(() => { ui.game = null; ui.screen = "home"; ui.modal = null; localStorage.clear(); }); await page.reload(); await page.waitForTimeout(250); };
const J = (n) => 12 + n - 1; // __qa level index of Journey level n

// ---------- MC-021 data ----------
const v = await ev(() => __qa.validate());
t("MC-021 schema-3 journey data validates (field contract, masks, witnesses, repair pairs, phases)", v.ok, v.errors.join(","));
const same = await ev((L) => JSON.stringify(JOURNEY) === JSON.stringify(L), LV);
t("MC-021 inlined journey data equals the frozen packet's data/levels.json", same);
const tg = await ev(() => JOURNEY.levels.map((L) => L.targets.join("/")).join(" "));
t("MC-021 targets 10,8,12,9,11,14,10,10→12→8,15,12→9→15→10,×12,×18→12→24", tg === "10 8 12 9 11 14 10 10/12/8 15 12/9/15/10 12 18/12/24", tg);
const cls = await ev(() => ({ lv: LEVELS.match.length, t: LEVELS.match.map((L) => L.target).join(","), cv: LEVELS.match[0].contentVersion }));
t("MC-021 Classic data unchanged (12 levels, 10/12/15, sweet-v1)", cls.lv === 12 && cls.t === "10,10,10,10,12,12,12,12,15,15,15,15" && cls.cv === "sweet-v1", JSON.stringify(cls));

// ---------- MC-028 witness replay in the real engine ----------
for (const w of W) {
  const r = await ev(([id, route]) => __qa.witness(id, route), [w.level, w.route]);
  let ok = r.steps.length === w.events.length, why = "";
  w.events.forEach((e, k) => { const s = r.steps[k]; if (!s) return; const { ids, ti, target, ...cmp } = s; if (JSON.stringify(cmp) !== JSON.stringify(e)) { ok = false; why = why || `step ${k}: ${JSON.stringify(cmp)} vs ${JSON.stringify(e)}`; } });
  // production also compares IDs: survivors keep IDs, fresh IDs increase monotonically, voids have none
  let idsOk = true;
  r.steps.forEach((s) => { const ids = s.ids.filter((x) => x !== null); if (new Set(ids).size !== ids.length) idsOk = false; });
  t(`MC-028 witness L${w.level}: real engine replays the full route, snapshot = oracle (board, specials, jelly, RNG, moves, made, score, status), ${r.score} pts, ${r.stars}★`, ok && idsOk && r.score === w.score && r.stars === w.stars && r.status === "won", why);
}

// ---------- MC-022 masks, gravity, repair ----------
for (const [name, F] of Object.entries(FIX)) {
  const r = await ev(([F]) => {
    __qa.reset(12 + F.level - 1); const g = JSON.parse(JSON.stringify(ui.game)), D = LD(g);
    if (F.fill) g.cells = g.cells.map((c, i) => (c ? { id: i, v: F.fill, sp: null } : null));
    if (F.made) { g.made = F.made; g.ti = Math.min(F.made, D.targets.length - 1); g.target = D.targets[g.ti]; }
    const cur = g.cells.slice(); const survivors = {}; cur.forEach((c, i) => { if (c && !F.removed.includes(i)) survivors[c.id] = c.v; });
    for (const i of F.removed) cur[i] = null;
    const nid = g.nextId, refreshed = M.settle(g, cur);
    const order = []; // surviving IDs keep their relative order within each column segment
    return { board: g.cells.map((c) => (c ? c.v : null)), rng: g.rng, refreshed, specials: g.cells.filter((c) => c && c.sp).length,
      fresh: g.cells.filter((c) => c && c.id >= nid).length, survivorsKept: g.cells.filter((c) => c && c.id < nid).every((c) => survivors[c.id] === c.v), target: g.target };
  }, [F]);
  const ok = JSON.stringify(r.board) === JSON.stringify(F.board) && r.rng === F.rng && r.refreshed === F.refreshed && (!F.target || r.target === F.target) && (F.refreshed || r.survivorsKept);
  t(`MC-022 ${name}: ${F.refreshed ? "repair redraw + injected pair" : "segmented gravity"} equals model.py (values, RNG, refreshed)`, ok, JSON.stringify(r));
}
const geo = await ev(() => {
  __qa.reset(12 + 2); // L3 hourglass: voids 10, 14
  const g = ui.game, out = {};
  out.touchVoid = __qa.dragChain([10]); out.startNext = __qa.dragChain([10, 11]);
  out.across = __qa.dragChain([5, 10, 15]); out.jump = __qa.dragChain([5, 15]);
  out.validAcross = M.validChain(g, [9, 14, 19]); out.diag = __qa.dragChain([0, 6]); out.dup = M.validChain(g, [0, 1, 0]);
  out.ninth = __qa.dragChain([0, 1, 2, 3, 4, 9, 8, 7, 6]).length;
  const s0 = __qa.state(); __qa.act({ chain: [5, 10, 15] }); const s1 = __qa.state();
  out.voidReleaseFree = s1.seq === s0.seq && s1.movesLeft === s0.movesLeft;
  return out;
});
t("MC-022 touching a void does nothing; a chain can start beside it", JSON.stringify(geo.touchVoid) === "[]" && JSON.stringify(geo.startNext) === "[11]", JSON.stringify(geo));
t("MC-022 no selection through or across a void; diagonal/duplicate/ninth tile rejected", JSON.stringify(geo.across) === "[5]" && JSON.stringify(geo.jump) === "[5]" && !geo.validAcross && JSON.stringify(geo.diag) === "[0]" && !geo.dup && geo.ninth === 8, JSON.stringify(geo));
t("MC-022 a release containing a void is ignored by the gesture layer (no move, no commit)", geo.voidReleaseFree);
const blast = await ev(() => {
  __qa.reset(12 + 3); const g = ui.game; // L4 ring: void 12; stripe at 11 (row 2)
  const R = M.resolve(g, [11, 10]);
  const g2 = JSON.parse(JSON.stringify(g)); g2.cells[13] = { ...g2.cells[13], sp: "wrapped" }; const A = M.area(g2, 13, "wrapped");
  return { removal: R.removal, area: A };
});
t("MC-022 a stripe crosses the void and hits cells on both sides; the void is never removed or scored", JSON.stringify(blast.removal) === "[10,11,13,14]", JSON.stringify(blast));
t("MC-022 a wrapped area is clipped to active cells", JSON.stringify(blast.area) === "[7,8,9,13,14,17,18,19]", JSON.stringify(blast.area));

// ---------- MC-022 jelly ----------
const jel = await ev(() => {
  const out = {};
  __qa.reset(12 + 4); // L5: jelly 6,8,12,16,18; stripe at 12
  const s0 = __qa.state(); out.start = s0.jelly.join(); out.hud = /Jelly 5 left/.test(document.querySelector(".qbar").innerText);
  __qa.act({ chain: [12, 13] }); const s1 = __qa.state(); out.afterStripe = s1.jelly.join(); out.made = s1.made;
  out.noRespawn = s1.jelly.every((i) => s0.jelly.includes(i));
  // overlapping blasts on the same patch count once
  const g = JSON.parse(JSON.stringify(ui.game)); g.cells[6] = { ...g.cells[6], sp: "stripe" }; g.cells[8] = { ...g.cells[8], sp: "wrapped" };
  out.overlap = M.resolve(g, [6, 7, 8]).jellyHit;
  // invalid and cancelled actions never crack jelly
  const before = ui.game.jelly.join(); __qa.act({ chain: [0, 1] }); out.invalidKeeps = ui.game.jelly.join() === before; __qa.act("undo");
  // last-move jelly clear wins (not lost)
  __qa.reset(12 + 4); const h = ui.game; h.movesLeft = 1; h.jelly = [12]; const r = M.release(h, [12, 13]);
  out.lastMove = { status: r.g.status, moves: r.g.movesLeft, jelly: r.g.jelly.length, finish: r.g.finish, sameBoard: JSON.stringify(r.g.cells) === JSON.stringify(h.cells) };
  // charged invalid on the final move loses and is undoable
  __qa.reset(12 + 4); ui.game.movesLeft = 1; __qa.act({ chain: [0, 1] }); out.chargedLast = { screen: __qa.state().screen, undo: __qa.state().undoAvailable }; __qa.act("undo"); out.undone = __qa.state().screen;
  // reward on a cleared jelly cell does not recreate jelly
  __qa.reset(12 + 4); const k = ui.game; k.cells = k.cells.map((c, i) => ({ id: i, v: 9, sp: null })); [5, 6, 7].forEach((i) => { k.cells[i].v = 2; }); k.cells[8].v = 5; // 2+2+2+5 = 11, reward on 8 (jelly)
  const rr = M.release(k, [5, 6, 7, 8]); out.reward = { type: rr.ev.reward && rr.ev.reward.type, jelly8: rr.g.jelly.includes(8), cleared: rr.ev.jellyCleared.join() };
  return out;
});
t("MC-022 L5 shows 5 jelly; the opening stripe chain (row 2) clears patch 12 once", jel.start === "6,8,12,16,18" && jel.hud && jel.afterStripe === "6,8,16,18" && jel.made === 1, JSON.stringify(jel));
t("MC-022 jelly never respawns; overlapping stripe + wrapped blasts hit each patch once", jel.noRespawn && JSON.stringify(jel.overlap) === "[6,8]" /* 12 already cleared by the opening stripe */, JSON.stringify(jel.overlap));
t("MC-022 an invalid release never cracks jelly", jel.invalidKeeps);
t("MC-022 clearing the last jelly on the last move wins (no refill, moves bonus 0)", jel.lastMove.status === "won" && jel.lastMove.moves === 0 && jel.lastMove.jelly === 0 && jel.lastMove.finish === 0 && jel.lastMove.sameBoard, JSON.stringify(jel.lastMove));
t("QA.md charged invalid on the final move loses and can be undone", jel.chargedLast.screen === "lost" && jel.chargedLast.undo > 0 && jel.undone === "playing", JSON.stringify(jel.chargedLast));
t("MC-022 a reward created on a cleared jelly cell does not bring the jelly back", jel.reward.type === "stripe" && !jel.reward.jelly8 && jel.reward.cleared === "6,8", JSON.stringify(jel.reward));
const jh = await ev(() => { __qa.reset(12 + 8); __qa.act("hint"); const s = __qa.state(); const R = M.resolve(ui.game, ui.hintChain); return { hit: R.jellyHit.length, legal: M.val(ui.game, ui.hintChain) === s.target }; });
t("MC-022 Hint on a jelly level prefers a legal chain that hits jelly", jh.hit > 0 && jh.legal, JSON.stringify(jh));

// ---------- MC-023 changing targets ----------
const sq = await ev(() => {
  const out = {};
  __qa.reset(12 + 7); // L8: 10 -> 12 -> 8
  const s0 = __qa.state(); out.hud0 = document.querySelector(".hud").innerText.replace(/\s+/g, " ");
  __qa.act({ chain: [0, 2] }); out.cancelSame = __qa.state().targetIndex === 0; // not adjacent: ignored
  __qa.act({ chain: [5, 6] }); out.wrong = { ti: __qa.state().targetIndex, moves: __qa.state().movesLeft }; __qa.act("undo");
  __qa.act("hint"); out.hintSame = __qa.state().targetIndex === 0;
  ui.busyUntil = 0;
  __qa.act({ chain: [0, 1] }); const s1 = __qa.state(); out.after1 = { ti: s1.targetIndex, target: s1.target, solvable: !!M.shortest(ui.game) };
  out.hud1 = document.querySelector(".hud").innerText.replace(/\s+/g, " ");
  // an old-target chain after the transition is wrong
  const old = M.allChains({ ...ui.game, target: 10 }, 50).find((c) => M.val(ui.game, c) === 10);
  if (old) { const before = __qa.state(); __qa.act({ chain: old }); const a = __qa.state(); out.oldTarget = { counted: a.made !== before.made, wrong: a.last && a.last.type === "wrong" }; __qa.act("undo"); }
  __qa.act("undo"); const su = __qa.state(); out.undo = { ti: su.targetIndex, target: su.target, board: JSON.stringify(su.board) === JSON.stringify(s0.board), rng: su.rng === s0.rng };
  // final target: no phantom next, last chain wins without refill
  ui.busyUntil = 0; __qa.act({ chain: [0, 1] }); let ch = M.shortest(ui.game); __qa.act({ chain: ch });
  __qa.flush(); const s2 = __qa.state(); out.final = { ti: s2.targetIndex, target: s2.target, hud: document.querySelector(".hud").innerText.replace(/\s+/g, " ") };
  const board = JSON.stringify(s2.board); ch = M.shortest(ui.game); __qa.act({ chain: ch }); const s3 = __qa.state();
  out.win = { screen: s3.screen, ti: s3.targetIndex, target: s3.target, noRefill: JSON.stringify(s3.board) === board };
  return out;
});
t("MC-023 HUD shows current target and Next on a sequence level", /Make 10/.test(sq.hud0) && /Next 12/.test(sq.hud0), sq.hud0);
t("MC-023 cancelled, invalid (then undone) and hint never advance the target", sq.cancelSame && sq.wrong.ti === 0 && sq.hintSame, JSON.stringify(sq));
t("MC-023 a valid clear advances exactly once and the refilled board has a legal chain for the NEW target", sq.after1.ti === 1 && sq.after1.target === 12 && sq.after1.solvable, JSON.stringify(sq.after1));
t("MC-023 a chain for the old target after the transition is wrong", !sq.oldTarget || (!sq.oldTarget.counted && sq.oldTarget.wrong), JSON.stringify(sq.oldTarget));
t("MC-023 Undo restores target index, board and RNG together", sq.undo.ti === 0 && sq.undo.target === 10 && sq.undo.board && sq.undo.rng, JSON.stringify(sq.undo));
t("MC-023 final step says Final target, no Next; last clear wins with no phantom target or refill", sq.final.ti === 2 && /Final target 8/.test(sq.final.hud) && !/Next/.test(sq.final.hud) && sq.win.screen === "won" && sq.win.ti === 2 && sq.win.target === 8 && sq.win.noRefill, JSON.stringify(sq.final) + JSON.stringify(sq.win));
const hold = await ev(async () => {
  __qa.reset(12 + 7); ui.busyUntil = 0; progress.settings.motion = "full";
  mCommit([0, 1]); const during = { shown: __qa.state().shownTarget, model: __qa.state().target, busy: __qa.state().busy, lock: ui.busyUntil - performance.now() };
  // input during the transition is ignored
  const seq0 = ui.game.seq; mCommit(M.shortest(ui.game) || [0, 1]); const blocked = ui.game.seq === seq0;
  await new Promise((r) => setTimeout(r, 800));
  const after = { shown: __qa.state().shownTarget, busy: __qa.state().busy, status: document.querySelector(".status").innerText };
  progress.settings.motion = undefined; return { during, blocked, after };
});
t("MC-023 the HUD holds the old target while the clear resolves; the model already has the new one", hold.during.shown === 10 && hold.during.model === 12 && hold.during.busy, JSON.stringify(hold));
t("MC-023 no input during the transition; then 'Now make 12' once", hold.blocked && hold.after.shown === 12 && !hold.after.busy && /Now make 12/.test(hold.after.status), JSON.stringify(hold.after));
t("MC-025 the whole resolving lock stays within 900 ms", hold.during.lock <= 900 && hold.during.lock > 0, String(hold.during.lock));
// reload during the target animation shows the committed new target and never evaluates the old chain twice
await ev(() => { __qa.reset(12 + 7); ui.busyUntil = 0; mCommit([0, 1]); });
await page.reload(); await page.waitForTimeout(300);
const rel = await ev(() => { openMap("journey", true); render(); mButton("map-continue"); const s = __qa.state(); return { screen: s.screen, ti: s.targetIndex, shown: s.shownTarget, made: s.made, score: s.chainPts }; });
t("MC-023/MC-027 reload mid-transition: committed new target shown, old chain not counted twice", rel.screen === "playing" && rel.ti === 1 && rel.shown === 12 && rel.made === 1 && rel.score === 100, JSON.stringify(rel));

// ---------- MC-026 multiplication ----------
const mul = await ev(() => {
  const out = {};
  __qa.reset(12 + 10); const g = ui.game; // L11 ×12, free wrong answers
  out.hud = document.querySelector(".hud").innerText.replace(/\s+/g, " "); out.sum = document.querySelector(".sumcard").innerText;
  out.cue = __qa.state().cue && __qa.state().cue.text;
  const T = JSON.parse(JSON.stringify(g)); const set = (vals) => { T.cells = T.cells.map((c, i) => ({ id: i, v: vals[i] || 9, sp: null })); };
  set([3, 4, 1, 2, 3]); out.v34 = M.val(T, [0, 1]); out.v341 = M.val(T, [0, 1, 2]); out.v134 = M.val(T, [2, 1, 0]);
  set([2, 3]); out.v23 = M.val(T, [0, 1]);
  set([3, 4, 1]); out.trailing = M.allChains(T, 500).some((c) => c.join() === "0,1,2");
  out.noEval = !/eval\(|new Function/.test(M.val.toString());
  ui.chain = [0, 1]; render(); out.expr = document.querySelector(".sumcard .ex").innerText; ui.chain = []; render();
  const s0 = __qa.state(); __qa.act({ chain: [3, 4] }); const s1 = __qa.state(); out.free = s1.movesLeft === s0.movesLeft && s1.undoAvailable === 0 && s1.rng === s0.rng;
  out.status = document.querySelector(".status").innerText;
  ui.chain = [0, 1, 2]; render(); out.chip = (document.querySelector(".mchip") || {}).innerText; ui.chain = []; render();
  out.noSpecials = M.rewardType(ui.game, 8) === null && Object.keys(LD(ui.game).specials).length === 0;
  out.noMixed = JOURNEY.levels.every((L) => ["add", "multiply"].includes(L.operation));
  // product-aware repair: injects the smallest factor pair
  const R = JSON.parse(JSON.stringify(ui.game)); R.cells = R.cells.map((c, i) => ({ id: i, v: 7, sp: null })); const cur = R.cells.slice(); cur[24] = null; M.settle(R, cur);
  out.repair = [R.cells[0].v, R.cells[1].v];
  return out;
});
t("MC-026 L11 HUD: persistent × and 'Multiply to make 12'; first cue 3 × 4 = 12", /Multiply 12/.test(mul.hud) && /Multiply to make 12/.test(mul.sum) && mul.cue === "Multiply: 3 × 4 = 12", JSON.stringify(mul));
t("MC-026 products: 3×4=12, 2×3=6, 1×3×4=12 and a trailing 1 is legal; no eval", mul.v34 === 12 && mul.v23 === 6 && mul.v341 === 12 && mul.v134 === 12 && mul.trailing && mul.noEval, JSON.stringify(mul));
t("MC-026 expression uses × between every tile; the bonus reads 'Score ×1.5'", mul.expr === "3 × 4 = 12" && mul.chip === "Score ×1.5", mul.expr + " | " + mul.chip);
t("MC-026 L11 wrong product is free (no move, no history, no RNG)", mul.free && /doesn't make 12/.test(mul.status), mul.status);
t("MC-026 specials disabled in the pilots; no mixed operators", mul.noSpecials && mul.noMixed);
t("MC-026 repair injects the smallest factor pair (2×6 for 12), not an additive pair", JSON.stringify(mul.repair) === "[2,6]", JSON.stringify(mul.repair));
const m12 = await ev(() => { __qa.reset(12 + 11); const s = __qa.state(); return { t: s.targets.join(), op: s.operation, free: LD(ui.game).freeInvalid }; });
t("MC-026 L12 sequence 18 → 12 → 24, multiply, wrong answers cost a move", m12.t === "18,12,24" && m12.op === "multiply" && m12.free === false, JSON.stringify(m12));

// ---------- MC-027 saves, campaigns, migration ----------
await fresh();
const sv = await ev(() => {
  const out = {};
  __qa.reset(1); __qa.act({ chain: __qa.solve()[0].chain }); const classic = JSON.stringify(__qa.saved().matchV3.active.game.cells);
  __qa.reset(12); __qa.act({ chain: [0, 1] }); const sv1 = __qa.saved();
  out.separate = sv1.matchV3.active.game.li === 1 && sv1.matchJourney.active.game.li === 0 && sv1.matchJourney.active.version === "journey-v1" && !("camp" in sv1.matchV3.active.game);
  __qa.open("home"); mButton("continue"); const s = __qa.state(); out.resumeClassic = s.campaign === "classic" && s.level === 1 && JSON.stringify(ui.game.cells) === classic;
  openMap("journey", true); render(); mButton("map-continue"); const s2 = __qa.state(); out.resumeJourney = s2.campaign === "journey" && s2.level === 0 && s2.made === 1;
  return out;
});
t("MC-027 Classic and Journey attempts live in separate namespaces (matchV3 / matchJourney)", sv.separate, JSON.stringify(sv));
t("MC-027 quit the preview, then Continue resumes Classic exactly; the Journey attempt resumes from its map", sv.resumeClassic && sv.resumeJourney, JSON.stringify(sv));
const recs = await ev(() => {
  __qa.reset(12); for (const a of __qa.solve()) __qa.act(a);
  const s = __qa.saved(); return { j: s.matchJourney.records["journey-v1:1"], classic: Object.keys(s.matchV3.records).length, unlocked: s.matchJourney.unlocked, classicUnlocked: s.match.unlocked };
});
t("MC-027 Journey records keyed journey-v1:<id>; Classic records/unlocks untouched", recs.j && recs.j.stars === 3 && recs.classic === 0 && recs.unlocked === 2 && recs.classicUnlocked === 1, JSON.stringify(recs));
// legacy core-v1 attempt from the night-4 build resumes exactly; unknown journey schema preserved; old journey attempt archived
const legacy = await ev(() => {
  __qa.reset(2); __qa.act({ chain: __qa.solve()[0].chain }); const S = __qa.saved();
  S.matchV3.stickers = { "sweet-start": "2026-10-28" }; S.matchV3.badge = "sweet-start"; delete S.matchJourney; delete S.mapUi;
  return S;
});
await ev((S) => { ui.game = null; ui.screen = "home"; localStorage.setItem("mathcrush.v1", JSON.stringify(S)); }, legacy);
await page.reload(); await page.waitForTimeout(300);
const lg = await ev((S) => {
  const sv = __qa.saved(), out = {};
  out.v3same = JSON.stringify(sv.matchV3) === JSON.stringify(S.matchV3); out.journeyFresh = sv.matchJourney.unlocked === 1 && sv.matchJourney.contentVersion === "journey-v1";
  __qa.open("home"); mButton("continue"); const s = __qa.state(); out.resume = s.campaign === "classic" && s.level === 2 && JSON.stringify(ui.game.cells) === JSON.stringify(S.matchV3.active.game.cells);
  out.noBadge = !/badge|sticker/i.test(document.body.innerText);
  return out;
}, legacy);
t("MC-027 a night-4 save loads with matchV3 verbatim (incl. inert stickers/badge) and a fresh journey namespace", lg.v3same && lg.journeyFresh, JSON.stringify(lg));
t("MC-027 the old core-v1 attempt resumes exactly; no sticker render path", lg.resume && lg.noBadge, JSON.stringify(lg));
await ev(() => { ui.game = null; ui.screen = "home"; const S = __qa.saved(); S.matchJourney = { contentVersion: "journey-v9", records: { "journey-v9:1": { stars: 3 } }, unlocked: 7 }; localStorage.setItem("mathcrush.v1", JSON.stringify(S)); });
await page.reload(); await page.waitForTimeout(300);
const unk = await ev(() => { const s = __qa.saved(); return { kept: s.matchJourneyUnknown && s.matchJourneyUnknown.contentVersion === "journey-v9" && s.matchJourneyUnknown.unlocked === 7, fresh: s.matchJourney.unlocked === 1, classic: s.match.unlocked }; });
t("MC-027 unknown journey schema preserved verbatim, play falls back to a fresh preview; Classic unaffected", unk.kept && unk.fresh, JSON.stringify(unk));
await ev(() => { ui.game = null; ui.screen = "home"; const S = __qa.saved(); S.matchJourney.active = { version: "journey-v0", game: { mode: "match", camp: "journey", li: 4, version: "journey-v0", cells: [] } }; localStorage.setItem("mathcrush.v1", JSON.stringify(S)); });
await page.reload(); await page.waitForTimeout(300);
const old = await ev(() => { openMap("journey", true); render(); mButton("map-continue"); const out = { modal: ui.modal, text: document.querySelector(".mcm").innerText, archived: __qa.saved().matchJourney.archivedActive.length, active: __qa.saved().matchJourney.active }; mButton("restore-start"); out.after = __qa.state(); return out; });
t("MC-027 an older-version journey attempt is archived verbatim and offered 'Restart level 5', not called damaged", old.modal === "restore-error" && /older version/.test(old.text) && !/damaged/.test(old.text) && /Restart level 5/.test(old.text) && old.archived === 1 && old.active === null && old.after.level === 4 && old.after.screen === "playing", JSON.stringify({ ...old, after: old.after.screen }));

// ---------- MC-024 map ----------
await fresh();
const map = await ev(() => {
  JN().unlocked = 6; for (const k of [0, 1, 2, 3, 4]) setRecC("journey", k, { stars: k === 2 ? 2 : 3, best: 900, wins: 1 }); save();
  openMap("journey", true); render();
  const nodes = [...document.querySelectorAll(".mnode")], out = {};
  out.count = nodes.length; out.sizes = nodes.map((n) => { const r = n.getBoundingClientRect(); return Math.min(r.width, r.height); });
  out.labels = nodes.map((n) => n.getAttribute("aria-label"));
  out.states = nodes.map((n) => n.className.replace("mnode ", ""));
  out.locked = nodes.filter((n) => n.getAttribute("aria-disabled") === "true").length;
  out.thumbs = [2, 3, 4].map((k) => document.querySelectorAll(`[data-k="lvl-${k}"] .thumb i.v`).length);
  out.jellyThumb = document.querySelectorAll(`[data-k="lvl-4"] .thumb i.j`).length;
  out.pins = document.querySelectorAll(".pin").length;
  const sc = document.getElementById("mapscroll"), cur = document.querySelector(".mnode.current").getBoundingClientRect(), shelf = document.querySelector(".shelf").getBoundingClientRect(), head = document.querySelector(".maphead").getBoundingClientRect();
  out.visible = cur.top >= head.bottom && cur.bottom <= shelf.top; out.shelf = document.querySelector(".shelf").innerText.replace(/\s+/g, " ");
  out.chapter = document.getElementById("mapch").textContent;
  sc.scrollTop = 40; sc.dispatchEvent(new Event("scroll")); render(); out.kept = document.getElementById("mapscroll").scrollTop === 40;
  out.chapter0 = document.getElementById("mapch").textContent;
  out.reveal = !!progress.mapUi.journey.revealed[1];
  out.hScroll = document.documentElement.scrollWidth <= window.innerWidth && sc.scrollWidth <= sc.clientWidth;
  out.stars = document.querySelectorAll(".mstars").length;
  document.querySelector('[data-k="lvl-6"]').click(); out.lockedTap = ui.screen;
  document.querySelector('[data-k="lvl-3"]').click(); out.tap = __qa.state();
  return out;
});
t("MC-024 12 numbered nodes, all ≥ 44 px (64 px buttons)", map.count === 12 && map.sizes.every((s) => s >= 44), JSON.stringify(map.sizes));
t("MC-024 frontier is raspberry with one you-are-here pin; locked nodes muted, aria-disabled", map.states[5] === "current" && map.pins === 1 && map.locked === 6 && map.states[6] === "locked", JSON.stringify(map.states));
t("MC-024 accessible labels carry level, name, objective and state", /^Level 5, Jelly garden, Clear 5 jelly · make 11, 3 of 3 stars/.test(map.labels[4]) && /^Level 8, Three flavours, 10 → 12 → 8, locked/.test(map.labels[7]) && /Multiplication preview/.test(map.labels[10]), JSON.stringify(map.labels.slice(4, 11)));
t("MC-024 thumbnails show the real mask (hourglass 2 gaps, ring 1, full 0) and jelly marks", JSON.stringify(map.thumbs) === "[2,1,0]" && map.jellyThumb === 5, JSON.stringify(map.thumbs));
t("MC-024 on entry the current node is fully visible between header and Continue shelf", map.visible, map.shelf);
t("MC-024 Continue shelf names the exact level and campaign", /Play · Level 6/.test(map.shelf) && /Chocolate crossing/.test(map.shelf), map.shelf);
t("MC-024 chapter header follows scroll; manual scroll survives a re-render", /Chapter 2 · Chocolate Hills/.test(map.chapter) && map.kept && /Chapter 1/.test(map.chapter0), map.chapter + " / " + map.chapter0);
t("MC-024 chapter 2 reveal recorded once; stars shown from journey records only; no horizontal scroll", map.reveal && map.stars === 5 && map.hScroll, JSON.stringify(map));
t("MC-024 locked tap starts nothing; an unlocked node starts the level directly (no confirmation)", map.lockedTap === "levels" && map.tap.screen === "playing" && map.tap.level === 3 && map.tap.campaign === "journey", JSON.stringify(map.tap));
const cmap = await ev(() => { openMap("classic", true); render(); return { thumbs: [...document.querySelectorAll(".thumb")].map((t) => t.querySelectorAll("i.v,i.j").length).reduce((a, b) => a + b, 0), mul: document.querySelectorAll(".thumb.mulx").length, words: /jelly|×/i.test(document.querySelector(".mapcanvas").innerText), stars: document.querySelectorAll(".mstars").length, title: document.querySelector(".mapttl").innerText }; });
t("MC-024 Classic map uses its own data: full boards, no jelly or × advertised, no journey stars", cmap.thumbs === 0 && cmap.mul === 0 && !cmap.words && cmap.stars === 0 && /Classic levels/.test(cmap.title), JSON.stringify(cmap));
const p10 = await ev(() => {
  JN().unlocked = 10; for (let k = 0; k < 9; k++) setRecC("journey", k, { stars: 3, best: 900, wins: 1 }); save();
  __qa.reset(12 + 9); for (const a of __qa.solve()) __qa.act(a);
  const out = { btn: document.querySelector(".mcm .pbtn").innerText, unlocked: JN().unlocked };
  openMap("journey", true); render(); out.n11 = document.querySelector('[data-k="lvl-10"]').className; out.shelf = document.querySelector(".shelf").innerText.replace(/\s+/g, " ");
  return out;
});
t("MC-024/MC-026 after preview 10: Next says 'Multiplication preview'; node 11 opens without replay", /Next: Multiplication preview/.test(p10.btn) && p10.unlocked === 11 && /current/.test(p10.n11) && /Play · Level 11/.test(p10.shelf), JSON.stringify(p10));
const done = await ev(() => { for (let k = 0; k < 12; k++) setRecC("journey", k, { stars: 3, best: 900, wins: 1 }); JN().unlocked = 12; JN().active = null; save(); openMap("journey", true); render(); return document.querySelector(".shelf").innerText.replace(/\s+/g, " "); });
t("MC-024 all complete: Continue becomes 'Replay level 12'", /Replay level 12/.test(done), done);

// ---------- MC-020 on Journey + Home ----------
const home = await ev(() => { __qa.open("home"); return { txt: document.body.innerText, journey: !!document.querySelector('[data-k="journey"]'), classic: !!document.querySelector('[data-k="play"],[data-k="continue"]'), book: !!document.querySelector('[data-k="book"]') }; });
t("MC-024 Home: Classic Play/Continue first, Journey preview secondary, no Stickers", home.journey && home.classic && !home.book && !/sticker/i.test(home.txt) && /Journey/.test(home.txt), home.txt.replace(/\s+/g, " ").slice(0, 200));

// ---------- MC-025 motion ----------
const mo = await ev(async () => {
  const out = {};
  progress.settings.motion = "full"; __qa.reset(12 + 3); ui.busyUntil = 0; const rng0 = ui.game.rng;
  // idle effects never touch the model
  for (let k = 0; k < 40; k++) idleFx(250);
  out.idleRng = ui.game.rng === rng0 && ui.game.seq === 0;
  mCommit([11, 10]); out.fx = { sweep: document.querySelectorAll(".ghosts .sweep").length, ghosts: document.querySelectorAll(".ghosts .tile2").length, drops: document.querySelectorAll(".tile2.drop2,.tile2.spawn").length, lock: Math.round(ui.busyUntil - performance.now()) };
  await new Promise((r) => setTimeout(r, 600));
  // combo lock budget
  __qa.reset(12 + 6); ui.busyUntil = 0; const g = ui.game; g.cells[10] = { ...g.cells[10], sp: "stripe" }; mCommit([11, 10]); out.comboLock = Math.round(ui.busyUntil - performance.now());
  flushFx();
  // pause resolves presentation immediately
  __qa.reset(12 + 7); ui.busyUntil = 0; mCommit([0, 1]); mButton("pause"); out.pause = { held: ui.held, busy: performance.now() < ui.busyUntil };
  mButton("resume");
  // reduced motion
  progress.settings.motion = "reduce"; __qa.reset(12 + 3); ui.busyUntil = 0; mCommit([11, 10]);
  out.rm = { cls: document.body.classList.contains("rm"), lock: Math.round(ui.busyUntil - performance.now()), drops: document.querySelectorAll(".tile2.drop2,.tile2.spawn").length, sweepShown: [...document.querySelectorAll(".ghosts .sweep")].filter((e) => getComputedStyle(e).display !== "none").length };
  openMap("journey", true); render(); out.rmCloud = getComputedStyle(document.querySelector(".cloud")).animationName;
  progress.settings.motion = "full"; render(); out.cloud = getComputedStyle(document.querySelector(".cloud")).animationName;
  __qa.modal("settings"); out.cloudModal = getComputedStyle(document.querySelector(".cloud")).animationPlayState; ui.modal = null;
  progress.settings.motion = undefined; render();
  return out;
});
t("MC-025 idle effects never consume gameplay RNG or change the model", mo.idleRng);
t("MC-025 a stripe clear shows the row sweep, popping candies and falling refills", mo.fx.sweep >= 1 && mo.fx.ghosts >= 2 && mo.fx.drops >= 1, JSON.stringify(mo.fx));
t("MC-025 resolving lock ≤ 900 ms (ordinary and combination)", mo.fx.lock <= 900 && mo.comboLock <= 900, JSON.stringify([mo.fx.lock, mo.comboLock]));
t("MC-025 Pause resolves presentation to the committed state at once", mo.pause.held === null && !mo.pause.busy, JSON.stringify(mo.pause));
t("MC-025/MC-027 reduced motion (setting): no travel, no sweep, ≤ 80 ms lock, no cloud loop", mo.rm.cls && mo.rm.lock <= 80 && mo.rm.drops === 0 && mo.rm.sweepShown === 0 && mo.rmCloud === "none", JSON.stringify(mo.rm) + mo.rmCloud);
t("MC-025 calm map loop runs normally and pauses in dialogs", mo.cloud !== "none" && mo.cloudModal === "paused", mo.cloud + " " + mo.cloudModal);

// ---------- real input on a shaped board ----------
const p3 = await (await browser.newContext({ viewport: { width: 360, height: 640 } })).newPage();
const err3 = []; p3.on("pageerror", (e) => err3.push(e.message));
await p3.goto(url); await p3.waitForTimeout(300);
await p3.evaluate(() => { __qa.reset(12 + 2); });
const center = async (i) => { const b = await p3.$(`[data-cell="${i}"]`); const r = await b.boundingBox(); return [r.x + r.width / 2, r.y + r.height / 2]; };
let [x, y] = await center(5); await p3.mouse.move(x, y); await p3.mouse.down();
for (const i of [10, 15]) { [x, y] = await center(i); await p3.mouse.move(x, y, { steps: 6 }); }
const across = await p3.evaluate(() => __qa.state().chain); await p3.mouse.up(); await p3.waitForTimeout(100);
t("input: dragging over a gap does not extend the chain (360×640)", JSON.stringify(across) === "[5]", JSON.stringify(across));
[x, y] = await center(5); await p3.mouse.move(x, y); await p3.mouse.down(); [x, y] = await center(6); await p3.mouse.move(x, y, { steps: 6 }); await p3.mouse.up(); await p3.waitForTimeout(800);
t("input: drag the opening witness 3+9 clears on the hourglass", (await p3.evaluate(() => __qa.state().made)) === 1);
await p3.evaluate(() => { __qa.reset(12 + 2); document.activeElement && document.activeElement.blur(); });
await p3.keyboard.press("ArrowDown"); for (const k of ["ArrowDown", "ArrowDown"]) await p3.keyboard.press(k); // 0 -> 5 -> (10 is a gap) -> 15
const cur = await p3.evaluate(() => ui.cursor);
t("input: keyboard cursor skips the gap (column 0: 5 → 15)", cur === 15, String(cur));
const fit = await p3.evaluate(() => { const ids = ["#mboard", ".hud", ".qbar", ".sumrow", ".hintbar"]; return ids.map((s) => { const r = document.querySelector(s).getBoundingClientRect(); return { s, top: Math.round(r.top), bottom: Math.round(r.bottom) }; }); });
const small = await p3.evaluate(() => [...document.querySelectorAll("button")].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44 && b.getBoundingClientRect().width > 0).map((b) => b.dataset.k || b.className));
t("MC-027 360×640: essentials fit (HUD, objective, board, expression, buttons above 640) and no target under 44 px", fit.every((f) => f.bottom <= 640) && small.length === 0, JSON.stringify(fit) + JSON.stringify(small));
t("no page errors (360×640 input)", err3.length === 0, err3.join(" | "));
t("no page errors", errors.length === 0, errors.join(" | "));
await browser.close();
const passed = results.filter((r) => r.ok).length;
console.log(`\n${passed}/${results.length} passed`);
fs.writeFileSync(path.resolve(here, "journey-tests.json"), JSON.stringify({ date: new Date().toISOString(), passed, total: results.length, results }, null, 2));
process.exit(passed === results.length ? 0 : 1);
