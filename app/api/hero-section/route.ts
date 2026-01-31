import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3002/api/v1';
const API_KEY = process.env.API_KEY || '';

const DEFAULT_HERO = {
  backgroundType: 'image',
  backgroundUrl: '',
  overlayColor: '#000000',
  overlayOpacity: 50,
};

export async function GET(request: NextRequest) {
  try {
    const url = API_BASE_URL + '/site-settings/hero-section';
    const response = await fetch(url, {
      headers: {
        'x-api-key': API_KEY,
      },
      next: { revalidate: 60 },
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
