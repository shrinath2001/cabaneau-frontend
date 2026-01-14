'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useParams, useRouter, useSearchParams } from 'next/navigation';
import { FlagIcon, getLanguageDisplayName, getLanguageLabel } from './FlagIcon';
import { useTranslations } from '@/app/providers/TranslationsProvider';
import { locales, switchLocale, localizedPath, type Locale } from '@/app/lib/i18n';

interface Language {
  code: string;
  name: string;
  isDefault: boolean;
}

const Header2 = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [languages, setLanguages] = useState<Language[]>([]);
  const { t, locale } = useTranslations('navigation');
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Fetch languages from API
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch('/api/languages');
        if (response.ok) {
          const data: Language[] = await response.json();
          setLanguages(data);
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

  // Navigate to same page with different locale (preserving query params)
  const handleLanguageChange = (code: string) => {
    const newPath = switchLocale(pathname, code as Locale);
    const queryString = searchParams.toString();
    const fullPath = queryString ? `${newPath}?${queryString}` : newPath;
    setIsLanguageOpen(false);
    router.push(fullPath);
  };

  // Helper to create localized link
  const link = (path: string) => localizedPath(locale as Locale, path);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 md:px-8 lg:px-20">
        <div className="flex items-center justify-between py-6 md:py-8">
          <div className="flex items-center">
            <Link href={link('/')} scroll={true}>
              <Image
                src="/assets/Group 1 (1).png"
                alt="Cabaneau Logo"
                width={170}
                height={57}
                className="w-[130px] md:w-[170px] h-auto"
              />
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href={link('/cabins')} className="text-black font-heading font-medium text-[18px] hover:text-[#F49A4A] transition-colors uppercase">
              {t('link.our_cabins', 'Our Cabins')}
            </Link>
            <Link href={link('/activities')} className="text-black font-heading font-medium text-[18px] hover:text-[#F49A4A] transition-colors uppercase">
              {t('link.activities', 'Activities')}
            </Link>
            <Link href={link('/eat-drink')} className="text-black font-heading font-medium text-[18px] hover:text-[#F49A4A] transition-colors uppercase">
              {t('link.eat_drink', 'Eat & Drink')}
            </Link>
            <Link href={link('/blog')} className="text-black font-heading font-medium text-[18px] hover:text-[#F49A4A] transition-colors uppercase">
              {t('link.blog', 'Blog')}
            </Link>
          </nav>
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            <Link
              href={link('/gift-voucher')}
              className="text-white w-[134px] h-[50px] flex items-center justify-center font-heading font-medium text-sm bg-[#939D92] hover:bg-[#7d8d7d] transition uppercase"
            >
              {t('button.gift_voucher', 'Gift Voucher')}
            </Link>
            <Link
              href={link('/search')}
              className="bg-[#495D4D] text-white w-[134px] h-[50px] flex items-center justify-center font-heading font-medium text-sm hover:bg-[#3d5a3d] transition uppercase"
            >
              {t('button.book_now', 'Book Now')}
            </Link>
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="text-black flex items-center gap-2 font-heading font-medium text-sm hover:opacity-80 transition"
              >
                <FlagIcon code={locale} className="w-6 h-4" idSuffix="-h2-desktop" />
                <span>{getLanguageLabel(locale)}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2 font-heading text-sm ${
                        lang.code === locale ? 'bg-gray-50' : ''
                      }`}
                    >
                      <FlagIcon code={lang.code} className="w-6 h-4" idSuffix={`-h2-dd-${lang.code}`} />
                      {getLanguageDisplayName(lang.code)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="md:hidden flex items-center gap-3">
            {/* Book Now Button */}
            <Link
              href={link('/search')}
              className="bg-[#495D4D] text-white px-3 py-2 flex items-center justify-center font-heading font-medium text-xs hover:bg-[#3d5a3d] transition"
            >
              BOOK NOW
            </Link>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="text-black flex items-center gap-1 font-heading font-medium text-sm"
              >
                <FlagIcon code={locale} className="w-5 h-3" idSuffix="-h2-mobile-btn" />
                <span>{getLanguageLabel(locale)}</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Language Dropdown */}
              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2 font-heading text-sm ${
                        lang.code === locale ? 'bg-gray-50' : ''
                      }`}
                    >
                      <FlagIcon code={lang.code} className="w-5 h-3" idSuffix={`-h2-mob-${lang.code}`} />
                      {getLanguageDisplayName(lang.code)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Hamburger Button */}
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
        {/* Full Screen Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-white z-50" suppressHydrationWarning>
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between px-4 py-6 border-b border-gray-200">
              <Link href={link('/')} scroll={true} onClick={() => setIsMenuOpen(false)}>
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
                    <FlagIcon code={locale} className="w-5 h-3" idSuffix="-h2-mobile" />
                    <span>{getLanguageLabel(locale)}</span>
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
                            lang.code === locale ? 'bg-gray-50' : ''
                          }`}
                        >
                          <FlagIcon code={lang.code} className="w-5 h-3" idSuffix={`-h2-mob-dd-${lang.code}`} />
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
                href={link('/cabins')}
                onClick={() => setIsMenuOpen(false)}
                className="text-[#F49A4A] font-heading font-medium text-center py-4 border-b border-gray-200 text-[16px] tracking-wider uppercase"
              >
                {t('link.our_cabins', 'Our Cabins')}
              </Link>
              <Link
                href={link('/activities')}
                onClick={() => setIsMenuOpen(false)}
                className="text-[#495D4D] font-heading font-medium text-center py-4 text-[16px] tracking-wider uppercase"
              >
                {t('link.activities', 'Activities')}
              </Link>
              <Link
                href={link('/eat-drink')}
                onClick={() => setIsMenuOpen(false)}
                className="text-[#495D4D] font-heading font-medium text-center py-4 text-[16px] tracking-wider uppercase"
              >
                {t('link.eat_drink', 'Eat & Drink')}
              </Link>
              <Link
                href={link('/blog')}
                onClick={() => setIsMenuOpen(false)}
                className="text-[#495D4D] font-heading font-medium text-center py-4 text-[16px] tracking-wider uppercase"
              >
                {t('link.blog', 'Blog')}
              </Link>

              {/* Buttons */}
              <div className="mt-8 space-y-3">
                <Link
                  href={link('/gift-voucher')}
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-white text-center py-3 bg-[#939D92] hover:bg-[#7d8d7d] transition font-heading font-medium text-[14px] tracking-wider uppercase"
                >
                  {t('button.gift_voucher', 'Gift Voucher')}
                </Link>
                <Link
                  href={link('/search')}
                  onClick={() => setIsMenuOpen(false)}
                  className="block bg-[#495D4D] text-white text-center py-3 hover:bg-[#3d5a3d] transition font-heading font-medium text-[14px] tracking-wider uppercase"
                >
                  {t('button.book_now', 'Book Now')}
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header2;
