import Footer from "../components/Footer";
import CabinsSection from "../components/CabinsSection";
import ServicesSection from "../components/ServicesSection";
import ActivitiesSection from "../components/ActivitiesSection";
import HostsSection from "../components/HostsSection";
import LocationSection from "../components/LocationSection";
import CustomCardsSection from "../components/CustomCardsSection";
import ReviewsSection from "../components/ReviewsSection";
import ImageSliderSection from "../components/ImageSliderSection";
import LogoSlider from "../components/LogoSlider";

interface HomepageSection {
  id: string;
  identifier: string;
  sectionType: 'SERVICES' | 'ACTIVITIES' | 'HOSTS' | 'LOCATION' | 'CUSTOM_CARDS' | 'REVIEWS' | 'IMAGE_SLIDER';
  title?: string;
  subtitle?: string;
  config?: Record<string, unknown>;
  buttonText?: string;
  buttonLink?: string;
  displayOrder: number;
  isActive: boolean;
  backgroundColor?: string;
}

// Transform relative upload paths to full URLs - mirrors the same helper in
// app/api/cabins/homepage/route.ts (the client-side proxy this page used to
// go through before cabin data moved to a server-side fetch below).
const transformImageUrl = (url: string | null | undefined, mediaBaseUrl: string): string | null => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  if (url.startsWith('/uploads')) return `${mediaBaseUrl}${url}`;
  return url;
};

async function getHomepageCabins(locale: string): Promise<Record<string, unknown>[]> {
  const apiKey = process.env.API_KEY;
  const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';
  const mediaBaseUrl = apiBaseUrl.replace('/api/v1', '');

  try {
    const response = await fetch(`${apiBaseUrl}/cabins/homepage`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey || '',
        'Accept-Language': locale || 'en',
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error('Failed to fetch homepage cabins:', response.status);
      return [];
    }

    const result = await response.json();
    const cabins = result?.data ?? result ?? [];

    return cabins.map((cabin: { featuredImage?: string; images?: (string | { url: string; thumbnailUrl?: string })[] }) => ({
      ...cabin,
      featuredImage: transformImageUrl(cabin.featuredImage, mediaBaseUrl),
      images: (cabin.images || []).map((img) =>
        typeof img === 'string'
          ? transformImageUrl(img, mediaBaseUrl)
          : { ...img, url: transformImageUrl(img.url, mediaBaseUrl), thumbnailUrl: transformImageUrl(img.thumbnailUrl, mediaBaseUrl) }
      ),
    }));
  } catch (error) {
    console.error('Error fetching homepage cabins:', error);
    return [];
  }
}

async function getHomepageSections(locale: string): Promise<HomepageSection[]> {
  const apiKey = process.env.API_KEY;
  const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';

  // Use the URL locale for API requests
  const language = locale || 'en';

  try {
    const response = await fetch(`${apiBaseUrl}/homepage-sections`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey || '',
        'Accept-Language': language,
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      console.error('Failed to fetch homepage sections:', response.status);
      return [];
    }

    const result = await response.json();
    return result?.data ?? result ?? [];
  } catch (error) {
    console.error('Error fetching homepage sections:', error);
    return [];
  }
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

interface ReviewStats {
  channels: Array<{ channel: string; averageRating: number; count: number }>;
  overall: { averageRating: number; count: number };
}

async function getReviews(locale: string): Promise<{ reviews: ReviewData[]; stats: ReviewStats | null }> {
  const apiKey = process.env.API_KEY;
  const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': apiKey || '',
    'Accept-Language': locale || 'en',
  };

  try {
    const [reviewsRes, statsRes] = await Promise.all([
      fetch(`${apiBaseUrl}/reviews?limit=50`, { headers, next: { revalidate: 300 } }),
      fetch(`${apiBaseUrl}/reviews/stats`, { headers, next: { revalidate: 300 } }),
    ]);

    const reviewsData = reviewsRes.ok ? await reviewsRes.json() : null;
    const statsData = statsRes.ok ? await statsRes.json() : null;

    return {
      reviews: reviewsData?.data || [],
      stats: statsData ?? null,
    };
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return { reviews: [], stats: null };
  }
}

function renderSection(
  section: HomepageSection,
  reviewsData: { reviews: ReviewData[]; stats: ReviewStats | null }
) {
  const { sectionType, title, subtitle, config, buttonText, buttonLink, backgroundColor } = section;

  switch (sectionType) {
    case 'SERVICES':
      return (
        <ServicesSection
          key={section.id}
          title={title}
          items={(config?.items as Array<{ image: string; title: string; link?: string }>) || undefined}
          buttonText={buttonText}
          buttonLink={buttonLink}
          backgroundColor={backgroundColor}
        />
      );

    case 'ACTIVITIES':
      return (
        <ActivitiesSection
          key={section.id}
          title={title}
          items={(config?.items as Array<{ image: string; title: string; link?: string }>) || undefined}
          buttonText={buttonText}
          buttonLink={buttonLink}
          backgroundColor={backgroundColor}
          useCmsData={Boolean(config?.items && (config.items as Array<unknown>).length > 0)}
        />
      );

    case 'HOSTS':
      return (
        <HostsSection
          key={section.id}
          title={title}
          config={
            config as {
              names?: string;
              image?: string;
              description?: string;
              phone?: string;
              email?: string;
              instagram?: string;
            }
          }
          backgroundColor={backgroundColor}
        />
      );

    case 'LOCATION':
      return (
        <LocationSection
          key={section.id}
          title={title}
          config={config as { mapEmbedUrl?: string; address?: string }}
          buttonText={buttonText}
          buttonLink={buttonLink}
          backgroundColor={backgroundColor}
        />
      );

    case 'CUSTOM_CARDS':
      return (
        <CustomCardsSection
          key={section.id}
          title={title}
          subtitle={subtitle}
          items={(config?.items as Array<{ image: string; title: string; link?: string }>) || undefined}
          buttonText={buttonText}
          buttonLink={buttonLink}
          backgroundColor={backgroundColor}
        />
      );

    case 'REVIEWS':
      return (
        <ReviewsSection
          key={section.id}
          title={title}
          backgroundColor={backgroundColor}
          reviews={reviewsData.reviews}
          stats={reviewsData.stats}
        />
      );

    case 'IMAGE_SLIDER':
      return (
        <ImageSliderSection
          key={section.id}
          title={title}
          topSliderImages={(config?.topSliderImages as Array<{ image: string }>) || []}
          bottomSliderImages={(config?.bottomSliderImages as Array<{ image: string }>) || []}
          backgroundColor={backgroundColor}
        />
      );

    default:
      return null;
  }
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  const [sections, cabins, reviewsData] = await Promise.all([
    getHomepageSections(locale),
    getHomepageCabins(locale),
    getReviews(locale),
  ]);

  return (
    <div>
      <main>
        <LogoSlider />
        <CabinsSection cabins={cabins} />
        {sections.map((section) => renderSection(section, reviewsData))}
      </main>
      <Footer />
    </div>
  );
}
