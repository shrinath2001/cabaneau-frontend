'use client';

import { useState } from 'react';
import ImageGallery from './ImageGallery';
import PhotoGalleryModal from './PhotoGalleryModal';
import MobileCarouselModal from './MobileCarouselModal';

interface CabinImage {
  url: string;
  thumbnailUrl?: string;
  tag: string;
  order: number;
}

interface ImageTag {
  slug: string;
  name: string;
  displayOrder: number;
}

interface CabinGalleryProps {
  images: (string | CabinImage)[];
  featuredImage?: string;
  heroVideo?: string;
  heroVideoPoster?: string;
  imageTags: ImageTag[];
}

/**
 * Owns the photo-tour/carousel modal state - the only genuinely interactive
 * part of the gallery. The images themselves arrive as props already
 * fetched server-side (see page.tsx), so ImageGallery's own first render
 * still outputs real <img>/<video> markup - wrapping it in this client
 * component only affects the modals, not whether the visible gallery is
 * present in the server HTML.
 */
export default function CabinGallery({ images, featuredImage, heroVideo, heroVideoPoster, imageTags }: CabinGalleryProps) {
  const [showPhotoGallery, setShowPhotoGallery] = useState(false);
  const [showMobileCarousel, setShowMobileCarousel] = useState(false);
  const [mobileCarouselIndex, setMobileCarouselIndex] = useState(0);
  const [mobileCarouselImages, setMobileCarouselImages] = useState<string[]>([]);
  const [carouselKey, setCarouselKey] = useState(0);
  // Image the photo tour should open on, set when a hero image is tapped.
  const [galleryTargetImage, setGalleryTargetImage] = useState<string | null>(null);

  return (
    <>
      <ImageGallery
        images={images}
        featuredImage={featuredImage}
        heroVideo={heroVideo}
        heroVideoPoster={heroVideoPoster}
        onShowAllClick={() => {
          setGalleryTargetImage(null);
          setShowPhotoGallery(true);
        }}
        onMobileImageClick={(imageUrl) => {
          setGalleryTargetImage(imageUrl);
          setShowPhotoGallery(true);
        }}
      />

      <PhotoGalleryModal
        isOpen={showPhotoGallery}
        onClose={() => setShowPhotoGallery(false)}
        images={images}
        featuredImage={featuredImage}
        imageTags={imageTags}
        scrollToImageUrl={galleryTargetImage}
        onImageClick={(index, orderedImages) => {
          setMobileCarouselImages(orderedImages);
          setMobileCarouselIndex(index);
          setCarouselKey((k) => k + 1);
          setShowMobileCarousel(true);
        }}
      />

      <MobileCarouselModal
        key={carouselKey}
        isOpen={showMobileCarousel}
        onClose={() => setShowMobileCarousel(false)}
        images={mobileCarouselImages.length > 0 ? mobileCarouselImages : images}
        initialIndex={mobileCarouselIndex}
      />
    </>
  );
}
