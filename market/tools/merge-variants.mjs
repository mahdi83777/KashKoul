#!/usr/bin/env node
// Combines products imported one by one into a single product with variants (variants plan, option B,
// market/store/variants-plan.md). For each entry of market/store/products.json with `merge_variants`:
//   { option: "Size", values: [{ asin, name }, …] }  — the master is the product whose SKU is the entry's `asin`.
// The master's single variant is renamed to its own value; every other value's product (found by its SKU, the
// Amazon ID) becomes a variant of the master: its price as a starting cost, its SKU, its weight and its first
// photo; then that product is deleted. Run setup-products.mjs before (to finish the masters) and after (prices
// from `cost`/`kg` per value, Arabic option names from `options`). Safe to re-run: values already on the master
// are skipped.
//
//   node market/tools/merge-variants.mjs [--only <handle>] [--dry]
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gql, check } from './store-lib.mjs';

const market = join(dirname(fileURLToPath(import.meta.url)), '..');
const { products } = JSON.parse(readFileSync(join(market, 'store', 'products.json'), 'utf8'));
const arg = name => { const i = process.argv.indexOf(name); return i > -1 ? process.argv[i + 1] : null; };
const only = arg('--only');
const dry = process.argv.includes('--dry');

const FIELDS = `id handle title
  options { id name optionValues { id name } }
  variants(first: 50) { nodes { id title sku price inventoryItem { unitCost { amount } measurement { weight { value unit } } } } }
  media(first: 1) { nodes { ... on MediaImage { image { url } } } }`;
const bySku = sku => gql(`query ($q: String!) { products(first: 5, query: $q) { nodes { ${FIELDS} } } }`, { q: `sku:${sku}` })
  .products.nodes.find(p => p.variants.nodes.some(v => v.sku === sku));

for (const spec of products.filter(p => p.merge_variants)) {
  if (only && spec.handle !== only) continue;
  const { option, values } = spec.merge_variants;
  const master = bySku(spec.asin);
  if (!master) { console.log(`merge       ${spec.handle}  master ${spec.asin} NOT FOUND (import it first)`); continue; }
  const own = values.find(v => v.asin === spec.asin);

  // 1. the master's own variant becomes its value ("Title / Default Title" → "Size / 12 tubes")
  const opt = master.options[0];
  if (opt.name !== option || opt.optionValues[0]?.name !== own.name) {
    if (master.options.length > 1 || master.variants.nodes.length > 1) {
      if (!master.options.some(o => o.name === option)) { console.log(`merge       ${spec.handle}  master has other options, skipped`); continue; }
    } else if (!dry) {
      check(gql(`mutation ($id: ID!, $o: OptionUpdateInput!, $v: [OptionValueUpdateInput!]) { productOptionUpdate(productId: $id, option: $o, optionValuesToUpdate: $v) { userErrors { field message } } }`,
        { id: master.id, o: { id: opt.id, name: option }, v: [{ id: opt.optionValues[0].id, name: own.name }] }, { mutation: true }), 'productOptionUpdate');
    }
  }
  const have = new Set(master.variants.nodes.map(v => v.sku));

  // 2. every other value: its product becomes a variant of the master, then goes
  for (const value of values.filter(v => v.asin !== spec.asin)) {
    if (have.has(value.asin)) continue;
    const child = bySku(value.asin);
    if (!child) { console.log(`  ${value.name}: ${value.asin} not imported, skipped`); continue; }
    const v = child.variants.nodes.find(x => x.sku === value.asin);
    const photo = child.media.nodes[0]?.image?.url;
    const weight = v.inventoryItem.measurement?.weight;
    if (dry) { console.log(`  ${value.name}: ${value.asin} → variant (${v.price})`); continue; }
    check(gql(`mutation ($id: ID!, $v: [ProductVariantsBulkInput!]!) { productVariantsBulkCreate(productId: $id, variants: $v) { userErrors { field message } } }`,
      { id: master.id, v: [{
        optionValues: [{ optionName: option, name: value.name }],
        price: v.price,
        inventoryPolicy: 'CONTINUE',
        inventoryItem: { sku: value.asin, tracked: true, cost: v.inventoryItem.unitCost?.amount ?? v.price,
          ...(weight?.value && { measurement: { weight: { value: weight.value, unit: weight.unit } } }) },
        ...(photo && { mediaSrc: [photo] }),
      }] }, { mutation: true }), 'productVariantsBulkCreate');
    check(gql(`mutation ($input: ProductDeleteInput!) { productDelete(input: $input) { userErrors { field message } } }`,
      { input: { id: child.id } }, { mutation: true }), 'productDelete');
    console.log(`  ${value.name}: ${value.asin} merged`);
  }
  console.log(`merge       ${spec.handle}  ${values.length} values`);
}
console.log('done');
