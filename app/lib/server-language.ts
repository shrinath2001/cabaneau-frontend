/**
 * Server-side language utilities for API routes.
 * Extracts language preference from request headers.
 */

import { getLanguageFromCookie, DEFAULT_LANGUAGE } from './language';

/**
 * Get language from request headers.
 * Priority: x-language header > cookie > Accept-Language > default
 *
 * @param request - Next.js Request object
 * @returns Language code (e.g., 'en', 'fr', 'de', 'nl')
 */
export function getLanguageFromRequest(request: Request): string {
  // 1. Check x-language header (set by apiFetch)
  const xLanguage = request.headers.get('x-language');
  if (xLanguage) {
    return xLanguage;
  }

  // 2. Check cookie (set when user changes language)
  const cookieHeader = request.headers.get('cookie');
  const cookieLang = getLanguageFromCookie(cookieHeader);
  if (cookieLang !== DEFAULT_LANGUAGE) {
    return cookieLang;
  }

  // 3. Fall back to browser's Accept-Language
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    // Extract primary language code (e.g., "en-US,en" -> "en")
    const primaryLang = acceptLanguage.split(',')[0]?.split('-')[0];
    if (primaryLang && ['en', 'fr', 'de', 'nl'].includes(primaryLang)) {
      return primaryLang;
    }
  }

  // 4. Default to English
  return DEFAULT_LANGUAGE;
}
