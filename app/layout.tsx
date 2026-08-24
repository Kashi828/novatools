import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { CommandPalette } from '@/components/command-palette';
import { PromoBanner } from '@/components/promo-banner';
import { ToastProvider } from '@/components/toast-provider';
import { PageTransition } from '@/components/page-transition';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const SITE_URL = 'https://novatools.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'NovaTools — Free Online Tools That Save You Time',
    template: '%s | NovaTools',
  },
  description:
    'Hundreds of free online tools for text, images, PDFs, developers, calculators, and more. No installation required — most tools need no account at all.',
  keywords: ['online tools', 'free tools', 'calculator', 'converter', 'developer tools', 'pdf tools'],
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: 'NovaTools — Free Online Tools That Save You Time',
    description: 'Hundreds of free online tools. No installation required for most — just open and use.',
    siteName: 'NovaTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NovaTools — Free Online Tools That Save You Time',
    description: 'Hundreds of free online tools. No installation required for most — just open and use.',
  },
  robots: { index: true, follow: true },
  manifest: '/manifest.json',
  icons: { icon: '/icon.svg', apple: '/icon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: { colorPrimary: '#C9A961' },
      }}
    >
      <html lang="en" className={`${playfair.variable} ${inter.variable}`} suppressHydrationWarning>
        <body className="flex min-h-screen flex-col bg-noise">
          <ThemeProvider>
            <ToastProvider>
              <PromoBanner />
              <Navbar />
              <CommandPalette />
              <main className="flex-1">
                <PageTransition>{children}</PageTransition>
              </main>
              <Footer />
            </ToastProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
