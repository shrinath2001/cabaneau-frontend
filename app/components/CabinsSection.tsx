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
      <section className="bg-white py-5 mt-12">
        <div className="w-full">
          <div className="max-w-full mx-auto pl-20">
            {/* Header with Title and Navigation */}
            <div className="flex justify-center items-center mb-16 relative">
              <h2 className="font-logga text-[40px] font-semibold text-center">
                OUR CABINES
              </h2>

              {/* Navigation Arrows - Only show if more than 3 cabins */}
              {cabins.length > 3 && (
                <div className="absolute right-0 flex gap-2 mr-16">
                  <button
                    onClick={scrollLeft}
                    className="w-10 h-10 rounded-full border-2 border-[#F0E8C6] bg-white flex items-center justify-center hover:bg-[#F0E8C6] transition-all duration-300 text-[#F0E8C6] hover:text-white"
                    aria-label="Scroll to previous cabin"
                  >
                    <svg className="w-5 h-4" fill="currentColor" viewBox="0 0 20 16">
                      <path d="M20 7H6L11 2L9.5 0.5L0.5 8L9.5 15.5L11 14L6 9H20V7Z" />
                    </svg>
                  </button>
                  <button
                    onClick={scrollRight}
                    className="w-10 h-10 rounded-full border-2 border-[#495D4D] bg-white flex items-center justify-center hover:bg-[#495D4D] transition-all duration-300 text-[#495D4D] hover:text-white"
                    aria-label="Scroll to next cabin"
                  >
                    <svg className="w-5 h-4" fill="currentColor" viewBox="0 0 20 16">
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
              ) : cabins.length > 3 ? (
                // Carousel layout for more than 3 cabins (shows 3.5 cards)
                <div
                  ref={scrollContainerRef}
                  className="flex gap-[19.42px] overflow-x-auto no-scrollbar py-4"
                   style={{ scrollSnapType: 'x mandatory' }}
                >
                  {cabins.map((cabin) => (
                    <div key={cabin.id} style={{ scrollSnapAlign: 'start' }}>
                      <CabinCard {...cabin} />
                    </div>
                  ))}
                </div>
              ) : (
                // Centered layout for 3 or fewer cabins
                <div className="flex gap-[19.42px] justify-center py-4">
                  {cabins.map((cabin) => (
                    <div key={cabin.id}>
                      <CabinCard {...cabin} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Discover All Button */}
            <div className="text-center mt-10 mb-8">
              <button className="px-8 py-3 bg-[#495D4D] text-white text-lg font-heading font-medium tracking-widest hover:bg-[#2d4a2d] transition-colors">
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
