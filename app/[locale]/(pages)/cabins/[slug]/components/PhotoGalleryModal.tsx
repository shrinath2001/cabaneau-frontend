'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from '@/app/providers/TranslationsProvider';

// Image structure matching backend CabinImage type
interface CabinImage {
  url: string;
  thumbnailUrl?: string;
  tag: string;
  order: number;
}

// Image tag from the API
interface ImageTag {
  slug: string;
  name: string; // Localized name
  displayOrder: number;
}

interface PhotoGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: (CabinImage | string)[];  // Support both new tagged format and legacy string[]
  featuredImage?: string;
  imageTags?: ImageTag[];  // Dynamic tags from API
  onImageClick?: (imageIndex: number, orderedImages: string[]) => void;
  /**
   * URL of the image to scroll to when the tour opens. Matched by URL rather
   * than index because the hero carousel and the tour order images
   * differently (the tour groups by tag and drops the featured image).
   */
  scrollToImageUrl?: string | null;
}

// Fallback category definitions (used when imageTags not provided)
const DEFAULT_CATEGORY_CONFIG: { tag: string; name: string }[] = [
  { tag: 'living-room', name: 'Living room' },
  { tag: 'bedroom', name: 'Bedroom' },
  { tag: 'kitchen', name: 'Kitchen' },
  { tag: 'bathroom', name: 'Bathroom' },
  { tag: 'wellness', name: 'Wellness' },
  { tag: 'working-area', name: 'Working area' },
  { tag: 'dining', name: 'Dining area' },
  { tag: 'exterior', name: 'Exterior' },
  { tag: 'other', name: 'Additional photos' },
];

// Define masonry layout patterns that eliminate white gaps
const getMasonryPattern = (imageCount: number, images: CabinImage[]) => {
  const items: { img: CabinImage; className: string }[] = [];

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
    // For 10+ images, add variety with full-width every 6th image
    for (let i = 0; i < imageCount; i++) {
      if ((i + 1) % 6 === 0) {
        items.push({ img: images[i], className: 'col-span-2 aspect-[21/9]' });
      } else {
        items.push({ img: images[i], className: 'aspect-[4/3]' });
      }
    }
  }

  return items;
};

const PhotoGalleryModal = ({ isOpen, onClose, images, featuredImage, imageTags, onImageClick, scrollToImageUrl }: PhotoGalleryModalProps) => {
  const { t } = useTranslations('cabin');

  // Jump to the tapped image once the tour has rendered.
  useEffect(() => {
    if (!isOpen || !scrollToImageUrl) return;
    const frame = requestAnimationFrame(() => {
      const target = document.querySelector(
        `[data-image-url="${CSS.escape(scrollToImageUrl)}"]`
      );
      target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    return () => cancelAnimationFrame(frame);
  }, [isOpen, scrollToImageUrl]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Keyboard support
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Build category config from dynamic tags or use defaults
  const CATEGORY_CONFIG = imageTags && imageTags.length > 0
    ? imageTags
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map(tag => ({
          tag: tag.slug,
          name: tag.slug === 'other' ? t('gallery.additional_photos', 'Additional photos') : tag.name,
        }))
    : DEFAULT_CATEGORY_CONFIG;

  // Normalize images - handle both string[] and CabinImage[] for backward compatibility
  // Only include gallery images with explicit tags, not the featured image
  const normalizedImages: CabinImage[] = (images || []).map((img, index) => {
    if (typeof img === 'string') {
      return { url: img, tag: 'other', order: index };
    }
    return img as CabinImage;
  });

  // Note: Featured image is intentionally excluded from Photo Tour
  // It's already displayed prominently on the cabin detail page
  // Only explicitly tagged gallery images should appear here

  // If no images, don't render
  if (normalizedImages.length === 0) return null;

  // Group images by tag
  const imagesByTag: Record<string, CabinImage[]> = {};
  normalizedImages.forEach(img => {
    const tag = img.tag || 'other';
    if (!imagesByTag[tag]) {
      imagesByTag[tag] = [];
    }
    imagesByTag[tag].push(img);
  });

  // Sort images within each category by order
  Object.keys(imagesByTag).forEach(tag => {
    imagesByTag[tag].sort((a, b) => a.order - b.order);
  });

  // Get categories that have images
  const activeCategories = CATEGORY_CONFIG.filter(cat => imagesByTag[cat.tag]?.length > 0);

  // If no active categories, show all images under "Photos"
  if (activeCategories.length === 0 && normalizedImages.length > 0) {
    imagesByTag['other'] = normalizedImages;
    activeCategories.push({ tag: 'other', name: t('gallery.photos', 'Photos') });
  }

  // Build flat ordered image URL array in category display order
  const getFlatOrderedImages = (): string[] => {
    const urls: string[] = [];
    for (const cat of activeCategories) {
      const catImages = imagesByTag[cat.tag];
      if (catImages) {
        for (const img of catImages) {
          urls.push(img.url);
        }
      }
    }
    return urls;
  };

  // Scroll to category function
  const scrollToCategory = (tag: string) => {
    const element = document.getElementById(`category-${tag}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Calculate flat index for image click handler
  const getFlatIndex = (categoryTag: string, indexInCategory: number): number => {
    let flatIndex = 0;
    for (const cat of activeCategories) {
      if (cat.tag === categoryTag) {
        return flatIndex + indexInCategory;
      }
      flatIndex += imagesByTag[cat.tag]?.length || 0;
    }
    return 0;
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-white z-10 border-b border-gray-200 py-4 px-6 md:px-20">
        <button
          onClick={onClose}
          className="flex items-center text-gray-700 hover:text-black transition"
          aria-label={t('gallery.close_gallery', 'Close photo gallery')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-20 py-8">
        {/* Photo Tour Title */}
        <h2 className="text-3xl font-logga font-semibold mb-8">{t('gallery.photo_tour', 'Photo tour')}</h2>

        {/* Category Thumbnails Grid - Only show categories with images */}
        {activeCategories.length > 1 && (
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4 sm:gap-6 mb-12">
            {activeCategories.map((category) => {
              const catImages = imagesByTag[category.tag];
              const thumbnailUrl = catImages[0]?.thumbnailUrl || catImages[0]?.url;

              return (
                <div
                  key={category.tag}
                  className="cursor-pointer group"
                  onClick={() => scrollToCategory(category.tag)}
                >
                  <div className="relative w-full sm:w-[185px] h-[90px] bg-gray-200 overflow-hidden mb-2">
                    <Image
                      src={thumbnailUrl}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                      sizes="(max-width: 640px) 50vw, 185px"
                    />
                  </div>
                  <p className="text-sm font-jost font-medium text-gray-800">{category.name}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Photo Categories with Dynamic Masonry Layout */}
        <div className="space-y-16">
          {activeCategories.map((category) => {
            const catImages = imagesByTag[category.tag];

            if (!catImages || catImages.length === 0) return null;

            const masonryItems = getMasonryPattern(catImages.length, catImages);

            return (
              <div
                key={category.tag}
                id={`category-${category.tag}`}
                className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-8 scroll-mt-24"
              >
                <div>
                  <h3 className="text-xl font-logga font-semibold md:sticky md:top-24">{category.name}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {masonryItems.map((item, idx) => {
                    const flatIndex = getFlatIndex(category.tag, idx);

                    return (
                      <div
                        key={idx}
                        data-image-url={item.img.url}
                        onClick={() => onImageClick?.(flatIndex, getFlatOrderedImages())}
                        className={`relative ${item.className} bg-gray-200 overflow-hidden cursor-pointer group scroll-mt-24`}
                      >
                        <Image
                          src={item.img.url}
                          alt={category.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 50vw"
                        />
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                      </div>
                    );
                  })}
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
