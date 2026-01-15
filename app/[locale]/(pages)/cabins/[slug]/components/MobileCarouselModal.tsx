'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

// Image type that supports both old string[] and new tagged image format
interface CabinImage {
  url: string;
  thumbnailUrl?: string;
  tag: string;
  order: number;
}

// Helper to extract URL from either string or CabinImage
const getImageUrl = (img: string | CabinImage): string => {
  return typeof img === 'string' ? img : img.url;
};

interface MobileCarouselModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: (string | CabinImage)[];
  initialIndex?: number;
}

const MobileCarouselModal = ({ isOpen, onClose, images, initialIndex = 0 }: MobileCarouselModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Extract URLs for display
  const imageUrls = (images || []).map(getImageUrl);

  // Update current index when initial index changes
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Prevent body scroll when modal is open
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

  if (!isOpen || imageUrls.length === 0) return null;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % imageUrls.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
  };

  // Handle swipe gestures
  let touchStartX = 0;
  let touchEndX = 0;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX = e.changedTouches[0].clientX;
    handleSwipe();
  };

  const handleSwipe = () => {
    if (touchStartX - touchEndX > 50) {
      // Swipe left - next image
      nextImage();
    } else if (touchEndX - touchStartX > 50) {
      // Swipe right - previous image
      prevImage();
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-[60] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 md:p-6 bg-black/90">
        <button
          onClick={onClose}
          className="text-white p-2 hover:bg-white/10 transition"
          aria-label="Close"
        >
          <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="text-white text-sm md:text-base font-medium">
          {currentIndex + 1} / {imageUrls.length}
        </div>
      </div>

      {/* Image Display Area */}
      <div
        className="flex-1 relative flex items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={imageUrls[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          fill
          className="object-contain"
          sizes="100vw"
          priority
        />

        {/* Navigation Arrows */}
        {imageUrls.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur-sm transition z-10"
              aria-label="Previous image"
            >
              <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur-sm transition z-10"
              aria-label="Next image"
            >
              <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Strip (Optional) */}
      {imageUrls.length > 1 && (
        <div className="bg-black/90 p-4 md:p-6 overflow-x-auto">
          <div className="flex gap-2 md:gap-3 justify-center md:justify-start max-w-7xl mx-auto">
            {imageUrls.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 border-2 transition ${
                  idx === currentIndex ? 'border-white' : 'border-transparent opacity-60 hover:opacity-80'
                }`}
              >
                <Image
                  src={imgUrl}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileCarouselModal;
