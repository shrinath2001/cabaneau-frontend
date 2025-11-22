'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Header2 = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-6">
          <div className="flex items-center">
            <Link href="/" passHref>
              <Image
                src="/assets/Group 1 (1).png"
                alt="Cabaneau Logo"
                width={150}
                height={50}
              />
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/cabins" className="text-black">
              OUR CABINS
            </Link>
            <Link href="/activities" className="text-black">
              ACTIVITIES
            </Link>
            <Link href="/eat-drink" className="text-black">
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
              className="text-black"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                suppressHydrationWarning
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
                  suppressHydrationWarning
                />
              </svg>
            </button>
          </div>
        </div>
        <div className={`md:hidden mt-4 ${isMenuOpen ? 'block' : 'hidden'}`} suppressHydrationWarning>
          <nav className="flex flex-col space-y-4">
            <Link href="/cabins" className="text-black">
              OUR CABINS
            </Link>
            <Link href="/activities" className="text-black">
              ACTIVITIES
            </Link>
            <Link href="/eat-drink" className="text-black">
              EAT & DRINK
            </Link>
            <Link
              href="/gift-voucher"
              className="text-white border border-white px-4 py-2 rounded-md text-center bg-[#939D92] hover:bg-[#7d8d7d] transition"
            >
              GIFT VOUCHER
            </Link>
            <Link
              href="/book-now"
              className="bg-[#495D4D] text-white px-4 py-2 rounded-md text-center hover:bg-[#3d5a3d] transition"
            >
              BOOK NOW
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header2;
