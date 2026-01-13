'use client';
import { useRef, useState, useEffect, useCallback } from 'react';
import CabinCard from './CabinCard';
import { cabins as staticCabins } from '@/app/data/cabins';
import { apiFetch } from '@/app/lib/api';
import { useTranslations } from '@/app/providers/TranslationsProvider';

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
  en: { persons: 'Persons', available: 'Available', availableNow: 'Available now', perNight: '/night' },
  fr: { persons: 'Personnes', available: 'Disponible', availableNow: 'Disponible maintenant', perNight: '/nuit' },
  de: { persons: 'Personen', available: 'Verfügbar', availableNow: 'Jetzt verfügbar', perNight: '/Nacht' },
  nl: { persons: 'Personen', available: 'Beschikbaar', availableNow: 'Nu beschikbaar', perNight: '/nacht' },
};

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
            images: cabin.images?.length > 0 ? cabin.images :
                    cabin.featuredImage ? [cabin.featuredImage] :
                    ['/assets/d206536ef067f64b29cad184324fe360bb763e30.jpg'],
            title: cabin.name || cabin.title || cabin.slug?.replace(/-/g, ' ').toUpperCase() || `Cabin ${index + 1}`,
            rating: cabin.rating ?? 5,
            area: cabin.squareMeters ? `${cabin.squareMeters}m²` : cabin.area || '',
            capacity: formatCapacity(cabin.capacity),
            // Use nextAvailableDate from Lodgify if present
            availability: formatAvailabilityDate(cabin.nextAvailableDate) || cabin.availability || st.available,
            // Use nightlyRate from Lodgify if present, fallback to basePrice
            price: cabin.nightlyRate
                   ? formatNightlyRate(cabin.nightlyRate, cabin.currency)
                   : cabin.basePrice
                     ? `${Math.round(Number(cabin.basePrice))} €`
                     : cabin.price || '',
            // Include featured amenities from API
            featuredAmenities: cabin.featuredAmenities,
          }));
          setCabins(transformedCabins);
        }
      } catch (error) {
        console.error('Error fetching cabins:', error);
        // Fallback to static data on error
        setCabins(staticCabins.map((cabin) => ({
          id: cabin.id,
          slug: `cabin-${cabin.id}`,
          images: cabin.images,
          title: cabin.title,
          rating: cabin.rating,
          area: cabin.area,
          capacity: cabin.capacity,
          availability: cabin.availability,
          price: cabin.price
        })));
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
          <div className="max-w-full mx-auto md:pl-20">
            {/* Header with Title and Navigation */}
            <div className="flex justify-center items-center mb-8 md:mb-16 relative px-4 md:px-0">
              <h2 className="font-logga text-[28px] md:text-[42px] font-semibold text-center">
                {t('cabins_section.title', 'OUR CABINES')}
              </h2>

              {/* Navigation Arrows - Show on mobile and desktop when more than 1 cabin */}
              {cabins.length > 1 && (
                <div className="absolute right-0 flex gap-1.5 md:gap-2 mr-4 md:mr-16">
                  <button
                    onClick={scrollLeft}
                    className="w-8 h-8 md:w-12 md:h-12 rounded-full border-2 border-[#F0E8C6] bg-white flex items-center justify-center hover:bg-[#F0E8C6] transition-all duration-300 text-[#F0E8C6] hover:text-white"
                    aria-label="Scroll to previous cabin"
                  >
                    <svg className="w-3 h-2.5 md:w-5 md:h-4" fill="currentColor" viewBox="0 0 20 16">
                      <path d="M20 7H6L11 2L9.5 0.5L0.5 8L9.5 15.5L11 14L6 9H20V7Z" />
                    </svg>
                  </button>
                  <button
                    onClick={scrollRight}
                    className="w-8 h-8 md:w-12 md:h-12 rounded-full border-2 border-[#495D4D] bg-white flex items-center justify-center hover:bg-[#495D4D] transition-all duration-300 text-[#495D4D] hover:text-white"
                    aria-label="Scroll to next cabin"
                  >
                    <svg className="w-3 h-2.5 md:w-5 md:h-4" fill="currentColor" viewBox="0 0 20 16">
                      <path d="M0 7H14L9 2L10.5 0.5L19.5 8L10.5 15.5L9 14L14 9H0V7Z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Cabins Carousel or Centered Grid */}
            <div className="w-full">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">{t('cabins_section.loading', 'Loading cabins...')}</p>
                </div>
              ) : cabins.length > 1 ? (
                // Carousel layout - shows 1 card on mobile (centered), 3.5 cards on desktop
                <div className="relative">
                  <div
                    ref={scrollContainerRef}
                    className="flex gap-[19.42px] overflow-x-auto no-scrollbar py-8 justify-start md:justify-start"
                    style={{ scrollSnapType: 'x mandatory' }}
                  >
                    {/* Minimal padding on mobile to show peek of next card, normal on desktop */}
                    <div className="flex-shrink-0 w-[10px] md:w-0"></div>
                    {cabins.map((cabin, index) => (
                      <div key={cabin.id} className="flex-shrink-0" style={{ scrollSnapAlign: index === 0 ? 'start' : 'center' }}>
                        <CabinCard {...cabin} />
                      </div>
                    ))}
                    {/* Add padding at the end */}
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
              <button className="px-8 py-3 bg-[#495D4D] text-white text-base md:text-lg font-heading font-medium tracking-widest hover:bg-[#2d4a2d] transition-colors">
                {t('cabins_section.button', 'DISCOVER ALL CABINS')}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CabinsSection;
