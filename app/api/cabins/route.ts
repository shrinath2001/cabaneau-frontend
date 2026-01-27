import { NextResponse } from 'next/server';
import { getLanguageFromRequest } from '@/app/lib/server-language';

export async function GET(request: Request) {
  try {
    const apiKey = process.env.API_KEY;
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';
    const language = getLanguageFromRequest(request);

    const response = await fetch(`${apiBaseUrl}/cabins`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey || '',
        'Accept-Language': language,
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.error('Cabins API error:', response.status);
      return NextResponse.json({ data: [], total: 0 });
    }

    const data = await response.json();

    // Transform relative image URLs to full URLs
    const mediaBaseUrl = process.env.API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:3000';

    const transformUrl = (url: string | null | undefined): string | null => {
      if (!url) return null;
      if (url.startsWith('http')) return url;
      if (url.startsWith('/uploads')) return `${mediaBaseUrl}${url}`;
      return url;
    };

    // Transform image URLs in each cabin
    const transformedData = Array.isArray(data) ? data.map((cabin: { featuredImage?: string; images?: (string | { url: string; thumbnailUrl?: string })[] }) => ({
      ...cabin,
      featuredImage: transformUrl(cabin.featuredImage),
      images: cabin.images?.map((img) => {
        if (typeof img === 'string') return transformUrl(img);
        return { ...img, url: transformUrl(img.url), thumbnailUrl: transformUrl(img.thumbnailUrl) };
      }),
    })) : data;

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching cabins:', error);
    return NextResponse.json({ data: [], total: 0 });
  }
}
