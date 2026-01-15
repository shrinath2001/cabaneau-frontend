import type { Metadata } from 'next';
import { headers } from 'next/headers';
import CabinsPageContent from "@/app/components/CabinsPageContent";

export const metadata: Metadata = {
  title: 'Our Cabins - Cabaneau',
  description: 'Browse our collection of luxury cabins with private wellness facilities. Find your perfect retreat.',
};

interface CabinFromAPI {
  id: number;
  slug: string;
  name: string;
  featuredImage: string;
  images: string[];
  squareMeters?: number;
  capacity: number;
  basePrice?: string;
  nextAvailableDate?: string;
  nightlyRate?: number;
  currency?: string;
}

// Format date string (YYYY-MM-DD) to "Jan 15" format
const formatAvailabilityDate = (dateStr?: string): string => {
  if (!dateStr) return 'Available';

  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (date <= today) {
    return 'Available now';
  }

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Format nightly rate as "€225/night"
const formatNightlyRate = (rate?: number, currency = 'EUR'): string => {
  if (!rate) return '';
  const symbol = currency === 'EUR' ? '€' : currency;
  return `${symbol}${Math.round(rate)}/night`;
};

// Transform relative upload paths to full URLs
const transformImageUrl = (url: string | null | undefined, mediaBaseUrl: string): string | null => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  if (url.startsWith('/uploads')) return `${mediaBaseUrl}${url}`;
  return url;
};

async function getCabins() {
  const apiKey = process.env.API_KEY;
  const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';
  const mediaBaseUrl = apiBaseUrl.replace('/api/v1', '');

  // Get language from headers
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || 'en';
  const language = acceptLanguage.split(',')[0].split('-')[0];

  try {
    const response = await fetch(`${apiBaseUrl}/cabins/homepage`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey || '',
        'Accept-Language': language,
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      console.error('Failed to fetch cabins:', response.status);
      return [];
    }

    const result = await response.json();
    const cabins = result?.data ?? result ?? [];

    // Transform image URLs
    return cabins.map((cabin: CabinFromAPI) => ({
      ...cabin,
      featuredImage: transformImageUrl(cabin.featuredImage, mediaBaseUrl),
      images: cabin.images?.map((img: string | { url: string; thumbnailUrl?: string }) =>
        typeof img === 'string'
          ? transformImageUrl(img, mediaBaseUrl)
          : { ...img, url: transformImageUrl(img.url, mediaBaseUrl), thumbnailUrl: transformImageUrl(img.thumbnailUrl, mediaBaseUrl) }
      ),
    }));
  } catch (error) {
    console.error('Error fetching cabins:', error);
    return [];
  }
}

export default async function CabinsPage() {
  const cabinsData = await getCabins();

  const cabins = cabinsData.map((cabin: CabinFromAPI, index: number) => {
    // Filter out null/undefined images and get valid URLs
    const validImages = (cabin.images || [])
      .map((img: string | { url: string } | null) => typeof img === 'string' ? img : img?.url)
      .filter((url: string | null | undefined): url is string => !!url);

    // Use valid images, or featured image, or fallback
    const displayImages = validImages.length > 0
      ? validImages
      : cabin.featuredImage
        ? [cabin.featuredImage]
        : ['/assets/d206536ef067f64b29cad184324fe360bb763e30.jpg'];

    return {
    id: cabin.id || index + 1,
    slug: cabin.slug || `cabin-${index + 1}`,
    images: displayImages,
    title: cabin.name || `Cabin ${index + 1}`,
    rating: 5,
    area: cabin.squareMeters ? `${cabin.squareMeters}m²` : '',
    capacity: cabin.capacity ? `2-${cabin.capacity} Persons` : '2 Persons',
    availability: formatAvailabilityDate(cabin.nextAvailableDate),
    price: cabin.nightlyRate
           ? formatNightlyRate(cabin.nightlyRate, cabin.currency)
           : cabin.basePrice
             ? `€${Number(cabin.basePrice).toFixed(2)}/night`
             : '',
  };
  });

  return (
    <main>
      <CabinsPageContent cabins={cabins} />
    </main>
  );
}
