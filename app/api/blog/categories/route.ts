import { NextResponse } from 'next/server';
import { getLanguageFromRequest } from '@/app/lib/server-language';

export async function GET(request: Request) {
  try {
    const apiKey = process.env.API_KEY;
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';
    const language = getLanguageFromRequest(request);

    const response = await fetch(`${apiBaseUrl}/blog/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey || '',
        'Accept-Language': language,
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.error('Blog categories API error:', response.status);
      return NextResponse.json([]);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return NextResponse.json([]);
  }
}
