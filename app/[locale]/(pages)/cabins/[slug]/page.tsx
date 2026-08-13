"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { useBookingDates } from "@/app/providers/BookingDatesProvider";
import PhotoGalleryModal from "./components/PhotoGalleryModal";
import MobileCarouselModal from "./components/MobileCarouselModal";
import BookingSection from "@/app/components/booking/BookingSection";
import AvailabilityCalendar from "@/app/components/booking/AvailabilityCalendar";
import ImageGallery from "./components/ImageGallery";
import AmenitiesSection from "./components/AmenitiesSection";
import ExtraServicesSection from "./components/ExtraServicesSection";
import SleepingAreasSection from "./components/SleepingAreasSection";
import ThingsToKnow from "./components/ThingsToKnow";
import ReviewsSection from "@/app/components/ReviewsSection";
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

interface ThingsToKnowSection {
  icon: string;
  title: string;
  intro?: string;
  previewItems?: Array<{ text: string }>;
  groups?: Array<{
    header: string;
    items: Array<{
      icon: string;
      text?: string;
      description?: string;
    }>;
  }>;
  footer?: string;
  // Old format backward compat
  content?: string;
}

interface CabinDetails {
  id: string;
  lodgifyId: string;
  name: string; // API returns localized string
  slug: string;
  description?: string; // API returns localized string
  shortDescription?: string; // API returns localized string
  capacity: number;
  addOns?: { babyAddOnId?: number | null; dogAddOnId?: number | null } | null;
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
  thingsToKnow?: ThingsToKnowSection[];
}

const SingleCabinPage = () => {
  const params = useParams();
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
  const [mobileCarouselImages, setMobileCarouselImages] = useState<string[]>([]);
  const [carouselKey, setCarouselKey] = useState(0);
  const [reviewSummary, setReviewSummary] = useState<{
    average: number;
    count: number;
  } | null>(null);
  // Image the photo tour should open on, set when a hero image is tapped.
  const [galleryTargetImage, setGalleryTargetImage] = useState<string | null>(
    null
  );

  // Selected dates from the shared booking store (used by the Things to Know
  // panel for display). The booking widgets read the store directly.
  const { arrival, departure } = useBookingDates();

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
        console.error("Error fetching cabin:", errorMessage, err);
        setError(errorMessage);
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
        {/* Cabin Name - Desktop only, left aligned above the gallery */}
        <h1
          className="hidden md:block font-logga font-medium text-[28px] lg:text-[32px] uppercase tracking-wide mb-3"
          style={{ color: "#212121" }}
        >
          {cabin.name?.toUpperCase() || "CABIN"}
        </h1>

        {/* Image Gallery Component */}
        <ImageGallery
          images={cabin.images || []}
          featuredImage={cabin.featuredImage}
          onShowAllClick={() => {
            setGalleryTargetImage(null);
            setShowPhotoGallery(true);
          }}
          onMobileImageClick={(imageUrl) => {
            setGalleryTargetImage(imageUrl);
            setShowPhotoGallery(true);
          }}
        />

        {/* Cabin Name - Mobile Only */}
        <div className="md:hidden px-4 pt-1 pb-2">
          <h1
            className="font-logga font-medium text-[22px] uppercase tracking-wide"
            style={{ color: "#212121" }}
          >
            {cabin.name?.toUpperCase() || "CABIN"}
          </h1>
        </div>

        {/* CONTENT SECTION BELOW IMAGES */}
        {/* minmax(0,1fr) so the left column can shrink below its content's
            min-content width - a plain 1fr lets wide content push the booking
            card past the container's right edge. */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_464px] gap-4 sm:gap-8 mt-0 md:mt-8 px-4 md:px-0">
          {/* Left Column - Cabin Details */}
          <div>
            {/* Cabin Details Title */}
            <div className="mb-4 md:mb-6">
              <h2
                className="font-jost font-medium text-[16px] md:text-[20px] lg:text-[24px] mb-3 md:mb-4 uppercase tracking-wide"
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
              </h2>

              {/* Review score - scrolls to the guest reviews section */}
              {reviewSummary && (
                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById("guest-reviews")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                  className="flex items-center gap-1.5 mb-3 md:mb-4 text-[13px] md:text-[15px] text-gray-800 hover:text-black transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    style={{ color: "#F49A4A" }}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.446a1 1 0 00-.363 1.118l1.286 3.958c.3.921-.755 1.688-1.539 1.118l-3.366-2.446a1 1 0 00-1.176 0l-3.366 2.446c-.784.57-1.838-.197-1.539-1.118l1.286-3.958a1 1 0 00-.363-1.118L2.063 9.385c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.951-.69l1.285-3.958z" />
                  </svg>
                  <span className="font-jost font-medium">
                    {reviewSummary.average.toFixed(1)}
                  </span>
                  <span className="text-gray-400">·</span>
                  <span className="font-jost font-light underline">
                    {reviewSummary.count}{" "}
                    {reviewSummary.count === 1
                      ? t("detail.review_singular", "review")
                      : t("detail.review_plural", "reviews")}
                  </span>
                </button>
              )}

              {/* Quick Amenities Icons Row - Show featured amenities */}
              {cabin.featuredAmenities &&
                cabin.featuredAmenities.length > 0 && (
                  <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-4 md:mb-6 text-[13px] md:text-sm text-gray-700">
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

              {/* Description */}
              <p className="font-jost font-light leading-relaxed text-[15px] md:text-[16px] mb-6 md:mb-8 text-gray-700">
                {cabin.description || cabin.shortDescription}
              </p>
            </div>

            {/* Amenities Section Component */}
            <AmenitiesSection
              additionalAmenities={cabin.additionalAmenities}
              featuredAmenities={cabin.featuredAmenities}
            />

            {/* Inline availability calendar (Airbnb-style; drives the booking store) */}
            <AvailabilityCalendar
              slug={cabin.slug}
              locale={locale}
              city={cabin.city}
            />

            {/* Extra Services Section Component */}
            <ExtraServicesSection services={cabin.services} />

            {/* Sleeping Areas Section Component */}
            <SleepingAreasSection
              locationImage={cabin.locationImage}
              cabinName={cabin.name || cabin.slug}
            />

            {/* Guest Reviews */}
            <div id="guest-reviews" className="scroll-mt-24">
              <ReviewsSection
                cabinId={cabin.id}
                inline
                onSummary={setReviewSummary}
              />
            </div>

            {/* Things to Know Section */}
            <ThingsToKnow
              checkIn={arrival}
              checkOut={departure}
              capacity={cabin.capacity}
              locale={locale}
              thingsToKnow={cabin.thingsToKnow}
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
                allowDogs: !!cabin.addOns?.dogAddOnId,
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
        scrollToImageUrl={galleryTargetImage}
        onImageClick={(index, orderedImages) => {
          setMobileCarouselImages(orderedImages);
          setMobileCarouselIndex(index);
          setCarouselKey(k => k + 1);
          setShowMobileCarousel(true);
        }}
      />

      {/* Mobile Carousel Modal Component */}
      <MobileCarouselModal
        key={carouselKey}
        isOpen={showMobileCarousel}
        onClose={() => setShowMobileCarousel(false)}
        images={mobileCarouselImages.length > 0 ? mobileCarouselImages : (cabin.images || [])}
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
        />
      </div>

      {/* Bottom padding for mobile sticky bar - h-36 covers notice banner height */}
      <div className="h-36 lg:hidden" />
    </div>
  );
};

export default SingleCabinPage;
