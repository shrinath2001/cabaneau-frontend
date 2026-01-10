import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import "./globals.css";
import ConditionalHeader from './components/ConditionalHeader';
import { jost, raleway, logga } from './fonts';
import { TranslationsProvider } from './providers/TranslationsProvider';
import { getTranslations } from './lib/translations';
import { getLanguageFromCookie, COOKIE_NAME } from './lib/language';

export const metadata: Metadata = {
  title: 'Cabaneau - Luxury Cabin Rentals with Private Wellness',
  description: 'Experience luxury cabins with private wellness facilities, saunas, and stunning natural surroundings. Perfect for romantic getaways and peaceful retreats.',
  keywords: ['cabin rental', 'luxury cabins', 'private sauna', 'wellness retreat', 'romantic getaway', 'nature retreat'],
  authors: [{ name: 'Cabaneau' }],
  openGraph: {
    title: 'Cabaneau - Luxury Cabin Rentals with Private Wellness',
    description: 'Experience luxury cabins with private wellness facilities, saunas, and stunning natural surroundings.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Cabaneau',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cabaneau - Luxury Cabin Rentals',
    description: 'Experience luxury cabins with private wellness facilities.',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get locale from cookie
  const cookieStore = await cookies();
  const locale = cookieStore.get(COOKIE_NAME)?.value || 'en';

  // Fetch translations for the current locale
  const translations = await getTranslations(locale);

  return (
    <html lang={locale} className={`${jost.variable} ${raleway.variable} ${logga.variable}`}>
      <body className="font-raleway antialiased">
        <TranslationsProvider initialTranslations={translations} locale={locale}>
          <ConditionalHeader />
          <main className="pt-20">
            {children}
          </main>
        </TranslationsProvider>
      </body>
    </html>
  );
}
