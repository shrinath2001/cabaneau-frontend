import { NextResponse } from 'next/server';

// Fallback languages if API is unavailable
const fallbackLanguages = [
  { code: 'en', name: 'English', isDefault: true },
  { code: 'fr', name: 'French', isDefault: false },
  { code: 'de', name: 'German', isDefault: false },
  { code: 'nl', name: 'Dutch', isDefault: false },
];

export async function GET() {
  try {
    const apiKey = process.env.API_KEY;
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';

    const response = await fetch(`${apiBaseUrl}/languages`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey || '',
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.log('Languages API error, using fallback');
      return NextResponse.json(fallbackLanguages);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching languages:', error);
    return NextResponse.json(fallbackLanguages);
  }
}
