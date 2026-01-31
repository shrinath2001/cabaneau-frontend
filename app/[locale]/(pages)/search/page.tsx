'use client';
import { useEffect, useState, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import CabinCard from '@/app/components/CabinCard';
import SearchPageWidget from '@/app/components/SearchPageWidget';
import { apiFetch } from '@/app/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { localizedPath, type Locale } from '@/app/lib/i18n';
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
  cabin: string;
  cabins: string;
  available: string;
  noResults: string;
  noResultsSubtitle: string;
  selectDates: string;
  selectDatesSubtitle: string;
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
  nextAvailable: string;
  nextAvailableSubtitle: string;
  availableFrom: string;
  availableNow: string;
  viewCabin: string;
  fromPrice: string;
  perNightShort: string;
  guest: string;
  guests: string;
}> = {
  en: {
    title: 'Search Results',
    subtitle: 'Modify your search below to find available cabins',
    cabin: 'cabin',
    cabins: 'cabins',
    available: 'available',
    noResults: 'No cabins found',
    noResultsSubtitle: 'Try adjusting your search dates or number of guests to see more results.',
    selectDates: 'Please select check-in and check-out dates',
    selectDatesSubtitle: 'Use the search widget above to select your travel dates and find available cabins.',
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
    nextAvailable: 'Next available cabins',
    nextAvailableSubtitle: 'These cabins have upcoming availability',
    availableFrom: 'Available from',
    availableNow: 'Available now',
    viewCabin: 'View',
    fromPrice: 'from',
    perNightShort: '/ night',
    guest: 'Guest',
    guests: 'Guests',
  },
  fr: {
    title: 'Résultats de recherche',
    subtitle: 'Modifiez votre recherche pour trouver des cabanes disponibles',
    cabin: 'cabane',
    cabins: 'cabanes',
    available: 'disponible(s)',
    noResults: 'Aucune cabane trouvée',
    noResultsSubtitle: 'Essayez d\'ajuster vos dates ou le nombre d\'invités.',
    selectDates: 'Veuillez sélectionner les dates d\'arrivée et de départ',
    selectDatesSubtitle: 'Utilisez le widget de recherche ci-dessus pour sélectionner vos dates de voyage.',
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
    nextAvailable: 'Prochaines cabanes disponibles',
    nextAvailableSubtitle: 'Ces cabanes ont une disponibilité prochaine',
    availableFrom: 'Disponible à partir du',
    availableNow: 'Disponible maintenant',
    viewCabin: 'Voir',
    fromPrice: 'à partir de',
    perNightShort: '/ nuit',
    guest: 'Invité',
    guests: 'Invités',
  },
  de: {
    title: 'Suchergebnisse',
    subtitle: 'Passen Sie Ihre Suche an, um verfügbare Hütten zu finden',
    cabin: 'Hütte',
    cabins: 'Hütten',
    available: 'verfügbar',
    noResults: 'Keine Hütten gefunden',
    noResultsSubtitle: 'Versuchen Sie, Ihre Daten oder Gästeanzahl anzupassen.',
    selectDates: 'Bitte wählen Sie An- und Abreisedatum',
    selectDatesSubtitle: 'Verwenden Sie das Suchwidget oben, um Ihre Reisedaten auszuwählen.',
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
    nextAvailable: 'Nächste verfügbare Hütten',
    nextAvailableSubtitle: 'Diese Hütten sind bald verfügbar',
    availableFrom: 'Verfügbar ab',
    availableNow: 'Jetzt verfügbar',
    viewCabin: 'Ansehen',
    fromPrice: 'ab',
    perNightShort: '/ Nacht',
    guest: 'Gast',
    guests: 'Gäste',
  },
  nl: {
    title: 'Zoekresultaten',
    subtitle: 'Pas uw zoekopdracht aan om beschikbare hutten te vinden',
    cabin: 'hut',
    cabins: 'hutten',
    available: 'beschikbaar',
    noResults: 'Geen hutten gevonden',
    noResultsSubtitle: 'Probeer uw data of aantal gasten aan te passen.',
    selectDates: 'Selecteer in- en uitcheckdatums',
    selectDatesSubtitle: 'Gebruik de zoekwidget hierboven om uw reisdata te selecteren.',
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
    nextAvailable: 'Volgende beschikbare hutten',
    nextAvailableSubtitle: 'Deze hutten zijn binnenkort beschikbaar',
    availableFrom: 'Beschikbaar vanaf',
    availableNow: 'Nu beschikbaar',
    viewCabin: 'Bekijk',
    fromPrice: 'vanaf',
    perNightShort: '/ nacht',
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

interface CabinImage {
  url: string;
  tag?: string;
  order?: number;
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
  images: (string | CabinImage)[];
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
 * Extract image URLs from cabin, ensuring featured image is first
 */
function getCabinImageUrls(cabin: SearchCabin): string[] {
  const imageUrls: string[] = [];

  // Add featured image first if it exists
  if (cabin.featuredImage) {
    imageUrls.push(cabin.featuredImage);
  }

  // Add other images, extracting URL from objects if needed
  if (cabin.images && cabin.images.length > 0) {
    for (const img of cabin.images) {
      const url = typeof img === 'string' ? img : img.url;
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
  // Next available cabins (shown when search returns 0 results)
  const [nextAvailableCabins, setNextAvailableCabins] = useState<any[]>([]);
  const [nextAvailableLoading, setNextAvailableLoading] = useState(false);

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
      // Skip API call if no dates provided - show "select dates" notice instead
      if (!checkIn || !checkOut) {
        setLoading(false);
        setError(null);
        setCabins([]);
        setTotal(0);
        return;
      }

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



  // Fetch next available cabins when search returns 0 results
  useEffect(() => {
    if (!loading && cabins.length === 0 && checkIn && checkOut) {
      setNextAvailableLoading(true);
      apiFetch('/api/cabins/homepage')
        .then((res) => res.json())
        .then((result) => {
          const cabinArray = result?.data ?? result;
          if (Array.isArray(cabinArray)) {
            setNextAvailableCabins(cabinArray);
          }
        })
        .catch((err) => console.error('Error fetching next available cabins:', err))
        .finally(() => setNextAvailableLoading(false));
    }
  }, [loading, cabins.length, checkIn, checkOut]);

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
          <h1 className="text-4xl font-logga text-center mb-4">{st.title}</h1>
          <p className="text-center text-gray-600 font-jost font-light">
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
            {/* No dates selected - show notice */}
            {!checkIn || !checkOut ? (
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-logga text-gray-900 mb-2">{st.selectDates}</h3>
                <p className="text-gray-600 font-jost font-light">
                  {st.selectDatesSubtitle}
                </p>
              </div>
            ) : cabins.length > 0 ? (
              <>
                <p className="text-center text-gray-600 mb-8 font-jost font-light text-lg">
                  {total} {total === 1 ? st.cabin : st.cabins} {st.available}
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
                        images={getCabinImageUrls(cabin)}
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
                        priceType="total"
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
              <div className="py-8">
                {/* No results message */}
                <div className="text-center mb-10">
                  <div className="mb-4">
                    <svg
                      className="mx-auto h-16 w-16 text-gray-300"
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
                  <h3 className="text-2xl font-logga text-gray-900 mb-2">{st.noResults}</h3>
                  <p className="text-gray-600 font-jost font-light">
                    {st.noResultsSubtitle}
                  </p>
                </div>

                {/* Next Available Cabins - Mini Cards */}
                {nextAvailableLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
                  </div>
                ) : nextAvailableCabins.length > 0 && (
                  <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-6">
                      <h4 className="text-xl font-logga text-gray-800">{st.nextAvailable}</h4>
                      <p className="text-sm text-gray-500 font-jost font-light mt-1">{st.nextAvailableSubtitle}</p>
                    </div>
                    <div className="flex flex-col gap-3">
                      {nextAvailableCabins.map((cabin: any) => {
                        const imgUrl = cabin.featuredImage || cabin.images?.[0]?.url || cabin.images?.[0] || '/assets/placeholder.jpg';
                        const nextDate = cabin.nextAvailableDate ? new Date(cabin.nextAvailableDate) : null;
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const isAvailableNow = nextDate && nextDate <= today;
                        const dateLocale = localeMap[locale] || 'en-US';
                        const formattedDate = nextDate
                          ? isAvailableNow
                            ? st.availableNow
                            : st.availableFrom + ' ' + nextDate.toLocaleDateString(dateLocale, { day: 'numeric', month: 'short' })
                          : '';
                        const priceDisplay = cabin.nightlyRate
                          ? Math.round(cabin.nightlyRate) + ' €'
                          : cabin.basePrice
                            ? Math.round(Number(cabin.basePrice)) + ' €'
                            : '';
                        const cabinUrl = localizedPath(locale as Locale, '/cabins/' + (cabin.slug || cabin.id));

                        return (
                          <Link
                            key={cabin.id}
                            href={cabinUrl}
                            className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:border-[#495D4D] hover:shadow-md transition-all duration-200 bg-white group"
                          >
                            {/* Thumbnail */}
                            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-md overflow-hidden flex-shrink-0">
                              <Image
                                src={imgUrl}
                                alt={cabin.name || 'Cabin'}
                                fill
                                style={{ objectFit: 'cover' }}
                                sizes="96px"
                              />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <h5 className="font-logga text-lg text-gray-900 truncate">{cabin.name}</h5>
                              <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 font-jost">
                                <span className="flex items-center gap-1">
                                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                                  </svg>
                                  {cabin.capacity} {st.persons}
                                </span>
                                {cabin.squareMeters && (
                                  <span>{Math.round(Number(cabin.squareMeters))}m²</span>
                                )}
                              </div>
                              <div className="mt-1.5 flex items-center gap-2">
                                <span className={"inline-flex items-center text-xs font-medium font-jost px-2 py-0.5 rounded-full " + (isAvailableNow ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700')}>
                                  <span className={"w-1.5 h-1.5 rounded-full mr-1.5 " + (isAvailableNow ? 'bg-emerald-500' : 'bg-amber-500')}></span>
                                  {formattedDate}
                                </span>
                              </div>
                            </div>

                            {/* Price + Arrow */}
                            <div className="flex flex-col items-end flex-shrink-0">
                              {priceDisplay && (
                                <div className="text-right mb-2">
                                  <span className="text-[11px] text-gray-400 font-jost">{st.fromPrice}</span>
                                  <div className="font-jost font-medium text-lg leading-tight">{priceDisplay}</div>
                                  <span className="text-[11px] text-gray-400 font-jost">{st.perNightShort}</span>
                                </div>
                              )}
                              <svg className="w-5 h-5 text-gray-300 group-hover:text-[#495D4D] transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
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
