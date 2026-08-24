'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import BlogSidebarCabin from '@/app/components/BlogSidebarCabin';
import { useTranslations } from '@/app/providers/TranslationsProvider';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  publishedAt?: string;
  status?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  _preview?: boolean;
}

export default function BlogPreviewPage() {
  const params = useParams();
  const id = params.id as string;
  const locale = (params?.locale as string) || 'en';
  const { t } = useTranslations('blog');

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const response = await fetch(`/api/blog/preview/${id}`, {
          headers: { 'x-language': locale },
        });
        if (!response.ok) {
          setError(response.status === 404 ? 'Blog post not found' : 'Failed to load preview');
          return;
        }
        const data = await response.json();
        setPost(data);
      } catch (err) {
        console.error('Error fetching blog preview:', err);
        setError('Failed to load preview');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, locale]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const localeMap: Record<string, string> = {
      en: 'en-GB', fr: 'fr-FR', de: 'de-DE', nl: 'nl-NL',
    };
    return new Date(dateString).toLocaleDateString(localeMap[locale] || 'en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  };

  if (loading) {
    return (
      <main>
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <p className="text-gray-600 font-jost font-light">Loading preview...</p>
          </div>
        </section>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main>
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h1 className="text-2xl font-logga text-[#495D4D] mb-4">{error || 'Post not found'}</h1>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      {/* Preview Banner */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#F49A4A] text-white text-center py-2 px-4 font-jost text-sm" style={{ zIndex: 9999 }}>
        <i className="fas fa-eye me-2"></i>
        PREVIEW MODE {post.status && post.status !== 'PUBLISHED' ? `(${post.status})` : ''} — This is how the post will appear to visitors
      </div>

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
            {formatDate(post.publishedAt)}
          </p>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 max-w-3xl">
              <Link
                href={`/${locale}/blog`}
                className="inline-flex items-center text-[#495D4D] hover:text-[#F49A4A] mb-8 transition-colors font-jost font-light"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                {t('back_to_blog', 'Back to Blog')}
              </Link>

              <article className="blog-content">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </article>

              {post.tags && post.tags.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h4 className="text-sm font-logga text-[#495D4D] mb-3">{t('tags', 'Tags:')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-100 text-gray-600 text-sm px-3 py-1 font-jost font-light">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside className="hidden lg:block lg:w-[420px] flex-shrink-0 lg:sticky lg:top-24 lg:self-start">
              <BlogSidebarCabin />
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
