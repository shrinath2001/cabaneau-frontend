import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';
const API_KEY = process.env.API_KEY || '';

export async function GET(request: NextRequest) {
  try {
    // Get language from header
    const language = request.headers.get('x-language') || 'en';

    const response = await fetch(`${API_BASE_URL}/promo-banner`, {
      headers: {
        'Accept-Language': language,
        'x-api-key': API_KEY,
      },
      next: { revalidate: 60 }, // Cache for 1 minute
    });

    if (!response.ok) {
      return NextResponse.json(null);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching promo banner:', error);
    return NextResponse.json(null);
  }
}
