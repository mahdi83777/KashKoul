#!/usr/bin/env node
// Applies market/store/content.json to the Shopify store through Shopify CLI (`shopify store execute`):
// collections (published to the Online Store; a collection with `types` is automatic: it holds every product of those
// product types, so new products land in it by themselves), pages, the main menu, the shop's policies (refund, shipping,
// privacy, terms, contact), their Arabic translations, and published languages. Safe to re-run: everything is matched by handle and updated in place.
//
//   shopify store auth --store <store> --scopes read_products,write_products,read_online_store_navigation,\
//     write_online_store_navigation,read_online_store_pages,write_online_store_pages,read_translations,\
//     write_translations,read_locales,write_locales,read_publications,write_publications,read_legal_policies,write_legal_policies
//   node market/tools/setup-store.mjs [--store kashkoul-market-fhsuuq5c.myshopify.com] [--only collections,menu]
// --only applies just those parts (collections, pages, menu, policies, languages); the menu still needs the pages to exist.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gql, check, translate } from './store-lib.mjs';

const market = join(dirname(fileURLToPath(import.meta.url)), '..');
const content = JSON.parse(readFileSync(join(market, 'store', 'content.json'), 'utf8'));
const argOnly = process.argv.indexOf('--only');
const parts = argOnly > -1 ? process.argv[argOnly + 1].split(',') : ['collections', 'pages', 'menu', 'policies', 'languages'];

const { publications } = gql(`{ publications(first: 20) { nodes { id name } } }`);
const onlineStore = publications.nodes.find(p => p.name === 'Online Store')?.id;

// ---- collections ----
const collectionIds = {};
for (const c of parts.includes('collections') ? content.collections : []) {
  const ruleSet = c.types && { appliedDisjunctively: true, rules: c.types.map(t => ({ column: 'TYPE', relation: 'EQUALS', condition: t })) };
  const found = gql(`query ($q: String!) { collections(first: 1, query: $q) { nodes { id } } }`, { q: `handle:${c.handle}` }).collections.nodes[0];
  let id = found?.id;
  if (id) {
    check(gql(`mutation ($input: CollectionInput!) { collectionUpdate(input: $input) { userErrors { field message } } }`,
      { input: { id, title: c.en.title, descriptionHtml: c.en.body, ...(ruleSet && { ruleSet }) } }, { mutation: true }), 'collectionUpdate');
  } else {
    const r = gql(`mutation ($input: CollectionInput!) { collectionCreate(input: $input) { collection { id } userErrors { field message } } }`,
      { input: { title: c.en.title, handle: c.handle, descriptionHtml: c.en.body, ...(ruleSet && { ruleSet }) } }, { mutation: true });
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
for (const p of parts.includes('pages') ? content.pages : []) {
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
if (parts.includes('menu')) {
// Without --only pages/collections in this run, look their ids up by handle.
for (const c of content.collections) collectionIds[c.handle] ??= gql(`query ($q: String!) { collections(first: 1, query: $q) { nodes { id } } }`, { q: `handle:${c.handle}` }).collections.nodes[0]?.id;
for (const p of content.pages) pageIds[p.handle] ??= gql(`query ($q: String!) { pages(first: 1, query: $q) { nodes { id } } }`, { q: `handle:${p.handle}` }).pages.nodes[0]?.id;
const menus = gql(`{ menus(first: 20) { nodes { id handle title } } }`).menus.nodes;
const menu = menus.find(m => m.handle === content.menu.handle);
if (!menu) throw new Error(`menu ${content.menu.handle} not found`);
// Items nest up to two levels (e.g. "Shop" → the categories → Instruments' sub-categories). CATALOG = all products; COLLECTION/PAGE resolve by handle.
const toInput = i => ({
  title: i.en, type: i.type,
  ...(i.type === 'COLLECTION' ? { resourceId: collectionIds[i.handle] } : {}),
  ...(i.type === 'PAGE' ? { resourceId: pageIds[i.handle] } : {}),
  ...(i.items ? { items: i.items.map(toInput) } : {}),
});
const m = gql(`mutation ($id: ID!, $title: String!, $items: [MenuItemUpdateInput!]!) { menuUpdate(id: $id, title: $title, items: $items) { menu { items { id title items { id title items { id title } } } } userErrors { field message } } }`,
  { id: menu.id, title: menu.title, items: content.menu.items.map(toInput) }, { mutation: true });
check(m, 'menuUpdate');
// A menu item's translations live on its Link resource: gid://shopify/MenuItem/N → gid://shopify/Link/N.
const translateItems = (saved, source) => saved.forEach((item, k) => {
  translate(item.id.replace('/MenuItem/', '/Link/'), 'ar', { title: source[k].ar });
  if (item.items?.length) translateItems(item.items, source[k].items);
});
translateItems(m.menuUpdate.menu.items, content.menu.items);
console.log(`menu        ${content.menu.handle}  ${content.menu.items.length} items`);
}

// ---- pages no longer wanted ----
for (const handle of parts.includes('pages') ? content.remove_pages ?? [] : []) {
  const found = gql(`query ($q: String!) { pages(first: 1, query: $q) { nodes { id } } }`, { q: `handle:${handle}` }).pages.nodes[0];
  if (!found) continue;
  check(gql(`mutation ($id: ID!) { pageDelete(id: $id) { userErrors { field message } } }`, { id: found.id }, { mutation: true }), 'pageDelete');
  console.log(`page        ${handle}  removed`);
}

// ---- policies ----
for (const [type, p] of Object.entries(parts.includes('policies') ? content.policies ?? {} : {})) {
  const r = gql(`mutation ($p: ShopPolicyInput!) { shopPolicyUpdate(shopPolicy: $p) { shopPolicy { id } userErrors { field message } } }`,
    { p: { type, body: p.en.body } }, { mutation: true });
  // Shopify can write a policy itself ("Automatic management" in Settings → Policies): left alone until that's off
  if (r.shopPolicyUpdate.userErrors.some(e => /automatic management/i.test(e.message))) { console.log(`policy      ${type}  skipped: Shopify manages it (turn off automatic management in Settings → Policies)`); continue; }
  check(r, 'shopPolicyUpdate');
  translate(r.shopPolicyUpdate.shopPolicy.id, 'ar', { body: p.ar.body });
  console.log(`policy      ${type}`);
}

// ---- languages ----
for (const l of parts.includes('languages') ? content.locales : []) {
  check(gql(`mutation ($locale: String!, $s: ShopLocaleInput!) { shopLocaleUpdate(locale: $locale, shopLocale: $s) { userErrors { field message } } }`,
    { locale: l.locale, s: { published: l.published } }, { mutation: true }), 'shopLocaleUpdate');
  console.log(`language    ${l.locale}  published=${l.published}`);
}

console.log('done');
