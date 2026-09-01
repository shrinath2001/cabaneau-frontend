'use client';

import CabinCard from '@/app/components/CabinCard';
import { useTranslations } from '@/app/providers/TranslationsProvider';

interface AmenityInfo {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  category: string;
}

interface OtherCabin {
  id: number;
  slug: string;
  images: string[];
  title: string;
  rating: number;
  area: string;
  capacity: string;
  shortDescription?: string;
  availability: string;
  price: string;
  featuredAmenities?: AmenityInfo[];
}

/** Raw shape from GET /cabins/homepage, fetched server-side by the page. */
interface RawOtherCabin {
  lodgifyId?: string;
  slug?: string;
  name?: string;
  rating?: number;
  squareMeters?: number;
  capacity?: number;
  shortDescription?: string;
  nextAvailableDate?: string;
  nightlyRate?: number;
  basePrice?: number | string;
  featuredImage?: string;
  images?: Array<string | { url?: string }>;
  featuredAmenities?: AmenityInfo[];
}

interface OtherCabinsSectionProps {
  /** Already fetched server-side and filtered to exclude the current cabin. */
  cabins: RawOtherCabin[];
}

/** Featured image first, then the gallery, skipping duplicates. */
function collectImageUrls(cabin: {
  featuredImage?: string;
  images?: Array<string | { url?: string }>;
}): string[] {
  const urls: string[] = [];
  if (cabin.featuredImage) urls.push(cabin.featuredImage);
  for (const image of cabin.images || []) {
    const url = typeof image === 'string' ? image : image?.url;
    if (url && !urls.includes(url)) urls.push(url);
  }
  return urls;
}

/**
 * cabins arrives already fetched server-side (the cabin detail page), so
 * this renders real cross-sell links on the first paint.
 */
const OtherCabinsSection = ({ cabins: rawCabins }: OtherCabinsSectionProps) => {
  const { t, locale } = useTranslations('cabin');

  const cabins: OtherCabin[] = rawCabins.map((cabin, index) => ({
    id: cabin.lodgifyId ? parseInt(cabin.lodgifyId, 10) : index + 1,
    slug: cabin.slug || '',
    images: collectImageUrls(cabin),
    title: cabin.name || cabin.slug || '',
    rating: cabin.rating ?? 5,
    area: cabin.squareMeters ? `${cabin.squareMeters}m²` : '',
    capacity: cabin.capacity
      ? `2-${cabin.capacity} ${t('detail.persons', 'Persons')}`
      : '',
    shortDescription: cabin.shortDescription,
    availability: cabin.nextAvailableDate
      ? new Date(cabin.nextAvailableDate).toLocaleDateString(
          locale === 'en' ? 'en-GB' : locale,
          { day: 'numeric', month: 'short' }
        )
      : t('detail.available_today', 'Today'),
    price: cabin.nightlyRate
      ? `${Math.round(cabin.nightlyRate)} €`
      : cabin.basePrice
        ? `${Math.round(Number(cabin.basePrice))} €`
        : '',
    featuredAmenities: cabin.featuredAmenities,
  }));

  // Nothing to cross-sell to - stay quiet rather than render an empty band.
  if (cabins.length === 0) return null;

  return (
    <div className="mt-8 sm:mt-12 mb-8 sm:mb-12">
      <h2
        className="font-logga font-semibold text-[18px] md:text-[20px] mb-6 uppercase tracking-wide text-gray-800 p-4 md:p-6"
        style={{ backgroundColor: '#F1FAF7' }}
      >
        {t('detail.other_cabins', 'OTHER CABINS')}
      </h2>

      <div className="flex gap-4 overflow-x-auto py-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x">
        {cabins.map((cabin) => (
          <div key={cabin.slug} className="snap-start">
            <CabinCard {...cabin} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OtherCabinsSection;
