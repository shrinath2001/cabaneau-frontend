'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
    alert(`Booking request submitted for ${cabin?.name.en}!\nArrival: ${arrival}\nDeparture: ${departure}\nGuests: ${guests}`);
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back to cabins link */}
      <div className="mb-6">
        <Link href="/cabins" className="flex items-center text-gray-600 hover:text-gray-900 text-sm">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          BACK TO ALL CABINES
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images and Details */}
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          <div className="grid grid-cols-2 gap-2 mb-8">
            {/* Main featured image */}
            <div className="col-span-2 relative h-[400px]">
              <Image
                src={cabin.featuredImage}
                alt={`${cabin.name.en} - main view`}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            {/* Additional images */}
            {cabin.images.slice(0, 4).map((image, index) => (
              <div key={index} className="relative h-48">
                <Image
                  src={image}
                  alt={`${cabin.name.en} - view ${index + 2}`}
                  fill
                  style={{ objectFit: 'cover' }}
                />
                {/* Show all pictures button on last image */}
                {index === 3 && cabin.images.length > 4 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <button className="bg-white px-4 py-2 text-sm font-medium">
                      SHOW ALL PICTURES
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Cabin Title and Basic Info */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-4 uppercase">
              {cabin.name.en}
            </h1>
            <div className="text-lg font-semibold mb-4">
              {`${cabin.capacity} GUESTS · ${cabin.bedrooms} BEDROOM${cabin.bedrooms > 1 ? 'S' : ''} · ${cabin.bathrooms} BATHROOM${cabin.bathrooms > 1 ? 'S' : ''}`}
              {cabin.squareMeters && ` · ${cabin.squareMeters}m²`}
            </div>

            {/* Quick Amenities Icons */}
            <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
                <span>WIFI</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>BEDROOM</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>WASHER</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
                <span>PRIVATE SAUNA</span>
              </div>
            </div>

            {/* Description */}
            {(cabin.description?.en || cabin.shortDescription?.en) && (
              <p className="text-gray-700 leading-relaxed mb-6">
                {cabin.description?.en || cabin.shortDescription?.en}
              </p>
            )}
          </div>

          {/* What This Cabin Offers */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">WHAT THIS CABIN OFFERS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>KITCHEN</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
                <span>WIFI</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                <span>FREE PARKING ON PREMISES</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
                <span>PRIVATE SAUNA</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>TV</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>WASHER</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>PRIVATE PATIO OR BALCONY</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
                <span>AIR CONDITIONING</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <span>DRYER</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>BACKYARD</span>
              </div>
            </div>

            <button className="mt-6 px-6 py-3 border border-gray-800 text-sm font-medium hover:bg-gray-100 transition">
              SHOW ALL 60 AMENITIES
            </button>
          </div>

          {/* Location */}
          {cabin.address && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">LOCATION</h2>
              <div className="text-gray-700">
                <p>{cabin.address}</p>
                <p>{cabin.postalCode} {cabin.city}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Booking Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 border border-gray-300 p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold">{cabin.name.en}</h2>
              <p className="text-2xl font-semibold mt-2">£{cabin.basePrice}/NIGHT</p>
            </div>

            <div className="space-y-4">
              {/* Arrival and Departure */}
              <div className="grid grid-cols-2 gap-2">
                <div className="border p-3">
                  <label className="text-xs text-gray-600">ARRIVAL</label>
                  <input
                    type="date"
                    value={arrival}
                    onChange={(e) => setArrival(e.target.value)}
                    className="w-full outline-none"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="border p-3">
                  <label className="text-xs text-gray-600">DEPARTURE</label>
                  <input
                    type="date"
                    value={departure}
                    onChange={(e) => setDeparture(e.target.value)}
                    className="w-full outline-none"
                    min={arrival || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {/* Guests Selector */}
              <div className="border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Guests</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleGuestsDecrease}
                      className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100 disabled:opacity-30"
                      disabled={guests <= 1}
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{guests}</span>
                    <button
                      onClick={handleGuestsIncrease}
                      className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100 disabled:opacity-30"
                      disabled={guests >= cabin.capacity}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Booking Notes */}
              <div className="border p-3">
                <textarea
                  className="w-full outline-none text-sm"
                  rows={3}
                  placeholder="LOREM IPSUM DOLOR SIT AMET CONSECTETUR."
                />
              </div>

              {/* Book Button */}
              <button
                onClick={handleBooking}
                className="w-full bg-[#495D4D] text-white py-3 text-sm font-medium hover:bg-[#3d5a3d] transition"
              >
                BOOK YOUR STAY
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCabinPage;
