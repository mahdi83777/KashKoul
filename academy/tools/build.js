#!/usr/bin/env node
// Assembles src/index.html + partials into ../index.html. Zero dependencies.
//   node tools/build.js            build once
//   node tools/build.js --watch    rebuild whenever src/ changes
//   node tools/build.js --serve    …and serve the site on http://localhost:8765  (PORT=… to override)
//   node tools/build.js --dist     …then copy the runtime files into dist/ (what Netlify publishes)
import { readFileSync, writeFileSync, watch, existsSync, statSync, rmSync, mkdirSync, cpSync } from 'node:fs';
import { createServer } from 'node:http';
import { join, dirname, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src');
// The Studio prototypes ship with the Academy site under /studio/ (footer badge links there) until the Studio has its own site.
const STUDIO = resolve(ROOT, '../studio/prototype');
const OUT = join(ROOT, 'index.html');
// 8765 is unique among the Miqvaro projects (3000/808x/909x backends, 5173/5174 Vite)
const PORT = Number(process.env.PORT) || 8765;
const INCLUDE = /^([ \t]*)<!--\s*@include\s+(\S+)\s*-->[ \t]*$/gm;

/** Replaces every `<!-- @include path -->` (path relative to src/) with the file, keeping the indent. */
function render(file, depth = 0) {
  if (depth > 10) throw new Error(`include loop at ${file}`);
  return readFileSync(file, 'utf8').replace(INCLUDE, (_, indent, path) => {
    const inc = join(SRC, path);
    if (!existsSync(inc)) throw new Error(`missing include: ${path} (from ${file})`);
    return render(inc, depth + 1).trimEnd().split('\n').map(l => indent + l).join('\n');
  });
}

function build() {
  const banner = '<!-- GENERATED from src/ by tools/build.js — edit the partials, not this file -->\n';
  const html = render(join(SRC, 'index.html')).replace('<!doctype html>\n', '<!doctype html>\n' + banner);
  writeFileSync(OUT, html);
  console.log(`[build] ${new Date().toLocaleTimeString()} → index.html (${(html.length / 1024).toFixed(1)} kB)`);
}

build();

if (process.argv.includes('--dist')) {
  const DIST = join(ROOT, 'dist');
  rmSync(DIST, { recursive: true, force: true });
  mkdirSync(DIST);
  for (const f of ['index.html', 'css', 'js', 'assets', 'robots.txt', 'sitemap.xml', '_headers']) cpSync(join(ROOT, f), join(DIST, f), { recursive: true });
  rmSync(join(DIST, 'assets/photos/CREDITS.md'), { force: true });
  cpSync(STUDIO, join(DIST, 'studio'), { recursive: true });
  console.log('[dist] → dist/ (runtime files only) + studio/ (prototypes)');
}

if (process.argv.includes('--watch') || process.argv.includes('--serve')) {
  let t; watch(SRC, { recursive: true }, () => { clearTimeout(t); t = setTimeout(() => { try { build(); } catch (e) { console.error(e.message); } }, 50); });
  console.log('[watch] src/');
}

if (process.argv.includes('--serve')) {
  const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.ttf': 'font/ttf', '.md': 'text/plain' };
  createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);
    let p = url.startsWith('/studio/') ? join(STUDIO, url.slice(8)) : join(ROOT, url);
    if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
    if (!existsSync(p)) { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, { 'content-type': TYPES[extname(p)] || 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(readFileSync(p));
  }).listen(PORT, () => console.log(`[serve] http://localhost:${PORT}`));
}
