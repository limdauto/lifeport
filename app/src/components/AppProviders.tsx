'use client';

import { ReactNode } from 'react';
import { ConvexClientProvider } from '@/components/ConvexClientProvider';
import { FloatingDebugToolbar } from '@/components/debug/FloatingDebugToolbar';
import { DevStatusBanner } from '@/components/DevStatusBanner';
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ConvexClientProvider>
      <DevStatusBanner />
      {children}
      <FloatingDebugToolbar />
    </ConvexClientProvider>
  );
}
