'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
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

export default function BlogPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const { t } = useTranslations('blog');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]); // For category counts
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const postsPerPage = 10;

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to first page on new search
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch posts (with search and pagination)
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory) {
          params.append('categoryId', selectedCategory);
        }
        if (debouncedSearch) {
          params.append('search', debouncedSearch);
        }
        params.append('page', currentPage.toString());
        params.append('limit', postsPerPage.toString());

        const url = `/api/blog${params.toString() ? `?${params.toString()}` : ''}`;
        const response = await fetch(url, {
          headers: {
            'x-language': locale,
          },
        });
        const result: BlogResponse = await response.json();
        setPosts(result.data || []);
        setTotalPosts(result.total || 0);
        setTotalPages(Math.ceil((result.total || 0) / postsPerPage));
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [locale, selectedCategory, debouncedSearch, currentPage]);

  // Fetch all posts for category counts (without filters)
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const response = await fetch('/api/blog?limit=1000', {
          headers: {
            'x-language': locale,
          },
        });
        const result: BlogResponse = await response.json();
        setAllPosts(result.data || []);
      } catch (error) {
        console.error('Error fetching all posts:', error);
      }
    };
    fetchAllPosts();
  }, [locale]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/blog/categories', {
          headers: {
            'x-language': locale,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCategories(data || []);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [locale]);

  // Handle category change (reset page)
  const handleCategoryChange = useCallback((categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  }, []);

  // Locale-aware date formatting
  const formatDate = (dateString?: string) => {
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
  };

  // Count posts per category (using all posts, not filtered)
  const getCategoryPostCount = (categoryId: string) => {
    return allPosts.filter((post) => post.category?.id === categoryId).length;
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/assets/d206536ef067f64b29cad184324fe360bb763e30.jpg)',
          }}
        >
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.50)' }}></div>
        </div>
        <h1 className="relative z-10 text-white text-4xl md:text-5xl lg:text-6xl font-logga text-center px-4">
          {t('hero_title', 'BLOG')}
        </h1>
      </section>

      {/* Blog Content */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Mobile Search - Only visible on mobile */}
          <div className="lg:hidden mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder={t("search_placeholder", "Search articles...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 focus:border-[#495D4D] focus:outline-none font-jost font-light"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content - Blog Posts */}
            <div className="flex-1">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 font-jost font-light">{t("loading", "Loading posts...")}</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg font-jost font-light">{t("no_posts", "No blog posts found.")}</p>
                  {(searchQuery || selectedCategory) && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        handleCategoryChange(null);
                      }}
                      className="mt-4 text-[#F49A4A] hover:underline font-jost"
                    >
                      {t("clear_filters", "Clear filters")}
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="space-y-8">
                    {posts.map((post) => (
                      <article
                        key={post.id}
                        className="bg-white overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                      >
                        <Link href={`/${locale}/blog/${post.slug}`}>
                          <div className="flex flex-col md:flex-row">
                            {/* Image */}
                            <div className="relative h-48 md:h-auto md:w-72 flex-shrink-0 bg-gray-200">
                              {post.featuredImage ? (
                                <Image
                                  src={post.featuredImage}
                                  alt={post.title}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-gray-400">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={1.5}
                                      stroke="currentColor"
                                      className="w-12 h-12"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                                      />
                                    </svg>
                                  </span>
                                </div>
                              )}
                            </div>
                            {/* Content */}
                            <div className="p-6 flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                {post.category && (
                                  <span className="inline-block bg-[#495D4D] text-white text-xs px-2 py-1 font-jost">
                                    {post.category.name}
                                  </span>
                                )}
                                <span className="text-sm text-gray-500 font-jost font-light">
                                  {formatDate(post.publishedAt)}
                                </span>
                              </div>
                              <h2 className="text-xl font-logga text-[#495D4D] mb-2">
                                {post.title}
                              </h2>
                              {post.excerpt && (
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2 font-jost font-light">
                                  {post.excerpt}
                                </p>
                              )}
                              <span className="text-[#F49A4A] font-jost font-medium text-sm">
                                {t('read_more', 'Read more →')}
                              </span>
                            </div>
                          </div>
                        </Link>
                      </article>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-10 flex items-center justify-center gap-2">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-jost font-light"
                      >
                        {t('previous', 'Previous')}
                      </button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter((page) => {
                            // Show first, last, and pages around current
                            return (
                              page === 1 ||
                              page === totalPages ||
                              Math.abs(page - currentPage) <= 1
                            );
                          })
                          .map((page, index, arr) => {
                            // Add ellipsis where needed
                            const showEllipsisBefore =
                              index > 0 && page - arr[index - 1] > 1;
                            return (
                              <span key={page} className="flex items-center gap-1">
                                {showEllipsisBefore && (
                                  <span className="px-2 text-gray-400 font-jost">...</span>
                                )}
                                <button
                                  onClick={() => setCurrentPage(page)}
                                  className={`w-10 h-10 flex items-center justify-center font-jost ${
                                    currentPage === page
                                      ? 'bg-[#495D4D] text-white'
                                      : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                                  }`}
                                >
                                  {page}
                                </button>
                              </span>
                            );
                          })}
                      </div>
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-jost font-light"
                      >
                        {t('next', 'Next')}
                      </button>
                    </div>
                  )}

                  {/* Results info */}
                  <p className="mt-4 text-center text-sm text-gray-500 font-jost font-light">
                    {t('showing_posts', 'Showing')} {(currentPage - 1) * postsPerPage + 1} - {Math.min(currentPage * postsPerPage, totalPosts)} {t('of_posts', 'of')} {totalPosts} {t('posts_label', 'posts')}
                  </p>
                </>
              )}
            </div>

            {/* Sidebar - Hidden on mobile */}
            <aside className="hidden lg:block lg:w-[420px] flex-shrink-0">
              {/* Search */}
              <div className="bg-gray-50 p-6 mb-6">
                <h3 className="text-lg font-logga text-[#495D4D] mb-4">{t("search_title", "Search")}</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t("search_placeholder", "Search articles...")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 focus:border-[#495D4D] focus:outline-none font-jost font-light"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                </div>
              </div>

              {/* Featured Cabin */}
              <BlogSidebarCabin />
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
