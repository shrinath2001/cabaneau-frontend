'use client';

interface AmenitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AmenitiesModal = ({ isOpen, onClose }: AmenitiesModalProps) => {
  if (!isOpen) return null;

  // Organize amenities by category
  const amenitiesData = {
    bathroom: [
      { name: 'Bath', icon: '🛁' },
      { name: 'Bidet', icon: '🚿' },
      { name: 'Hot water', icon: '💧' },
      { name: 'Hair dryer', icon: '💨' },
      { name: 'Shampoo', icon: '🧴' },
      { name: 'Body soap', icon: '🧼' },
    ],
    'Bedroom and laundry': [
      { name: 'Hangers', icon: '👔' },
      { name: 'Room-darkening blinds', icon: '🪟' },
      { name: 'Clothes storage: wardrobe', icon: '🚪' },
      { name: 'Iron', icon: '⚡' },
      { name: 'Washer', icon: '🌀' },
      { name: 'Dryer', icon: '🔥' },
    ],
    'Heating and cooling': [
      { name: 'Air conditioning', icon: '❄️' },
      { name: 'Heating', icon: '🔥' },
    ],
    'Home safety': [
      { name: 'Smoke alarm', icon: '🚨' },
      { name: 'Carbon monoxide alarm', icon: '⚠️' },
      { name: 'Fire extinguisher', icon: '🧯' },
      { name: 'First aid kit', icon: '⚕️' },
    ],
    'Internet and office': [
      { name: 'Wifi', icon: '📶' },
      { name: 'Dedicated workspace', icon: '💼' },
    ],
    'Kitchen and dining': [
      { name: 'Kitchen', icon: '🍳' },
      { name: 'Refrigerator', icon: '🧊' },
      { name: 'Microwave', icon: '📟' },
      { name: 'Cooking basics', icon: '🧂' },
      { name: 'Dishes and silverware', icon: '🍽️' },
      { name: 'Coffee maker', icon: '☕' },
      { name: 'Dishwasher', icon: '💦' },
    ],
    'Location features': [
      { name: 'Private entrance', icon: '🚪' },
      { name: 'Private patio or balcony', icon: '🏡' },
      { name: 'Backyard', icon: '🌳' },
      { name: 'Garden view', icon: '🌺' },
    ],
    'Outdoor': [
      { name: 'BBQ grill', icon: '🔥' },
      { name: 'Outdoor furniture', icon: '🪑' },
      { name: 'Outdoor dining area', icon: '🍴' },
    ],
    'Parking and facilities': [
      { name: 'Free parking on premises', icon: '🅿️' },
      { name: 'Private sauna', icon: '🧖' },
      { name: 'Hot tub', icon: '🛁' },
    ],
    Entertainment: [
      { name: 'TV', icon: '📺' },
      { name: 'Sound system', icon: '🔊' },
    ],
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.15)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-[780px] w-full max-h-[90vh] overflow-hidden flex flex-col font-heading shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-end">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-6 py-8">
          <h2 className="text-[22px] font-medium mb-6">What this place offers</h2>

          {/* Amenities by Category */}
          <div className="space-y-6">
            {Object.entries(amenitiesData).map(([category, amenities]) => (
              <div key={category} className="pb-6 border-b border-gray-200 last:border-b-0">
                <h3 className="text-[16px] font-medium mb-4 lowercase first-letter:uppercase">{category}</h3>
                <div className="space-y-4">
                  {amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <span className="text-xl">{amenity.icon}</span>
                      <span className="text-[16px] font-medium">{amenity.name}</span>
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
