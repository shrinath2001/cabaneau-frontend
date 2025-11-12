'use client';

import React from 'react';
import { cabins } from '@/app/data/cabins';
import { useParams } from 'next/navigation';

const SingleCabinPage = () => {
  const params = useParams();
  const cabin = cabins.find((c) => c.id === parseInt(params.id as string, 10));

  if (!cabin) {
    return <div>Cabin not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <a href="/cabins" className="text-gray-500 hover:text-gray-700">
          &larr; BACK TO ALL CABINES
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 row-span-2">
              <img src={cabin.images[0]} alt={cabin.title} className="w-full h-full object-cover" />
            </div>
            <img src={cabin.images[1]} alt={cabin.title} className="w-full h-full object-cover" />
            <img src={cabin.images[2]} alt={cabin.title} className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="border p-4">
            <h2 className="text-2xl font-bold">{cabin.title}</h2>
            <p className="text-xl">{cabin.price}/NIGHT</p>
            <div className="mt-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input type="text" placeholder="Arrival" className="border p-2" />
                <input type="text" placeholder="Departure" className="border p-2" />
              </div>
              <div className="flex items-center justify-between border p-2">
                <span>Guests</span>
                <div className="flex items-center">
                  <button className="px-2">-</button>
                  <span>1</span>
                  <button className="px-2">+</button>
                </div>
              </div>
            </div>
            <button className="w-full bg-green-800 text-white py-2 mt-4">BOOK YOUR STAY</button>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-2xl font-bold">{`${cabin.guests} GUESTS - ${cabin.bedrooms} BEDROOM - ${cabin.bathrooms} BATHROOM - ${cabin.features.join(' - ')}`}</h3>
        <div className="flex space-x-4 mt-4">
          {cabin.amenities.wifi && <span>✔️ Wifi</span>}
          {cabin.amenities.bedroom && <span>✔️ Bedroom</span>}
          {cabin.amenities.washer && <span>✔️ Washer</span>}
          {cabin.amenities.privateSauna && <span>✔️ Private Sauna</span>}
        </div>
        <p className="mt-4 text-gray-600">{cabin.description}</p>
      </div>
      <div className="mt-8">
        <h3 className="text-2xl font-bold">WHAT THIS CABIN OFFERS</h3>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {cabin.offers.map((offer, index) => (
            <div key={index}>✔️ {offer}</div>
          ))}
        </div>
        <div className="mt-4">
          <button className="border border-gray-400 px-4 py-2">SHOW ALL {cabin.offers.length} AMENITIES</button>
        </div>
      </div>
    </div>
  );
};

export default SingleCabinPage;
