# Kashkoul

Two sibling websites and the brand material behind them:

- **Kashkoul Academy of Arts** — a music academy in Khaldeh, Lebanon. Lessons.
- **Kashkoul Studio** — the same rooms, rented out as a furnished, lit, camera-ready space.

They share a palette, a typeface, a logo and a footer strip linking one to the other.

```
academy/      Kashkoul Academy website — kashkoul.org        (Netlify publishes academy/dist)
studio/       Kashkoul Studio website  — kashkoul.org/studio/ (built and published with it)
docs/         Brand guide, logos, fonts and source files from the designer
```

## Run locally

```
cd academy && npm run dev      # → http://localhost:8765  ·  Studio at /studio/
```

One script builds and serves both sites. `node` is the only requirement — no packages to install.
See `academy/README.md` and `studio/README.md` for the structure.

## Deploy

Hosted on Netlify at https://kashkoul.org — `netlify.toml` builds `academy/` and publishes `academy/dist/`,
which contains the Academy at the root, the Studio at `/studio/` and the early Studio drafts at
`/studio/prototypes/`. Every push to `main` deploys in ~30 s. See `academy/README.md`.
