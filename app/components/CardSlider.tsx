'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface CardSliderProps {
  children: React.ReactNode;
  /** Accessible label for the scroll arrows (e.g. "services"). */
  label: string;
}

/**
 * Horizontal card rail for the homepage sections.
 *
 * Stays a plain row while the cards fit the available width (so the current
 * 3-card layout is unchanged) and turns into a scrollable slider with arrows
 * as soon as they don't - which is what happens once a 4th or 5th card is
 * added in the CMS. Mobile keeps the existing stacked layout.
 */
const CardSlider = ({ children, label }: CardSliderProps) => {
  const railRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  // Track whether the cards still fit. Re-checked on resize because the rail
  // width changes with the viewport.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const measure = () => setIsOverflowing(rail.scrollWidth > rail.clientWidth + 1);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(rail);
    return () => observer.disconnect();
  }, [children]);

  const scrollBy = useCallback((direction: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * rail.clientWidth * 0.8, behavior: 'smooth' });
  }, []);

  return (
    <div className="relative">
      <div
        ref={railRef}
        className="flex flex-col md:flex-row gap-[18px] md:gap-3 md:justify-between md:overflow-x-auto md:snap-x md:snap-mandatory md:[scrollbar-width:none] md:[&::-webkit-scrollbar]:hidden md:[&>*]:shrink-0 md:[&>*]:snap-start"
      >
        {children}
      </div>

      {isOverflowing && (
        <>
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label={`Scroll ${label} left`}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-10 h-10 items-center justify-center bg-white shadow-md hover:bg-gray-50 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label={`Scroll ${label} right`}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-10 h-10 items-center justify-center bg-white shadow-md hover:bg-gray-50 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
};

export default CardSlider;
