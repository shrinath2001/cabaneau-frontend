'use client';

import CabinCard from "@/app/components/CabinCard";
import { useTranslations } from '@/app/providers/TranslationsProvider';

interface AmenityInfo {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  category: string;
}

interface Cabin {
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

interface CabinsPageContentProps {
  cabins: Cabin[];
}

const CabinsPageContent = ({ cabins }: CabinsPageContentProps) => {
  const { t } = useTranslations('cabin');

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="font-logga text-[28px] md:text-[42px] font-semibold text-center mb-12">
        {t('page.title', 'OUR CABINS')}
      </h1>

      {cabins.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">{t('page.no_cabins', 'No cabins available at the moment.')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cabins.map((cabin: Cabin) => (
            <CabinCard key={cabin.id} {...cabin} priceType="total" />
          ))}
        </div>
      )}
    </div>
  );
};

export default CabinsPageContent;
