// Night-3 checks for Pip Push: ice rule, slide animation end state, watch-par replay. node games/pip-push/qa/ice.mjs
import { chromium } from "../../../tools/node_modules/playwright/index.mjs";
import path from "node:path"; import { pathToFileURL, fileURLToPath } from "node:url";
const dir = path.dirname(fileURLToPath(import.meta.url));
const url = pathToFileURL(path.join(dir, "..", "index.html")).href;
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true });
const errs = []; p.on("pageerror", (e) => errs.push(e.stack)); p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
let fails = 0; const ok = (c, name, info = "") => { console.log(c ? "PASS" : "FAIL", name, info); if (!c) fails++; };
await p.goto(url);
const q = (f, a) => p.evaluate(f, a);
// 1. one push onto a 3-square ice strip slides 4 squares and rolls 4 times (same top back)
let st = await q(() => { const Q = window.__qa; Q.reset(15); Q.act("R"); return Q.state(); });
ok(JSON.stringify(st.dice[0]) === JSON.stringify([6, 1, 2, 3, 1]) && st.pushes === 1 && JSON.stringify(st.player) === "[2,1]", "push onto ice slides to the end, four rolls bring the top back", JSON.stringify(st));
// 2. undo after a slide restores the die in one step
st = await q(() => { const Q = window.__qa; Q.act("undo"); return Q.state(); });
ok(JSON.stringify(st.dice[0]) === JSON.stringify([2, 1, 2, 3, 1]), "one undo reverts the whole slide");
// 3. a slide stops at another die (level 20, two dice): generic check — every push in every ice level matches a model
const model = await q(() => {
  const Q = window.__qa, bad = [];
  for (let L = 15; L < Q.levels(); L++) {
    Q.reset(L); const ice = new Set(Q.ice().map(([x, y]) => x + "," + y));
    for (const a of Q.solve()) {
      const s0 = Q.state(); Q.act(a); const s1 = Q.state();
      if (s1.pushes > s0.pushes) { // find the moved die and check it stopped legally
        const i = s1.dice.findIndex((d, k) => d[0] !== s0.dice[k][0] || d[1] !== s0.dice[k][1]); const [x, y] = s1.dice[i];
        const D = { U: [0, -1], D: [0, 1], L: [-1, 0], R: [1, 0] }[a], nx = x + D[0], ny = y + D[1];
        const blocked = s1.dice.some((d) => d[0] === nx && d[1] === ny) || !Q.walk || true;
        if (ice.has(x + "," + y) && Q.walk(nx, ny) && !s1.dice.some((d) => d[0] === nx && d[1] === ny)) bad.push([L, a, x, y]); // stopped on ice with a free square ahead
      }
    }
    if (Q.state().screen !== "won") bad.push([L, "not won"]);
  }
  return bad;
});
ok(model.length === 0, "ice levels: no die ever stops on ice with a free square ahead; solve() wins all", JSON.stringify(model));
// 4. replay: solve level 17, watch par, it replays and wins again; key press takes over
st = await q(() => { const Q = window.__qa; Q.reset(16); for (const a of Q.solve()) Q.act(a); Q.act("watch"); return Q.state(); });
ok(st.replaying && st.screen === "playing" && st.moves <= 1, "Watch par restarts the level and replays", JSON.stringify(st));
await p.waitForTimeout(4000);
st = await q(() => window.__qa.state());
ok(st.screen === "won" && !st.replaying && st.pushes === await q(() => window.__qa.par()), "replay ends in a win at par", JSON.stringify(st));
await p.waitForTimeout(900);
const note = await p.textContent("#wNote"); const watchHidden = await p.evaluate(() => document.getElementById("wWatch").hidden);
ok(/par solution/.test(note) && watchHidden, "win card after a replay says so", note);
// real click on Watch par, then a tap on the board stops it
await p.click("#wWatch"); await p.waitForTimeout(450);
st = await q(() => window.__qa.state()); ok(st.replaying, "Watch par button starts replay");
await p.screenshot({ path: path.join(dir, "shot-phone-L17-replay.png") });
const box = await p.locator("#board").boundingBox(); await p.touchscreen.tap(box.x + 10, box.y + 10); await p.waitForTimeout(200);
const st2 = await q(() => window.__qa.state());
ok(!st2.replaying && st2.screen === "playing", "tap on the board takes over from the replay", JSON.stringify(st2));
await p.waitForTimeout(800);
const st3 = await q(() => window.__qa.state()); ok(st3.moves === st2.moves, "no more replay moves after taking over");
// solved record isn't touched by replays: best stays from the player's own solve
ok(errs.length === 0, "no page errors", errs.slice(0, 3).join(" | "));
await b.close(); process.exit(fails ? 1 : 0);
