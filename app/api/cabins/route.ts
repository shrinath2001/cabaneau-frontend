import { NextResponse } from 'next/server';
import { cabins as staticCabins } from '@/app/data/cabins';

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
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    console.log('📥 Response status:', response.status);

    if (!response.ok) {
      console.log('⚠️ API responded with error, using static fallback');
      return NextResponse.json(staticCabins);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying request:', error);
    console.log('📦 Using static cabin data as fallback');
    // Return static data instead of error
    return NextResponse.json(staticCabins);
  }
}
