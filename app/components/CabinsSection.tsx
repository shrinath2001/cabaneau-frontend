'use client';
import React, { useRef } from 'react';
import CabinCard from './CabinCard';

const cabins = [
  {
    imageSrc: '/assets/d206536ef067f64b29cad184324fe360bb763e30.jpg',
    title: 'TUBE',
    rating: 5,
    area: '35m2',
    capacity: '2-4 Persons',
    availability: '30/12',
    price: '$300.00',
  },
  {
    imageSrc: '/assets/d206536ef067f64b29cad184324fe360bb763e30.jpg',
    title: 'WIWAXY',
    rating: 4,
    area: '40m2',
    capacity: '2-6 Persons',
    availability: '28/12',
    price: '$350.00',
  },
  {
    imageSrc: '/assets/d206536ef067f64b29cad184324fe360bb763e30.jpg',
    title: 'GARDNER',
    rating: 5,
    area: '30m2',
    capacity: '2-3 Persons',
    availability: '25/12',
    price: '$280.00',
  },
  {
    imageSrc: '/assets/d206536ef067f64b29cad184324fe360bb763e30.jpg',
    title: 'TUBE',
    rating: 5,
    area: '35m2',
    capacity: '2-4 Persons',
    availability: '30/12',
    price: '$300.00',
  },
  {
    imageSrc: '/assets/d206536ef067f64b29cad184324fe360bb763e30.jpg',
    title: 'TUBE',
    rating: 5,
    area: '35m2',
    capacity: '2-4 Persons',
    availability: '30/12',
    price: '$300.00',
  },
];

const CabinsSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth < 640 ? scrollContainerRef.current.clientWidth : 344;
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth < 640 ? scrollContainerRef.current.clientWidth : 344;
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
        <div className="container mx-auto ">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-normal font-custom text-center grow">OUR CABINES</h2>
            <div className="flex space-x-2">
              <button
                onClick={scrollLeft}
                className="p-2 rounded-4xl text-yellow-200 border-2 border-yellow-200 hover:bg-gray-100"
              >
                {'<'}
              </button>
              <button
                onClick={scrollRight}
                className="p-2 rounded-4xl text-green-900 border-2 border-green-900 hover:bg-gray-100"
              >
                {'>'}
              </button>
            </div>
          </div>
          <div className="w-full max-w-[1192px] mx-auto">
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto space-x-6 pb-8 no-scrollbar"
            >
              {cabins.map((cabin, index) => (
                <CabinCard key={index} {...cabin} />
              ))}
            </div>
          </div>
          <div className="text-center mt-8">
            <button className="py-3 px-6 bg-green-800 text-white  hover:bg-green-700 transition-colors">
              DISCOVER ALL CABINES
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default CabinsSection;
