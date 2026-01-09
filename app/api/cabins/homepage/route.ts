import { NextResponse } from 'next/server';
import { cabins as staticCabins } from '@/app/data/cabins';

export async function GET(request: Request) {
  try {
    const apiKey = process.env.API_KEY;
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';

    // Get Accept-Language from incoming request or default to 'en'
    const acceptLanguage = request.headers.get('accept-language') || 'en';

    const response = await fetch(`${apiBaseUrl}/cabins/homepage`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey || '',
        'Accept-Language': acceptLanguage,
      },
      // Longer timeout for aggregated endpoint - cold cache takes ~20s
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      console.log('⚠️ Homepage API responded with error, using static fallback');
      return NextResponse.json({ data: staticCabins, cachedAt: new Date() });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying homepage cabins request:', error);
    // Return static data as fallback
    return NextResponse.json({ data: staticCabins, cachedAt: new Date() });
  }
}
