'use client';

import { useEffect } from 'react';

/** Hides marketing chrome while browsing /admin. */
export function AdminChrome({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.body.classList.add('admin-mode');
    return () => document.body.classList.remove('admin-mode');
  }, []);

  return <>{children}</>;
}
