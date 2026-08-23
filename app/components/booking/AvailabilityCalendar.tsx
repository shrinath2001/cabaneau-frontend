'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRatesCalendar, nightsBetween } from './hooks/useRatesCalendar';
import { useBookingDates } from '@/app/providers/BookingDatesProvider';

interface AvailabilityCalendarProps {
  slug: string;
  locale: string;
  /** Cabin city, used for the "<N> nights in <city>" heading. */
  city?: string;
}

const STRINGS: Record<
  string,
  {
    heading: string;
    nightsIn: (n: number, city: string) => string;
    selectPrompt: string;
    minStay: (n: number) => string;
    notAvailable: string;
    clear: string;
  }
> = {
  en: {
    heading: 'Availability',
    nightsIn: (n, city) => `${n} night${n === 1 ? '' : 's'}${city ? ` in ${city}` : ''}`,
    selectPrompt: 'Select your dates to check availability',
    minStay: (n) => `Minimum stay: ${n} night${n === 1 ? '' : 's'}`,
    notAvailable: 'Those dates are not available.',
    clear: 'Clear dates',
  },
  fr: {
    heading: 'Disponibilité',
    nightsIn: (n, city) => `${n} nuit${n === 1 ? '' : 's'}${city ? ` à ${city}` : ''}`,
    selectPrompt: 'Sélectionnez vos dates pour voir les disponibilités',
    minStay: (n) => `Séjour minimum : ${n} nuit${n === 1 ? '' : 's'}`,
    notAvailable: 'Ces dates ne sont pas disponibles.',
    clear: 'Effacer les dates',
  },
  de: {
    heading: 'Verfügbarkeit',
    nightsIn: (n, city) => `${n} Nacht${n === 1 ? '' : 'e'}${city ? ` in ${city}` : ''}`,
    selectPrompt: 'Wählen Sie Ihre Daten, um die Verfügbarkeit zu prüfen',
    minStay: (n) => `Mindestaufenthalt: ${n} Nacht${n === 1 ? '' : 'e'}`,
    notAvailable: 'Diese Daten sind nicht verfügbar.',
    clear: 'Daten löschen',
  },
  nl: {
    heading: 'Beschikbaarheid',
    nightsIn: (n, city) => `${n} nacht${n === 1 ? '' : 'en'}${city ? ` in ${city}` : ''}`,
    selectPrompt: 'Selecteer uw data om de beschikbaarheid te bekijken',
    minStay: (n) => `Minimaal verblijf: ${n} nacht${n === 1 ? '' : 'en'}`,
    notAvailable: 'Deze data zijn niet beschikbaar.',
    clear: 'Data wissen',
  },
};

const BCP47: Record<string, string> = {
  en: 'en-GB',
  fr: 'fr-FR',
  de: 'de-DE',
  nl: 'nl-NL',
};

const ARIA: Record<string, { prevMonth: string; nextMonth: string }> = {
  en: { prevMonth: 'Previous month', nextMonth: 'Next month' },
  fr: { prevMonth: 'Mois précédent', nextMonth: 'Mois suivant' },
  de: { prevMonth: 'Vorheriger Monat', nextMonth: 'Nächster Monat' },
  nl: { prevMonth: 'Vorige maand', nextMonth: 'Volgende maand' },
};

// --- pure date helpers (UTC, mirrors DateRangePicker) ---
function toDate(d: string): Date {
  return new Date(`${d}T00:00:00Z`);
}
function ymd(d: Date): string {
  return d.toISOString().split('T')[0];
}
function firstOfMonth(d: string): string {
  const dt = toDate(d);
  return ymd(new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), 1)));
}
function addMonths(monthStart: string, n: number): string {
  const dt = toDate(monthStart);
  return ymd(new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth() + n, 1)));
}
/** Monday-first grid for the month containing monthStart. */
function buildMonthCells(monthStart: string): (string | null)[] {
  const dt = toDate(monthStart);
  const year = dt.getUTCFullYear();
  const month = dt.getUTCMonth();
  const firstWeekday = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells: (string | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(ymd(new Date(Date.UTC(year, month, day))));
  }
  return cells;
}

/**
 * AvailabilityCalendar - inline, Airbnb-style availability calendar for the
 * cabin page. Selecting a complete range applies it to the shared booking
 * store (useBookingDates), so the booking card + sticky bar + quote update
 * reactively with NO page reload (the URL is mirrored shallowly). Stays in sync
 * with the store. All availability/min-stay/check-in-out rules come from
 * useRatesCalendar.
 *
 * Two months on desktop, one on mobile, with prev/next navigation.
 */
export default function AvailabilityCalendar({
  slug,
  locale,
  city,
}: AvailabilityCalendarProps) {
  const t = STRINGS[locale] || STRINGS.en;
  const aria = ARIA[locale] || ARIA.en;
  const bcp47 = BCP47[locale] || 'en-GB';

  const { loading, error, helpers } = useRatesCalendar({ slug, locale });
  const { arrival, departure, setDates, clearDates } = useBookingDates();

  const [checkIn, setCheckIn] = useState<string | undefined>(arrival);
  const [checkOut, setCheckOut] = useState<string | undefined>(departure);
  const [hover, setHover] = useState<string | undefined>();
  const [message, setMessage] = useState<string | undefined>();
  const [viewMonth, setViewMonth] = useState<string>(() =>
    firstOfMonth(arrival || helpers.today)
  );

  // Keep the calendar's selection in sync with the shared store, so a change
  // made elsewhere (modal, another page) is reflected here. Mid-selection (only
  // check-in chosen) doesn't write to the store, so it's preserved.
  useEffect(() => {
    setCheckIn(arrival);
    setCheckOut(departure);
    if (arrival) setViewMonth(firstOfMonth(arrival));
  }, [arrival, departure]);

  const minMonth = firstOfMonth(helpers.today);
  const maxMonth = helpers.maxDate ? firstOfMonth(helpers.maxDate) : addMonths(minMonth, 11);
  const canPrev = viewMonth > minMonth;
  // Allow next while the SECOND shown month is still within range
  const canNext = addMonths(viewMonth, 1) < maxMonth;

  const weekdayLabels = useMemo(() => {
    const base = Date.UTC(2024, 0, 1); // a Monday
    return Array.from({ length: 7 }, (_, i) =>
      new Date(base + i * 86400000).toLocaleDateString(bcp47, {
        weekday: 'short',
        timeZone: 'UTC',
      })
    );
  }, [bcp47]);

  const monthLabel = (monthStart: string) =>
    toDate(monthStart).toLocaleDateString(bcp47, {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    });

  const fmtDate = (d: string) =>
    toDate(d).toLocaleDateString(bcp47, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    });

  const handleDayClick = (date: string) => {
    setMessage(undefined);
    if (!checkIn || (checkIn && checkOut)) {
      if (helpers.isCheckInSelectable(date)) {
        setCheckIn(date);
        setCheckOut(undefined);
      }
      return;
    }
    if (date <= checkIn) {
      if (helpers.isCheckInSelectable(date)) {
        setCheckIn(date);
        setCheckOut(undefined);
      }
      return;
    }
    if (helpers.isCheckOutSelectable(checkIn, date)) {
      setCheckOut(date);
      // Auto-apply: push the range to the shared store. Reactive, NO reload, the
      // booking card/sticky/quote update and the URL is mirrored shallowly.
      setDates({ arrival: checkIn, departure: date });
    } else {
      setMessage(t.notAvailable);
    }
  };

  const previewEnd =
    checkIn && !checkOut && hover && helpers.isCheckOutSelectable(checkIn, hover)
      ? hover
      : undefined;
  const rangeEnd = checkOut || previewEnd;

  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;
  const minStayForCheckIn = checkIn && !checkOut ? helpers.getMinStay(checkIn) : 0;

  const heading = checkIn && checkOut
    ? t.nightsIn(nights, city || '')
    : minStayForCheckIn > 1
      ? t.minStay(minStayForCheckIn)
      : t.selectPrompt;
  const subtitle =
    checkIn && checkOut ? `${fmtDate(checkIn)} - ${fmtDate(checkOut)}` : undefined;

  const clear = () => {
    setCheckIn(undefined);
    setCheckOut(undefined);
    setMessage(undefined);
    // Clear the shared store too (resets the booking widget + URL). Reactive,
    // no reload. If only a check-in was chosen (not committed to the store),
    // this is a harmless no-op on the store.
    if (arrival || departure) clearDates();
  };

  const renderMonth = (monthStart: string, className = '') => {
    const cells = buildMonthCells(monthStart);
    return (
      <div className={className}>
        <div className="text-center font-logga text-base capitalize text-gray-800 mb-3">
          {monthLabel(monthStart)}
        </div>
        <div className="grid grid-cols-7 mb-1">
          {weekdayLabels.map((w, i) => (
            <div key={i} className="text-center text-xs text-gray-400 py-1 capitalize">
              {w}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-1" onMouseLeave={() => setHover(undefined)}>
          {cells.map((date, i) => {
            if (!date) return <div key={`e${monthStart}${i}`} />;
            const isCheckIn = date === checkIn;
            const isCheckOut = date === checkOut;
            const inRange = !!(checkIn && rangeEnd && date > checkIn && date < rangeEnd);
            const isEndpoint = isCheckIn || isCheckOut;

            let selectable: boolean;
            if (!checkIn || checkOut) {
              selectable = helpers.isCheckInSelectable(date);
            } else {
              selectable =
                helpers.isCheckOutSelectable(checkIn, date) ||
                (date <= checkIn && helpers.isCheckInSelectable(date));
            }
            const dayNum = toDate(date).getUTCDate();

            return (
              <div
                key={date}
                className={[
                  'flex justify-center',
                  inRange ? 'bg-[#e8ece9]' : '',
                  isCheckIn && rangeEnd ? 'bg-gradient-to-r from-transparent to-[#e8ece9]' : '',
                  isCheckOut ? 'bg-gradient-to-l from-transparent to-[#e8ece9]' : '',
                ].join(' ')}
              >
                <button
                  type="button"
                  disabled={!selectable}
                  onClick={() => handleDayClick(date)}
                  onMouseEnter={() => setHover(date)}
                  className={[
                    'w-9 h-9 text-sm flex items-center justify-center transition-colors',
                    isEndpoint
                      ? 'bg-[#495D4D] text-white font-medium'
                      : selectable
                        ? 'text-gray-800 hover:bg-[#495D4D] hover:text-white cursor-pointer'
                        : 'text-gray-300 line-through cursor-not-allowed',
                  ].join(' ')}
                >
                  {dayNum}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <section className="mt-8 sm:mt-12 mb-8 sm:mb-12 font-jost">
      {/* Heading - matches the banner style every other cabin-detail section
          uses (Amenities, Extra Services, etc.): same size, weight, tracking,
          padding, and #F1FAF7 background. Was plain text with no background
          and a one-off 22px desktop size. */}
      <h2 className="font-logga font-semibold text-[18px] md:text-[20px] mb-6 uppercase tracking-wide text-gray-800 p-4 md:p-6" style={{ backgroundColor: '#F1FAF7' }}>
        {heading}
      </h2>
      <div className="min-h-[20px] mb-4">
        {subtitle ? (
          <p className="text-sm font-light text-gray-500 mt-1">{subtitle}</p>
        ) : (
          message && <p className="text-xs text-amber-700 mt-1">{message}</p>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#495D4D]" />
        </div>
      )}
      {!loading && error && (
        <div className="py-10 text-center text-sm text-red-600">{error}</div>
      )}

      {!loading && !error && (
        <div className="flex items-start gap-2 md:gap-6">
          <button
            type="button"
            aria-label={aria.prevMonth}
            disabled={!canPrev}
            onClick={() => canPrev && setViewMonth(addMonths(viewMonth, -1))}
            className="p-2 mt-1 text-[#495D4D] disabled:text-gray-200 hover:bg-gray-100 flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Two months only from xl: at lg the page splits into content +
              booking card, leaving this column too narrow for a second month. */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 flex-1 min-w-0">
            {renderMonth(viewMonth)}
            {renderMonth(addMonths(viewMonth, 1), 'hidden xl:block')}
          </div>

          <button
            type="button"
            aria-label={aria.nextMonth}
            disabled={!canNext}
            onClick={() => canNext && setViewMonth(addMonths(viewMonth, 1))}
            className="p-2 mt-1 text-[#495D4D] disabled:text-gray-200 hover:bg-gray-100 flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Clear dates */}
      {(checkIn || checkOut) && !loading && !error && (
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={clear}
            className="text-sm font-jost text-[#495D4D] hover:text-[#3d5a3d] underline font-medium"
          >
            {t.clear}
          </button>
        </div>
      )}
    </section>
  );
}
