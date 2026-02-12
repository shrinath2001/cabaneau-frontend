'use client';

import { useTranslations } from '@/app/providers/TranslationsProvider';

interface AmenityInfo {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  category: string;
}

interface AmenityCategory {
  slug: string;
  name: string;
  displayOrder: number;
}

interface AmenitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  amenities?: AmenityInfo[];
  categories?: AmenityCategory[];
  categoryMap?: Record<string, string>;
}

// Translations for modal
const modalTranslations: Record<string, { title: string }> = {
  en: { title: 'What this place offers' },
  fr: { title: 'Ce que ce lieu offre' },
  de: { title: 'Was dieser Ort bietet' },
  nl: { title: 'Wat deze plek biedt' },
};

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

const AmenitiesModal = ({ isOpen, onClose, amenities, categories = [], categoryMap = {} }: AmenitiesModalProps) => {
  const { locale } = useTranslations();
  const t = modalTranslations[locale] || modalTranslations.en;

  if (!isOpen) return null;

  // Don't render if no amenities
  if (!amenities || amenities.length === 0) {
    return null;
  }

  // Get category display name (translated name or fallback to slug with formatting)
  const getCategoryName = (slug: string): string => {
    if (categoryMap[slug]) {
      return categoryMap[slug];
    }
    // Fallback: convert slug to readable format (bedroom-and-laundry -> Bedroom And Laundry)
    return slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Group amenities by category, sorted by category display order
  const groupedAmenities: Record<string, AmenityInfo[]> = {};
  amenities.forEach((amenity) => {
    const category = amenity.category || 'other';
    if (!groupedAmenities[category]) {
      groupedAmenities[category] = [];
    }
    groupedAmenities[category].push(amenity);
  });

  // Sort categories by display order from API
  const sortedCategories = Object.keys(groupedAmenities).sort((a, b) => {
    const orderA = categories.find((c) => c.slug === a)?.displayOrder ?? 999;
    const orderB = categories.find((c) => c.slug === b)?.displayOrder ?? 999;
    return orderA - orderB;
  });

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.15)' }}
      onClick={onClose}
    >
      <div
        className="bg-white max-w-[780px] w-full max-h-[90vh] overflow-hidden flex flex-col font-heading shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-end">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-6 py-8">
          <h2 className="text-[22px] font-logga font-semibold mb-6">{t.title}</h2>

          {/* Amenities by Category */}
          <div className="space-y-6">
            {sortedCategories.map((categorySlug) => (
              <div key={categorySlug} className="pb-6 border-b border-gray-200 last:border-b-0">
                <h3 className="text-[16px] font-logga font-semibold mb-4">{getCategoryName(categorySlug)}</h3>
                <div className="space-y-4">
                  {groupedAmenities[categorySlug].map((amenity) => (
                    <div key={amenity.id} className="flex items-center gap-4">
                      <AmenityIcon icon={amenity.icon} />
                      <span className="text-[16px] font-jost font-light uppercase">{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmenitiesModal;
