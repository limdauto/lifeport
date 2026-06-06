# Lifeport

Relocation planning: free **Lifeport Check** + paid **Living Reports**, backed by [Convex](https://convex.dev) reactive state.

Everything runs in **one Next.js app** (`app/`).

## Quick start

```bash
cd app
npm install
npm run dev
# http://localhost:3000
```

## Funnel

```
Free Lifeport Check → Paid Living Report → Setup Packages → Expert Review
```

**Tagline:** *Start with a free Lifeport Check. Unlock your Living Report when you're ready to plan the move properly.*

## Site map

| URL | Page |
|-----|------|
| `/` | Marketing home |
| `/routes/uk-to-dubai` | Route landing |
| `/check?route=uk-to-dubai` | Lifeport Check intake |
| `/check/result/[id]` | Your Lifeport Check (reactive) |
| `/checkout?caseId=[id]` | Unlock Living Report (Stripe or dev pay) |
| `/report/[id]` | Living Report (Report tab) |
| `/report/[id]/inputs` | Update move profile + regenerate |
| `/report/[id]/packages` | Setup package recommendations |
| `/admin/cases` | Internal review queue (admin secret) |

See [TESTING.md](./TESTING.md) for the full checklist.

## Phases

- **Phase 1** ✓ Free Lifeport Check
- **Phase 2** ✓ Stripe checkout (dev mock without keys) + Living Report generation + route knowledge (`convex/lib/routeKnowledge.ts`)
- **Phase 3** ✓ Inputs tab, affected-section detection, regeneration + change log
- **Phase 4** ✓ Admin case list, section editor, publish, notes, generation logs
- **Phase 5** Export / email (not started)

### Founder review

Set `ADMIN_SECRET` in Convex env (`.env.local` for local). Living reports land in **needs review** until you publish from `/admin/cases`. Without `ADMIN_SECRET`, reports auto-publish for local dev.
