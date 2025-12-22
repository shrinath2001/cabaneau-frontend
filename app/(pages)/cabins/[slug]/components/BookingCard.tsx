'use client';

import { useState } from 'react';

interface BookingCardProps {
  cabinName: string;
  basePrice: number;
  capacity: number;
}

const BookingCard = ({ cabinName, basePrice, capacity }: BookingCardProps) => {
  const [arrival, setArrival] = useState('');
  const [departure, setDeparture] = useState('');
  const [guests, setGuests] = useState(1);

  const handleGuestsIncrease = () => {
    if (guests < capacity) {
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

    console.log('Booking details:', { cabinName, arrival, departure, guests });
    alert(`Booking request submitted for ${cabinName}!\nArrival: ${arrival}\nDeparture: ${departure}\nGuests: ${guests}`);
  };

  return (
    <div className="bg-white border-2 border-gray-300 w-full md:w-[464px] md:sticky md:top-0 md:overflow-y-auto" style={{ maxHeight: 'calc(100vh - 100px)' }}>
      {/* Cabin Name - Top Section */}
      <div className="px-6 py-4 border-b border-gray-300">
        <h2 className="font-jost font-medium text-[18px] md:text-[20px] uppercase text-gray-800">
          {cabinName}
        </h2>
      </div>

      <div className="p-4 md:p-6 space-y-4">
        {/* Mobile Version - Simplified */}
        <div className="md:hidden space-y-4">
          {/* Arrival and Departure Row with Guest Counter */}
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 text-sm uppercase text-gray-600 font-medium">
              <span>ARRIVAL</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <span>DEPARTURE</span>
            </div>

            {/* Guest Counter - Right Side */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleGuestsDecrease}
                className="w-8 h-8 flex items-center justify-center bg-[#939D92] text-white text-lg hover:bg-[#7d8d7d] disabled:opacity-30 disabled:cursor-not-allowed transition"
                disabled={guests <= 1}
                aria-label="Decrease guests"
              >
                −
              </button>
              <span className="w-8 text-center font-medium text-sm">{guests}</span>
              <button
                onClick={handleGuestsIncrease}
                className="w-8 h-8 flex items-center justify-center bg-[#939D92] text-white text-lg hover:bg-[#7d8d7d] disabled:opacity-30 disabled:cursor-not-allowed transition"
                disabled={guests >= capacity}
                aria-label="Increase guests"
              >
                +
              </button>
            </div>
          </div>

          {/* Book Button with Price */}
          <div className="flex items-stretch gap-0">
            <button
              onClick={handleBooking}
              className="flex-1 bg-[#495D4D] text-white py-3 px-6 text-sm font-bold tracking-wide hover:bg-[#3d5a3d] transition uppercase font-jost"
            >
              BOOK YOUR STAY
            </button>
            <div className="bg-white border-2 border-[#495D4D] px-4 flex items-center justify-center">
              <span className="font-jost font-medium text-sm text-gray-800 whitespace-nowrap">
                {basePrice}€/NIGHT
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Version - Full Form */}
        <div className="hidden md:block space-y-4">
          {/* Date Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1 uppercase">Arrival</label>
              <input
                type="date"
                value={arrival}
                onChange={(e) => setArrival(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#495D4D] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1 uppercase">Departure</label>
              <input
                type="date"
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#495D4D] text-sm"
              />
            </div>
          </div>

          {/* Guest Counter */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 uppercase">Guests</span>
            <div className="flex items-center gap-3">
              <button
                onClick={handleGuestsDecrease}
                className="w-10 h-10 flex items-center justify-center bg-[#939D92] text-white text-lg hover:bg-[#7d8d7d] disabled:opacity-30 disabled:cursor-not-allowed transition"
                disabled={guests <= 1}
                aria-label="Decrease guests"
              >
                −
              </button>
              <span className="w-10 text-center font-medium">{guests}</span>
              <button
                onClick={handleGuestsIncrease}
                className="w-10 h-10 flex items-center justify-center bg-[#939D92] text-white text-lg hover:bg-[#7d8d7d] disabled:opacity-30 disabled:cursor-not-allowed transition"
                disabled={guests >= capacity}
                aria-label="Increase guests"
              >
                +
              </button>
            </div>
          </div>

          {/* Price Display */}
          <div className="border-t border-gray-300 pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-jost font-medium text-base text-gray-800">Price per night</span>
              <span className="font-jost font-bold text-lg text-gray-800">{basePrice}€</span>
            </div>
          </div>

          {/* Book Button */}
          <button
            onClick={handleBooking}
            className="w-full bg-[#495D4D] text-white py-4 px-6 text-base font-bold tracking-wide hover:bg-[#3d5a3d] transition uppercase font-jost"
          >
            BOOK YOUR STAY
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
