#!/usr/bin/env node
// Cleans up imported products from market/store/products.json (step 4c sample products): our own English and
// Arabic title and description, a clean handle (old one redirects), brand as vendor, product type, tags, no
// compare-at price, an optional fixed price, option names and values (with Arabic), fewer photos, and the stock
// state for products whose stock isn't tracked yet (in stock with a quantity, or on order = 0 with "continue
// selling"); tracked stock is left to the admin. Safe to re-run.
//
//   shopify store auth --store <store> --scopes read_products,write_products,read_translations,write_translations,\
//     read_inventory,write_inventory,read_locations
//   node market/tools/setup-products.mjs [--store kashkoul-market-fhsuuq5c.myshopify.com] [--only <handle>]
// Without the inventory scopes, everything but the stock quantities is applied and the script says so.
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gql, check, translate } from './store-lib.mjs';

const market = join(dirname(fileURLToPath(import.meta.url)), '..');
const { products } = JSON.parse(readFileSync(join(market, 'store', 'products.json'), 'utf8'));
const argOnly = process.argv.indexOf('--only');
const only = argOnly > -1 ? process.argv[argOnly + 1] : null;

const PRODUCT = `id handle
  options { id name optionValues { id name } }
  variants(first: 100) { nodes { id title inventoryItem { id tracked } } }
  media(first: 250) { nodes { id } }`;

function find(handle) {
  return gql(`query ($q: String!) { products(first: 1, query: $q) { nodes { ${PRODUCT} } } }`, { q: `handle:${handle}` }).products.nodes
    .find(p => p.handle === handle);
}

// Stock needs read/write_inventory + read_locations; without them the rest still runs.
let location = null;
try {
  location = gql(`{ locations(first: 1) { nodes { id } } }`, {}, { quiet: true }).locations.nodes[0]?.id ?? null;
} catch {
  console.log('stock       skipped: the store auth has no inventory/locations access (see the auth command at the top)');
}

for (const spec of products) {
  if (only && spec.handle !== only) continue;
  let p = find(spec.handle) ?? (spec.from_handle && find(spec.from_handle));
  if (!p) { console.log(`product     ${spec.handle}  NOT FOUND (import it first)`); continue; }
  const id = p.id;

  check(gql(`mutation ($p: ProductUpdateInput!) { productUpdate(product: $p) { product { id } userErrors { field message } } }`,
    { p: { id, title: spec.en.title, descriptionHtml: spec.en.body, handle: spec.handle, redirectNewHandle: true,
      vendor: spec.vendor, productType: spec.type, tags: spec.tags } }, { mutation: true }), 'productUpdate');
  translate(id, 'ar', { title: spec.ar.title, body_html: spec.ar.body, ...(spec.ar.type && { product_type: spec.ar.type }) });

  // variants: the importer brings Amazon's whole product family; keep only the ones listed
  // Only on the first run: once trimmed (and options renamed) the titles no longer match, so never touch it again,
  // and never delete every variant.
  if (spec.variants_keep && p.variants.nodes.length > spec.variants_keep.length) {
    const keep = p.variants.nodes.filter(v => spec.variants_keep.includes(v.title));
    const drop = keep.length ? p.variants.nodes.filter(v => !keep.includes(v)).map(v => v.id) : [];
    if (!keep.length) console.log(`  variants: none of variants_keep found, nothing deleted`);
    if (drop.length) {
      check(gql(`mutation ($id: ID!, $v: [ID!]!) { productVariantsBulkDelete(productId: $id, variantsIds: $v) { userErrors { field message } } }`,
        { id, v: drop }, { mutation: true }), 'productVariantsBulkDelete');
      p = find(spec.handle);
    }
  }

  // options: drop pointless single-value ones (true = all, or a list of names), or rename and translate
  const removable = spec.remove_options === true ? p.options : p.options.filter(o => spec.remove_options?.includes(o.name));
  if (removable.length && !(p.options.length === 1 && p.options[0].name === 'Title')) {
    check(gql(`mutation ($id: ID!, $o: [ID!]!) { productOptionsDelete(productId: $id, options: $o, strategy: DEFAULT) { userErrors { field message } } }`,
      { id, o: removable.map(o => o.id) }, { mutation: true }), 'productOptionsDelete');
  }
  for (const o of spec.options ?? []) {
    const opt = p.options.find(x => x.name === o.name || x.name === o.from);
    if (!opt) { console.log(`  option ${o.name} not found`); continue; }
    const renames = o.values.filter(v => v.from).map(v => ({ v, value: opt.optionValues.find(x => x.name === v.from) })).filter(r => r.value);
    if (opt.name !== o.name || renames.length) {
      check(gql(`mutation ($id: ID!, $o: OptionUpdateInput!, $v: [OptionValueUpdateInput!]) { productOptionUpdate(productId: $id, option: $o, optionValuesToUpdate: $v) { userErrors { field message } } }`,
        { id, o: { id: opt.id, name: o.name }, v: renames.map(r => ({ id: r.value.id, name: r.v.name })) }, { mutation: true }), 'productOptionUpdate');
    }
    translate(opt.id, 'ar', { name: o.ar });
    for (const v of o.values) {
      const value = opt.optionValues.find(x => x.name === v.name || x.name === v.from);
      if (value) translate(value.id, 'ar', { name: v.ar });
    }
  }

  // variants: no compare-at, the fixed price if any, sell at 0 only when on order
  p = find(spec.handle);
  const onOrder = spec.stock === 'on_order';
  check(gql(`mutation ($id: ID!, $v: [ProductVariantsBulkInput!]!) { productVariantsBulkUpdate(productId: $id, variants: $v) { userErrors { field message } } }`,
    { id, v: p.variants.nodes.map(v => ({ id: v.id, compareAtPrice: null, ...(!v.inventoryItem.tracked && { inventoryPolicy: onOrder ? 'CONTINUE' : 'DENY' }), ...(spec.price && { price: spec.price }) })) },
    { mutation: true }), 'productVariantsBulkUpdate');

  // photos: keep the chosen positions
  const media = p.media.nodes;
  if (spec.media_keep && media.length > spec.media_keep.length) {
    const drop = media.filter((m, i) => !spec.media_keep.includes(i + 1)).map(m => m.id);
    check(gql(`mutation ($id: ID!, $m: [ID!]!) { productDeleteMedia(productId: $id, mediaIds: $m) { userErrors: mediaUserErrors { field message } } }`,
      { id, m: drop }, { mutation: true }), 'productDeleteMedia');
  }

  // stock: only for variants whose stock isn't tracked yet (fresh imports). Once tracked, the quantity and
  // "continue selling" belong to the owner in the admin and are never changed here.
  const fresh = p.variants.nodes.filter(v => !v.inventoryItem.tracked);
  if (location && fresh.length) {
    for (const v of fresh) check(gql(`mutation ($id: ID!) { inventoryItemUpdate(id: $id, input: { tracked: true }) { userErrors { field message } } }`,
      { id: v.inventoryItem.id }, { mutation: true }), 'inventoryItemUpdate');
    // a fresh key per call: Shopify requires one, and it makes a retried request safe
    check(gql(`mutation ($i: InventorySetQuantitiesInput!, $k: String!) { inventorySetQuantities(input: $i) @idempotent(key: $k) { userErrors { field message } } }`,
      { k: randomUUID(), i: { name: 'available', reason: 'correction',
        quantities: fresh.map(v => ({ inventoryItemId: v.inventoryItem.id, locationId: location, quantity: onOrder ? 0 : spec.stock, changeFromQuantity: null })) } },
      { mutation: true }), 'inventorySetQuantities');
  }

  console.log(`product     ${spec.handle}  updated${spec.media_keep && media.length > spec.media_keep.length ? `, photos ${media.length} → ${spec.media_keep.length}` : ''}${location && fresh.length ? `, stock ${spec.stock}` : ''}`);
}
console.log('done');
