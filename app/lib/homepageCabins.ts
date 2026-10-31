/**
 * Cabins for the homepage-style cabins carousel (GET /cabins/homepage),
 * fetched server-side. Shared by the home page and the gift voucher page.
 */

// Transform relative upload paths to full URLs - mirrors the same helper in
// app/api/cabins/homepage/route.ts (the client-side proxy this page used to
// go through before cabin data moved to a server-side fetch).
const transformImageUrl = (url: string | null | undefined, mediaBaseUrl: string): string | null => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  if (url.startsWith('/uploads')) return `${mediaBaseUrl}${url}`;
  return url;
};

export async function getHomepageCabins(locale: string): Promise<Record<string, unknown>[]> {
  const apiKey = process.env.API_KEY;
  const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';
  const mediaBaseUrl = apiBaseUrl.replace('/api/v1', '');

  try {
    const response = await fetch(`${apiBaseUrl}/cabins/homepage`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey || '',
        'Accept-Language': locale || 'en',
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error('Failed to fetch homepage cabins:', response.status);
      return [];
    }

    const result = await response.json();
    const cabins = result?.data ?? result ?? [];

    return cabins.map((cabin: { featuredImage?: string; images?: (string | { url: string; thumbnailUrl?: string })[] }) => ({
      ...cabin,
      featuredImage: transformImageUrl(cabin.featuredImage, mediaBaseUrl),
      images: (cabin.images || []).map((img) =>
        typeof img === 'string'
          ? transformImageUrl(img, mediaBaseUrl)
          : { ...img, url: transformImageUrl(img.url, mediaBaseUrl), thumbnailUrl: transformImageUrl(img.thumbnailUrl, mediaBaseUrl) }
      ),
    }));
  } catch (error) {
    console.error('Error fetching homepage cabins:', error);
    return [];
  }
}
