'use client';

import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import { useTranslations } from '@/app/providers/TranslationsProvider';

interface PromoBannerData {
  text: string;
  link?: string;
  backgroundColor: string;
  textColor: string;
}

const PromoBanner = () => {
  const { locale } = useTranslations();
  const [mounted, setMounted] = useState(false);
  const [banner, setBanner] = useState<PromoBannerData | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  // Ensure component only renders on client
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchBanner = async () => {
      try {
        const response = await fetch('/api/promo-banner', {
          headers: {
            'x-language': locale,
          },
        });
        if (response.ok) {
          const text = await response.text();
          if (text) {
            const data = JSON.parse(text);
            if (data && data.text) {
              setBanner(data);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch promo banner:', error);
      }
    };

    fetchBanner();
  }, [locale, mounted]);

  // Update CSS variable when banner is shown/hidden
  // Use useLayoutEffect to update before paint, preventing visual jump
  useLayoutEffect(() => {
    if (!mounted) return;

    if (banner && !dismissed && bannerRef.current) {
      const height = bannerRef.current.offsetHeight;
      document.documentElement.style.setProperty('--promo-banner-height', `${height}px`);
    } else {
      document.documentElement.style.setProperty('--promo-banner-height', '0px');
    }
    // No cleanup - we only reset when banner is actually dismissed/hidden
  }, [banner, dismissed, mounted]);

  // Don't render anything until mounted on client
  if (!mounted || !banner || dismissed) {
    return null;
  }

  const content = (
    <span className="text-sm font-jost font-medium">{banner.text}</span>
  );

  return (
    <div
      ref={bannerRef}
      className="fixed top-0 left-0 w-full py-2 px-4 text-center z-[60]"
      style={{
        backgroundColor: banner.backgroundColor,
        color: banner.textColor,
      }}
    >
      {banner.link ? (
        banner.link.startsWith('http') ? (
          <a
            href={banner.link}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {content}
          </a>
        ) : (
          <Link href={banner.link} className="hover:underline">
            {content}
          </Link>
        )
      ) : (
        content
      )}
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity"
        style={{ color: banner.textColor }}
        aria-label="Dismiss banner"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default PromoBanner;
