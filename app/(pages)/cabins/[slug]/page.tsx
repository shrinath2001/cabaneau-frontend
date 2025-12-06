'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import PhotoGalleryModal from './components/PhotoGalleryModal';
import BookingCard from './components/BookingCard';
import ImageGallery from './components/ImageGallery';
import AmenitiesSection from './components/AmenitiesSection';
import ExtraServicesSection from './components/ExtraServicesSection';
import SleepingAreasSection from './components/SleepingAreasSection';
import { cabins as staticCabins } from '@/app/data/cabins';

interface CabinDetails {
  id: string;
  lodgifyId: string;
  name: {
    en: string;
    fr?: string;
    de?: string;
  };
  slug: string;
  description?: {
    en: string;
    fr?: string;
  };
  shortDescription?: {
    en: string;
  };
  capacity: number;
  bedrooms: number;
  bathrooms: number;
  squareMeters?: number;
  basePrice: number;
  featuredImage: string;
  images: string[];
  floorPlan?: string;
  virtualTour?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
}

const SingleCabinPage = () => {
  const params = useParams();
  const slug = params.slug as string;

  const [cabin, setCabin] = useState<CabinDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPhotoGallery, setShowPhotoGallery] = useState(false);

  useEffect(() => {
    const fetchCabin = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔍 Fetching cabin with slug:', slug);
        const response = await fetch(`/api/cabins/slug/${slug}`);

        console.log('📥 Response status:', response.status);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          console.error('❌ API Error:', errorData);

          if (response.status === 404) {
            notFound();
          }
          throw new Error(errorData.error || `Failed to fetch cabin (${response.status})`);
        }

        const data = await response.json();
        console.log('✅ Cabin data received:', data);
        setCabin(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        console.error('❌ Error fetching cabin:', errorMessage, err);
        console.log('📦 Attempting to use static cabin data as fallback');

        // Try to find cabin from static data as fallback
        // Extract cabin number from slug (e.g., "cabin-1" -> 1, "tube" -> 1)
        const cabinNumber = slug.match(/\d+/) ? parseInt(slug.match(/\d+/)![0]) : null;

        // Try to find by ID or by matching slug/title
        const staticCabin = cabinNumber
          ? staticCabins.find(c => c.id === cabinNumber)
          : staticCabins.find(c =>
              c.title.toLowerCase().includes(slug.toLowerCase()) ||
              slug.toLowerCase().includes(c.title.toLowerCase())
            );

        if (staticCabin) {
          console.log('✅ Found static cabin data:', staticCabin.title);
          // Transform static cabin to match CabinDetails interface
          const transformedCabin: CabinDetails = {
            id: staticCabin.id.toString(),
            lodgifyId: staticCabin.id.toString(),
            name: {
              en: staticCabin.title,
            },
            slug: slug,
            description: {
              en: staticCabin.description,
            },
            shortDescription: {
              en: staticCabin.description.substring(0, 200) + '...',
            },
            capacity: staticCabin.guests,
            bedrooms: staticCabin.bedrooms,
            bathrooms: staticCabin.bathrooms,
            squareMeters: parseInt(staticCabin.area) || undefined,
            basePrice: parseFloat(staticCabin.price.replace('$', '')) || 300,
            featuredImage: staticCabin.images[0],
            images: staticCabin.images,
            isActive: true,
          };
          setCabin(transformedCabin);
        } else {
          setError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCabin();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error || !cabin) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p className="text-red-600">Error loading cabin details</p>
          <Link href="/cabins" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to all cabins
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-3 px-4 sm:py-5 sm:px-8 lg:px-20">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 py-4 sm:py-8">
        {/* Back to cabins link */}
        <div className="mb-4 sm:mb-6">
          <Link href="/cabins" className="flex items-center text-gray-700 hover:text-black text-xs sm:text-sm font-medium">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            BACK TO ALL CABINES
          </Link>
        </div>

        {/* Image Gallery Component */}
        <ImageGallery
          images={cabin.images || []}
          featuredImage={cabin.featuredImage}
          onShowAllClick={() => setShowPhotoGallery(true)}
        />

        {/* CONTENT SECTION BELOW IMAGES */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_464px] gap-4 sm:gap-8 mt-4 sm:mt-8">
          {/* Left Column - Cabin Details */}
          <div>
            {/* Cabin Details Title */}
            <div className="mb-4 sm:mb-6">
              <h1 className="font-heading font-medium text-[16px] sm:text-[20px] lg:text-[24px] mb-3 sm:mb-4 uppercase tracking-wide" style={{ color: '#212121' }}>
                {`${cabin.capacity} GUESTS · ${cabin.bedrooms} BEDROOM${cabin.bedrooms > 1 ? 'S' : ''} · ${cabin.bathrooms} BATHROOM${cabin.bathrooms > 1 ? 'S' : ''} · ${cabin.name?.en?.toUpperCase() || 'JACUZZI'} · SAUNA`}
              </h1>

              {/* Quick Amenities Icons Row */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 mb-4 sm:mb-6 text-xs sm:text-sm text-gray-700">
                <div className="flex items-center gap-1 sm:gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                  </svg>
                  <span className="font-medium">WIFI</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="font-medium">BEDROOM</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="font-medium">WASHER</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                  <span className="font-medium">PRIVATE SAUNA</span>
                </div>
              </div>

              {/* Description */}
              <p className="font-heading font-medium leading-relaxed text-[14px] sm:text-[16px] mb-6 sm:mb-8" style={{ color: '#212121' }}>
                {cabin.description?.en || cabin.shortDescription?.en || 'Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry. Lorem Ipsum Has Been The Industry\'s Standard Dummy Text Ever Since The 1500s, When An Unknown Printer Took A Galley Of Type And Scrambled It To Make A Type Specimen Book. It Has Survived Not Only Five Centuries, But Also The Leap Into Electronic Typesetting, Remaining Essentially Unchanged. It Was Popularised In The 1960s With The Release Of Letraset Sheets Containing Lorem Ipsum Passages, And...'}
              </p>
            </div>

            {/* Amenities Section Component */}
            <AmenitiesSection />

            {/* Extra Services Section Component */}
            <ExtraServicesSection />

            {/* Sleeping Areas Section Component */}
            <SleepingAreasSection />
            
          </div>

          {/* Right Column - Booking Panel Component */}
          <div>
            <BookingCard
              cabinName={cabin.name?.en || 'THE TUBE'}
              basePrice={cabin.basePrice}
              capacity={cabin.capacity}
            />
          </div>
        </div>
      </div>

      {/* Photo Gallery Modal Component */}
      <PhotoGalleryModal
        isOpen={showPhotoGallery}
        onClose={() => setShowPhotoGallery(false)}
        images={cabin.images || []}
        featuredImage={cabin.featuredImage}
      />
    </div>
  );
};

export default SingleCabinPage;
