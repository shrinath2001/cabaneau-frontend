"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useSearchParams, notFound } from "next/navigation";
import PhotoGalleryModal from "./components/PhotoGalleryModal";
import MobileCarouselModal from "./components/MobileCarouselModal";
import BookingSection from "@/app/components/booking/BookingSection";
import ImageGallery from "./components/ImageGallery";
import AmenitiesSection from "./components/AmenitiesSection";
import ExtraServicesSection from "./components/ExtraServicesSection";
import SleepingAreasSection from "./components/SleepingAreasSection";
import { cabins as staticCabins } from "@/app/data/cabins";
import { apiFetch } from "@/app/lib/api";
import { useTranslations } from "@/app/providers/TranslationsProvider";

interface AmenityInfo {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  category: string;
}

interface ServiceInfo {
  id: string;
  name: string;
  slug: string;
  category: string;
  price?: number;
  priceUnit?: string;
  featuredImage?: string;
}

interface ImageTag {
  slug: string;
  name: string;
  displayOrder: number;
}

interface CabinDetails {
  id: string;
  lodgifyId: string;
  name: string; // API returns localized string
  slug: string;
  description?: string; // API returns localized string
  shortDescription?: string; // API returns localized string
  capacity: number;
  bedrooms: number;
  bathrooms: number;
  squareMeters?: number;
  basePrice: number;
  featuredImage: string;
  images: string[];
  floorPlan?: string;
  locationImage?: string;
  virtualTour?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
  featuredAmenities?: AmenityInfo[];
  additionalAmenities?: AmenityInfo[];
  services?: ServiceInfo[];
}

const SingleCabinPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const locale = (params.locale as string) || "en";
  const { t } = useTranslations("cabin");

  const [cabin, setCabin] = useState<CabinDetails | null>(null);
  const [imageTags, setImageTags] = useState<ImageTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPhotoGallery, setShowPhotoGallery] = useState(false);
  const [showMobileCarousel, setShowMobileCarousel] = useState(false);
  const [mobileCarouselIndex, setMobileCarouselIndex] = useState(0);

  // Get booking params from URL (passed from search page)
  const arrival = searchParams.get("arrival") || undefined;
  const departure = searchParams.get("departure") || undefined;
  const adults = searchParams.get("adults") || undefined;
  const children = searchParams.get("children") || undefined;
  const infants = searchParams.get("infants") || undefined;
  const pets = searchParams.get("pets") || undefined;

  useEffect(() => {
    const fetchCabin = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch cabin and image tags in parallel
        // Pass locale from URL to get localized content
        console.log("🔍 Fetching cabin with slug:", slug, "locale:", locale);
        const fetchOptions = {
          headers: { "x-language": locale },
        };
        const [cabinResponse, imageTagsResponse] = await Promise.all([
          apiFetch(`/api/cabins/slug/${slug}`, fetchOptions),
          apiFetch("/api/image-tags", fetchOptions),
        ]);

        // Process image tags (non-blocking - don't fail if tags API fails)
        // The API returns localized names based on Accept-Language header
        if (imageTagsResponse.ok) {
          const tagsData = await imageTagsResponse.json();
          setImageTags(
            tagsData.map(
              (tag: { slug: string; name: string; displayOrder: number }) => ({
                slug: tag.slug,
                name: tag.name,
                displayOrder: tag.displayOrder,
              })
            )
          );
        }

        const response = cabinResponse;

        console.log("📥 Response status:", response.status);

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ error: "Unknown error" }));
          console.error("❌ API Error:", errorData);

          if (response.status === 404) {
            notFound();
          }
          throw new Error(
            errorData.error || `Failed to fetch cabin (${response.status})`
          );
        }

        const data = await response.json();
        console.log("✅ Cabin data received:", data);
        setCabin(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        console.error("❌ Error fetching cabin:", errorMessage, err);
        console.log("📦 Attempting to use static cabin data as fallback");

        // Try to find cabin from static data as fallback
        // Extract cabin number from slug (e.g., "cabin-1" -> 1, "tube" -> 1)
        const cabinNumber = slug.match(/\d+/)
          ? parseInt(slug.match(/\d+/)![0])
          : null;

        // Try to find by ID or by matching slug/title
        const staticCabin = cabinNumber
          ? staticCabins.find((c) => c.id === cabinNumber)
          : staticCabins.find(
              (c) =>
                c.title.toLowerCase().includes(slug.toLowerCase()) ||
                slug.toLowerCase().includes(c.title.toLowerCase())
            );

        if (staticCabin) {
          console.log("✅ Found static cabin data:", staticCabin.title);
          // Transform static cabin to match CabinDetails interface
          const transformedCabin: CabinDetails = {
            id: staticCabin.id.toString(),
            lodgifyId: staticCabin.id.toString(),
            name: staticCabin.title,
            slug: slug,
            description: staticCabin.description,
            shortDescription: staticCabin.description.substring(0, 200) + "...",
            capacity: staticCabin.guests,
            bedrooms: staticCabin.bedrooms,
            bathrooms: staticCabin.bathrooms,
            squareMeters: parseInt(staticCabin.area) || undefined,
            basePrice: parseFloat(staticCabin.price.replace("$", "")) || 300,
            featuredImage: staticCabin.images[0],
            images: staticCabin.images,
            isActive: true,
          };
          setCabin(transformedCabin);
        } else {
          setError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCabin();
    }
  }, [slug, locale]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error || !cabin) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p className="text-red-600">
            {t("detail.error_loading", "Error loading cabin details")}
          </p>
          <Link
            href="/cabins"
            className="text-blue-600 hover:underline mt-4 inline-block"
          >
            {t("detail.back_to_cabins", "Back to all cabins")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-0 md:pt-4 pb-0 md:pb-5 px-0 md:px-8 lg:px-20 -mt-2 md:mt-0">
      <div className="max-w-[1400px] mx-auto px-0 md:px-6 py-0 md:py-2">
        {/* Back to cabins link - Desktop Only */}
        <div className="hidden md:block mb-0 md:mb-6 px-4 md:px-0 py-3 md:py-0">
          <Link
            href="/cabins"
            className="flex items-center text-gray-700 hover:text-black text-sm font-medium font-jost"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {t("detail.back_to_all", "BACK TO ALL CABINES")}
          </Link>
        </div>

        {/* Image Gallery Component */}
        <ImageGallery
          images={cabin.images || []}
          featuredImage={cabin.featuredImage}
          onShowAllClick={() => setShowPhotoGallery(true)}
          onMobileImageClick={(index) => {
            setMobileCarouselIndex(index);
            setShowMobileCarousel(true);
          }}
        />

        {/* Cabin Name - Mobile Only */}
        <div className="md:hidden px-4 pt-1 pb-2">
          <h1
            className="font-logga font-medium text-[20px] uppercase tracking-wide"
            style={{ color: "#212121" }}
          >
            {cabin.name?.toUpperCase() || "CABIN"}
          </h1>
        </div>

        {/* CONTENT SECTION BELOW IMAGES */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_464px] gap-4 sm:gap-8 mt-0 md:mt-8 px-4 md:px-0">
          {/* Left Column - Cabin Details */}
          <div>
            {/* Cabin Details Title */}
            <div className="mb-4 md:mb-6">
              <h1
                className="font-jost font-medium text-[14px] md:text-[20px] lg:text-[24px] mb-3 md:mb-4 uppercase tracking-wide"
                style={{ color: "#212121" }}
              >
                {`${cabin.capacity} ${t("detail.guests", "GUESTS")} · ${
                  cabin.bedrooms
                } ${
                  cabin.bedrooms > 1
                    ? t("detail.bedrooms", "BEDROOMS")
                    : t("detail.bedroom", "BEDROOM")
                } · ${cabin.bathrooms} ${
                  cabin.bathrooms > 1
                    ? t("detail.bathrooms", "BATHROOMS")
                    : t("detail.bathroom", "BATHROOM")
                }`}
              </h1>

              {/* Quick Amenities Icons Row - Show featured amenities */}
              {cabin.featuredAmenities &&
                cabin.featuredAmenities.length > 0 && (
                  <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-4 md:mb-6 text-[11px] md:text-sm text-gray-700">
                    {cabin.featuredAmenities.slice(0, 4).map((amenity) => {
                      // Support both new format (fa-solid fa-bath) and legacy (fa-bath)
                      const iconClass = amenity.icon
                        ? amenity.icon.includes("fa-solid") ||
                          amenity.icon.includes("fa-regular") ||
                          amenity.icon.includes("fa-brands")
                          ? amenity.icon
                          : amenity.icon.startsWith("fa-")
                          ? `fa-solid ${amenity.icon}`
                          : `fa-solid fa-${amenity.icon}`
                        : null;
                      return (
                        <div
                          key={amenity.id}
                          className="flex items-center gap-1.5"
                        >
                          {iconClass ? (
                            <i
                              className={`${iconClass} text-base md:text-lg`}
                            ></i>
                          ) : (
                            <svg
                              className="w-4 h-4 md:w-5 md:h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                          <span className="font-jost font-light uppercase">
                            {amenity.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              {/* Fallback when no featured amenities from API */}
              {(!cabin.featuredAmenities ||
                cabin.featuredAmenities.length === 0) && (
                <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-4 md:mb-6 text-[11px] md:text-sm text-gray-700">
                  <div className="flex items-center gap-1.5">
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                      />
                    </svg>
                    <span className="font-jost font-light uppercase">
                      {t("amenities.wifi", "WiFi")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                      />
                    </svg>
                    <span className="font-jost font-light uppercase">
                      {t("amenities.private_sauna", "Private Sauna")}
                    </span>
                  </div>
                </div>
              )}

              {/* Description */}
              <p className="font-jost font-light leading-relaxed text-[13px] md:text-[16px] mb-6 md:mb-8 text-gray-700">
                {cabin.description ||
                  cabin.shortDescription ||
                  "Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry. Lorem Ipsum Has Been The Industry's Standard Dummy Text Ever Since The 1500s, When An Unknown Printer Took A Galley Of Type And Scrambled It To Make A Type Specimen Book. It Has Survived Not Only Five Centuries, But Also The Leap Into Electronic Typesetting, Remaining Essentially Unchanged. It Was Popularised In The 1960s With The Release Of Letraset Sheets Containing Lorem Ipsum Passages, And..."}
              </p>
            </div>

            {/* Amenities Section Component */}
            <AmenitiesSection
              additionalAmenities={cabin.additionalAmenities}
              featuredAmenities={cabin.featuredAmenities}
            />

            {/* Extra Services Section Component */}
            <ExtraServicesSection services={cabin.services} />

            {/* Sleeping Areas Section Component */}
            <SleepingAreasSection
              locationImage={cabin.locationImage}
              cabinName={cabin.name || cabin.slug}
            />
          </div>

          {/* Booking Section - Desktop: right sidebar */}
          <div className="hidden lg:block">
            <BookingSection
              mode="desktop"
              cabin={{
                slug: cabin.slug,
                name: cabin.name || cabin.slug,
                lodgifyId: cabin.lodgifyId,
                capacity: cabin.capacity,
              }}
              searchParams={{
                arrival,
                departure,
                adults,
                children,
                infants,
                pets,
              }}
            />
          </div>
        </div>
      </div>

      {/* Photo Gallery Modal Component (Desktop) */}
      <PhotoGalleryModal
        isOpen={showPhotoGallery}
        onClose={() => setShowPhotoGallery(false)}
        images={cabin.images || []}
        featuredImage={cabin.featuredImage}
        imageTags={imageTags}
        onImageClick={(index) => {
          setMobileCarouselIndex(index);
          setShowMobileCarousel(true);
        }}
      />

      {/* Mobile Carousel Modal Component */}
      <MobileCarouselModal
        isOpen={showMobileCarousel}
        onClose={() => setShowMobileCarousel(false)}
        images={cabin.images || []}
        initialIndex={mobileCarouselIndex}
      />

      {/* Mobile Booking Section - Fixed sticky bar and bottom sheet */}
      <div className="lg:hidden">
        <BookingSection
          mode="mobile"
          cabin={{
            slug: cabin.slug,
            name: cabin.name || cabin.slug,
            lodgifyId: cabin.lodgifyId,
            capacity: cabin.capacity,
          }}
          searchParams={{
            arrival,
            departure,
            adults,
            children,
            infants,
            pets,
          }}
        />
      </div>

      {/* Bottom padding for mobile sticky bar */}
      <div className="h-24 lg:hidden" />
    </div>
  );
};

export default SingleCabinPage;
