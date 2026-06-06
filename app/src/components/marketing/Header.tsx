'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PLAN_CTA, PLAN_CTA_HREF } from '@/lib/copy';
import { Button } from './Button';
import { Logo } from './Logo';

const navLink = (active: boolean) =>
  `text-body-md transition-colors ${active ? 'text-primary font-medium' : 'text-on-surface-variant hover:text-primary'}`;

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <Logo size="sm" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          <Link
            href="/routes"
            className={navLink(pathname.startsWith('/routes') || pathname === '/professionals')}
          >
            Relocation Routes
          </Link>
          <Link href="/how-it-works" className={navLink(pathname === '/how-it-works')}>
            How It Works
          </Link>
          <Link href="/professionals" className={navLink(pathname === '/professionals')}>
            For Professionals
          </Link>
          <Link href="/pricing" className={navLink(pathname === '/pricing')}>
            Pricing
          </Link>
        </nav>

        <Button href={PLAN_CTA_HREF} size="sm">
          {PLAN_CTA}
        </Button>
      </div>
    </header>
  );
}
