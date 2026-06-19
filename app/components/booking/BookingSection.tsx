'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuote } from './hooks/useQuote';
import MobileStickyBar from './MobileStickyBar';
import MobileBottomSheet from './MobileBottomSheet';
import DesktopBookingCard from './DesktopBookingCard';
import DesktopBookingModal from './DesktopBookingModal';
import { useTranslations } from '@/app/providers/TranslationsProvider';
import { useBookingDates } from '@/app/providers/BookingDatesProvider';

interface CabinInfo {
  slug: string;
  name: string;
  lodgifyId: string;
  capacity?: number;
}

interface BookingSectionProps {
  cabin: CabinInfo;
  /** Render mode - 'desktop' or 'mobile'. Parent controls which is visible via CSS */
  mode: 'desktop' | 'mobile';
}

/**
 * BookingSection - Main orchestrator for booking UI.
 *
 * Reads the selection from the shared BookingDatesProvider (ISO dates) and
 * updates it via setDates(), so date changes are reactive with NO page reload.
 * useQuote is keyed on the dates, so the price refreshes automatically.
 */
export default function BookingSection({ cabin, mode }: BookingSectionProps) {
  const { t, locale } = useTranslations('booking');
  const { arrival, departure, adults, setDates } = useBookingDates();
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showDesktopModal, setShowDesktopModal] = useState(false);
  const [minStayAdjusted, setMinStayAdjusted] = useState(false);

  // Dates from context are already ISO (YYYY-MM-DD).
  const checkIn = arrival;
  const checkOut = departure;
  const hasDateParams = !!(checkIn && checkOut);

  // Fetch quote only when we have dates
  const { quote, loading, error } = useQuote({
    slug: cabin.slug,
    checkIn,
    checkOut,
    adults,
    locale,
  });

  // Clear the min-stay notice when the user picks a NEW check-in (auto-adjust
  // only changes the departure, so the notice persists until check-in changes).
  const prevCheckIn = useRef(checkIn);
  useEffect(() => {
    if (checkIn !== prevCheckIn.current) {
      prevCheckIn.current = checkIn;
      setMinStayAdjusted(false);
    }
  }, [checkIn]);

  // Auto-extend checkout when the requested stay is below the minimum. Updates
  // the shared store (no reload). Self-terminating: once departure == checkIn +
  // minStay the requested nights meet the minimum and it stops.
  useEffect(() => {
    if (!quote?.minStay || !checkIn || !checkOut || loading) return;
    const requestedNights = Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (requestedNights < quote.minStay) {
      const newCheckOut = new Date(checkIn);
      newCheckOut.setDate(newCheckOut.getDate() + quote.minStay);
      const newCheckOutStr = newCheckOut.toISOString().split('T')[0];
      if (newCheckOutStr !== checkOut) {
        setDates({ departure: newCheckOutStr });
        setMinStayAdjusted(true);
      }
    }
  }, [quote, checkIn, checkOut, loading, setDates]);

  // Min-stay warning (shown after an auto-adjust, until a new check-in is picked)
  const minStayTexts: Record<string, (n: number) => string> = {
    en: (n) => `This cabin has a ${n}-night minimum stay. We've preselected the best available dates for you.`,
    fr: (n) => `Ce chalet a un séjour minimum de ${n} nuits. Nous avons présélectionné les meilleures dates pour vous.`,
    de: (n) => `Diese Hütte hat einen Mindestaufenthalt von ${n} Nächten. Wir haben die besten verfügbaren Daten für Sie vorausgewählt.`,
    nl: (n) => `Deze hut heeft een minimaal verblijf van ${n} nachten. We hebben de beste beschikbare data voor u voorgeselecteerd.`,
  };
  let minStayWarning: string | undefined;
  if (minStayAdjusted && quote?.minStay && !loading) {
    const getText = minStayTexts[locale] || minStayTexts.en;
    minStayWarning = getText(quote.minStay);
  }

  // Save from the date picker modal/sheet - updates the store, no reload.
  const handleSaveFromWidget = (params: {
    checkIn: string;
    checkOut: string;
    adults: number;
  }) => {
    setDates({
      arrival: params.checkIn,
      departure: params.checkOut,
      adults: params.adults,
    });
    setShowDesktopModal(false);
    setShowBottomSheet(false);
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
          minStayWarning={minStayWarning}
        />

        {/* Bottom sheet with custom date-range picker */}
        <MobileBottomSheet
          isOpen={showBottomSheet}
          onClose={() => setShowBottomSheet(false)}
          cabin={cabin}
          initialCheckIn={checkIn}
          initialCheckOut={checkOut}
          initialAdults={adults}
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
          minStayWarning={minStayWarning}
        />

        {/* Desktop Modal for changing dates */}
        <DesktopBookingModal
          isOpen={showDesktopModal}
          onClose={() => setShowDesktopModal(false)}
          cabin={cabin}
          initialCheckIn={checkIn}
          initialCheckOut={checkOut}
          initialAdults={adults}
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
          <h2 className="font-logga font-semibold text-[18px] md:text-[20px] uppercase text-gray-800">
            {cabin.name}
          </h2>
        </div>

        <div className="p-4 md:p-6 space-y-4">
          <p className="text-sm font-jost font-light text-gray-600">
            {t('select_dates_message', 'Select your dates to see availability and pricing')}
          </p>
          <button
            onClick={() => setShowDesktopModal(true)}
            className="w-full bg-[#495D4D] text-white py-4 px-6 text-base font-bold tracking-wide hover:bg-[#3d5a3d] transition uppercase font-jost"
          >
            {t('check_availability', 'Check Availability')}
          </button>
        </div>
      </div>

      {/* Desktop Modal with custom date-range picker */}
      <DesktopBookingModal
        isOpen={showDesktopModal}
        onClose={() => setShowDesktopModal(false)}
        cabin={cabin}
        initialAdults={adults}
        onSave={handleSaveFromWidget}
      />
    </>
  );
}
