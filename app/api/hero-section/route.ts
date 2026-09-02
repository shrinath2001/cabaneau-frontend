import { NextRequest, NextResponse } from 'next/server';
import { getLanguageFromRequest } from '@/app/lib/server-language';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3002/api/v1';
const API_KEY = process.env.API_KEY || '';

const DEFAULT_HERO = {
  backgroundType: 'image',
  backgroundUrl: '',
  overlayColor: '#000000',
  overlayOpacity: 50,
};

// Don't statically cache this route - hero settings can change via CMS
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const language = getLanguageFromRequest(request);
    const url = API_BASE_URL + '/site-settings/hero-section';
    const response = await fetch(url, {
      headers: {
        'x-api-key': API_KEY,
        'Accept-Language': language,
      },
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      return NextResponse.json(DEFAULT_HERO);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching hero section:', error);
    return NextResponse.json(DEFAULT_HERO);
  }
}
