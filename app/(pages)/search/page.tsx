'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CabinCard from '@/app/components/CabinCard';

interface SearchCabin {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  capacity: number;
  bedrooms: number;
  bathrooms: number;
  basePrice: number;
  featuredImage: string;
  images: string[];
  lodgifyId?: string;
}

interface SearchResponse {
  cabins: SearchCabin[];
  searchParams: Record<string, unknown>;
  total: number;
}

function SearchResults() {
  const searchParams = useSearchParams();
  const [cabins, setCabins] = useState<SearchCabin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const guests = searchParams.get('guests');

  useEffect(() => {
    const fetchCabins = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query string
        const params = new URLSearchParams();
        if (checkIn) params.append('checkIn', checkIn);
        if (checkOut) params.append('checkOut', checkOut);
        if (guests) params.append('guests', guests);

        const response = await fetch(`/api/cabins/search?${params.toString()}`);

        if (!response.ok) {
          throw new Error('Failed to search cabins');
        }

        const data: SearchResponse = await response.json();
        setCabins(data.cabins);
        setTotal(data.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching cabins:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCabins();
  }, [checkIn, checkOut, guests]);

  // Format date for display
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <main>
      <div className="container mx-auto px-4 py-16">
        {/* Search Info Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-4">Search Results</h1>
          {(checkIn || checkOut || guests) && (
            <div className="text-center text-gray-600 font-jost">
              {checkIn && checkOut && (
                <p className="text-lg">
                  {formatDate(checkIn)} - {formatDate(checkOut)}
                </p>
              )}
              {guests && (
                <p className="text-lg mt-1">
                  {guests} {parseInt(guests) === 1 ? 'Guest' : 'Guests'}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-16">
            <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-md inline-block">
              <p className="font-medium">Error loading cabins</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && !error && (
          <>
            {cabins.length > 0 ? (
              <>
                <p className="text-center text-gray-600 mb-8 font-jost text-lg">
                  Found {total} {total === 1 ? 'cabin' : 'cabins'} available
                </p>
                <div className="flex flex-wrap justify-center gap-8">
                  {cabins.map((cabin) => (
                    <CabinCard
                      key={cabin.id}
                      slug={cabin.slug}
                      images={cabin.images.length > 0 ? cabin.images : [cabin.featuredImage]}
                      title={cabin.name}
                      rating={5} // Default rating since API doesn't provide it
                      area={`${cabin.bedrooms} Bedroom${cabin.bedrooms > 1 ? 's' : ''}`}
                      capacity={`${cabin.capacity} Guest${cabin.capacity > 1 ? 's' : ''}`}
                      availability={checkIn ? formatDate(checkIn) : 'Available'}
                      price={`£${cabin.basePrice}`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <div className="mb-4">
                  <svg
                    className="mx-auto h-24 w-24 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-medium text-gray-900 mb-2">No cabins found</h3>
                <p className="text-gray-600">
                  Try adjusting your search dates or number of guests to see more results.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
