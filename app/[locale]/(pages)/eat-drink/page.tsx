'use client';

import { useState, useEffect, useRef } from 'react';
import { EatDrinkItem } from '@/app/types/content';
import EatDrinkCard from '@/app/components/EatDrinkCard';
import EatDrinkDetailModal from '@/app/components/EatDrinkDetailModal';
import { apiFetch } from '@/app/lib/api';
import { useTranslations } from '@/app/providers/TranslationsProvider';

interface PageData {
  heroImage?: string;
  heroText?: string;
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
      <section className="relative h-[300px] md:h-[400px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${pageData.heroImage || '/assets/d206536ef067f64b29cad184324fe360bb763e30.jpg'})`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"style={{ backgroundColor: 'rgba(0, 0, 0, 0.50)' }}></div>
        </div>
        <h1 className="relative z-10 text-white text-4xl md:text-5xl lg:text-6xl font-custom text-center px-4">
          {pageData.heroText || t('eat_drink.hero_title', 'OUR EAT & DRINK SERVICES')}
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
        {/* First Section - Shows the "other" main category */}
        <div className="relative h-[300px] md:h-[400px] flex flex-col items-center justify-center">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: activeTab === 'breakfast'
                ? 'url(/assets/dinner.png)'
                : activeTab === 'dining'
                ? 'url(/assets/breakfast.jpg)'
                : 'url(/assets/dinner.png)',
            }}
          >
            <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.50)' }}></div>
          </div>
          <h2 className="relative z-10 text-white text-4xl md:text-5xl lg:text-6xl font-custom text-center px-4 mb-6">
            {activeTab === 'breakfast' ? (
              <>{t('eat_drink.discover.our', 'OUR')}<br />{t('eat_drink.discover.dining_offering', 'DINING OFFERING')}</>
            ) : activeTab === 'dining' ? (
              <>{t('eat_drink.discover.our', 'OUR')}<br />{t('eat_drink.discover.breakfast_offering', 'BREAKFAST OFFERING')}</>
            ) : (
              <>{t('eat_drink.discover.our', 'OUR')}<br />{t('eat_drink.discover.dining_offering', 'DINING OFFERING')}</>
            )}
          </h2>
          <button
            onClick={() => {
              // Show dining from breakfast, breakfast from dining, dining from drinks
              const newTab: TabType = activeTab === 'breakfast' ? 'dining' : activeTab === 'dining' ? 'breakfast' : 'dining';
              handleTabChange(newTab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="relative z-10 px-8 py-3 text-white font-heading tracking-wider transition-all hover:bg-hoverorange"
            style={{ backgroundColor: '#939D92', fontSize: '18px', fontWeight: 500 }}
          >
            {t('eat_drink.discover.button', 'DISCOVER OUR SELECTION')}
          </button>
        </div>

        {/* Second Section */}
        <div className="relative h-[300px] md:h-[400px] flex flex-col items-center justify-center">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: activeTab === 'breakfast'
                ? 'url(/assets/drinks.jpg)'
                : activeTab === 'dining'
                ? 'url(/assets/drinks.jpg)'
                : 'url(/assets/breakfast.jpg)',
            }}
          >
            <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.50)' }}></div>
          </div>
          <h2 className="relative z-10 text-white text-4xl md:text-5xl lg:text-6xl font-custom text-center px-4 mb-6">
            {activeTab === 'breakfast' ? (
              <>{t('eat_drink.discover.our', 'OUR')}<br />{t('eat_drink.discover.drinks_offering', 'DRINKS OFFERING')}</>
            ) : activeTab === 'dining' ? (
              <>{t('eat_drink.discover.our', 'OUR')}<br />{t('eat_drink.discover.drinks_offering', 'DRINKS OFFERING')}</>
            ) : (
              <>{t('eat_drink.discover.our', 'OUR')}<br />{t('eat_drink.discover.breakfast_offering', 'BREAKFAST OFFERING')}</>
            )}
          </h2>
          <button
            onClick={() => {
              // Show drinks from breakfast/dining, breakfast from drinks
              const newTab: TabType = activeTab === 'drinks' ? 'breakfast' : 'drinks';
              handleTabChange(newTab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="relative z-10 px-8 py-3 text-white font-heading tracking-wider transition-all hover:bg-hoverorange"
            style={{ backgroundColor: '#939D92', fontSize: '18px', fontWeight: 500 }}
          >
            {t('eat_drink.discover.button', 'DISCOVER OUR SELECTION')}
          </button>
        </div>
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
