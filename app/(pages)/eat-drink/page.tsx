'use client';

import { useState, useEffect, useRef } from 'react';
import { EatDrinkItem } from '@/app/data/eatdrink';
import EatDrinkCard from '@/app/components/EatDrinkCard';
import EatDrinkDetailModal from '@/app/components/EatDrinkDetailModal';
import { apiFetch } from '@/app/lib/api';
import { useTranslations } from '@/app/providers/TranslationsProvider';

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

// Format price from API to display format (e.g., "45€/PERSON")
function formatPrice(price?: number, priceUnit?: string): string {
  if (!price) return '';

  const unitMap: Record<string, string> = {
    'PER_PERSON': '/PERSON',
    'PER_GROUP': '/GROUP',
    'PER_HOUR': '/HOUR',
    'PER_DAY': '/DAY',
  };

  const unit = priceUnit ? unitMap[priceUnit] || '' : '';
  return `${price}€${unit}`;
}

// Transform API response to match existing EatDrinkItem interface
function transformService(service: APIService, index: number): EatDrinkItem {
  return {
    id: index + 1,
    title: service.name?.toUpperCase() || '',
    subtitle: service.shortDescription || '',
    price: formatPrice(service.price, service.priceUnit),
    description: service.description || '',
    image: service.featuredImage || '/assets/dinner.png',
    detailImage: service.images?.[0],
  };
}

export default function EatDrinkPage() {
  const { t } = useTranslations('services');
  const [activeTab, setActiveTab] = useState<'dining' | 'breakfast' | 'drinks'>('dining');
  const [selectedItem, setSelectedItem] = useState<EatDrinkItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dining, setDining] = useState<EatDrinkItem[]>([]);
  const [breakfast, setBreakfast] = useState<EatDrinkItem[]>([]);
  const [drinks, setDrinks] = useState<EatDrinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTabsSticky, setIsTabsSticky] = useState(true);
  const discoverSectionRef = useRef<HTMLElement>(null);

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await apiFetch('/api/eat-drink');
        const result = await response.json();
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
      } catch (error) {
        console.error('Error fetching eat-drink services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

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
    setSelectedItem(item);
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
            backgroundImage: 'url(/assets/d206536ef067f64b29cad184324fe360bb763e30.jpg)',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"style={{ backgroundColor: 'rgba(0, 0, 0, 0.50)' }}></div>
        </div>
        <h1 className="relative z-10 text-white text-4xl md:text-5xl lg:text-6xl font-custom text-center px-4">
          {t('eat_drink.hero_title', 'OUR EAT & DRINK SERVICES')}
         </h1>
      </section>

      {/* Tabs Section */}
      <section className={`bg-white border-b border-gray-200 ${isTabsSticky ? 'sticky top-[70px] md:top-[86px]' : 'relative'} z-40`}>
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex justify-center gap-4 sm:gap-8 md:gap-12 overflow-x-auto pt-4 pb-4">
            <button
              onClick={() => setActiveTab('dining')}
              className="py-4 px-2 text-[16px] md:text-[24px] font-medium font-heading uppercase tracking-wider transition-colors relative whitespace-nowrap"
              style={{ color: activeTab === 'dining' ? '#F49A4A' : '#495D4D' }}
            >
              {t('eat_drink.tabs.dining', 'DINING')}
              {activeTab === 'dining' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F49A4A]"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('breakfast')}
              className="py-4 px-2 text-[16px] md:text-[24px] font-medium font-heading uppercase tracking-wider transition-colors relative whitespace-nowrap"
              style={{ color: activeTab === 'breakfast' ? '#F49A4A' : '#495D4D' }}
            >
              {t('eat_drink.tabs.breakfast', 'BREAKFAST')}
              {activeTab === 'breakfast' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F49A4A]"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('drinks')}
              className="py-4 px-2 text-[16px] md:text-[24px] font-medium font-heading uppercase tracking-wider transition-colors relative whitespace-nowrap"
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
      <section className="py-12 bg-white">
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
                  item={item}
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
        {/* First Section */}
        <div className="relative h-[300px] md:h-[400px] flex flex-col items-center justify-center">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: activeTab === 'dining'
                ? 'url(/assets/dinner.png)'
                : activeTab === 'breakfast'
                ? 'url(/assets/dinner.png)'
                : 'url(/assets/dinner.png)',
            }}
          >
            <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.50)' }}></div>
          </div>
          <h2 className="relative z-10 text-white text-2xl md:text-3xl lg:text-4xl font-custom text-center px-4 mb-6">
            {activeTab === 'dining' ? (
              <>{t('eat_drink.discover.our', 'OUR')}<br />{t('eat_drink.discover.drinks_offering', 'DRINKS OFFERING')}</>
            ) : activeTab === 'breakfast' ? (
              <>{t('eat_drink.discover.our', 'OUR')}<br />{t('eat_drink.discover.dining_offering', 'DINING OFFERING')}</>
            ) : (
              <>{t('eat_drink.discover.our', 'OUR')}<br />{t('eat_drink.discover.dining_offering', 'DINING OFFERING')}</>
            )}
          </h2>
          <button
            onClick={() => {
              const newTab = activeTab === 'dining' ? 'drinks' : 'dining';
              setActiveTab(newTab);
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
              backgroundImage: activeTab === 'dining'
                ? 'url(/assets/breakfast.jpg)'
                : activeTab === 'breakfast'
                ? 'url(/assets/dinner.png)'
                : 'url(/assets/breakfast.jpg)',
            }}
          >
            <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.50)' }}></div>
          </div>
          <h2 className="relative z-10 text-white text-2xl md:text-3xl lg:text-4xl font-custom text-center px-4 mb-6">
            {activeTab === 'dining' ? (
              <>{t('eat_drink.discover.our', 'OUR')}<br />{t('eat_drink.discover.breakfast_offering', 'BREAKFAST OFFERING')}</>
            ) : activeTab === 'breakfast' ? (
              <>{t('eat_drink.discover.our', 'OUR')}<br />{t('eat_drink.discover.drinks_offering', 'DRINKS OFFERING')}</>
            ) : (
              <>{t('eat_drink.discover.our', 'OUR')}<br />{t('eat_drink.discover.breakfast_offering', 'BREAKFAST OFFERING')}</>
            )}
          </h2>
          <button
            onClick={() => {
              const newTab = activeTab === 'dining' ? 'breakfast' : activeTab === 'breakfast' ? 'drinks' : 'breakfast';
              setActiveTab(newTab);
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
