'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CabinCardProps {
  id?: number;
  slug?: string;
  images: string[];
  title: string;
  rating: number;
  area: string;
  capacity: string;
  availability: string;
  price: string;
}

const CabinCard: React.FC<CabinCardProps> = ({
  id,
  slug,
  images,
  title,
  rating,
  area,
  capacity,
  availability,
  price,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Debug: Log the slug being used
  console.log('CabinCard:', { title, slug, id, linkTo: `/cabins/${slug || id}` });

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="bg-white border p-[15px] border-black w-[380px] h-[491px] shrink-0 flex flex-col">
      {/* Image Section */}
      <div className="relative w-[350px] h-[232.9px] bg-gray-100">
        <Image
          src={images[currentImageIndex]}
          alt={title}
          fill
          style={{ objectFit: 'cover' }}
        />
        {/* Navigation Arrows */}
        <button
          onClick={prevImage}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center bg-white/80 hover:bg-white transition text-gray-700 text-sm"
          aria-label="Previous image"
        >
          &lt;
        </button>
        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center bg-white/80 hover:bg-white transition text-gray-700 text-sm"
          aria-label="Next image"
        >
          &gt;
        </button>

        {/* Carousel Dots */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setCurrentImageIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition ${
                index === currentImageIndex ? 'bg-orange-500' : 'bg-white/80'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className=" mt-4 flex flex-col justify-between flex-1">
        {/* Title and Rating */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-jost text-2xl font-medium text-black">{title}</h3>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`w-6 h-6 ${i < rating ? 'text-orange-500' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.929 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>

        {/* Info Row with Icons */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col gap-1 font-jost font-normal text-[16px]" style={{ color: '#5F5F5F' }}>
            <div className="flex items-center gap-1.5">
              <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>{area}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>{capacity}</span>
            </div>
          </div>

          {/* Amenity Icons */}
          <div className="flex gap-2 items-center">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9.5L12 4l9 5.5M12 4v17m-7-9l7 4.5 7-4.5" />
            </svg>
          </div>
        </div>

        {/* Availability and Price */}
        <div className="flex justify-between items-center mb-3">
          <span className="font-jost font-medium text-[16px] text-gray-600">Next Availability: <span className="text-black font-medium">{availability}</span></span>
          <span className="font-jost font-medium text-[24px]">{price}</span>
        </div>

        {/* Book Now Button */}
        <Link href={`/cabins/${slug || id}`} className="w-full">
          <button className="w-full py-2.5 px-4 border border-black text-black text-sm font-medium tracking-wider hover:bg-black hover:text-white transition-colors">
            BOOK NOW
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CabinCard;
