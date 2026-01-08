'use client';

import { useEffect, useState } from 'react';

interface LodgifyBookingWidgetProps {
  languageCode?: string;
}

/**
 * Lodgify Portable Search Bar Widget
 *
 * Uses Lodgify's official widget for search functionality.
 * Redirects to /search on our site (not Lodgify's) after user searches.
 *
 * Lodgify handles all complex booking rules:
 * - Minimum stay per season/date
 * - Check-in day restrictions
 * - Blocked dates from bookings
 * - Guest policies (adults only, pets allowed, etc.)
 *
 * @see CLAUDE.md for integration details
 */
const LodgifyBookingWidget = ({ languageCode = 'en' }: LodgifyBookingWidgetProps) => {
  const [searchPageUrl, setSearchPageUrl] = useState('/search');

  useEffect(() => {
    // Set the full search page URL using current origin
    if (typeof window !== 'undefined') {
      setSearchPageUrl(`${window.location.origin}/search`);
    }
  }, []);

  useEffect(() => {
    // Official Lodgify Portable Search Bar script
    const scriptUrl = 'https://app.lodgify.com/portable-search-bar/stable/renderPortableSearchBar.js';

    // Check if script already exists
    if (document.querySelector(`script[src="${scriptUrl}"]`)) {
      return;
    }

    const script = document.createElement('script');
    script.src = scriptUrl;
    script.defer = true;
    document.head.appendChild(script);

    // No cleanup - script is expensive to reload
  }, []);

  return (
    <>
      <style jsx global>{`
        /* Lodgify Portable Search Bar - Cabaneau Glass Design */
        :root {
          /* Background & Layout - Glass effect */
          --ldg-psb-background: transparent !important;
          --ldg-psb-border-radius: 0 !important;
          --ldg-psb-box-shadow: none !important;
          --ldg-psb-padding: 0 !important;
          --ldg-psb-input-background: transparent !important;
          --ldg-psb-button-border-radius: 0 !important;

          /* Brand Colors - Cabaneau Green */
          --ldg-psb-color-primary: #495d4d;
          --ldg-psb-color-primary-lighter: #a4aea6;
          --ldg-psb-color-primary-darker: #252f27;
          --ldg-psb-color-primary-contrast: #ffffff;

          /* Semantic Colors */
          --ldg-semantic-color-primary: #495d4d;
          --ldg-semantic-color-primary-lighter: #a4aea6;
          --ldg-semantic-color-primary-darker: #252f27;
          --ldg-semantic-color-primary-contrast: #ffffff;

          /* Modal z-index */
          --ldg-component-modal-z-index: 999;
        }

        /* Glass morphism container */
        #lodgify-search-bar {
          width: 100%;
          background: rgba(255, 255, 255, 0.1) !important;
          backdrop-filter: blur(8px) !important;
          -webkit-backdrop-filter: blur(8px) !important;
        }

        /* Force transparent backgrounds on ALL elements */
        #lodgify-search-bar *,
        #lodgify-search-bar > div,
        #lodgify-search-bar > div > div,
        #lodgify-search-bar [class*="field"],
        #lodgify-search-bar [class*="Field"],
        #lodgify-search-bar [class*="input"],
        #lodgify-search-bar [class*="Input"],
        #lodgify-search-bar [class*="picker"],
        #lodgify-search-bar [class*="Picker"],
        #lodgify-search-bar [class*="date"],
        #lodgify-search-bar [class*="Date"],
        #lodgify-search-bar [class*="guest"],
        #lodgify-search-bar [class*="Guest"] {
          background: transparent !important;
          background-color: transparent !important;
          border: none !important;
          border-color: transparent !important;
          box-shadow: none !important;
        }

        /* Override input styling for glass look */
        #lodgify-search-bar input,
        #lodgify-search-bar button:not([type="submit"]) {
          color: white !important;
          background: transparent !important;
          background-color: transparent !important;
        }

        #lodgify-search-bar input::placeholder {
          color: rgba(255, 255, 255, 0.7) !important;
        }

        /* Style ALL text white */
        #lodgify-search-bar,
        #lodgify-search-bar *,
        #lodgify-search-bar label,
        #lodgify-search-bar span {
          color: white !important;
        }

        /* Search button/link - icon only, square shape */
        #lodgify-search-bar button[type="submit"],
        #lodgify-search-bar a[href*="search"],
        #lodgify-search-bar [class*="search-button"],
        #lodgify-search-bar [class*="SearchButton"],
        #lodgify-search-bar [class*="submit"],
        #lodgify-search-bar [class*="Submit"] {
          background: #495d4d !important;
          background-color: #495d4d !important;
          border-radius: 0 !important;
          min-width: 52px !important;
          max-width: 52px !important;
          min-height: 52px !important;
          padding: 0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          overflow: hidden !important;
          font-size: 0 !important;
          text-indent: -9999px !important;
        }

        /* Hide text in search button/link, show only icon */
        #lodgify-search-bar button[type="submit"] span,
        #lodgify-search-bar a[href*="search"] span,
        #lodgify-search-bar [class*="SearchButton"] span {
          display: none !important;
        }

        #lodgify-search-bar button[type="submit"] svg,
        #lodgify-search-bar a[href*="search"] svg,
        #lodgify-search-bar [class*="SearchButton"] svg {
          display: block !important;
          width: 20px !important;
          height: 20px !important;
          text-indent: 0 !important;
        }

        #lodgify-search-bar button[type="submit"]:hover,
        #lodgify-search-bar a[href*="search"]:hover,
        #lodgify-search-bar [class*="SearchButton"]:hover {
          background: #3d5a3d !important;
          background-color: #3d5a3d !important;
        }

        /* Icon colors - white */
        #lodgify-search-bar svg,
        #lodgify-search-bar svg * {
          color: white !important;
          fill: white !important;
        }

        /* Remove borders from date picker buttons */
        #lodgify-search-bar button[aria-label*="date"],
        #lodgify-search-bar button[aria-label*="Date"],
        #lodgify-search-bar [class*="DatePicker"],
        #lodgify-search-bar [class*="datePicker"] {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
        }

        /* Force single row layout on mobile */
        #lodgify-search-bar > div {
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          align-items: stretch !important;
          gap: 0 !important;
        }

        /* Make date fields share space equally */
        #lodgify-search-bar > div > div:first-child {
          flex: 1 !important;
          min-width: 0 !important;
        }

        /* Guest counter - compact */
        #lodgify-search-bar > div > div:nth-child(2) {
          flex: 0 0 auto !important;
          min-width: 80px !important;
        }

        /* Search button container */
        #lodgify-search-bar > div > div:last-child,
        #lodgify-search-bar > div > a:last-child {
          flex: 0 0 52px !important;
        }

        /* Date inputs side by side */
        #lodgify-search-bar [class*="dates"],
        #lodgify-search-bar [class*="Dates"] {
          display: flex !important;
          flex-direction: row !important;
          flex: 1 !important;
        }

        /* Compact date fields */
        #lodgify-search-bar [class*="check-in"],
        #lodgify-search-bar [class*="checkIn"],
        #lodgify-search-bar [class*="CheckIn"],
        #lodgify-search-bar [class*="check-out"],
        #lodgify-search-bar [class*="checkOut"],
        #lodgify-search-bar [class*="CheckOut"] {
          flex: 1 !important;
          min-width: 0 !important;
          padding: 8px !important;
        }

        /* Compact guest selector */
        #lodgify-search-bar [class*="guest"],
        #lodgify-search-bar [class*="Guest"] {
          padding: 4px 8px !important;
        }

        /* Smaller text on mobile */
        @media (max-width: 640px) {
          #lodgify-search-bar label,
          #lodgify-search-bar span {
            font-size: 12px !important;
          }

          #lodgify-search-bar button[type="submit"],
          #lodgify-search-bar a[href*="search"] {
            min-width: 44px !important;
            max-width: 44px !important;
            min-height: 44px !important;
          }
        }
      `}</style>

      <div className="w-full max-w-[800px] relative z-10 bg-white/10 backdrop-blur-sm">
        <div
          id="lodgify-search-bar"
          data-website-id="572847"
          data-language-code={languageCode}
          data-search-page-url={searchPageUrl}
          data-new-tab="false"
          data-version="stable"
          data-hide-location
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

export default LodgifyBookingWidget;
