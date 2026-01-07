'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface CabinInfo {
  slug: string;
  name: string;
  lodgifyId: string;
}

interface MobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  cabin: CabinInfo;
  onSave: (params: {
    arrival: string;
    departure: string;
    adults: number;
    children: number;
  }) => void;
}

/**
 * MobileBottomSheet - Bottom sheet containing Lodgify widget for mobile
 *
 * Features:
 * - Slides up from bottom
 * - Contains Lodgify widget with "Book Now" hidden
 * - Custom "Save" button that extracts params and refreshes page
 * - Closes on overlay click
 */
export default function MobileBottomSheet({
  isOpen,
  onClose,
  cabin,
  onSave,
}: MobileBottomSheetProps) {
  const [widgetParams, setWidgetParams] = useState<{
    arrival: string;
    departure: string;
    adults: number;
    children: number;
  } | null>(null);
  const [canSave, setCanSave] = useState(false);
  const widgetContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<MutationObserver | null>(null);

  // Extract params from Lodgify widget's checkout URL
  const extractParamsFromWidget = useCallback(() => {
    const bookNowLink = document.querySelector(
      '#lodgify-bottom-sheet-widget a[href*="checkout.lodgify.com"]'
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

  // Load Lodgify widget script when sheet opens
  useEffect(() => {
    if (!isOpen || !cabin.lodgifyId) return;

    const scriptUrl = 'https://app.lodgify.com/book-now-box/stable/renderBookNowBox.js';

    // Clean up existing script
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
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [isOpen, cabin.lodgifyId]);

  // Watch for widget updates using MutationObserver
  useEffect(() => {
    if (!isOpen) return;

    // Set up observer to watch for changes in the widget
    const startObserving = () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new MutationObserver(() => {
        extractParamsFromWidget();
      });

      const widgetContainer = document.getElementById('lodgify-bottom-sheet-widget');
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
  }, [isOpen, extractParamsFromWidget]);

  // Handle save button click
  const handleSave = () => {
    if (widgetParams) {
      onSave(widgetParams);
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-[70] lg:hidden transform transition-transform duration-300 ease-out max-h-[85vh] overflow-hidden flex flex-col">
        {/* Drag Handle */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 pb-3 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Select Dates & Guests
          </h3>
        </div>

        {/* Widget Container */}
        <div
          ref={widgetContainerRef}
          className="flex-1 overflow-y-auto px-5 py-4"
        >
          {/* CSS to hide Lodgify's Book Now button */}
          <style jsx global>{`
            #lodgify-bottom-sheet-widget a[href*="checkout.lodgify.com"],
            #lodgify-bottom-sheet-widget button[type="submit"] {
              display: none !important;
            }

            #lodgify-bottom-sheet-widget {
              --ldg-bnb-color-primary: #495d4d;
              --ldg-bnb-color-primary-lighter: #a4aea6;
              --ldg-bnb-color-primary-darker: #252f27;
            }
          `}</style>

          <div
            id="lodgify-bottom-sheet-widget"
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
        <div className="px-5 py-4 border-t border-gray-200 bg-white">
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
    </>
  );
}
