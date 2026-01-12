"use client";

import { useState, useEffect, useRef } from "react";
import { Activity } from "@/app/data/activities";
import ActivityListCard from "@/app/components/ActivityListCard";
import ActivityDetailModal from "@/app/components/ActivityDetailModal";
import { apiFetch } from "@/app/lib/api";

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

// Transform API response to match existing Activity interface
function transformActivity(apiActivity: APIActivity, index: number): Activity {
  return {
    id: index + 1,
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
  const [activeTab, setActiveTab] = useState<"activities" | "restaurants">(
    "activities"
  );
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [restaurants, setRestaurants] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTabsSticky, setIsTabsSticky] = useState(true);
  const discoverSectionRef = useRef<HTMLElement>(null);

  // Fetch activities from API
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await apiFetch("/api/activities");
        const result = await response.json();
        const data = result?.data ?? result ?? [];

        if (Array.isArray(data)) {
          // Split by category - DINING goes to restaurants, rest to activities
          const apiActivities = data.filter(
            (a: APIActivity) => a.category !== "DINING"
          );
          const apiRestaurants = data.filter(
            (a: APIActivity) => a.category === "DINING"
          );

          setActivities(apiActivities.map(transformActivity));
          setRestaurants(apiRestaurants.map(transformActivity));
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

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

  const currentItems = activeTab === "activities" ? activities : restaurants;

  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(/assets/d206536ef067f64b29cad184324fe360bb763e30.jpg)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.50)" }}
          ></div>
        </div>
        <h1 className="relative z-10 text-white text-4xl md:text-5xl lg:text-6xl font-custom text-center px-4">
          WHAT TO DO? WHERE TO GO?
        </h1>
      </section>

      {/* Tabs Section */}
      <section
        className={`bg-white border-b border-gray-200 ${
          isTabsSticky ? "sticky top-[70px] md:top-[86px]" : "relative"
        } z-40`}
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex justify-center gap-6 sm:gap-12 overflow-x-auto pt-4 pb-4">
            <button
              onClick={() => setActiveTab("activities")}
              className="py-4 px-2 text-[16px] md:text-[24px] font-medium font-heading uppercase tracking-wider transition-colors relative whitespace-nowrap"
              style={{
                color: activeTab === "activities" ? "#F49A4A" : "#495D4D",
              }}
            >
              ACTIVITIES
              {activeTab === "activities" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F49A4A]"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("restaurants")}
              className="py-4 px-2 text-[16px] md:text-[24px] font-medium font-heading uppercase tracking-wider transition-colors relative whitespace-nowrap"
              style={{
                color: activeTab === "restaurants" ? "#F49A4A" : "#495D4D",
              }}
            >
              RESTAURANTS
              {activeTab === "restaurants" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F49A4A]"></span>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Activities List */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading activities...</p>
            </div>
          ) : currentItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                {activeTab === "activities"
                  ? "Activities not found"
                  : "Restaurants not found"}
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
            backgroundImage: "url(/assets/breakfast.jpg)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.50)" }}
          ></div>
        </div>
        <h2 className="relative z-10 text-white text-3xl md:text-4xl lg:text-5xl font-custom text-center px-4 mb-6">
          {activeTab === "activities" ? (
            <>
              DISCOVER THE RESTAURANTS
              <br />
              AROUND
            </>
          ) : (
            <>
              DISCOVER THE ACTIVITIES
              <br />
              AROUND
            </>
          )}
        </h2>
        <button
          onClick={() => {
            setActiveTab(
              activeTab === "activities" ? "restaurants" : "activities"
            );
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="relative z-10 px-8 py-3 text-white font-heading tracking-wider transition-all hover:bg-hoverorange"
          style={{
            backgroundColor: "#939D92",
            fontSize: "18px",
            fontWeight: 500,
          }}
        >
          DISCOVER
        </button>
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
