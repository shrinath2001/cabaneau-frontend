import type { Metadata } from 'next';
import { headers } from 'next/headers';
import CabinCard from "@/app/components/CabinCard";

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

async function getCabins() {
  const apiKey = process.env.API_KEY;
  const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';

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
    return result?.data ?? result ?? [];
  } catch (error) {
    console.error('Error fetching cabins:', error);
    return [];
  }
}

export default async function CabinsPage() {
  const cabinsData = await getCabins();

  const cabins = cabinsData.map((cabin: CabinFromAPI, index: number) => ({
    id: cabin.id || index + 1,
    slug: cabin.slug || `cabin-${index + 1}`,
    images: cabin.images?.length > 0 ? cabin.images :
            cabin.featuredImage ? [cabin.featuredImage] :
            ['/assets/d206536ef067f64b29cad184324fe360bb763e30.jpg'],
    title: typeof cabin.name === 'object'
           ? ((cabin.name as any).en || (cabin.name as any).fr || (cabin.name as any).de || '')
           : cabin.name || `Cabin ${index + 1}`,
    rating: 5,
    area: cabin.squareMeters ? `${cabin.squareMeters}m²` : '',
    capacity: cabin.capacity ? `2-${cabin.capacity} Persons` : '2 Persons',
    availability: formatAvailabilityDate(cabin.nextAvailableDate),
    price: cabin.nightlyRate
           ? formatNightlyRate(cabin.nightlyRate, cabin.currency)
           : cabin.basePrice
             ? `€${Number(cabin.basePrice).toFixed(2)}/night`
             : '',
  }));

  return (
    <main>
      <div className="container mx-auto px-4 py-16">
        <h1 className="font-logga text-[32px] md:text-[48px] font-semibold text-center mb-12">
          OUR CABINS
        </h1>

        {cabins.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No cabins available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cabins.map((cabin: any) => (
              <CabinCard key={cabin.id} {...cabin} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
