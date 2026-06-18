'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from '@/app/providers/TranslationsProvider';
import { localizedPath, type Locale } from '@/app/lib/i18n';

interface SearchParams {
  arrival?: string;
  departure?: string;
  adults?: string;
  children?: string;
  infants?: string;
  pets?: string;
}

interface AmenityInfo {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  category: string;
}

interface CabinCardProps {
  id?: number;
  slug?: string;
  images: string[];
  title: string;
  rating: number;
  area: string;
  capacity: string;
  availability: string;
  price: string;
  originalPrice?: string;
  nights?: number;
  promotion?: {
    name: string;
    amount: number;
  };
  priceLoading?: boolean;
  searchParams?: SearchParams;
  featuredAmenities?: AmenityInfo[];
  /** Price display mode: 'perNight' shows "from X €/night", 'total' shows just the price */
  priceType?: 'perNight' | 'total';
  /** Optional warning message (e.g., minimum stay notice) */
  warningMessage?: string;
}

// Hardcoded translations for cabin card (fallback when CMS translations not available)
const cardTranslations: Record<string, {
  dates: string;
  nextAvailability: string;
  night: string;
  nights: string;
  bookNow: string;
  from: string;
  forNights: string;
  perNight: string;
}> = {
  en: { dates: 'Dates:', nextAvailability: 'Next Availability:', night: 'night', nights: 'nights', bookNow: 'BOOK NOW', from: 'from', forNights: 'for', perNight: 'per night' },
  fr: { dates: 'Dates :', nextAvailability: 'Disponibilité :', night: 'nuit', nights: 'nuits', bookNow: 'RÉSERVER', from: 'à partir de', forNights: 'pour', perNight: 'par nuit' },
  de: { dates: 'Daten:', nextAvailability: 'Verfügbarkeit:', night: 'Nacht', nights: 'Nächte', bookNow: 'JETZT BUCHEN', from: 'ab', forNights: 'für', perNight: 'pro Nacht' },
  nl: { dates: 'Data:', nextAvailability: 'Beschikbaarheid:', night: 'nacht', nights: 'nachten', bookNow: 'NU BOEKEN', from: 'vanaf', forNights: 'voor', perNight: 'per nacht' },
};

// Format area to remove decimals (30.00m² → 30m²)
const formatArea = (area: string): string => {
  // Match number with optional decimals followed by unit
  const match = area.match(/^(\d+)(?:[.,]\d+)?\s*(m²|sqm|sq\.?\s*m\.?|m2)$/i);
  if (match) {
    return `${match[1]}m²`;
  }
  // If no match, try to just remove decimals from any number
  return area.replace(/(\d+)[.,]\d+/g, '$1');
};

// Format capacity to show single number when min=max (2-4 Personen → 2-4 Personen, but 2-2 Personen → 2 Personen)
const formatCapacity = (capacity: string): string => {
  // Match pattern like "2-2 Personen" or "2-4 Personen" or "2-2p"
  const match = capacity.match(/^(\d+)\s*-\s*(\d+)\s*(.*)$/);
  if (match) {
    const [, min, max, suffix] = match;
    if (min === max) {
      return `${min} ${suffix}`.trim();
    }
  }
  return capacity;
};

// Format price to remove decimals and put Euro symbol after amount (€200.00 → 200 €)
const formatPrice = (price: string): string => {
  // Match currency symbol (before or after, with optional space) and amount
  const match = price.match(/^([€$£])?\s*(\d+(?:[.,]\d+)?)\s*([€$£])?(.*)$/);
  if (!match) return price;

  const [, symbolBefore, amount, symbolAfter, suffix] = match;
  const symbol = symbolBefore || symbolAfter || '€';
  const numericValue = parseFloat(amount.replace(',', '.'));
  // Euro symbol goes after the amount (European format)
  // Don't duplicate the symbol in suffix
  const cleanSuffix = suffix?.replace(/^\s*[€$£]\s*/, '') || '';
  return `${Math.round(numericValue)} ${symbol}${cleanSuffix}`;
};

// Render amenity icon from CMS using Font Awesome 6
// Icon stored as full class e.g., "fa-solid fa-bath" or legacy "fa-bath"
const AmenityIcon = ({ icon }: { icon?: string }) => {
  if (!icon) return null;

  // If icon already has a style prefix (fa-solid, fa-regular, fa-brands), use as-is
  // Otherwise, add fa-solid prefix for legacy icons stored as just "fa-bath"
  const iconClass = icon.includes('fa-solid') || icon.includes('fa-regular') || icon.includes('fa-brands')
    ? icon
    : icon.startsWith('fa-') ? `fa-solid ${icon}` : `fa-solid fa-${icon}`;

  return <i className={`${iconClass} text-gray-600 text-lg`} />;
};

const CabinCard: React.FC<CabinCardProps> = ({
  id,
  slug,
  images,
  title,
  rating,
  area,
  capacity,
  availability,
  price,
  originalPrice,
  nights,
  promotion,
  priceLoading,
  searchParams,
  featuredAmenities,
  priceType = 'perNight',
  warningMessage,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { locale } = useTranslations('cabins');

  // Get hardcoded translations for current locale
  const ct = cardTranslations[locale] || cardTranslations.en;

  // Build cabin URL with search params for pre-filling booking widget
  const buildCabinUrl = () => {
    const base = localizedPath(locale as Locale, `/cabins/${slug || id}`);
    if (!searchParams) return base;

    const params = new URLSearchParams();
    if (searchParams.arrival) params.set('arrival', searchParams.arrival);
    if (searchParams.departure) params.set('departure', searchParams.departure);
    if (searchParams.adults) params.set('adults', searchParams.adults);
    if (searchParams.children) params.set('children', searchParams.children);
    if (searchParams.infants) params.set('infants', searchParams.infants);
    if (searchParams.pets) params.set('pets', searchParams.pets);

    const queryString = params.toString();
    return queryString ? `${base}?${queryString}` : base;
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <Link href={buildCabinUrl()} className="block group bg-white border p-[15px] border-black w-[380px] h-[491px] shrink-0 flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1),0_20px_25px_-5px_rgba(0,0,0,0.1)] cursor-pointer">
      {/* Image Section */}
      <div className="relative w-[350px] h-[232.9px] bg-gray-100">
        <Image
          src={images[currentImageIndex]}
          alt={title}
          fill
          style={{ objectFit: 'cover' }}
        />
        {/* Navigation Arrows */}
        <button
          onClick={prevImage}
          className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center transition hover:opacity-70"
          aria-label="Previous image"
        >
          <svg className="w-8 h-8" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button
          onClick={nextImage}
          className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center transition hover:opacity-70"
          aria-label="Next image"
        >
          <svg className="w-8 h-8" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        {/* Carousel Dots */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setCurrentImageIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition ${
                index === currentImageIndex ? 'bg-[#F49A4A]' : 'bg-white/80'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className=" mt-4 flex flex-col justify-between flex-1">
        {/* Title and Rating */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-logga text-2xl text-black">{title}</h3>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`w-6 h-6 ${i < rating ? 'text-[#F49A4A]' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.929 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>

        {/* Info Row with Icons */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col gap-1 font-jost font-normal text-[16px]" style={{ color: '#5F5F5F' }}>
            <div className="flex items-center gap-1.5">
              <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>{formatArea(area)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>{formatCapacity(capacity)}</span>
            </div>
          </div>

          {/* Amenity Icons - Dynamic from API */}
          {featuredAmenities && featuredAmenities.length > 0 && (
            <div className="flex gap-2 items-center">
              {featuredAmenities.slice(0, 4).map((amenity) => (
                <AmenityIcon key={amenity.id} icon={amenity.icon} />
              ))}
            </div>
          )}
        </div>

        {/* Availability and Price */}
        <div className="flex justify-between items-center mb-3">
          <span className="font-jost font-medium text-[16px] text-gray-600">
            {availability.includes(' - ')
              ? ct.dates + ' '
              : ct.nextAvailability + ' '}
            <span className="text-black font-medium">{availability}</span>
          </span>
          <div className="text-right">
            {priceLoading ? (
              <div className="animate-pulse">
                <div className="h-7 w-24 bg-gray-200 mb-1"></div>
                <div className="h-3 w-16 bg-gray-200 ml-auto"></div>
              </div>
            ) : (
              <>
                {priceType === 'perNight' ? (
                  /* Homepage style: stacked "from / 300 € / per night" */
                  <div className="text-right flex flex-col items-end">
                    <span className="font-jost text-[12px] text-gray-500">{ct.from}</span>
                    <span className="font-jost font-medium text-[24px] leading-tight">{formatPrice(price)}</span>
                    <span className="font-jost text-[12px] text-gray-500">{ct.perNight}</span>
                  </div>
                ) : (
                  /* Search style: total price with nights + deal badge on same line */
                  <div className="text-right flex flex-col items-end">
                    <div className="flex items-baseline justify-end gap-2">
                      {originalPrice && promotion && (
                        <span className="font-jost text-[16px] text-gray-400 line-through">
                          {formatPrice(originalPrice)}
                        </span>
                      )}
                      <span className="font-jost font-medium text-[24px]">{formatPrice(price)}</span>
                    </div>
                    {(nights && nights > 0) || promotion ? (
                      <div className="flex items-center justify-end gap-2 mt-1">
                        {nights && nights > 0 && (
                          <span className="font-jost text-[12px] text-gray-500">
                            {ct.forNights} {nights} {nights === 1 ? ct.night : ct.nights}
                          </span>
                        )}
                        {promotion && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-medium rounded-full border border-emerald-200">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6.207.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414l6-6a1 1 0 000-1.414zM12.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                            </svg>
                            {promotion.name}
                          </span>
                        )}
                      </div>
                    ) : null}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Min Stay Warning */}
        {warningMessage && (
          <div className="flex items-center gap-1.5 mb-2 px-2 py-1.5 bg-amber-50 border border-amber-200">
            <svg className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-jost text-[11px] text-amber-700 leading-tight">{warningMessage}</span>
          </div>
        )}

        {/* Book Now Button */}
        <div className="w-full py-2.5 px-4 border border-black text-black text-sm font-medium tracking-wider text-center group-hover:bg-[#F49A4A] group-hover:text-white group-hover:border-[#F49A4A] transition-all duration-300">
          {ct.bookNow}
        </div>
      </div>
    </Link>
  );
};

export default CabinCard;
