'use client';

import { useQuery } from 'convex/react';
import { api } from 'convex/_generated/api';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { PAID_PRODUCT_NAME } from '@/lib/copy';
import { reportStatusLabel } from '@/lib/statusLabels';

type Filter = 'all' | 'needs_review' | 'published' | 'package_requests';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All cases' },
  { id: 'needs_review', label: 'Needs review' },
  { id: 'published', label: 'Published' },
  { id: 'package_requests', label: 'Package requests' },
];

export function AdminCaseList() {
  const searchParams = useSearchParams();
  const filter = (searchParams.get('filter') as Filter) || 'all';
  const cases = useQuery(api.admin.listCases, { filter });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Cases</h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            Review Lifeport Plans, edit sections, and publish to customers.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.id}
            href={f.id === 'all' ? '/admin/cases' : `/admin/cases?filter=${f.id}`}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === f.id
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {cases === undefined ? (
        <p className="mt-8 text-on-surface-variant">Loading…</p>
      ) : cases.length === 0 ? (
        <p className="mt-8 rounded-xl border border-outline-variant/40 p-8 text-center text-on-surface-variant">
          No cases in this view.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-outline-variant/40">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-outline-variant/40 bg-surface-container-low text-on-surface-variant">
              <tr>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Route</th>
                <th className="px-4 py-3 font-semibold">Progress</th>
                <th className="px-4 py-3 font-semibold">{PAID_PRODUCT_NAME}</th>
                <th className="px-4 py-3 font-semibold">Packages</th>
                <th className="px-4 py-3 font-semibold">Updated</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((row) => (
                <tr
                  key={row._id}
                  className="border-b border-outline-variant/20 hover:bg-surface-container-low/60"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/cases/${row._id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {row.name}
                    </Link>
                    <p className="text-xs text-on-surface-variant">{row.email}</p>
                  </td>
                  <td className="px-4 py-3 text-on-surface">{row.routeTitle}</td>
                  <td className="px-4 py-3">
                    <StatusBadge kind="case" status={row.status} />
                  </td>
                  <td className="px-4 py-3 text-on-surface-variant">
                    {row.livingStatus ? reportStatusLabel(row.livingStatus) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    {row.requestedPackages > 0 ? (
                      <span className="font-semibold text-tertiary">
                        {row.requestedPackages} requested
                      </span>
                    ) : (
                      <span className="text-on-surface-variant">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-on-surface-variant">
                    {new Date(row.updatedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
