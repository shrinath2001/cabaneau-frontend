'use client';
import { useRef, useState, useEffect } from 'react';
import CabinCard from './CabinCard';

const CabinsSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [cabins, setCabins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCabins = async () => {
      try {
        console.log('Fetching cabins from API...');
        const response = await fetch('/api/cabins', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Data received:', data);

        // Transform API data to match CabinCard props
        const transformedCabins = data.data.map((cabin: any) => ({
          id: parseInt(cabin.lodgifyId),
          images: cabin.images.length > 0 ? cabin.images : [cabin.featuredImage],
          title: cabin.name || 'Luxury Cabin',
          rating: 5, // Default rating
          area: cabin.squareMeters ? `${cabin.squareMeters}m²` : 'TBA',
          capacity: `${cabin.capacity || 2} Person${cabin.capacity > 1 ? 's' : ''}`,
          availability: 'Available Now', // Default availability
          price: cabin.basePrice ? `$${cabin.basePrice.toFixed(2)}` : 'Coming Soon'
        }));

        setCabins(transformedCabins);
      } catch (error) {
        console.error('❌ Error fetching cabins:', error);
        console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchCabins();
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400; // Card width (380px) + gap (20px)
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400; // Card width (380px) + gap (20px)
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <section className="bg-white py-5 px-20">
        <div className="container mx-auto">
          <div className="max-w-[1390px] mx-auto">
            {/* Header with Title and Navigation */}
            <div className="flex justify-center items-center mb-10 relative">
              <h2 className="font-logga text-[40px] font-semibold text-center">
                OUR CABINES
              </h2>

              {/* Navigation Arrows */}
              <div className="absolute right-0 flex gap-2">
                <button
                  onClick={scrollLeft}
                  className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition text-gray-600"
                  aria-label="Scroll to previous cabin"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={scrollRight}
                  className="w-10 h-10 rounded-full border-2 border-gray-800 flex items-center justify-center hover:bg-gray-800 hover:text-white transition text-gray-800"
                  aria-label="Scroll to next cabin"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Cabins Carousel */}
            <div className="w-full overflow-hidden">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">Loading cabins...</p>
                </div>
              ) : (
                <div
                  ref={scrollContainerRef}
                  className="flex gap-[19.42px] overflow-x-auto no-scrollbar pb-4"
                  style={{ scrollSnapType: 'x mandatory' }}
                >
                  {cabins.map((cabin) => (
                    <div key={cabin.id} style={{ scrollSnapAlign: 'start' }}>
                      <CabinCard {...cabin} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Discover All Button */}
            <div className="text-center mt-10">
              <button className="px-8 py-3 bg-[#3d5a3d] text-white text-sm font-medium tracking-widest hover:bg-[#2d4a2d] transition-colors">
                DISCOVER ALL CABINES
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CabinsSection;
