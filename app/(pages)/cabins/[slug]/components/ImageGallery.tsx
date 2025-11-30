'use client';

import Image from 'next/image';

interface ImageGalleryProps {
  images: string[];
  featuredImage?: string;
  onShowAllClick: () => void;
}

const ImageGallery = ({ images, featuredImage, onShowAllClick }: ImageGalleryProps) => {
  // Prepare 5 images: use available images and fill rest with placeholders
  const allImages = images && images.length > 0 ? [...images] : [];
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

  return (
    <div className="grid grid-cols-[60fr_40fr] gap-2 mb-8 ">
      {/* Large main image - LEFT SIDE, full height */}
      <div className="relative bg-gray-200 h-[341px]">
        <Image
          src={displayImages[0]}
          alt="Cabin view 1"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 60vw"
        />
      </div>

      {/* RIGHT SIDE - 2x2 Grid of smaller images */}
      <div className="grid grid-cols-2 grid-rows-2 gap-2 h-[341px]">
        {/* Top left */}
        <div className="relative bg-gray-200">
          <Image
            src={displayImages[1]}
            alt="Cabin view 2"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 20vw"
          />
        </div>

        {/* Top right */}
        <div className="relative bg-gray-200">
          <Image
            src={displayImages[2]}
            alt="Cabin view 3"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 20vw"
          />
        </div>

        {/* Bottom left */}
        <div className="relative bg-gray-200">
          <Image
            src={displayImages[3]}
            alt="Cabin view 4"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 20vw"
          />
        </div>

        {/* Bottom right with "SHOW ALL PICTURES" button */}
        <div className="relative bg-gray-200">
          <Image
            src={displayImages[4]}
            alt="Cabin view 5"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 20vw"
          />
          {/* Show all pictures button - always visible in bottom right corner */}
          <div className="absolute bottom-4 right-4 z-10">
            <button
              onClick={onShowAllClick}
              className="bg-white px-6 py-3 text-sm font-semibold hover:bg-gray-50 transition shadow-lg border border-gray-200"
            >
              SHOW ALL PICTURES
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
