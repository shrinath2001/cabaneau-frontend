import { NextRequest, NextResponse } from 'next/server';
import { getLanguageFromRequest } from '@/app/lib/server-language';

/**
 * Proxy for the booking calendar (availability + rate rules) used by the
 * custom date-range picker. Mirrors the quote proxy: injects the API key and
 * forwards the language. Returns per-day { date, available, minStay, maxStay,
 * pricePerDay } plus property-level rateSettings.
 */
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

    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      );
    }

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'startDate and endDate parameters are required' },
        { status: 400 }
      );
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
      return NextResponse.json(
        { error: 'Dates must be in YYYY-MM-DD format' },
        { status: 400 }
      );
    }

    const queryParams = new URLSearchParams({ startDate, endDate });
    const apiUrl = `${apiBaseUrl}/cabins/slug/${slug}/rates-calendar?${queryParams.toString()}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey || '',
        'Accept-Language': language,
      },
      // Booking rules change rarely within a session; cache briefly at the edge.
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Rates calendar API error:', errorText);

      if (response.status === 404) {
        return NextResponse.json({ error: 'Cabin not found' }, { status: 404 });
      }

      return NextResponse.json(
        { error: `API error: ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error fetching rates calendar:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rates calendar' },
      { status: 500 }
    );
  }
}
