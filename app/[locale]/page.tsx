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

function renderSection(section: HomepageSection) {
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
  const sections = await getHomepageSections(locale);

  return (
    <div>
      <main>
        <LogoSlider />
        <CabinsSection />
        {sections.map((section) => renderSection(section))}
      </main>
      <Footer />
    </div>
  );
}
