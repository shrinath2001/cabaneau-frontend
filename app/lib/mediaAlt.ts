/**
 * Alt text from the CMS media library.
 * This file should NOT have 'use client' directive (server-side fetch).
 */

export type MediaAltMap = Record<string, string>;

/** Alt text for every library image in one language, keyed by /uploads/... path. */
export async function getMediaAltMap(locale: string): Promise<MediaAltMap> {
  const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';

  try {
    const res = await fetch(`${apiBaseUrl}/media/alt-map`, {
      headers: {
        'Accept-Language': locale,
        'x-api-key': process.env.API_KEY || '',
      },
      next: { revalidate: 300 }, // 5 min cache, like translations
    });
    if (!res.ok) return {};
    return res.json();
  } catch (error) {
    console.error('Error fetching media alt texts:', error);
    return {};
  }
}

/** The media library's alt text for an image URL, or the fallback when none is set. */
export function lookupAlt(map: MediaAltMap | null | undefined, src: string | undefined | null, fallback: string): string {
  if (!map || !src) return fallback;
  const match = /\/uploads\/.+$/.exec(src.split('?')[0]);
  return (match && map[match[0]]) || fallback;
}
