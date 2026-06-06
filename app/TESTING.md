# Testing Lifeport locally

```bash
npm run dev
# http://localhost:3000
```

## Smoke tests

**Free Lifeport Check**

```bash
npm run verify
```

Expected: `✓ Lifeport Check ready with 6 sections`

**Paid Living Report (dev checkout)**

```bash
npm run verify:paid
```

Expected: `✓ Living Report ready with 21 sections`

**Admin publish**

```bash
npm run verify:admin
```

Expected: `✓ Published living report — 18+ sections visible to customer`

## Manual checklist

### Phase 1 — Check

1. Open http://localhost:3000 — hero says **Port your life to a new country**
2. CTA: **Check my move**
3. Complete intake at `/check?route=uk-to-dubai`
4. Watch sections stream in at `/check/result/[caseId]`
5. Upgrade CTA links to `/checkout?caseId=[caseId]`

### Phase 2 — Living Report

1. From check result, click **Unlock your Living Report**
2. Dev mode: click **Pay £499 (dev)** (no Stripe keys needed)
3. Complete route-specific intake fields
4. Living Report generates at `/report/[caseId]` with Report tab sections

### Phase 3 — Living updates

1. Open **Inputs** tab on `/report/[caseId]`
2. Change **Move date** and save
3. Banner shows affected sections (timeline, tax, housing, etc.)
4. Click **Regenerate affected sections**
5. **Change Log** section updates with timestamped entry

### Phase 4 — Admin review

1. Open http://localhost:3000/admin/cases (sign in with `dev-admin` locally, or your `ADMIN_SECRET`)
2. Filter **Needs review** for unpublished living reports
3. Open a case — edit a section markdown, add an admin note
4. Click **Publish Living Report**
5. Customer view at `/report/[caseId]` shows full report

With `ADMIN_SECRET` set, customers see “expert review in progress” until publish.

## Stripe (optional)

Set in `.env.local`:

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Webhook URL: `https://[your-convex-deployment].convex.site/stripe/webhook`
