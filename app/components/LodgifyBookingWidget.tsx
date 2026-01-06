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
          --ldg-psb-background: rgba(255, 255, 255, 0.15);
          --ldg-psb-border-radius: 0;
          --ldg-psb-box-shadow: none;
          --ldg-psb-padding: 0;
          --ldg-psb-input-background: rgba(255, 255, 255, 0.2);
          --ldg-psb-button-border-radius: 0;

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
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        /* Override input styling for glass look */
        #lodgify-search-bar input,
        #lodgify-search-bar button:not([type="submit"]) {
          color: white !important;
          background: transparent !important;
        }

        #lodgify-search-bar input::placeholder {
          color: rgba(255, 255, 255, 0.8) !important;
        }

        /* Style the labels/text */
        #lodgify-search-bar label,
        #lodgify-search-bar span:not([class*="button"]) {
          color: white !important;
        }

        /* Search button styling */
        #lodgify-search-bar button[type="submit"],
        #lodgify-search-bar [class*="search-button"],
        #lodgify-search-bar [class*="SearchButton"] {
          background-color: #495d4d !important;
          border-radius: 0 !important;
          min-height: 52px;
        }

        #lodgify-search-bar button[type="submit"]:hover {
          background-color: #3d5a3d !important;
        }

        /* Icon colors */
        #lodgify-search-bar svg {
          color: white !important;
          fill: white !important;
        }

        /* Dividers between fields */
        #lodgify-search-bar > div > div {
          border-color: rgba(255, 255, 255, 0.2) !important;
        }
      `}</style>

      <div className="w-full max-w-[650px] relative z-10 bg-white/10 backdrop-blur-sm">
        <div
          id="lodgify-search-bar"
          data-website-id="572847"
          data-language-code={languageCode}
          data-search-page-url={searchPageUrl}
          data-new-tab="false"
          data-version="stable"
          data-has-guests-breakdown
          data-hide-location
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

export default LodgifyBookingWidget;
