'use client';

import { EatDrinkItem } from '@/app/types/content';

interface EatDrinkCardProps {
  item: EatDrinkItem;
  onReadMore: (item: EatDrinkItem) => void;
  isReversed?: boolean; // For alternating layout
}

const EatDrinkCard: React.FC<EatDrinkCardProps> = ({ item, onReadMore, isReversed = false }) => {
  return (
    <div className="bg-white border border-black">
      <div className={`flex flex-col md:flex-row p-4 sm:p-6 ${isReversed ? 'md:flex-row-reverse' : ''}`}>
        {/* Image Section - 358px × 366px */}
        {item.image && (
          <div className={`w-full md:w-[358px] h-[250px] md:h-[366px] flex-shrink-0 mb-4 md:mb-0 ${isReversed ? 'md:ml-6' : 'md:mr-6'}`}>
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content Section */}
        <div className="flex-1 flex flex-col">
          <div>
            {/* Title - 22px Logga #212121 */}
            <h3 className="text-[18px] md:text-[22px] font-logga mb-2 uppercase tracking-wide" style={{ color: '#212121' }}>
              {item.title}
            </h3>

            {/* Subtitle - 18px Jost Light #706C6C */}
            <p className="text-[14px] md:text-[18px] font-jost font-light mb-3 leading-relaxed" style={{ color: '#706C6C' }}>
              {item.subtitle}
            </p>

            {/* Price - 22px Jost 500 Medium #212121 */}
            <p className="text-[18px] md:text-[22px] font-medium font-heading mb-4" style={{ color: '#212121' }}>
              {item.price}
            </p>

            {/* Description - 18px Jost Light #706C6C */}
            <p className="text-[14px] md:text-[18px] font-jost font-light mb-5 leading-relaxed" style={{ color: '#706C6C' }}>
              {item.description}
            </p>
          </div>

          {/* Button */}
          <div>
            <button
              onClick={() => onReadMore(item)}
              className="w-full sm:w-auto px-8 py-2 bg-[#939D92] text-white text-[16px] font-heading font-medium uppercase tracking-wider hover:bg-opacity-90 transition-colors text-center"
            >
              READ MORE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EatDrinkCard;
