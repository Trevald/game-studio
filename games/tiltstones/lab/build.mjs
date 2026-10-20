// Injects lab/levels.json into index.html between the LAB:BEGIN / LAB:END markers.
// usage: node games/tiltstones/lab/build.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const here = dirname(fileURLToPath(import.meta.url));
const levels = JSON.parse(readFileSync(join(here, "levels.json"), "utf8"));
for (const L of levels) {
  const w = L.map[0].length;
  L.map.forEach((r, i) => { if (r.length !== w) throw new Error(`${L.id} row ${i} has ${r.length} cols, expected ${w}`); });
  if (L.map.join("").split("o").length !== 2) throw new Error(`${L.id} needs exactly one start 'o'`);
}
const keep = ["id", "name", "family", "idea", "hint", "motion", "blueReturnSeal", "map"];
const fmtL = (L) => {
  const head = keep.filter((k) => k !== "map" && L[k] !== undefined).map((k) => `${k}: ${JSON.stringify(L[k])}`).join(", ");
  return `  { ${head}, map: [\n${L.map.map((r) => "    " + JSON.stringify(r) + ",").join("\n")}\n  ]}`;
};
const body = "const LAB = [\n" + levels.map(fmtL).join(",\n") + ",\n];";
const p = join(here, "..", "index.html");
const s = readFileSync(p, "utf8");
const re = /(\/\/ LAB:BEGIN[^\n]*\n)[\s\S]*?(\n\/\/ LAB:END)/;
if (!re.test(s)) throw new Error("markers not found");
writeFileSync(p, s.replace(re, (_, a, b) => a + body + b));
console.log(`injected ${levels.length} lab levels`);
