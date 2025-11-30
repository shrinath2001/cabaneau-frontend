'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Header from './Header';
import Header2 from './Header2';

export default function ConditionalHeader() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [showHeader2, setShowHeader2] = useState(false);

  useEffect(() => {
    if (!isHomePage) return;

    let observer: IntersectionObserver | null = null;

    // Small delay to ensure marker is in DOM and positioned
    const timer = setTimeout(() => {
      const marker = document.getElementById('header-scroll-marker');
      if (!marker) return;

      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          // Show Header2 only when marker is above viewport (scrolled past)
          // Hide Header2 when marker is at or below the top of viewport
          setShowHeader2(entry.boundingClientRect.top < 0);
        },
        {
          threshold: 0,
          rootMargin: '0px',
          root: null
        }
      );

      observer.observe(marker);
    }, 100);

    return () => {
      clearTimeout(timer);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [isHomePage]);

  // On other pages, always show Header2
  if (!isHomePage) {
    return <Header2 />;
  }

  // On homepage, show both: Header always (for hero), and Header2 on top when scrolled
  return (
    <>
      <Header />
      <div
        className={`transition-opacity duration-300 ease-in-out ${
          showHeader2
            ? 'opacity-100'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <Header2 />
      </div>
    </>
  );
}
