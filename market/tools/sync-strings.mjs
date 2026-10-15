#!/usr/bin/env node
// Copies market/strings.json into the theme's locale files, under the "kashkoul" key:
//   en → theme/locales/en.default.json     ar → theme/locales/ar.json
// The files hold comments (JSONC), so they're edited as text: the "kashkoul" key is kept as the LAST key and
// replaced in place; Shopify's header, comments and every other key stay exactly as they are.
// Run after editing strings.json:   node market/tools/sync-strings.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const market = join(dirname(fileURLToPath(import.meta.url)), '..');
const strings = JSON.parse(readFileSync(join(market, 'strings.json'), 'utf8'));
const files = { en: 'en.default.json', ar: 'ar.json' };
const KEY = ',\n  "kashkoul": ';

for (const [lang, file] of Object.entries(files)) {
  const path = join(market, 'theme', 'locales', file);
  let text = readFileSync(path, 'utf8').trimEnd();
  if (!text.endsWith('}')) throw new Error(`${file}: expected the file to end with }`);
  const existing = text.lastIndexOf(KEY);
  text = existing === -1 ? text.slice(0, -1).trimEnd() : text.slice(0, existing);
  const block = JSON.stringify(strings[lang], null, 2).replace(/\n/g, '\n  ');
  writeFileSync(path, `${text}${KEY}${block}\n}\n`);
  console.log(`wrote kashkoul.* → locales/${file}`);
}
