import { NextRequest, NextResponse } from 'next/server';
import { getLanguageFromRequest } from '@/app/lib/server-language';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const apiKey = process.env.API_KEY;
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';
    const language = getLanguageFromRequest(request);
    const { slug } = await params;
    const searchParams = request.nextUrl.searchParams;

    // Required params
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');

    // Optional params
    const adults = searchParams.get('adults') || '1';
    const children = searchParams.get('children') || '0';
    const infants = searchParams.get('infants') || '0';
    const pets = searchParams.get('pets') || '0';
    const couponCode = searchParams.get('couponCode');

    console.log('💰 Fetching quote for cabin:', slug);
    console.log('📅 Dates:', checkIn, 'to', checkOut);
    console.log('👥 Guests:', { adults, children, infants, pets });
    console.log('🌐 Language:', language);

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      );
    }

    if (!checkIn || !checkOut) {
      return NextResponse.json(
        { error: 'checkIn and checkOut parameters are required' },
        { status: 400 }
      );
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(checkIn) || !dateRegex.test(checkOut)) {
      return NextResponse.json(
        { error: 'Dates must be in YYYY-MM-DD format' },
        { status: 400 }
      );
    }

    // Build query string
    const queryParams = new URLSearchParams({
      checkIn,
      checkOut,
      adults,
      children,
      infants,
      pets,
      ...(couponCode && { couponCode }),
    });

    const apiUrl = `${apiBaseUrl}/cabins/slug/${slug}/quote?${queryParams.toString()}`;
    console.log('📡 Making request to:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey || '',
        'Accept-Language': language,
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
    console.log('✅ Quote fetched:', {
      available: data.available,
      total: data.pricing?.total,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error fetching quote:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quote' },
      { status: 500 }
    );
  }
}
