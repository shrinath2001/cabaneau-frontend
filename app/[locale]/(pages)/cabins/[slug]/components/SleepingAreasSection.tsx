'use client';

import { useTranslations } from '@/app/providers/TranslationsProvider';
import Image from 'next/image';

interface SleepingAreasSectionProps {
  locationImage?: string | null;
  cabinName?: string;
}

const SleepingAreasSection = ({ locationImage, cabinName }: SleepingAreasSectionProps) => {
  const { t } = useTranslations('cabin');

  // Use locationImage if available, otherwise fall back to default map
  const imageUrl = locationImage || '/assets/cabin-map.jpg';

  return (
    <div className="mb-8 sm:mb-12">
      <h2 className="font-logga text-[16px] md:text-[20px] mb-6 uppercase tracking-wide text-gray-800 p-4 md:p-6" style={{ backgroundColor: '#F1FAF7' }}>
        {t('detail.where_you_sleep', 'WHERE YOU WILL SLEEP')}
      </h2>

      <div className="relative w-full h-[250px] sm:h-[350px] lg:h-[400px] bg-gray-200 overflow-hidden">
        {locationImage ? (
          /* Show location image */
          <Image
            src={imageUrl}
            alt={cabinName ? `${cabinName} location` : 'Cabin location'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          />
        ) : (
          /* Show map placeholder */
          <div
            className="w-full h-full bg-gray-200"
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Fullscreen button */}
            <button
              className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white p-1.5 sm:p-2 rounded-lg shadow-md hover:bg-gray-50 transition"
              aria-label="View fullscreen"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
            </button>

            {/* Zoom controls */}
            <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-white rounded-lg shadow-md overflow-hidden">
              <button
                className="block p-1.5 sm:p-2 hover:bg-gray-50 transition border-b border-gray-200"
                aria-label="Zoom in"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <button
                className="block p-1.5 sm:p-2 hover:bg-gray-50 transition"
                aria-label="Zoom out"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
            </div>

            {/* Location marker - positioned based on the reference image */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                {/* Pin icon */}
                <svg className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: '#495D4D' }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                {/* Label */}
                <div className="absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 sm:px-3 py-0.5 sm:py-1 rounded shadow-md whitespace-nowrap">
                  <span className="font-heading font-semibold text-[12px] sm:text-[14px]" style={{ color: '#212121' }}>
                    {cabinName?.toUpperCase() || 'NEST'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SleepingAreasSection;
