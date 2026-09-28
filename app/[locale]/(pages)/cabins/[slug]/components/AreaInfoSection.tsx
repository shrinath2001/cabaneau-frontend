interface AreaInfoItem {
  name: string;
  distance: string;
}

interface AreaInfoCategory {
  icon: string;
  title: string;
  items: AreaInfoItem[];
}

interface AreaInfoSectionProps {
  title: string;
  categories: AreaInfoCategory[];
}

// Same normalization the amenity icons use (AmenitiesSection/CabinDetailPage):
// icon can be stored as a bare name ("fa-utensils") or already fully
// qualified ("fa-solid fa-utensils") - only prefix when it isn't already.
const iconClass = (icon: string): string => {
  if (!icon) return 'fa-solid fa-circle-question';
  if (icon.includes('fa-solid') || icon.includes('fa-regular') || icon.includes('fa-brands')) {
    return icon;
  }
  return icon.startsWith('fa-') ? `fa-solid ${icon}` : `fa-solid fa-${icon}`;
};

/**
 * "Area Info" - nearby restaurants/activities/transit/services. Identical
 * content on every cabin (edited once from the CMS "Area Info" screen), so
 * this renders whatever the API returns without any cabin-specific data.
 */
const AreaInfoSection = ({ title, categories }: AreaInfoSectionProps) => {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="mt-8 sm:mt-12 mb-8 sm:mb-12">
      <h2
        className="font-logga font-semibold text-[18px] md:text-[20px] mb-6 uppercase tracking-wide text-gray-800 px-4 md:px-6 pt-[11px] pb-2"
        style={{ backgroundColor: '#F1FAF7' }}
      >
        {title}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {categories.map((category, index) => (
          <div key={index}>
            <h3 className="flex items-center gap-2 font-jost font-medium text-[15px] uppercase tracking-wide text-gray-800 mb-3">
              <i className={`${iconClass(category.icon)} text-[#F49A4A]`} />
              {category.title}
            </h3>
            <ul>
              {category.items.map((item, itemIndex) => (
                <li
                  key={itemIndex}
                  className="flex items-baseline justify-between gap-3 py-1.5 border-b border-gray-100 last:border-b-0"
                >
                  <span className="font-jost font-light text-[14px] text-gray-700">
                    {item.name}
                  </span>
                  <span className="font-jost font-light text-[14px] text-gray-500 whitespace-nowrap">
                    {item.distance}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AreaInfoSection;
