'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  updatedAt?: string;
}

export default function StaticPage() {
  const params = useParams();
  const slug = params.slug as string;
  const locale = (params?.locale as string) || 'en';

  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      if (!slug) return;

      try {
        const response = await fetch(`/api/pages/slug/${slug}`, {
          headers: {
            'x-language': locale,
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            setError('Page not found');
          } else {
            setError('Failed to load page');
          }
          return;
        }

        const data = await response.json();
        setPage(data);
      } catch (err) {
        console.error('Error fetching page:', err);
        setError('Failed to load page');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug, locale]);

  if (loading) {
    return (
      <main>
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5 mx-auto"></div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error || !page) {
    return (
      <main>
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h1 className="text-2xl font-logga text-[#495D4D] mb-4">
              {error || 'Page not found'}
            </h1>
            <Link
              href={`/${locale}`}
              className="inline-block bg-[#F49A4A] text-white px-6 py-3 hover:bg-[#e08c3c] transition-colors font-jost"
            >
              Back to Home
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[250px] md:h-[300px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/assets/d206536ef067f64b29cad184324fe360bb763e30.jpg)',
          }}
        >
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.50)' }}></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-logga">
            {page.title}
          </h1>
        </div>
      </section>

      {/* Page Content */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Link */}
          <Link
            href={`/${locale}`}
            className="inline-flex items-center text-[#495D4D] hover:text-[#F49A4A] mb-8 transition-colors font-jost font-light"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Back to Home
          </Link>

          {/* Content */}
          <article className="prose prose-lg max-w-none">
            <div
              className="page-content font-jost font-light text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </article>
        </div>
      </section>

      {/* Content Styling */}
      <style jsx global>{`
        .page-content h1,
        .page-content h2,
        .page-content h3,
        .page-content h4,
        .page-content h5,
        .page-content h6 {
          font-family: 'Logga', serif;
          color: #495D4D;
          margin-top: 1.5em;
          margin-bottom: 0.75em;
        }

        .page-content h2 {
          font-size: 1.75rem;
        }

        .page-content h3 {
          font-size: 1.5rem;
        }

        .page-content h4 {
          font-size: 1.25rem;
        }

        .page-content p {
          margin-bottom: 1.25em;
          line-height: 1.8;
        }

        .page-content ul,
        .page-content ol {
          margin-bottom: 1.25em;
          padding-left: 1.5em;
        }

        .page-content li {
          margin-bottom: 0.5em;
        }

        .page-content a {
          color: #F49A4A;
          text-decoration: underline;
        }

        .page-content a:hover {
          color: #e08c3c;
        }

        .page-content blockquote {
          border-left: 4px solid #495D4D;
          padding-left: 1em;
          margin: 1.5em 0;
          font-style: italic;
          color: #666;
        }

        .page-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5em 0;
        }

        .page-content th,
        .page-content td {
          border: 1px solid #ddd;
          padding: 0.75em;
          text-align: left;
        }

        .page-content th {
          background-color: #f5f5f5;
          font-weight: 600;
        }

        .page-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1.5em 0;
        }
      `}</style>
    </main>
  );
}
