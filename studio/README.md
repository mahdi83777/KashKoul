# Kashkoul Studio — website

The sibling of the Academy site: the same rooms in Khaldeh, rented as a furnished, lit, camera-ready set
(podcasts, interviews, music sessions, brand content, workshops).

```
studio/
└── prototype/
    ├── index.html          picker — opens the three prototypes side by side, lists what's real vs placeholder
    ├── 01-the-set.html     dark, cinematic, production-first
    ├── 02-paper.html       light, notebook-like — the Academy's closest sibling; weekly slot picker
    ├── 03-terra.html       bold poster on terracotta; "build your booking" estimator → WhatsApp
    └── assets/
        ├── photos/         from docs/Kashkoul_Space.pdf, resized to 1800px
        ├── logo/ fonts/ patterns/   copied from academy/assets + docs/Kashkoul_Deliverables
```

Each prototype is a single self-contained HTML file (inline CSS + JS, no build step). Open any of them
directly in a browser, or serve the folder:

```
cd studio/prototype && python3 -m http.server 8766     # → http://localhost:8766
```

## Shared with the Academy (so the two sites read as one family)

- Palette, Bricolage Grotesque + Fustat, the badge logo, the WhatsApp-first booking flow.
- The header lockup is the badge + **Kashkoul** + a small **Studio · استوديو** descriptor
  (the Academy shows "Academy of Arts" in its lockup).
- Footer "Kashkoul is two doors, one house" strip linking Academy ↔ Studio — the Academy site has the same strip.

## Placeholders

Every page has a **Show placeholders** button that highlights everything still to confirm
(prices, hours, minimum booking, deposit/cancellation, capacity, parking, audio gear, Instagram, email,
building/floor, an acoustic-room photo). The WhatsApp number is the Academy's for now.

## Where to see them online

They ship with the Academy site: `academy/tools/build.js --dist` copies `studio/prototype/` into `academy/dist/studio/`,
so after a push to `main` they're live at **kashkoul.org/studio/** — click the badge logo in the Academy footer.
`robots.txt` disallows `/studio/` so search engines ignore the prototypes.

## Next step

Pick a direction (or a mix), then it moves out of `prototype/` into the same partials/build structure
as `academy/` so both sites share one toolchain.
