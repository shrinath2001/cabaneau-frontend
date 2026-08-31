import type { Metadata } from 'next';
import { getTranslations } from '@/app/lib/translations';
import BlogPageClient from './BlogPageClient';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  publishedAt?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  tags?: string[];
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

interface BlogResponse {
  data: BlogPost[];
  page: number;
  limit: number;
  total: number;
}

const POSTS_PER_PAGE = 10;

async function getBlogListData(locale: string): Promise<{
  posts: BlogPost[];
  total: number;
  categories: BlogCategory[];
  allPosts: BlogPost[];
}> {
  const apiKey = process.env.API_KEY;
  const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': apiKey || '',
    'Accept-Language': locale || 'en',
  };

  try {
    const [postsRes, categoriesRes, allPostsRes] = await Promise.all([
      fetch(`${apiBaseUrl}/blog?page=1&limit=${POSTS_PER_PAGE}`, { headers, next: { revalidate: 60 } }),
      fetch(`${apiBaseUrl}/blog/categories`, { headers, next: { revalidate: 300 } }),
      fetch(`${apiBaseUrl}/blog?limit=1000`, { headers, next: { revalidate: 60 } }),
    ]);

    const postsResult: BlogResponse | null = postsRes.ok ? await postsRes.json() : null;
    const categoriesResult = categoriesRes.ok ? await categoriesRes.json() : [];
    const allPostsResult: BlogResponse | null = allPostsRes.ok ? await allPostsRes.json() : null;

    return {
      posts: postsResult?.data || [],
      total: postsResult?.total || 0,
      categories: categoriesResult || [],
      allPosts: allPostsResult?.data || [],
    };
  } catch (error) {
    console.error('Error fetching blog list data:', error);
    return { posts: [], total: 0, categories: [], allPosts: [] };
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
  const translations = await getTranslations(locale);
  const title = translations['blog.hero_title'] || 'BLOG';

  return {
    title: `${title} - Cabaneau`,
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { locale } = await params;
  const { posts, total, categories, allPosts } = await getBlogListData(locale);

  return (
    <BlogPageClient
      initialPosts={posts}
      initialTotal={total}
      initialCategories={categories}
      initialAllPosts={allPosts}
    />
  );
}
