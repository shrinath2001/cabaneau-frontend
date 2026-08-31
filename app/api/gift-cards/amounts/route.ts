import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.API_KEY;
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';

    const response = await fetch(`${apiBaseUrl}/gift-vouchers/amounts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey || '',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      console.error('Gift card amounts API error:', response.status);
      return NextResponse.json([], { status: 200 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching gift card amounts:', error);
    return NextResponse.json([], { status: 200 });
  }
}
