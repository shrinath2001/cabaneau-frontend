import { NextResponse } from 'next/server';
import { getLanguageFromRequest } from '@/app/lib/server-language';

const transformImageUrl = (url: string | null | undefined, mediaBaseUrl: string): string | null => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  if (url.startsWith('/uploads')) return `${mediaBaseUrl}${url}`;
  return url;
};

export async function GET(request: Request) {
  try {
    const apiKey = process.env.API_KEY;
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';
    const mediaBaseUrl = apiBaseUrl.replace('/api/v1', '');
    const language = getLanguageFromRequest(request);

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '50';
    const cabinId = searchParams.get('cabinId');

    const qs = new URLSearchParams({ limit });
    if (cabinId) qs.set('cabinId', cabinId);

    const response = await fetch(`${apiBaseUrl}/reviews?${qs.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey || '',
        'Accept-Language': language,
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      console.error('Reviews API error:', response.status);
      return NextResponse.json({ data: [], total: 0 });
    }

    const data = await response.json();

    if (data?.data && Array.isArray(data.data)) {
      data.data = data.data.map((review: { reviewerAvatar?: string }) => ({
        ...review,
        reviewerAvatar: transformImageUrl(review.reviewerAvatar, mediaBaseUrl),
      }));
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ data: [], total: 0 });
  }
}
