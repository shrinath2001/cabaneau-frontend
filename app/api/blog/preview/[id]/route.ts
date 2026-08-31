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
    const token = request.nextUrl.searchParams.get('token');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    if (!token) {
      return NextResponse.json({ error: 'Preview token is required' }, { status: 403 });
    }

    // Public endpoint, but gated by a short-lived per-post token minted by
    // the CMS "Preview" button - the shared API key alone is not enough,
    // since this can return unpublished content.
    const apiUrl = `${apiBaseUrl}/blog/preview/${id}?token=${encodeURIComponent(token)}`;
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey || '',
        'Accept-Language': language,
      },
    });

    if (!response.ok) {
      const message =
        response.status === 404
          ? 'Post not found'
          : response.status === 403
            ? 'Preview link is invalid or has expired'
            : 'API error';
      return NextResponse.json({ error: message }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching blog preview:', error);
    return NextResponse.json({ error: 'Failed to fetch preview' }, { status: 500 });
  }
}
