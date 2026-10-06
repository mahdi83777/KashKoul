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
import { readFileSync, writeFileSync, watch, existsSync, statSync, rmSync, mkdirSync, cpSync } from 'node:fs';
import { createServer } from 'node:http';
import { join, dirname, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const STUDIO = resolve(ROOT, '../studio');
// 8765 is unique among the Miqvaro projects (3000/808x/909x backends, 5173/5174 Vite)
const PORT = Number(process.env.PORT) || 8765;
const INCLUDE = /^([ \t]*)<!--\s*@include\s+(\S+)\s*-->[ \t]*$/gm;

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

function buildSite({ name, root }) {
  const src = join(root, 'src');
  const banner = '<!-- GENERATED from src/ by academy/tools/build.js — edit the partials, not this file -->\n';
  const html = render(src, join(src, 'index.html')).replace('<!doctype html>\n', '<!doctype html>\n' + banner);
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
  cpSync(join(STUDIO, 'prototype'), join(DIST, 'studio/prototypes'), { recursive: true });
  console.log('[dist] → dist/ (Academy) + dist/studio/ (Studio) + dist/studio/prototypes/');
}

if (process.argv.includes('--watch') || process.argv.includes('--serve')) {
  let t;
  const rebuild = () => { clearTimeout(t); t = setTimeout(() => { try { build(); } catch (e) { console.error(e.message); } }, 50); };
  for (const s of SITES) watch(join(s.root, 'src'), { recursive: true }, rebuild);
  console.log('[watch] academy/src · studio/src');
}

if (process.argv.includes('--serve')) {
  const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.ttf': 'font/ttf', '.md': 'text/plain' };
  const server = createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);
    // mirror the deployed layout: /studio/… is the Studio, /studio/prototypes/… the old directions
    let p = url.startsWith('/studio/prototypes/') ? join(STUDIO, 'prototype', url.slice(19))
          : url.startsWith('/studio/')            ? join(STUDIO, url.slice(8))
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
