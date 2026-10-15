// Shared helpers for the store scripts (setup-store.mjs, setup-products.mjs): run Admin GraphQL through Shopify CLI
// (`shopify store execute`, using the auth from `shopify store auth`) and register translations.
// The store is the Kashkoul Market store unless `--store <domain>` is passed.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

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
  // A dropped connection ("aborted before it completed") is retried a few times; any other error stops.
  for (let attempt = 1; ; attempt++) {
    try {
      execFileSync('shopify', args, { stdio: ['ignore', 'pipe', 'pipe'] });
      break;
    } catch (e) {
      const err = e.stderr?.toString() ?? '';
      if (/aborted before it[\s│]+completed/.test(err) && attempt < 6) { execFileSync('sleep', [String(2 * attempt)]); continue; }
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
