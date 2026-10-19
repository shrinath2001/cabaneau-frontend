'use client';

import Link from "next/link";
import { useTranslations } from '@/app/providers/TranslationsProvider';

export default function BlogPostNotFound() {
  const { t: tb } = useTranslations('blog');
  return (
    <main>
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-2xl font-logga text-[#495D4D] mb-4">{tb('post_not_found')}</h1>
          <Link
            href="/blog"
            className="inline-block bg-[#F49A4A] text-white px-6 py-3 hover:bg-[#e08c3c] transition-colors font-jost"
          >
            {tb('back_to_blog')}
          </Link>
        </div>
      </section>
    </main>
  );
}
