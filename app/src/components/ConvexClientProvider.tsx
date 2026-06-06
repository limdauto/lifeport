'use client';

import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { ReactNode, useMemo } from 'react';

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const client = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!url) return null;
    return new ConvexReactClient(url);
  }, []);

  if (!client) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <p className="text-lg font-semibold text-on-surface">Convex not configured</p>
        <p className="mt-2 text-on-surface-variant">
          Run <code className="rounded bg-surface-container px-1.5 py-0.5">npx convex dev</code> in{' '}
          <code className="rounded bg-surface-container px-1.5 py-0.5">app/</code> to start the
          backend and set <code className="rounded bg-surface-container px-1.5 py-0.5">NEXT_PUBLIC_CONVEX_URL</code>.
        </p>
      </div>
    );
  }

  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
