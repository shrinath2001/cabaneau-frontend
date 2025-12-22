'use client';
import { useRef, useState, useEffect } from 'react';
import CabinCard from './CabinCard';
import { cabins as staticCabins } from '@/app/data/cabins';

interface CabinData {
  id: number;
  slug: string;
  images: string[];
  title: string;
  rating: number;
  area: string;
  capacity: string;
  availability: string;
  price: string;
}

const CabinsSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [cabins, setCabins] = useState<CabinData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Using static cabin data directly (API server needs to be revamped)
    const loadCabins = () => {
      const cabinData: CabinData[] = staticCabins.map((cabin) => ({
        id: cabin.id,
        slug: `cabin-${cabin.id}`,
        images: cabin.images,
        title: cabin.title,
        rating: cabin.rating,
        area: cabin.area,
        capacity: cabin.capacity,
        availability: cabin.availability,
        price: cabin.price
      }));

      setCabins(cabinData);
      setLoading(false);
    };

    loadCabins();

    // TODO: Re-enable API integration once server is revamped
    // const fetchCabins = async () => {
    //   try {
    //     const response = await fetch('/api/cabins');
    //     const data = await response.json();
    //     if (data?.data && Array.isArray(data.data)) {
    //       const transformedCabins = data.data.map((cabin) => ({...}));
    //       setCabins(transformedCabins);
    //     }
    //   } catch (error) {
    //     console.error('Error fetching cabins:', error);
    //   }
    // };
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
      <section className="bg-white py-6 md:py-5 md:mt-12 px-4 md:px-0">
        <div className="w-full">
          <div className="max-w-full mx-auto md:pl-20">
            {/* Header with Title and Navigation */}
            <div className="flex justify-center items-center mb-8 md:mb-16 relative">
              <h2 className="font-logga text-[20px] md:text-[40px] font-semibold text-center">
                OUR CABINES
              </h2>

              {/* Navigation Arrows - Show on mobile and desktop when more than 1 cabin */}
              {cabins.length > 1 && (
                <div className="absolute right-0 flex gap-1.5 md:gap-2 mr-4 md:mr-16">
                  <button
                    onClick={scrollLeft}
                    className="w-8 h-8 md:w-12 md:h-12 rounded-full border-2 border-[#F0E8C6] bg-white flex items-center justify-center hover:bg-[#F0E8C6] transition-all duration-300 text-[#F0E8C6] hover:text-white"
                    aria-label="Scroll to previous cabin"
                  >
                    <svg className="w-3 h-2.5 md:w-5 md:h-4" fill="currentColor" viewBox="0 0 20 16">
                      <path d="M20 7H6L11 2L9.5 0.5L0.5 8L9.5 15.5L11 14L6 9H20V7Z" />
                    </svg>
                  </button>
                  <button
                    onClick={scrollRight}
                    className="w-8 h-8 md:w-12 md:h-12 rounded-full border-2 border-[#495D4D] bg-white flex items-center justify-center hover:bg-[#495D4D] transition-all duration-300 text-[#495D4D] hover:text-white"
                    aria-label="Scroll to next cabin"
                  >
                    <svg className="w-3 h-2.5 md:w-5 md:h-4" fill="currentColor" viewBox="0 0 20 16">
                      <path d="M0 7H14L9 2L10.5 0.5L19.5 8L10.5 15.5L9 14L14 9H0V7Z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Cabins Carousel or Centered Grid */}
            <div className="w-full">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">Loading cabins...</p>
                </div>
              ) : cabins.length > 1 ? (
                // Carousel layout - shows 1 card on mobile (centered), 3.5 cards on desktop
                <div className="relative">
                  <div
                    ref={scrollContainerRef}
                    className="flex gap-[19.42px] overflow-x-auto no-scrollbar py-4 justify-start md:justify-start"
                    style={{ scrollSnapType: 'x mandatory' }}
                  >
                    {/* Add padding to center the first card on mobile */}
                    <div className="flex-shrink-0 w-[calc((100%-380px)/2)] md:w-0"></div>
                    {cabins.map((cabin) => (
                      <div key={cabin.id} className="flex-shrink-0" style={{ scrollSnapAlign: 'center' }}>
                        <CabinCard {...cabin} />
                      </div>
                    ))}
                    {/* Add padding to center the last card on mobile */}
                    <div className="flex-shrink-0 w-[calc((100%-380px)/2)] md:w-0"></div>
                  </div>
                </div>
              ) : (
                // Single cabin - centered
                <div className="flex justify-center py-4">
                  {cabins.map((cabin) => (
                    <div key={cabin.id}>
                      <CabinCard {...cabin} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Discover All Button */}
            <div className="text-center mt-6 md:mt-10 mb-6 md:mb-8">
              <button className="px-8 py-3 bg-[#495D4D] text-white text-base md:text-lg font-heading font-medium tracking-widest hover:bg-[#2d4a2d] transition-colors">
                DISCOVER ALL CABINESS
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CabinsSection;
