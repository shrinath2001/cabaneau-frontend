/**
 * Server-side footer sections fetching.
 * This file should NOT have 'use client' directive.
 */

export interface FooterSection {
  id: string;
  sectionType: 'LOGO_DESCRIPTION' | 'LINK_COLUMN' | 'CTA_BUTTONS' | 'SOCIAL_LINKS' | 'CONTACT_INFO' | 'BOTTOM_BAR';
  title?: string;
  config: Record<string, unknown>;
  displayOrder: number;
}

export async function getFooterSections(locale: string): Promise<FooterSection[]> {
  const apiKey = process.env.API_KEY || '';
  const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';

  try {
    const res = await fetch(`${apiBaseUrl}/footer-sections`, {
      headers: {
        'x-api-key': apiKey,
        'Accept-Language': locale || 'en',
      },
      next: { revalidate: 30 },
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Error fetching footer sections:', error);
    return [];
  }
}
