'use client';

import { useTranslations } from '@/app/providers/TranslationsProvider';

interface CabinMapSectionProps {
  latitude?: number;
  longitude?: number;
  address?: string;
  postalCode?: string;
  city?: string;
  cabinName?: string;
}

/**
 * Map for the cabin's location, driven by the lat/long set in the CMS.
 *
 * Uses Google's keyless embed (`output=embed`), which drops a pin on the
 * coordinates - no Maps API key to provision or bill. Renders nothing when a
 * cabin has no coordinates rather than showing an arbitrary default location.
 */
const CabinMapSection = ({
  latitude,
  longitude,
  address,
  postalCode,
  city,
  cabinName,
}: CabinMapSectionProps) => {
  const { t, locale } = useTranslations('cabin');

  const hasCoordinates =
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    !Number.isNaN(latitude) &&
    !Number.isNaN(longitude);

  if (!hasCoordinates) return null;

  const query = `${latitude},${longitude}`;
  const mapSrc = `https://www.google.com/maps?q=${query}&z=15&hl=${locale}&output=embed`;
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;

  const addressLine = [address, [postalCode, city].filter(Boolean).join(' ')]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="mt-8 sm:mt-12 mb-8 sm:mb-12">
      <h2
        className="font-logga font-semibold text-[18px] md:text-[20px] mb-6 uppercase tracking-wide text-gray-800 p-4 md:p-6"
        style={{ backgroundColor: '#F1FAF7' }}
      >
        {t('detail.where_youll_be', "WHERE YOU'LL BE")}
      </h2>

      <div className="relative w-full h-[280px] sm:h-[380px] lg:h-[420px] bg-gray-200 overflow-hidden">
        <iframe
          src={mapSrc}
          title={
            cabinName
              ? `${cabinName} ${t('detail.map_title', 'location map')}`
              : t('detail.map_title', 'location map')
          }
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      {addressLine && (
        <div className="flex flex-wrap items-center justify-between gap-2 mt-3">
          <p className="font-jost font-light text-[14px] md:text-[15px] text-gray-700">
            {addressLine}
          </p>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-jost font-medium text-[14px] text-[#495D4D] underline hover:text-[#3d5a3d] transition-colors"
          >
            {t('detail.get_directions', 'Get directions')}
          </a>
        </div>
      )}
    </div>
  );
};

export default CabinMapSection;
