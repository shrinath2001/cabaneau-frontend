'use client';

import { useState } from 'react';
import { useQuote } from './hooks/useQuote';
import MobileStickyBar from './MobileStickyBar';
import MobileBottomSheet from './MobileBottomSheet';
import DesktopBookingCard from './DesktopBookingCard';
import DesktopBookingModal from './DesktopBookingModal';

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
  /** Render mode - 'desktop' or 'mobile'. Parent controls which is visible via CSS */
  mode: 'desktop' | 'mobile';
}

/**
 * BookingSection - Main orchestrator for booking UI
 *
 * Renders either desktop or mobile view based on `mode` prop.
 * Parent component controls visibility via CSS (hidden lg:block / lg:hidden).
 *
 * States:
 * - Mobile + No dates: Sticky bar with "Check Availability" -> opens bottom sheet with Lodgify widget
 * - Mobile + Has dates: Sticky bar with price + "Reserve" button
 * - Desktop + No dates: Card with "Check Availability" -> opens modal with Lodgify widget
 * - Desktop + Has dates: Custom booking card with price + "Book Your Stay"
 */
export default function BookingSection({
  cabin,
  searchParams,
  mode,
}: BookingSectionProps) {
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showDesktopModal, setShowDesktopModal] = useState(false);

  // Check if we have date params (converts URL format if needed)
  const arrival = searchParams.arrival;
  const departure = searchParams.departure;
  const hasDateParams = !!(arrival && departure);

  // Parse guest count (simple total, passed as adults)
  const adults = parseInt(searchParams.adults || '1', 10);

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
  });

  // Handle "Save" from widget - refreshes page with URL params
  const handleSaveFromWidget = (params: {
    arrival: string;
    departure: string;
    adults: number;
  }) => {
    const url = new URL(window.location.href);
    url.searchParams.set('arrival', params.arrival);
    url.searchParams.set('departure', params.departure);
    url.searchParams.set('adults', params.adults.toString());

    // Refresh page with new params
    window.location.href = url.toString();
  };

  // MOBILE VIEW
  if (mode === 'mobile') {
    return (
      <div>
        {/* Sticky bottom bar */}
        <MobileStickyBar
          hasDateParams={hasDateParams}
          quote={quote}
          loading={loading}
          error={error}
          onCheckAvailability={() => setShowBottomSheet(true)}
          onChangeDates={() => setShowBottomSheet(true)}
        />

        {/* Bottom sheet with Lodgify widget */}
        <MobileBottomSheet
          isOpen={showBottomSheet}
          onClose={() => setShowBottomSheet(false)}
          cabin={cabin}
          onSave={handleSaveFromWidget}
        />
      </div>
    );
  }

  // DESKTOP VIEW
  if (hasDateParams) {
    // Desktop with dates selected - show custom booking card + modal for changing dates
    return (
      <>
        <DesktopBookingCard
          cabin={cabin}
          checkIn={checkIn!}
          checkOut={checkOut!}
          adults={adults}
          quote={quote}
          loading={loading}
          error={error}
          onChangeDates={() => setShowDesktopModal(true)}
        />

        {/* Desktop Modal for changing dates */}
        <DesktopBookingModal
          isOpen={showDesktopModal}
          onClose={() => setShowDesktopModal(false)}
          cabin={cabin}
          onSave={handleSaveFromWidget}
        />
      </>
    );
  }

  // Desktop without dates - show Check Availability button + modal
  return (
    <>
      {/* Check Availability Card */}
      <div
        className="bg-white border-2 border-gray-300 w-full md:w-[464px] md:sticky md:top-24"
        style={{ maxHeight: 'calc(100vh - 100px)' }}
      >
        {/* Cabin Name Header */}
        <div className="px-6 py-4 border-b border-gray-300">
          <h2 className="font-jost font-medium text-[18px] md:text-[20px] uppercase text-gray-800">
            {cabin.name}
          </h2>
        </div>

        <div className="p-4 md:p-6 space-y-4">
          <p className="text-sm text-gray-600">
            Select your dates to see availability and pricing
          </p>
          <button
            onClick={() => setShowDesktopModal(true)}
            className="w-full bg-[#F49A4A] hover:bg-[#e08a3a] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Check Availability
          </button>
        </div>
      </div>

      {/* Desktop Modal with Lodgify widget */}
      <DesktopBookingModal
        isOpen={showDesktopModal}
        onClose={() => setShowDesktopModal(false)}
        cabin={cabin}
        onSave={handleSaveFromWidget}
      />
    </>
  );
}
