import { NextResponse } from 'next/server';
import { getLanguageFromRequest } from '@/app/lib/server-language';

export async function GET(request: Request) {
  try {
    const apiKey = process.env.API_KEY;
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';
    const language = getLanguageFromRequest(request);

    const response = await fetch(`${apiBaseUrl}/activity-categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey || '',
        'Accept-Language': language,
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      console.error('Activity categories API error:', response.status);
      return NextResponse.json([]);
    }

    return NextResponse.json(await response.json());
  } catch (error) {
    console.error('Error fetching activity categories:', error);
    return NextResponse.json([]);
  }
}
