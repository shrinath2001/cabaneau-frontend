import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import BlogSidebarCabin from '@/app/components/BlogSidebarCabin';
import { getTranslations } from '@/app/lib/translations';

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
  metaTitle?: string;
  metaDescription?: string;
}

async function getBlogPost(slug: string, locale: string): Promise<BlogPost | null> {
  const apiKey = process.env.API_KEY;
  const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';

  try {
    const response = await fetch(`${apiBaseUrl}/blog/slug/${slug}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey || '',
        'Accept-Language': locale || 'en',
      },
      next: { revalidate: 300 },
    });

    if (response.status === 404) return null;
    if (!response.ok) {
      console.error('Failed to fetch blog post:', response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

// Locale-aware date formatting
function formatDate(dateString: string | undefined, locale: string): string {
  if (!dateString) return '';
  const localeMap: Record<string, string> = {
    en: 'en-GB',
    fr: 'fr-FR',
    de: 'de-DE',
    nl: 'nl-NL',
  };
  return new Date(dateString).toLocaleDateString(localeMap[locale] || 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
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
  const post = await getBlogPost(slug, locale);

  if (!post) {
    return { title: 'Blog post not found - Cabaneau' };
  }

  return {
    title: post.metaTitle || `${post.title} - Cabaneau Blog`,
    description: post.metaDescription || post.excerpt || undefined,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || undefined,
      images: post.featuredImage ? [post.featuredImage] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug, locale } = await params;
  const post = await getBlogPost(slug, locale);

  if (!post) {
    notFound();
  }

  const translations = await getTranslations(locale);
  const t = (key: string, fallback: string): string => translations[`blog.${key}`] || fallback;

  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px] lg:h-[500px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: post.featuredImage
              ? `url(${post.featuredImage})`
              : 'url(/assets/d206536ef067f64b29cad184324fe360bb763e30.jpg)',
          }}
        >
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.50)' }}></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          {post.category && (
            <span className="inline-block bg-[#F49A4A] text-white text-sm px-3 py-1 mb-4 font-jost">
              {post.category.name}
            </span>
          )}
          <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-logga mb-4">
            {post.title}
          </h1>
          <p className="text-white/80 text-sm font-jost font-light">
            {formatDate(post.publishedAt, locale)}
          </p>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1 max-w-3xl">
              {/* Back Link */}
              <Link
                href={`/${locale}/blog`}
                className="inline-flex items-center text-[#495D4D] hover:text-[#F49A4A] mb-8 transition-colors font-jost font-light"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                {t('back_to_blog', 'Back to Blog')}
              </Link>

              {/* Content */}
              <article className="blog-content">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </article>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h4 className="text-sm font-logga text-[#495D4D] mb-3">{t('tags', 'Tags:')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-600 text-sm px-3 py-1 font-jost font-light"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Hidden on mobile. lg:self-start stops it stretching
                to the article's height (the flex row's default), which
                sticky needs room to travel within as the article scrolls
                past; lg:top-24 matches the booking sidebar's convention. */}
            <aside className="hidden lg:block lg:w-[420px] flex-shrink-0 lg:sticky lg:top-24 lg:self-start">
              {/* Featured Cabin */}
              <BlogSidebarCabin />
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
