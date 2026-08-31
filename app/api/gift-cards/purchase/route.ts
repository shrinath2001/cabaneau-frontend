import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.API_KEY;
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';
    const body = await request.json();

    const response = await fetch(`${apiBaseUrl}/gift-vouchers/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey || '',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    });

    const data = await response.json();

    // Pass the backend's status straight through - a 400 here is a real
    // validation failure (e.g. an amount that's no longer offered) the
    // caller needs to see, not something to paper over like a GET fallback.
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error starting gift card purchase:', error);
    return NextResponse.json(
      { message: 'Unable to start the purchase. Please try again.' },
      { status: 502 },
    );
  }
}
