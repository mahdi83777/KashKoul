#!/usr/bin/env node
// Exports every instrument card as a high-resolution PNG for social media posts. Zero dependencies — it serves the
// site's own CSS + photos on a throwaway port and screenshots each card with headless Chrome.
//   node tools/export-cards.js                    each card in its shape on the site: 3:4 (2160×2880), Ney wide (4435×2880)
//   node tools/export-cards.js --format=portrait  every card 4:5, 2160×2700 (2× Instagram's 1080×1350)
//                                                 (also: square → 1:1, 2160×2160 · story → 9:16, 2160×3840)
//   node tools/export-cards.js --scale=1          half the pixels (a regular card 1080 px wide)
//   CHROME=/path/to/chrome node tools/export-cards.js   if Chrome isn't in /Applications
//
// Output (git-ignored): ../social/instrument-cards/<format>/
//   cards/        the card as on the site — number, English + Arabic name, blurb
//   backgrounds/  the same duotone photo with no text, to lay your own copy over
import { createServer } from 'node:http';
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { join, dirname, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { INSTRUMENTS } from '../js/config.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const arg = name => process.argv.find(a => a.startsWith(`--${name}=`))?.split('=')[1];

const FORMATS = { site: null, portrait: [1080, 1350], square: [1080, 1080], story: [1080, 1920] };
const format = arg('format') || 'site';
if (!(format in FORMATS)) throw new Error(`unknown --format=${format} (use ${Object.keys(FORMATS).join(', ')})`);
const scale = Number(arg('scale') || 2);

// A card is laid out 300 CSS px wide — about its size on the desktop site, so the type keeps the same proportions —
// and Chrome's device scale factor blows it up to 1080 × scale px. `site` keeps each card's shape from the desktop grid:
// 3:4, or for the wide card two columns plus the 16px gap, at the same row height.
const CSS_W = 300;
const DPR = 1080 * scale / CSS_W;
const cssSize = i => !FORMATS[format] ? [i.color === 'wide' ? 2 * CSS_W + 16 : CSS_W, CSS_W * 4 / 3]
                                      : [CSS_W, Math.round(CSS_W * FORMATS[format][1] / FORMATS[format][0])];

const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
if (!existsSync(CHROME)) throw new Error(`Chrome not found at ${CHROME} — set CHROME=/path/to/chrome`);

const OUT = resolve(ROOT, '../social/instrument-cards', format);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');

/** One card on a page the size of the image. Same markup and CSS as js/instruments.js, minus the link and hover arrow. */
function page(n, bare) {
  const i = INSTRUMENTS[n];
  const [cssW, cssH] = cssSize(i);
  const css = ['base/tokens', 'base/fonts', 'base/reset', 'base/utilities', 'sections/instruments']
    .map(f => `<link rel="stylesheet" href="/css/${f}.css">`).join('');
  return `<!doctype html><html><head><meta charset="utf-8">${css}<style>
    html, body { margin: 0; width: ${cssW}px; height: ${cssH}px; overflow: hidden; }
    .card { width: 100%; height: 100%; aspect-ratio: auto; min-height: 0; border: 0; }
    .bare .card > :not(img), .bare .card::before { display: none; }
  </style></head><body class="${bare ? 'bare' : ''}">
    <div class="card photo ${i.color}">
      <img src="/assets/photos/${esc(i.img)}" alt="">
      <span class="idx">${String(n + 1).padStart(2, '0')}</span>
      <span><span class="t">${esc(i.en)}<span class="ar">${esc(i.ar)}</span></span><span class="s">${esc(i.blurb)}</span></span>
    </div>
  </body></html>`;
}

const TYPES = { '.css': 'text/css', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.ttf': 'font/ttf' };
const server = createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/card') {
    res.writeHead(200, { 'content-type': 'text/html' });
    return res.end(page(Number(url.searchParams.get('n')), url.searchParams.has('bare')));
  }
  const p = join(ROOT, decodeURIComponent(url.pathname));
  if (!p.startsWith(ROOT) || !existsSync(p)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': TYPES[extname(p)] || 'application/octet-stream' });
  res.end(readFileSync(p));
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const shoot = (url, [cssW, cssH], file) => promisify(execFile)(CHROME, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
  `--window-size=${cssW},${cssH}`, `--force-device-scale-factor=${DPR}`,
  '--virtual-time-budget=5000',   // let the fonts and the photo load before the shot
  `--screenshot=${file}`, url,
]);

try {
  for (const dir of ['cards', 'backgrounds']) mkdirSync(join(OUT, dir), { recursive: true });
  for (const [n, i] of INSTRUMENTS.entries()) {
    const name = `${String(n + 1).padStart(2, '0')}-${slug(i.en)}.png`;
    const size = cssSize(i);
    await shoot(`${base}/card?n=${n}`, size, join(OUT, 'cards', name));
    await shoot(`${base}/card?n=${n}&bare`, size, join(OUT, 'backgrounds', name));
    console.log(`[export] ${name}  ${size.map(d => Math.round(d * DPR)).join('×')}`);
  }
  console.log(`[export] ${INSTRUMENTS.length} cards → ${OUT}`);
} finally {
  server.close();
}
