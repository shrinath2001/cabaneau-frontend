"use client";

import { useState, useEffect, useRef } from "react";
import { Activity } from "@/app/types/content";
import ActivityListCard from "@/app/components/ActivityListCard";
import ActivityDetailModal from "@/app/components/ActivityDetailModal";
import { apiFetch } from "@/app/lib/api";
import { useTranslations } from "@/app/providers/TranslationsProvider";

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

interface APIActivity {
  id: string;
  name: string;
  slug: string;
  tagline?: string;
  description: string;
  featuredImage?: string;
  images?: string[];
  category: string;
  externalLink?: string;
  contactPhone?: string;
  contactEmail?: string;
  displayOrder: number;
}

interface ActivityCategoryTab {
  id: string;
  slug: string;
  name: string;
}

// Transform API response to match existing Activity interface
function transformActivity(apiActivity: APIActivity, index: number): Activity {
  return {
    id: index + 1,
    categorySlug: apiActivity.category,
    title: apiActivity.name,
    subtitle: apiActivity.tagline || "",
    description: apiActivity.description,
    image:
      apiActivity.featuredImage ||
      "/assets/d206536ef067f64b29cad184324fe360bb763e30.jpg",
    detailImage: apiActivity.images?.[0],
    icons: [],
    phone: apiActivity.contactPhone || "",
    email: apiActivity.contactEmail || "",
    website: apiActivity.externalLink || "",
  };
}

export default function ActivitiesPage() {
  const { t, locale } = useTranslations("activities");
  // Tabs come from the CMS-managed activity categories; activeTab is a slug.
  const [categories, setCategories] = useState<ActivityCategoryTab[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTabsSticky, setIsTabsSticky] = useState(true);
  const [pageData, setPageData] = useState<PageData>({});
  const discoverSectionRef = useRef<HTMLElement>(null);

  // Fetch activities and page data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch activities and page data in parallel
        const [activitiesResponse, pageResponse, categoriesResponse] =
          await Promise.all([
          apiFetch("/api/activities", {
            headers: { "x-language": locale },
          }),
          apiFetch("/api/pages/slug/activities", {
            headers: { "x-language": locale },
          }),
          apiFetch("/api/activity-categories", {
            headers: { "x-language": locale },
          }),
        ]);

        const activitiesResult = await activitiesResponse.json();
        const data = activitiesResult?.data ?? activitiesResult ?? [];

        if (Array.isArray(data)) {
          setActivities(data.map(transformActivity));
        }

        // Tabs come from the CMS. Only keep categories that actually have
        // activities, so an empty tab never renders.
        if (categoriesResponse.ok) {
          const categoryResult = await categoriesResponse.json();
          const used = new Set(
            (Array.isArray(data) ? data : []).map(
              (a: APIActivity) => a.category
            )
          );
          const tabs: ActivityCategoryTab[] = (
            Array.isArray(categoryResult) ? categoryResult : []
          )
            .filter((c: ActivityCategoryTab) => used.has(c.slug))
            .map((c: ActivityCategoryTab) => ({
              id: c.id,
              slug: c.slug,
              name: c.name,
            }));

          setCategories(tabs);
          setActiveTab((current) =>
            current && tabs.some((tab) => tab.slug === current)
              ? current
              : tabs[0]?.slug || ""
          );
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
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [locale]);

  // Handle URL hash for tab navigation. Re-runs once categories arrive so a
  // deep link like /activities#dining selects the right tab.
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
        const discoverSectionTop =
          discoverSectionRef.current.getBoundingClientRect().top;
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

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll); // Recalculate on resize
    handleScroll(); // Initial check
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
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
        {!loading && (
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-300"
            style={{
              backgroundImage: `url(${pageData.heroImage || "/assets/d206536ef067f64b29cad184324fe360bb763e30.jpg"})`,
            }}
          >
            <div
              className="absolute inset-0"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.50)" }}
            ></div>
          </div>
        )}
        <h1 className="relative z-10 text-white text-4xl md:text-5xl lg:text-6xl font-custom text-center px-4">
          {!loading && pageData.heroText}
        </h1>
      </section>

      {/* Tabs Section */}
      <section
        className={`bg-white border-b border-gray-200 ${
          isTabsSticky ? "sticky top-[58px] md:top-[82px]" : "relative"
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
                  color: activeTab === tab.slug ? "#F49A4A" : "#495D4D",
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
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">{t("page.loading", "Loading activities...")}</p>
            </div>
          ) : currentItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                {t("page.activities_not_found", "Activities not found")}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {currentItems.map((item) => (
                <ActivityListCard
                  key={item.id}
                  activity={item}
                  onReadMore={handleReadMore}
                />
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
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.50)" }}
          ></div>
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
                      const index = categories.findIndex(
                        (tab) => tab.slug === activeTab
                      );
                      const next = categories[(index + 1) % (categories.length || 1)];
                      if (next) handleTabChange(next.slug);
                      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
                    }
                  }}
                  className="relative z-10 px-8 py-3 text-white font-heading tracking-wider transition-all hover:bg-hoverorange"
                  style={{ backgroundColor: "#939D92", fontSize: "18px", fontWeight: 500 }}
                >
                  {btnText}
                </button>
              )}
            </>
          );
        })()}
      </section>

      {/* Activity Detail Modal */}
      <ActivityDetailModal
        activity={selectedActivity}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </main>
  );
}
