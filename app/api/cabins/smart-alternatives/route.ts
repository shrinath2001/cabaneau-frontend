import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3002/api/v1';
const API_KEY = process.env.API_KEY || '';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const guests = searchParams.get('guests');
    const pets = searchParams.get('pets');

    if (!checkIn || !checkOut) {
      return NextResponse.json({ searchContext: null, alternatives: [] });
    }

    const params = new URLSearchParams();
    params.set('checkIn', checkIn);
    params.set('checkOut', checkOut);
    if (guests) params.set('guests', guests);
    if (pets) params.set('pets', pets);

    const response = await fetch(
      `${API_BASE_URL}/cabins/smart-alternatives?${params.toString()}`,
      {
        headers: {
          'x-api-key': API_KEY,
        },
        next: { revalidate: 0 }, // No cache — availability is real-time
      },
    );

    if (!response.ok) {
      console.error('Smart alternatives API error:', response.status);
      return NextResponse.json({ searchContext: null, alternatives: [] });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching smart alternatives:', error);
    return NextResponse.json({ searchContext: null, alternatives: [] });
  }
}
