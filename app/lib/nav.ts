/**
 * Server-side fetching for global nav data (language switcher, cabins
 * dropdown) shared by Header.tsx and Header2.tsx.
 * This file should NOT have 'use client' directive.
 */

export interface NavLanguage {
  code: string;
  name: string;
  isDefault: boolean;
}

export interface NavCabin {
  id: string;
  slug: string;
  name: string;
}

const FALLBACK_LANGUAGES: NavLanguage[] = [
  { code: 'en', name: 'English', isDefault: true },
  { code: 'fr', name: 'French', isDefault: false },
  { code: 'de', name: 'German', isDefault: false },
  { code: 'nl', name: 'Dutch', isDefault: false },
];

export async function getNavLanguages(): Promise<NavLanguage[]> {
  const apiKey = process.env.API_KEY || '';
  const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';

  try {
    const res = await fetch(`${apiBaseUrl}/languages`, {
      headers: { 'x-api-key': apiKey },
      next: { revalidate: 300 },
    });
    if (!res.ok) return FALLBACK_LANGUAGES;
    return await res.json();
  } catch (error) {
    console.error('Error fetching nav languages:', error);
    return FALLBACK_LANGUAGES;
  }
}

export async function getNavCabins(locale: string): Promise<NavCabin[]> {
  const apiKey = process.env.API_KEY || '';
  const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';

  try {
    const res = await fetch(`${apiBaseUrl}/cabins`, {
      headers: { 'x-api-key': apiKey, 'Accept-Language': locale || 'en' },
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data?.data ?? []);
  } catch (error) {
    console.error('Error fetching nav cabins:', error);
    return [];
  }
}
