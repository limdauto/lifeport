# Lifeport

Relocation planning: free **Lifeport Check** + paid **Lifeport Plan**, backed by [Convex](https://convex.dev).

The product lives entirely in [`app/`](app/) (Next.js + Convex).

## Quick start

```bash
cd app
npm install
npm run dev
# http://localhost:3000
```

See [app/TESTING.md](app/TESTING.md) for smoke tests and the manual checklist.

## Deploy

- **Frontend:** Cloudflare Workers — set Workers Builds **root directory** to `app`, then build/deploy with `npm run deploy:cf` (see [app/.dev.vars.example](app/.dev.vars.example)).
- **Backend:** `cd app && npx convex deploy --prod`

## Funnel

```
Free Lifeport Check → Paid Lifeport Plan → Setup Packages → Expert Review
```
