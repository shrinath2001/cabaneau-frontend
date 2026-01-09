'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * Lodgify Search Widget for the Search Results Page
 *
 * This is a separate component from LodgifyBookingWidget because:
 * 1. Different styling (light background vs glass/hero)
 * 2. Pre-filled with URL search parameters
 * 3. Needs to force script re-initialization on SPA navigation
 *
 * The Lodgify script only initializes widgets present when it first loads.
 * For SPA navigation, we need to remove and re-add the script.
 */
const SearchPageWidget = () => {
  const searchParams = useSearchParams();
  const widgetRef = useRef<HTMLDivElement>(null);

  // Parse URL params (Lodgify format: YYYYMMDD, also support ISO: YYYY-MM-DD)
  const arrival = searchParams.get('arrival') || '';
  const departure = searchParams.get('departure') || '';
  const adults = searchParams.get('adults') || '1';

  // Convert ISO date (YYYY-MM-DD) to Lodgify format (YYYYMMDD)
  const formatForLodgify = (date: string) => {
    if (!date) return '';
    return date.includes('-') ? date.replace(/-/g, '') : date;
  };

  useEffect(() => {
    const scriptUrl = 'https://app.lodgify.com/portable-search-bar/stable/renderPortableSearchBar.js';

    // Force re-initialization by removing existing script
    const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);
    if (existingScript) {
      existingScript.remove();
    }

    // Small delay to ensure DOM is ready and old script is cleaned up
    const timer = setTimeout(() => {
      const script = document.createElement('script');
      script.src = scriptUrl;
      script.async = true;
      document.head.appendChild(script);
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Build search page URL
  const searchPageUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/search`
    : '/search';

  return (
    <>
      <style jsx global>{`
        /* Search Page Widget - Light Theme */
        :root {
          --ldg-component-modal-z-index: 9999;
        }

        #lodgify-search-bar {
          width: 100%;
          background: transparent !important;
          border: none !important;
        }

        /* Reset all inner elements */
        #lodgify-search-bar *,
        #lodgify-search-bar > div,
        #lodgify-search-bar > div > div {
          background: transparent !important;
          box-shadow: none !important;
        }

        #lodgify-search-bar input,
        #lodgify-search-bar button:not([type="submit"]) {
          color: #333 !important;
          background: transparent !important;
        }

        #lodgify-search-bar,
        #lodgify-search-bar label,
        #lodgify-search-bar span {
          color: #333 !important;
        }

        #lodgify-search-bar svg:not(a svg) {
          color: #666 !important;
          fill: #666 !important;
        }

        /* Force single row layout */
        #portable-search-bar,
        #lodgify-search-bar section {
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          align-items: stretch !important;
          gap: 0 !important;
          padding: 0 !important;
        }

        /* Date picker button */
        #portable-search-bar > button,
        #lodgify-search-bar button[aria-haspopup="dialog"] {
          flex: 0 0 auto !important;
          padding: 0 !important;
          border: 1px solid #e0e0e0 !important;
          border-right: none !important;
          border-radius: 0 !important;
          outline: none !important;
        }

        /* Date picker inner divs - with border between check-in and check-out */
        #portable-search-bar > button > div,
        #lodgify-search-bar button[aria-haspopup="dialog"] > div {
          padding: 12px 20px !important;
          white-space: nowrap !important;
          border: none !important;
          outline: none !important;
        }

        /* Add border between check-in and check-out */
        #portable-search-bar > button > div.right,
        #portable-search-bar > button > div:last-of-type {
          border-left: 1px solid #e0e0e0 !important;
        }

        /* Guest counter with border */
        #portable-search-bar > div:not(:first-child),
        #lodgify-search-bar .styled-override {
          border: 1px solid #e0e0e0 !important;
          border-right: none !important;
          border-radius: 0 !important;
          padding: 12px 20px !important;
        }

        /* Hide clear button completely */
        #portable-search-bar [data-testid="date-picker-clear-cta"],
        #lodgify-search-bar [data-testid="date-picker-clear-cta"] {
          display: none !important;
        }

        /* Search button styling - icon only, hide text */
        #portable-search-bar > a,
        #lodgify-search-bar a[data-testid="button"] {
          background: #495d4d !important;
          border-radius: 0 !important;
          min-width: 56px !important;
          width: 56px !important;
          align-self: stretch !important;
          padding: 0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          border: 1px solid #495d4d !important;
          /* Hide text by making it zero-sized and transparent */
          font-size: 0 !important;
          color: transparent !important;
          overflow: hidden !important;
        }

        /* SVG icon in search button */
        #portable-search-bar > a svg,
        #portable-search-bar > a svg.css-17l641c,
        #lodgify-search-bar a[data-testid="button"] svg {
          display: block !important;
          width: 20px !important;
          min-width: 20px !important;
          height: 20px !important;
          min-height: 20px !important;
          color: white !important;
          fill: white !important;
          flex-shrink: 0 !important;
        }

        #portable-search-bar > a svg *,
        #portable-search-bar > a svg path,
        #lodgify-search-bar a[data-testid="button"] svg *,
        #lodgify-search-bar a[data-testid="button"] svg path {
          fill: white !important;
        }

        #portable-search-bar > a:hover,
        #lodgify-search-bar a[data-testid="button"]:hover {
          background: #3d5a3d !important;
          border-color: #3d5a3d !important;
        }
      `}</style>

      <div className="w-full max-w-[650px]">
        <div
          ref={widgetRef}
          id="lodgify-search-bar"
          data-website-id="572847"
          data-language-code="en"
          data-search-page-url={searchPageUrl}
          data-new-tab="false"
          data-version="stable"
          data-hide-location
          // Pre-fill with current search params (guests go as adults)
          {...(arrival && { 'data-arrival': formatForLodgify(arrival) })}
          {...(departure && { 'data-departure': formatForLodgify(departure) })}
          {...(adults && adults !== '0' && { 'data-adults': adults })}
          // Labels
          data-dates-check-in-label="Check-in"
          data-dates-check-out-label="Check-out"
          data-guests-counter-label="Guests"
          data-guests-input-singular-label="{{NumberOfGuests}} guest"
          data-guests-input-plural-label="{{NumberOfGuests}} guests"
          data-search-button-label="Search"
          data-dates-input-min-stay-tooltip-text='{"one":"Minimum {minStay} night","other":"Minimum {minStay} nights"}'
        />
      </div>
    </>
  );
};

export default SearchPageWidget;
