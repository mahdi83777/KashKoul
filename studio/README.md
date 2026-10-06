# Kashkoul Studio — website

The Academy's sibling: the same rooms in Khaldeh, rented as a furnished, lit, camera-ready space
(podcasts, interviews, music sessions, brand content, workshops). Same structure as `academy/`, so
both sites share one toolchain and one set of brand tokens.

```
studio/
├── index.html            GENERATED — do not edit (built from src/)
├── src/
│   ├── index.html        page shell: <head>, then one @include per section
│   └── partials/
│       ├── header.html · hero.html · ticker.html · entry.html · spaces.html · uses.html
│       ├── gear.html · how.html · gallery.html · faq.html · visit.html
│       ├── footer.html · lightbox.html
│       └── icons/        whatsapp.svg
├── css/
│   ├── main.css          entry point — imports everything below, in cascade order
│   ├── base/             tokens (shared with the Academy) · fonts · reset · utilities
│   ├── components/       buttons · header (nav, progress, mobile menu) · lightbox
│   └── sections/         hero · hero-desk · hero-intro (the opening) · ticker · entry · spaces ·
│                         uses · gear · how · gallery · faq · visit · footer
├── js/
│   ├── main.js           entry point — wires the modules below
│   ├── config.js         WhatsApp number, ticker facts, the "what for" list, the contact sheet  ← most edits happen here
│   ├── hero.js           the opening sequence, the cursor light, the typed definition
│   ├── uses.js           renders the "what people book it for" list + its preview photo
│   ├── gallery.js        renders the contact sheet, drag-to-scroll
│   ├── lightbox.js       click any photo to see it full size
│   ├── nav.js            solid header on scroll, reading progress, current section, mobile menu
│   ├── reveal.js         sections rise as they enter the viewport
│   ├── ticker.js · whatsapp.js · placeholders.js · motion.js
├── assets/               photos (from docs/Kashkoul_Space.pdf) · fonts · logo · patterns
└── prototype/            the two other first drafts, kept for reference → /studio/prototypes/
```

## Working on it

Both sites are built and served by one script, from `academy/`:

```
cd academy && npm run dev      # → http://localhost:8765  ·  Studio at /studio/
npm run build                  # one-off build of both sites
```

CSS and JS load directly in the browser (`@import` / ES modules), so only the HTML partials are built.
The site must be served over HTTP (not opened as a `file://`) because of the ES modules.

## The opening animation

Carried over from the Academy, restaged for the Studio — `css/sections/hero-intro.css` + `js/hero.js`:

| act | what happens | where |
|---|---|---|
| 1 | the photo prints, with a misregistered riso pass | `@keyframes print` / `misregister` |
| 2 | the headline writes itself, line by line (Latin →, Arabic ←) | `wipe-ltr` / `wipe-rtl` |
| 3 | three polaroids flutter onto the desk | `@keyframes flutter` |
| 4 | the buttons arrive | `rise-in` |
| 5 | the strip of uses is typed out | `js/hero.js` |

Everything is skipped when the visitor asks for reduced motion. The dictionary card types itself
separately, when it scrolls into view.

## Common edits

| Change | Where |
|---|---|
| WhatsApp number or default message | `js/config.js` |
| The "what people book it for" rows and their photos | `js/config.js` → `USES` |
| The fact strip under the hero | `js/config.js` → `TICKER` |
| The contact sheet at the bottom | `js/config.js` → `SHEET` |
| Section copy | `src/partials/<section>.html`, then `npm run build` |
| Links to the other Kashkoul sites (Academy, Market) | `../shared/sites.json` |
| Hours, policies, capacity | `src/partials/faq.html`, `visit.html` (all marked `.ph`) |
| Colours, fonts, nav height | `css/base/tokens.css` |
| Animation timings | `css/sections/hero-intro.css` (each act is one `animation:` line) |

## Placeholders

Every page carries a **Show placeholders** button that highlights what's still to confirm: minimum
booking, hours, capacity, parking, audio gear, Instagram, email, building and floor, and a photo of
the acoustic room. The WhatsApp number is the Academy's for now.

There are **no prices or payment terms on the site** — rates are discussed on WhatsApp.

There is deliberately **no online booking** — every call to action opens WhatsApp with a message
already written.

## Deploy

Published with the Academy: `npm run dist` (in `academy/`) puts the Academy at the root and this site
at `/studio/`, with the earlier drafts at `/studio/prototypes/`. See `academy/README.md`.
