'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';

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

  // Booking form state
  const [arrival, setArrival] = useState('');
  const [departure, setDeparture] = useState('');
  const [guests, setGuests] = useState(1);

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
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCabin();
    }
  }, [slug]);

  const handleGuestsIncrease = () => {
    if (cabin && guests < cabin.capacity) {
      setGuests(guests + 1);
    }
  };

  const handleGuestsDecrease = () => {
    if (guests > 1) {
      setGuests(guests - 1);
    }
  };

  const handleBooking = () => {
    if (!arrival || !departure) {
      alert('Please select arrival and departure dates');
      return;
    }

    const arrivalDate = new Date(arrival);
    const departureDate = new Date(departure);

    if (departureDate <= arrivalDate) {
      alert('Departure date must be after arrival date');
      return;
    }

    console.log('Booking details:', { slug, arrival, departure, guests });
    alert(`Booking request submitted for ${cabin?.name?.en || 'cabin'}!\nArrival: ${arrival}\nDeparture: ${departure}\nGuests: ${guests}`);
  };

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

  // Prepare 5 images: use available images and fill rest with placeholders
  const allImages = cabin.images && cabin.images.length > 0 ? [...cabin.images] : [];
  if (cabin.featuredImage && !allImages.includes(cabin.featuredImage)) {
    allImages.unshift(cabin.featuredImage);
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
    <div className="bg-white min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Back to cabins link */}
        <div className="mb-6">
          <Link href="/cabins" className="flex items-center text-gray-700 hover:text-black text-sm font-medium">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            BACK TO ALL CABINES
          </Link>
        </div>

        {/* FULL WIDTH IMAGE GALLERY - Exactly as in Image #2 */}
        <div className="grid grid-cols-[60fr_40fr] gap-2 mb-8 h-[520px]">
          {/* Large main image - LEFT SIDE, full height */}
          <div className="relative h-full bg-gray-200">
            <img
              src={displayImages[0]}
              alt="Cabin view 1"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23cccccc"/%3E%3C/svg%3E';
              }}
            />
          </div>

          {/* RIGHT SIDE - 2x2 Grid of smaller images */}
          <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full">
            {/* Top left */}
            <div className="relative bg-gray-200">
              <img
                src={displayImages[1]}
                alt="Cabin view 2"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23cccccc"/%3E%3C/svg%3E';
                }}
              />
            </div>

            {/* Top right */}
            <div className="relative bg-gray-200">
              <img
                src={displayImages[2]}
                alt="Cabin view 3"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23cccccc"/%3E%3C/svg%3E';
                }}
              />
            </div>

            {/* Bottom left */}
            <div className="relative bg-gray-200">
              <img
                src={displayImages[3]}
                alt="Cabin view 4"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23cccccc"/%3E%3C/svg%3E';
                }}
              />
            </div>

            {/* Bottom right with "SHOW ALL PICTURES" button */}
            <div className="relative bg-gray-200">
              <img
                src={displayImages[4]}
                alt="Cabin view 5"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23cccccc"/%3E%3C/svg%3E';
                }}
              />
              {/* Show all pictures button - always visible in bottom right corner */}
              <div className="absolute bottom-4 right-4">
                <button className="bg-white px-6 py-3 text-sm font-semibold hover:bg-gray-50 transition shadow-lg border border-gray-200">
                  SHOW ALL PICTURES
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT SECTION BELOW IMAGES */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 mt-8">
          {/* Left Column - Cabin Details */}
          <div>

            {/* Cabin Details Title */}
            <div className="mb-6">
              <h1 className="text-[22px] font-bold mb-4 uppercase tracking-wide">
                {`${cabin.capacity} GUESTS · ${cabin.bedrooms} BEDROOM${cabin.bedrooms > 1 ? 'S' : ''} · ${cabin.bathrooms} BATHROOM${cabin.bathrooms > 1 ? 'S' : ''} · ${cabin.name?.en?.toUpperCase() || 'JACUZZI'} · SAUNA`}
              </h1>

              {/* Quick Amenities Icons Row */}
              <div className="flex items-center gap-6 mb-6 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                  </svg>
                  <span className="font-medium">WIFI</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="font-medium">BEDROOM</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="font-medium">WASHER</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                  <span className="font-medium">PRIVATE SAUNA</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 leading-relaxed text-[15px] mb-8">
                {cabin.description?.en || cabin.shortDescription?.en || 'Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry. Lorem Ipsum Has Been The Industry\'s Standard Dummy Text Ever Since The 1500s, When An Unknown Printer Took A Galley Of Type And Scrambled It To Make A Type Specimen Book. It Has Survived Not Only Five Centuries, But Also The Leap Into Electronic Typesetting, Remaining Essentially Unchanged. It Was Popularised In The 1960s With The Release Of Letraset Sheets Containing Lorem Ipsum Passages, And...'}
              </p>
            </div>

            {/* What This Cabin Offers */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-6 uppercase tracking-wide">WHAT THIS CABIN OFFERS</h2>
              <div className="grid grid-cols-2 gap-x-16 gap-y-4">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="text-sm font-medium">KITCHEN</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                  </svg>
                  <span className="text-sm font-medium">WIFI</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  <span className="text-sm font-medium">FREE PARKING ON PREMISES</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                  <span className="text-sm font-medium">PRIVATE SAUNA</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium">TV</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="text-sm font-medium">WASHER</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <span className="text-sm font-medium">DRYER</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="text-sm font-medium">PRIVATE PATIO OR BALCONY</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                  <span className="text-sm font-medium">AIR CONDITIONING</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="text-sm font-medium">BACKYARD</span>
                </div>
              </div>

              <button className="mt-8 px-6 py-3 bg-gray-400 text-white text-sm font-semibold hover:bg-gray-500 transition">
                SHOW ALL 60 AMENITIES
              </button>
            </div>
          </div>

          {/* Right Column - Booking Panel */}
          <div>
            <div className="bg-white border border-gray-300 p-6 sticky top-8">
              <div className="mb-6">
                <h2 className="text-xl font-bold uppercase mb-1">{cabin.name?.en || 'THE TUBE'}</h2>
                <p className="text-2xl font-bold">{cabin.basePrice}€/NIGHT</p>
              </div>

              <div className="space-y-4">
                {/* Arrival and Departure */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-gray-300 p-3">
                    <label className="text-xs text-gray-500 block mb-1 uppercase">Arrival</label>
                    <input
                      type="date"
                      value={arrival}
                      onChange={(e) => setArrival(e.target.value)}
                      className="w-full outline-none text-sm"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="border border-gray-300 p-3 relative">
                    <label className="text-xs text-gray-500 block mb-1 uppercase">Departure</label>
                    <input
                      type="date"
                      value={departure}
                      onChange={(e) => setDeparture(e.target.value)}
                      className="w-full outline-none text-sm"
                      min={arrival || new Date().toISOString().split('T')[0]}
                    />
                    {/* Arrow between dates */}
                    <div className="absolute left-[-16px] top-1/2 -translate-y-1/2 text-gray-400">
                      →
                    </div>
                  </div>
                </div>

                {/* Guests Selector */}
                <div className="border border-gray-300 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Guests</span>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={handleGuestsDecrease}
                        className="w-10 h-10 flex items-center justify-center bg-gray-300 text-white text-xl hover:bg-gray-400 disabled:opacity-30 disabled:cursor-not-allowed"
                        disabled={guests <= 1}
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-medium">{guests}</span>
                      <button
                        onClick={handleGuestsIncrease}
                        className="w-10 h-10 flex items-center justify-center bg-gray-300 text-white text-xl hover:bg-gray-400 disabled:opacity-30 disabled:cursor-not-allowed"
                        disabled={guests >= cabin.capacity}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Booking Notes */}
                <div className="border border-gray-300 p-3">
                  <textarea
                    className="w-full outline-none text-sm text-gray-400 resize-none"
                    rows={3}
                    placeholder="LOREM IPSUM DOLOR SIT AMET CONSECTETUR."
                  />
                </div>

                {/* Book Button */}
                <button
                  onClick={handleBooking}
                  className="w-full bg-[#5a6c5a] text-white py-4 text-sm font-bold tracking-wide hover:bg-[#4a5c4a] transition uppercase"
                >
                  BOOK YOUR STAY
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCabinPage;
