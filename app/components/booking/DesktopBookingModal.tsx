"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface CabinInfo {
  slug: string;
  name: string;
  lodgifyId: string;
}

interface DesktopBookingModalProps {
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
 * DesktopBookingModal - Modal containing Lodgify widget for desktop
 *
 * Features:
 * - Centered modal overlay
 * - Contains Lodgify widget with "Book Now" hidden
 * - Custom "Save Dates" button that extracts params and refreshes page
 * - Closes on overlay click or Escape key
 */
export default function DesktopBookingModal({
  isOpen,
  onClose,
  cabin,
  onSave,
}: DesktopBookingModalProps) {
  const [widgetParams, setWidgetParams] = useState<{
    arrival: string;
    departure: string;
    adults: number;
  } | null>(null);
  const [canSave, setCanSave] = useState(false);
  const [widgetLoaded, setWidgetLoaded] = useState(false);
  const observerRef = useRef<MutationObserver | null>(null);

  // Extract params from Lodgify widget's checkout URL
  const extractParamsFromWidget = useCallback(() => {
    const bookNowLink = document.querySelector(
      '#lodgify-book-now-box a[href*="checkout.lodgify.com"]'
    ) as HTMLAnchorElement | null;

    if (bookNowLink) {
      try {
        const url = new URL(bookNowLink.href);
        const arrival = url.searchParams.get("arrival");
        const departure = url.searchParams.get("departure");
        const adults = parseInt(url.searchParams.get("adults") || "1", 10);

        if (arrival && departure) {
          // Convert ISO to Lodgify format (YYYYMMDD)
          const formatToLodgify = (date: string) =>
            date.includes("-") ? date.replace(/-/g, "") : date;

          setWidgetParams({
            arrival: formatToLodgify(arrival),
            departure: formatToLodgify(departure),
            adults,
          });
          setCanSave(true);
          return;
        }
      } catch (e) {
        console.error("Error parsing widget URL:", e);
      }
    }

    setCanSave(false);
  }, []);

  // Load Lodgify widget script when modal opens
  useEffect(() => {
    if (!isOpen || !cabin.lodgifyId) return;

    // Reset widget loaded state when modal opens
    setWidgetLoaded(false);

    const scriptUrl =
      "https://app.lodgify.com/book-now-box/stable/renderBookNowBox.js";

    // Clean up existing script
    const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);
    if (existingScript) {
      existingScript.remove();
    }

    // Load script after a small delay
    const timer = setTimeout(() => {
      const script = document.createElement("script");
      script.src = scriptUrl;
      script.defer = true;
      document.head.appendChild(script);
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [isOpen, cabin.lodgifyId]);

  // Check if widget is fully loaded (has guest counter input)
  useEffect(() => {
    if (!isOpen) return;

    let loadTimeout: NodeJS.Timeout | null = null;

    const checkWidgetLoaded = () => {
      // Check for the guest input which only exists when widget is fully rendered
      const guestInput = document.querySelector(
        '#lodgify-book-now-box input[data-testid="book-now-box.guests-input"]'
      );
      if (guestInput && !loadTimeout) {
        // Add delay after element is found to ensure widget completes rendering
        loadTimeout = setTimeout(() => {
          setWidgetLoaded(true);
        }, 300);
      }
    };

    // Check periodically until widget is loaded
    const interval = setInterval(checkWidgetLoaded, 50);

    return () => {
      clearInterval(interval);
      if (loadTimeout) {
        clearTimeout(loadTimeout);
      }
    };
  }, [isOpen]);

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

      const widgetContainer = document.getElementById("lodgify-book-now-box");
      if (widgetContainer) {
        observerRef.current.observe(widgetContainer, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ["href"],
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
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[60] hidden lg:block"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[70] hidden lg:flex items-center justify-center p-4">
        <div
          className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Select Dates & Guests
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Widget Container - fixed height to prevent layout shift */}
          <div className="px-6 py-4" style={{ minHeight: '77px' }}>
            {/* CSS to style Lodgify widget and hide Book Now button */}
            <style jsx global>{`
              :root {
                --ldg-bnb-background: #ffffff;
                --ldg-bnb-border-radius: 0;
                --ldg-bnb-box-shadow: none;
                --ldg-bnb-padding: 0;
                --ldg-bnb-input-background: #ffffff;
                --ldg-bnb-button-border-radius: 0;
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

              /* Remove all backgrounds and shadows */
              #lodgify-book-now-box *,
              #lodgify-book-now-box > div,
              #lodgify-book-now-box > div > div {
                background: transparent !important;
                box-shadow: none !important;
              }

              /* Hide Book Now button and price section */
              #lodgify-book-now-box a[data-testid="book-now-box.cta-button"],
              #lodgify-book-now-box a[href*="checkout.lodgify.com"],
              #lodgify-book-now-box [data-testid*="total-price"],
              #lodgify-book-now-box .css-1mwn02k {
                display: none !important;
              }

              /* Main container - force single row layout */
              #lodgify-book-now-box [data-testid="book-now-box"] {
                display: flex !important;
                flex-direction: row !important;
                flex-wrap: nowrap !important;
                align-items: stretch !important;
                gap: 0 !important;
                padding: 0 !important;
                width: 100% !important;
              }

              /* Date picker button - takes available space */
              #lodgify-book-now-box
                button[data-testid="book-now-box.date-picker.trigger"] {
                flex: 1 1 auto !important;
                display: flex !important;
                flex-direction: row !important;
                align-items: stretch !important;
                border: 1px solid #e0e0e0 !important;
                border-right: none !important;
                border-radius: 0 !important;
                padding: 0 !important;
                height: 45px !important;
                min-height: 45px !important;
                max-height: 45px !important;
                background: transparent !important;
                cursor: pointer !important;
              }

              /* Check-in section (div inside button) */
              #lodgify-book-now-box
                button[data-testid="book-now-box.date-picker.trigger"]
                > div {
                flex: 1 !important;
                padding: 8px 16px !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: center !important;
                align-items: flex-start !important;
                border: none !important;
              }

              /* Check-out section (span inside button) */
              #lodgify-book-now-box
                button[data-testid="book-now-box.date-picker.trigger"]
                > span {
                flex: 1 !important;
                padding: 8px 16px !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: center !important;
                align-items: flex-start !important;
                border-left: 1px solid #e0e0e0 !important;
              }

              /* Hide arrow icon between dates */
              #lodgify-book-now-box
                button[data-testid="book-now-box.date-picker.trigger"]
                svg {
                display: none !important;
              }

              /* Style the text labels */
              #lodgify-book-now-box
                button[data-testid="book-now-box.date-picker.trigger"]
                span {
                font-size: 14px !important;
                color: #333 !important;
                font-weight: 500 !important;
              }

              /* Guest counter section - match date picker height */
              #lodgify-book-now-box .styled-override.css-pa7ehx,
              #lodgify-book-now-box > div > div.styled-override {
                flex: 0 0 auto !important;
                border: 1px solid #e0e0e0 !important;
                border-radius: 0 !important;
                padding: 0 12px !important;
                display: flex !important;
                flex-direction: row !important;
                align-items: center !important;
                justify-content: center !important;
                gap: 4px !important;
                max-height: 45px !important;
                background: transparent !important;
              }

              /* Guest counter buttons */
              #lodgify-book-now-box .styled-override button {
                padding: 4px !important;
                min-width: 28px !important;
                width: 28px !important;
                height: 28px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                border-radius: 0 !important;
              }

              /* Guest counter input container */
              #lodgify-book-now-box .styled-override .css-mu0s7e {
                display: flex !important;
                flex-direction: row !important;
                align-items: center !important;
                gap: 2px !important;
              }

              /* Guest counter input */
              #lodgify-book-now-box .styled-override input[type="number"] {
                width: 24px !important;
                min-width: 24px !important;
                padding: 0 !important;
                text-align: center !important;
                font-size: 14px !important;
                font-weight: 600 !important;
                border: none !important;
                background: transparent !important;
              }

              /* Hide the label, show only count */
              #lodgify-book-now-box .styled-override .css-1k396i {
                display: none !important;
              }

              /* Remove border from main container */
              #lodgify-book-now-box [data-testid="book-now-box"] {
                border: none !important;
              }
            `}</style>

            {/* Widget wrapper with fixed height to prevent layout shift */}
            <div className="relative" style={{ height: '45px' }}>
              {/* Loading spinner - absolutely positioned */}
              {!widgetLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
                </div>
              )}

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
                style={{ opacity: widgetLoaded ? 1 : 0, transition: 'opacity 0.2s ease-in-out' }}
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="px-6 py-4 border-t border-gray-200 bg-white">
            <button
              onClick={handleSave}
              disabled={!canSave}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                canSave
                  ? "bg-[#495d4d] hover:bg-[#3a4a3e] text-white"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              {canSave ? "Save Dates" : "Select dates to continue"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
