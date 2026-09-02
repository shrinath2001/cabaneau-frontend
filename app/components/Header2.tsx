'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useParams, useRouter } from 'next/navigation';
import { FlagIcon, getLanguageDisplayName, getLanguageLabel } from './FlagIcon';
import { useTranslations } from '@/app/providers/TranslationsProvider';
import { locales, switchLocale, localizedPath, type Locale } from '@/app/lib/i18n';
import { setLanguage } from '@/app/lib/language';

interface Language {
  code: string;
  name: string;
  isDefault: boolean;
}

interface Cabin {
  id: string;
  slug: string;
  name: string;
}

const Header2 = ({
  languages: initialLanguages,
  cabins: initialCabins,
}: {
  languages?: Language[];
  cabins?: Cabin[];
} = {}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isCabinsOpen, setIsCabinsOpen] = useState(false);
  const [isMobileCabinsOpen, setIsMobileCabinsOpen] = useState(false);
  const [languages, setLanguages] = useState<Language[]>(initialLanguages || []);
  const [cabins, setCabins] = useState<Cabin[]>(initialCabins || []);
  const { t, locale } = useTranslations('navigation');
  const pathname = usePathname();
  const router = useRouter();

  // Languages and cabins come from the server component parent for SSR (see
  // app/lib/nav.ts) so the nav dropdowns render real links on first paint.
  // Fallback: fetch client-side only if not provided.
  useEffect(() => {
    if (initialLanguages) return;
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
  }, [initialLanguages]);

  useEffect(() => {
    if (initialCabins) return;
    const fetchCabins = async () => {
      try {
        const response = await fetch('/api/cabins');
        if (response.ok) {
          const data = await response.json();
          const list = Array.isArray(data) ? data : (data?.data ?? []);
          setCabins(list);
        }
      } catch (error) {
        console.error('Failed to fetch cabins:', error);
      }
    };
    fetchCabins();
  }, [initialCabins]);

  // Navigate to same page with different locale (preserving query params)
  const handleLanguageChange = (code: string) => {
    const newPath = switchLocale(pathname, code as Locale);
    const queryString = window.location.search.slice(1);
    const fullPath = queryString ? `${newPath}?${queryString}` : newPath;
    setLanguage(code);
    setIsLanguageOpen(false);
    router.push(fullPath);
  };

  // Helper to create localized link
  const link = (path: string) => localizedPath(locale as Locale, path);

  // Check if a nav link is active (current page)
  const isActive = (path: string) => {
    const localizedHref = link(path);
    // Check if pathname starts with the link path (handles sub-pages like /cabins/slug)
    return pathname === localizedHref || pathname.startsWith(localizedHref + '/');
  };

  // Home link, preserving search params when coming from search or cabin
  // pages. Starts as the plain path (matches what the server renders, so
  // there's no hydration mismatch) and is enhanced with the query string
  // client-side after mount - reading window.location directly rather than
  // useSearchParams(), which forces this whole header (real, crawlable nav
  // markup) into Next's CSR-bailout fallback when the route is statically
  // generated, since search params can't be resolved at prerender time.
  const [homeLink, setHomeLink] = useState(() => link('/'));
  useEffect(() => {
    const basePath = link('/');
    if (pathname.includes('/search') || pathname.includes('/cabins/')) {
      const queryString = window.location.search.slice(1);
      if (queryString) {
        setHomeLink(`${basePath}?${queryString}`);
        return;
      }
    }
    setHomeLink(basePath);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, locale]);

  return (
    <header
      className="fixed left-0 w-full z-50 bg-white shadow-md"
      style={{ top: 'var(--promo-banner-height, 0px)' }}
    >
      {/* Container: wider layout (px-4 only) | Revert to: px-4 md:px-8 lg:px-20 */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <Link href={homeLink} scroll={true}>
              {/* Logo: 150x50 (feat branch) | Revert to: width={170} height={57} className="w-[130px] md:w-[170px] h-auto" */}
              <Image
                src="/assets/cabaneau-logo-dark.svg"
                alt="Cabaneau Logo"
                width={150}
                height={50}
              />
            </Link>
          </div>
          {/* Nav spacing: space-x-10 lg:space-x-12 (PreFinal UI) | Revert to: space-x-8 */}
          <nav className="hidden lg:flex items-center space-x-10 lg:space-x-12">
            {/* Nav hover: hover:font-semibold hover:text-orange-300 (feat branch) | Revert to: hover:text-[#F49A4A] transition-colors */}
            <div
              className="relative"
              onMouseEnter={() => setIsCabinsOpen(true)}
              onMouseLeave={() => setIsCabinsOpen(false)}
            >
              <button
                onClick={() => {
                  setIsCabinsOpen(false);
                  // Inner pages have no cabins section - go to the one on the homepage.
                  router.push(`${link('/')}#our-cabins`);
                }}
                className={`font-heading font-medium text-[18px] hover:text-[#F49A4A] transition-colors uppercase flex items-center gap-1 ${isActive('/cabins') ? 'text-[#F49A4A]' : 'text-[#495D4D]'}`}
              >
                {t('link.our_cabins', 'Our Cabins')}
                <svg className={`w-4 h-4 transition-transform ${isCabinsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isCabinsOpen && (
                <div className="absolute left-0 mt-0 w-56 bg-white shadow-lg py-1 z-50 border border-gray-100">
                  {cabins.map((cabin) => (
                    <Link
                      key={cabin.id}
                      href={link(`/cabins/${cabin.slug}`)}
                      className="block px-4 py-2.5 text-[#495D4D] hover:bg-gray-50 hover:text-[#F49A4A] font-heading text-sm uppercase tracking-wide"
                    >
                      {cabin.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link href={link('/activities')} className={`font-heading font-medium text-[18px] hover:text-[#F49A4A] transition-colors uppercase ${isActive('/activities') ? 'text-[#F49A4A]' : 'text-[#495D4D]'}`}>
              {t('link.activities', 'Activities')}
            </Link>
            <Link href={link('/eat-drink')} className={`font-heading font-medium text-[18px] hover:text-[#F49A4A] transition-colors uppercase ${isActive('/eat-drink') ? 'text-[#F49A4A]' : 'text-[#495D4D]'}`}>
              {t('link.eat_drink', 'Eat & Drink')}
            </Link>
            <Link href={link('/blog')} className={`font-heading font-medium text-[18px] hover:text-[#F49A4A] transition-colors uppercase ${isActive('/blog') ? 'text-[#F49A4A]' : 'text-[#495D4D]'}`}>
              {t('link.blog', 'Blog')}
            </Link>
          </nav>
          <div className="hidden lg:flex items-center space-x-3 lg:space-x-4">
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
                className="text-[#495D4D] flex items-center gap-2 font-heading font-medium text-sm hover:opacity-80 transition"
              >
                <FlagIcon code={locale} className="w-6 h-4" idSuffix="-h2-desktop" />
                <span>{getLanguageLabel(locale)}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white shadow-lg py-1 z-50 border border-gray-200">
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
          <div className="lg:hidden flex items-center gap-3">
            {/* Book Now Button */}
            <Link
              href={link('/search')}
              className="bg-[#495D4D] text-white px-3 py-2 flex items-center justify-center font-heading font-medium text-xs hover:bg-[#3d5a3d] transition uppercase"
            >
              {t('button.book_now', 'Book Now')}
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
                <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg py-1 z-50 border border-gray-200">
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
          <div className="lg:hidden fixed left-0 right-0 bottom-0 bg-white z-[100]" style={{ top: 'var(--promo-banner-height, 0px)' }} suppressHydrationWarning>
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between px-4 py-6 border-b border-gray-200">
              <Link href={link('/')} scroll={true} onClick={() => setIsMenuOpen(false)}>
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
                    <FlagIcon code={locale} className="w-5 h-3" idSuffix="-h2-mobile" />
                    <span>{getLanguageLabel(locale)}</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Language Dropdown */}
                  {isLanguageOpen && (
                    <div className="absolute right-0 mt-2 w-36 bg-white shadow-lg py-1 z-50 border border-gray-200">
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
              <button
                onClick={() => setIsMobileCabinsOpen(!isMobileCabinsOpen)}
                className={`font-heading font-medium text-center py-4 text-[16px] tracking-wider uppercase flex items-center justify-center gap-2 ${isActive('/cabins') ? 'text-[#F49A4A]' : 'text-[#495D4D]'}`}
              >
                {t('link.our_cabins', 'Our Cabins')}
                <svg className={`w-4 h-4 transition-transform ${isMobileCabinsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isMobileCabinsOpen && (
                <div className="flex flex-col border-t border-gray-100 mb-2">
                  {cabins.map((cabin) => (
                    <Link
                      key={cabin.id}
                      href={link(`/cabins/${cabin.slug}`)}
                      onClick={() => { setIsMenuOpen(false); setIsMobileCabinsOpen(false); }}
                      className="text-[#495D4D] font-heading font-medium text-center py-3 text-[14px] tracking-wider uppercase hover:text-[#F49A4A]"
                    >
                      {cabin.name}
                    </Link>
                  ))}
                </div>
              )}
              <Link
                href={link('/activities')}
                onClick={() => setIsMenuOpen(false)}
                className={`font-heading font-medium text-center py-4 text-[16px] tracking-wider uppercase ${isActive('/activities') ? 'text-[#F49A4A]' : 'text-[#495D4D]'}`}
              >
                {t('link.activities', 'Activities')}
              </Link>
              <Link
                href={link('/eat-drink')}
                onClick={() => setIsMenuOpen(false)}
                className={`font-heading font-medium text-center py-4 text-[16px] tracking-wider uppercase ${isActive('/eat-drink') ? 'text-[#F49A4A]' : 'text-[#495D4D]'}`}
              >
                {t('link.eat_drink', 'Eat & Drink')}
              </Link>
              <Link
                href={link('/blog')}
                onClick={() => setIsMenuOpen(false)}
                className={`font-heading font-medium text-center py-4 text-[16px] tracking-wider uppercase ${isActive('/blog') ? 'text-[#F49A4A]' : 'text-[#495D4D]'}`}
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
