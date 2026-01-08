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
  } | null>(null);
  const [canSave, setCanSave] = useState(false);
  const widgetContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<MutationObserver | null>(null);

  // Extract params from Lodgify widget's checkout URL
  const extractParamsFromWidget = useCallback(() => {
    const bookNowLink = document.querySelector(
      '#lodgify-book-now-box a[href*="checkout.lodgify.com"]'
    ) as HTMLAnchorElement | null;

    if (bookNowLink) {
      try {
        const url = new URL(bookNowLink.href);
        const arrival = url.searchParams.get('arrival');
        const departure = url.searchParams.get('departure');
        const adults = parseInt(url.searchParams.get('adults') || '1', 10);

        if (arrival && departure) {
          // Convert ISO to Lodgify format (YYYYMMDD)
          const formatToLodgify = (date: string) =>
            date.includes('-') ? date.replace(/-/g, '') : date;

          setWidgetParams({
            arrival: formatToLodgify(arrival),
            departure: formatToLodgify(departure),
            adults,
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
      script.defer = true;
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

      const widgetContainer = document.getElementById('lodgify-book-now-box');
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
          {/* CSS to style Lodgify widget and hide Book Now button */}
          <style jsx global>{`
            :root {
              --ldg-bnb-background: #ffffff;
              --ldg-bnb-border-radius: 0.42em;
              --ldg-bnb-box-shadow: none;
              --ldg-bnb-padding: 14px;
              --ldg-bnb-input-background: #ffffff;
              --ldg-bnb-button-border-radius: 0px;
              --ldg-bnb-color-primary: #495d4d;
              --ldg-bnb-color-primary-lighter: #a4aea6;
              --ldg-bnb-color-primary-darker: #252f27;
              --ldg-bnb-color-primary-contrast: #ffffff;
              --ldg-component-calendar-cell-selection-bg-color: #495d4d;
              --ldg-component-calendar-cell-selection-color: #ffffff;
              --ldg-component-calendar-cell-selected-bg-color: #a4aea6;
              --ldg-component-calendar-cell-selected-color: #ffffff;
              --ldg-component-modal-z-index: 9999;
              --ldg-bnb-font-family: inherit;
            }
            #lodgify-book-now-box {
              width: 100%;
            }
            #lodgify-book-now-box a[href*="checkout.lodgify.com"],
            #lodgify-book-now-box button[type="submit"] {
              display: none !important;
            }
            /* Hide price display from widget */
            #lodgify-book-now-box [data-testid="book-now-box.total-price.price"],
            #lodgify-book-now-box [data-testid="book-now-box.total-price.label"],
            #lodgify-book-now-box [data-testid*="total-price"] {
              display: none !important;
            }
          `}</style>

          <div
            id="lodgify-book-now-box"
            data-rental-id={cabin.lodgifyId}
            data-website-id="572847"
            data-slug="cabaneau"
            data-language-code="en"
            data-new-tab="false"
            data-version="stable"
            data-hide-minimum-price
            data-check-in-label="Check-in"
            data-check-out-label="Check-out"
            data-guests-label="Guests"
            data-guests-singular-label="{{NumberOfGuests}} guest"
            data-guests-plural-label="{{NumberOfGuests}} guests"
            data-book-button-label="Book Now"
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
