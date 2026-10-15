# Kashkoul Market — Shopify theme

The online shop for instruments and art supplies, sourced from Amazon US and delivered in Lebanon.
Unlike the Academy and Studio, the Market is a **Shopify store**. Products, orders, customers, payments
and emails are managed in Shopify's admin (or the Shopify phone app). This folder only holds the **theme**,
meaning how the shop looks.

Plan and progress: `docs/roadmap/market-1.0.0.md`. Rules: `CLAUDE.md`.

```
market/
└── theme/          Shopify theme, based on Horizon 4.3.0 (Shopify's free theme, github.com/Shopify/horizon)
    ├── layout/     page shell (theme.liquid)
    ├── sections/   page sections the owner can add, move and edit in the theme editor
    ├── blocks/     the pieces inside sections
    ├── snippets/   shared bits of markup
    ├── templates/  which sections each page type starts with (JSON)
    ├── config/     theme settings: colors, fonts, … (settings_data.json is also written by the theme editor)
    ├── locales/    interface text per language (en.default.json, ar.json, …)
    └── assets/     CSS, JS, icons, fonts
```

Kashkoul changes live in new files named `kashkoul-…` wherever possible, so Horizon updates can still be applied.
The few edits to Horizon's own files are marked with a "Kashkoul:" comment (`layout/theme.liquid`,
`blocks/_header-logo.liquid`, `sections/header.liquid`; `snippets/list-filter.liquid` and `snippets/price-filter.liquid`,
where the phone filter drawer starts with every filter collapsed and each filter choice shows its product count; `blocks/filters.liquid`, for the full-width
"Filter & sort" row on phones and the product count in proper English/Arabic plurals; the cart files
`snippets/cart-products.liquid`, `snippets/cart-summary.liquid`, `snippets/cart-drawer.liquid` and `blocks/_cart-title.liquid`,
for our cart wording, the availability line on each item and `snippets/kashkoul-cart-info.liquid` under Check out). One can't carry a comment because it's inside a JSON
schema: `blocks/_product-card.liquid` lists `kashkoul-card-meta` among the blocks a product card accepts.

## The Kashkoul layer

```
market/
├── strings.json            English + Arabic text for the Kashkoul sections (from docs/market/content.md)
├── store/content.json      store content: categories, pages, main menu, their Arabic, published languages
├── store/products.json     sample products' clean-up: titles, descriptions, Arabic, options, photos to keep, stock
├── PHOTO-CREDITS.md        where the theme's photos come from
├── .theme-check.yml        Theme Check config (English + Arabic only)
├── tools/
│   ├── sync-strings.mjs    strings.json → theme/locales/en.default.json + ar.json ("kashkoul" key)
│   ├── sync-house.mjs      shared/sites.json → theme/snippets/kashkoul-house.liquid (links between the sites)
│   ├── setup-store.mjs     store/content.json → the store, through `shopify store execute` (safe to re-run)
│   ├── setup-products.mjs  store/products.json → the imported products (safe to re-run)
│   └── store-lib.mjs       shared helpers for the two store scripts
└── theme/
    ├── snippets/kashkoul-head.liquid   fonts, colors, type scale (--kk-fs-*), spacing (--kk-sec)
    ├── assets/kashkoul.css             styles for every Kashkoul section
    ├── sections/kashkoul-*.liquid      homepage, help pages, header strip, announcement, footer
    ├── blocks/kashkoul-*.liquid        product page: availability, WhatsApp question, info box, tabs;
    │                                   product cards: kashkoul-card-meta (badge on the photo + brand)
    ├── sections/kashkoul-breadcrumbs   product page: Shop · Category · Product (phones: ‹ Category)
    ├── sections/kashkoul-collection-head  shop/category page header with category chips
    ├── snippets/kashkoul-stock-state   in stock / on order / sold out, from the stock count
    ├── assets/kashkoul-product.js      keeps the availability and deposit lines in step with the chosen option
    ├── assets/kashkoul.js              site-wide: a click outside the open cart (computers) closes it
    └── templates/page.*.json           the designed pages: how-to-order, delivery-pickup, returns, faq, about
```

- **Text:** sections show the standard English or Arabic text from `strings.json` when their settings are empty;
  a setting the owner fills in wins (and is translated in Translate & Adapt).
- **Numbers** (delivery fee, delivery times, deposit, discount, return window) are in Theme settings → Kashkoul and
  flow into every page in both languages.
- **After editing** `strings.json` or `shared/sites.json`, run the matching sync script, then push the theme.

## Who edits what

| Change | Where |
|---|---|
| Products, prices, photos, stock, categories | Shopify admin → Products / Collections (owner) |
| Orders, customers, delivery status | Shopify admin → Orders / Customers (owner) |
| Payment methods (cash on delivery, Whish) | Shopify admin → Settings → Payments → Manual payment methods |
| Delivery fees and areas | Shopify admin → Settings → Shipping and delivery |
| Order email wording | Shopify admin → Settings → Notifications |
| Arabic text for products and pages | Shopify admin → Settings → Languages, then Translate & Adapt |
| Homepage text, images, section order | Shopify admin → Online Store → Themes → Customize (theme editor) |
| Layout, styling, new kinds of sections | This folder (code), then pushed to the store |

## Working on the theme

Needs Node (already used for the Academy) and Shopify's command-line tool:

```
npm install -g @shopify/cli@latest
shopify theme dev   --path market/theme --store kashkoul-market-fhsuuq5c   # live preview at http://127.0.0.1:9292, reloads on save
shopify theme check --path market/theme --config market/.theme-check.yml   # lint: Liquid errors, …
shopify theme push  --path market/theme --unpublished               # upload as a new, unpublished theme for review
```

The first command opens a browser to log in to Shopify. The store is `kashkoul-market-fhsuuq5c.myshopify.com`
(Shopify added the random ending; customers will see `market.kashkoul.org`).

**The theme editor writes back.** When someone changes settings or the homepage in Shopify's theme editor,
the store's `config/settings_data.json` and `templates/*.json` change. Before editing those files here, pull
the store's version first so their changes aren't overwritten:

```
shopify theme pull --path market/theme --store kashkoul-market-fhsuuq5c --only config/settings_data.json --only 'templates/*.json'
```

## Updating Horizon

Shopify releases Horizon updates on GitHub (`release-notes.md` lists what changed). To update, copy the new
release over `theme/`, keeping our `kashkoul-…` files and re-applying any small edits to Horizon's own files.
Then run `shopify theme check` and review the preview before pushing.
