#!/usr/bin/env node
// One-off (2026-10-30): brings the products already in the store to the SKU standard (store-lib.mjs): every variant
// whose SKU is a bare Amazon ID becomes US-<Amazon ID> (everything imported before the standard came from amazon.com),
// and every product with an Amazon SKU gets its tag, amazon-us or amazon-uae. Safe to re-run: SKUs already under the
// standard and tags already there are left alone.
//
//   node market/tools/fix-skus.mjs [--dry]
import { gql, check, isBareAsin } from './store-lib.mjs';

const dry = process.argv.includes('--dry');
let after = null, renamed = 0, tagged = 0, products = 0;
do {
  const { products: page } = gql(`query ($after: String) { products(first: 50, after: $after) {
    nodes { id handle tags variants(first: 100) { nodes { id sku } } } pageInfo { hasNextPage endCursor } } }`, { after });
  for (const p of page.nodes) {
    products++;
    const bare = p.variants.nodes.filter(v => isBareAsin(v.sku));
    if (bare.length) {
      console.log(`sku         ${p.handle}  ${bare.map(v => `${v.sku} → US-${v.sku}`).join(', ')}`);
      if (!dry) check(gql(`mutation ($id: ID!, $v: [ProductVariantsBulkInput!]!) { productVariantsBulkUpdate(productId: $id, variants: $v) { userErrors { field message } } }`,
        { id: p.id, v: bare.map(v => ({ id: v.id, inventoryItem: { sku: `US-${v.sku}` } })) }, { mutation: true }), 'productVariantsBulkUpdate');
      renamed += bare.length;
    }
    const skus = p.variants.nodes.map(v => isBareAsin(v.sku) ? `US-${v.sku}` : v.sku ?? '');
    const tags = [...new Set(skus.map(s => s.startsWith('AE-') ? 'amazon-uae' : s.startsWith('US-') ? 'amazon-us' : null).filter(Boolean))]
      .filter(t => !p.tags.includes(t));
    if (tags.length) {
      if (!dry) check(gql(`mutation ($id: ID!, $t: [String!]!) { tagsAdd(id: $id, tags: $t) { userErrors { field message } } }`,
        { id: p.id, t: tags }, { mutation: true }), 'tagsAdd');
      tagged++;
    }
  }
  after = page.pageInfo.hasNextPage ? page.pageInfo.endCursor : null;
} while (after);
console.log(`${dry ? 'dry run: ' : ''}${products} products, ${renamed} SKUs ${dry ? 'to rename' : 'renamed'}, ${tagged} products ${dry ? 'to tag' : 'tagged'}`);
