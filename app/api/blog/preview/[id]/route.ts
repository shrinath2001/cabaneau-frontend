import { NextRequest, NextResponse } from 'next/server';
import { getLanguageFromRequest } from '@/app/lib/server-language';

export const dynamic = 'force-dynamic';

function localize(field: unknown, lang: string): string {
  if (!field) return '';
  if (typeof field === 'string') return field;
  if (typeof field === 'object') {
    const obj = field as Record<string, string>;
    return obj[lang] || obj['en'] || '';
  }
  return '';
}

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

    const apiUrl = `${apiBaseUrl}/admin/blog/${id}`;
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey || '',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: response.status === 404 ? 'Post not found' : 'API error' },
        { status: response.status }
      );
    }

    const raw = await response.json();

    // Localize translated fields to match the public endpoint format
    const data = {
      ...raw,
      title: localize(raw.title, language),
      content: localize(raw.content, language),
      excerpt: localize(raw.excerpt, language),
      metaTitle: localize(raw.metaTitle, language),
      metaDescription: localize(raw.metaDescription, language),
      category: raw.category ? {
        ...raw.category,
        name: localize(raw.category.name, language),
      } : undefined,
      _preview: true,
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching blog preview:', error);
    return NextResponse.json({ error: 'Failed to fetch preview' }, { status: 500 });
  }
}
