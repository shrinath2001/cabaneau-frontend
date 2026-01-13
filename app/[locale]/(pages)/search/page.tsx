'use client';
import { useEffect, useState, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import CabinCard from '@/app/components/CabinCard';
import SearchPageWidget from '@/app/components/SearchPageWidget';
import { apiFetch } from '@/app/lib/api';
import { useTranslations } from '@/app/providers/TranslationsProvider';

// Locale map for date formatting
const localeMap: Record<string, string> = {
  en: 'en-US',
  fr: 'fr-FR',
  de: 'de-DE',
  nl: 'nl-NL',
};

// Hardcoded translations for search page (fallback when CMS translations not available)
const searchTranslations: Record<string, {
  title: string;
  subtitle: string;
  found: string;
  cabin: string;
  cabins: string;
  available: string;
  noResults: string;
  noResultsSubtitle: string;
  persons: string;
  perNight: string;
  adult: string;
  adults: string;
  child: string;
  children: string;
  infant: string;
  infants: string;
  pet: string;
  pets: string;
  guest: string;
  guests: string;
}> = {
  en: {
    title: 'Search Results',
    subtitle: 'Modify your search below to find available cabins',
    found: 'Found',
    cabin: 'cabin',
    cabins: 'cabins',
    available: 'available',
    noResults: 'No cabins found',
    noResultsSubtitle: 'Try adjusting your search dates or number of guests to see more results.',
    persons: 'Persons',
    perNight: '/night',
    adult: 'Adult',
    adults: 'Adults',
    child: 'Child',
    children: 'Children',
    infant: 'Infant',
    infants: 'Infants',
    pet: 'Pet',
    pets: 'Pets',
    guest: 'Guest',
    guests: 'Guests',
  },
  fr: {
    title: 'Résultats de recherche',
    subtitle: 'Modifiez votre recherche pour trouver des cabanes disponibles',
    found: 'Trouvé',
    cabin: 'cabane',
    cabins: 'cabanes',
    available: 'disponible(s)',
    noResults: 'Aucune cabane trouvée',
    noResultsSubtitle: 'Essayez d\'ajuster vos dates ou le nombre d\'invités.',
    persons: 'Personnes',
    perNight: '/nuit',
    adult: 'Adulte',
    adults: 'Adultes',
    child: 'Enfant',
    children: 'Enfants',
    infant: 'Bébé',
    infants: 'Bébés',
    pet: 'Animal',
    pets: 'Animaux',
    guest: 'Invité',
    guests: 'Invités',
  },
  de: {
    title: 'Suchergebnisse',
    subtitle: 'Passen Sie Ihre Suche an, um verfügbare Hütten zu finden',
    found: 'Gefunden',
    cabin: 'Hütte',
    cabins: 'Hütten',
    available: 'verfügbar',
    noResults: 'Keine Hütten gefunden',
    noResultsSubtitle: 'Versuchen Sie, Ihre Daten oder Gästeanzahl anzupassen.',
    persons: 'Personen',
    perNight: '/Nacht',
    adult: 'Erwachsener',
    adults: 'Erwachsene',
    child: 'Kind',
    children: 'Kinder',
    infant: 'Kleinkind',
    infants: 'Kleinkinder',
    pet: 'Haustier',
    pets: 'Haustiere',
    guest: 'Gast',
    guests: 'Gäste',
  },
  nl: {
    title: 'Zoekresultaten',
    subtitle: 'Pas uw zoekopdracht aan om beschikbare hutten te vinden',
    found: 'Gevonden',
    cabin: 'hut',
    cabins: 'hutten',
    available: 'beschikbaar',
    noResults: 'Geen hutten gevonden',
    noResultsSubtitle: 'Probeer uw data of aantal gasten aan te passen.',
    persons: 'Personen',
    perNight: '/nacht',
    adult: 'Volwassene',
    adults: 'Volwassenen',
    child: 'Kind',
    children: 'Kinderen',
    infant: 'Baby',
    infants: 'Baby\'s',
    pet: 'Huisdier',
    pets: 'Huisdieren',
    guest: 'Gast',
    guests: 'Gasten',
  },
};

interface AmenityInfo {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  category: string;
}

interface SearchCabin {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  capacity: number;
  squareMeters?: number;
  bedrooms: number;
  bathrooms: number;
  basePrice: number;
  featuredImage: string;
  images: string[];
  lodgifyId?: string;
  petsAllowed?: boolean;
  adultsOnly?: boolean;
  featuredAmenities?: AmenityInfo[];
}

interface SearchResponse {
  cabins: SearchCabin[];
  searchParams: Record<string, unknown>;
  total: number;
}

interface QuoteResponse {
  available: boolean;
  pricingAvailable: boolean;
  pricing?: {
    currency: string;
    nightlyRate: number;
    nights: number;
    subtotal: number;
    total: number;
    fees: Array<{ type: string; name: string; amount: number }>;
    discount?: { name: string; amount: number; percentage?: number };
  };
  minPrice?: number;
  currency?: string;
  checkoutUrl: string;
}

interface CabinWithQuote extends SearchCabin {
  quote?: QuoteResponse;
  quoteLoading?: boolean;
  quoteError?: string;
}

/**
 * Guest breakdown from Lodgify widget
 */
interface GuestBreakdown {
  adults: number;
  children: number;
  infants: number;
  pets: number;
  total: number;
}

/**
 * Convert Lodgify date format (YYYYMMDD) to ISO format (YYYY-MM-DD)
 * Lodgify sends: 20260106
 * We need: 2026-01-06
 */
function normalizeDateFormat(dateStr: string | null): string | null {
  if (!dateStr) return null;

  // Already in ISO format (YYYY-MM-DD)
  if (dateStr.includes('-')) return dateStr;

  // Lodgify format (YYYYMMDD) - convert to ISO
  if (dateStr.length === 8 && /^\d{8}$/.test(dateStr)) {
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    return `${year}-${month}-${day}`;
  }

  // Unknown format, return as-is
  return dateStr;
}

/**
 * Parse search parameters from either Lodgify format or legacy format
 *
 * Lodgify params: arrival, departure, adults, children, infants, pets
 * Legacy params: checkIn, checkOut, guests
 *
 * Note: Lodgify sends dates as YYYYMMDD (no dashes), we convert to YYYY-MM-DD
 */
function parseSearchParams(params: URLSearchParams): {
  checkIn: string | null;
  checkOut: string | null;
  guests: GuestBreakdown;
} {
  // Try Lodgify format first (arrival/departure), normalize date format
  const rawCheckIn = params.get('arrival') || params.get('checkIn');
  const rawCheckOut = params.get('departure') || params.get('checkOut');

  const checkIn = normalizeDateFormat(rawCheckIn);
  const checkOut = normalizeDateFormat(rawCheckOut);

  // Parse guest breakdown (Lodgify sends separate counts)
  const adults = parseInt(params.get('adults') || '0', 10) || 0;
  const children = parseInt(params.get('children') || '0', 10) || 0;
  const infants = parseInt(params.get('infants') || '0', 10) || 0;
  const pets = parseInt(params.get('pets') || '0', 10) || 0;

  // Legacy format: single "guests" param
  const legacyGuests = parseInt(params.get('guests') || '0', 10) || 0;

  // Calculate total guests (infants don't count toward capacity)
  const total = legacyGuests > 0 ? legacyGuests : adults + children;

  return {
    checkIn,
    checkOut,
    guests: {
      adults: legacyGuests > 0 ? legacyGuests : adults,
      children,
      infants,
      pets,
      total: total || 1, // Default to 1 guest minimum
    },
  };
}

function SearchResults() {
  const searchParams = useSearchParams();
  const [cabins, setCabins] = useState<CabinWithQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const { locale } = useTranslations('search');

  // Get hardcoded translations for current locale
  const st = searchTranslations[locale] || searchTranslations.en;

  // Parse both Lodgify and legacy parameter formats
  const { checkIn, checkOut, guests } = parseSearchParams(searchParams);

  // Format capacity with translation
  const formatCapacity = useCallback((capacity?: number | string): string => {
    if (!capacity) return `2 ${st.persons}`;
    const maxCapacity = typeof capacity === 'string' ? parseInt(capacity) : capacity;
    return `2-${maxCapacity} ${st.persons}`;
  }, [st.persons]);

  // Fetch quote for a single cabin
  const fetchQuote = async (cabin: SearchCabin): Promise<QuoteResponse | null> => {
    if (!checkIn || !checkOut) return null;

    try {
      const params = new URLSearchParams({
        checkIn,
        checkOut,
        adults: guests.adults.toString(),
        children: guests.children.toString(),
        infants: guests.infants.toString(),
        pets: guests.pets.toString(),
      });

      const response = await apiFetch(`/api/cabins/slug/${cabin.slug}/quote?${params.toString()}`);

      if (!response.ok) {
        console.warn(`Failed to fetch quote for ${cabin.slug}`);
        return null;
      }

      return await response.json();
    } catch (err) {
      console.warn(`Error fetching quote for ${cabin.slug}:`, err);
      return null;
    }
  };

  useEffect(() => {
    const fetchCabins = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query string using backend format
        const params = new URLSearchParams();
        if (checkIn) params.append('checkIn', checkIn);
        if (checkOut) params.append('checkOut', checkOut);
        if (guests.total > 0) params.append('guests', guests.total.toString());
        if (guests.pets > 0) params.append('pets', guests.pets.toString());

        const response = await apiFetch(`/api/cabins/search?${params.toString()}`);

        if (!response.ok) {
          throw new Error('Failed to search cabins');
        }

        const data: SearchResponse = await response.json();

        // Initialize cabins with loading state for quotes
        const cabinsWithQuoteLoading: CabinWithQuote[] = data.cabins.map((cabin) => ({
          ...cabin,
          quoteLoading: true,
        }));

        setCabins(cabinsWithQuoteLoading);
        setTotal(data.total);
        setLoading(false);

        // Fetch quotes for all cabins in parallel
        if (checkIn && checkOut && data.cabins.length > 0) {
          const quotePromises = data.cabins.map(async (cabin) => {
            const quote = await fetchQuote(cabin);
            return { slug: cabin.slug, quote };
          });

          const quotes = await Promise.all(quotePromises);

          // Update cabins with quotes
          setCabins((prevCabins) =>
            prevCabins.map((cabin) => {
              const quoteResult = quotes.find((q) => q.slug === cabin.slug);
              return {
                ...cabin,
                quote: quoteResult?.quote || undefined,
                quoteLoading: false,
              };
            })
          );
        } else {
          // No dates selected, clear quote loading state
          setCabins((prevCabins) =>
            prevCabins.map((cabin) => ({
              ...cabin,
              quoteLoading: false,
            }))
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching cabins:', err);
        setLoading(false);
      }
    };

    fetchCabins();
  }, [checkIn, checkOut, guests.total, guests.pets, guests.adults, guests.children, guests.infants]);

  // Format date for display with locale support
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const dateLocale = localeMap[locale] || 'en-US';
    return date.toLocaleDateString(dateLocale, { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Format short date (e.g., "Jan 10") with locale support
  const formatShortDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const dateLocale = localeMap[locale] || 'en-US';
    return date.toLocaleDateString(dateLocale, { month: 'short', day: 'numeric' });
  };

  /**
   * Format guest breakdown for display
   */
  const formatGuestBreakdown = () => {
    const parts: string[] = [];

    if (guests.adults > 0) {
      parts.push(`${guests.adults} ${guests.adults === 1 ? st.adult : st.adults}`);
    }
    if (guests.children > 0) {
      parts.push(`${guests.children} ${guests.children === 1 ? st.child : st.children}`);
    }
    if (guests.infants > 0) {
      parts.push(`${guests.infants} ${guests.infants === 1 ? st.infant : st.infants}`);
    }
    if (guests.pets > 0) {
      parts.push(`${guests.pets} ${guests.pets === 1 ? st.pet : st.pets}`);
    }

    return parts.length > 0 ? parts.join(', ') : `${guests.total} ${guests.total === 1 ? st.guest : st.guests}`;
  };

  return (
    <main>
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-4">{st.title}</h1>
          <p className="text-center text-gray-600 font-jost">
            {st.subtitle}
          </p>
        </div>

        {/* Search Widget */}
        <div className="flex justify-center mb-12">
          <SearchPageWidget />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-16">
            <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-md inline-block">
              <p className="font-medium">Error loading cabins</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && !error && (
          <>
            {cabins.length > 0 ? (
              <>
                <p className="text-center text-gray-600 mb-8 font-jost text-lg">
                  {st.found} {total} {total === 1 ? st.cabin : st.cabins} {st.available}
                </p>
                <div className="flex flex-wrap justify-center gap-8">
                  {cabins.map((cabin) => {
                    // Format price: prefer Lodgify quote, fallback to CMS basePrice
                    let displayPrice = '';
                    let originalPrice: string | undefined;
                    let nights: number | undefined;
                    let promotion: { name: string; amount: number } | undefined;

                    if (cabin.quote?.pricing) {
                      // Show total price from Lodgify quote (no decimals, Euro after amount)
                      const currency = cabin.quote.pricing.currency === 'EUR' ? '€' : cabin.quote.pricing.currency;
                      displayPrice = `${Math.round(cabin.quote.pricing.total)} ${currency}`;
                      nights = cabin.quote.pricing.nights;

                      // Show original price and promotion if discount applies
                      if (cabin.quote.pricing.discount) {
                        originalPrice = `${Math.round(cabin.quote.pricing.subtotal)} ${currency}`;
                        promotion = {
                          name: cabin.quote.pricing.discount.name,
                          amount: cabin.quote.pricing.discount.amount,
                        };
                      }
                    } else if (cabin.basePrice) {
                      // Fallback to CMS base price per night (no decimals, Euro after amount)
                      displayPrice = `${Math.round(Number(cabin.basePrice))} €${st.perNight}`;
                    }

                    // Format search dates for display (e.g., "Jan 10 - Jan 11")
                    const searchDates = checkIn && checkOut
                      ? `${formatShortDate(checkIn)} - ${formatShortDate(checkOut)}`
                      : st.available;

                    return (
                      <CabinCard
                        key={cabin.id}
                        slug={cabin.slug}
                        images={cabin.images.length > 0 ? cabin.images : [cabin.featuredImage]}
                        title={cabin.name}
                        rating={5} // Default rating since API doesn't provide it
                        area={cabin.squareMeters ? `${cabin.squareMeters}m²` : ''}
                        capacity={formatCapacity(cabin.capacity)}
                        availability={searchDates}
                        price={displayPrice}
                        originalPrice={originalPrice}
                        nights={nights}
                        promotion={promotion}
                        priceLoading={cabin.quoteLoading}
                        searchParams={{
                          arrival: searchParams.get('arrival') || undefined,
                          departure: searchParams.get('departure') || undefined,
                          adults: searchParams.get('adults') || undefined,
                          children: searchParams.get('children') || undefined,
                          infants: searchParams.get('infants') || undefined,
                          pets: searchParams.get('pets') || undefined,
                        }}
                        featuredAmenities={cabin.featuredAmenities}
                      />
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <div className="mb-4">
                  <svg
                    className="mx-auto h-24 w-24 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-medium text-gray-900 mb-2">{st.noResults}</h3>
                <p className="text-gray-600">
                  {st.noResultsSubtitle}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
