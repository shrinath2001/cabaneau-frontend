'use client';
import { useRef, useState, useEffect } from 'react';
import CabinCard from './CabinCard';
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
  nights?: number;
  featuredAmenities?: AmenityInfo[];
}

/** Raw shape from GET /cabins/homepage, fetched server-side by the page. */
interface RawCabin {
  lodgifyId?: string;
  slug?: string;
  featuredImage?: string;
  images?: Array<string | { url: string }>;
  name?: string;
  title?: string;
  rating?: number;
  squareMeters?: string | number;
  area?: string;
  capacity?: number | string;
  nextAvailableDate?: string;
  availability?: string;
  nightlyRate?: number;
  basePrice?: string | number;
  price?: string;
  featuredAmenities?: AmenityInfo[];
  nights?: number;
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
function getCabinImageUrls(cabin: RawCabin): string[] {
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

/**
 * cabins arrives already fetched server-side (app/[locale]/page.tsx), so
 * this renders real cabin markup on the very first paint - no fetch, no
 * loading state, nothing for a crawler to catch mid-spinner.
 */
const CabinsSection = ({ cabins: rawCabins }: { cabins: RawCabin[] }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // Whether the row of cards is wider than its container. `justify-center`
  // must only apply while everything fits - centering an overflowing flex
  // row makes the browser start the scroll position mid-way, clipping the
  // first AND last card equally on load rather than starting at the first.
  const [isOverflowing, setIsOverflowing] = useState(false);
  const { t, locale } = useTranslations('homepage');

  // Get hardcoded translations for current locale
  const st = sectionTranslations[locale] || sectionTranslations.en;

  // Format date string with locale support
  const formatAvailabilityDate = (dateStr?: string): string => {
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
  };

  // Format capacity with translation
  const formatCapacity = (capacity?: number | string): string => {
    if (!capacity) return `2 ${st.persons}`;
    const maxCapacity = typeof capacity === 'string' ? parseInt(capacity) : capacity;
    return `2-${maxCapacity} ${st.persons}`;
  };

  const cabins: CabinData[] = rawCabins.map((cabin, index) => ({
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

  // Re-measured on resize and whenever the card count changes.
  useEffect(() => {
    const rail = scrollContainerRef.current;
    if (!rail) return;

    const measure = () => setIsOverflowing(rail.scrollWidth > rail.clientWidth + 1);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(rail);
    return () => observer.disconnect();
    // cabins is recomputed fresh every render now (no longer state), so
    // depend on its length rather than its reference to avoid tearing the
    // observer down and recreating it on unrelated re-renders.
  }, [cabins.length]);

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
      {/* container mx-auto + max-w-[1390px] matches the Header and every
          other homepage section (Services/Activities/Hosts) exactly -
          Tailwind's container caps width in steps at each breakpoint, so a
          plain max-w-[Npx] here drifts out of alignment with the logo/nav
          between those steps rather than matching it. px-0 (not px-4) on
          mobile preserves the carousel's edge-to-edge bleed; the title
          keeps its own mobile-only inset below. */}
      <section id="our-cabins" className="bg-white py-6 md:py-5 px-0 md:px-20 md:mt-12 scroll-mt-24">
        <div className="container mx-auto">
          <div className="max-w-[1390px] mx-auto">
            {/* Header with Title */}
            <div className="flex justify-center items-center pt-6 md:pt-10 mb-10 md:mb-10 px-4 md:px-0">
              <h2 className="font-logga text-[28px] md:text-[42px] font-semibold md:font-normal text-center">
                {t('cabins_section.title', 'OUR CABINES')}
              </h2>
            </div>

            {/* Cabins Carousel or Centered Grid */}
            <div className="w-full">
              {cabins.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">{t('cabins_section.empty', 'No cabins available at the moment. Please check back later.')}</p>
                </div>
              ) : cabins.length > 1 ? (
                // Carousel layout - centered while everything fits; once it
                // overflows it stays left-aligned and scrolls by touch/drag/
                // wheel, with the next card's partial edge as the only scroll
                // cue (no arrow buttons).
                //
                // mr-[calc((100%-100vw)/2)] bleeds ONLY the right edge out to
                // the true viewport edge, matching the Life at Cabaneau
                // slider, while the left edge stays put (aligned with the
                // logo/nav, per the container above). "100%" here is this
                // div's own width - i.e. the 1390px-capped content column -
                // so the calc resolves to exactly one side's gutter, pulled
                // in as a negative margin. On mobile the content column
                // already equals the viewport width, so the calc is 0 there
                // with no extra rule needed.
                <div className="relative mr-[calc((100%-100vw)/2)]">
                  <div
                    ref={scrollContainerRef}
                    className={`flex gap-[19.42px] overflow-x-auto no-scrollbar py-8 ${isOverflowing ? '' : 'md:justify-center'}`}
                    style={{ scrollSnapType: 'x mandatory' }}
                  >
                    <div className="flex-shrink-0 w-[10px] md:w-0"></div>
                    {cabins.map((cabin) => (
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
          </div>
        </div>
      </section>
    </>
  );
};

export default CabinsSection;
