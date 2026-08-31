import type { Metadata } from 'next';
import { cookies } from 'next/headers';
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
import { derivePrimaryRamp, deriveSecondaryRamp, deriveAccentRamp } from '@/lib/color-utils';

const appearanceBootstrap = `(() => {
  try {
    const root = document.documentElement;
    const get = (key) => localStorage.getItem(key);
    const colorTheme = get('novatools-color-theme');
    const theme = get('novatools-theme');
    if (colorTheme) root.setAttribute('data-theme', colorTheme === 'custom' ? 'gold' : colorTheme);
    if (theme) root.classList.toggle('dark', theme === 'dark');
    for (const [key, attr] of [['novatools-font','data-font'],['novatools-radius','data-radius'],['novatools-ui-scale','data-ui-scale'],['novatools-motion','data-motion']]) {
      const value = get(key); if (value) root.setAttribute(attr, value);
    }
  } catch {}
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
  robots: { index: true, follow: true }, manifest: '/manifest.json', icons: { icon: '/icon.svg', apple: '/icon.svg' },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const savedTheme = cookieStore.get('novatools-theme')?.value;
  const savedColorTheme = cookieStore.get('novatools-color-theme')?.value as 'gold' | 'emerald' | 'sapphire' | 'rose' | 'monochrome' | 'custom' | undefined;
  const savedCustomRaw = cookieStore.get('novatools-custom-colors')?.value;
  const font = cookieStore.get('novatools-font')?.value;
  const radius = cookieStore.get('novatools-radius')?.value;
  const scale = cookieStore.get('novatools-ui-scale')?.value;
  const motion = cookieStore.get('novatools-motion')?.value;

  const customStyle: Record<string, string> = {};
  if (savedColorTheme === 'custom' && savedCustomRaw) {
    try {
      const custom = JSON.parse(decodeURIComponent(savedCustomRaw)) as { primary: string; secondary: string; accent: string };
      const primary = derivePrimaryRamp(custom.primary);
      const secondary = deriveSecondaryRamp(custom.secondary);
      const accent = deriveAccentRamp(custom.accent);
      Object.assign(customStyle, {
        '--color-primary-50': primary[50], '--color-primary-100': primary[100], '--color-primary-400': primary[400], '--color-primary-500': primary[500], '--color-primary-600': primary[600], '--color-primary-700': primary[700],
        '--color-secondary-400': secondary[400], '--color-secondary-500': secondary[500], '--color-secondary-600': secondary[600],
        '--color-accent-400': accent[400], '--color-accent-500': accent[500], '--color-grad-1': primary[400], '--color-grad-2': primary[500], '--color-grad-3': secondary[500], '--color-glow': primary[500],
        '--logo-grad-1': custom.primary, '--logo-grad-2': custom.primary, '--logo-grad-3': custom.secondary,
      });
    } catch {}
  }

  const fontVars = `${playfair.variable} ${spaceGrotesk.variable} ${merriweather.variable} ${poppins.variable} ${inter.variable}`;
  return (
    <ClerkProvider appearance={{ variables: { colorPrimary: '#C9A961' } }}>
      <html lang="en" className={`${fontVars}${savedTheme === 'dark' ? ' dark' : ''}`} data-theme={savedColorTheme === 'custom' ? 'gold' : (savedColorTheme || 'gold')} data-font={font || undefined} data-radius={radius || undefined} data-ui-scale={scale || undefined} data-motion={motion || undefined} style={customStyle as React.CSSProperties} suppressHydrationWarning>
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
