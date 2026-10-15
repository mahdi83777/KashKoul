#!/usr/bin/env node
// Copies market/strings.json into the theme's locale files, under the "kashkoul" key:
//   en → theme/locales/en.default.json     ar → theme/locales/ar.json
// Its "shopify_overrides" part (our wording for Shopify's own checkout text, e.g. shopify.checkout.contact.*) goes
// under the "shopify" key, just before "kashkoul".
// The files hold comments (JSONC), so they're edited as text: these two keys are kept LAST and replaced in place;
// Shopify's header, comments and every other key stay exactly as they are.
// Run after editing strings.json:   node market/tools/sync-strings.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const market = join(dirname(fileURLToPath(import.meta.url)), '..');
const strings = JSON.parse(readFileSync(join(market, 'strings.json'), 'utf8'));
const files = { en: 'en.default.json', ar: 'ar.json' };
const KEY = ',\n  "kashkoul": ';
const KEY_SHOPIFY = ',\n  "shopify": ';
const indent = (value) => JSON.stringify(value, null, 2).replace(/\n/g, '\n  ');

for (const [lang, file] of Object.entries(files)) {
  const path = join(market, 'theme', 'locales', file);
  let text = readFileSync(path, 'utf8').trimEnd();
  if (!text.endsWith('}')) throw new Error(`${file}: expected the file to end with }`);
  const start = [text.lastIndexOf(KEY_SHOPIFY), text.lastIndexOf(KEY)].filter((i) => i !== -1);
  text = start.length ? text.slice(0, Math.min(...start)) : text.slice(0, -1).trimEnd();
  const overrides = strings.shopify_overrides?.[lang];
  const shopifyBlock = overrides ? `${KEY_SHOPIFY}${indent(overrides)}` : '';
  writeFileSync(path, `${text}${shopifyBlock}${KEY}${indent(strings[lang])}\n}\n`);
  console.log(`wrote ${overrides ? 'shopify.* + ' : ''}kashkoul.* → locales/${file}`);
}
