'use client';

import { EatDrinkItem } from '@/app/data/eatdrink';
import { useEffect } from 'react';

interface EatDrinkDetailModalProps {
  item: EatDrinkItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const EatDrinkDetailModal: React.FC<EatDrinkDetailModalProps> = ({ item, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.15)' }}
      onClick={onClose}
    >
      <div
        className="bg-white w-[398px] max-h-[80vh] md:w-full md:max-w-[600px] md:max-h-[85vh] overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Close Button Container */}
        <div className="sticky top-0 z-20 flex justify-end p-3 pointer-events-none">
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition-colors pointer-events-auto"
            aria-label="Close modal"
          >
            <span className="text-gray-600 text-lg font-bold">×</span>
          </button>
        </div>

        {/* Image */}
        <div className="w-full h-[280px] relative -mt-[52px]">
          <img
            src={item.detailImage || item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-[17px] md:p-8">
          {/* Title and Subtitle */}
          <h2 className="text-xl font-bold font-heading mb-2 uppercase tracking-wide">{item.title}</h2>
          <p className="text-sm text-gray-600 mb-6">{item.subtitle}</p>

          {/* Price */}
          {item.price && (
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase text-gray-900 mb-3 tracking-wide">PRICE</h3>
              <p className="text-sm text-gray-700 font-medium">{item.price}</p>
            </div>
          )}

          {/* Description Section */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase text-gray-900 mb-3 tracking-wide">DESCRIPTION</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{item.description}</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EatDrinkDetailModal;
