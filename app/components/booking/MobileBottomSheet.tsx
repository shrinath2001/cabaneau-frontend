"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { getLodgifyLocale } from "@/app/lib/language";
import { useTranslations } from "@/app/providers/TranslationsProvider";

// Hardcoded translations for booking sheet
const sheetTranslations: Record<string, {
  title: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  guest: string;
  save: string;
  selectDates: string;
  bookNow: string;
}> = {
  en: {
    title: "Select Dates & Guests",
    checkIn: "Check-in",
    checkOut: "Check-out",
    guests: "Guests",
    guest: "guest",
    save: "Save",
    selectDates: "Select dates to continue",
    bookNow: "Book Now",
  },
  fr: {
    title: "Sélectionner les dates et invités",
    checkIn: "Arrivée",
    checkOut: "Départ",
    guests: "Invités",
    guest: "invité",
    save: "Enregistrer",
    selectDates: "Sélectionnez les dates",
    bookNow: "Réserver",
  },
  de: {
    title: "Daten und Gäste auswählen",
    checkIn: "Anreise",
    checkOut: "Abreise",
    guests: "Gäste",
    guest: "Gast",
    save: "Speichern",
    selectDates: "Daten auswählen",
    bookNow: "Jetzt buchen",
  },
  nl: {
    title: "Selecteer data en gasten",
    checkIn: "Inchecken",
    checkOut: "Uitchecken",
    guests: "Gasten",
    guest: "gast",
    save: "Opslaan",
    selectDates: "Selecteer data",
    bookNow: "Nu boeken",
  },
};

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
  const [widgetLoaded, setWidgetLoaded] = useState(false);
  const { locale } = useTranslations();
  const languageCode = getLodgifyLocale(locale);
  const widgetContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<MutationObserver | null>(null);

  // Get translations for current locale
  const t = sheetTranslations[locale] || sheetTranslations.en;

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

  // Load Lodgify widget script when sheet opens
  useEffect(() => {
    if (!isOpen || !cabin.lodgifyId) return;

    // Reset widget loaded state when sheet opens
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

  // Prevent body scroll when sheet is open
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
        <div className="px-5 pb-3 border-b border-gray-300">
          <h3 className="font-logga text-[18px] uppercase text-gray-800">
            {t.title}
          </h3>
        </div>

        {/* Widget Container - fixed height to prevent layout shift */}
        <div
          ref={widgetContainerRef}
          className="px-5 py-4"
          style={{ minHeight: "77px" }}
        >
          {/* CSS to style Lodgify widget - same as desktop modal */}
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
              border: none !important;
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
              padding: 6px 10px !important;
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
              padding: 6px 10px !important;
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
              font-size: 16px !important;
              color: #333 !important;
              font-weight: 400 !important;
              white-space: nowrap !important;
            }

            /* Date picker labels (Check-in, Check-out) */
            #lodgify-book-now-box
              button[data-testid="book-now-box.date-picker.trigger"]
              label {
              font-size: 10px !important;
              white-space: nowrap !important;
            }

            /* Date values */
            #lodgify-book-now-box
              button[data-testid="book-now-box.date-picker.trigger"]
              p {
              font-size: 12px !important;
              white-space: nowrap !important;
            }

            /* Guest counter section - match date picker height */
            #lodgify-book-now-box .styled-override.css-pa7ehx,
            #lodgify-book-now-box > div > div.styled-override,
            #lodgify-book-now-box .styled-override {
              flex: 0 0 auto !important;
              border: 1px solid #e0e0e0 !important;
              border-radius: 0 !important;
              padding: 0 12px !important;
              display: flex !important;
              flex-direction: row !important;
              align-items: center !important;
              justify-content: center !important;
              gap: 4px !important;
              height: 45px !important;
              min-height: 45px !important;
              max-height: 45px !important;
              background: transparent !important;
              box-sizing: border-box !important;
            }

            /* Guest counter inner container */
            #lodgify-book-now-box .styled-override > div {
              height: 100% !important;
              display: flex !important;
              align-items: center !important;
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
              font-size: 16px !important;
              font-weight: 400 !important;
              border: none !important;
              background: transparent !important;
            }

            /* Guest counter - all text elements */
            #lodgify-book-now-box .styled-override,
            #lodgify-book-now-box .styled-override * {
              font-size: 16px !important;
              font-weight: 400 !important;
              color: #333 !important;
            }

            /* Hide the label, show only count */
            #lodgify-book-now-box .styled-override .css-1k396i {
              display: none !important;
            }
          `}</style>

          {/* Widget wrapper with fixed height to prevent layout shift */}
          <div className="relative" style={{ height: "45px" }}>
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
              data-language-code={languageCode}
              data-new-tab="false"
              data-version="stable"
              data-hide-minimum-price
              data-check-in-label={t.checkIn}
              data-check-out-label={t.checkOut}
              data-guests-label={t.guests}
              data-guests-singular-label={`{{NumberOfGuests}} ${t.guest}`}
              data-guests-plural-label={`{{NumberOfGuests}} ${t.guests.toLowerCase()}`}
              data-book-button-label={t.bookNow}
              style={{
                opacity: widgetLoaded ? 1 : 0,
                transition: "opacity 0.2s ease-in-out",
              }}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="px-5 py-4 border-t border-gray-300 bg-white">
          <button
            onClick={handleSave}
            disabled={!canSave}
            className={`w-full py-4 px-6 text-base font-jost font-bold tracking-wide uppercase transition ${
              canSave
                ? "bg-[#495D4D] hover:bg-[#3d5a3d] text-white"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            {canSave ? t.save : t.selectDates}
          </button>
        </div>
      </div>
    </>
  );
}
