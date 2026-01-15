import { NextResponse } from 'next/server';
import { cabins as staticCabins } from '@/app/data/cabins';
import { getLanguageFromRequest } from '@/app/lib/server-language';

export async function GET(request: Request) {
  try {
    const apiKey = process.env.API_KEY;
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';
    const language = getLanguageFromRequest(request);

    console.log('🔑 API Key exists:', !!apiKey);
    console.log('🔑 API Key length:', apiKey?.length || 0);
    console.log('🌐 Language:', language);
    console.log('📡 Making request to:', `${apiBaseUrl}/cabins`);

    const response = await fetch(`${apiBaseUrl}/cabins`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey || '',
        'Accept-Language': language,
      },
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    console.log('📥 Response status:', response.status);

    if (!response.ok) {
      console.log('⚠️ API responded with error, using static fallback');
      return NextResponse.json(staticCabins);
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
    console.error('Error proxying request:', error);
    console.log('📦 Using static cabin data as fallback');
    // Return static data instead of error
    return NextResponse.json(staticCabins);
  }
}
