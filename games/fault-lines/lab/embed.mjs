// node lab/embed.mjs → writes lab/levels.json into index.html between the LEVELS markers
import fs from "node:fs";
const html = new URL("../index.html", import.meta.url), lv = JSON.parse(fs.readFileSync(new URL("./levels.json", import.meta.url)));
const s = fs.readFileSync(html, "utf8");
const body = "const LEVELS = [\n" + lv.map((L) => "  " + JSON.stringify({ w: L.w, h: L.h, d: L.d, walls: L.walls, regions: L.regions })).join(",\n") + "\n];";
fs.writeFileSync(html, s.replace(/\/\/ LEVELS-BEGIN\n[\s\S]*?\/\/ LEVELS-END/, "// LEVELS-BEGIN\n" + body + "\n// LEVELS-END"));
console.log("embedded", lv.length, "levels");
