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
| 2026-10-15 | **Running the shop:** Academy WhatsApp (+961 78 721 968); items in stock *and* on order; one flat delivery fee everywhere in Lebanon, with time-limited offers through Shopify Discounts; free pickup in Khaldeh; delivery 3–5 days (in stock; first set at 1–3, changed the same day) / 2–4 weeks (on order); deposit by Whish on on-order items above an amount (amount and % are editable settings); returns only for damaged or wrong items within 48 hours; prices in USD only; discount code for Academy students and teachers; Arabic in simple standard Arabic; Arabic name سوق كشكول | Answered in step 2, with Academy and Studio sites as the source for contact, hours and tone. Details in `docs/market/content.md`. |
| 2026-10-15 | **Numbers:** delivery $5 flat; deposit 30% on on-order items when the order is over $100; Academy students and teachers 10% off; no warranty; special requests yes (Amazon link on WhatsApp, optional photo and variation) | Answered after the step 2 draft. |
| 2026-10-15 | **Help pages are designed pages**, not text pages; all wording in `market/strings.json`, all shop numbers in theme settings | Text-only pages looked poor; one set of pieces (cards, big numbers, bands) keeps every page consistent and lets the owner change a number once. |
| 2026-10-15 | **Header and menu:** logo left like the Academy and Studio; one "Shop" dropdown instead of four category tabs; one-tap language switch; no Contact page | The menu was crowded; WhatsApp is on every page, so a Contact page added nothing. |
| 2026-10-15 | **Homepage v2 and footer A:** the homepage stays about the Market (categories, products) in the pages' style, plus short Delivery and How-to-order sections; footer A "compact brick" | Chosen on the homepage v2 board; previews of other pages on the homepage were too much. |
| 2026-10-15 | **Page width:** content up to 1440px, centered, 40px side margins; full width below that | Full width on laptops, comfortable line lengths on big monitors (full width compared and rejected). |
| 2026-10-15 | **Shop page and product page:** stock levels decide In stock / On order / Sold out; shop filters are Type, Brand and Price (no "Availability" filter); products load as you scroll; options are dropdowns; breadcrumbs instead of a Back button | Shopify's own Availability filter counts on-order items as in stock. Dropdowns keep long option lists (6 gauges, 7 colors) to one line. |
| 2026-10-15 | **English and Arabic** on every page, **mobile first** | Customers order from their phones, in either language. |
| 2026-10-15 | **Build on a free development store** and move to a paid plan at launch | Costs nothing while building. Created as a "client transfer" store, so it becomes the real store at launch with nothing rebuilt. |
| 2026-10-15 | **Theme base: Horizon** (Shopify's free theme, v4.3.0), **styled to look like Shopify's "Studio" theme** | Studio's look was the favorite (Atelier, Tinker and Horizon were also compared), but Studio has no Arabic support: no right-to-left layout and no Arabic text file. Horizon has both built in, and Studio's look is mostly settings (serif type, deep ink color on near-white, colored panels, pill buttons), which Horizon can reproduce. If the step 1 style board doesn't convince, the fallback is Studio with Arabic added by hand. |
| 2026-10-16 | **Importer: Ryviu (free plan)**, one link at a time, 500 variants a month; our script does the rest | Spreadr can't be paid for on a development store; Ryviu keeps each variant's Amazon ID, which the script uses to find and price products. |
| 2026-10-16 | **Price = round_up((Amazon price + kg × $15) × 1.2) − 0.01**, by real weight only | Option 2 of the pricing proposals: simple, covers shipping by weight, and the cost stays visible in the admin. |
| 2026-10-29 | **Price = round_up((Amazon price + kg × $20) × 1.3) − 0.01**, by real weight only | Replaces the 2026-10-16 rule ($15 a kg, 20% margin): shipping now $20 a kg and the margin 30%. |
| 2026-10-16 | **Every instrument taught at the Academy is in the shop, with several choices each** | The Market's first job is to equip the Academy's students. |
| 2026-10-16 | **Sub-categories by product type** (Instruments, Strings & accessories), **Studio & recording** as its own category, **filters in a sidebar** on computers with Type and Brand collapsed | ~115 products need more than four categories; automatic collections keep working when the owner adds products. |

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

## Step 3 — Homepage, help pages & footer ✅ (2026-10-15)

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
- [x] Store currency → US dollars

**3b — Designed help pages** ✅ (approved 2026-10-15; committed `d376a5e`)

- [x] How to order, Delivery & pickup, Returns, FAQ, About — each a designed page (title band with a toned photo,
      icon cards, big-number cards, notes, tap-to-open FAQ, mustard WhatsApp band), English and Arabic
- [x] Shop numbers are theme settings (Theme settings → Kashkoul): delivery fee, delivery times, deposit amount and %,
      Academy discount, return window — they flow into every page in both languages
- [x] One type scale and one section spacing for every page; title-band photo hidden on phones

**3c — Homepage v2 and a new footer** ✅ (committed `0a90f4c`, `40576fb`)

- [x] Mockup board (https://claude.ai/artifact/6hPXdz2CKwWz1qK1gXjQ5b): the homepage using the pages' pieces (big-number tiles, step cards, top questions, WhatsApp band)
      and three footer directions (compact brick · logo statement · light and calm), English and Arabic
- [x] Your choice: **footer A** (compact brick); the homepage stays about the Market and takes the pages' style (title band, delivery cards, step cards), not previews of the pages
- [x] Built and checked on a computer, in English and Arabic
- [x] Page width: content up to 1440px ("Wider", compared with 1152px and full width on the board)
- [x] Checked on a phone (by you)

**Review:** the built homepage and footer. → Approved 2026-10-15.

## Step 4 — Category & product pages ✅ (2026-10-15)

- [x] 5–10 sample products added by hand, in English and Arabic
- [x] Category page: grid, filters, sorting
- [x] Product page: photos, price, availability ("in stock" or "ships in about 2 weeks"), description
- [x] On every product: how to pay (cash on delivery or Whish) and the delivery time
- [x] Checked on phone and computer, in English and Arabic

**Availability rule (agreed):** taken from the stock count in the Shopify admin. Quantity above 0 = **In stock** (3–5 days); 0 with "continue selling when out of stock" = **On order** (2–4 weeks, deposit line shown); otherwise **Sold out**. Stock not tracked counts as in stock.

**4a — Product page** ✅
- "Shop · Instruments · Product" above the product, in the Market's label style (Bricolage capitals, terracotta, mustard dots); on phones only "‹ Instruments" (`sections/kashkoul-breadcrumbs.liquid`). No separate Back button.
- Photo and details side by side: a big photo (about 58% of the width) in a white frame as wide as its column and 3/4 as tall, never taller than the window, whole (Amazon photos aren't cropped); the details in a column of at most 500px with a 40px title; all colors in the gallery; choosing a size or color shows its photo at once.
- Size and Color side by side; quantity, Add to cart and Buy it now in one row of 40px buttons (Buy it now on its own row on phones); "Ask about this on WhatsApp" as a small link; the photo sits next to the details and the column starts level with it.
- Brand, title, price, availability line ("In stock · delivered in 3–5 days" / "On order · delivered in 2–4 weeks" / "Sold out"), options as dropdowns (Size ▾, Color ▾), Add to cart (solid) and Buy it now (outlined), "Ask about this on WhatsApp" link (with the product's name and link), short icon lines (pay on delivery · delivery $5 or free pickup · we confirm on WhatsApp · a quiet deposit note on on-order items), tabs: Description, Delivery & pickup, Returns.
- Availability and deposit lines follow the chosen option (`assets/kashkoul-product.js`).
- "You may also like" with the Kashkoul heading.
- In-stock delivery changed from 1–3 to **3–5 days** (theme setting default, help pages, docs).

**4b — Category page** ✅
- [x] Header: "Shop" label, the category title and description, and the categories as chips (the links under "Shop" in the main menu, so the owner manages them in Navigation) (`sections/kashkoul-collection-head.liquid`)
- [x] Filter & sort bar as pills with white drop-down panels. Filters: Type, Brand, Price (Search & Discovery app; Arabic labels النوع، الماركة، السعر; product types in Arabic). Shopify's "Availability" filter removed (it counts on-order items as in stock)
- [x] One product card everywhere (shop page, homepage, "You may also like", search, cart): white tile with rounded corners, square photo, In stock / On order / Sold out badge, brand, title of at most 2 lines, bold brick price (`blocks/kashkoul-card-meta.liquid`)
- [x] Same side margins on phones as the homepage; products load 24 at a time as you scroll; no grid-size switch
- [x] Phones: one full-width "Filter & sort" row with the product count; the drawer opens with every filter collapsed; counts in proper Arabic plurals (10 منتجات)
- [x] Each filter choice shows how many products it has (e.g. Strings 2), on computers and phones

**4c — Sample products** ✅ imported from Amazon with the Reputon app (free plan, 5 at a time), then cleaned up by `market/tools/setup-products.mjs` from `market/store/products/` (one file per round): our own English/Arabic title and description, short handle, brand, type, tag `sample`, no "compare at" price, option names and values in Arabic, 1–7 clean photos (no advert slides), and only the variants that belong to the product (the importer brings Amazon's whole family, e.g. 17 different pedals under one delay pedal).
- [x] Fender FA-25 guitar, Fender Venice ukulele, Eastar violin set, Akai MPK Mini MK3, D'Addario oud strings
- [x] Hal Leonard Guitar Method Book 1, Winsor & Newton Cotman set (12/16/24 colors), Donner Yellow Fall delay, Vic Firth Freestyle 5B, D'Addario NYXL 3 sets (6 gauges)
- [x] Stock levels: oud strings ×10, Hal Leonard ×10, Winsor & Newton ×10 each, Donner ×4; the others on order. The script only sets stock while it isn't tracked yet; after that the admin owns it

**4d — Check** ✅ computer checked by Claude, phone by Mohamad (Claude's browser window can't be narrowed), English and Arabic.

**Review:** how a product looks and reads.

## Step 5 — Ordering ✅ (2026-10-15)

- [x] **5a Cart** ✅: page and slide-out cart in English and Arabic. "Your cart" title; each item with its brand and an In stock / On order line; "Subtotal" with "Delivery is added at checkout. You won't pay now: we confirm on WhatsApp and you pay on delivery."; "Check out" / "إتمام الطلب" (Shopify's Arabic said "complete payment"); under the button: delivery $5 or free pickup, the deposit rule when it applies, the Academy discount line; the summary as a white card; "You may also like" in Arabic too. No payment icons or express-checkout buttons. The slide-out cart has a "View full cart" link to the cart page and closes on a click outside it (computers); product cards show the add-to-cart icon on phones too.
- [x] **5b Checkout** with two manual payment methods: Shopify's "Cash on Delivery (COD)" and "Whish (we'll contact you on WhatsApp)", each with our instructions, in English and Arabic. No card provider. The note under Payment says nothing is paid online.
- [x] Phone required in the address and labelled "WhatsApp number"; customers can leave a WhatsApp number or an email as contact; company name hidden; apartment and postal code optional; Shop-app link off. No billing address on delivery orders (it always equals the delivery address in Lebanon); on pickup orders Shopify still asks for one (can't be removed without Shopify Plus), so it's titled "Your details" / "بياناتك".
- [x] Delivery: Lebanon only, "Delivery anywhere in Lebanon" $5 flat (In stock: 3–5 days · On order: 2–4 weeks), no free-over-$45 rule; free pickup at "Kashkoul, Khaldeh" (usually ready in 2–4 days, with a pickup-ready message). The unused "International" zone was removed. Pickup location: "Kashkoul Academy of Arts, Khaldeh" (no street needed).
- [x] Checkout look: brick logo, brick buttons and links, paper order summary, Gloock headings, Fustat text. Checked in English and Arabic up to "Complete order" (no order placed).
- [x] **5c Order emails** in English and Arabic: Shopify's own emails with our logo and brick color, our payment instructions in the order confirmation, plus our lines: "What happens next" in the order confirmation and "the driver will call / have the amount ready / 48 hours" in the shipping confirmation (`docs/market/order-emails.md`). Sender verified: emails go out as "Kashkoul Market" from store+82890457318@shopifyemail.com, replies to kashkoulacademy@gmail.com; sending from no-reply@kashkoul.org moves to step 7 (needs DNS records at Namecheap).
- [x] **5d WhatsApp messages** for each moment of an order, in English and Arabic: `docs/market/whatsapp-templates.md`.
- [x] **5e Test orders** placed by Mohamad; orders and emails came through.

**Review:** the ordering experience and email text.

## Step 6 — Products 🔄 (2026-10-16)

With the owner. **114 products live** (on the test theme's store, all "on order"), none left in draft.

- [x] Importer: **Ryviu Amazon Importer, free plan** (500 variants a month, one product link at a time, then "Process
  Variants"). Spreadr couldn't be used (a development store can't approve paid app subscriptions; uninstalled, nothing
  charged); Ryviu's "Import Amazon Store" failed on Donner's store. Ryviu imports as Draft at Amazon's price, stock 0,
  with the Amazon link and each variant's Amazon ID (SKU) kept.
- [x] Pricing rule (option 2, **real weight only**): round_up((Amazon price + kg × $20) × 1.3) − 0.01 (since
  2026-10-29; it was kg × $15 and × 1.2 before). The Amazon price
  is kept in "Cost per item" and the weight in "Weight", so re-runs never compound. Bundles with a clip-on tuner (coin
  battery) are fine; no lithium batteries.
- [x] Our script `market/tools/setup-products.mjs` turns each import into a shop product from `market/store/products/` (one file per round):
  English and Arabic title, text and type, clean variants and options (with Arabic), fewer photos, price and cost,
  weight, "on order" stock, category, Active on the Online Store. Variants Amazon shows without a price are dropped.
- [x] The first 10 sample products were re-priced by the same rule (their Amazon price as cost), stock untouched.
- [x] **Batch 1**, 50 best sellers (`rounds/round-1/batch-1.json`, checklist `batch-1-links.md`): 47 imported (3 had
  more than 25 variants), 46 live. The Fender Dreadnought bundle was dropped (archived): same guitar as the FA-25.
  Decided: keep "Amazon Basics" as the brand on its products; no music stand needed.
- [x] **Batch 2**, every instrument taught at the Academy, several choices each (starter / step-up / better / kids)
  plus essentials (`rounds/round-1/batch-2.json`, checklist `batch-2-links.md`): 60 of 64 imported, 58 live (the
  P-145BT and P-225 came in as one product; the EJ95A oud strings were already in the shop, the duplicate is archived).
  Not imported: Sala SALA-A8 oud, qanun picks and Meinl riq (no price / out of stock), Eastar trumpet (same level as the
  Glory). Amazon US has no real buzuq (Turkish saz instead, named as such), and no starter qanun or riq.
- [x] Categories: Instruments, Strings & accessories, **Studio & recording** (its own category), Art supplies, Books &
  sheet music. **Sub-categories**, each an automatic collection by product type (`types` in `market/store/content.json`,
  applied by `setup-store.mjs --only collections,menu`), so new products land in them by themselves:
  - Instruments: Oud & saz, Qanun, Ney & flutes, Violin, Guitar & ukulele, Piano & keys, Winds, Percussion
  - Strings & accessories: Strings, Picks & small parts, Reeds mouthpieces & care, Cases & stands, Amps pedals & cables
  They sit under Shop in the main menu (the owner manages them in Navigation) and in the header's Shop menu under a
  +/− (collapsed by default). On the shop page (chosen on the navigation board, a mix of directions A and C): the
  categories are **tabs**, the sub-categories **round photo tiles with their count** (first tile = the whole category),
  and on computers the same list sits at the **top of the filter sidebar** with counts, the current category opened.
  Phones show the tabs and tiles only. A tile's photo is the sub-category's image in the admin (set to a chosen product
  photo; falls back to its first product's photo). The sidebar list folds up (open at first), each category with sub-categories has a +/−
  (open only for the one you're in), and the whole sidebar (categories + filters) **stays in view** while the products
  scroll, below the header when it slides back in. "All products" has its own title and one-line text (from `market/strings.json`,
  as Shopify's catalog has no description).
- [x] Cart: the slide-out cart no longer reopens by itself on the next page or after Back (it used to follow you
  from page to page).
- [x] Shop page with the real catalog: filters are a **sidebar on computers** (Horizon's "vertical" style; Type and
  Brand start collapsed and open when one of their values is ticked, Price open); phones keep the "Filter & sort"
  drawer, with a gap before the products. Price fields are rounded white fields like the rest of the Market. The
  **ticked filters show as chips above the products** (beside "Filters" on computers, under the pinned bar on phones),
  with "Clear all" when there are two or more; the sidebar no longer repeats them.
- [x] Product page: a row of **thumbnails** under the main photo on computers (Horizon's gallery setting, the photo
  frame made a little shorter so they fit in the window); phones keep swipe and dots.
- [x] Product page, calmer details column, **no full-width buttons**: quantity · Add to cart, then Buy it now ·
  "Ask about this" (WhatsApp icon, light outline) sharing the next row (also for sold-out products);
  pay / delivery / confirm / deposit lines in one soft box, all in the same style; Description, Delivery & pickup and
  Returns with thin lines and a +/− (like the menus and the sidebar).
- [x] Phones, shop page: a **"Category" button beside "Filter & sort"** (just the number of products), opening the
  categories list in a sheet from the bottom; the bar **stays pinned** at the top once scrolled past (below the header
  when it slides back in) until the products end.
- [x] Homepage "Shop by category": Studio & recording card (the Studio's turntable photo, toned like the others), five
  cards in one row on computers. Footer Shop column follows the main menu, so new categories appear there by themselves.
- [x] **Request a product** page (`/pages/request`, 2026-10-16): the Market's most asked-for service, so it's in the
  header menu (second, after Shop), the footer's Help column, the "Can't find it here?" band, the FAQ and search with no results.
  Built like the other help pages: title band (an oud from the Studio), "How it works" step cards (send the link → we
  reply on WhatsApp with the price → order like any item), then "Send your request": the form in a white card (Amazon
  link, size/color/version, quantity, name, WhatsApp number, optional email and notes) beside a mustard "Prefer
  WhatsApp?" card. It's Shopify's contact form, so each request is emailed to the shop. Both WhatsApp buttons (beside
  the form, and "Also send it on WhatsApp" after sending) open WhatsApp with everything typed, each under its label;
  that's also where a photo goes (forms can't take files). The FAQ answer links to the page and to WhatsApp.
  Tested by Mohamad on his phone (2026-10-16), with the search page: request emailed, WhatsApp message complete.
- [x] Header menu: only the page you're on is in mustard (Shop also on its categories and products).
- [x] Closing mustard bands ("Still have a question?", "Can't find it here?", "Something wrong with your order?") made
  compact on every page: no small label, a card-size title with its line, the button beside them (about half the height).
- [x] **Search page** in the shop's style: "Search" label, brick title ("Results for …"), a rounded search field,
  results with the filter sidebar (Type open there, as it does the category's job) and the "Can't find it here?" band.
  Nothing found: on the left a friendly message and the instruments as photo tiles, on the right a mustard "We can get it
  for you" card (Request a product); then the 15 newest products (three rows). The
  header search popup also offers Request a product when nothing is found.
- [ ] **Later:** Owner review of prices and the catalog. Points to check on the product pages: Al Cass valve oil (1 or 2
  bottles?), Sala ney's key (C), Gawharet El Fan darbuka photos vs design names, Glory alto sax colours (keep the
  bright ones?), a few accessories with only 1–2 photos.
- [ ] **Later:** Get the owner's own list of products (Amazon links or wishlist)
- [ ] **Later:** Next list: the 3 batch 1 items with more than 25 variants (Ernie Ball Regular Slinky, D'Addario EJ16 3-pack,
  Ernie Ball Polypro strap) and the batch 2 items that were unavailable. Ryviu has 78 variants left this month (resets
  monthly).
- [ ] **New categories from the owner** (approved 2026-10-29, `docs/market/categories.md`): 6 categories (Instruments,
  Accessories, Studio & sound, Art supplies, Vinyl & hi-fi, Books & sheet music), 33 sub-categories, each with its
  product types, in English and Arabic. Adapted from the owner's sheet: items that conflict with how the Market works
  removed (second-hand, can't be flown, lithium, oversized, software), thin types merged, short sentence-case names.
  Replaces the sub-categories above, including Art supplies and Books. **Set up in Shopify 2026-10-30**
  (`content.json` → `setup-store.mjs`): the 33 sub-categories and Vinyl & hi-fi created; the five categories recreated
  as automatic collections (each holds every type of its sub-categories, same addresses); the 13 old sub-categories
  removed, their addresses redirected in English and Arabic; the 114 products moved to the new types with their
  Arabic and re-priced by the 2026-10-29 rule (`setup-products.mjs`, run in 6 shards with `--shard k/6`). Sub-categories
  with no products yet stay out of the menu (and so the header, tiles, sidebar and footer) until they have some:
  re-run `setup-store.mjs --only menu` after each import. Studio & sound's card shows its collection image (studio
  headphones, changeable in the admin); the turntable photo moved to the new Vinyl & hi-fi card.
- [x] Homepage and footer for the new categories (published 2026-10-30): "Accessories" and "Studio & sound" names, the
  Vinyl & hi-fi card (six in a row on computers), empty categories' cards hidden. The live theme is now
  "Kashkoul Market" (189733044454); the previous one is kept as "Kashkoul Market — before 2026-10-30"
  (189216391398); the new working copy is 189736517862.
- [x] Product cards: the arch (approved and published 2026-10-30, after outline and top-line tests and four designs
  compared): a light paper tile, the photo in a white window with a semicircle top in a brick line (the shape of the
  Market logo, with room at the top so the arch never cuts the photo), the stock badge on the window's foot, brand,
  title and price centred. Same card on the shop pages, the homepage and "You may also like"; only `kashkoul.css`
  changed. The live theme is now "Kashkoul Market" (189736517862); the previous one is kept as "Kashkoul Market —
  before arch cards (2026-10-30)" (189733044454); the new working copy is 189764174054.
- [ ] Spreadr import batches to reach ~500 products (Spreadr installed 2026-10-29, bulk import now that the store is on
  a paid plan).
  - [ ] **Batch 3, Art supplies** (approved 2026-10-30, `market/store/rounds/round-2/batch-3*`): 82 products over all
    7 Art sub-categories and their types (the AnyMark alcohol markers removed). Spreadr test (3 products): imports as
    draft, SKU from the CSV for every variant (now `US-`/`AE-` + ASIN, see SKU standard), weight from Amazon, about 1.2 credits per variant; its price can be another
    offer's, so our list keeps the Amazon price as `cost` for `setup-products.mjs`. English and Arabic titles and texts
    written from the Amazon facts and added to `products/round-2.json` (photos: first 5 kept until chosen).
  - [ ] **Batches 4–8, the other categories** (approved 2026-10-30; mix chosen: Accessories +~110, Instruments +~50,
    Studio & sound +~55, Vinyl & hi-fi ~45, Books & sheet music ~40), same files per batch (`rounds/round-2/batch-N*`):
    4 Accessories 95 · 5 Instruments 49 · 6 Studio & sound 52 · 7 Vinyl & hi-fi 40 · 8 Books & sheet music 37. Rules
    decided: heavy items and few-review items kept; low-stock (≤ 3 left), out-of-stock and duplicate items left out;
    clip-on tuners with a coin battery allowed, anything with a built-in lithium battery left out. 10 instruments (Fender,
    Squier, Yamaha guitars and basses) show no price from Lebanon: their cost is read at import. Amazon US has few Arabic
    records; the owner may supply Arabic vinyl locally. All texts in English and Arabic in `products/round-2.json`.
  - [x] **Variants** (approved 2026-10-30, option B, `market/store/rounds/round-2/variants-plan.md`): 32 products sold with a choice
    (sizes, colours, gauges, strengths, lengths…), about 100 variants in all. Each variant is imported as a single
    product (its Amazon ID added to the batch CSV) and `market/tools/merge-variants.mjs` combines them into one product.
    The Liquitex 48-tube set, Elixir 9–42 strings and the 88-key cover became variants instead of separate products.
  - [ ] Next, for all 8 batches (409 Amazon IDs, about 1.2 credits each ≈ 491 credits, within the $10 budget: the 13
    heaviest products were removed for it, among them the Alesis e-drums, JBL and Eris E4.5 monitors, the LP120X turntable,
    the Rumble and Acoustasonic amps, the Squier Precision Bass and Classic Vibe guitars, the trombone and the cajon): buy credits,
    import `market/store/rounds/round-2/import-1.csv` (Art, Accessories: 228) and `import-2.csv` (Instruments, Studio, Vinyl, Books: 181) in Spreadr ("Import single product"), then `setup-products.mjs` → `merge-variants.mjs` →
    `setup-products.mjs`, choose photos, then `setup-store.mjs --only menu`. **Done 2026-10-30** except the photos: both
    files imported, set up, variants combined and set up again; every product checked (see round 4). Next: choose photos.
- [x] **Spreadr sync** (confirmed by Spreadr support 2026-10-30): on the Basic plan nothing syncs with Amazon, even
  though each imported product shows auto-sync "On"; our prices and stock stay as `setup-products.mjs` sets them. Auto
  sync is a Pro-and-above feature: **don't upgrade to Pro** without first turning product-level sync off (or price sync
  off), or Spreadr would replace our weight-based prices with Amazon's price plus its own markup.
- [x] **SKU standard** (decided 2026-10-30): the SKU says which Amazon to buy from, `US-<Amazon ID>` or `AE-<Amazon ID>`,
  so every order shows it; products are tagged `amazon-us` / `amazon-uae`; customers see neither. The products already in
  the store were renamed (`market/tools/fix-skus.mjs`), the round 2 and 3 import files use `US-`, round 4's will use `AE-`,
  and `setup-products.mjs` / `merge-variants.mjs` find products by the new SKU (older bare IDs are renamed when found).
- [ ] **Round 3, Amazon US** (list approved 2026-10-30, `market/store/rounds/round-3/list.md` and `list.json`):
  every Academy instrument (violin, guitar, piano, percussion, winds, oriental) in more brands, sizes and colours, plus
  the sub-categories still empty (electronic drums, podcast kits, keyboard & acoustic amps, DJ mixers) and some art,
  studio, vinyl and book additions. 173 products, 252 Amazon IDs (≈ 302 credits). Same rules as round 2; 16 big-brand
  products have their price read at import. Not the whole $10: the rest is kept for the Amazon UAE round. English and
  Arabic texts written from the Amazon facts (`products/round-3.json`, 41 products with choices). **Done 2026-10-30**
  except the photos: `rounds/round-3/import-1.csv` (Instruments: 118 IDs) and `import-2.csv` (Accessories, Studio, Art,
  Vinyl, Books: 134 IDs) imported in Spreadr, then `setup-products.mjs --round 3 --csv …` → `merge-variants.mjs` →
  `setup-products.mjs` (79 variants combined); the big-brand products' cost was taken from the import. Next: choose photos.
- [ ] **Round 4, Amazon UAE** (list approved 2026-10-30, `market/store/rounds/round-4/list.md` and `list.json`;
  amazon.ae, Spreadr region UAE, separate CSV; cost in AED ÷ 3.6725, same $20/kg shipping): what Amazon US lacks: ouds,
  a Turkish qanun, buzuqs, saz and setar, neys, kawala, zurna, riqs, darbukas, daf and bendir with their strings, cases
  and stands; 31 Arabic LPs (Fairuz, Umm Kulthum, Abdel Halim, Warda, Sabah, Wadih El Safi, Ziad Rahbani…); Arabic
  calligraphy (reed qalams, ink, ahar paper, practice books); oud, darbuka, qanun, saz and daf books; and big
  brands whose price amazon.ae shows (Yamaha PSR-A350 and Korg Pa700 oriental keyboards, Yamaha, Casio, Roland, Fender).
  131 products, 139 Amazon IDs (≈ 167 credits; with round 3 ≈ 469 credits, within $10). Products already in the shop
  left out (13). Many specialist oriental sellers list only 1–3 in stock: kept and marked, for the owner to decide. English and
  Arabic texts written from the amazon.ae facts (`products/round-4.json`, source `ae`). **Done 2026-10-30** except the
  photos: `rounds/round-4/import.csv` (139 IDs, `AE-` SKUs) imported in Spreadr with region UAE, set up, 8 variants
  combined, set up again. Then rounds 2–4 were all checked (643 products: active, on the Online Store, variant SKUs,
  source tag, price by the rule, Arabic title): all right (the 2 Spreadr test products of round 2 kept the variants
  Spreadr imported, correctly priced). `setup-store.mjs --only menu` run: all 39 categories under Shop have products;
  757 active products in the store. Next: choose photos.

**Review:** prices and the catalog.

## Step 7 — Launch ✅ (2026-10-29)

- [x] Send emails from no-reply@kashkoul.org (authenticated 2026-10-29): Namecheap forwards `no-reply` to the Academy
  Gmail; it's the sender in Shopify (Settings → Notifications); Shopify's six CNAMEs (`mailer2cs`, `2cs._domainkey`,
  `2cs2._domainkey`, `mailerst5`, `pdk1._domainkey.mailerst5`, `pdk2._domainkey.mailerst5`) and the `_dmarc` TXT (`v=DMARC1; p=none;`) are in
  Namecheap's Advanced DNS. Leave the forwarding MX records and the `v=spf1` TXT as they are.
- [x] Choose the paid plan and transfer the store to the owner's account (2026-10-29). Before it: the Kashkoul theme
  (189216391398) published as the live theme, the store email set. The transfer is sent from the Dev Dashboard to the
  owner's email only: the owner must not be a user in the Partner organization, or Shopify refuses. The owner
  (kashkoulacademy@gmail.com) picked the plan; Mohamad is a collaborator, and the CLI logins were renewed. The transfer
  removed the two manual payment methods: added back in Payments with the same text (`docs/market/content.md` §7), and
  their Arabic re-registered as translations. Delivery ($5, Lebanon) and pickup kept their settings and Arabic.
- [x] Connect `market.kashkoul.org` (2026-10-29): CNAME `market` → `shops.myshopify.com` in Namecheap; the primary
  domain in Shopify (Settings → Domains), so the `myshopify.com` address redirects to it
- [x] Policies, in English and Arabic (approved 2026-10-16, text in `docs/market/policies.md`, applied from
  `market/store/content.json` by `setup-store.mjs --only policies`): refund, shipping, privacy, terms and contact are in
  Shopify with the Arabic as translations (Shopify's automatic privacy policy turned off by Mohamad, ours applied), linked in the footer's bottom bar. Decided with them: a delivery fee is refunded when
  a return is our mistake; a deposit is refunded in full if we can't get the item; the confirmed price is the one paid.
  The policy pages (drawn by Shopify) have the Market's look: a "Policies" label and brick title aligned like the other
  pages, a reading-width text with brick lead-ins, pills linking the four policies, and the "Still have a question?"
  band (`snippets/kashkoul-policy.liquid`, from `layout/theme.liquid`).
- Going live needs the transfer: a development store keeps its password page and can't take public orders, so the plan
  (chosen by the account the store is transferred to) comes first. `market.kashkoul.org` and the sender domain can be
  connected before that; visitors would see the password page until launch.
- [x] Social sharing image and SEO (Online Store → Preferences), added 2026-10-29 with the title and description: the image is
  `docs/Kashkoul_Market/Share_Image/kashkoul-market-share.jpg` (1200×628, made from `kashkoul-market-share.html` next to it:
  brick panel with the mustard logo, "Instruments & art supplies, delivered in Lebanon" and the Arabic line, the oud
  photo). Home page title: "Kashkoul Market · Musical instruments & art supplies in Lebanon" / «سوق كشكول · آلات موسيقية
  ولوازم فنية في لبنان»; meta description in both languages.
- [ ] Analytics and Google/Meta sales channels (optional)
- [x] Set Market to `"live"` in `shared/sites.json` with its new address, then redeploy Academy and Studio
  (2026-10-29: `"path": "https://market.kashkoul.org/"`, `sync-house.mjs` keeps a full address as it is; merged to
  `main` and deployed, so kashkoul.org and /studio/ link to the Market)
- [x] Remove the store password and launch (2026-10-29). Test orders (#1001–#1003, cash on delivery and Whish,
  delivery and pickup) placed and cancelled; order emails from no-reply@kashkoul.org arrive; new-order alerts go to
  kashkoulacademy@gmail.com and the Shopify app; store time zone set to Beirut

- [x] A working copy of the theme for changes after launch: "Kashkoul Market — work" (first 189733044454, now
  189736517862, now 189764174054 after the 2026-10-30 publishes), duplicated from the live theme. Changes are pushed there, previewed and published once approved (`market/README.md`)

**Review:** go live. Approved 2026-10-29.

---

## After launch ⬜

- [ ] **Checkout closer to the site.** Already set in the checkout editor (step 5b): brick logo, brick buttons and links,
  paper order summary, Gloock headings, Fustat text. On the Basic plan the checkout's layout and steps stay Shopify's;
  the aim is the finer styling through Shopify's checkout branding settings: corner radius (the site's rounded pills),
  field and button styles, section backgrounds, the header, so it reads like the rest of the Market; and our own blocks
  on the thank-you and order-status pages (e.g. "What happens next" and a WhatsApp button). First check which of these
  the Basic plan allows; then each change is shown in English and Arabic on a phone before it's kept.

---

## Open questions

- None right now.

