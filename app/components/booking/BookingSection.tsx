'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuote } from './hooks/useQuote';
import MobileStickyBar from './MobileStickyBar';
import MobileBottomSheet from './MobileBottomSheet';
import DesktopBookingCard from './DesktopBookingCard';
import { useTranslations } from '@/app/providers/TranslationsProvider';
import { useBookingDates } from '@/app/providers/BookingDatesProvider';
import type { GuestCounts } from '../search/GuestSteppers';

type GuestField = keyof GuestCounts;

interface CabinInfo {
  slug: string;
  name: string;
  lodgifyId: string;
  capacity?: number;
  /** Whether this cabin offers the Dog add-on (shows the Dogs guest row). */
  allowDogs?: boolean;
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
  const { locale } = useTranslations('booking');
  const { arrival, departure, adults, children, infants, pets, setDates, clearDates } = useBookingDates();
  const [showBottomSheet, setShowBottomSheet] = useState(false);
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
    children,
    infants,
    pets,
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
    children: number;
    infants: number;
    pets: number;
  }) => {
    setDates({
      arrival: params.checkIn,
      departure: params.checkOut,
      adults: params.adults,
      children: params.children,
      infants: params.infants,
      pets: params.pets,
    });
    setShowBottomSheet(false);
  };

  // Desktop popovers apply changes live to the shared store - no explicit
  // save step (matches Airbnb: picking a checkout date updates the card
  // immediately, "Close" just dismisses the popover).
  const handleDesktopDatesChange = (newCheckIn: string, newCheckOut: string) => {
    setDates({ arrival: newCheckIn, departure: newCheckOut });
  };

  const handleDesktopGuestsChange = (field: GuestField, next: number) => {
    setDates({ [field]: next });
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
          initialChildren={children}
          initialInfants={infants}
          initialPets={pets}
          allowDogs={cabin.allowDogs}
          onSave={handleSaveFromWidget}
        />
      </div>
    );
  }

  // DESKTOP VIEW - the card itself renders the empty ("Add date") state when
  // no dates are selected yet, so there's no separate placeholder card.
  return (
    <DesktopBookingCard
      cabin={cabin}
      checkIn={checkIn}
      checkOut={checkOut}
      adults={adults}
      children={children}
      infants={infants}
      pets={pets}
      quote={quote}
      loading={loading}
      error={error}
      locale={locale}
      onDatesChange={handleDesktopDatesChange}
      onGuestsChange={handleDesktopGuestsChange}
      onClearDates={clearDates}
      minStayWarning={minStayWarning}
    />
  );
}
