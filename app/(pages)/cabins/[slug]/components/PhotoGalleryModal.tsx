'use client';

import Image from 'next/image';

interface PhotoGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  featuredImage?: string;
}

// Define masonry layout patterns that eliminate white gaps
const getMasonryPattern = (imageCount: number, startIndex: number, images: string[]) => {
  const items = [];

  // Patterns that ensure no gaps by filling all grid cells
  if (imageCount === 1) {
    items.push({ img: images[0], className: 'col-span-2 aspect-[21/9]' });
  } else if (imageCount === 2) {
    items.push({ img: images[0], className: 'col-span-2 aspect-[21/9]' });
    items.push({ img: images[1], className: 'col-span-2 aspect-[21/9]' });
  } else if (imageCount === 3) {
    items.push({ img: images[0], className: 'aspect-[4/3]' });
    items.push({ img: images[1], className: 'aspect-[4/3]' });
    items.push({ img: images[2], className: 'col-span-2 aspect-[21/9]' });
  } else if (imageCount === 4) {
    items.push({ img: images[0], className: 'aspect-[4/3]' });
    items.push({ img: images[1], className: 'aspect-[4/3]' });
    items.push({ img: images[2], className: 'aspect-[4/3]' });
    items.push({ img: images[3], className: 'aspect-[4/3]' });
  } else if (imageCount === 5) {
    items.push({ img: images[0], className: 'aspect-[4/3]' });
    items.push({ img: images[1], className: 'aspect-[4/3]' });
    items.push({ img: images[2], className: 'aspect-[4/3]' });
    items.push({ img: images[3], className: 'aspect-[4/3]' });
    items.push({ img: images[4], className: 'col-span-2 aspect-[21/9]' });
  } else if (imageCount === 6) {
    items.push({ img: images[0], className: 'aspect-[4/3]' });
    items.push({ img: images[1], className: 'aspect-[4/3]' });
    items.push({ img: images[2], className: 'aspect-[4/3]' });
    items.push({ img: images[3], className: 'aspect-[4/3]' });
    items.push({ img: images[4], className: 'aspect-[4/3]' });
    items.push({ img: images[5], className: 'aspect-[4/3]' });
  } else if (imageCount === 7) {
    items.push({ img: images[0], className: 'aspect-[4/3]' });
    items.push({ img: images[1], className: 'aspect-[4/3]' });
    items.push({ img: images[2], className: 'aspect-[4/3]' });
    items.push({ img: images[3], className: 'aspect-[4/3]' });
    items.push({ img: images[4], className: 'aspect-[4/3]' });
    items.push({ img: images[5], className: 'aspect-[4/3]' });
    items.push({ img: images[6], className: 'col-span-2 aspect-[21/9]' });
  } else if (imageCount === 8) {
    items.push({ img: images[0], className: 'aspect-[4/3]' });
    items.push({ img: images[1], className: 'aspect-[4/3]' });
    items.push({ img: images[2], className: 'aspect-[4/3]' });
    items.push({ img: images[3], className: 'aspect-[4/3]' });
    items.push({ img: images[4], className: 'aspect-[4/3]' });
    items.push({ img: images[5], className: 'aspect-[4/3]' });
    items.push({ img: images[6], className: 'aspect-[4/3]' });
    items.push({ img: images[7], className: 'aspect-[4/3]' });
  } else if (imageCount === 9) {
    items.push({ img: images[0], className: 'aspect-[4/3]' });
    items.push({ img: images[1], className: 'aspect-[4/3]' });
    items.push({ img: images[2], className: 'aspect-[4/3]' });
    items.push({ img: images[3], className: 'aspect-[4/3]' });
    items.push({ img: images[4], className: 'aspect-[4/3]' });
    items.push({ img: images[5], className: 'aspect-[4/3]' });
    items.push({ img: images[6], className: 'col-span-2 aspect-[21/9]' });
    items.push({ img: images[7], className: 'aspect-[4/3]' });
    items.push({ img: images[8], className: 'aspect-[4/3]' });
  } else {
    // For 10+ images, ensure multiples of 2 to avoid gaps
    for (let i = 0; i < imageCount; i++) {
      // Every 6th image is full-width to add variety
      if ((i + 1) % 6 === 0) {
        items.push({ img: images[i], className: 'col-span-2 aspect-[21/9]' });
      } else {
        items.push({ img: images[i], className: 'aspect-[4/3]' });
      }
    }
  }

  return items;
};

const PhotoGalleryModal = ({ isOpen, onClose, images, featuredImage }: PhotoGalleryModalProps) => {
  if (!isOpen) return null;

  // Prepare all images - include featured image first
  const allImages = images && images.length > 0 ? [...images] : [];
  if (featuredImage && !allImages.includes(featuredImage)) {
    allImages.unshift(featuredImage);
  }

  // If no images, don't render
  if (allImages.length === 0) return null;

  // Define categories with specific image counts for client presentation
  const categories = [
    { name: 'Living room', id: 'living', imageCount: 3 },
    { name: 'Bedroom', id: 'bedroom', imageCount: 5 },
    { name: 'Kitchen', id: 'kitchen', imageCount: 7 },
    { name: 'Bathroom', id: 'bathroom', imageCount: 8 },
    { name: 'Wellness', id: 'wellness', imageCount: 9 },
    { name: 'Working area', id: 'working', imageCount: 7 },
  ];

  // Create placeholder image function
  const createPlaceholderImages = (count: number) => {
    const images: string[] = [];
    const placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23cccccc"/%3E%3C/svg%3E';

    for (let i = 0; i < count; i++) {
      // Use real image if available, otherwise use placeholder
      images.push(allImages[i % allImages.length] || placeholder);
    }
    return images;
  };

  // Create category image assignments with placeholders for presentation
  const categoryImages: { [key: string]: string[] } = {};

  categories.forEach((category) => {
    categoryImages[category.id] = createPlaceholderImages(category.imageCount);
  });

  // For category thumbnails, use first 5 images or placeholders
  const displayImages = [
    allImages[0] || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23cccccc"/%3E%3C/svg%3E',
    allImages[1] || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23cccccc"/%3E%3C/svg%3E',
    allImages[2] || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23cccccc"/%3E%3C/svg%3E',
    allImages[3] || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23cccccc"/%3E%3C/svg%3E',
    allImages[4] || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23cccccc"/%3E%3C/svg%3E',
  ];

  return (
    <div className="fixed inset-0 bg-white z-50 py-5 px-20 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={onClose}
            className="flex items-center text-gray-700 hover:text-black"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-2xl font-semibold ml-4">Photo tour</h2>
        </div>

        {/* Category Thumbnails Grid */}
        <div className="flex flex-wrap gap-6 mb-12">
          {[
            { name: 'Living room', img: displayImages[0] },
            { name: 'Full kitchen', img: displayImages[1] },
            { name: 'Bedroom', img: displayImages[2] },
            { name: 'Dining area', img: displayImages[3] },
            { name: 'Bathroom', img: displayImages[4] },
            { name: 'Wellness', img: displayImages[0] },
            { name: 'Working area', img: displayImages[1] },
            { name: 'Additional photos', img: displayImages[2] },
          ].map((category, idx) => (
            <div key={idx} className="cursor-pointer group">
              <div className="relative w-[185px] h-[90px] bg-gray-200 overflow-hidden mb-2">
                <Image
                  src={category.img}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  sizes="185px"
                />
              </div>
              <p className="text-sm font-medium">{category.name}</p>
            </div>
          ))}
        </div>

        {/* Photo Categories with Dynamic Masonry Layout */}
        <div className="space-y-16">
          {categories.map((category) => {
            const catImages = categoryImages[category.id];

            // Skip categories with no images
            if (!catImages || catImages.length === 0) return null;

            // Get masonry pattern for this category
            const masonryItems = getMasonryPattern(catImages.length, 0, catImages);

            return (
              <div key={category.id} className="grid grid-cols-[200px_1fr] gap-8">
                <div>
                  <h3 className="text-xl font-semibold sticky top-8">{category.name}</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {masonryItems.map((item, idx) => (
                    <div key={idx} className={`relative ${item.className} bg-gray-200 overflow-hidden`}>
                      <Image
                        src={item.img}
                        alt={category.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PhotoGalleryModal;
