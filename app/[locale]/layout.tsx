import { notFound } from 'next/navigation';
import { jost, raleway, logga } from '../fonts';
import { TranslationsProvider } from '../providers/TranslationsProvider';
import { getTranslations } from '../lib/translations';
import { isValidLocale, locales, type Locale } from '../lib/i18n';
import ConditionalHeader from '../components/ConditionalHeader';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

/**
 * Generate static params for all supported locales
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * Locale layout - wraps all pages under /[locale]/
 * Provides translations context and sets the html lang attribute
 */
export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate locale - redirect to 404 if invalid
  if (!isValidLocale(locale)) {
    notFound();
  }

  // Fetch translations for the current locale
  const translations = await getTranslations(locale);

  return (
    <html lang={locale} className={`${jost.variable} ${raleway.variable} ${logga.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
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
