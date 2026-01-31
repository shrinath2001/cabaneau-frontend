import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3002/api/v1';
const API_KEY = process.env.API_KEY || '';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${API_BASE_URL}/site-settings/logo-slider`, {
      headers: {
        'x-api-key': API_KEY,
      },
      next: { revalidate: 60 }, // Cache for 1 minute
    });

    if (!response.ok) {
      return NextResponse.json({ logos: [], isActive: false });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching logo slider:', error);
    return NextResponse.json({ logos: [], isActive: false });
  }
}
