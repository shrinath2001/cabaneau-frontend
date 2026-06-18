'use client';

import { useMemo, useState } from 'react';
import { useRatesCalendar, nightsBetween } from './hooks/useRatesCalendar';
import { formatCurrency } from './hooks/useQuote';

interface DateRangePickerProps {
  slug: string;
  locale: string;
  capacity?: number;
  /** Initial selection in ISO YYYY-MM-DD (e.g. prefilled from the URL). */
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialAdults?: number;
  /** Whether the picker is active (controls data fetching). */
  enabled?: boolean;
  onConfirm: (params: { checkIn: string; checkOut: string; adults: number }) => void;
}

// Locale-scoped UI strings (kept local to match the existing booking components)
const STRINGS: Record<
  string,
  {
    selectCheckIn: string;
    selectCheckOut: string;
    minStay: (n: number) => string;
    notAvailable: string;
    guests: string;
    guest: string;
    confirm: string;
    selectToContinue: string;
    nightsTotal: (n: number) => string;
    perNight: string;
    clear: string;
  }
> = {
  en: {
    selectCheckIn: 'Select your check-in date',
    selectCheckOut: 'Select your check-out date',
    minStay: (n) => `Minimum stay: ${n} night${n === 1 ? '' : 's'}`,
    notAvailable: 'Those dates are not available. Please choose another check-out.',
    guests: 'Guests',
    guest: 'guest',
    confirm: 'Confirm dates',
    selectToContinue: 'Select dates to continue',
    nightsTotal: (n) => `${n} night${n === 1 ? '' : 's'}`,
    perNight: 'night',
    clear: 'Clear',
  },
  fr: {
    selectCheckIn: "Sélectionnez votre date d'arrivée",
    selectCheckOut: 'Sélectionnez votre date de départ',
    minStay: (n) => `Séjour minimum : ${n} nuit${n === 1 ? '' : 's'}`,
    notAvailable: 'Ces dates ne sont pas disponibles. Choisissez un autre départ.',
    guests: 'Invités',
    guest: 'invité',
    confirm: 'Confirmer les dates',
    selectToContinue: 'Sélectionnez les dates',
    nightsTotal: (n) => `${n} nuit${n === 1 ? '' : 's'}`,
    perNight: 'nuit',
    clear: 'Effacer',
  },
  de: {
    selectCheckIn: 'Wählen Sie Ihr Anreisedatum',
    selectCheckOut: 'Wählen Sie Ihr Abreisedatum',
    minStay: (n) => `Mindestaufenthalt: ${n} Nacht${n === 1 ? '' : 'e'}`,
    notAvailable: 'Diese Daten sind nicht verfügbar. Bitte wählen Sie eine andere Abreise.',
    guests: 'Gäste',
    guest: 'Gast',
    confirm: 'Daten bestätigen',
    selectToContinue: 'Daten auswählen',
    nightsTotal: (n) => `${n} Nacht${n === 1 ? '' : 'e'}`,
    perNight: 'Nacht',
    clear: 'Löschen',
  },
  nl: {
    selectCheckIn: 'Selecteer uw aankomstdatum',
    selectCheckOut: 'Selecteer uw vertrekdatum',
    minStay: (n) => `Minimaal verblijf: ${n} nacht${n === 1 ? '' : 'en'}`,
    notAvailable: 'Deze data zijn niet beschikbaar. Kies een andere vertrekdatum.',
    guests: 'Gasten',
    guest: 'gast',
    confirm: 'Data bevestigen',
    selectToContinue: 'Selecteer data',
    nightsTotal: (n) => `${n} nacht${n === 1 ? '' : 'en'}`,
    perNight: 'nacht',
    clear: 'Wissen',
  },
};

const BCP47: Record<string, string> = {
  en: 'en-GB',
  fr: 'fr-FR',
  de: 'de-DE',
  nl: 'nl-NL',
};

// --- pure date helpers (UTC-based to avoid tz drift) ---
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

/** Build the calendar grid (Sunday-first) for the month containing monthStart. */
function buildMonthCells(monthStart: string): (string | null)[] {
  const dt = toDate(monthStart);
  const year = dt.getUTCFullYear();
  const month = dt.getUTCMonth();
  const firstWeekday = new Date(Date.UTC(year, month, 1)).getUTCDay(); // 0=Sun
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells: (string | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(ymd(new Date(Date.UTC(year, month, day))));
  }
  return cells;
}

export default function DateRangePicker({
  slug,
  locale,
  capacity = 1,
  initialCheckIn,
  initialCheckOut,
  initialAdults = 1,
  enabled = true,
  onConfirm,
}: DateRangePickerProps) {
  const t = STRINGS[locale] || STRINGS.en;
  const bcp47 = BCP47[locale] || 'en-GB';

  const { loading, error, helpers } = useRatesCalendar({ slug, enabled, locale });

  const [checkIn, setCheckIn] = useState<string | undefined>(initialCheckIn);
  const [checkOut, setCheckOut] = useState<string | undefined>(initialCheckOut);
  const [adults, setAdults] = useState<number>(
    Math.min(Math.max(1, initialAdults), Math.max(1, capacity))
  );
  const [hover, setHover] = useState<string | undefined>();
  const [message, setMessage] = useState<string | undefined>();

  const [viewMonth, setViewMonth] = useState<string>(() =>
    firstOfMonth(initialCheckIn || helpers.today)
  );

  // Month navigation bounds
  const minMonth = firstOfMonth(helpers.today);
  const maxMonth = helpers.maxDate ? firstOfMonth(helpers.maxDate) : addMonths(minMonth, 11);
  const canPrev = viewMonth > minMonth;
  const canNext = viewMonth < maxMonth;

  const monthLabel = useMemo(
    () =>
      toDate(viewMonth).toLocaleDateString(bcp47, {
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      }),
    [viewMonth, bcp47]
  );

  const weekdayLabels = useMemo(() => {
    // Sunday-first short weekday names in locale
    const base = Date.UTC(2024, 0, 7); // a Sunday
    return Array.from({ length: 7 }, (_, i) =>
      new Date(base + i * 86400000).toLocaleDateString(bcp47, {
        weekday: 'short',
        timeZone: 'UTC',
      })
    );
  }, [bcp47]);

  const cells = useMemo(() => buildMonthCells(viewMonth), [viewMonth]);

  const handleDayClick = (date: string) => {
    setMessage(undefined);

    // Starting a fresh selection (nothing chosen, or a full range already set)
    if (!checkIn || (checkIn && checkOut)) {
      if (helpers.isCheckInSelectable(date)) {
        setCheckIn(date);
        setCheckOut(undefined);
      }
      return;
    }

    // We have a check-in but no check-out yet
    if (date <= checkIn) {
      // Clicking on/earlier than check-in restarts selection here
      if (helpers.isCheckInSelectable(date)) {
        setCheckIn(date);
        setCheckOut(undefined);
      }
      return;
    }

    if (helpers.isCheckOutSelectable(checkIn, date)) {
      setCheckOut(date);
    } else {
      setMessage(t.notAvailable);
    }
  };

  // Tentative range end for hover preview (only if it would be valid)
  const previewEnd =
    checkIn && !checkOut && hover && helpers.isCheckOutSelectable(checkIn, hover)
      ? hover
      : undefined;
  const rangeEnd = checkOut || previewEnd;

  const dayState = (date: string) => {
    const isCheckIn = date === checkIn;
    const isCheckOut = date === checkOut;
    const inRange =
      checkIn && rangeEnd && date > checkIn && date < rangeEnd;

    let selectable: boolean;
    if (!checkIn || checkOut) {
      selectable = helpers.isCheckInSelectable(date);
    } else {
      // choosing check-out; allow clicking earlier valid check-ins too
      selectable =
        helpers.isCheckOutSelectable(checkIn, date) ||
        (date <= checkIn && helpers.isCheckInSelectable(date));
    }
    return { isCheckIn, isCheckOut, inRange, selectable };
  };

  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;
  const canConfirm = !!(checkIn && checkOut);
  const minStayForCheckIn = checkIn ? helpers.getMinStay(checkIn) : 0;
  const checkInPrice = checkIn ? helpers.getDay(checkIn)?.pricePerDay ?? null : null;

  const headline = !checkIn
    ? t.selectCheckIn
    : !checkOut
      ? minStayForCheckIn > 1
        ? `${t.selectCheckOut} · ${t.minStay(minStayForCheckIn)}`
        : t.selectCheckOut
      : t.nightsTotal(nights);

  return (
    <div className="w-full font-jost">
      {/* Status / helper line */}
      <div className="px-1 pb-3 min-h-[20px]">
        <p className="text-sm font-light text-gray-700">{headline}</p>
        {message && (
          <p className="text-xs text-amber-700 mt-1">{message}</p>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#495D4D]" />
        </div>
      )}

      {!loading && error && (
        <div className="py-8 text-center text-sm text-red-600">{error}</div>
      )}

      {!loading && !error && (
        <>
          {/* Month header */}
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              aria-label="Previous month"
              disabled={!canPrev}
              onClick={() => canPrev && setViewMonth(addMonths(viewMonth, -1))}
              className="p-2 text-[#495D4D] disabled:text-gray-300 hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="font-logga text-base capitalize text-gray-800">{monthLabel}</span>
            <button
              type="button"
              aria-label="Next month"
              disabled={!canNext}
              onClick={() => canNext && setViewMonth(addMonths(viewMonth, 1))}
              className="p-2 text-[#495D4D] disabled:text-gray-300 hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Weekday row */}
          <div className="grid grid-cols-7 mb-1">
            {weekdayLabels.map((w, i) => (
              <div key={i} className="text-center text-xs text-gray-400 py-1 capitalize">
                {w}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-y-1" onMouseLeave={() => setHover(undefined)}>
            {cells.map((date, i) => {
              if (!date) return <div key={`e${i}`} />;
              const { isCheckIn, isCheckOut, inRange, selectable } = dayState(date);
              const dayNum = toDate(date).getUTCDate();
              const isEndpoint = isCheckIn || isCheckOut;

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

          {/* Price hint for the chosen arrival night */}
          {checkInPrice != null && (
            <p className="text-xs text-gray-500 mt-3 px-1">
              {formatCurrency(checkInPrice, helpers.currency)} / {t.perNight}
            </p>
          )}
        </>
      )}

      {/* Guests + actions */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-light text-gray-700 uppercase">{t.guests}</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Decrease guests"
              onClick={() => setAdults((a) => Math.max(1, a - 1))}
              disabled={adults <= 1}
              className="w-8 h-8 border border-gray-300 flex items-center justify-center text-gray-700 disabled:text-gray-300 hover:border-[#495D4D]"
            >
              −
            </button>
            <span className="w-6 text-center text-gray-800">{adults}</span>
            <button
              type="button"
              aria-label="Increase guests"
              onClick={() => setAdults((a) => Math.min(Math.max(1, capacity), a + 1))}
              disabled={adults >= Math.max(1, capacity)}
              className="w-8 h-8 border border-gray-300 flex items-center justify-center text-gray-700 disabled:text-gray-300 hover:border-[#495D4D]"
            >
              +
            </button>
          </div>
        </div>

        <button
          type="button"
          disabled={!canConfirm}
          onClick={() =>
            canConfirm && onConfirm({ checkIn: checkIn!, checkOut: checkOut!, adults })
          }
          className={[
            'w-full py-4 px-6 text-base font-bold tracking-wide uppercase transition',
            canConfirm
              ? 'bg-[#495D4D] hover:bg-[#3d5a3d] text-white'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed',
          ].join(' ')}
        >
          {canConfirm ? t.confirm : t.selectToContinue}
        </button>
      </div>
    </div>
  );
}
