import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "@/app/lib/translations";
import BookingSection from "@/app/components/booking/BookingSection";
import AvailabilityCalendar from "@/app/components/booking/AvailabilityCalendar";
import CabinGallery from "./components/CabinGallery";
import AmenitiesSection from "./components/AmenitiesSection";
import ExtraServicesSection from "./components/ExtraServicesSection";
import SleepingAreasSection from "./components/SleepingAreasSection";
import ThingsToKnow from "./components/ThingsToKnow";
import CabinMapSection from "./components/CabinMapSection";
import OtherCabinsSection from "./components/OtherCabinsSection";
import ReviewsSection from "@/app/components/ReviewsSection";

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
  longName?: string; // API returns localized string; falls back to name when unset
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
  heroVideo?: string;
  heroVideoPoster?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  metaTitle?: string; // API returns localized string
  metaDescription?: string; // API returns localized string
  isActive: boolean;
  featuredAmenities?: AmenityInfo[];
  additionalAmenities?: AmenityInfo[];
  services?: ServiceInfo[];
  thingsToKnow?: ThingsToKnowSection[];
}

interface ReviewData {
  id: string;
  reviewerName: string;
  reviewerAvatar?: string;
  content: string;
  rating: number;
  channel: 'AIRBNB' | 'BOOKING_COM' | 'CASAPILOT' | 'WEBSITE';
  reviewDate?: string;
  externalUrl?: string;
  cabin?: { name: string; slug: string };
}

async function getCabin(slug: string, locale: string): Promise<CabinDetails | null> {
  const apiKey = process.env.API_KEY;
  const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';

  try {
    const response = await fetch(`${apiBaseUrl}/cabins/slug/${slug}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey || '',
        'Accept-Language': locale || 'en',
      },
      next: { revalidate: 60 },
    });

    if (response.status === 404) return null;
    if (!response.ok) {
      console.error('Failed to fetch cabin:', response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching cabin:', error);
    return null;
  }
}

async function getImageTags(locale: string): Promise<ImageTag[]> {
  const apiKey = process.env.API_KEY;
  const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';

  try {
    const response = await fetch(`${apiBaseUrl}/image-tags`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey || '',
        'Accept-Language': locale || 'en',
      },
      next: { revalidate: 300 },
    });
    if (!response.ok) return [];
    const data = await response.json();
    return (data || []).map((tag: { slug: string; name: string; displayOrder: number }) => ({
      slug: tag.slug,
      name: tag.name,
      displayOrder: tag.displayOrder,
    }));
  } catch (error) {
    console.error('Error fetching image tags:', error);
    return [];
  }
}

// Transform relative upload paths to full URLs - same helper used on the
// homepage (app/[locale]/page.tsx) for the same endpoint.
const transformImageUrl = (url: string | null | undefined, mediaBaseUrl: string): string | null => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  if (url.startsWith('/uploads')) return `${mediaBaseUrl}${url}`;
  return url;
};

async function getOtherCabins(currentSlug: string, locale: string): Promise<Record<string, unknown>[]> {
  const apiKey = process.env.API_KEY;
  const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';
  const mediaBaseUrl = apiBaseUrl.replace('/api/v1', '');

  try {
    // Same endpoint the homepage grid uses - it carries Lodgify pricing and
    // next-availability alongside the cabin record.
    const response = await fetch(`${apiBaseUrl}/cabins/homepage`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey || '',
        'Accept-Language': locale || 'en',
      },
      next: { revalidate: 60 },
    });
    if (!response.ok) return [];
    const result = await response.json();
    const rows = result?.data ?? result ?? [];
    if (!Array.isArray(rows)) return [];

    return rows
      .filter((cabin: { slug?: string }) => cabin.slug !== currentSlug)
      .map((cabin: { featuredImage?: string; images?: (string | { url: string })[] }) => ({
        ...cabin,
        featuredImage: transformImageUrl(cabin.featuredImage, mediaBaseUrl),
        images: (cabin.images || []).map((img) =>
          typeof img === 'string' ? transformImageUrl(img, mediaBaseUrl) : { ...img, url: transformImageUrl(img.url, mediaBaseUrl) }
        ),
      }));
  } catch (error) {
    console.error('Error fetching other cabins:', error);
    return [];
  }
}

async function getCabinReviews(cabinId: string, locale: string): Promise<ReviewData[]> {
  const apiKey = process.env.API_KEY;
  const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';

  try {
    const response = await fetch(`${apiBaseUrl}/reviews?limit=50&cabinId=${cabinId}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey || '',
        'Accept-Language': locale || 'en',
      },
      next: { revalidate: 300 },
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data?.data || [];
  } catch (error) {
    console.error('Error fetching cabin reviews:', error);
    return [];
  }
}

interface PageParams {
  locale: string;
  slug: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const cabin = await getCabin(slug, locale);

  if (!cabin) {
    return { title: 'Cabin not found - Cabaneau' };
  }

  const title = cabin.metaTitle || `${cabin.name} - Cabaneau Treehouse Resort`;
  const description = (
    cabin.metaDescription || cabin.shortDescription || cabin.description || ''
  )
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);

  return {
    title,
    description: description || undefined,
    openGraph: {
      title,
      description: description || undefined,
      images: cabin.featuredImage ? [cabin.featuredImage] : undefined,
    },
  };
}

export default async function CabinDetailPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug, locale } = await params;

  const cabin = await getCabin(slug, locale);
  if (!cabin) {
    notFound();
  }

  const [imageTags, otherCabins, reviews, translations] = await Promise.all([
    getImageTags(locale),
    getOtherCabins(cabin.slug, locale),
    getCabinReviews(cabin.id, locale),
    getTranslations(locale),
  ]);

  const t = (key: string, fallback: string): string => translations[`cabin.${key}`] || fallback;

  // The API sends rating as a decimal string ("5.0"), so coerce before
  // summing - adding it raw concatenates and yields NaN.
  const ratings = reviews
    .map((review) => Number(review.rating))
    .filter((rating) => Number.isFinite(rating) && rating > 0);
  const reviewSummary =
    ratings.length > 0
      ? {
          average: ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length,
          count: reviews.length,
        }
      : null;

  return (
    <div className="bg-white min-h-screen pt-0 md:pt-4 pb-0 md:pb-5 px-0 md:px-8 lg:px-20 -mt-2 md:mt-0">
      <div className="max-w-[1400px] mx-auto px-0 md:px-6 py-0 md:py-2">
        {/* Cabin Long Name (falls back to Name) - Desktop only, left aligned above the gallery */}
        <h1
          className="hidden md:block font-logga font-medium text-[28px] lg:text-[32px] uppercase tracking-wide mb-3"
          style={{ color: "#212121" }}
        >
          {(cabin.longName || cabin.name)?.toUpperCase() || "CABIN"}
        </h1>

        {/* Image Gallery - CabinGallery owns the photo-tour/carousel modal
            state; the images themselves are already fetched above, so the
            gallery renders real markup on first paint regardless. */}
        <CabinGallery
          images={cabin.images || []}
          featuredImage={cabin.featuredImage}
          heroVideo={cabin.heroVideo}
          heroVideoPoster={cabin.heroVideoPoster}
          imageTags={imageTags}
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

              {/* Review score - plain anchor to the guest reviews section
                  below (no JS needed to jump there; smooth scroll is a CSS
                  progressive enhancement via scroll-mt-24 + browser default). */}
              {reviewSummary && (
                <a
                  href="#guest-reviews"
                  className="flex items-center gap-1.5 mb-3 md:mb-4 text-[13px] md:text-[15px] text-gray-800 hover:text-black transition-colors w-fit"
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
                </a>
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
              <ReviewsSection reviews={reviews} inline />
            </div>

            {/* Map - driven by the lat/long set in the CMS */}
            <CabinMapSection
              latitude={cabin.latitude}
              longitude={cabin.longitude}
              address={cabin.address}
              postalCode={cabin.postalCode}
              city={cabin.city}
              cabinName={cabin.name}
            />

            {/* Things to Know Section - reads the selected dates itself from
                the shared booking store (see ThingsToKnow.tsx) */}
            <ThingsToKnow
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

        {/* Other cabins - full width, outside the two-column grid so it isn't
            squeezed into the left column alongside the booking sidebar */}
        <div className="px-4 md:px-0">
          <OtherCabinsSection cabins={otherCabins} />
        </div>
      </div>

      {/* Mobile Booking Section - Fixed sticky bar and bottom sheet */}
      <div className="lg:hidden">
        <BookingSection
          mode="mobile"
          cabin={{
            slug: cabin.slug,
            name: cabin.name || cabin.slug,
            lodgifyId: cabin.lodgifyId,
            capacity: cabin.capacity,
            allowDogs: !!cabin.addOns?.dogAddOnId,
          }}
        />
      </div>

      {/* Bottom padding for mobile sticky bar - h-36 covers notice banner height */}
      <div className="h-36 lg:hidden" />
    </div>
  );
}
