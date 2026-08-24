'use client';

import { useState, useEffect } from 'react';
import AmenitiesModal from './AmenitiesModal';
import { useTranslations } from '@/app/providers/TranslationsProvider';
import { apiFetch } from '@/app/lib/api';

interface AmenityCategory {
  slug: string;
  name: string;
  displayOrder: number;
}

// Translations for amenities section
const amenitiesTranslations: Record<string, {
  title: string;
  showAll: string;
  showAllCount: (count: number) => string;
}> = {
  en: {
    title: 'WHAT THIS CABIN OFFERS',
    showAll: 'SHOW ALL AMENITIES',
    showAllCount: (count) => `SHOW ALL ${count} AMENITIES`,
  },
  fr: {
    title: 'CE QUE CETTE CABANE OFFRE',
    showAll: 'VOIR TOUS LES ÉQUIPEMENTS',
    showAllCount: (count) => `VOIR TOUS LES ${count} ÉQUIPEMENTS`,
  },
  de: {
    title: 'WAS DIESE HÜTTE BIETET',
    showAll: 'ALLE AUSSTATTUNGEN ANZEIGEN',
    showAllCount: (count) => `ALLE ${count} AUSSTATTUNGEN ANZEIGEN`,
  },
  nl: {
    title: 'WAT DEZE HUT BIEDT',
    showAll: 'ALLE VOORZIENINGEN TONEN',
    showAllCount: (count) => `ALLE ${count} VOORZIENINGEN TONEN`,
  },
};

interface AmenityInfo {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  category: string;
}

interface AmenitiesSectionProps {
  additionalAmenities?: AmenityInfo[];
  featuredAmenities?: AmenityInfo[];
}

// Render Font Awesome 6 icon from CMS
// Icon stored as full class e.g., "fa-solid fa-bath" or legacy "fa-bath"
const AmenityIcon = ({ icon }: { icon?: string }) => {
  if (!icon) return null;
  // If icon already has a style prefix, use as-is; otherwise add fa-solid
  const iconClass = icon.includes('fa-solid') || icon.includes('fa-regular') || icon.includes('fa-brands')
    ? icon
    : icon.startsWith('fa-') ? `fa-solid ${icon}` : `fa-solid fa-${icon}`;
  return <i className={`${iconClass} w-5 h-5 flex-shrink-0 text-[#495D4D]`} />;
};

const AmenitiesSection = ({ additionalAmenities, featuredAmenities }: AmenitiesSectionProps) => {
  const [showModal, setShowModal] = useState(false);
  const { locale } = useTranslations();
  const t = amenitiesTranslations[locale] || amenitiesTranslations.en;
  const [categories, setCategories] = useState<AmenityCategory[]>([]);
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});

  // Preload amenity categories on mount so modal renders instantly
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiFetch('/api/amenity-categories', { headers: { 'x-language': locale } });
        if (response.ok) {
          const data: AmenityCategory[] = await response.json();
          setCategories(data);
          const map: Record<string, string> = {};
          data.forEach((cat) => { map[cat.slug] = cat.name; });
          setCategoryMap(map);
        }
      } catch (error) {
        console.error('Failed to fetch amenity categories:', error);
      }
    };
    fetchCategories();
  }, [locale]);

  // Combine all amenities from API
  const allAmenities = [...(featuredAmenities || []), ...(additionalAmenities || [])];

  // Show first 10 amenities in the grid
  const gridAmenities = (additionalAmenities || []).slice(0, 10);

  // Don't render section if no amenities
  if (allAmenities.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 sm:mb-12">
      <h2 className="font-logga font-semibold text-[18px] md:text-[20px] mb-6 uppercase tracking-wide text-gray-800 p-4 md:p-6" style={{ backgroundColor: '#F1FAF7' }}>
        {t.title}
      </h2>
      <div className="grid grid-cols-2 gap-x-6 md:gap-x-16 gap-y-4">
        {gridAmenities.map((amenity) => (
          <div key={amenity.id} className="flex items-center gap-2 md:gap-3">
            <AmenityIcon icon={amenity.icon} />
            <span className="font-jost font-light text-[15px] text-gray-800 uppercase">
              {amenity.name}
            </span>
          </div>
        ))}
      </div>

      {/* Show All button - only if there are more amenities */}
      {allAmenities.length > 10 && (
        <button
          onClick={() => setShowModal(true)}
          className="mt-6 md:mt-8 px-6 py-3 text-white font-jost font-medium text-[14px] md:text-[16px] hover:opacity-90 transition uppercase"
          style={{ backgroundColor: '#939D92' }}
        >
          {t.showAllCount(allAmenities.length)}
        </button>
      )}

      {/* Amenities Modal */}
      <AmenitiesModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        amenities={allAmenities}
        categories={categories}
        categoryMap={categoryMap}
      />
    </div>
  );
};

export default AmenitiesSection;
