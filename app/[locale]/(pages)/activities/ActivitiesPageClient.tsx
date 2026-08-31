'use client';

import { useState, useEffect, useRef } from 'react';
import { Activity } from '@/app/types/content';
import ActivityListCard from '@/app/components/ActivityListCard';
import ActivityDetailModal from '@/app/components/ActivityDetailModal';
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
    main?: DiscoverSlot;
  };
}

interface ActivityCategoryTab {
  id: string;
  slug: string;
  name: string;
}

interface ActivitiesPageClientProps {
  activities: Activity[];
  categories: ActivityCategoryTab[];
  pageData: PageData;
}

/**
 * Owns the tab/modal/sticky-scroll interactivity. activities/categories/
 * pageData arrive already fetched server-side (see page.tsx), so every
 * activity's text is present in the server HTML regardless of which tab
 * is visually active - the tab state below only filters what's already
 * rendered, it doesn't gate the fetch.
 */
export default function ActivitiesPageClient({ activities, categories, pageData }: ActivitiesPageClientProps) {
  const { t, locale } = useTranslations('activities');
  const [activeTab, setActiveTab] = useState<string>(categories[0]?.slug || '');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTabsSticky, setIsTabsSticky] = useState(true);
  const discoverSectionRef = useRef<HTMLElement>(null);

  // Handle URL hash for tab navigation - e.g. /activities#dining.
  useEffect(() => {
    if (categories.length === 0) return;

    const applyHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && categories.some((tab) => tab.slug === hash)) {
        setActiveTab(hash);
      }
    };

    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, [categories]);

  // Update URL hash when tab changes
  const handleTabChange = (slug: string) => {
    setActiveTab(slug);
    window.history.replaceState(null, '', `#${slug}`);
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

  const handleReadMore = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedActivity(null), 300);
  };

  const currentItems = activeTab
    ? activities.filter((item) => item.categorySlug === activeTab)
    : activities;

  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px] flex items-center justify-center bg-[#495D4D]">
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-300"
          style={{
            backgroundImage: `url(${pageData.heroImage || '/assets/d206536ef067f64b29cad184324fe360bb763e30.jpg'})`,
          }}
        >
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.50)' }}></div>
        </div>
        <h1 className="relative z-10 text-white text-4xl md:text-5xl lg:text-6xl font-custom text-center px-4">
          {pageData.heroText}
        </h1>
      </section>

      {/* Tabs Section */}
      <section
        className={`bg-white border-b border-gray-200 ${
          isTabsSticky ? 'sticky top-[58px] md:top-[82px]' : 'relative'
        } z-40`}
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex justify-center gap-6 sm:gap-12 overflow-x-auto py-2">
            {categories.map((tab) => (
              <button
                key={tab.slug}
                onClick={() => handleTabChange(tab.slug)}
                className="py-2 px-2 text-[16px] md:text-[18px] font-medium font-heading uppercase tracking-wider transition-colors relative whitespace-nowrap"
                style={{
                  color: activeTab === tab.slug ? '#F49A4A' : '#495D4D',
                }}
              >
                {tab.name}
                {activeTab === tab.slug && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F49A4A]"></span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Activities List */}
      <section className="py-6 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          {currentItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                {t('page.activities_not_found', 'Activities not found')}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {currentItems.map((item) => (
                <ActivityListCard key={item.id} activity={item} onReadMore={handleReadMore} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Discover Section */}
      <section
        ref={discoverSectionRef}
        className="relative h-[300px] md:h-[400px] flex flex-col items-center justify-center"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${pageData.discoverSection?.main?.image || '/assets/breakfast.jpg'})`,
          }}
        >
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.50)' }}></div>
        </div>
        {(() => {
          const slot = pageData.discoverSection?.main;
          const text = slot?.text?.[locale] || slot?.text?.en;
          const btnText = slot?.buttonText?.[locale] || slot?.buttonText?.en;
          const btnLink = slot?.buttonLink;
          return (
            <>
              {text && (
                <h2 className="relative z-10 text-white text-4xl md:text-5xl lg:text-6xl font-custom text-center px-4 mb-6">
                  {text}
                </h2>
              )}
              {btnText && (
                <button
                  onClick={() => {
                    if (btnLink) {
                      window.location.href = btnLink;
                    } else {
                      const index = categories.findIndex((tab) => tab.slug === activeTab);
                      const next = categories[(index + 1) % (categories.length || 1)];
                      if (next) handleTabChange(next.slug);
                      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
                    }
                  }}
                  className="relative z-10 px-8 py-3 text-white font-heading tracking-wider transition-all hover:bg-hoverorange"
                  style={{ backgroundColor: '#939D92', fontSize: '18px', fontWeight: 500 }}
                >
                  {btnText}
                </button>
              )}
            </>
          );
        })()}
      </section>

      {/* Activity Detail Modal */}
      <ActivityDetailModal activity={selectedActivity} isOpen={isModalOpen} onClose={handleCloseModal} />
    </main>
  );
}
