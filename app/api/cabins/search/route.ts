import { NextRequest, NextResponse } from 'next/server';

/**
 * Search cabins API route
 *
 * Accepts both:
 * - Backend format: checkIn, checkOut, guests
 * - Lodgify format: arrival, departure, adults, children (converted by search page)
 *
 * @see CLAUDE.md for Lodgify widget integration
 */
export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.API_KEY;
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';
    const { searchParams } = request.nextUrl;

    // Get query parameters (already converted to backend format by search page)
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const guests = searchParams.get('guests');
    const pets = searchParams.get('pets'); // Optional: filter pet-friendly cabins

    console.log('🔍 Search params:', { checkIn, checkOut, guests, pets });
    console.log('🔑 API Key exists:', !!apiKey);

    // Validate required parameters
    if (!checkIn || !checkOut || !guests) {
      return NextResponse.json(
        {
          error: 'Missing required parameters',
          details: {
            checkIn: checkIn ? 'provided' : 'missing',
            checkOut: checkOut ? 'provided' : 'missing',
            guests: guests ? 'provided' : 'missing'
          }
        },
        { status: 400 }
      );
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(checkIn) || !dateRegex.test(checkOut)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    // Validate guests is a valid number
    const guestsNum = parseInt(guests, 10);
    if (isNaN(guestsNum) || guestsNum < 1) {
      return NextResponse.json(
        { error: 'Guests must be a valid number greater than 0' },
        { status: 400 }
      );
    }

    // Build query string for backend API
    const backendParams = new URLSearchParams();
    backendParams.append('checkIn', checkIn);
    backendParams.append('checkOut', checkOut);
    backendParams.append('guests', guests);

    // Add pets filter if specified
    if (pets && parseInt(pets, 10) > 0) {
      backendParams.append('pets', pets);
    }

    const apiUrl = `${apiBaseUrl}/cabins/search?${backendParams.toString()}`;
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
      return NextResponse.json(
        { error: `API error: ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Search results:', data.total, 'cabins found');
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error searching cabins:', error);
    return NextResponse.json(
      { error: 'Failed to search cabins' },
      { status: 500 }
    );
  }
}
