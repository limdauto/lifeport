'use client';

import { useQuery } from 'convex/react';
import { api } from 'convex/_generated/api';
import Link from 'next/link';
import { isDebugEnabled } from '@/lib/debug/enabled';

export function DebugAdminGate({ children }: { children: React.ReactNode }) {
  const viewer = useQuery(api.users.viewer);

  if (!isDebugEnabled()) {
    return (
      <div className="container-page section mx-auto max-w-lg text-center">
        <p className="text-on-surface-variant">Debug previews are disabled.</p>
      </div>
    );
  }

  if (viewer === undefined) {
    return <p className="container-page section text-center text-on-surface-variant">Loading…</p>;
  }

  if (!viewer?.isAdmin) {
    return (
      <div className="container-page section mx-auto max-w-md text-center">
        <h1 className="text-headline-sm font-medium text-on-surface">Admin access required</h1>
        <p className="mt-3 text-body-md text-on-surface-variant">
          Debug previews are only available to signed-in admin users.
        </p>
        <Link
          href="/admin/cases"
          className="mt-6 inline-block rounded-xl bg-primary px-5 py-2.5 text-label-md font-semibold text-on-primary"
        >
          Sign in as admin
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
