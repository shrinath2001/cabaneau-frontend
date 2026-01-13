import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale, isValidLocale, type Locale } from './app/lib/i18n';

/**
 * Middleware for locale-based URL routing
 *
 * Handles:
 * - Redirecting / to /en (or detected locale)
 * - Redirecting /cabins to /en/cabins (old URLs to new)
 * - Passing through valid locale URLs like /en/cabins
 */

// Paths that should NOT be processed by this middleware
const PUBLIC_FILE_REGEX = /\.(.*)$/;
const EXCLUDED_PATHS = [
  '/api',
  '/_next',
  '/favicon.ico',
  '/assets',
  '/images',
  '/sitemap.xml',
  '/robots.txt',
];

/**
 * Detect locale from Accept-Language header
 */
function getLocaleFromHeader(request: NextRequest): Locale {
  const acceptLanguage = request.headers.get('accept-language');
  if (!acceptLanguage) return defaultLocale;

  // Parse Accept-Language header (e.g., "fr-FR,fr;q=0.9,en;q=0.8")
  const languages = acceptLanguage.split(',').map((lang) => {
    const [code] = lang.trim().split(';');
    // Get base language code (e.g., "fr-FR" -> "fr")
    return code.split('-')[0].toLowerCase();
  });

  // Find first supported locale
  for (const lang of languages) {
    if (isValidLocale(lang)) {
      return lang;
    }
  }

  return defaultLocale;
}

/**
 * Get locale from cookie
 */
function getLocaleFromCookie(request: NextRequest): Locale | null {
  const cookie = request.cookies.get('cabaneau_lang');
  if (cookie?.value && isValidLocale(cookie.value)) {
    return cookie.value as Locale;
  }
  return null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip excluded paths
  if (
    PUBLIC_FILE_REGEX.test(pathname) ||
    EXCLUDED_PATHS.some((path) => pathname.startsWith(path))
  ) {
    return NextResponse.next();
  }

  // Get path segments
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];

  // Check if first segment is a valid locale
  if (firstSegment && isValidLocale(firstSegment)) {
    // Valid locale in URL - pass through
    const response = NextResponse.next();
    // Set cookie to match URL locale (for consistency)
    response.cookies.set('cabaneau_lang', firstSegment, {
      path: '/',
      maxAge: 31536000, // 1 year
      sameSite: 'lax',
    });
    return response;
  }

  // No locale in URL - need to redirect

  // Priority: 1. Cookie, 2. Accept-Language, 3. Default
  const detectedLocale =
    getLocaleFromCookie(request) ||
    getLocaleFromHeader(request) ||
    defaultLocale;

  // Build new URL with locale prefix
  const newUrl = request.nextUrl.clone();
  newUrl.pathname = `/${detectedLocale}${pathname === '/' ? '' : pathname}`;

  // Redirect to localized URL
  const response = NextResponse.redirect(newUrl);

  // Set/update cookie
  response.cookies.set('cabaneau_lang', detectedLocale, {
    path: '/',
    maxAge: 31536000, // 1 year
    sameSite: 'lax',
  });

  return response;
}

export const config = {
  // Match all paths except static files, api routes, etc.
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|assets|images|.*\\..*).*)',
  ],
};
