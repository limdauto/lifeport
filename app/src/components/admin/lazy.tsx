'use client';

import type { Id } from 'convex/_generated/dataModel';
import { ComponentType, ReactNode, useEffect, useState } from 'react';

function Loading({ label }: { label: string }) {
  return (
    <div className="container-page section mx-auto max-w-md text-center text-on-surface-variant">
      {label}
    </div>
  );
}

export function LazyAdminGate({ children }: { children: ReactNode }) {
  const [Gate, setGate] = useState<ComponentType<{ children: ReactNode }> | null>(null);

  useEffect(() => {
    void import('@/components/admin/AdminGate').then((m) => {
      setGate(() => m.AdminGate);
    });
  }, []);

  if (!Gate) return <Loading label="Loading admin…" />;
  return <Gate>{children}</Gate>;
}

export function LazyAdminCaseList() {
  const [List, setList] = useState<ComponentType | null>(null);

  useEffect(() => {
    void import('@/components/admin/AdminCaseList').then((m) => {
      setList(() => m.AdminCaseList);
    });
  }, []);

  if (!List) return <Loading label="Loading cases…" />;
  return <List />;
}

export function LazyAdminCaseDetail({ caseId }: { caseId: Id<'cases'> }) {
  const [Detail, setDetail] = useState<ComponentType<{ caseId: Id<'cases'> }> | null>(null);

  useEffect(() => {
    void import('@/components/admin/AdminCaseDetail').then((m) => {
      setDetail(() => m.AdminCaseDetail);
    });
  }, []);

  if (!Detail) return <Loading label="Loading case…" />;
  return <Detail caseId={caseId} />;
}
