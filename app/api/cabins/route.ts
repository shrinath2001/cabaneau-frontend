import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.API_KEY;

    console.log('🔑 API Key exists:', !!apiKey);
    console.log('🔑 API Key length:', apiKey?.length || 0);
    console.log('📡 Making request to:', 'https://api.cabaneau-backend.amplyfitdigital.com/api/v1/cabins');

    const response = await fetch('https://api.cabaneau-backend.amplyfitdigital.com/api/v1/cabins', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey || '',
      },
    });

    console.log('📥 Response status:', response.status);

    if (!response.ok) {
      return NextResponse.json(
        { error: `API error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying request:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cabins' },
      { status: 500 }
    );
  }
}
