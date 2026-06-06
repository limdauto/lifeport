import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import { ConvexClientProvider } from '@/components/ConvexClientProvider';
import { FloatingDebugToolbar } from '@/components/debug/FloatingDebugToolbar';
import { DevStatusBanner } from '@/components/DevStatusBanner';
import { Footer } from '@/components/marketing/Footer';
import { Header } from '@/components/marketing/Header';
import { PLAN_TAGLINE } from '@/lib/copy';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: 'Lifeport — Port your life to a new country',
  description: PLAN_TAGLINE,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} h-full`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
        />
      </head>
      <body className="flex min-h-full flex-col">
        <ConvexClientProvider>
          <DevStatusBanner />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingDebugToolbar />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
