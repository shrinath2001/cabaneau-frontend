'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from '@/app/providers/TranslationsProvider';

// Image type that supports both old string[] and new tagged image format
interface CabinImage {
  url: string;
  thumbnailUrl?: string;
  tag: string;
  order: number;
}

interface ImageGalleryProps {
  images: (string | CabinImage)[];
  featuredImage?: string;
  onShowAllClick: () => void;
  onMobileImageClick?: (index: number) => void;
}

// Helper to extract URL from either string or CabinImage
const getImageUrl = (img: string | CabinImage): string => {
  return typeof img === 'string' ? img : img.url;
};

const ImageGallery = ({ images, featuredImage, onShowAllClick, onMobileImageClick }: ImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { t } = useTranslations('cabin');

  // Prepare images - extract URLs for display
  const imageUrls = (images || []).map(getImageUrl);
  const allImages = imageUrls.length > 0 ? [...imageUrls] : [];
  if (featuredImage && !allImages.includes(featuredImage)) {
    allImages.unshift(featuredImage);
  }

  // Ensure we have exactly 5 images (fill with gray placeholder if needed)
  const displayImages = [
    allImages[0] || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23cccccc"/%3E%3C/svg%3E',
    allImages[1] || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23cccccc"/%3E%3C/svg%3E',
    allImages[2] || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23cccccc"/%3E%3C/svg%3E',
    allImages[3] || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23cccccc"/%3E%3C/svg%3E',
    allImages[4] || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23cccccc"/%3E%3C/svg%3E',
  ];

  const totalImages = allImages.length || 1;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % totalImages);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };

  return (
    <>
      {/* Mobile View - Single Carousel */}
      <div className="block md:hidden relative mb-6">
        <div
          className="relative bg-gray-200 h-[250px] w-full cursor-pointer"
          onClick={() => onMobileImageClick?.(currentImageIndex)}
        >
          <Image
            src={allImages[currentImageIndex] || displayImages[0]}
            alt={`Cabin view ${currentImageIndex + 1}`}
            fill
            className="object-cover"
            sizes="100vw"
          />

          {/* Navigation Arrows */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/80 hover:bg-white rounded-full transition"
            aria-label="Previous image"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/80 hover:bg-white rounded-full transition"
            aria-label="Next image"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1 rounded text-sm font-medium">
            {currentImageIndex + 1} / {totalImages}
          </div>
        </div>
      </div>

      {/* Desktop View - Grid Layout */}
      <div className="hidden md:grid grid-cols-[60fr_40fr] gap-2 mb-8">
        {/* Large main image - LEFT SIDE, full height */}
        <div
          className="relative bg-gray-200 h-[341px] cursor-pointer"
          onClick={() => onMobileImageClick?.(0)}
        >
          <Image
            src={displayImages[0]}
            alt="Cabin view 1"
            fill
            className="object-cover"
            sizes="60vw"
          />
        </div>

        {/* RIGHT SIDE - 2x2 Grid of smaller images */}
        <div className="grid grid-cols-2 grid-rows-2 gap-2 h-[341px]">
          {/* Top left */}
          <div
            className="relative bg-gray-200 cursor-pointer"
            onClick={() => onMobileImageClick?.(1)}
          >
            <Image
              src={displayImages[1]}
              alt="Cabin view 2"
              fill
              className="object-cover"
              sizes="20vw"
            />
          </div>

          {/* Top right */}
          <div
            className="relative bg-gray-200 cursor-pointer"
            onClick={() => onMobileImageClick?.(2)}
          >
            <Image
              src={displayImages[2]}
              alt="Cabin view 3"
              fill
              className="object-cover"
              sizes="20vw"
            />
          </div>

          {/* Bottom left */}
          <div
            className="relative bg-gray-200 cursor-pointer"
            onClick={() => onMobileImageClick?.(3)}
          >
            <Image
              src={displayImages[3]}
              alt="Cabin view 4"
              fill
              className="object-cover"
              sizes="20vw"
            />
          </div>

          {/* Bottom right with "SHOW ALL PICTURES" button */}
          <div
            className="relative bg-gray-200 cursor-pointer"
            onClick={() => onMobileImageClick?.(4)}
          >
            <Image
              src={displayImages[4]}
              alt="Cabin view 5"
              fill
              className="object-cover"
              sizes="20vw"
            />
            {/* Show all pictures button - always visible in bottom right corner */}
            <div className="absolute bottom-4 right-4 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShowAllClick();
                }}
                className="bg-white px-6 py-3 text-sm font-semibold hover:bg-gray-50 transition shadow-lg border border-gray-200"
              >
                {t('gallery.show_all_pictures', 'SHOW ALL PICTURES')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageGallery;
