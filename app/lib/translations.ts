/**
 * Server-side translation fetching
 * This file should NOT have 'use client' directive
 */

/**
 * Get translations for server-side rendering
 */
export async function getTranslations(
  locale: string
): Promise<Record<string, string>> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const namespaces = 'navigation,booking,common,search,cabin,errors,homepage,activities,services,footer,blog';

  try {
    const res = await fetch(
      `${apiUrl}/api/v1/translations/bundle?namespaces=${namespaces}`,
      {
        headers: {
          'Accept-Language': locale,
          'x-api-key': process.env.API_KEY || '',
        },
        next: { revalidate: 300 }, // 5 min cache
      }
    );

    if (!res.ok) {
      console.error('Failed to fetch translations:', res.status);
      return {};
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching translations:', error);
    return {};
  }
}
