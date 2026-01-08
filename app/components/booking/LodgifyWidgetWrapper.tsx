'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface CabinInfo {
  slug: string;
  name: string;
  lodgifyId: string;
}

interface LodgifyWidgetWrapperProps {
  cabin: CabinInfo;
  onSave: (params: {
    arrival: string;
    departure: string;
    adults: number;
    children: number;
  }) => void;
}

/**
 * LodgifyWidgetWrapper - Desktop widget with hidden "Book Now" and custom "Save" button
 *
 * Used when no dates are selected on desktop.
 * User selects dates/guests in Lodgify widget, then clicks "Save" to persist to URL.
 */
export default function LodgifyWidgetWrapper({
  cabin,
  onSave,
}: LodgifyWidgetWrapperProps) {
  const [widgetParams, setWidgetParams] = useState<{
    arrival: string;
    departure: string;
    adults: number;
    children: number;
  } | null>(null);
  const [canSave, setCanSave] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<MutationObserver | null>(null);

  // Extract params from Lodgify widget's checkout URL
  const extractParamsFromWidget = useCallback(() => {
    const bookNowLink = document.querySelector(
      '#lodgify-desktop-widget a[href*="checkout.lodgify.com"]'
    ) as HTMLAnchorElement | null;

    if (bookNowLink) {
      try {
        const url = new URL(bookNowLink.href);
        const arrival = url.searchParams.get('arrival');
        const departure = url.searchParams.get('departure');
        const adults = parseInt(url.searchParams.get('adults') || '1', 10);
        const children = parseInt(url.searchParams.get('children') || '0', 10);

        if (arrival && departure) {
          // Convert ISO to Lodgify format (YYYYMMDD)
          const formatToLodgify = (date: string) =>
            date.includes('-') ? date.replace(/-/g, '') : date;

          setWidgetParams({
            arrival: formatToLodgify(arrival),
            departure: formatToLodgify(departure),
            adults,
            children,
          });
          setCanSave(true);
          return;
        }
      } catch (e) {
        console.error('Error parsing widget URL:', e);
      }
    }

    setCanSave(false);
  }, []);

  // Load Lodgify widget script
  useEffect(() => {
    if (!cabin.lodgifyId) return;

    const scriptUrl = 'https://app.lodgify.com/book-now-box/stable/renderBookNowBox.js';

    // Clean up existing script (SPA navigation pattern)
    const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);
    if (existingScript) {
      existingScript.remove();
    }

    // Load script after a small delay
    const timer = setTimeout(() => {
      const script = document.createElement('script');
      script.src = scriptUrl;
      script.async = true;
      document.head.appendChild(script);
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [cabin.lodgifyId]);

  // Watch for widget updates
  useEffect(() => {
    // Set up observer to watch for changes in the widget
    const startObserving = () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new MutationObserver(() => {
        extractParamsFromWidget();
      });

      const widgetContainer = document.getElementById('lodgify-desktop-widget');
      if (widgetContainer) {
        observerRef.current.observe(widgetContainer, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['href'],
        });
      }
    };

    // Start observing after widget loads
    const timer = setTimeout(startObserving, 500);

    // Also check periodically as fallback
    const interval = setInterval(extractParamsFromWidget, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [extractParamsFromWidget]);

  // Handle save button click
  const handleSave = () => {
    if (widgetParams) {
      onSave(widgetParams);
    }
  };

  if (!cabin.lodgifyId) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <p className="text-gray-500 text-center">
          Booking is not available for this cabin.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* CSS to hide Lodgify's Book Now button and style widget */}
      <style jsx global>{`
        #lodgify-desktop-widget a[href*="checkout.lodgify.com"],
        #lodgify-desktop-widget button[type="submit"] {
          display: none !important;
        }

        #lodgify-desktop-widget {
          --ldg-bnb-color-primary: #495d4d;
          --ldg-bnb-color-primary-lighter: #a4aea6;
          --ldg-bnb-color-primary-darker: #252f27;
          --ldg-component-modal-z-index: 9999;
          width: 100%;
        }

        #lodgify-desktop-widget > div {
          border: none !important;
          box-shadow: none !important;
        }
      `}</style>

      {/* Widget Container */}
      <div ref={widgetRef} className="p-4">
        <div
          id="lodgify-desktop-widget"
          data-rental-id={cabin.lodgifyId}
          data-website-id="572847"
          data-slug="cabaneau"
          data-language-code="en"
          data-new-tab="false"
          data-version="stable"
          data-hide-minimum-price
          data-has-guests-breakdown
          data-check-in-label="Check-in"
          data-check-out-label="Check-out"
          data-guests-label="Guests"
          data-guests-singular-label="{{NumberOfGuests}} guest"
          data-guests-plural-label="{{NumberOfGuests}} guests"
          data-adults-label="Adults"
          data-children-label="Children"
          data-infants-label="Infants"
          data-pets-label="Pets"
          data-book-label="Book Now"
        />
      </div>

      {/* Save Button */}
      <div className="px-4 pb-4">
        <button
          onClick={handleSave}
          disabled={!canSave}
          className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
            canSave
              ? 'bg-[#495d4d] hover:bg-[#3a4a3e] text-white'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {canSave ? 'Save' : 'Select dates to continue'}
        </button>
      </div>
    </div>
  );
}
