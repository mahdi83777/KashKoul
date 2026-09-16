# Kashkoul

Website and brand material for **Kashkoul Academy of Arts** — a music studio in Khaldeh, Lebanon.

```
academy/      The website (Netlify publishes academy/dist, built by `npm run dist`)
docs/         Brand guide, logos, fonts and source files from the designer
```

## Run locally

```
cd academy && npm run dev      # → http://localhost:8765
```

(`node` is the only requirement — no packages to install. See `academy/README.md` for the structure.)

## Deploy

Hosted on Netlify at https://kashkoul.org — `netlify.toml` builds `academy/` and publishes `academy/dist/`. See `academy/README.md`.
