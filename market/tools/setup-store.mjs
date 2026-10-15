#!/usr/bin/env node
// Applies market/store/content.json to the Shopify store through Shopify CLI (`shopify store execute`):
// collections (published to the Online Store), pages, the main menu, their Arabic translations, and published
// languages. Safe to re-run: everything is matched by handle and updated in place.
//
//   shopify store auth --store <store> --scopes read_products,write_products,read_online_store_navigation,\
//     write_online_store_navigation,read_online_store_pages,write_online_store_pages,read_translations,\
//     write_translations,read_locales,write_locales,read_publications,write_publications
//   node market/tools/setup-store.mjs [--store kashkoul-market-fhsuuq5c.myshopify.com]
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const market = join(dirname(fileURLToPath(import.meta.url)), '..');
const content = JSON.parse(readFileSync(join(market, 'store', 'content.json'), 'utf8'));
const argStore = process.argv.indexOf('--store');
const STORE = argStore > -1 ? process.argv[argStore + 1] : 'kashkoul-market-fhsuuq5c.myshopify.com';
const tmp = mkdtempSync(join(tmpdir(), 'kk-store-'));

let n = 0;
function gql(query, variables = {}, { mutation = false } = {}) {
  const q = join(tmp, `q${++n}.graphql`), v = join(tmp, `v${n}.json`), out = join(tmp, `o${n}.json`);
  writeFileSync(q, query);
  writeFileSync(v, JSON.stringify(variables));
  const args = ['store', 'execute', '--store', STORE, '--query-file', q, '--variable-file', v, '--output-file', out, '--no-color'];
  if (mutation) args.push('--allow-mutations');
  try {
    execFileSync('shopify', args, { stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) {
    process.stderr.write(e.stderr?.toString() ?? '');
    throw new Error(`shopify store execute failed (${query.trim().split('\n')[0].slice(0, 80)})`);
  }
  return JSON.parse(readFileSync(out, 'utf8'));
}
function check(result, path) {
  const errors = path.split('.').reduce((o, k) => o?.[k], result)?.userErrors ?? [];
  if (errors.length) throw new Error(`${path}: ${JSON.stringify(errors)}`);
}

// Registers Arabic (or any) translations for a resource, by key. `values` = { title: '…', body_html: '…' }.
// Brand-new resources (e.g. menu items just created) can take a moment to become translatable, so it retries.
function translate(resourceId, locale, values, attempt = 1) {
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

const { publications } = gql(`{ publications(first: 20) { nodes { id name } } }`);
const onlineStore = publications.nodes.find(p => p.name === 'Online Store')?.id;

// ---- collections ----
const collectionIds = {};
for (const c of content.collections) {
  const found = gql(`query ($q: String!) { collections(first: 1, query: $q) { nodes { id } } }`, { q: `handle:${c.handle}` }).collections.nodes[0];
  let id = found?.id;
  if (id) {
    check(gql(`mutation ($input: CollectionInput!) { collectionUpdate(input: $input) { userErrors { field message } } }`,
      { input: { id, title: c.en.title, descriptionHtml: c.en.body } }, { mutation: true }), 'collectionUpdate');
  } else {
    const r = gql(`mutation ($input: CollectionInput!) { collectionCreate(input: $input) { collection { id } userErrors { field message } } }`,
      { input: { title: c.en.title, handle: c.handle, descriptionHtml: c.en.body } }, { mutation: true });
    check(r, 'collectionCreate'); id = r.collectionCreate.collection.id;
  }
  if (onlineStore) check(gql(`mutation ($id: ID!, $input: [PublicationInput!]!) { publishablePublish(id: $id, input: $input) { userErrors { field message } } }`,
    { id, input: [{ publicationId: onlineStore }] }, { mutation: true }), 'publishablePublish');
  translate(id, 'ar', { title: c.ar.title, body_html: c.ar.body });
  collectionIds[c.handle] = id;
  console.log(`collection  ${c.handle}  ${found ? 'updated' : 'created'}`);
}

// ---- pages ----
const pageIds = {};
for (const p of content.pages) {
  const found = gql(`query ($q: String!) { pages(first: 1, query: $q) { nodes { id } } }`, { q: `handle:${p.handle}` }).pages.nodes[0];
  const fields = { title: p.en.title, body: p.en.body, isPublished: true, ...(p.template_suffix ? { templateSuffix: p.template_suffix } : {}) };
  let id = found?.id;
  if (id) {
    check(gql(`mutation ($id: ID!, $page: PageUpdateInput!) { pageUpdate(id: $id, page: $page) { userErrors { field message } } }`,
      { id, page: fields }, { mutation: true }), 'pageUpdate');
  } else {
    const r = gql(`mutation ($page: PageCreateInput!) { pageCreate(page: $page) { page { id } userErrors { field message } } }`,
      { page: { ...fields, handle: p.handle } }, { mutation: true });
    check(r, 'pageCreate'); id = r.pageCreate.page.id;
  }
  translate(id, 'ar', { title: p.ar.title, body_html: p.ar.body });
  pageIds[p.handle] = id;
  console.log(`page        ${p.handle}  ${found ? 'updated' : 'created'}`);
}

// ---- main menu ----
const menus = gql(`{ menus(first: 20) { nodes { id handle title } } }`).menus.nodes;
const menu = menus.find(m => m.handle === content.menu.handle);
if (!menu) throw new Error(`menu ${content.menu.handle} not found`);
// Items nest one level (e.g. "Shop" → the four categories). CATALOG = all products; COLLECTION/PAGE resolve by handle.
const toInput = i => ({
  title: i.en, type: i.type,
  ...(i.type === 'COLLECTION' ? { resourceId: collectionIds[i.handle] } : {}),
  ...(i.type === 'PAGE' ? { resourceId: pageIds[i.handle] } : {}),
  ...(i.items ? { items: i.items.map(toInput) } : {}),
});
const m = gql(`mutation ($id: ID!, $title: String!, $items: [MenuItemUpdateInput!]!) { menuUpdate(id: $id, title: $title, items: $items) { menu { items { id title items { id title } } } userErrors { field message } } }`,
  { id: menu.id, title: menu.title, items: content.menu.items.map(toInput) }, { mutation: true });
check(m, 'menuUpdate');
// A menu item's translations live on its Link resource: gid://shopify/MenuItem/N → gid://shopify/Link/N.
const translateItems = (saved, source) => saved.forEach((item, k) => {
  translate(item.id.replace('/MenuItem/', '/Link/'), 'ar', { title: source[k].ar });
  if (item.items?.length) translateItems(item.items, source[k].items);
});
translateItems(m.menuUpdate.menu.items, content.menu.items);
console.log(`menu        ${content.menu.handle}  ${content.menu.items.length} items`);

// ---- pages no longer wanted ----
for (const handle of content.remove_pages ?? []) {
  const found = gql(`query ($q: String!) { pages(first: 1, query: $q) { nodes { id } } }`, { q: `handle:${handle}` }).pages.nodes[0];
  if (!found) continue;
  check(gql(`mutation ($id: ID!) { pageDelete(id: $id) { userErrors { field message } } }`, { id: found.id }, { mutation: true }), 'pageDelete');
  console.log(`page        ${handle}  removed`);
}

// ---- languages ----
for (const l of content.locales) {
  check(gql(`mutation ($locale: String!, $s: ShopLocaleInput!) { shopLocaleUpdate(locale: $locale, shopLocale: $s) { userErrors { field message } } }`,
    { locale: l.locale, s: { published: l.published } }, { mutation: true }), 'shopLocaleUpdate');
  console.log(`language    ${l.locale}  published=${l.published}`);
}

rmSync(tmp, { recursive: true, force: true });
console.log('done');
