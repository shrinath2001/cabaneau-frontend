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
    <div className="bg-white border border-gray-300 sticky top-0" style={{ width: '464px', height: '417px' }}>
      {/* Cabin Name and Price - Same Line with Background */}
      <div className="mb-6 flex items-center justify-between p-6" style={{ backgroundColor: '#F1FAF7' }}>
        <h2 className="font-heading font-medium text-[24px] uppercase" style={{ color: '#212121' }}>
          {cabinName}
        </h2>
        <p className="font-heading font-medium text-[24px]" style={{ color: '#37463A' }}>
          {basePrice}€/NIGHT
        </p>
      </div>

      <div className="space-y-4 p-5">
        {/* Arrival and Departure */}
        <div className="grid grid-cols-2 gap-3">
          <div className="border border-gray-300 p-3">
            <label className="text-xs text-gray-500 block mb-1 uppercase">Arrival</label>
            <input
              type="date"
              value={arrival}
              onChange={(e) => setArrival(e.target.value)}
              className="w-full outline-none text-sm"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="border border-gray-300 p-3 relative">
            <label className="text-xs text-gray-500 block mb-1 uppercase">Departure</label>
            <input
              type="date"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
              className="w-full outline-none text-sm"
              min={arrival || new Date().toISOString().split('T')[0]}
            />
            {/* Arrow between dates */}
            <div className="absolute left-[-16px] top-1/2 -translate-y-1/2 text-gray-400">
              →
            </div>
          </div>
        </div>

        {/* Guests Selector */}
        <div className="border border-gray-300 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Guests</span>
            <div className="flex items-center gap-4">
              <button
                onClick={handleGuestsDecrease}
                className="w-10 h-10 flex items-center justify-center bg-gray-300 text-white text-xl hover:bg-gray-400 disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={guests <= 1}
              >
                −
              </button>
              <span className="w-8 text-center font-medium">{guests}</span>
              <button
                onClick={handleGuestsIncrease}
                className="w-10 h-10 flex items-center justify-center bg-gray-300 text-white text-xl hover:bg-gray-400 disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={guests >= capacity}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Book Button */}
        <button
          onClick={handleBooking}
          className="w-full bg-[#5a6c5a] text-white py-4 text-sm font-bold tracking-wide hover:bg-[#4a5c4a] transition uppercase"
        >
          BOOK YOUR STAY
        </button>
      </div>
    </div>
  );
};

export default BookingCard;
