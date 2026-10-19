'use client';

import { useState, useEffect, useRef } from 'react';
import { EatDrinkItem } from '@/app/types/content';
import EatDrinkCard from '@/app/components/EatDrinkCard';
import EatDrinkDetailModal from '@/app/components/EatDrinkDetailModal';
import { useTranslations } from '@/app/providers/TranslationsProvider';

interface DiscoverSlot {
  image?: string;
  text?: Record<string, string>;
  buttonText?: Record<string, string>;
  buttonLink?: string;
}

interface PageData {
  heroImage?: string;
  heroText?: string;
  // One slot per food category, keyed by the category slug
  discoverSection?: Record<string, DiscoverSlot>;
}

// Tab of the page, managed in the CMS (Food Categories)
interface FoodCategory {
  id: string;
  slug: string;
  name: string;
  displayOrder: number;
}

// Extended interface to store raw price data for localized formatting
interface EatDrinkItemWithPrice extends EatDrinkItem {
  rawPrice?: number;
  rawPriceUnit?: string;
}

interface EatDrinkPageClientProps {
  categories: FoodCategory[];
  itemsByCategory: Record<string, EatDrinkItemWithPrice[]>;
  pageData: PageData;
}

/**
 * Owns the tab/modal/sticky-scroll interactivity. categories/itemsByCategory/
 * pageData arrive already fetched server-side (see page.tsx), so every
 * item's text is present in the server HTML regardless of which tab is
 * visually active - the tab state below only filters what's already
 * rendered, it doesn't gate the fetch.
 */
export default function EatDrinkPageClient({ categories, itemsByCategory, pageData }: EatDrinkPageClientProps) {
  const { t, locale } = useTranslations('services');
  const [activeTab, setActiveTab] = useState<string>(categories[0]?.slug || '');
  const [selectedItem, setSelectedItem] = useState<EatDrinkItemWithPrice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTabsSticky, setIsTabsSticky] = useState(true);
  const discoverSectionRef = useRef<HTMLElement>(null);

  // Format price with localized unit
  const formatPrice = (price?: number, priceUnit?: string): string => {
    if (!price) return '';

    const unitMap: Record<string, string> = {
      'PER_PERSON': t('price_unit.per_person'),
      'PER_GROUP': t('price_unit.per_group'),
      'PER_HOUR': t('price_unit.per_hour'),
      'PER_DAY': t('price_unit.per_day'),
    };

    const unit = priceUnit ? unitMap[priceUnit] || '' : '';
    return `${Math.floor(price)}€${unit}`;
  };

  // Handle URL hash for tab navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && categories.some((category) => category.slug === hash)) {
        setActiveTab(hash);
      }
    };

    // Set initial tab from hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [categories]);

  // Update URL hash when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    window.history.replaceState(null, '', `#${tab}`);
  };

  // Sticky tabs scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (discoverSectionRef.current) {
        const discoverSectionTop = discoverSectionRef.current.getBoundingClientRect().top;
        const isMobile = window.innerWidth < 768;
        const stickyPosition = isMobile ? 70 + 70 : 86 + 70; // Header height + tabs approximate height

        // Unstick tabs as soon as the discover section reaches the sticky tabs position
        if (discoverSectionTop <= stickyPosition) {
          setIsTabsSticky(false);
        } else {
          setIsTabsSticky(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll); // Recalculate on resize
    handleScroll(); // Initial check
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const handleReadMore = (item: EatDrinkItem) => {
    // Find the original item with raw price data
    const originalItem = Object.values(itemsByCategory).flat().find((i) => i.id === item.id);
    if (originalItem) {
      setSelectedItem({
        ...originalItem,
        price: formatPrice(originalItem.rawPrice, originalItem.rawPriceUnit),
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  const currentItems = itemsByCategory[activeTab] || [];

  // The two categories promoted in the "discover more" banners: the first two other than the active one
  const promotedCategories = categories.filter((category) => category.slug !== activeTab).slice(0, 2);

  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px] flex items-center justify-center bg-[#495D4D]">
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-300"
          style={{
            backgroundImage: pageData.heroImage ? `url(${pageData.heroImage})` : undefined,
          }}
        >
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.50)' }}></div>
        </div>
        <h1 className="relative z-10 text-white text-4xl md:text-5xl lg:text-6xl font-custom text-center px-4">
          {pageData.heroText}
        </h1>
      </section>

      {/* Tabs Section */}
      <section className={`bg-white border-b border-gray-200 ${isTabsSticky ? 'sticky top-[58px] md:top-[82px]' : 'relative'} z-40`}>
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex justify-center gap-4 sm:gap-8 md:gap-12 overflow-x-auto py-2">
            {categories.map((category) => (
              <button
                key={category.slug}
                onClick={() => handleTabChange(category.slug)}
                className="py-2 px-2 text-[16px] md:text-[18px] font-medium font-heading uppercase tracking-wider transition-colors relative whitespace-nowrap"
                style={{ color: activeTab === category.slug ? '#F49A4A' : '#495D4D' }}
              >
                {category.name}
                {activeTab === category.slug && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F49A4A]"></span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Items List */}
      <section className="py-6 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          {currentItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">{t('eat_drink.no_items')}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {currentItems.map((item, index) => (
                <EatDrinkCard
                  key={item.id}
                  item={{
                    ...item,
                    price: formatPrice(item.rawPrice, item.rawPriceUnit),
                  }}
                  onReadMore={handleReadMore}
                  isReversed={index % 2 !== 0}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Discover More Section: banners promoting the other categories (image, text and button set in CMS > Pages > Eat & Drink) */}
      {promotedCategories.length > 0 && (
        <section ref={discoverSectionRef} className={`grid grid-cols-1 ${promotedCategories.length > 1 ? 'md:grid-cols-2' : ''}`}>
          {promotedCategories.map((category) => {
            const slot = pageData.discoverSection?.[category.slug];
            const slotText = slot?.text?.[locale] || slot?.text?.en;
            const slotBtnText = slot?.buttonText?.[locale] || slot?.buttonText?.en;
            const slotBtnLink = slot?.buttonLink;
            const slotImage = slot?.image;
            return (
              <div key={category.slug} className="relative h-[300px] md:h-[400px] flex flex-col items-center justify-center">
                <div className="absolute inset-0 bg-cover bg-center bg-[#495D4D]" style={{ backgroundImage: slotImage ? `url(${slotImage})` : undefined }}>
                  <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.50)' }}></div>
                </div>
                {slotText && (
                  <h2 className="relative z-10 text-white text-4xl md:text-5xl lg:text-6xl font-custom text-center px-4 mb-6">
                    {slotText}
                  </h2>
                )}
                {slotBtnText && (
                  <button
                    onClick={() => {
                      if (slotBtnLink) {
                        window.location.href = slotBtnLink;
                      } else {
                        handleTabChange(category.slug);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className="relative z-10 px-8 py-3 text-white font-heading tracking-wider transition-all hover:bg-hoverorange"
                    style={{ backgroundColor: '#939D92', fontSize: '18px', fontWeight: 500 }}
                  >
                    {slotBtnText}
                  </button>
                )}
              </div>
            );
          })}
        </section>
      )}

      {/* Detail Modal */}
      <EatDrinkDetailModal item={selectedItem} isOpen={isModalOpen} onClose={handleCloseModal} />
    </main>
  );
}
