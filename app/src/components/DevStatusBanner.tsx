'use client';

import { useQuery } from 'convex/react';
import { useEffect, useState } from 'react';
import { api } from 'convex/_generated/api';

export function DevStatusBanner() {
  const [mounted, setMounted] = useState(false);
  const routes = useQuery(api.routes.listRoutes);

  useEffect(() => setMounted(true), []);

  if (process.env.NODE_ENV !== 'development' || !mounted) return null;

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL ?? 'not set';
  const connected = routes !== undefined;
  const routeCount = routes?.length ?? 0;

  return (
    <div
      data-dev-banner
      className={`border-b px-4 py-2 text-center text-xs ${
        connected
          ? 'border-primary/20 bg-primary-fixed/50 text-on-primary-fixed'
          : 'border-error/20 bg-error-container text-on-error-container'
      }`}
    >
      {connected ? (
        <>
          <strong>Dev mode</strong> — Convex connected ({convexUrl}) · {routeCount} routes loaded
        </>
      ) : (
        <>
          <strong>Convex unreachable</strong> — run{' '}
          <code className="rounded bg-surface-container-lowest px-1">npm run dev</code> in{' '}
          <code className="rounded bg-surface-container-lowest px-1">app/</code> (starts Convex +
          Next.js together)
        </>
      )}
    </div>
  );
}
