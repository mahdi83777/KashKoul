# CLAUDE.md

Rules for working in this repo. Project rules go in this file, not in Claude's private memory.

## The project

Three Kashkoul sites share one brand (see `README.md` and `docs/` for logos, fonts and the brand guide):

- **Academy**: music lessons in Khaldeh, Lebanon. Static site in `academy/`, live at kashkoul.org.
- **Studio**: the same rooms rented by the hour or the day. Static site in `studio/`, at kashkoul.org/studio/.
- **Market**: instruments and art supplies sourced from Amazon US, resold and delivered in Lebanon. A Shopify
  store, being built now. Theme in `market/theme/`, roadmap in `docs/roadmap/market-1.0.0.md`.

The links between the sites (the strip above the menu and the cards above the footer) all come from
`shared/sites.json`.

## How to work with me

- **A question is not a go-ahead.** When I ask "can you…?" or "what do you think?", answer it. Don't start
  doing it, and don't create or change files until I say to.
- **Small steps, approved one at a time.** For bigger work, show the result of each step (colors, wording,
  layout) and wait for approval before moving on. Never build a whole site or feature in one go.
- **Commit and push only when I ask.** Work happens on `dev`; `main` deploys to kashkoul.org.
- **Keep docs in sync.** When a decision is made or a step is done, update the matching roadmap in
  `docs/roadmap/`.

## Kashkoul Market rules

- **English and Arabic, always.** Every page, label, button, email and message exists in both. Arabic is a
  full right-to-left version, not a translation tacked on.
- **Mobile first, always.** Most customers will order from a phone. Check every change on a phone-sized
  screen before showing it.
- **No online payment.** Customers pay cash on delivery, or by Whish arranged over WhatsApp. Don't add card
  payment, payment icons or "pay now" wording.
- **Follow the roadmap.** Work on one step of `docs/roadmap/market-1.0.0.md` at a time. Each step ends with
  my approval, and is marked done there.
- **Stay close to Horizon.** The theme is Shopify's free Horizon theme. Add Kashkoul changes in new files where
  possible and keep edits to Horizon's own files small, so Shopify's theme updates can still be applied.
- **Brand.** Market colors are brick `#66261c` with mustard `#dabd5c` on paper `#f4ebe2` (approved in step 1; the
  full table is in the roadmap). Fonts are Gloock for titles, Bricolage Grotesque for English labels and Fustat for
  body text and all Arabic. Logos are in `docs/Kashkoul_Market/`, fonts in `docs/Kashkoul_Deliverables/Fonts/`. The store
  owner manages products, so anything they touch must work from Shopify's admin, not from code.
