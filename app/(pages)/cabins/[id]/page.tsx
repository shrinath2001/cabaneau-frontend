'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cabins } from '@/app/data/cabins';
import { useParams, notFound } from 'next/navigation';

const SingleCabinPage = () => {
  const params = useParams();

  // Validate ID parameter
  const cabinId = parseInt(params.id as string, 10);
  if (isNaN(cabinId)) {
    notFound();
  }

  const cabin = cabins.find((c) => c.id === cabinId);

  if (!cabin) {
    notFound();
  }

  // Booking form state
  const [arrival, setArrival] = useState('');
  const [departure, setDeparture] = useState('');
  const [guests, setGuests] = useState(1);

  const handleGuestsIncrease = () => {
    if (guests < cabin.guests) {
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

    // Here you would typically send the booking data to your backend
    console.log('Booking details:', { cabinId, arrival, departure, guests });
    alert(`Booking request submitted for ${cabin.title}!\nArrival: ${arrival}\nDeparture: ${departure}\nGuests: ${guests}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/cabins" className="text-gray-500 hover:text-gray-700">
          &larr; BACK TO ALL CABINS
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 row-span-2 relative h-96">
              <Image src={cabin.images[0]} alt={`${cabin.title} - main view`} fill style={{ objectFit: 'cover' }} />
            </div>
            <div className="relative h-48">
              <Image src={cabin.images[1]} alt={`${cabin.title} - view 2`} fill style={{ objectFit: 'cover' }} />
            </div>
            <div className="relative h-48">
              <Image src={cabin.images[2]} alt={`${cabin.title} - view 3`} fill style={{ objectFit: 'cover' }} />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="border p-4">
            <h2 className="text-2xl font-bold">{cabin.title}</h2>
            <p className="text-xl">{cabin.price}/NIGHT</p>
            <div className="mt-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="date"
                  value={arrival}
                  onChange={(e) => setArrival(e.target.value)}
                  className="border p-2"
                  aria-label="Arrival date"
                  min={new Date().toISOString().split('T')[0]}
                />
                <input
                  type="date"
                  value={departure}
                  onChange={(e) => setDeparture(e.target.value)}
                  className="border p-2"
                  aria-label="Departure date"
                  min={arrival || new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="flex items-center justify-between border p-2">
                <span>Guests</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleGuestsDecrease}
                    className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={guests <= 1}
                    aria-label="Decrease guests"
                  >
                    -
                  </button>
                  <span className="min-w-[2rem] text-center">{guests}</span>
                  <button
                    onClick={handleGuestsIncrease}
                    className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={guests >= cabin.guests}
                    aria-label="Increase guests"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={handleBooking}
              className="w-full bg-green-800 text-white py-2 mt-4 hover:bg-green-700 transition-colors"
            >
              BOOK YOUR STAY
            </button>
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
