'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const SearchForm = () => {
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState('');
  const router = useRouter();

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSearch = () => {
    // Validate all required fields are filled
    if (!checkIn || !checkOut || !guests) {
      alert('Please fill in all fields: Check-in date, Check-out date, and Number of guests');
      return;
    }

    // Validate guests is a positive number
    const guestsNum = parseInt(guests, 10);
    if (isNaN(guestsNum) || guestsNum < 1) {
      alert('Please enter a valid number of guests (at least 1)');
      return;
    }

    // Build query parameters
    const params = new URLSearchParams();
    params.append('checkIn', formatDate(checkIn));
    params.append('checkOut', formatDate(checkOut));
    params.append('guests', guests);

    // Navigate to search page with search parameters
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="flex items-center bg-white/10 backdrop-blur-sm w-full max-w-[650px]">
      {/* Check-in Date Input */}
      <div className="flex items-center gap-3 px-6 py-4 flex-1 bg-white/20">
        <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <DatePicker
          selected={checkIn}
          onChange={(date) => setCheckIn(date)}
          placeholderText="Check-in"
          minDate={new Date()}
          className="bg-transparent text-white placeholder-white/90 outline-none font-jost text-[16px] w-full cursor-pointer"
          dateFormat="dd/MM/yyyy"
          popperClassName="date-picker-popper"
        />
      </div>

      {/* Check-out Date Input */}
      <div className="flex items-center gap-3 px-6 py-4 flex-1 bg-white/20">
        <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <DatePicker
          selected={checkOut}
          onChange={(date) => setCheckOut(date)}
          placeholderText="Check-out"
          minDate={checkIn || new Date()}
          className="bg-transparent text-white placeholder-white/90 outline-none font-jost text-[16px] w-full cursor-pointer"
          dateFormat="dd/MM/yyyy"
          popperClassName="date-picker-popper"
        />
      </div>

      {/* Guests Input */}
      <div className="flex items-center gap-3 px-6 py-4 flex-1 bg-white/20">
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <input
          type="number"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          placeholder="Total People"
          min="1"
          className="bg-transparent text-white placeholder-white/90 outline-none font-jost text-[16px] w-full"
        />
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="bg-[#495D4D] px-8 py-4 hover:bg-[#3d5a3d] transition"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </div>
  );
};

export default SearchForm;
