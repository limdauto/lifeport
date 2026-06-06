'use client';

import { useAuthActions } from '@convex-dev/auth/react';
import { useQuery } from 'convex/react';
import { api } from 'convex/_generated/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { Button } from '@/components/marketing/Button';

function formatAuthError(err: unknown): string {
  const message = err instanceof Error ? err.message : 'Sign-in failed';
  if (message.includes('InvalidAccountId')) {
    return 'Admin account not found. Restart dev (npm run dev) to seed locally, or run npm run seed:admin.';
  }
  if (message.includes('InvalidSecret') || message.includes('Invalid credentials')) {
    return 'Wrong password.';
  }
  return message;
}

export function AdminGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { signIn, signOut } = useAuthActions();
  const viewer = useQuery(api.users.viewer);
  const config = useQuery(api.admin.getAdminConfig);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!config) return;
    if (!email && config.devAdminEmail) setEmail(config.devAdminEmail);
    if (!password && config.devAdminPassword) setPassword(config.devAdminPassword);
  }, [config, email, password]);

  if (viewer === undefined || config === undefined) {
    return (
      <div className="container-page section mx-auto max-w-md text-center text-on-surface-variant">
        Checking session…
      </div>
    );
  }

  if (viewer?.isAdmin) {
    return (
      <>
        <AdminTopBar onSignOut={() => signOut()} email={viewer.email ?? undefined} />
        {children}
      </>
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.set('email', email.trim());
      formData.set('password', password);
      formData.set('flow', 'signIn');
      await signIn('password', formData);
      router.refresh();
    } catch (err) {
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page section mx-auto max-w-md">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">Internal</p>
      <h1 className="mt-2 text-2xl font-bold text-on-surface">Admin sign-in</h1>
      <p className="mt-3 text-sm text-on-surface-variant">
        Sign in to review Lifeport Plans, publish reports, and use debug previews.
      </p>

      {config.devSeedEnabled && config.devAdminEmail && config.devAdminPassword ? (
        <div className="mt-4 rounded-lg border border-outline-variant/50 bg-surface-container-low px-4 py-3 text-sm text-on-surface-variant">
          <p className="font-medium text-on-surface">Local dev credentials (auto-seeded)</p>
          <p className="mt-2">
            Email: <code className="rounded bg-surface-container-high px-1.5 py-0.5 text-xs">{config.devAdminEmail}</code>
          </p>
          <p className="mt-1">
            Password:{' '}
            <code className="rounded bg-surface-container-high px-1.5 py-0.5 text-xs">{config.devAdminPassword}</code>
          </p>
        </div>
      ) : config.adminEmails.length ? (
        <p className="mt-4 rounded-lg border border-outline-variant/50 bg-surface-container-low px-4 py-3 text-sm text-on-surface-variant">
          Allowed: <strong className="text-on-surface">{config.adminEmails.join(', ')}</strong>
        </p>
      ) : null}

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-on-surface">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-on-surface outline-none ring-primary focus:ring-2"
            autoComplete="username"
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-on-surface">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-on-surface outline-none ring-primary focus:ring-2"
            autoComplete="current-password"
            required
          />
        </label>
        {error ? <p className="text-sm text-error">{error}</p> : null}
        {viewer && !viewer.isAdmin ? (
          <p className="text-sm text-error">
            Signed in as {viewer.email}, but that account is not an admin.
          </p>
        ) : null}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Please wait…' : 'Sign in'}
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

export function AdminTopBar({
  onSignOut,
  email,
}: {
  onSignOut: () => void | Promise<void>;
  email?: string;
}) {
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
            <Link href="/debug" className="text-on-surface-variant hover:text-on-surface">
              Debug
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3 text-sm">
          {email ? <span className="text-on-surface-variant">{email}</span> : null}
          <button
            type="button"
            onClick={() => onSignOut()}
            className="text-on-surface-variant hover:text-on-surface"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
