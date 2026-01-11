import { NextResponse } from 'next/server';
import { activities as staticActivities } from '@/app/data/activities';
import { getLanguageFromRequest } from '@/app/lib/server-language';

export async function GET(request: Request) {
  try {
    const apiKey = process.env.API_KEY;
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';
    const language = getLanguageFromRequest(request);

    // Get query params for filtering
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let url = `${apiBaseUrl}/activities`;
    if (category) {
      url += `?category=${category}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey || '',
        'Accept-Language': language,
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.log('Activities API error, using static fallback');
      return NextResponse.json({ data: staticActivities });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json({ data: staticActivities });
  }
}
