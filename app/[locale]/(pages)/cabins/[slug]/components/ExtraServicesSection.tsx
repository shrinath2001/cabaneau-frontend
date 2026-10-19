'use client';

import { useTranslations } from '@/app/providers/TranslationsProvider';

interface ServiceInfo {
  id: string;
  name: string;
  slug: string;
  category: string;
  price?: number;
  priceUnit?: string;
  featuredImage?: string;
}

interface ExtraServicesSectionProps {
  services?: ServiceInfo[];
}

const ExtraServicesSection = ({ services }: ExtraServicesSectionProps) => {
  const { t } = useTranslations('cabin');

  // Services come from the CMS only (cabin > services)
  const displayServices = services || [];

  // Don't render section if no services
  if (!displayServices || displayServices.length === 0) {
    return null;
  }

  // Get image URL - handle both absolute and relative paths
  const getImageUrl = (image?: string) => {
    if (!image) return '';
    if (image.startsWith('http')) return image;
    // For relative paths, prepend API URL
    return `${process.env.NEXT_PUBLIC_API_URL || ''}${image}`;
  };

  return (
    <div className="mt-8 sm:mt-12 mb-8 sm:mb-12">
      <h2 className="font-logga font-semibold text-[18px] md:text-[20px] mb-6 uppercase tracking-wide text-gray-800 px-4 md:px-6 pt-[11px] pb-2" style={{ backgroundColor: '#F1FAF7' }}>
        {t('detail.extra_services')}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {displayServices.map((service) => (
          <div key={service.id} className="text-center">
            <div
              className="w-[70px] h-[70px] sm:w-[80px] sm:h-[80px] lg:w-[100px] lg:h-[100px] bg-gray-200 overflow-hidden mb-2 sm:mb-3 mx-auto"
              style={{
                backgroundImage: service.featuredImage ? `url(${getImageUrl(service.featuredImage)})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            <div className="font-heading font-medium text-[12px] sm:text-[13px] lg:text-[14px] uppercase" style={{ color: '#212121' }}>
              {service.name}
              {service.price && (
                <div className="text-[11px] sm:text-[11px] text-gray-500 mt-1">
                  €{Math.floor(Number(service.price))}{service.priceUnit === 'PER_PERSON' && t('price_unit.per_person')}
                  {service.priceUnit === 'PER_GROUP' && t('price_unit.per_group')}
                  {service.priceUnit === 'PER_HOUR' && t('price_unit.per_hour')}
                  {service.priceUnit === 'PER_DAY' && t('price_unit.per_day')}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExtraServicesSection;
