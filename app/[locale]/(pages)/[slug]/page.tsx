import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
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

async function getPage(slug: string, locale: string): Promise<Page | null> {
  const apiKey = process.env.API_KEY;
  const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';

  try {
    const response = await fetch(`${apiBaseUrl}/pages/slug/${slug}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey || '',
        'Accept-Language': locale || 'en',
      },
      next: { revalidate: 300 },
    });

    if (response.status === 404) return null;
    if (!response.ok) {
      console.error('Failed to fetch page:', response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching page:', error);
    return null;
  }
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
  const page = await getPage(slug, locale);

  if (!page) {
    return { title: 'Page not found - Cabaneau' };
  }

  return {
    title: page.metaTitle || `${page.title} - Cabaneau`,
    description: page.metaDescription || undefined,
  };
}

export default async function StaticPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug, locale } = await params;
  const page = await getPage(slug, locale);

  if (!page) {
    notFound();
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

      {/* Content Styling - plain <style> (not styled-jsx's `jsx global`,
          which needs client runtime) since this is a Server Component;
          the CSS itself is unchanged, just how it's emitted. */}
      <style>{`
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
