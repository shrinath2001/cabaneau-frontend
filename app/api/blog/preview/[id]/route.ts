import { NextRequest, NextResponse } from 'next/server';
import { getLanguageFromRequest } from '@/app/lib/server-language';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const apiKey = process.env.API_KEY;
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3002/api/v1';
    const language = getLanguageFromRequest(request);
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Use the public preview endpoint (no JWT needed, just API key)
    const apiUrl = `${apiBaseUrl}/blog/preview/${id}`;
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey || '',
        'Accept-Language': language,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: response.status === 404 ? 'Post not found' : 'API error' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching blog preview:', error);
    return NextResponse.json({ error: 'Failed to fetch preview' }, { status: 500 });
  }
}
