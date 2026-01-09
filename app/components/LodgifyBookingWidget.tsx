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
          min-width: 60px !important;
          max-width: 60px !important;
          min-height: 60px !important;
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

        /* Force single row layout - target the actual Lodgify section */
        #portable-search-bar,
        #lodgify-search-bar > div > section,
        #lodgify-search-bar section {
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          align-items: center !important;
          gap: 16px !important;
          width: 100% !important;
          padding: 0 !important;
        }

        /* Hide the empty first div */
        #portable-search-bar > div:first-child:empty {
          display: none !important;
        }

        /* Date picker button - no border */
        #portable-search-bar > button,
        #lodgify-search-bar button[aria-haspopup="dialog"] {
          flex: 0 0 auto !important;
          min-width: 280px !important;
          padding: 0 !important;
          border: none !important;
          border-radius: 0 !important;
          outline: none !important;
          box-shadow: none !important;
          background: transparent !important;
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          gap: 0 !important;
        }

        /* Remove outline/border from date picker fields - prevent text wrap */
        #portable-search-bar .css-hd63sv,
        #portable-search-bar > button > div,
        #lodgify-search-bar button[aria-haspopup="dialog"] > div {
          outline: none !important;
          border: none !important;
          box-shadow: none !important;
          white-space: nowrap !important;
          flex: 1 !important;
          padding: 4px 16px !important;
        }


        /* Date fields inside button - horizontal */
        #portable-search-bar > button > div,
        #lodgify-search-bar button[aria-haspopup="dialog"] > div {
          flex: 1 !important;
          min-width: 0 !important;
        }

        /* Guest counter (desktop) - styled like reference */
        #portable-search-bar > div:not(:first-child),
        #lodgify-search-bar .styled-override {
          flex: 1 1 auto !important;
          min-width: 180px !important;
          padding: 8px 16px !important;
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          gap: 8px !important;
        }

        /* Guest counter inner container - horizontal layout */
        #portable-search-bar > div:not(:first-child) > div,
        #lodgify-search-bar .styled-override > div {
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          gap: 8px !important;
        }

        /* Guest label styling */
        #portable-search-bar > div:not(:first-child) label,
        #lodgify-search-bar .styled-override label {
          font-size: 14px !important;
          opacity: 1 !important;
        }

        /* Search link - fixed width, taller to match container (desktop) */
        #portable-search-bar > a,
        #lodgify-search-bar a[data-testid="button"] {
          flex: 0 0 60px !important;
          min-width: 60px !important;
          max-width: 60px !important;
          min-height: 60px !important;
          height: 60px !important;
          border-radius: 0 !important;
        }

        /* Mobile-specific: Single row layout */
        @media (max-width: 768px) {
          /* Force container to full width, single row */
          #portable-search-bar,
          #portable-search-bar.css-jj122v,
          #lodgify-search-bar section,
          section#portable-search-bar {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: nowrap !important;
            align-items: stretch !important;
            gap: 0 !important;
            padding: 0 !important;
            width: auto !important;
            max-width: 100% !important;
            min-width: auto !important;
          }

          /* Hide the empty first div */
          #portable-search-bar > div:first-child:empty {
            display: none !important;
          }

          /* Date picker - takes available width */
          #portable-search-bar > button,
          #lodgify-search-bar button[aria-haspopup="dialog"] {
            flex: 1 1 auto !important;
            min-width: 0 !important;
            max-width: none !important;
            padding: 0 !important;
            min-height: 48px !important;
            border: none !important;
            outline: none !important;
            box-shadow: none !important;
          }

          /* Date picker inner divs - horizontal layout */
          #portable-search-bar > button > div,
          #lodgify-search-bar button[aria-haspopup="dialog"] > div {
            padding: 8px 12px !important;
            white-space: nowrap !important;
            outline: none !important;
            border: none !important;
          }

          /* Date labels */
          #portable-search-bar label,
          #lodgify-search-bar label {
            font-size: 10px !important;
            line-height: 1.2 !important;
            font-weight: 500 !important;
            text-transform: uppercase !important;
            opacity: 0.85 !important;
            letter-spacing: 0.3px !important;
          }

          /* Date values */
          #portable-search-bar button > div > div:last-child,
          #lodgify-search-bar button[aria-haspopup="dialog"] > div > div:last-child {
            font-size: 14px !important;
            line-height: 1.3 !important;
            font-weight: 500 !important;
          }

          /* Guest counter */
          #portable-search-bar > div.styled-override,
          #portable-search-bar > div:nth-child(3),
          #lodgify-search-bar .styled-override {
            flex: 0 0 auto !important;
            min-width: auto !important;
            max-width: none !important;
            padding: 4px 6px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 2px !important;
          }

          /* Guest counter inner - horizontal layout */
          #portable-search-bar > div.styled-override > div,
          #portable-search-bar > div:nth-child(3) > div,
          #lodgify-search-bar .styled-override > div {
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            gap: 2px !important;
          }

          /* Guest counter buttons */
          #portable-search-bar > div.styled-override button,
          #portable-search-bar > div:nth-child(3) button,
          #lodgify-search-bar .styled-override button {
            padding: 2px !important;
            min-width: 24px !important;
            width: 24px !important;
            height: 24px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 14px !important;
            border-radius: 0 !important;
          }

          /* Guest counter input */
          #portable-search-bar input[type="number"],
          #lodgify-search-bar .styled-override input[type="number"] {
            width: 18px !important;
            min-width: 18px !important;
            padding: 0 !important;
            text-align: center !important;
            font-size: 13px !important;
            font-weight: 600 !important;
          }

          /* Guest label text */
          #portable-search-bar > div:nth-child(3) span,
          #portable-search-bar .styled-override span {
            font-size: 12px !important;
            margin-left: 2px !important;
          }

          /* Search button - icon only, full height */
          #portable-search-bar > a,
          #lodgify-search-bar a[data-testid="button"] {
            flex: 0 0 auto !important;
            min-width: 56px !important;
            width: 56px !important;
            height: auto !important;
            min-height: 100% !important;
            align-self: stretch !important;
            border-radius: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 0 !important;
          }

          /* Hide search text on mobile - icon only */
          #portable-search-bar > a span,
          #lodgify-search-bar a[data-testid="button"] span {
            display: none !important;
          }

          #portable-search-bar > a svg,
          #lodgify-search-bar a[data-testid="button"] svg {
            width: 18px !important;
            height: 18px !important;
          }

          /* Selected date values - compact single line */
          #portable-search-bar p.date,
          #portable-search-bar p.date.has-value,
          #lodgify-search-bar p.date,
          #lodgify-search-bar p[data-testid="start-date"],
          #lodgify-search-bar p[data-testid="end-date"] {
            font-size: 12px !important;
            line-height: 1.2 !important;
            white-space: nowrap !important;
            margin: 0 !important;
            padding: 0 !important;
            display: block !important;
          }

          /* Date picker inner divs - tighter spacing when dates selected */
          #portable-search-bar .css-hd63sv,
          #portable-search-bar > button > div.left,
          #portable-search-bar > button > div.right {
            padding: 4px 8px !important;
            gap: 2px !important;
            min-width: auto !important;
          }

          /* Labels when dates are selected */
          #portable-search-bar label.has-value,
          #lodgify-search-bar label.has-value {
            font-size: 9px !important;
            line-height: 1.1 !important;
            margin-bottom: 1px !important;
          }

          /* Hide the date input (it's hidden anyway but ensure) */
          #portable-search-bar input[type="date"],
          #lodgify-search-bar input[type="date"] {
            display: none !important;
          }

          /* Hide clear button completely */
          #portable-search-bar [data-testid="date-picker-clear-cta"],
          #lodgify-search-bar [data-testid="date-picker-clear-cta"] {
            display: none !important;
          }

          /* Glass morphism on mobile */
          #lodgify-search-bar {
            background: rgba(255, 255, 255, 0.12) !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
            border: none !important;
            border-radius: 0 !important;
          }

          /* Override wrapper parent styling on mobile */
          #lodgify-search-bar,
          #lodgify-search-bar * {
            box-sizing: border-box !important;
          }
        }

        /* Extra small mobile (iPhone SE, etc) */
        @media (max-width: 400px) {
          /* Slightly smaller text */
          #portable-search-bar label,
          #lodgify-search-bar label {
            font-size: 9px !important;
          }

          #portable-search-bar button > div > div:last-child,
          #lodgify-search-bar button[aria-haspopup="dialog"] > div > div:last-child {
            font-size: 13px !important;
          }

          /* Tighter padding on date fields */
          #portable-search-bar > button > div,
          #lodgify-search-bar button[aria-haspopup="dialog"] > div {
            padding: 6px 10px !important;
          }

          /* Smaller guest buttons */
          #portable-search-bar > div:not(:first-child) button,
          #lodgify-search-bar .styled-override button {
            min-width: 26px !important;
            width: 26px !important;
            height: 26px !important;
          }

          /* Smaller search button height */
          #portable-search-bar > a,
          #lodgify-search-bar a[data-testid="button"] {
            height: 44px !important;
            min-height: 56px !important;
          }
        }
      `}</style>

      <div className="w-full md:w-auto md:inline-flex relative z-10 bg-white/10 backdrop-blur-sm md:rounded">
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
