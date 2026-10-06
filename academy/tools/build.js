#!/usr/bin/env node
// Assembles both sites from their src/ partials. Zero dependencies.
//   node tools/build.js            build once
//   node tools/build.js --watch    rebuild whenever either src/ changes
//   node tools/build.js --serve    …and serve them on http://localhost:8765  (PORT=… to override)
//   node tools/build.js --dist     …then copy the runtime files into dist/ (what Netlify publishes)
//
// dist/ layout — the Academy at the root, the Studio one level in:
//   dist/                 Kashkoul Academy          (academy/)
//   dist/studio/          Kashkoul Studio           (studio/)
//   dist/studio/prototypes/   the two other design directions, kept for reference
//   dist/shared/          house.css — the links between the sites, used by both (from ../shared/)
import { readFileSync, writeFileSync, watch, existsSync, statSync, rmSync, mkdirSync, cpSync } from 'node:fs';
import { createServer } from 'node:http';
import { join, dirname, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const STUDIO = resolve(ROOT, '../studio');
const SHARED = resolve(ROOT, '../shared');   // the Kashkoul house: sites.json + house.css, used by every site
// 8765 is unique among the Miqvaro projects (3000/808x/909x backends, 5173/5174 Vite)
const PORT = Number(process.env.PORT) || 8765;
const INCLUDE = /^([ \t]*)<!--\s*@include\s+(\S+)\s*-->[ \t]*$/gm;
const HOUSE = /^([ \t]*)<!--\s*@house\s+(strip|doors)\s*-->[ \t]*$/gm;

/** The two sites this repo publishes. `base` is where each one is served from. */
const SITES = [
  { name: 'academy', root: ROOT,   base: '/' },
  { name: 'studio',  root: STUDIO, base: '/studio/' },
];
const RUNTIME = ['index.html', 'css', 'js', 'assets'];           // every site has these
const ACADEMY_EXTRA = ['robots.txt', 'sitemap.xml', '_headers']; // …the Academy also publishes these

/** Replaces every `<!-- @include path -->` (path relative to the site's src/) with the file, keeping the indent. */
function render(src, file, depth = 0) {
  if (depth > 10) throw new Error(`include loop at ${file}`);
  return readFileSync(file, 'utf8').replace(INCLUDE, (_, indent, path) => {
    const inc = join(src, path);
    if (!existsSync(inc)) throw new Error(`missing include: ${path} (from ${file})`);
    return render(src, inc, depth + 1).trimEnd().split('\n').map(l => indent + l).join('\n');
  });
}

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * The links between the Kashkoul sites, from shared/sites.json, as seen from site `here`:
 * the current site is marked, live ones link across, "soon" ones are shown but not linked.
 *   strip  the thin bar above the main nav      doors  one card per site above the footer
 */
function house(kind, here) {
  const { newTab, sites } = JSON.parse(readFileSync(join(SHARED, 'sites.json'), 'utf8'));
  const target = newTab ? ' target="_blank" rel="noopener"' : '';
  const newTabNote = newTab ? '<span class="sr"> (opens in a new tab)</span>' : '';

  if (kind === 'doors') {
    const doors = sites.map(s => {
      const inner = `<span class="door-name">${esc(s.en)} <span class="ar">${esc(s.ar)}</span></span><span class="door-blurb">${esc(s.blurb)}</span>`;
      if (s.id === here) return `<div class="door is-current" aria-current="page">${inner}<span class="door-tag">You're here</span></div>`;
      if (s.status !== 'live') return `<div class="door is-soon">${inner}<span class="door-tag">Coming soon</span></div>`;
      return `<a class="door" href="${esc(s.path)}"${target}>${inner}<span class="door-tag">Visit the ${esc(s.en)} <span class="go" aria-hidden="true">↗</span></span>${newTabNote}</a>`;
    });
    return [`<nav class="wrap house-doors" aria-label="Kashkoul sites">`, `  <div class="doors">`,
      ...doors.map(d => `    ${d}`), `  </div>`, `</nav>`].join('\n');
  }

  const items = sites.map(s => {
    if (s.id === here) return `<span class="house-site is-current" aria-current="page">${esc(s.en)}</span>`;
    if (s.status !== 'live') return `<span class="house-site is-soon">${esc(s.en)} <em class="soon">Soon</em></span>`;
    return `<a class="house-site" href="${esc(s.path)}"${target}>${esc(s.en)} <span class="go" aria-hidden="true">↗</span>${newTabNote}</a>`;
  });
  return [`<nav class="house" aria-label="Kashkoul sites">`, `  <div class="wrap house-in">`,
    ...items.map(i => `    ${i}`), `  </div>`, `</nav>`].join('\n');
}

function buildSite({ name, root }) {
  const src = join(root, 'src');
  const banner = '<!-- GENERATED from src/ by academy/tools/build.js — edit the partials, not this file -->\n';
  const html = render(src, join(src, 'index.html'))
    .replace(HOUSE, (_, indent, kind) => house(kind, name).split('\n').map(l => indent + l).join('\n'))
    .replace('<!doctype html>\n', '<!doctype html>\n' + banner);
  writeFileSync(join(root, 'index.html'), html);
  return `${name} (${(html.length / 1024).toFixed(1)} kB)`;
}

function build() {
  const built = SITES.map(buildSite).join(' · ');
  console.log(`[build] ${new Date().toLocaleTimeString()} → ${built}`);
}

build();

if (process.argv.includes('--dist')) {
  const DIST = join(ROOT, 'dist');
  rmSync(DIST, { recursive: true, force: true });
  mkdirSync(DIST);
  for (const f of [...RUNTIME, ...ACADEMY_EXTRA]) cpSync(join(ROOT, f), join(DIST, f), { recursive: true });
  rmSync(join(DIST, 'assets/photos/CREDITS.md'), { force: true });
  for (const f of RUNTIME) cpSync(join(STUDIO, f), join(DIST, 'studio', f), { recursive: true });
  cpSync(join(SHARED, 'house.css'), join(DIST, 'shared/house.css'));
  cpSync(join(STUDIO, 'prototype'), join(DIST, 'studio/prototypes'), { recursive: true });
  console.log('[dist] → dist/ (Academy) + dist/studio/ (Studio) + dist/studio/prototypes/ + dist/shared/');
}

if (process.argv.includes('--watch') || process.argv.includes('--serve')) {
  let t;
  const rebuild = () => { clearTimeout(t); t = setTimeout(() => { try { build(); } catch (e) { console.error(e.message); } }, 50); };
  for (const s of SITES) watch(join(s.root, 'src'), { recursive: true }, rebuild);
  watch(SHARED, rebuild);
  console.log('[watch] academy/src · studio/src · shared/');
}

if (process.argv.includes('--serve')) {
  const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.ttf': 'font/ttf', '.md': 'text/plain' };
  const server = createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);
    // mirror the deployed layout: /studio/… is the Studio, /studio/prototypes/… the old directions
    let p = url.startsWith('/studio/prototypes/') ? join(STUDIO, 'prototype', url.slice(19))
          : url.startsWith('/studio/')            ? join(STUDIO, url.slice(8))
          : url.startsWith('/shared/')            ? join(SHARED, url.slice(8))
          :                                        join(ROOT, url);
    if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
    if (!existsSync(p)) { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, { 'content-type': TYPES[extname(p)] || 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(readFileSync(p));
  });
  server.on('error', e => {
    if (e.code !== 'EADDRINUSE') throw e;
    console.error(`[serve] port ${PORT} is already taken — something else is listening on it.`);
    console.error(`        See what:  lsof -nP -iTCP:${PORT} -sTCP:LISTEN`);
    console.error(`        Or use another port:  PORT=8766 npm run dev`);
    process.exit(1);
  });
  server.listen(PORT, () => console.log(`[serve] http://localhost:${PORT} · studio at http://localhost:${PORT}/studio/`));
}
