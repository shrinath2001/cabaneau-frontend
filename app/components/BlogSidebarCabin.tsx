'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import CabinCard from './CabinCard';
import { apiFetch } from '@/app/lib/api';
import { useTranslations } from '@/app/providers/TranslationsProvider';
import Link from 'next/link';
import { localizedPath, type Locale } from '@/app/lib/i18n';

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

// Hardcoded translations for cabin section
const sectionTranslations: Record<string, {
  title: string;
  persons: string;
  available: string;
  availableNow: string;
  perNight: string;
  button: string;
  loading: string;
}> = {
  en: { title: 'OUR CABINS', persons: 'Persons', available: 'Available', availableNow: 'Available now', perNight: '/night', button: 'DISCOVER ALL CABINS', loading: 'Loading cabins...' },
  fr: { title: 'NOS CABANES', persons: 'Personnes', available: 'Disponible', availableNow: 'Disponible maintenant', perNight: '/nuit', button: 'DÉCOUVRIR TOUTES LES CABANES', loading: 'Chargement...' },
  de: { title: 'UNSERE HÜTTEN', persons: 'Personen', available: 'Verfügbar', availableNow: 'Jetzt verfügbar', perNight: '/Nacht', button: 'ALLE HÜTTEN ENTDECKEN', loading: 'Laden...' },
  nl: { title: 'ONZE HUTTEN', persons: 'Personen', available: 'Beschikbaar', availableNow: 'Nu beschikbaar', perNight: '/nacht', button: 'ONTDEK ALLE HUTTEN', loading: 'Laden...' },
};

const BlogSidebarCabin = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [cabins, setCabins] = useState<CabinData[]>([]);
  const [loading, setLoading] = useState(true);
  const { locale } = useTranslations();

  // Get hardcoded translations for current locale
  const t = sectionTranslations[locale] || sectionTranslations.en;

  // Format nightly rate as "225 €/night"
  const formatNightlyRate = useCallback((rate?: number, currency = 'EUR'): string => {
    if (!rate) return '';
    const symbol = currency === 'EUR' ? '€' : currency;
    return `${Math.round(rate)} ${symbol}${t.perNight}`;
  }, [t.perNight]);

  // Format date string with locale support
  const formatAvailabilityDate = useCallback((dateStr?: string): string => {
    if (!dateStr) return t.available;

    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date <= today) {
      return t.availableNow;
    }

    const dateLocale = localeMap[locale] || 'en-US';
    return date.toLocaleDateString(dateLocale, { month: 'short', day: 'numeric' });
  }, [locale, t.available, t.availableNow]);

  // Format capacity with translation
  const formatCapacity = useCallback((capacity?: number | string): string => {
    if (!capacity) return `2 ${t.persons}`;
    const maxCapacity = typeof capacity === 'string' ? parseInt(capacity) : capacity;
    return `2-${maxCapacity} ${t.persons}`;
  }, [t.persons]);

  useEffect(() => {
    const fetchCabins = async () => {
      try {
        const response = await apiFetch('/api/cabins/homepage');
        const result = await response.json();
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
            availability: formatAvailabilityDate(cabin.nextAvailableDate) || cabin.availability || t.available,
            price: cabin.nightlyRate
                   ? formatNightlyRate(cabin.nightlyRate, cabin.currency)
                   : cabin.basePrice
                     ? `${Math.round(Number(cabin.basePrice))} €`
                     : cabin.price || '',
            featuredAmenities: cabin.featuredAmenities,
          }));
          setCabins(transformedCabins);
        }
      } catch (error) {
        console.error('Error fetching cabins:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCabins();
  }, [formatAvailabilityDate, formatCapacity, formatNightlyRate, t.available]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const cabinsLink = localizedPath(locale as Locale, '/cabins');

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
      <div className="bg-white">
        {/* Header with Title and Navigation */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-logga text-[24px] font-semibold">
            {t.title}
          </h2>

          {/* Navigation Arrows */}
          {cabins.length > 1 && (
            <div className="flex gap-1.5">
              <button
                onClick={scrollLeft}
                className="w-8 h-8 rounded-full border-2 border-[#F0E8C6] bg-white flex items-center justify-center hover:bg-[#F0E8C6] transition-all duration-300 text-[#F0E8C6] hover:text-white"
                aria-label="Scroll to previous cabin"
              >
                <svg className="w-3 h-2.5" fill="currentColor" viewBox="0 0 20 16">
                  <path d="M20 7H6L11 2L9.5 0.5L0.5 8L9.5 15.5L11 14L6 9H20V7Z" />
                </svg>
              </button>
              <button
                onClick={scrollRight}
                className="w-8 h-8 rounded-full border-2 border-[#495D4D] bg-white flex items-center justify-center hover:bg-[#495D4D] transition-all duration-300 text-[#495D4D] hover:text-white"
                aria-label="Scroll to next cabin"
              >
                <svg className="w-3 h-2.5" fill="currentColor" viewBox="0 0 20 16">
                  <path d="M0 7H14L9 2L10.5 0.5L19.5 8L10.5 15.5L9 14L14 9H0V7Z" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Cabins Carousel */}
        <div className="w-full">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">{t.loading}</p>
            </div>
          ) : (
            <div className="relative">
              <div
                ref={scrollContainerRef}
                className="flex gap-[19.42px] overflow-x-auto no-scrollbar py-4"
                style={{ scrollSnapType: 'x mandatory' }}
              >
                {cabins.map((cabin, index) => (
                  <div key={cabin.id} className="flex-shrink-0" style={{ scrollSnapAlign: index === 0 ? 'start' : 'center' }}>
                    <CabinCard {...cabin} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Discover All Button */}
        <div className="text-center mt-6">
          <Link
            href={cabinsLink}
            className="inline-block px-8 py-3 bg-[#495D4D] text-white text-base font-heading font-medium tracking-widest hover:bg-[#2d4a2d] transition-colors"
          >
            {t.button}
          </Link>
        </div>
      </div>
    </>
  );
};

export default BlogSidebarCabin;
