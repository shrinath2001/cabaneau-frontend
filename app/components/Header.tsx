'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import LodgifyBookingWidget from './LodgifyBookingWidget';
import { FlagIcon, getLanguageDisplayName, getLanguageLabel } from './FlagIcon';

interface Language {
  code: string;
  name: string;
  isDefault: boolean;
}

const STORAGE_KEY = 'cabaneau_language';
const DEFAULT_LANGUAGE = 'en';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(DEFAULT_LANGUAGE);
  const [languages, setLanguages] = useState<Language[]>([]);

  // Scroll to top when homepage loads (fixes SPA navigation scroll issue)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch languages from API and restore from localStorage
  useEffect(() => {
    // Restore saved language preference
    const savedLang = localStorage.getItem(STORAGE_KEY);
    if (savedLang) {
      setSelectedLanguage(savedLang);
    }

    // Fetch available languages
    const fetchLanguages = async () => {
      try {
        const response = await fetch('/api/languages');
        if (response.ok) {
          const data: Language[] = await response.json();
          setLanguages(data);
          // If no saved language, use default from API
          if (!savedLang) {
            const defaultLang = data.find(l => l.isDefault);
            if (defaultLang) {
              setSelectedLanguage(defaultLang.code);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch languages:', error);
        // Fallback languages if API fails
        setLanguages([
          { code: 'en', name: 'English', isDefault: true },
          { code: 'fr', name: 'French', isDefault: false },
          { code: 'de', name: 'German', isDefault: false },
          { code: 'nl', name: 'Dutch', isDefault: false },
        ]);
      }
    };

    fetchLanguages();
  }, []);

  // Save language to localStorage when changed
  const handleLanguageChange = (code: string) => {
    setSelectedLanguage(code);
    localStorage.setItem(STORAGE_KEY, code);
    setIsLanguageOpen(false);
  };

  // Get current language object
  const currentLanguage = languages.find(l => l.code === selectedLanguage) || { code: selectedLanguage, name: selectedLanguage, isDefault: false };

  return (
    <div
      className="relative bg-cover bg-center h-screen md:h-[859px]"
      style={{
        backgroundImage:
          "url(/assets/d206536ef067f64b29cad184324fe360bb763e30.jpg)",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
      <header className="bg-transparent absolute top-0 left-0 w-full z-20">
        <div className="container mx-auto ">
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
              <Link href="/cabins" className="font-heading font-medium text-[18px]" style={{ color: '#FFFFFF9C' }}>
                OUR CABINS
              </Link>
              <Link href="/activities" className="font-heading font-medium text-[18px]" style={{ color: '#FFFFFF9C' }}>
                ACTIVITIES
              </Link>
              <Link href="/eat-drink" className="font-heading font-medium text-[18px]" style={{ color: '#FFFFFF9C' }}>
                EAT & DRINK
              </Link>
            </nav>
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/gift-voucher"
                className="text-white w-[134px] h-[50px] flex items-center justify-center font-heading font-medium text-sm bg-[#939D92] hover:bg-[#7d8d7d] transition"
              >
                GIFT VOUCHER
              </Link>
              <Link
                href="/book-now"
                className="bg-[#495D4D] text-white w-[134px] h-[50px] flex items-center justify-center font-heading font-medium text-sm hover:bg-[#3d5a3d] transition"
              >
                BOOK NOW
              </Link>
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                  className="text-white flex items-center gap-2 font-heading font-medium text-sm hover:opacity-80 transition"
                >
                  <FlagIcon code={selectedLanguage} className="w-6 h-4" idSuffix="-home-desktop" />
                  <span>{getLanguageLabel(selectedLanguage)}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isLanguageOpen && (
                  <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg py-1 z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2 font-heading text-sm ${
                          lang.code === selectedLanguage ? 'bg-gray-50' : ''
                        }`}
                      >
                        <FlagIcon code={lang.code} className="w-6 h-4" idSuffix={`-home-dd-${lang.code}`} />
                        {getLanguageDisplayName(lang.code)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
          {/* Full Screen Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden fixed inset-0 bg-white z-50">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between px-4 py-6 border-b border-gray-200">
                <Link href="/" onClick={() => setIsMenuOpen(false)}>
                  <Image
                    src="/assets/Group 1 (1).png"
                    alt="Cabaneau Logo"
                    width={120}
                    height={40}
                  />
                </Link>
                <div className="flex items-center gap-4">
                  {/* Language Selector */}
                  <div className="relative">
                    <button
                      onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                      className="flex items-center gap-1 font-heading font-medium text-sm"
                    >
                      <FlagIcon code={selectedLanguage} className="w-5 h-3" idSuffix="-home-mobile" />
                      <span>{getLanguageLabel(selectedLanguage)}</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Language Dropdown */}
                    {isLanguageOpen && (
                      <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2 font-heading text-sm ${
                              lang.code === selectedLanguage ? 'bg-gray-50' : ''
                            }`}
                          >
                            <FlagIcon code={lang.code} className="w-5 h-3" idSuffix={`-home-mob-dd-${lang.code}`} />
                            {getLanguageDisplayName(lang.code)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-600 hover:text-gray-900"
                    aria-label="Close menu"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Mobile Menu Content */}
              <nav className="flex flex-col px-4 pt-8">
                <Link
                  href="/cabins"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[#F49A4A] font-heading font-medium text-center py-4 border-b border-gray-200 text-[16px] tracking-wider"
                >
                  OUR CABINS
                </Link>
                <Link
                  href="/activities"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[#495D4D] font-heading font-medium text-center py-4 text-[16px] tracking-wider"
                >
                  ACTIVITIES
                </Link>
                <Link
                  href="/eat-drink"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[#495D4D] font-heading font-medium text-center py-4 text-[16px] tracking-wider"
                >
                  EAT & DRINK
                </Link>

                {/* Buttons */}
                <div className="mt-8 space-y-3">
                  <Link
                    href="/gift-voucher"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-white text-center py-3 bg-[#939D92] hover:bg-[#7d8d7d] transition font-heading font-medium text-[14px] tracking-wider"
                  >
                    GIFT VOUCHER
                  </Link>
                  <Link
                    href="/book-now"
                    onClick={() => setIsMenuOpen(false)}
                    className="block bg-[#495D4D] text-white text-center py-3 hover:bg-[#3d5a3d] transition font-heading font-medium text-[14px] tracking-wider"
                  >
                    BOOK NOW
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4 md:px-4 z-10 pt-12 md:pt-0">
        <p className="font-jost font-normal text-[12px] uppercase mb-2 md:mb-4" style={{ letterSpacing: '0.15px' }}>Luxury Cabines with Private Wellness</p>
        <h1 className="font-logga font-normal text-[32px] md:text-[68px] uppercase leading-tight">Sleep, <span className="text-customyellow">Eat & Relax</span></h1>
        <h2 className="font-logga font-normal text-[32px] md:text-[68px] uppercase mb-4 md:mb-12">Above the Trees</h2>

        {/* Lodgify Search Widget - handles all booking rules */}
        <LodgifyBookingWidget languageCode={selectedLanguage} />
      </div>
      {/* Marker element for scroll detection */}
      <div id="header-scroll-marker" className="absolute bottom-0 h-1 w-full"></div>
    </div>
  );
};

export default Header;
