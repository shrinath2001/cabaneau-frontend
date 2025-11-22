import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const apiKey = process.env.API_KEY;
    const { slug } = await params;

    console.log('🔍 Fetching cabin with slug:', slug);
    console.log('🔑 API Key exists:', !!apiKey);

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      );
    }

    const apiUrl = `https://api.cabaneau-backend.amplyfitdigital.com/api/v1/cabins/slug/${slug}`;
    console.log('📡 Making request to:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey || '',
      },
    });

    console.log('📥 Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API error:', errorText);

      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Cabin not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { error: `API error: ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Cabin details fetched:', data.slug);
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error fetching cabin:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cabin details' },
      { status: 500 }
    );
  }
}
