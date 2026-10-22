// Builds the GitHub Pages site: an index of every game plus each game's playable runtime.
// Usage (repo root): node tools/pages/build.mjs [outDir=_site]
// Per game it publishes only what the game needs to run — index.html and assets/ — plus a
// thumbnail from qa/phone-01-load.png. Briefs, night logs, design folders and QA files stay out.
// A game is listed when games/<slug>/index.html and BRIEF.md exist (folders starting with _ are skipped).
// Add `pages: hidden` to a brief's front matter to leave a game off the site.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const out = path.resolve(root, process.argv[2] || "_site");
const gamesDir = path.join(root, "games");

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function frontMatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---/);
  const fm = {};
  if (m) for (const line of m[1].split("\n")) { const i = line.indexOf(":"); if (i > 0) fm[line.slice(0, i).trim()] = line.slice(i + 1).trim(); }
  return fm;
}
// The studio's one-line summary: the first plain paragraph after the quoted idea in "## The idea".
function blurb(md) {
  const sec = md.split(/^## The idea\s*$/m)[1];
  if (!sec) return "";
  const body = sec.split(/^## /m)[0];
  const paras = body.split(/\n\s*\n/).map((p) => p.trim()).filter((p) => p && !p.startsWith(">"));
  return (paras[0] || "").replace(/\s+/g, " ").replace(/\*\*|`/g, "");
}
function lastUpdated(dir) {
  try { return execFileSync("git", ["log", "-1", "--format=%cs", "--", dir], { cwd: root, encoding: "utf8" }).trim(); }
  catch { return ""; }
}

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const games = [];
for (const slug of fs.readdirSync(gamesDir).sort()) {
  const dir = path.join(gamesDir, slug);
  if (slug.startsWith("_") || !fs.statSync(dir).isDirectory()) continue;
  const html = path.join(dir, "index.html"), brief = path.join(dir, "BRIEF.md");
  if (!fs.existsSync(html) || !fs.existsSync(brief)) continue;
  const md = fs.readFileSync(brief, "utf8"), fm = frontMatter(md);
  if (fm.pages === "hidden") continue;
  const dest = path.join(out, slug);
  fs.mkdirSync(dest, { recursive: true });
  fs.copyFileSync(html, path.join(dest, "index.html"));
  if (fs.existsSync(path.join(dir, "assets"))) fs.cpSync(path.join(dir, "assets"), path.join(dest, "assets"), { recursive: true });
  const thumb = path.join(dir, "qa", "phone-01-load.png");
  if (fs.existsSync(thumb)) fs.copyFileSync(thumb, path.join(dest, "thumb.png"));
  const title = (fm.title || slug).replace(/\s*\((was [^)]*|working title)\)\s*$/i, "");
  games.push({ slug, title, blurb: blurb(md), updated: lastUpdated(`games/${slug}`), thumb: fs.existsSync(thumb) });
}
games.sort((a, b) => (b.updated || "").localeCompare(a.updated || "") || a.title.localeCompare(b.title));

const fmtDate = (d) => { if (!d) return ""; const [y, m, day] = d.split("-").map(Number); return new Date(Date.UTC(y, m - 1, day)).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }); };
const cards = games.map((g) => `
      <li class="card">
        <a class="shot" href="${esc(g.slug)}/" tabindex="-1" aria-hidden="true">${g.thumb ? `<img src="${esc(g.slug)}/thumb.png" alt="" loading="lazy" width="390" height="844">` : ""}</a>
        <div class="body">
          <h2><a href="${esc(g.slug)}/">${esc(g.title)}</a></h2>
          <p>${esc(g.blurb)}</p>
          <div class="meta">${g.updated ? `<span>Updated ${esc(fmtDate(g.updated))}</span>` : "<span></span>"}<a class="play" href="${esc(g.slug)}/">Play<span class="sr"> ${esc(g.title)}</span></a></div>
        </div>
      </li>`).join("");

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Game Studio</title>
<style>
  :root { --bg: #f6f1e8; --ink: #23192b; --muted: #6b5f72; --card: #fffaf2; --edge: #e6dccb; --accent: #c81758; --accent-ink: #fff; --shot: #e9e0d2; }
  @media (prefers-color-scheme: dark) { :root { --bg: #17131c; --ink: #f3ece4; --muted: #a99fb0; --card: #221c29; --edge: #352c3e; --accent: #ff5f9a; --accent-ink: #1a0f17; --shot: #2b2433; } }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--ink); font: 16px/1.5 ui-rounded, "SF Pro Rounded", system-ui, -apple-system, "Segoe UI", sans-serif; }
  main { max-width: 1080px; margin: 0 auto; padding: 40px 16px 56px; }
  header { margin-bottom: 28px; }
  h1 { font-size: clamp(2rem, 6vw, 3rem); line-height: 1.05; margin: 0 0 8px; letter-spacing: -0.02em; }
  header p { margin: 0; color: var(--muted); max-width: 52ch; }
  ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 20px; grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr)); }
  .card { background: var(--card); border: 1px solid var(--edge); border-radius: 20px; overflow: hidden; display: flex; flex-direction: column; }
  .shot { display: block; aspect-ratio: 4 / 3; background: var(--shot); overflow: hidden; }
  .shot img { width: 100%; height: 100%; object-fit: cover; object-position: top; display: block; transition: transform .25s ease; }
  .card:hover .shot img { transform: scale(1.03); }
  .body { padding: 16px 18px 18px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
  h2 { margin: 0; font-size: 1.3rem; line-height: 1.2; }
  h2 a { color: inherit; text-decoration: none; }
  h2 a:hover { text-decoration: underline; }
  .body p { margin: 0; color: var(--muted); font-size: .95rem; flex: 1; }
  .meta { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 6px; font-size: .85rem; color: var(--muted); }
  .play { min-height: 44px; display: inline-flex; align-items: center; padding: 0 22px; border-radius: 999px; background: var(--accent); color: var(--accent-ink); font-weight: 800; font-size: 1rem; text-decoration: none; }
  .play:hover { filter: brightness(1.08); }
  a:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; border-radius: 8px; }
  .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
  footer { margin-top: 40px; color: var(--muted); font-size: .85rem; }
  @media (prefers-reduced-motion: reduce) { .shot img { transition: none; } }
</style>
</head>
<body>
<main>
  <header>
    <h1>Game Studio</h1>
    <p>The games the night studio is building. Each one is a work in progress; pick one and play it in the browser. They're made for phones but work on desktop too.</p>
  </header>
  <ul>${cards}
  </ul>
  <footer>${games.length} games · built from <code>main</code></footer>
</main>
</body>
</html>
`;
fs.writeFileSync(path.join(out, "index.html"), page);
fs.writeFileSync(path.join(out, "robots.txt"), "User-agent: *\nDisallow: /\n");
fs.writeFileSync(path.join(out, ".nojekyll"), "");
console.log(`Built ${games.length} games into ${path.relative(root, out) || out}: ${games.map((g) => g.slug).join(", ")}`);
