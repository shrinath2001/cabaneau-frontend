/**
 * JSON-LD structured-data builders. Pure functions only - no fetching here.
 * Callers (server components) fetch the data and pass it in, so every value
 * placed in a schema block is guaranteed to be the same value already used
 * to render the page's visible content.
 */

export interface BusinessSchemaData {
  legalName: string;
  logoUrl: string;
  telephone: string;
  streetAddress: string;
  addressLocality: string;
  postalCode: string;
  addressCountry: string;
  latitude: number | null;
  longitude: number | null;
  priceRange: string;
  sameAs: string[];
  supportedLanguages: string[];
}

// No NEXT_PUBLIC_SITE_URL is configured yet. Falls back to the current host.
// TODO: set NEXT_PUBLIC_SITE_URL once the final production domain is decided -
// @id values below must not change after the site goes live (see the JSON-LD
// implementation plan, "Explicitly deferred" section).
export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://cabaneau.amplyfitdigital.com';
}

export function organizationId(): string {
  return `${getSiteUrl()}/#organization`;
}

export function buildOrganizationSchema(business: BusinessSchemaData, locale: string) {
  const siteUrl = getSiteUrl();

  const hasAddress =
    business.streetAddress || business.addressLocality || business.postalCode;
  const hasGeo = business.latitude != null && business.longitude != null;

  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LodgingBusiness'],
    '@id': organizationId(),
    name: business.legalName || 'Cabaneau',
    url: siteUrl,
    inLanguage: locale,
    ...(business.logoUrl && { logo: business.logoUrl, image: business.logoUrl }),
    ...(business.telephone && { telephone: business.telephone }),
    ...(business.priceRange && { priceRange: business.priceRange }),
    ...(business.sameAs.length > 0 && { sameAs: business.sameAs }),
    ...(hasAddress && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: business.streetAddress || undefined,
        addressLocality: business.addressLocality || undefined,
        postalCode: business.postalCode || undefined,
        addressCountry: business.addressCountry || undefined,
      },
    }),
    ...(hasGeo && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: business.latitude,
        longitude: business.longitude,
      },
    }),
    ...(business.supportedLanguages.length > 0 && {
      availableLanguage: business.supportedLanguages,
    }),
  };
}

export function buildWebsiteSchema(locale: string) {
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/${locale}#website`,
    url: `${siteUrl}/${locale}`,
    name: 'Cabaneau',
    inLanguage: locale,
    publisher: { '@id': organizationId() },
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[], locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    inLanguage: locale,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export interface CabinProductInput {
  slug: string;
  name: string;
  description?: string;
  featuredImage?: string;
  images?: string[];
  /**
   * Nightly rate in EUR, matching the "from X €/night" figure shown for this
   * cabin elsewhere on the site (homepage/cabins list). The cabin detail page
   * itself has no static visible price (pricing there is fully client-side,
   * date-dependent), so this figure is not literally rendered as text on
   * that page - see the JSON-LD plan's price-parity caveat.
   */
  nightlyRate?: number | null;
}

export function buildProductOfferSchema(cabin: CabinProductInput, locale: string) {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/${locale}/cabins/${cabin.slug}`;
  const images = cabin.images && cabin.images.length > 0
    ? cabin.images
    : cabin.featuredImage
      ? [cabin.featuredImage]
      : [];

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: cabin.name,
    url,
    inLanguage: locale,
    ...(cabin.description && { description: cabin.description }),
    ...(images.length > 0 && { image: images }),
    brand: { '@id': organizationId() },
    ...(cabin.nightlyRate != null && {
      offers: {
        '@type': 'Offer',
        url,
        priceCurrency: 'EUR',
        price: Math.round(cabin.nightlyRate),
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: Math.round(cabin.nightlyRate),
          priceCurrency: 'EUR',
          unitCode: 'DAY',
        },
        availability: 'https://schema.org/InStock',
      },
    }),
  };
}

export interface BlogPostingInput {
  slug: string;
  title: string;
  excerpt?: string;
  featuredImage?: string;
  publishedAt?: string;
}

export function buildBlogPostingSchema(post: BlogPostingInput, locale: string) {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/${locale}/blog/${post.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    mainEntityOfPage: url,
    url,
    headline: post.title,
    inLanguage: locale,
    ...(post.excerpt && { description: post.excerpt }),
    ...(post.featuredImage && { image: [post.featuredImage] }),
    ...(post.publishedAt && { datePublished: post.publishedAt }),
    // No public byline is exposed by the blog API/UI (posts are unsigned),
    // so the organization itself is the author - this matches what's
    // actually visible on the page (no per-post author name is shown).
    author: { '@id': organizationId() },
    publisher: { '@id': organizationId() },
  };
}
