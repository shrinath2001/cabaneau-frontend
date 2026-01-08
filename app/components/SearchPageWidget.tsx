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
  const children = searchParams.get('children') || '0';
  const infants = searchParams.get('infants') || '0';
  const pets = searchParams.get('pets') || '0';

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
        #lodgify-search-bar {
          width: 100%;
          background: #f5f5f5 !important;
          border: 1px solid #e0e0e0 !important;
        }

        #lodgify-search-bar *,
        #lodgify-search-bar > div,
        #lodgify-search-bar > div > div {
          border-color: #e0e0e0 !important;
        }

        #lodgify-search-bar input,
        #lodgify-search-bar button:not([type="submit"]) {
          color: #333 !important;
          background: transparent !important;
        }

        #lodgify-search-bar,
        #lodgify-search-bar label,
        #lodgify-search-bar span:not([class*="SearchButton"] span) {
          color: #333 !important;
        }

        #lodgify-search-bar svg:not([class*="SearchButton"] svg) {
          color: #666 !important;
          fill: #666 !important;
        }

        /* Search button styling */
        #lodgify-search-bar button[type="submit"],
        #lodgify-search-bar a[href*="search"],
        #lodgify-search-bar [class*="SearchButton"] {
          background: #495d4d !important;
          border-radius: 0 !important;
          min-width: 52px !important;
          max-width: 52px !important;
          min-height: 52px !important;
          padding: 0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 0 !important;
          text-indent: -9999px !important;
        }

        #lodgify-search-bar button[type="submit"] span,
        #lodgify-search-bar a[href*="search"] span {
          display: none !important;
        }

        #lodgify-search-bar button[type="submit"] svg,
        #lodgify-search-bar a[href*="search"] svg {
          display: block !important;
          width: 20px !important;
          height: 20px !important;
          text-indent: 0 !important;
          color: white !important;
          fill: white !important;
        }

        #lodgify-search-bar button[type="submit"]:hover,
        #lodgify-search-bar a[href*="search"]:hover {
          background: #3d5a3d !important;
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
          data-has-guests-breakdown
          data-hide-location
          // Pre-fill with current search params
          {...(arrival && { 'data-arrival': formatForLodgify(arrival) })}
          {...(departure && { 'data-departure': formatForLodgify(departure) })}
          {...(adults && adults !== '0' && { 'data-adults': adults })}
          {...(children && children !== '0' && { 'data-children': children })}
          {...(infants && infants !== '0' && { 'data-infants': infants })}
          {...(pets && pets !== '0' && { 'data-pets': pets })}
          // Labels
          data-dates-check-in-label="Check-in"
          data-dates-check-out-label="Check-out"
          data-guests-counter-label="Guests"
          data-guests-input-singular-label="{{NumberOfGuests}} guest"
          data-guests-input-plural-label="{{NumberOfGuests}} guests"
          data-search-button-label="Search"
          data-dates-input-min-stay-tooltip-text='{"one":"Minimum {minStay} night","other":"Minimum {minStay} nights"}'
          data-guests-breakdown-label="Guests"
          data-adults-label='{"one":"adult","other":"adults"}'
          data-adults-description="Ages 18 or above"
          data-children-label='{"one":"child","other":"children"}'
          data-children-description="Ages 2-17"
          data-children-not-allowed-label="Not suitable for children"
          data-infants-label='{"one":"infant","other":"infants"}'
          data-infants-description="Under 2"
          data-infants-not-allowed-label="Not suitable for infants"
          data-pets-label='{"one":"pet","other":"pets"}'
          data-pets-not-allowed-label="Not allowed"
          data-done-label="Done"
        />
      </div>
    </>
  );
};

export default SearchPageWidget;
