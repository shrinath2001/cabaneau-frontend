/**
 * Language utility for client-side language management.
 * Syncs language preference between localStorage and cookies.
 *
 * - localStorage: Used by client components
 * - cookie: Used by server-side API routes to forward Accept-Language header
 */

const STORAGE_KEY = 'cabaneau_language';
const COOKIE_NAME = 'cabaneau_lang';
const DEFAULT_LANGUAGE = 'en';

/**
 * Get the current language code.
 * Returns from localStorage on client, or default on server.
 */
export function getLanguage(): string {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE;
  }
  return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANGUAGE;
}

/**
 * Set the language preference.
 * Syncs to both localStorage (client) and cookie (for server routes).
 */
export function setLanguage(code: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  // Store in localStorage for client-side access
  localStorage.setItem(STORAGE_KEY, code);

  // Sync to cookie for server-side API routes
  // Max-age: 1 year, SameSite: Lax for security
  document.cookie = `${COOKIE_NAME}=${code}; path=/; max-age=31536000; SameSite=Lax`;
}

/**
 * Get language from cookie (for server-side use).
 * Pass the cookie string from request headers.
 */
export function getLanguageFromCookie(cookieString: string | null): string {
  if (!cookieString) {
    return DEFAULT_LANGUAGE;
  }

  const cookies = cookieString.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    if (key && value) {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, string>);

  return cookies[COOKIE_NAME] || DEFAULT_LANGUAGE;
}

/**
 * Convert language code to Lodgify-compatible locale code.
 * Lodgify widgets need proper locale codes for calendar formatting.
 *
 * @example
 * getLodgifyLocale('en') // 'en-GB'
 * getLodgifyLocale('fr') // 'fr'
 */
export function getLodgifyLocale(languageCode?: string): string {
  const code = languageCode || getLanguage();

  // Map language codes to Lodgify locale codes
  const localeMap: Record<string, string> = {
    en: 'en-GB',
    fr: 'fr',
    de: 'de',
    nl: 'nl',
  };

  return localeMap[code] || code;
}

export { STORAGE_KEY, COOKIE_NAME, DEFAULT_LANGUAGE };
