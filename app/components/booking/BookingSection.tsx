'use client';

import { useState, useEffect } from 'react';
import { useQuote } from './hooks/useQuote';
import MobileStickyBar from './MobileStickyBar';
import MobileBottomSheet from './MobileBottomSheet';
import DesktopBookingCard from './DesktopBookingCard';
import LodgifyWidgetWrapper from './LodgifyWidgetWrapper';

interface CabinInfo {
  slug: string;
  name: string;
  lodgifyId: string;
  capacity?: number;
}

interface SearchParams {
  arrival?: string;
  departure?: string;
  adults?: string;
  children?: string;
  infants?: string;
  pets?: string;
}

interface BookingSectionProps {
  cabin: CabinInfo;
  searchParams: SearchParams;
}

/**
 * BookingSection - Main orchestrator for booking UI
 *
 * Decides which component to show based on:
 * 1. Device type (mobile vs desktop)
 * 2. Date state (no dates vs dates pre-selected in URL)
 *
 * States:
 * - Mobile + No dates: Sticky bar with "Check Availability" button
 * - Mobile + Has dates: Sticky bar with price + "Reserve" button
 * - Desktop + No dates: Lodgify widget with "Save" button
 * - Desktop + Has dates: Custom booking card with price + "Book Your Stay"
 */
export default function BookingSection({
  cabin,
  searchParams,
}: BookingSectionProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  // Check if we have date params (converts URL format if needed)
  const arrival = searchParams.arrival;
  const departure = searchParams.departure;
  const hasDateParams = !!(arrival && departure);

  // Parse guest counts
  const adults = parseInt(searchParams.adults || '1', 10);
  const children = parseInt(searchParams.children || '0', 10);
  const infants = parseInt(searchParams.infants || '0', 10);
  const pets = parseInt(searchParams.pets || '0', 10);

  // Convert Lodgify date format (YYYYMMDD) to ISO format (YYYY-MM-DD) if needed
  const formatDateForApi = (date: string | undefined): string | undefined => {
    if (!date) return undefined;
    // Already ISO format
    if (date.includes('-')) return date;
    // Lodgify format - convert to ISO
    if (date.length === 8 && /^\d{8}$/.test(date)) {
      return `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}`;
    }
    return date;
  };

  const checkIn = formatDateForApi(arrival);
  const checkOut = formatDateForApi(departure);

  // Fetch quote only when we have dates
  const { quote, loading, error } = useQuote({
    slug: cabin.slug,
    checkIn,
    checkOut,
    adults,
    children,
    infants,
    pets,
  });

  // Handle responsive detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle "Save" from widget - refreshes page with URL params
  const handleSaveFromWidget = (params: {
    arrival: string;
    departure: string;
    adults: number;
    children: number;
  }) => {
    const url = new URL(window.location.href);
    url.searchParams.set('arrival', params.arrival);
    url.searchParams.set('departure', params.departure);
    url.searchParams.set('adults', params.adults.toString());
    url.searchParams.set('children', params.children.toString());

    // Refresh page with new params
    window.location.href = url.toString();
  };

  // MOBILE VIEW
  if (isMobile) {
    return (
      <>
        {/* Sticky bottom bar */}
        <MobileStickyBar
          hasDateParams={hasDateParams}
          quote={quote}
          loading={loading}
          error={error}
          onCheckAvailability={() => setShowBottomSheet(true)}
        />

        {/* Bottom sheet with Lodgify widget */}
        <MobileBottomSheet
          isOpen={showBottomSheet}
          onClose={() => setShowBottomSheet(false)}
          cabin={cabin}
          onSave={handleSaveFromWidget}
        />
      </>
    );
  }

  // DESKTOP VIEW
  if (hasDateParams) {
    // Desktop with dates selected - show custom booking card
    return (
      <DesktopBookingCard
        cabin={cabin}
        checkIn={checkIn!}
        checkOut={checkOut!}
        adults={adults}
        children={children}
        quote={quote}
        loading={loading}
        error={error}
      />
    );
  }

  // Desktop without dates - show Lodgify widget with Save button
  return (
    <LodgifyWidgetWrapper
      cabin={cabin}
      onSave={handleSaveFromWidget}
    />
  );
}
