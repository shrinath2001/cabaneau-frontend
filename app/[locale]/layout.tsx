import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { jost, raleway, logga } from '../fonts';
import { TranslationsProvider } from '../providers/TranslationsProvider';
import { BookingDatesProvider } from '../providers/BookingDatesProvider';
import { getTranslations } from '../lib/translations';
import { getNavLanguages, getNavCabins } from '../lib/nav';
import { isValidLocale, locales, type Locale } from '../lib/i18n';
import ConditionalHeader from '../components/ConditionalHeader';
import PromoBanner from '../components/PromoBanner';
import WhatsAppWidget from '../components/WhatsAppWidget';
import JsonLd from '../components/JsonLd';
import { buildOrganizationSchema, type BusinessSchemaData } from '../lib/structured-data';


interface HeroSettings {
  backgroundType: string;
  backgroundUrl: string;
  overlayColor: string;
  overlayOpacity: number;
  subtitle?: string;
  titleSleep?: string;
  titleHighlight?: string;
  titleAbove?: string;
  description?: string;
}

async function getHeroSettings(locale: string): Promise<HeroSettings> {
  const apiKey = process.env.API_KEY || '';
  const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3002/api/v1';
  const defaults: HeroSettings = { backgroundType: 'image', backgroundUrl: '', overlayColor: '#000000', overlayOpacity: 50 };
  try {
    const res = await fetch(`${apiBaseUrl}/site-settings/hero-section`, {
      headers: { 'x-api-key': apiKey, 'Accept-Language': locale },
      next: { revalidate: 30 },
    });
    if (!res.ok) return defaults;
    return await res.json();
  } catch {
    return defaults;
  }
}

async function getBusinessSchemaData(): Promise<BusinessSchemaData> {
  const apiKey = process.env.API_KEY || '';
  const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3002/api/v1';
  const defaults: BusinessSchemaData = {
    legalName: '',
    logoUrl: '',
    telephone: '',
    streetAddress: '',
    addressLocality: '',
    postalCode: '',
    addressCountry: 'BE',
    latitude: null,
    longitude: null,
    priceRange: '',
    sameAs: [],
    supportedLanguages: [],
  };
  try {
    const res = await fetch(`${apiBaseUrl}/site-settings/business-schema`, {
      headers: { 'x-api-key': apiKey },
      next: { revalidate: 300 },
    });
    if (!res.ok) return defaults;
    return { ...defaults, ...(await res.json()) };
  } catch {
    return defaults;
  }
}

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

  // Fetch translations, hero settings, global nav data, and the business
  // structured-data settings (CMS-editable, powers the site-wide Organization
  // JSON-LD block below)
  const [translations, heroSettings, navLanguages, navCabins, businessSchema] = await Promise.all([
    getTranslations(locale),
    getHeroSettings(locale),
    getNavLanguages(),
    getNavCabins(locale),
    getBusinessSchemaData(),
  ]);

  return (
    <html lang={locale} className={`${jost.variable} ${raleway.variable} ${logga.variable}`}>
      <head>
        {/* Font Awesome Pro Kit */}
        <Script
          src="https://kit.fontawesome.com/3c3bb2e437.js"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
        {/* Site-wide Organization/LodgingBusiness JSON-LD - other pages
            reference this by @id instead of repeating it (see
            buildWebsiteSchema/buildProductOfferSchema/buildBlogPostingSchema) */}
        <JsonLd data={buildOrganizationSchema(businessSchema, locale)} />
      </head>
      <body className="font-raleway antialiased">
        <TranslationsProvider initialTranslations={translations} locale={locale}>
          <BookingDatesProvider>
            <Suspense fallback={null}>
              <PromoBanner />
            </Suspense>
            <Suspense fallback={null}>
              <ConditionalHeader heroSettings={heroSettings} languages={navLanguages} cabins={navCabins} />
            </Suspense>
            <main>
              {children}
            </main>
            <Suspense fallback={null}>
              <WhatsAppWidget />
            </Suspense>
          </BookingDatesProvider>
        </TranslationsProvider>
      </body>
    </html>
  );
}
