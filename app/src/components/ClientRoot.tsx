'use client';

import { Footer } from '@/components/marketing/Footer';
import { Header } from '@/components/marketing/Header';
import { ReactNode, useEffect, useState } from 'react';

type ProvidersComponent = (props: { children: ReactNode }) => ReactNode;

/**
 * Lazy-load Convex on the client only. Cloudflare Workers cannot load Convex's Node `ws` stack
 * during SSR in the OpenNext worker bundle.
 */
export function ClientRoot({ children }: { children: ReactNode }) {
  const [Providers, setProviders] = useState<ProvidersComponent | null>(null);

  useEffect(() => {
    void import('@/components/AppProviders').then((m) => {
      setProviders(() => m.AppProviders);
    });
  }, []);

  const content = (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );

  if (!Providers) return content;
  return <Providers>{content}</Providers>;
}
