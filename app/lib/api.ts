/**
 * API fetch wrapper that automatically includes the user's language preference.
 * Use this instead of fetch() for all API calls that need localized content.
 */

import { getLanguage } from './language';

/**
 * Fetch wrapper that adds x-language header with the user's language preference.
 * The API routes will forward this as Accept-Language to the backend.
 */
export async function apiFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(options.headers);

  // Add language header if not already set
  if (!headers.has('x-language')) {
    headers.set('x-language', getLanguage());
  }

  return fetch(url, {
    ...options,
    headers,
  });
}

/**
 * JSON fetch helper that parses the response.
 * Throws on non-ok responses.
 */
export async function apiFetchJson<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await apiFetch(url, options);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
