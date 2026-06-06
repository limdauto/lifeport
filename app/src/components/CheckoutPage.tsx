'use client';

import { useAction, useQuery } from 'convex/react';
import { api } from 'convex/_generated/api';
import type { Id } from 'convex/_generated/dataModel';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/marketing/Button';
import { LIVING_CTA, PAID_PRODUCT_NAME } from '@/lib/copy';

export function CheckoutPage({ caseId }: { caseId: Id<'cases'> }) {
  const router = useRouter();
  const data = useQuery(api.reports.getCheck, { caseId });
  const createCheckout = useAction(api.stripe.createCheckout);
  const completeDevCheckout = useAction(api.stripe.completeDevCheckout);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devMode, setDevMode] = useState(false);
  const [priceGbp, setPriceGbp] = useState<number | null>(null);

  useEffect(() => {
    if (!data?.case || data.case.paymentStatus === 'paid') return;

    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const result = await createCheckout({ caseId });
        if (cancelled) return;
        if (result.mode === 'already_paid') {
          router.replace(`/report/${caseId}?tab=inputs`);
          return;
        }
        if (result.mode === 'stripe' && result.url) {
          window.location.href = result.url;
          return;
        }
        if (result.mode === 'dev') {
          setDevMode(true);
          setPriceGbp(result.priceGbp);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Checkout failed');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [caseId, createCheckout, data?.case, router]);

  if (data === undefined) {
    return <PageShell message="Loading checkout…" />;
  }

  if (!data) {
    return <PageShell message="Case not found. Complete your Lifeport Check first." />;
  }

  if (data.case.paymentStatus === 'paid') {
    return (
      <PageShell
        message="You're already unlocked."
        action={
          <Button href={`/report/${caseId}`}>Open your {PAID_PRODUCT_NAME}</Button>
        }
      />
    );
  }

  if (error) {
    return (
      <PageShell
        message={error}
        action={
          <Button
            onClick={() => {
              setError(null);
              setLoading(true);
              createCheckout({ caseId }).finally(() => setLoading(false));
            }}
          >
            Try again
          </Button>
        }
      />
    );
  }

  if (devMode) {
    return (
      <div className="container-page section mx-auto max-w-lg text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Dev checkout</p>
        <h1 className="mt-2 text-3xl font-bold text-on-surface">{LIVING_CTA}</h1>
        <p className="mt-3 text-on-surface-variant">
          Stripe is not configured. Simulate payment to continue building your {PAID_PRODUCT_NAME}.
        </p>
        {data.route && (
          <p className="mt-4 text-lg font-semibold text-on-surface">
            £{priceGbp ?? data.route.livingPriceGbp} · {data.route.title}
          </p>
        )}
        <Button
          className="mt-8"
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            try {
              await completeDevCheckout({ caseId });
              router.push(`/report/${caseId}?tab=inputs&paid=1`);
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Payment failed');
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? 'Processing…' : `Pay £${priceGbp ?? data.route?.livingPriceGbp ?? '—'} (dev)`}
        </Button>
      </div>
    );
  }

  return <PageShell message={loading ? 'Redirecting to secure checkout…' : 'Preparing checkout…'} />;
}

function PageShell({
  message,
  action,
}: {
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="container-page section mx-auto max-w-lg text-center">
      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      <p className="mt-6 text-lg font-semibold text-on-surface">{message}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
