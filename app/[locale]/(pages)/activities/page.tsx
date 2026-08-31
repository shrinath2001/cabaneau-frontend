import type { Metadata } from "next";
import { Activity } from "@/app/types/content";
import ActivitiesPageClient from "./ActivitiesPageClient";

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
    image: apiActivity.featuredImage || "/assets/d206536ef067f64b29cad184324fe360bb763e30.jpg",
    detailImage: apiActivity.images?.[0],
    icons: [],
    phone: apiActivity.contactPhone || "",
    email: apiActivity.contactEmail || "",
    website: apiActivity.externalLink || "",
  };
}

async function getActivitiesData(locale: string): Promise<{
  activities: Activity[];
  categories: ActivityCategoryTab[];
  pageData: PageData;
}> {
  const apiKey = process.env.API_KEY;
  const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': apiKey || '',
    'Accept-Language': locale || 'en',
  };

  try {
    const [activitiesRes, pageRes, categoriesRes] = await Promise.all([
      fetch(`${apiBaseUrl}/activities`, { headers, next: { revalidate: 60 } }),
      fetch(`${apiBaseUrl}/pages/slug/activities`, { headers, next: { revalidate: 300 } }),
      fetch(`${apiBaseUrl}/activity-categories`, { headers, next: { revalidate: 300 } }),
    ]);

    const activitiesResult = activitiesRes.ok ? await activitiesRes.json() : null;
    const rawActivities: APIActivity[] = activitiesResult?.data ?? activitiesResult ?? [];
    const activities = Array.isArray(rawActivities) ? rawActivities.map(transformActivity) : [];

    // Tabs come from the CMS. Only keep categories that actually have
    // activities, so an empty tab never renders.
    let categories: ActivityCategoryTab[] = [];
    if (categoriesRes.ok) {
      const categoryResult = await categoriesRes.json();
      const used = new Set(rawActivities.map((a) => a.category));
      categories = (Array.isArray(categoryResult) ? categoryResult : [])
        .filter((c: ActivityCategoryTab) => used.has(c.slug))
        .map((c: ActivityCategoryTab) => ({ id: c.id, slug: c.slug, name: c.name }));
    }

    let pageData: PageData = {};
    if (pageRes.ok) {
      const pageResult = await pageRes.json();
      pageData = {
        heroImage: pageResult.heroImage,
        heroText: pageResult.heroText,
        discoverSection: pageResult.discoverSection,
      };
    }

    return { activities, categories, pageData };
  } catch (error) {
    console.error('Error fetching activities data:', error);
    return { activities: [], categories: [], pageData: {} };
  }
}

interface PageParams {
  locale: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { pageData } = await getActivitiesData(locale);

  return {
    title: pageData.heroText ? `${pageData.heroText} - Cabaneau` : 'Activities - Cabaneau',
  };
}

export default async function ActivitiesPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { locale } = await params;
  const { activities, categories, pageData } = await getActivitiesData(locale);

  return <ActivitiesPageClient activities={activities} categories={categories} pageData={pageData} />;
}
