'use client';
import { useRef, useState, useEffect, useCallback } from 'react';
import CabinCard from './CabinCard';
import { apiFetch } from '@/app/lib/api';
import { useTranslations } from '@/app/providers/TranslationsProvider';
import Link from 'next/link';

interface AmenityInfo {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  category: string;
}

interface CabinData {
  id: number;
  slug: string;
  images: string[];
  title: string;
  rating: number;
  area: string;
  capacity: string;
  availability: string;
  price: string;
  nights?: number;
  featuredAmenities?: AmenityInfo[];
}

// Locale map for date formatting
const localeMap: Record<string, string> = {
  en: 'en-US',
  fr: 'fr-FR',
  de: 'de-DE',
  nl: 'nl-NL',
};

// Hardcoded translations for cabin section (fallback when CMS translations not available)
const sectionTranslations: Record<string, {
  persons: string;
  available: string;
  availableNow: string;
  perNight: string;
}> = {
  en: { persons: 'Persons', available: 'Available', availableNow: 'Today', perNight: '/night' },
  fr: { persons: 'Personnes', available: 'Disponible', availableNow: 'Aujourd\'hui', perNight: '/nuit' },
  de: { persons: 'Personen', available: 'Verfügbar', availableNow: 'Heute', perNight: '/Nacht' },
  nl: { persons: 'Personen', available: 'Beschikbaar', availableNow: 'Vandaag', perNight: '/nacht' },
};

/**
 * Extract image URLs from cabin, ensuring featured image is first
 */
function getCabinImageUrls(cabin: any): string[] {
  const imageUrls: string[] = [];

  // Add featured image first if it exists
  if (cabin.featuredImage) {
    imageUrls.push(cabin.featuredImage);
  }

  // Add other images, extracting URL from objects if needed
  if (cabin.images && cabin.images.length > 0) {
    for (const img of cabin.images) {
      const url = typeof img === 'string' ? img : img?.url;
      // Don't duplicate featured image
      if (url && !imageUrls.includes(url)) {
        imageUrls.push(url);
      }
    }
  }

  // Fallback to placeholder if no images
  if (imageUrls.length === 0) {
    imageUrls.push('/assets/placeholder.jpg');
  }

  return imageUrls;
}

const CabinsSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [cabins, setCabins] = useState<CabinData[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, locale } = useTranslations('homepage');

  // Get hardcoded translations for current locale
  const st = sectionTranslations[locale] || sectionTranslations.en;

  // Format nightly rate as "225 €/night" (Euro symbol after amount)
  const formatNightlyRate = useCallback((rate?: number, currency = 'EUR'): string => {
    if (!rate) return '';
    const symbol = currency === 'EUR' ? '€' : currency;
    return `${Math.round(rate)} ${symbol}${st.perNight}`;
  }, [st.perNight]);

  // Format date string with locale support
  const formatAvailabilityDate = useCallback((dateStr?: string): string => {
    if (!dateStr) return st.available;

    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // If the date is today or in the past, show "Available now"
    if (date <= today) {
      return st.availableNow;
    }

    // Format as "Jan 15" in the user's locale
    const dateLocale = localeMap[locale] || 'en-US';
    return date.toLocaleDateString(dateLocale, { month: 'short', day: 'numeric' });
  }, [locale, st.available, st.availableNow]);

  // Format capacity with translation
  const formatCapacity = useCallback((capacity?: number | string): string => {
    if (!capacity) return `2 ${st.persons}`;
    const maxCapacity = typeof capacity === 'string' ? parseInt(capacity) : capacity;
    return `2-${maxCapacity} ${st.persons}`;
  }, [st.persons]);

  useEffect(() => {
    const fetchCabins = async () => {
      try {
        // Use the new homepage endpoint with availability and pricing
        const response = await apiFetch('/api/cabins/homepage');
        const result = await response.json();

        // Handle both API response format and static fallback format
        const cabinArray = result?.data ?? result;

        if (Array.isArray(cabinArray)) {
          const transformedCabins: CabinData[] = cabinArray.map((cabin: any, index: number) => ({
            id: cabin.lodgifyId ? parseInt(cabin.lodgifyId) : index + 1,
            slug: cabin.slug || `cabin-${index + 1}`,
            images: getCabinImageUrls(cabin),
            title: cabin.name || cabin.title || cabin.slug?.replace(/-/g, ' ').toUpperCase() || `Cabin ${index + 1}`,
            rating: cabin.rating ?? 5,
            area: cabin.squareMeters ? `${cabin.squareMeters}m²` : cabin.area || '',
            capacity: formatCapacity(cabin.capacity),
            // Use nextAvailableDate from Lodgify if present
            availability: formatAvailabilityDate(cabin.nextAvailableDate) || cabin.availability || st.available,
            // Use nightlyRate from Lodgify if present, fallback to basePrice
            // Note: CabinCard handles "from X €/night" formatting with priceType="perNight" (default)
            price: cabin.nightlyRate
                   ? `${Math.round(cabin.nightlyRate)} €`
                   : cabin.basePrice
                     ? `${Math.round(Number(cabin.basePrice))} €`
                     : cabin.price || '',
            // Include featured amenities from API
            featuredAmenities: cabin.featuredAmenities,
            // Default to 2 nights for homepage display (minimum stay)
            nights: cabin.nights || 2,
          }));
          setCabins(transformedCabins);
        }
      } catch (error) {
        console.error('Error fetching cabins:', error);
        setCabins([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCabins();
  }, [formatAvailabilityDate, formatCapacity, formatNightlyRate, st.available]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400; // Card width (380px) + gap (20px)
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400; // Card width (380px) + gap (20px)
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <section className="bg-white py-6 md:py-5 md:mt-12 px-0">
        <div className="w-full">
          <div className="max-w-full mx-auto">
            {/* Header with Title */}
            <div className="flex justify-center items-center pt-6 md:pt-10 mb-10 md:mb-10 px-4 md:px-0">
              <h2 className="font-logga text-[28px] md:text-[42px] font-semibold md:font-normal text-center">
                {t('cabins_section.title', 'OUR CABINES')}
              </h2>
            </div>

            {/* Cabins Carousel or Centered Grid */}
            <div className="w-full">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">{t('cabins_section.loading', 'Loading cabins...')}</p>
                </div>
              ) : cabins.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">{t('cabins_section.empty', 'No cabins available at the moment. Please check back later.')}</p>
                </div>
              ) : cabins.length > 1 ? (
                // Carousel layout - centered, scrollable
                <div className="relative">
                  <div
                    ref={scrollContainerRef}
                    className="flex gap-[19.42px] overflow-x-auto no-scrollbar py-8 justify-center"
                    style={{ scrollSnapType: 'x mandatory' }}
                  >
                    <div className="flex-shrink-0 w-[10px] md:w-0"></div>
                    {cabins.map((cabin, index) => (
                      <div key={cabin.id} className="flex-shrink-0" style={{ scrollSnapAlign: 'center' }}>
                        <CabinCard {...cabin} />
                      </div>
                    ))}
                    <div className="flex-shrink-0 w-[10px] md:w-0"></div>
                  </div>
                </div>
              ) : (
                // Single cabin - centered
                <div className="flex justify-center py-8">
                  {cabins.map((cabin) => (
                    <div key={cabin.id}>
                      <CabinCard {...cabin} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Discover All Button */}
            <div className="text-center mt-6 md:mt-10 mb-6 md:mb-8 px-4 md:px-0">
              <Link href={`/${locale}/cabins`} className="px-8 py-3 bg-[#495D4D] text-white text-base md:text-lg font-heading font-medium tracking-widest hover:bg-[#2d4a2d] transition-colors">
                {t('cabins_section.button', 'DISCOVER ALL CABINS')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CabinsSection;
