'use client';
import { useRef } from 'react';
import CabinCard from './CabinCard';
import { cabins } from '@/app/data/cabins';

const CabinsSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
