'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { apiFetch } from '@/app/lib/api';

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

interface BlogResponse {
  data: BlogPost[];
  page: number;
  limit: number;
  total: number;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await apiFetch('/api/blog');
        const result: BlogResponse = await response.json();
        setPosts(result.data || []);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
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
        <h1 className="relative z-10 text-white text-4xl md:text-5xl lg:text-6xl font-custom text-center px-4">
          BLOG
        </h1>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No blog posts found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article key={post.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <Link href={`/blog/${post.slug}`}>
                    <div className="relative h-48 w-full bg-gray-200">
                      {post.featuredImage ? (
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-gray-400 text-4xl">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      {post.category && (
                        <span className="inline-block bg-[#495D4D] text-white text-xs px-2 py-1 rounded mb-3">
                          {post.category.name}
                        </span>
                      )}
                      <h2 className="text-xl font-semibold text-[#495D4D] mb-2 line-clamp-2">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{formatDate(post.publishedAt)}</span>
                        <span className="text-[#F49A4A] font-medium">Read more</span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
