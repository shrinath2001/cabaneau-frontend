'use client';

import { useEffect, useRef } from 'react';
import { getLodgifyLocale } from '@/app/lib/language';

interface LodgifyBookNowWidgetProps {
  rentalId: string;
  languageCode?: string;
  // Pre-fill values from search page
  arrival?: string;
  departure?: string;
  adults?: string;
}

// Translations for Lodgify Book Now widget labels
const widgetTranslations: Record<string, {
  checkIn: string;
  checkOut: string;
  guests: string;
  guest: string;
  totalPrice: string;
  selectDates: string;
  from: string;
  perNight: string;
  bookNow: string;
}> = {
  en: {
    checkIn: "Check-in",
    checkOut: "Check-out",
    guests: "Guests",
    guest: "guest",
    totalPrice: "Total price:",
    selectDates: "Select dates to see total price",
    from: "From",
    perNight: "per night",
    bookNow: "Book Now",
  },
  fr: {
    checkIn: "Arrivée",
    checkOut: "Départ",
    guests: "Invités",
    guest: "invité",
    totalPrice: "Prix total :",
    selectDates: "Sélectionnez les dates pour voir le prix",
    from: "À partir de",
    perNight: "par nuit",
    bookNow: "Réserver",
  },
  de: {
    checkIn: "Anreise",
    checkOut: "Abreise",
    guests: "Gäste",
    guest: "Gast",
    totalPrice: "Gesamtpreis:",
    selectDates: "Daten auswählen für Gesamtpreis",
    from: "Ab",
    perNight: "pro Nacht",
    bookNow: "Jetzt buchen",
  },
  nl: {
    checkIn: "Inchecken",
    checkOut: "Uitchecken",
    guests: "Gasten",
    guest: "gast",
    totalPrice: "Totaalprijs:",
    selectDates: "Selecteer data voor totaalprijs",
    from: "Vanaf",
    perNight: "per nacht",
    bookNow: "Nu boeken",
  },
};

/**
 * Lodgify Book Now Box Widget for Cabin Detail Pages
 *
 * Displays real-time availability, pricing, and booking functionality
 * directly from Lodgify's booking system.
 *
 * @see SearchPageWidget.tsx for script loading pattern
 * @see LodgifyBookingWidget.tsx for CSS styling pattern
 */
const LodgifyBookNowWidget = ({
  rentalId,
  languageCode = 'en',
  arrival,
  departure,
  adults,
}: LodgifyBookNowWidgetProps) => {
  const widgetRef = useRef<HTMLDivElement>(null);
  // Convert language code to Lodgify-compatible locale
  const lodgifyLocale = getLodgifyLocale(languageCode);
  // Get translations for current language
  const t = widgetTranslations[languageCode] || widgetTranslations.en;

  // Convert ISO date (YYYY-MM-DD) to Lodgify format (YYYYMMDD)
  const formatForLodgify = (date: string | undefined) => {
    if (!date) return '';
    return date.includes('-') ? date.replace(/-/g, '') : date;
  };

  useEffect(() => {
    if (!rentalId) return;

    const scriptUrl = 'https://app.lodgify.com/book-now-box/stable/renderBookNowBox.js';

    // Force re-initialization by removing existing script (SPA navigation pattern)
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
  }, [rentalId, arrival, departure, adults]);

  // Fallback when lodgifyId is missing
  if (!rentalId) {
    return (
      <div className="bg-gray-100 p-6 text-center border border-gray-200">
        <p className="text-gray-600 font-medium">Booking unavailable</p>
        <p className="text-sm text-gray-500 mt-2">
          Contact us for availability and reservations
        </p>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        /* Lodgify Book Now Box - Cabaneau Brand Styling */
        :root {
          --ldg-bnb-background: #ffffff;
          --ldg-bnb-border-radius: 0.42em;
          --ldg-bnb-box-shadow: 0px 24px 54px 0px rgba(0, 0, 0, 0.1);
          --ldg-bnb-padding: 14px;
          --ldg-bnb-input-background: #ffffff;
          --ldg-bnb-button-border-radius: 0px;

          /* Cabaneau Green Colors */
          --ldg-bnb-color-primary: #495d4d;
          --ldg-bnb-color-primary-lighter: #a4aea6;
          --ldg-bnb-color-primary-darker: #252f27;
          --ldg-bnb-color-primary-contrast: #ffffff;

          /* Calendar Selection Colors */
          --ldg-component-calendar-cell-selection-bg-color: #495d4d;
          --ldg-component-calendar-cell-selection-color: #ffffff;
          --ldg-component-calendar-cell-selected-bg-color: #a4aea6;
          --ldg-component-calendar-cell-selected-color: #ffffff;

          /* Font */
          --ldg-bnb-font-family: inherit;
        }

        #lodgify-book-now-box {
          width: 100%;
        }
      `}</style>

      <div
        ref={widgetRef}
        id="lodgify-book-now-box"
        data-rental-id={rentalId}
        data-website-id="572847"
        data-slug="cabaneau"
        data-language-code={lodgifyLocale}
        data-new-tab="false"
        data-version="stable"
        data-hide-minimum-price
        // Pre-fill values from search page (guests go as adults)
        {...(arrival && { 'data-arrival': formatForLodgify(arrival) })}
        {...(departure && { 'data-departure': formatForLodgify(departure) })}
        {...(adults && adults !== '0' && { 'data-adults': adults })}
        // Labels (translated)
        data-check-in-label={t.checkIn}
        data-check-out-label={t.checkOut}
        data-guests-label={t.guests}
        data-guests-singular-label={`{{NumberOfGuests}} ${t.guest}`}
        data-guests-plural-label={`{{NumberOfGuests}} ${t.guests.toLowerCase()}`}
        data-total-price-label={t.totalPrice}
        data-select-dates-to-see-price-label={t.selectDates}
        data-minimum-price-per-night-first-label={t.from}
        data-minimum-price-per-night-second-label={t.perNight}
        data-book-button-label={t.bookNow}
      />
    </>
  );
};

export default LodgifyBookNowWidget;
