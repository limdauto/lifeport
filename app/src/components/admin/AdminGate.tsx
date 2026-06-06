'use client';

import { useQuery } from 'convex/react';
import { api } from 'convex/_generated/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { Button } from '@/components/marketing/Button';
import { clearAdminSecret, getAdminSecret, setAdminSecret } from '@/lib/adminSession';

export function AdminGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const config = useQuery(api.admin.getAdminConfig);
  const [secret, setSecret] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSecret(getAdminSecret());
  }, []);

  if (secret) {
    return <>{children}</>;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = input.trim();
    if (!trimmed) {
      setError('Enter the admin secret.');
      return;
    }
    setAdminSecret(trimmed);
    setSecret(trimmed);
    router.refresh();
  }

  return (
    <div className="container-page section mx-auto max-w-md">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">Internal</p>
      <h1 className="mt-2 text-2xl font-bold text-on-surface">Admin sign-in</h1>
      <p className="mt-3 text-sm text-on-surface-variant">
        Founder review queue and report publishing. Set{' '}
        <code className="rounded bg-surface-container-high px-1.5 py-0.5 text-xs">ADMIN_SECRET</code>{' '}
        in Convex env to enable review-before-delivery.
      </p>

      {config?.devLoginHint ? (
        <p className="mt-4 rounded-lg border border-outline-variant/50 bg-surface-container-low px-4 py-3 text-sm text-on-surface-variant">
          Local dev: use <strong className="text-on-surface">{config.devLoginHint}</strong>
        </p>
      ) : null}

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-on-surface">Admin secret</span>
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-on-surface outline-none ring-primary focus:ring-2"
            autoComplete="current-password"
          />
        </label>
        {error ? <p className="text-sm text-error">{error}</p> : null}
        <Button type="submit" className="w-full">
          Continue
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-on-surface-variant">
        <Link href="/" className="text-primary hover:underline">
          Back to Lifeport
        </Link>
      </p>
    </div>
  );
}

export function AdminTopBar() {
  return (
    <header className="border-b border-outline-variant/40 bg-surface-container-low">
      <div className="container-page flex items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-6">
          <Link href="/admin/cases" className="font-semibold text-on-surface">
            Lifeport Admin
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/admin/cases" className="text-on-surface-variant hover:text-on-surface">
              Cases
            </Link>
            <Link
              href="/admin/cases?filter=needs_review"
              className="text-on-surface-variant hover:text-on-surface"
            >
              Needs review
            </Link>
            <Link
              href="/admin/cases?filter=package_requests"
              className="text-on-surface-variant hover:text-on-surface"
            >
              Package requests
            </Link>
          </nav>
        </div>
        <button
          type="button"
          onClick={() => {
            clearAdminSecret();
            window.location.href = '/admin/cases';
          }}
          className="text-sm text-on-surface-variant hover:text-on-surface"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
