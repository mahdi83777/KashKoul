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

As of step 0 the theme is still plain Horizon. Kashkoul changes will go into new files (named `kashkoul-…`)
wherever possible, so Horizon updates can still be applied.

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
shopify theme check --path market/theme                             # lint: Liquid errors, missing translations, …
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
