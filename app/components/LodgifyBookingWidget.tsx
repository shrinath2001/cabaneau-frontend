'use client';

import { useEffect } from 'react';

const LodgifyBookingWidget = () => {
  useEffect(() => {
    // Check if script already exists
    if (document.querySelector('script[src*="lodgify"]')) {
      console.log('Lodgify script already loaded');
      if ((window as any).lodgify) {
        (window as any).lodgify.init();
      }
      return;
    }

    // Try multiple script URLs in order
    const scriptUrls = [
      'https://d1u05kai0crme2.cloudfront.net/widgets/search-bar-stable.js',
      'https://d1u05kai0crme2.cloudfront.net/searchbar/index.js',
      'https://d1u05kai0crme2.cloudfront.net/property-search-bar/stable/index.js'
    ];

    let currentUrlIndex = 0;

    const tryLoadScript = () => {
      if (currentUrlIndex >= scriptUrls.length) {
        console.error('All Lodgify script URLs failed to load');
        return;
      }

      const script = document.createElement('script');
      script.src = scriptUrls[currentUrlIndex];
      script.async = true;

      script.onload = () => {
        console.log(`Lodgify script loaded successfully from: ${scriptUrls[currentUrlIndex]}`);
        if ((window as any).lodgify) {
          console.log('Initializing Lodgify widget...');
          (window as any).lodgify.init();
        }
      };

      script.onerror = () => {
        console.warn(`Failed to load from: ${scriptUrls[currentUrlIndex]}, trying next URL...`);
        script.remove();
        currentUrlIndex++;
        tryLoadScript();
      };

      document.head.appendChild(script);
    };

    tryLoadScript();

    return () => {
      // Cleanup on unmount
      const existingScript = document.querySelector('script[src*="lodgify"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        :root {
          --ldg-psb-background: #ffffff;
          --ldg-psb-border-radius: 0.42em;
          --ldg-psb-box-shadow: 0px 24px 54px 0px rgba(0, 0, 0, 0.1);
          --ldg-psb-padding: 14px;
          --ldg-psb-input-background: #ffffff;
          --ldg-psb-button-border-radius: 0px;
          --ldg-psb-color-primary: #495c4d;
          --ldg-psb-color-primary-lighter: #a4aea6;
          --ldg-psb-color-primary-darker: #252e27;
          --ldg-psb-color-primary-contrast: #ffffff;
          --ldg-semantic-color-primary: #495c4d;
          --ldg-semantic-color-primary-lighter: #a4aea6;
          --ldg-semantic-color-primary-darker: #252e27;
          --ldg-semantic-color-primary-contrast: #ffffff;
          --ldg-component-modal-z-index: 999;
        }
        #lodgify-search-bar {
          width: 100%;
        }
      `}</style>

      <div className="w-full max-w-[650px] relative z-10">
        <div
          id="lodgify-search-bar"
          data-website-id="572847"
          data-language-code="en"
          data-search-page-url="https://cabaneau.lodgify.com"
          data-dates-check-in-label="Check-in"
          data-dates-check-out-label="Check-out"
          data-guests-counter-label="Guests"
          data-guests-input-singular-label="{{NumberOfGuests}} guest"
          data-guests-input-plural-label="{{NumberOfGuests}} guests"
          data-location-input-label="Location"
          data-search-button-label="Search"
          data-dates-input-min-stay-tooltip-text='{"one":"Minimum {minStay} night","other":"Minimum {minStay} nights"}'
          data-guests-breakdown-label="Guests"
          data-adults-label='{"one":"adult","other":"adults"}'
          data-adults-description="Ages {minAge} or above"
          data-children-label='{"one":"child","other":"children"}'
          data-children-description="Ages {minAge}-{maxAge}"
          data-children-not-allowed-label="Not suitable for children"
          data-infants-label='{"one":"infant","other":"infants"}'
          data-infants-description="Under {maxAge}"
          data-infants-not-allowed-label="Not suitable for infants"
          data-pets-label='{"one":"pet","other":"pets"}'
          data-pets-not-allowed-label="Not allowed"
          data-done-label="Done"
          data-new-tab="true"
          data-version="stable"
        ></div>
      </div>
    </>
  );
};

export default LodgifyBookingWidget;
