import type { Metadata } from 'next';
import { EatDrinkItem } from '@/app/types/content';
import EatDrinkPageClient from './EatDrinkPageClient';

interface DiscoverSlot {
  image?: string;
  text?: Record<string, string>;
  buttonText?: Record<string, string>;
  buttonLink?: string;
}

interface PageData {
  heroImage?: string;
  heroText?: string;
  // One slot per food category, keyed by the category slug
  discoverSection?: Record<string, DiscoverSlot>;
}

// Tab of the page, managed in the CMS (Food Categories)
interface FoodCategory {
  id: string;
  slug: string;
  name: string;
  displayOrder: number;
}

interface APIService {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description: string;
  featuredImage?: string;
  images?: string[];
  category: string;
  // Slug of the food category (tab) the service belongs to; none = not on this page
  foodCategory?: string;
  price?: number;
  priceUnit?: string;
  displayOrder: number;
}

// Extended interface to store raw price data for localized formatting
interface EatDrinkItemWithPrice extends EatDrinkItem {
  rawPrice?: number;
  rawPriceUnit?: string;
}

// Transform API response to match existing EatDrinkItem interface
function transformService(service: APIService): EatDrinkItemWithPrice {
  return {
    id: service.id,
    title: service.name?.toUpperCase() || '',
    subtitle: service.shortDescription || '',
    price: '', // Formatted with translations at render time (client component)
    rawPrice: service.price ? Number(service.price) : undefined,
    rawPriceUnit: service.priceUnit,
    description: service.description || '',
    image: service.featuredImage || '',
    detailImage: service.images?.[0],
  };
}

async function getEatDrinkData(locale: string): Promise<{
  categories: FoodCategory[];
  itemsByCategory: Record<string, EatDrinkItemWithPrice[]>;
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
    const [servicesRes, pageRes, categoriesRes] = await Promise.all([
      fetch(`${apiBaseUrl}/services`, { headers, next: { revalidate: 60 } }),
      fetch(`${apiBaseUrl}/pages/slug/eat-drink`, { headers, next: { revalidate: 300 } }),
      fetch(`${apiBaseUrl}/food-categories`, { headers, next: { revalidate: 300 } }),
    ]);

    const servicesResult = servicesRes.ok ? await servicesRes.json() : null;
    const data: APIService[] = servicesResult?.data ?? servicesResult ?? [];
    const categories: FoodCategory[] = categoriesRes.ok ? await categoriesRes.json() : [];

    const itemsByCategory: Record<string, EatDrinkItemWithPrice[]> = {};
    for (const category of categories) {
      itemsByCategory[category.slug] = Array.isArray(data)
        ? data.filter((s) => s.foodCategory === category.slug).map(transformService)
        : [];
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

    return { categories, itemsByCategory, pageData };
  } catch (error) {
    console.error('Error fetching eat-drink data:', error);
    return { categories: [], itemsByCategory: {}, pageData: {} };
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
  const { pageData } = await getEatDrinkData(locale);

  return {
    title: pageData.heroText ? `${pageData.heroText} - Cabaneau` : 'Eat & Drink - Cabaneau',
  };
}

export default async function EatDrinkPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { locale } = await params;
  const { categories, itemsByCategory, pageData } = await getEatDrinkData(locale);

  return <EatDrinkPageClient categories={categories} itemsByCategory={itemsByCategory} pageData={pageData} />;
}
