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

  // Fallback static services if none provided from API
  const fallbackServices: ServiceInfo[] = [
    {
      id: 'breakfast',
      name: 'BREAKFAST',
      slug: 'breakfast',
      category: 'BREAKFAST',
      featuredImage: '/assets/breakfast.jpg',
    },
    {
      id: 'dinner',
      name: 'DINNER',
      slug: 'dinner',
      category: 'DINING',
      featuredImage: '/assets/dinner.jpg',
    },
    {
      id: 'bbq',
      name: 'BBQ PACKAGE',
      slug: 'bbq',
      category: 'DINING',
      featuredImage: '/assets/bbq.jpg',
    },
    {
      id: 'massage',
      name: 'MASSAGE',
      slug: 'massage',
      category: 'WELLNESS',
      featuredImage: '/assets/massage.jpg',
    },
  ];

  const displayServices = services && services.length > 0 ? services : fallbackServices;

  // Don't render section if no services
  if (!displayServices || displayServices.length === 0) {
    return null;
  }

  // Get image URL - handle both absolute and relative paths
  const getImageUrl = (image?: string) => {
    if (!image) return '/assets/placeholder.jpg';
    if (image.startsWith('http')) return image;
    // For relative paths, prepend API URL
    return `${process.env.NEXT_PUBLIC_API_URL || ''}${image}`;
  };

  return (
    <div className="mb-8 sm:mb-12">
      <h2 className="font-logga font-semibold text-[16px] md:text-[20px] mb-6 uppercase tracking-wide text-gray-800 p-4 md:p-6" style={{ backgroundColor: '#F1FAF7' }}>
        {t('detail.extra_services', 'AVAILABLE EXTRA SERVICES')}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {displayServices.map((service) => (
          <div key={service.id} className="text-center">
            <div
              className="w-[70px] h-[70px] sm:w-[80px] sm:h-[80px] lg:w-[100px] lg:h-[100px] bg-gray-200 overflow-hidden mb-2 sm:mb-3 mx-auto"
              style={{
                backgroundImage: `url(${getImageUrl(service.featuredImage)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            <div className="font-heading font-medium text-[10px] sm:text-[12px] lg:text-[14px] uppercase" style={{ color: '#212121' }}>
              {service.name}
              {service.price && (
                <div className="text-[9px] sm:text-[10px] text-gray-500 mt-1">
                  €{Math.floor(Number(service.price))}{service.priceUnit === 'PER_PERSON' && t('price_unit.per_person', '/PERSON')}
                  {service.priceUnit === 'PER_GROUP' && t('price_unit.per_group', '/GROUP')}
                  {service.priceUnit === 'PER_HOUR' && t('price_unit.per_hour', '/HOUR')}
                  {service.priceUnit === 'PER_DAY' && t('price_unit.per_day', '/DAY')}
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
