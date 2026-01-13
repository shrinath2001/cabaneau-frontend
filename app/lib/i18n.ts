/**
 * Internationalization utilities for locale-based URL routing
 */

export const locales = ['en', 'fr', 'de', 'nl'] as const;
export const defaultLocale = 'en';
export type Locale = (typeof locales)[number];

/**
 * Type guard to check if a string is a valid locale
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

/**
 * Generate a localized path by prepending the locale
 * @param locale The locale code
 * @param path The path (with or without leading slash)
 * @returns Full path with locale prefix
 *
 * @example
 * localizedPath('en', '/cabins') // '/en/cabins'
 * localizedPath('fr', 'cabins') // '/fr/cabins'
 */
export function localizedPath(locale: Locale, path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `/${locale}${normalizedPath}`;
}

/**
 * Remove locale prefix from a path
 * @param path The full path including locale
 * @returns Path without locale prefix
 *
 * @example
 * removeLocaleFromPath('/en/cabins') // '/cabins'
 * removeLocaleFromPath('/de/cabins/treehouse-1') // '/cabins/treehouse-1'
 */
export function removeLocaleFromPath(path: string): string {
  const segments = path.split('/').filter(Boolean);
  if (segments.length > 0 && isValidLocale(segments[0])) {
    return '/' + segments.slice(1).join('/') || '/';
  }
  return path;
}

/**
 * Get locale from path
 * @param path The URL path
 * @returns The locale if found, otherwise undefined
 *
 * @example
 * getLocaleFromPath('/en/cabins') // 'en'
 * getLocaleFromPath('/cabins') // undefined
 */
export function getLocaleFromPath(path: string): Locale | undefined {
  const segments = path.split('/').filter(Boolean);
  if (segments.length > 0 && isValidLocale(segments[0])) {
    return segments[0] as Locale;
  }
  return undefined;
}

/**
 * Switch locale in current path
 * @param currentPath Full path including current locale
 * @param newLocale The new locale to switch to
 * @returns New path with updated locale
 *
 * @example
 * switchLocale('/en/cabins', 'fr') // '/fr/cabins'
 * switchLocale('/de/cabins/treehouse-1', 'nl') // '/nl/cabins/treehouse-1'
 */
export function switchLocale(currentPath: string, newLocale: Locale): string {
  const pathWithoutLocale = removeLocaleFromPath(currentPath);
  return localizedPath(newLocale, pathWithoutLocale);
}
