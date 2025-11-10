'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div
      className="relative bg-cover bg-center min-h-screen"
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
              <Link href="/cabins" className="text-white font-heading text-lg ">
                OUR CABINS
              </Link>
              <Link href="/activities" className="text-white font-heading text-lg">
                ACTIVITIES
              </Link>
              <Link href="/eat-drink" className="text-white font-heading text-lg">
                EAT & DRINK
              </Link>
            </nav>
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/gift-voucher"
                className="text-white px-5 py-3.5 font-heading text-md bg-button1"
              >
                GIFT VOUCHER
              </Link>
              <Link
                href="/book-now"
                className="bg-customgreen text-white px-5 py-3.5"
              >
                BOOK NOW
              </Link>
            </div>
            <div className="md:hidden">
              <button
                className="text-white"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
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
              <Link href="/cabins" className="text-.white">
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
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
        <p className="text-lg font-heading uppercase">Luxury Cabines with Private Wellness</p>
        <h1 className="text-7xl font-custom uppercase">Sleep, <span className="text-customyellow">Eat & Relax</span></h1>
        <h2 className="text-7xl font-custom uppercase">Above Trees</h2>
      </div>
    </div>
  );
};

export default Header;
