# market/store

Everything the store scripts (`market/tools/`) put into Shopify, and the research behind it.

```
store/
├── content.json        collections (categories and sub-categories), pages, main menu, policies, languages, in
│                       English and Arabic → `setup-store.mjs`
├── products/           the products, one file per round of imports → `setup-products.mjs`, `merge-variants.mjs`
│   ├── round-1.json      2026-10-15/16: the sample products and batches 1–2 (114)
│   ├── round-2.json      2026-10-30: batches 3–8, every category (339)
│   ├── round-3.json      2026-10-30: the Academy instruments round, Amazon US (173)
│   └── round-4.json      2026-10-30: the Amazon UAE round (131, source "ae")
└── rounds/             how each round was chosen: per batch the list (`batch-N.json`: Amazon IDs, prices, weights,
    │                   notes) and the review checklist (`batch-N-links.md`), plus the files uploaded to the importer
    ├── round-1/          batches 1–2 (imported one by one with Ryviu)
    ├── round-2/          batches 3–8, `variants-plan.md`, `import-1.csv` and `import-2.csv` for Spreadr
    ├── round-3/          the Academy instruments round (Amazon US): `list.json`, the review checklist `list.md`, `import.csv`
    └── round-4/          the Amazon UAE round (amazon.ae, prices in AED): `list.json`, the review checklist `list.md`, `import.csv`
```

A product entry (`products/round-N.json`) holds our English and Arabic title and text, type (which places it in its
sub-category), brand, source (`us` or `ae`), the Amazon price as `cost` and the weight as `kg` (one value, or one per variant), stock, photos
to keep, and for products sold with a choice, `merge_variants` and `options` (the variants and their Arabic names).

## SKUs and sources

Every imported variant's SKU says which Amazon to buy it from, then its Amazon ID: `US-B0…` for amazon.com,
`AE-B0…` for amazon.ae (standard from 2026-10-30; `skuFor` in `market/tools/store-lib.mjs`). It shows on every order
line and packing slip. A product entry's `source` is `us` (the default) or `ae`, and the product is tagged `amazon-us` or
`amazon-uae` (filter by tag in Shopify's product list). Customers see neither. Products imported before the standard were
renamed by `market/tools/fix-skus.mjs`.

## Importing a round

1. Upload the round's CSV files (`ASIN,SKU`, the SKU with its `US-`/`AE-` prefix) in Spreadr → Bulk Import, "Import
   single product", in the matching region (United States, or United Arab Emirates for `AE-` files).
2. `node market/tools/setup-products.mjs --round N`: our texts, types, prices, stock, photos; Active.
3. `node market/tools/merge-variants.mjs --round N`: products sold with a choice become one product with variants.
4. `node market/tools/setup-products.mjs --round N` again: prices per variant and the Arabic option names.
5. `node market/tools/setup-store.mjs --only menu`: sub-categories that now have products come into the menu.

Prices: round_up((cost + kg × $20) × 1.3) − 0.01 (the 2026-10-29 rule, `setup-products.mjs`).
