'use client';

import { EatDrinkItem } from '@/app/data/eatdrink';

interface EatDrinkCardProps {
  item: EatDrinkItem;
  onReadMore: (item: EatDrinkItem) => void;
  isReversed?: boolean; // For alternating layout
}

const EatDrinkCard: React.FC<EatDrinkCardProps> = ({ item, onReadMore, isReversed = false }) => {
  return (
    <div className="bg-white border border-black  ">
      <div className={`flex flex-col md:flex-row p-4 sm:p-6 ${isReversed ? 'md:flex-row-reverse' : ''}`}>
        {/* Image Section - 358px × 366px */}
        <div className={`w-full md:w-[358px] h-[250px] md:h-[366px] flex-shrink-0 mb-4 md:mb-0 ${isReversed ? 'md:ml-6' : 'md:mr-6'}`}>
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            {/* Title - 24px Jost 500 Medium #212121 */}
            <h3 className="text-[24px] font-medium font-heading mb-2 uppercase tracking-wide" style={{ color: '#212121' }}>
              {item.title}
            </h3>

            {/* Subtitle - 17px Raleway 500 Medium #706C6C */}
            <p className="text-[17px] font-medium font-body mb-4 leading-relaxed" style={{ color: '#706C6C' }}>
              {item.subtitle}
            </p>

            {/* Price - 24px Jost 500 Medium #212121 */}
            <p className="text-[24px] font-medium font-heading mb-5" style={{ color: '#212121' }}>
              {item.price}
            </p>

            {/* Description - 17px Raleway 500 Medium #706C6C */}
            <p className="text-[17px] font-medium font-body mb-6 leading-relaxed" style={{ color: '#706C6C' }}>
              {item.description}
            </p>
          </div>

          {/* Button */}
          <div>
            <button
              onClick={() => onReadMore(item)}
              className="w-full sm:w-auto px-10 py-2.5 bg-[#939D92] text-white text-xs font-semibold uppercase tracking-wider hover:bg-opacity-90 transition-colors text-center"
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
