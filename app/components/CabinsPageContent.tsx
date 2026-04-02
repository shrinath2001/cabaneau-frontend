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
      <h1 className="font-logga text-[28px] md:text-[42px] font-semibold md:font-normal text-center mb-12">
        {t('page.title', 'OUR CABINS')}
      </h1>

      {cabins.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">{t('page.no_cabins', 'No cabins available at the moment.')}</p>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-8">
          {cabins.map((cabin: Cabin) => (
            <div key={cabin.id} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.34rem)]">
              <CabinCard {...cabin} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CabinsPageContent;
