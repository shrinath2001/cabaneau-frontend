'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Header2 = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'de'>('en');

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
            <Link href="/cabins" className="text-black font-heading font-medium hover:font-semibold hover:text-orange-300 text-[18px] space-x-0.5 ">
              OUR CABINS
            </Link>
            <Link href="/activities" className="text-black font-heading font-medium hover:font-semibold hover:text-orange-300 text-[18px] space-x-0.5">
              ACTIVITIES
            </Link>
            <Link href="/eat-drink" className="text-black font-heading font-medium hover:font-semibold hover:text-orange-300 text-[18px] space-x-0.5">
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
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="text-black flex items-center gap-2 font-heading font-medium text-sm hover:opacity-80 transition"
              >
                {selectedLanguage === 'en' ? (
                  <>
                    <svg className="w-6 h-4" viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
                      <clipPath id="s2"><path d="M0,0 v30 h60 v-30 z"/></clipPath>
                      <clipPath id="t2"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>
                      <g clipPath="url(#s2)">
                        <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
                        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
                        <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t2)" stroke="#C8102E" strokeWidth="4"/>
                        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
                        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
                      </g>
                    </svg>
                    <span>EN</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-4" viewBox="0 0 5 3" xmlns="http://www.w3.org/2000/svg">
                      <rect width="5" height="3" y="0" x="0" fill="#000"/>
                      <rect width="5" height="2" y="1" x="0" fill="#D00"/>
                      <rect width="5" height="1" y="2" x="0" fill="#FFCE00"/>
                    </svg>
                    <span>DE</span>
                  </>
                )}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <button
                    onClick={() => {
                      setSelectedLanguage('en');
                      setIsLanguageOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2 font-heading text-sm"
                  >
                    <svg className="w-6 h-4" viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
                      <clipPath id="s3"><path d="M0,0 v30 h60 v-30 z"/></clipPath>
                      <clipPath id="t3"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>
                      <g clipPath="url(#s3)">
                        <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
                        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
                        <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t3)" stroke="#C8102E" strokeWidth="4"/>
                        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
                        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
                      </g>
                    </svg>
                    English
                  </button>
                  <button
                    onClick={() => {
                      setSelectedLanguage('de');
                      setIsLanguageOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2 font-heading text-sm"
                  >
                    <svg className="w-6 h-4" viewBox="0 0 5 3" xmlns="http://www.w3.org/2000/svg">
                      <rect width="5" height="3" y="0" x="0" fill="#000"/>
                      <rect width="5" height="2" y="1" x="0" fill="#D00"/>
                      <rect width="5" height="1" y="2" x="0" fill="#FFCE00"/>
                    </svg>
                    Deutsch
                  </button>
                </div>
              )}
            </div>
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
