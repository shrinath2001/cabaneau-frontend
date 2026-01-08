'use client';

import { useEffect, useRef } from 'react';

interface LodgifyBookNowWidgetProps {
  rentalId: string;
  languageCode?: string;
  // Pre-fill values from search page
  arrival?: string;
  departure?: string;
  adults?: string;
  children?: string;
  infants?: string;
  pets?: string;
}

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
  children,
  infants,
  pets,
}: LodgifyBookNowWidgetProps) => {
  const widgetRef = useRef<HTMLDivElement>(null);

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
  }, [rentalId, arrival, departure, adults, children, infants, pets]);

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

          /* Modal z-index - ensures calendar appears above other elements */
          --ldg-component-modal-z-index: 9999;
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
        data-language-code={languageCode}
        data-new-tab="false"
        data-version="stable"
        data-hide-minimum-price
        data-has-guests-breakdown
        // Pre-fill values from search page
        {...(arrival && { 'data-arrival': formatForLodgify(arrival) })}
        {...(departure && { 'data-departure': formatForLodgify(departure) })}
        {...(adults && adults !== '0' && { 'data-adults': adults })}
        {...(children && children !== '0' && { 'data-children': children })}
        {...(infants && infants !== '0' && { 'data-infants': infants })}
        {...(pets && pets !== '0' && { 'data-pets': pets })}
        // Labels
        data-check-in-label="Check-in"
        data-check-out-label="Check-out"
        data-guests-label="Guests"
        data-guests-singular-label="{{NumberOfGuests}} guest"
        data-guests-plural-label="{{NumberOfGuests}} guests"
        data-location-input-label="Location"
        data-total-price-label="Total price:"
        data-select-dates-to-see-price-label="Select dates to see total price"
        data-minimum-price-per-night-first-label="From"
        data-minimum-price-per-night-second-label="per night"
        data-book-button-label="Book Now"
        // Guest breakdown labels
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
    </>
  );
};

export default LodgifyBookNowWidget;
