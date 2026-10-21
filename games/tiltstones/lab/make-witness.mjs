// Writes deterministic solution witnesses (H-001-v1 format) for the given level ids from the solver route.
// usage: node make-witness.mjs out.json ID...
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
const here = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(here, "..", "index.html"), "utf8");
const code = html.slice(html.indexOf("// ======================= constants"), html.indexOf("// ======================= storage"));
const E = new Function(code + "\nreturn { LEVELS, newGame, solveFrom };")();
const [out, ...ids] = process.argv.slice(2);
let commit = "working tree"; try { commit = execSync("git rev-parse HEAD", { cwd: here }).toString().trim() + " (+ working tree)"; } catch (e) {}
const res = ids.map((id) => {
  const i = E.LEVELS.findIndex((L) => L.id === id);
  return { id, engineCommit: commit, actionDurationSeconds: 0.1, map: E.LEVELS[i].map, actions: E.solveFrom(E.newGame(i), 6000) };
});
writeFileSync(out, JSON.stringify(res, null, 1));
console.log("wrote", res.map((r) => `${r.id}:${r.actions.length}`).join(" "));
