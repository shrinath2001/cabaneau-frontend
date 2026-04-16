'use client';

import { useState, useEffect, useRef } from 'react';
import { EatDrinkItem } from '@/app/types/content';
import EatDrinkCard from '@/app/components/EatDrinkCard';
import EatDrinkDetailModal from '@/app/components/EatDrinkDetailModal';
import { apiFetch } from '@/app/lib/api';
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
  discoverSection?: {
    dining?: DiscoverSlot;
    breakfast?: DiscoverSlot;
    drinks?: DiscoverSlot;
  };
}

type TabType = 'breakfast' | 'dining' | 'drinks';

interface APIService {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description: string;
  featuredImage?: string;
  images?: string[];
  category: string;
  price?: number;
  priceUnit?: string;
  displayOrder: number;
}

// Extended interface to store raw price data for localized formatting
interface EatDrinkItemWithPrice extends EatDrinkItem {
  rawPrice?: number;
  rawPriceUnit?: string;
}

// Transform API response to match existing EatDrinkItem interface
function transformService(service: APIService, index: number): EatDrinkItemWithPrice {
  return {
    id: service.id,
    title: service.name?.toUpperCase() || '',
    subtitle: service.shortDescription || '',
    price: '', // Will be formatted with translations in render
    rawPrice: service.price ? Number(service.price) : undefined,
    rawPriceUnit: service.priceUnit,
    description: service.description || '',
    image: service.featuredImage || '/assets/dinner.png',
    detailImage: service.images?.[0],
  };
}

export default function EatDrinkPage() {
  const { t, locale } = useTranslations('services');
  const [activeTab, setActiveTab] = useState<TabType>('breakfast');
  const [selectedItem, setSelectedItem] = useState<EatDrinkItemWithPrice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dining, setDining] = useState<EatDrinkItemWithPrice[]>([]);
  const [breakfast, setBreakfast] = useState<EatDrinkItemWithPrice[]>([]);
  const [drinks, setDrinks] = useState<EatDrinkItemWithPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTabsSticky, setIsTabsSticky] = useState(true);
  const [pageData, setPageData] = useState<PageData>({});
  const discoverSectionRef = useRef<HTMLElement>(null);

  // Format price with localized unit
  const formatPrice = (price?: number, priceUnit?: string): string => {
    if (!price) return '';

    const unitMap: Record<string, string> = {
      'PER_PERSON': t('price_unit.per_person', '/PERSON'),
      'PER_GROUP': t('price_unit.per_group', '/GROUP'),
      'PER_HOUR': t('price_unit.per_hour', '/HOUR'),
      'PER_DAY': t('price_unit.per_day', '/DAY'),
    };

    const unit = priceUnit ? unitMap[priceUnit] || '' : '';
    return `${Math.floor(price)}€${unit}`;
  };

  // Handle URL hash for tab navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as TabType;
      if (hash && ['breakfast', 'dining', 'drinks'].includes(hash)) {
        setActiveTab(hash);
      }
    };

    // Set initial tab from hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update URL hash when tab changes
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    window.history.replaceState(null, '', `#${tab}`);
  };

  // Fetch services and page data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch services and page data in parallel
        const [servicesResponse, pageResponse] = await Promise.all([
          apiFetch('/api/eat-drink', {
            headers: { 'x-language': locale },
          }),
          apiFetch('/api/pages/slug/eat-drink', {
            headers: { 'x-language': locale },
          }),
        ]);

        const result = await servicesResponse.json();
        const data = result?.data ?? result ?? [];

        if (Array.isArray(data)) {
          // Split by category
          const diningItems = data
            .filter((s: APIService) => s.category === 'DINING')
            .map(transformService);
          const breakfastItems = data
            .filter((s: APIService) => s.category === 'BREAKFAST')
            .map(transformService);
          const drinksItems = data
            .filter((s: APIService) => s.category === 'DRINKS')
            .map(transformService);

          setDining(diningItems);
          setBreakfast(breakfastItems);
          setDrinks(drinksItems);
        }

        // Set page data for hero section
        if (pageResponse.ok) {
          const pageResult = await pageResponse.json();
          setPageData({
            heroImage: pageResult.heroImage,
            heroText: pageResult.heroText,
            discoverSection: pageResult.discoverSection,
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [locale]);

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
    const originalItem = [...dining, ...breakfast, ...drinks].find(i => i.id === item.id);
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

  const getCurrentItems = () => {
    switch (activeTab) {
      case 'dining':
        return dining;
      case 'breakfast':
        return breakfast;
      case 'drinks':
        return drinks;
      default:
        return dining;
    }
  };

  const currentItems = getCurrentItems();

  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px] flex items-center justify-center bg-[#495D4D]">
        {!loading && (
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-300"
            style={{
              backgroundImage: `url(${pageData.heroImage || '/assets/d206536ef067f64b29cad184324fe360bb763e30.jpg'})`,
            }}
          >
            <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.50)' }}></div>
          </div>
        )}
        <h1 className="relative z-10 text-white text-4xl md:text-5xl lg:text-6xl font-custom text-center px-4">
          {!loading && pageData.heroText}
        </h1>
      </section>

      {/* Tabs Section */}
      <section className={`bg-white border-b border-gray-200 ${isTabsSticky ? 'sticky top-[58px] md:top-[82px]' : 'relative'} z-40`}>
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex justify-center gap-4 sm:gap-8 md:gap-12 overflow-x-auto py-2">
            <button
              onClick={() => handleTabChange('breakfast')}
              className="py-2 px-2 text-[16px] md:text-[18px] font-medium font-heading uppercase tracking-wider transition-colors relative whitespace-nowrap"
              style={{ color: activeTab === 'breakfast' ? '#F49A4A' : '#495D4D' }}
            >
              {t('eat_drink.tabs.breakfast', 'BREAKFAST')}
              {activeTab === 'breakfast' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F49A4A]"></span>
              )}
            </button>
            <button
              onClick={() => handleTabChange('dining')}
              className="py-2 px-2 text-[16px] md:text-[18px] font-medium font-heading uppercase tracking-wider transition-colors relative whitespace-nowrap"
              style={{ color: activeTab === 'dining' ? '#F49A4A' : '#495D4D' }}
            >
              {t('eat_drink.tabs.dining', 'DINING')}
              {activeTab === 'dining' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F49A4A]"></span>
              )}
            </button>
            <button
              onClick={() => handleTabChange('drinks')}
              className="py-2 px-2 text-[16px] md:text-[18px] font-medium font-heading uppercase tracking-wider transition-colors relative whitespace-nowrap"
              style={{ color: activeTab === 'drinks' ? '#F49A4A' : '#495D4D' }}
            >
              {t('eat_drink.tabs.drinks', 'DRINKS')}
              {activeTab === 'drinks' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F49A4A]"></span>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Items List */}
      <section className="py-6 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">{t('eat_drink.loading', 'Loading...')}</p>
            </div>
          ) : currentItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                {activeTab === 'dining' && t('eat_drink.dining_not_found', 'Dining options not found')}
                {activeTab === 'breakfast' && t('eat_drink.breakfast_not_found', 'Breakfast options not found')}
                {activeTab === 'drinks' && t('eat_drink.drinks_not_found', 'Drinks options not found')}
              </p>
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

      {/* Discover More Section */}
      <section ref={discoverSectionRef} className="grid grid-cols-1 md:grid-cols-2">
        {/* First slot: cross-promotes dining↔breakfast based on active tab */}
        {(() => {
          const slot1Key = (activeTab === 'dining' ? 'breakfast' : 'dining') as 'breakfast' | 'dining';
          const slot1 = pageData.discoverSection?.[slot1Key];
          const slot1Text = slot1?.text?.[locale] || slot1?.text?.en;
          const slot1BtnText = slot1?.buttonText?.[locale] || slot1?.buttonText?.en;
          const slot1BtnLink = slot1?.buttonLink;
          const slot1Image = slot1?.image || '/assets/dinner.png';
          const slot1FallbackTab: TabType = activeTab === 'dining' ? 'breakfast' : 'dining';
          return (
            <div className="relative h-[300px] md:h-[400px] flex flex-col items-center justify-center">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slot1Image})` }}
              >
                <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.50)' }}></div>
              </div>
              {slot1Text && (
                <h2 className="relative z-10 text-white text-4xl md:text-5xl lg:text-6xl font-custom text-center px-4 mb-6">
                  {slot1Text}
                </h2>
              )}
              {slot1BtnText && (
                <button
                  onClick={() => {
                    if (slot1BtnLink) {
                      window.location.href = slot1BtnLink;
                    } else {
                      handleTabChange(slot1FallbackTab);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="relative z-10 px-8 py-3 text-white font-heading tracking-wider transition-all hover:bg-hoverorange"
                  style={{ backgroundColor: '#939D92', fontSize: '18px', fontWeight: 500 }}
                >
                  {slot1BtnText}
                </button>
              )}
            </div>
          );
        })()}

        {/* Second slot: always promotes drinks (or breakfast when on drinks tab) */}
        {(() => {
          const slot2Key = (activeTab === 'drinks' ? 'breakfast' : 'drinks') as 'breakfast' | 'drinks';
          const slot2 = pageData.discoverSection?.[slot2Key];
          const slot2Text = slot2?.text?.[locale] || slot2?.text?.en;
          const slot2BtnText = slot2?.buttonText?.[locale] || slot2?.buttonText?.en;
          const slot2BtnLink = slot2?.buttonLink;
          const slot2Image = slot2?.image || '/assets/drinks.jpg';
          const slot2FallbackTab: TabType = activeTab === 'drinks' ? 'breakfast' : 'drinks';
          return (
            <div className="relative h-[300px] md:h-[400px] flex flex-col items-center justify-center">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slot2Image})` }}
              >
                <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.50)' }}></div>
              </div>
              {slot2Text && (
                <h2 className="relative z-10 text-white text-4xl md:text-5xl lg:text-6xl font-custom text-center px-4 mb-6">
                  {slot2Text}
                </h2>
              )}
              {slot2BtnText && (
                <button
                  onClick={() => {
                    if (slot2BtnLink) {
                      window.location.href = slot2BtnLink;
                    } else {
                      handleTabChange(slot2FallbackTab);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="relative z-10 px-8 py-3 text-white font-heading tracking-wider transition-all hover:bg-hoverorange"
                  style={{ backgroundColor: '#939D92', fontSize: '18px', fontWeight: 500 }}
                >
                  {slot2BtnText}
                </button>
              )}
            </div>
          );
        })()}
      </section>

      {/* Detail Modal */}
      <EatDrinkDetailModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </main>
  );
}
