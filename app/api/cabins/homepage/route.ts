import { NextResponse } from 'next/server';
import { getLanguageFromRequest } from '@/app/lib/server-language';

// Transform relative upload paths to full URLs
const transformImageUrl = (url: string | null | undefined, mediaBaseUrl: string): string | null => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  if (url.startsWith('/uploads')) return `${mediaBaseUrl}${url}`;
  return url;
};

// Extract URL from image (handles both string and object formats)
const extractImageUrl = (img: string | { url: string } | null, mediaBaseUrl: string): string | null => {
  if (!img) return null;
  if (typeof img === 'string') return transformImageUrl(img, mediaBaseUrl);
  return transformImageUrl(img.url, mediaBaseUrl);
};

export async function GET(request: Request) {
  try {
    const apiKey = process.env.API_KEY;
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';
    const mediaBaseUrl = apiBaseUrl.replace('/api/v1', '');
    const language = getLanguageFromRequest(request);

    const response = await fetch(`${apiBaseUrl}/cabins/homepage`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey || '',
        'Accept-Language': language,
      },
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      console.error('Homepage cabins API error:', response.status);
      return NextResponse.json({ data: [], cachedAt: new Date() });
    }

    const data = await response.json();

    // Transform image URLs in each cabin
    if (data?.data && Array.isArray(data.data)) {
      data.data = data.data.map((cabin: { featuredImage?: string; images?: (string | { url: string })[] }) => {
        const imageUrls = (cabin.images || [])
          .map(img => extractImageUrl(img, mediaBaseUrl))
          .filter((url): url is string => !!url);

        return {
          ...cabin,
          featuredImage: transformImageUrl(cabin.featuredImage, mediaBaseUrl),
          images: imageUrls,
        };
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching homepage cabins:', error);
    return NextResponse.json({ data: [], cachedAt: new Date() });
  }
}
