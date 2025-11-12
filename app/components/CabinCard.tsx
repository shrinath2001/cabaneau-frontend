'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

interface CabinCardProps {
  id: number;
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
  images,
  title,
  rating,
  area,
  capacity,
  availability,
  price,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
    <Link href={`/cabins/${id}`} passHref className="group">
      <div className="bg-white shadow-md overflow-hidden w-full sm:w-[380px] shrink-0 border border-black p-4 h-[492px] flex flex-col justify-between cursor-pointer hover:opacity-75 transition-opacity">
        <div className="relative h-48">
          <Image src={images[currentImageIndex]} alt={title} layout="fill" objectFit="cover" />
          <div className="absolute inset-0 flex items-center justify-between p-2">
            <button
              onClick={prevImage}
              className="bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75 transition"
            >
              {'<'}
            </button>
            <button
              onClick={nextImage}
              className="bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75 transition"
            >
              {'>'}
            </button>
          </div>
        </div>
        <div className="py-4 flex flex-col justify-between flex-grow">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-2xl font-heading font-medium">{title}</h3>
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.929 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          <div className="flex justify-between text-sm font-heading font-normal text-black mb-4">
            <div>
              <p className="flex items-center mb-1">
                <span className="mr-2">✔️</span> {area}
              </p>
              <p className="flex items-center">
                <span className="mr-2">✔️</span> {capacity}
              </p>
            </div>
            <div className="flex space-x-2 text-black-500">
              <span>🏠</span>
              <span>👥</span>
              <span>🚿</span>
            </div>
          </div>
          <div className="flex justify-between items-center mb-4">
            <p className="flex items-center">
              <span className="mr-2">🗓️</span> Next Availability: {availability}
            </p>
            <span className="text-2xl font-medium font-heading text-gray-800">{price}</span>
          </div>
          <button className="w-full py-2 px-4 border border-green-800 group-hover:border-white text-green-800 group-hover:bg-orange-400 group-hover:text-white transition-colors">
            BOOK NOW
          </button>
        </div>
      </div>
    </Link>
  );
};
export default CabinCard;