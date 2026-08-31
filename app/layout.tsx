import type { Metadata } from 'next';
import { Playfair_Display, Space_Grotesk, Merriweather, Poppins, Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeFavicon } from '@/components/theme-favicon';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { CommandPaletteLoader } from '@/components/command-palette-loader';
import { PromoBanner } from '@/components/promo-banner';
import { SiteAnnouncement } from '@/components/site-announcement';
import { ToastProvider } from '@/components/toast-provider';
import { PageTransition } from '@/components/page-transition';

// Apply the browser-saved appearance before React hydrates. The preference is
// intentionally client-owned so navigating between pages cannot reset it from
// a stale server value.
const appearanceBootstrap = `(() => {
  try {
    const root = document.documentElement;
    const get = (key) => localStorage.getItem(key);
    const colorTheme = get('novatools-color-theme');
    const theme = get('novatools-theme');
    const font = get('novatools-font');
    const radius = get('novatools-radius');
    const scale = get('novatools-ui-scale');
    const motion = get('novatools-motion');

    if (colorTheme) root.setAttribute('data-theme', colorTheme === 'custom' ? 'gold' : colorTheme);
    if (theme) root.classList.toggle('dark', theme === 'dark');
    if (font) root.setAttribute('data-font', font);
    if (radius) root.setAttribute('data-radius', radius);
    if (scale) root.setAttribute('data-ui-scale', scale);
    if (motion) root.setAttribute('data-motion', motion);
  } catch {
    // The ThemeProvider supplies defaults when browser storage is unavailable.
  }
})();`;

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['500', '600', '700', '800'], variable: '--font-playfair', display: 'swap' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-space-grotesk-alt', display: 'swap' });
const merriweather = Merriweather({ subsets: ['latin'], weight: ['700', '900'], variable: '--font-merriweather', display: 'swap' });
const poppins = Poppins({ subsets: ['latin'], weight: ['500', '600', '700', '800'], variable: '--font-poppins', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

const SITE_URL = 'https://novatools.app';
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'NovaTools — Free Online Tools That Save You Time', template: '%s | NovaTools' },
  description: 'Hundreds of free online tools for text, images, PDFs, developers, calculators, and more. No installation required — most tools need no account at all.',
  keywords: ['online tools', 'free tools', 'calculator', 'converter', 'developer tools', 'pdf tools'],
  openGraph: { type: 'website', url: SITE_URL, title: 'NovaTools — Free Online Tools That Save You Time', description: 'Hundreds of free online tools. No installation required for most — just open and use.', siteName: 'NovaTools' },
  twitter: { card: 'summary_large_image', title: 'NovaTools — Free Online Tools That Save You Time', description: 'Hundreds of free online tools. No installation required for most — just open and use.' },
  robots: { index: true, follow: true },
  manifest: '/manifest.json',
  icons: { icon: '/icon.svg', apple: '/icon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fontVars = `${playfair.variable} ${spaceGrotesk.variable} ${merriweather.variable} ${poppins.variable} ${inter.variable}`;
  return (
    <ClerkProvider appearance={{ variables: { colorPrimary: '#C9A961' } }}>
      <html lang="en" className={fontVars} suppressHydrationWarning>
        <body className="flex min-h-screen flex-col bg-noise">
          <script dangerouslySetInnerHTML={{ __html: appearanceBootstrap }} />
          <ThemeProvider>
            <ThemeFavicon />
            <ToastProvider>
              <SiteAnnouncement />
              <PromoBanner />
              <Navbar />
              <CommandPaletteLoader />
              <main className="flex-1"><PageTransition>{children}</PageTransition></main>
              <Footer />
            </ToastProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
