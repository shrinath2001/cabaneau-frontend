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

        /* Force single row layout - target the actual Lodgify section */
        #portable-search-bar,
        #lodgify-search-bar > div > section,
        #lodgify-search-bar section {
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          align-items: center !important;
          gap: 8px !important;
          width: 100% !important;
        }

        /* Hide the empty first div */
        #portable-search-bar > div:first-child:empty {
          display: none !important;
        }

        /* Date picker button - flex grow (desktop) */
        #portable-search-bar > button,
        #lodgify-search-bar button[aria-haspopup="dialog"] {
          flex: 1 1 auto !important;
          min-width: 0 !important;
          padding: 12px 16px !important;
        }

        /* Date fields inside button - horizontal */
        #portable-search-bar > button > div,
        #lodgify-search-bar button[aria-haspopup="dialog"] > div {
          flex: 1 !important;
          min-width: 0 !important;
        }

        /* Guest counter (desktop) */
        #portable-search-bar > div:not(:first-child),
        #lodgify-search-bar .styled-override {
          flex: 0 0 auto !important;
          min-width: 120px !important;
          padding: 8px !important;
        }

        /* Search link - fixed width (desktop) */
        #portable-search-bar > a,
        #lodgify-search-bar a[data-testid="button"] {
          flex: 0 0 52px !important;
          min-width: 52px !important;
          max-width: 52px !important;
        }

        /* Mobile-specific compact styles */
        @media (max-width: 768px) {
          /* Container spacing */
          #portable-search-bar,
          #lodgify-search-bar section {
            padding: 6px !important;
            gap: 4px !important;
          }

          /* Date picker button - more compact */
          #portable-search-bar > button,
          #lodgify-search-bar button[aria-haspopup="dialog"] {
            padding: 6px 8px !important;
            min-height: 44px !important;
          }

          /* Compact date labels */
          #portable-search-bar label,
          #lodgify-search-bar label {
            font-size: 9px !important;
            line-height: 1.1 !important;
            margin-bottom: 2px !important;
            font-weight: 500 !important;
            letter-spacing: 0.3px !important;
            text-transform: uppercase !important;
            opacity: 0.9 !important;
          }

          /* Date values - more compact display */
          #portable-search-bar button > div > div:last-child,
          #lodgify-search-bar button[aria-haspopup="dialog"] > div > div:last-child {
            font-size: 13px !important;
            line-height: 1.3 !important;
            font-weight: 500 !important;
          }

          /* Hide full month names on mobile - show abbreviated */
          #portable-search-bar button span[class*="css-"],
          #lodgify-search-bar button[aria-haspopup="dialog"] span[class*="css-"] {
            max-width: 60px !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            white-space: nowrap !important;
          }

          /* Clear dates button (X) - better positioning */
          #portable-search-bar button[class*="css-1ofmm03"],
          #lodgify-search-bar button[class*="css-1ofmm03"],
          #portable-search-bar button[aria-label*="clear"],
          #lodgify-search-bar button[aria-label*="clear"] {
            position: absolute !important;
            right: 4px !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            width: 20px !important;
            height: 20px !important;
            padding: 2px !important;
            opacity: 0.7 !important;
            background: rgba(255, 255, 255, 0.1) !important;
            border-radius: 50% !important;
          }

          #portable-search-bar button[class*="css-1ofmm03"]:hover,
          #lodgify-search-bar button[class*="css-1ofmm03"]:hover {
            opacity: 1 !important;
            background: rgba(255, 255, 255, 0.2) !important;
          }

          /* Guest counter - ultra compact */
          #portable-search-bar > div:not(:first-child),
          #lodgify-search-bar .styled-override {
            min-width: 90px !important;
            max-width: 90px !important;
            padding: 2px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }

          /* Guest counter buttons - smaller and tighter */
          #portable-search-bar > div:not(:first-child) button,
          #lodgify-search-bar .styled-override button,
          .styled-override button[class*="css-9vzmy9"] {
            padding: 2px !important;
            min-width: 24px !important;
            max-width: 24px !important;
            width: 24px !important;
            height: 24px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 16px !important;
            line-height: 1 !important;
            border-radius: 2px !important;
            margin: 0 !important;
          }

          /* Guest counter number display */
          #portable-search-bar > div:not(:first-child) > div,
          #lodgify-search-bar .styled-override > div,
          .styled-override > div {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 4px !important;
          }

          #portable-search-bar input[type="number"],
          #lodgify-search-bar .styled-override input[type="number"] {
            width: 28px !important;
            min-width: 28px !important;
            max-width: 28px !important;
            padding: 0 2px !important;
            text-align: center !important;
            font-size: 14px !important;
            font-weight: 600 !important;
            margin: 0 !important;
          }

          /* Search button - smaller on mobile */
          #portable-search-bar > a,
          #lodgify-search-bar a[data-testid="button"] {
            min-width: 40px !important;
            max-width: 40px !important;
            min-height: 40px !important;
            flex: 0 0 40px !important;
            padding: 8px !important;
          }

          #portable-search-bar > a svg,
          #lodgify-search-bar a[data-testid="button"] svg {
            width: 18px !important;
            height: 18px !important;
          }

          /* Improve glass morphism effect on mobile */
          #lodgify-search-bar {
            background: rgba(255, 255, 255, 0.12) !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
            border: 1px solid rgba(255, 255, 255, 0.15) !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
          }

          /* Better vertical alignment for all elements */
          #portable-search-bar > *,
          #lodgify-search-bar section > * {
            align-self: center !important;
          }
        }

        /* Extra small mobile optimization (iPhone SE, etc) */
        @media (max-width: 400px) {
          /* Even tighter spacing */
          #portable-search-bar,
          #lodgify-search-bar section {
            padding: 4px !important;
            gap: 3px !important;
          }

          /* Ultra compact guest counter */
          #portable-search-bar > div:not(:first-child),
          #lodgify-search-bar .styled-override {
            min-width: 80px !important;
            max-width: 80px !important;
          }

          /* Smaller guest counter buttons */
          #portable-search-bar > div:not(:first-child) button,
          #lodgify-search-bar .styled-override button,
          .styled-override button[class*="css-9vzmy9"] {
            min-width: 22px !important;
            max-width: 22px !important;
            width: 22px !important;
            height: 22px !important;
            font-size: 14px !important;
          }

          #portable-search-bar input[type="number"],
          #lodgify-search-bar .styled-override input[type="number"] {
            width: 26px !important;
            min-width: 26px !important;
            max-width: 26px !important;
            font-size: 13px !important;
          }

          /* Smaller date text */
          #portable-search-bar button > div > div:last-child,
          #lodgify-search-bar button[aria-haspopup="dialog"] > div > div:last-child {
            font-size: 12px !important;
          }

          #portable-search-bar label,
          #lodgify-search-bar label {
            font-size: 8px !important;
          }

          /* Smaller search button */
          #portable-search-bar > a,
          #lodgify-search-bar a[data-testid="button"] {
            min-width: 36px !important;
            max-width: 36px !important;
            min-height: 36px !important;
            flex: 0 0 36px !important;
          }

          #portable-search-bar > a svg,
          #lodgify-search-bar a[data-testid="button"] svg {
            width: 16px !important;
            height: 16px !important;
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
