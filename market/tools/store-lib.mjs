// Shared helpers for the store scripts (setup-store.mjs, setup-products.mjs): run Admin GraphQL through Shopify CLI
// (`shopify store execute`, using the auth from `shopify store auth`) and register translations.
// The store is the Kashkoul Market store unless `--store <domain>` is passed.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, readdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const argStore = process.argv.indexOf('--store');
export const STORE = argStore > -1 ? process.argv[argStore + 1] : 'kashkoul-market-fhsuuq5c.myshopify.com';
const tmp = mkdtempSync(join(tmpdir(), 'kk-store-'));
process.on('exit', () => rmSync(tmp, { recursive: true, force: true }));

let n = 0;
export function gql(query, variables = {}, { mutation = false, quiet = false } = {}) {
  const q = join(tmp, `q${++n}.graphql`), v = join(tmp, `v${n}.json`), out = join(tmp, `o${n}.json`);
  writeFileSync(q, query);
  writeFileSync(v, JSON.stringify(variables));
  const args = ['store', 'execute', '--store', STORE, '--query-file', q, '--variable-file', v, '--output-file', out, '--no-color'];
  if (mutation) args.push('--allow-mutations');
  // A dropped connection (aborted request, timeout, reset, DNS hiccup) is retried with growing pauses, about 3 minutes
  // in all; any other error stops.
  for (let attempt = 1; ; attempt++) {
    try {
      execFileSync('shopify', args, { stdio: ['ignore', 'pipe', 'pipe'] });
      break;
    } catch (e) {
      const err = e.stderr?.toString() ?? '';
      if (/aborted before it[\s│]+completed|ETIMEDOUT|ECONNRESET|ECONNREFUSED|ENOTFOUND|EAI_AGAIN|socket hang up|network|throttl/i.test(err) && attempt < 10) {
        execFileSync('sleep', [String(Math.min(5 * attempt, 30))]); continue;
      }
      if (!quiet) process.stderr.write(err);
      throw new Error(`shopify store execute failed (${query.trim().split('\n')[0].slice(0, 80)})`);
    }
  }
  return JSON.parse(readFileSync(out, 'utf8'));
}

export function check(result, path) {
  const errors = path.split('.').reduce((o, k) => o?.[k], result)?.userErrors ?? [];
  if (errors.length) throw new Error(`${path}: ${JSON.stringify(errors)}`);
}

// Registers Arabic (or any) translations for a resource, by key. `values` = { title: '…', body_html: '…' }.
// Brand-new resources (e.g. menu items just created) can take a moment to become translatable, so it retries.
export function translate(resourceId, locale, values, attempt = 1) {
  let translatableResource;
  try {
    ({ translatableResource } = gql(`query ($id: ID!) { translatableResource(resourceId: $id) { translatableContent { key digest } } }`, { id: resourceId }));
  } catch (e) {
    if (attempt >= 4) throw e;
    execFileSync('sleep', [String(2 * attempt)]);
    return translate(resourceId, locale, values, attempt + 1);
  }
  const digests = Object.fromEntries(translatableResource.translatableContent.map(c => [c.key, c.digest]));
  const translations = Object.entries(values).filter(([key]) => digests[key]).map(([key, value]) => ({ locale, key, value, translatableContentDigest: digests[key] }));
  if (!translations.length) return;
  check(gql(`mutation ($id: ID!, $t: [TranslationInput!]!) { translationsRegister(resourceId: $id, translations: $t) { userErrors { field message } } }`,
    { id: resourceId, t: translations }, { mutation: true }), 'translationsRegister');
}

// SKU standard (2026-10-30): the Amazon store, then the Amazon ID: US-B0… (amazon.com) or AE-B0… (amazon.ae), so an
// order shows where to buy. A product entry's `source` is 'us' (the default) or 'ae'; the product also gets the tag
// amazon-us or amazon-uae. Products imported before the standard carry the bare Amazon ID (fix-skus.mjs renames them).
export const skuFor = (spec, asin = spec.asin) => `${spec.source === 'ae' ? 'AE' : 'US'}-${asin}`;
export const sourceTag = spec => spec.source === 'ae' ? 'amazon-uae' : 'amazon-us';
export const isBareAsin = sku => /^[A-Z0-9]{10}$/.test(sku ?? '');

// The shop's products, from market/store/products/round-*.json (one file per round of imports).
// `--round round-3` (or `--round 3`) keeps only that round's file. `--csv <import file>` (a path, or relative to
// market/store, e.g. rounds/round-2/import-1.csv) keeps only the products whose Amazon IDs are in that import file, so
// the scripts can finish one file while the importer is still bringing in the next.
export function loadProducts() {
  const store = join(dirname(fileURLToPath(import.meta.url)), '..', 'store');
  const dir = join(store, 'products');
  const i = process.argv.indexOf('--round');
  const round = i > -1 ? String(process.argv[i + 1]).replace(/^(round-)?/, 'round-') : null;
  const products = readdirSync(dir).filter(f => /^round-\d+\.json$/.test(f) && (!round || f === `${round}.json`)).sort()
    .flatMap(f => JSON.parse(readFileSync(join(dir, f), 'utf8')).products);
  const c = process.argv.indexOf('--csv');
  if (c === -1) return products;
  const path = process.argv[c + 1];
  const csv = readFileSync(existsSync(path) ? path : join(store, path), 'utf8');
  const asins = new Set(csv.split('\n').slice(1).map(l => l.split(',')[0].trim()).filter(Boolean));
  return products.filter(p => asins.has(p.asin) || p.merge_variants?.values.some(v => asins.has(v.asin)));
}
