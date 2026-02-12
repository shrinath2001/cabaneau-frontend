'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import LodgifyBookingWidget from './LodgifyBookingWidget';
import { FlagIcon, getLanguageDisplayName, getLanguageLabel } from './FlagIcon';
import { useTranslations } from '@/app/providers/TranslationsProvider';
import { locales, switchLocale, localizedPath, type Locale } from '@/app/lib/i18n';
import { setLanguage } from '@/app/lib/language';

interface Language {
  code: string;
  name: string;
  isDefault: boolean;
}

interface HeroSettings {
  backgroundType: string;
  backgroundUrl: string;
  overlayColor: string;
  overlayOpacity: number;
}

const Header = ({ heroSettings: initialHeroSettings }: { heroSettings?: HeroSettings }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [languages, setLanguages] = useState<Language[]>([]);
  const { t, locale } = useTranslations('navigation');
  const { t: tHome } = useTranslations('homepage');
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();


  // Hero section settings (SSR for mobile video autoplay)
  const [heroSettings, setHeroSettings] = useState<{
    backgroundType: string;
    backgroundUrl: string;
    overlayColor: string;
    overlayOpacity: number;
  } | null>(initialHeroSettings || null);

  // Scroll to top when homepage loads (fixes SPA navigation scroll issue)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  // Hero settings come from server component for SSR (enables mobile video autoplay)
  // Fallback: fetch client-side if not provided
  useEffect(() => {
    if (initialHeroSettings) return;
    const fetchHeroSettings = async () => {
      try {
        const response = await fetch('/api/hero-section');
        if (response.ok) {
          const data = await response.json();
          setHeroSettings(data);
        }
      } catch (error) {
        console.error('Failed to fetch hero settings:', error);
      }
    };
    fetchHeroSettings();
  }, [initialHeroSettings]);

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
    setLanguage(code);
    setIsLanguageOpen(false);
    router.push(fullPath);
  };

  // Helper to create localized link
  const link = (path: string) => localizedPath(locale as Locale, path);

  return (
    <div
      className="relative bg-cover bg-center h-screen md:h-[859px] overflow-hidden"
      style={heroSettings?.backgroundType === 'video' && heroSettings?.backgroundUrl ? {} : {
        backgroundImage: heroSettings?.backgroundUrl
          ? `url(${heroSettings.backgroundUrl})`
          : "url(/assets/d206536ef067f64b29cad184324fe360bb763e30.jpg)",
      }}
    >
      {heroSettings?.backgroundType === 'video' && heroSettings?.backgroundUrl && (
        <video
          ref={(el) => {
            // Force autoplay on mobile - browsers may ignore the autoPlay attribute
            if (el) {
              el.muted = true;
              el.play().catch(() => {});
            }
          }}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src={heroSettings.backgroundUrl} type="video/mp4" />
        </video>
      )}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          backgroundColor: heroSettings?.overlayColor || '#000000',
          opacity: heroSettings?.overlayOpacity != null ? heroSettings.overlayOpacity / 100 : 0.5,
        }}
      ></div>
      <header className="bg-transparent absolute left-0 w-full z-20" style={{ top: 'var(--promo-banner-height, 0px)' }}>
        {/* Container: match Header2 padding (px-4) */}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Link href={link('/')}>
                {/* Logo: 150x50 (feat branch) | Revert to: width={170} height={57} className="w-[130px] md:w-[170px] h-auto" */}
                <Image
                  src="/assets/Group 1.png"
                  alt="Cabaneau Logo"
                  width={150}
                  height={50}
                />
              </Link>
            </div>
            {/* Nav spacing: space-x-10 lg:space-x-12 (PreFinal UI) | Revert to: space-x-8 */}
            <nav className="hidden md:flex items-center space-x-10 lg:space-x-12">
              <Link href={link('/cabins')} className="font-heading font-medium text-[18px] text-white hover:text-[#F49A4A] transition-colors uppercase">
                {t('link.our_cabins', 'Our Cabins')}
              </Link>
              <Link href={link('/activities')} className="font-heading font-medium text-[18px] text-white hover:text-[#F49A4A] transition-colors uppercase">
                {t('link.activities', 'Activities')}
              </Link>
              <Link href={link('/eat-drink')} className="font-heading font-medium text-[18px] text-white hover:text-[#F49A4A] transition-colors uppercase">
                {t('link.eat_drink', 'Eat & Drink')}
              </Link>
              <Link href={link('/blog')} className="font-heading font-medium text-[18px] text-white hover:text-[#F49A4A] transition-colors uppercase">
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
                  className="text-white flex items-center gap-2 font-heading font-medium text-sm hover:opacity-80 transition"
                >
                  <FlagIcon code={locale} className="w-6 h-4" idSuffix="-home-desktop" />
                  <span>{getLanguageLabel(locale)}</span>
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
                          lang.code === locale ? 'bg-gray-50' : ''
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
            <div className="md:hidden flex items-center gap-3">
              {/* Book Now Button */}
              <Link
                href={link('/search')}
                className="bg-white text-[#495D4D] px-3 py-2 flex items-center justify-center font-heading font-medium text-xs hover:bg-gray-100 transition uppercase"
              >
                {t('button.book_now', 'Book Now')}
              </Link>

              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                  className="text-white flex items-center gap-1 font-heading font-medium text-sm"
                >
                  <FlagIcon code={locale} className="w-5 h-3" idSuffix="-home-mobile-btn" />
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
                        <FlagIcon code={lang.code} className="w-5 h-3" idSuffix={`-home-mob-${lang.code}`} />
                        {getLanguageDisplayName(lang.code)}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Hamburger Button */}
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
                <Link href={link('/')} onClick={() => setIsMenuOpen(false)}>
                  <img
                    src="/assets/cabaneau-logo-dark.svg"
                    alt="Cabaneau Logo"
                    width={150}
                    height={50}
                  />
                </Link>
                <div className="flex items-center gap-4">
                  {/* Language Selector */}
                  <div className="relative">
                    <button
                      onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                      className="flex items-center gap-1 font-heading font-medium text-sm"
                    >
                      <FlagIcon code={locale} className="w-5 h-3" idSuffix="-home-mobile" />
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
                  href={link('/cabins')}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[#F49A4A] font-heading font-medium text-center py-4 text-[16px] tracking-wider uppercase"
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
      <div className="absolute inset-0 flex flex-col items-center justify-start md:justify-center text-white text-center px-6 md:px-4 z-10 mt-[180px] md:mt-0 pt-6 md:pt-0 pb-16 md:pb-0">
        <p className="font-jost font-normal text-[15px] md:text-[24px] uppercase mb-3 md:mb-6" style={{ letterSpacing: '0.15px' }}>{tHome('hero.subtitle', 'Luxury Cabines with Private Wellness')}</p>
        <h1 className="font-logga font-normal text-[32px] md:text-[68px] uppercase leading-tight mb-1 md:mb-2">{tHome('hero.title_sleep', 'Sleep,')} <span className="text-customyellow">{tHome('hero.title_highlight', 'Eat & Relax')}</span></h1>
        <h2 className="font-logga font-normal text-[32px] md:text-[68px] uppercase mb-6 md:mb-16">{tHome('hero.title_above', 'Above the Trees')}</h2>

        {/* Lodgify Search Widget - handles all booking rules */}
        <LodgifyBookingWidget languageCode={locale} />
      </div>
      {/* Marker element for scroll detection */}
      <div id="header-scroll-marker" className="absolute bottom-0 h-1 w-full"></div>
    </div>
  );
};

export default Header;
