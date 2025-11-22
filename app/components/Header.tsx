'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    <div
      className="relative bg-cover bg-center h-[859px]"
      style={{
        backgroundImage:
          "url(/assets/d206536ef067f64b29cad184324fe360bb763e30.jpg)",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <header className="bg-transparent absolute top-0 left-0 w-full z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link href="/" passHref>
                <Image
                  src="/assets/Group 1.png"
                  alt="Cabaneau Logo"
                  width={150}
                  height={50}
                />
              </Link>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/cabins" className="font-jost font-semibold text-[18px]" style={{ color: '#FFFFFF9C' }}>
                OUR CABINS
              </Link>
              <Link href="/activities" className="font-jost font-semibold text-[18px]" style={{ color: '#FFFFFF9C' }}>
                ACTIVITIES
              </Link>
              <Link href="/eat-drink" className="font-jost font-semibold text-[18px]" style={{ color: '#FFFFFF9C' }}>
                EAT & DRINK
              </Link>
            </nav>
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/gift-voucher"
                className="text-white w-[134px] h-[50px] flex items-center justify-center font-medium text-sm bg-[#939D92] hover:bg-[#7d8d7d] transition"
              >
                GIFT VOUCHER
              </Link>
              <Link
                href="/book-now"
                className="bg-[#495D4D] text-white w-[134px] h-[50px] flex items-center justify-center font-medium text-sm hover:bg-[#3d5a3d] transition"
              >
                BOOK NOW
              </Link>
            </div>
            <div className="md:hidden">
              <button
                className="text-white"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    className={isMenuOpen ? 'hidden' : 'block'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={'M4 6h16M4 12h16m-7 6h7'}
                  />
                  <path
                    className={isMenuOpen ? 'block' : 'hidden'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={'M6 18L18 6M6 6l12 12'}
                  />
                </svg>
              </button>
            </div>
          </div>
          <div
            className={`md:hidden mt-4 ${isMenuOpen ? 'block' : 'hidden'}`}
          >
            <nav className="flex flex-col space-y-4">
              <Link href="/cabins" className="text-white">
                OUR CABINS
              </Link>
              <Link href="/activities" className="text-white">
                ACTIVITIES
              </Link>
              <Link href="/eat-drink" className="text-white">
                EAT & DRINK
              </Link>
              <Link
                href="/gift-voucher"
                className="text-white border border-white px-4 py-2 rounded-md text-center"
              >
                GIFT VOUCHER
              </Link>
              <Link
                href="/book-now"
                className="bg-green-500 text-white px-4 py-2 rounded-md text-center"
              >
                BOOK NOW
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
        <p className="font-jost font-normal text-[18px] uppercase mb-4" style={{ letterSpacing: '0.15px' }}>Luxury Cabines with Private Wellness</p>
        <h1 className="font-logga font-normal text-[68px] uppercase leading-tight">Sleep, <span className="text-customyellow">Eat & Relax</span></h1>
        <h2 className="font-logga font-normal text-[68px] uppercase mb-12">Above the Trees</h2>

        {/* Search Form */}
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
      </div>
    </div>
  );
};

export default Header;
