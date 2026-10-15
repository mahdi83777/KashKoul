# Kashkoul Market 1.0.0 — roadmap

**Goal:** launch Kashkoul Market, an online shop for instruments and art supplies bought from Amazon US and
delivered in Lebanon, at `market.kashkoul.org`. English and Arabic, built for phones first.

**How we work:** one step at a time. Each step ends with a review. Nothing moves to the next step until it's
approved, and approved steps are marked ✅ here with the date.

| Status | Meaning |
|---|---|
| ⬜ | Not started |
| 🔄 | In progress |
| 👀 | Ready for review |
| ✅ | Approved |

---

## Decisions so far

| Date | Decision | Why |
|---|---|---|
| 2026-10-15 | **Shopify**, not WordPress/WooCommerce or a custom build | Admin is easy for the owner, with orders, emails, analytics and a phone app included. No servers, updates or security work. Amazon importer apps exist if the catalog grows to thousands. |
| 2026-10-15 | **Resell model.** We buy from Amazon US, then sell and deliver in Lebanon | Not affiliate links: Amazon US doesn't ship most items to Lebanon. |
| 2026-10-15 | **No online payment.** Cash on delivery, or Whish arranged over WhatsApp | How customers in Lebanon already pay. Set up as Shopify "manual payment methods". |
| 2026-10-15 | **Colors: brick & mustard** (option B), Kashkoul fonts (Gloock, Bricolage Grotesque, Fustat), Studio-style layout | Chosen on the step 1 style board over deep green & sand pink. |
| 2026-10-15 | **Running the shop:** Academy WhatsApp (+961 78 721 968); items in stock *and* on order; one flat delivery fee everywhere in Lebanon, with time-limited offers through Shopify Discounts; free pickup in Khaldeh; delivery 1–3 days (in stock) / 2–4 weeks (on order); deposit by Whish on on-order items above an amount (amount and % are editable settings); returns only for damaged or wrong items within 48 hours; prices in USD only; discount code for Academy students and teachers; Arabic in simple standard Arabic; Arabic name سوق كشكول | Answered in step 2, with Academy and Studio sites as the source for contact, hours and tone. Details in `docs/market/content.md`. |
| 2026-10-15 | **Numbers:** delivery $5 flat; deposit 30% on on-order items when the order is over $100; Academy students and teachers 10% off; no warranty; special requests yes (Amazon link on WhatsApp, optional photo and variation) | Answered after the step 2 draft. |
| 2026-10-15 | **Help pages are designed pages**, not text pages; all wording in `market/strings.json`, all shop numbers in theme settings | Text-only pages looked poor; one set of pieces (cards, big numbers, bands) keeps every page consistent and lets the owner change a number once. |
| 2026-10-15 | **Header and menu:** logo left like the Academy and Studio; one "Shop" dropdown instead of four category tabs; one-tap language switch; no Contact page | The menu was crowded; WhatsApp is on every page, so a Contact page added nothing. |
| 2026-10-15 | **Homepage v2 and footer A:** the homepage stays about the Market (categories, products) in the pages' style, plus short Delivery and How-to-order sections; footer A "compact brick" | Chosen on the homepage v2 board; previews of other pages on the homepage were too much. |
| 2026-10-15 | **Page width:** content up to 1440px, centered, 40px side margins; full width below that | Full width on laptops, comfortable line lengths on big monitors (full width compared and rejected). |
| 2026-10-15 | **English and Arabic** on every page, **mobile first** | Customers order from their phones, in either language. |
| 2026-10-15 | **Build on a free development store** and move to a paid plan at launch | Costs nothing while building. Created as a "client transfer" store, so it becomes the real store at launch with nothing rebuilt. |
| 2026-10-15 | **Theme base: Horizon** (Shopify's free theme, v4.3.0), **styled to look like Shopify's "Studio" theme** | Studio's look was the favorite (Atelier, Tinker and Horizon were also compared), but Studio has no Arabic support: no right-to-left layout and no Arabic text file. Horizon has both built in, and Studio's look is mostly settings (serif type, deep ink color on near-white, colored panels, pill buttons), which Horizon can reproduce. If the step 1 style board doesn't convince, the fallback is Studio with Arabic added by hand. |

## Costs to expect

| Item | Cost | When |
|---|---|---|
| Development store | Free | Now until launch |
| Shopify Basic plan | $39/month, or $29/month paid yearly. New stores have usually had a few months at $1. | From launch |
| Amazon importer app | Free for a few hundred products. About $10–30/month for thousands with automatic price sync. | Step 6 |
| Domain | $0. Uses a subdomain of kashkoul.org, which we already own. | Launch |
| Theme | $0 (Horizon is free) | — |
| Card processing fees | None, because there's no online payment | — |

Check prices on Shopify's site before paying. They change.

---

## Step 0 — Setup ✅ (2026-10-15)

Store: `kashkoul-market-fhsuuq5c.myshopify.com` (created 2026-10-15 as a client transfer store, Basic plan).

Get the development store running with the base theme so there is something to look at.

- [x] Create a Shopify Partner account and a development store (client transfer, Basic plan) — *you*
- [x] Share the store's `….myshopify.com` address
- [x] Install Shopify's command-line tool and connect it to the store — *me*
- [x] Upload Horizon unchanged and share a preview link — *me* (theme "Kashkoul Market — Horizon base", id 189216391398, unpublished)
- [x] Turn on Arabic as a second language in the store settings (added, not yet published; translate in step 2)
- [x] Optional: browse Shopify's other free themes in case one fits better (compared Studio, Atelier, Tinker, Horizon)

**Review:** is Horizon the right base? → Yes, styled after Studio (see decisions).

## Step 1 — Look & feel ✅ (2026-10-15)

Style board: https://claude.ai/artifact/MxEH1FuL4xXiR77TH9PGaQ

- [x] Color options: deep green + sand pink, brick + mustard, or both → **brick + mustard (option B)**
- [x] Fonts: Bricolage Grotesque (English), Fustat (Arabic and body text), Gloock (titles), as on the Academy and Studio
- [x] Logo: which Market lockup goes in the header, which in the footer, and the browser tab icon
- [x] Buttons, product cards and price style
- [x] Shown in English and Arabic, on a phone and on a computer

**Approved look:**

| Part | Choice |
|---|---|
| Page background | Paper `#f4ebe2` |
| Behind product photos | White `#ffffff` |
| Header, footer, buttons, titles | Brick `#66261c` (paper text on brick) |
| Announcement bar, panels, highlights | Mustard `#dabd5c` (brick text on mustard) |
| Small labels, links, second panel | Terracotta `#9b4a39` |
| Body text | Ink `#1f1e21` |
| Titles (English) | Gloock |
| Menu, buttons, labels (English) | Bricolage Grotesque |
| Body text, and all Arabic | Fustat (bold for Arabic titles) |
| Header logo | Arched "Market" lockup, mustard, on the brick header |
| Footer logo | Full lockup (Kashkoul · Market · EST 2026), mustard, on brick |
| Buttons | Pill-shaped (fully rounded) |
| Product cards | Photo on white, category label, name in Gloock, price; centered, no rounded corners |
| Layout | After Shopify's Studio theme: big serif headline, photo next to a colored panel. Header in one row with the logo on the left, as on the Academy and Studio (changed from the centered logo on 2026-10-15). |

**Review:** colors, fonts, logo. → Approved 2026-10-15: option B, fonts and pieces as shown.

## Step 2 — Structure & words ✅ (2026-10-15)

Approved text: `docs/market/content.md`.

Agree on what the site contains and every sentence on it, before any page is built.

- [x] Site map: home, categories, product page, cart, about, how ordering works, delivery, FAQ, contact
- [x] Product categories: instruments, strings & accessories, art supplies, books & sheet music
- [x] Homepage sections, in order
- [x] All text in English and Arabic: headline, how ordering works, delivery times and areas, cash on
      delivery / Whish, returns, FAQ, footer
- [x] Menu labels and button text in both languages

**Review:** the structure and every sentence. → Approved 2026-10-15.

## Step 3 — Homepage, help pages & footer 🔄

Preview: https://kashkoul-market-fhsuuq5c.myshopify.com/?preview_theme_id=189216391398 (Arabic: `/ar?preview_theme_id=…`)

**3a — Homepage and site frame** ✅ (built and reviewed 2026-10-15; committed `d376a5e`)

- [x] Header: Market logo on the left (as on the Academy and Studio), **Shop ▾** dropdown (the four categories + All
      products) · How to order · About, one-tap language switch (عربي / English), search, cart; mirrored in Arabic
- [x] Kashkoul strip (Academy · Studio · Market) above the header, mustard announcement under it (short wording on
      phones)
- [x] Homepage: headline + qanun photo, category cards (all four photos toned brick and mustard), New in the Market,
      storefront photo + panel, how ordering works
- [x] Footer: "Sourced for you." with Shop / Help rows, then the Academy / Studio / Market cards on paper
- [x] Floating WhatsApp button
- [x] Store content from `market/store/content.json`: 4 categories, 5 pages (Contact removed: WhatsApp is on every
      page), main menu, Arabic translations, Arabic published (`node market/tools/setup-store.mjs`)
- [x] Checked on a computer in English and Arabic, and on a phone (by you)
- [x] Store name "Kashkoul Market"; customer account links hidden
- [ ] Store currency → US dollars (Shopify admin → Settings → General), if not done yet

**3b — Designed help pages** ✅ (approved 2026-10-15; committed `d376a5e`)

- [x] How to order, Delivery & pickup, Returns, FAQ, About — each a designed page (title band with a toned photo,
      icon cards, big-number cards, notes, tap-to-open FAQ, mustard WhatsApp band), English and Arabic
- [x] Shop numbers are theme settings (Theme settings → Kashkoul): delivery fee, delivery times, deposit amount and %,
      Academy discount, return window — they flow into every page in both languages
- [x] One type scale and one section spacing for every page; title-band photo hidden on phones

**3c — Homepage v2 and a new footer** 🔄

- [x] Mockup board (https://claude.ai/artifact/6hPXdz2CKwWz1qK1gXjQ5b): the homepage using the pages' pieces (big-number tiles, step cards, top questions, WhatsApp band)
      and three footer directions (compact brick · logo statement · light and calm), English and Arabic
- [x] Your choice: **footer A** (compact brick); the homepage stays about the Market and takes the pages' style (title band, delivery cards, step cards), not previews of the pages
- [x] Built and checked on a computer, in English and Arabic
- [x] Page width: content up to 1440px ("Wider", compared with 1152px and full width on the board)
- [ ] Check on a phone

**Review:** the built homepage and footer.

## Step 4 — Category & product pages ⬜

- [ ] 5–10 sample products added by hand, in English and Arabic
- [ ] Category page: grid, filters, sorting
- [ ] Product page: photos, price, availability ("in stock" or "ships in about 2 weeks"), description
- [ ] On every product: how to pay (cash on delivery or Whish) and the delivery time
- [ ] Checked on phone and computer, in English and Arabic

**Review:** how a product looks and reads.

## Step 5 — Ordering ⬜

- [ ] Cart
- [ ] Checkout with two manual payment methods: "Cash on delivery" and "Whish (we'll contact you on WhatsApp)"
- [ ] Ask for a phone number at checkout, and only the address fields that matter in Lebanon
- [ ] Delivery fees and areas
- [ ] Order emails (confirmation, shipped, delivered) written in English and Arabic
- [ ] WhatsApp message templates for confirming an order
- [ ] A full test order from a phone

**Review:** the ordering experience and email text.

## Step 6 — Products ⬜

With the owner.

- [ ] Get the list of products from the owner (Amazon links or wishlist)
- [ ] Choose an Amazon importer app (candidates: Ryviu, GD Amazon Importer, Importio, Amazon Channel)
- [ ] Pricing rule per category: Amazon price + shipping to Lebanon (by weight) + customs + margin
- [ ] Check items can be shipped to Lebanon (no lithium batteries, liquids or oversized items)
- [ ] Import or add the first ~100 products. Arabic titles, and our own descriptions rather than Amazon's text.
- [ ] Organize products into categories

**Review:** prices and the catalog.

## Step 7 — Launch ⬜

- [ ] Choose the paid plan and transfer the store to the owner's account
- [ ] Connect `market.kashkoul.org`
- [ ] Policies: shipping, returns, privacy, terms, in English and Arabic
- [ ] Analytics and Google/Meta sales channels (optional)
- [ ] Set Market to `"live"` in `shared/sites.json` with its new address, then redeploy Academy and Studio
- [ ] Remove the store password and launch

**Review:** go live.

---

## Open questions

None right now.
