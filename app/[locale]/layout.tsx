import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Script from 'next/script';
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
        {/* Font Awesome Pro Kit */}
        <Script
          src="https://kit.fontawesome.com/3c3bb2e437.js"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body className="font-raleway antialiased">
        <TranslationsProvider initialTranslations={translations} locale={locale}>
          <Suspense fallback={<div className="h-[70px] md:h-[86px]" />}>
            <ConditionalHeader />
          </Suspense>
          <main className="pt-20">
            {children}
          </main>
        </TranslationsProvider>
      </body>
    </html>
  );
}
