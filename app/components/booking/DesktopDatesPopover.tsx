'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRatesCalendar } from './hooks/useRatesCalendar';

interface DesktopDatesPopoverProps {
  slug: string;
  locale: string;
  isOpen: boolean;
  onClose: () => void;
  initialCheckIn?: string;
  initialCheckOut?: string;
  /** Called live whenever a full check-in/check-out pair is picked. */
  onDatesChange: (checkIn: string, checkOut: string) => void;
  /** Called when "Clear dates" is pressed. */
  onClear: () => void;
}

const STRINGS: Record<
  string,
  {
    selectCheckIn: string;
    selectCheckOut: string;
    minStay: (n: number) => string;
    notAvailable: string;
    nightsTotal: (n: number) => string;
    checkIn: string;
    checkOut: string;
    clear: string;
    close: string;
  }
> = {
  en: {
    selectCheckIn: 'Select your check-in date',
    selectCheckOut: 'Select your check-out date',
    minStay: (n) => `Minimum stay: ${n} night${n === 1 ? '' : 's'}`,
    notAvailable: 'Those dates are not available. Please choose another check-out.',
    nightsTotal: (n) => `${n} night${n === 1 ? '' : 's'}`,
    checkIn: 'Check-in',
    checkOut: 'Checkout',
    clear: 'Clear dates',
    close: 'Close',
  },
  fr: {
    selectCheckIn: "Sélectionnez votre date d'arrivée",
    selectCheckOut: 'Sélectionnez votre date de départ',
    minStay: (n) => `Séjour minimum : ${n} nuit${n === 1 ? '' : 's'}`,
    notAvailable: 'Ces dates ne sont pas disponibles. Choisissez un autre départ.',
    nightsTotal: (n) => `${n} nuit${n === 1 ? '' : 's'}`,
    checkIn: 'Arrivée',
    checkOut: 'Départ',
    clear: 'Effacer les dates',
    close: 'Fermer',
  },
  de: {
    selectCheckIn: 'Wählen Sie Ihr Anreisedatum',
    selectCheckOut: 'Wählen Sie Ihr Abreisedatum',
    minStay: (n) => `Mindestaufenthalt: ${n} Nacht${n === 1 ? '' : 'e'}`,
    notAvailable: 'Diese Daten sind nicht verfügbar. Bitte wählen Sie eine andere Abreise.',
    nightsTotal: (n) => `${n} Nacht${n === 1 ? '' : 'e'}`,
    checkIn: 'Anreise',
    checkOut: 'Abreise',
    clear: 'Daten löschen',
    close: 'Schließen',
  },
  nl: {
    selectCheckIn: 'Selecteer uw aankomstdatum',
    selectCheckOut: 'Selecteer uw vertrekdatum',
    minStay: (n) => `Minimaal verblijf: ${n} nacht${n === 1 ? '' : 'en'}`,
    notAvailable: 'Deze data zijn niet beschikbaar. Kies een andere vertrekdatum.',
    nightsTotal: (n) => `${n} nacht${n === 1 ? '' : 'en'}`,
    checkIn: 'Aankomst',
    checkOut: 'Vertrek',
    clear: 'Data wissen',
    close: 'Sluiten',
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
function formatChip(date: string | undefined, bcp47: string): string {
  if (!date) return '';
  return toDate(date).toLocaleDateString(bcp47, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}

/**
 * Airbnb-style dual-month calendar popover for the desktop booking card.
 * Deliberately independent of the shared DateRangePicker (mobile's single-
 * month sheet) - the two rendering strategies diverge enough that sharing
 * would mean threading a "columns" prop through mobile's component just to
 * serve desktop, for zero mobile benefit.
 */
export default function DesktopDatesPopover({
  slug,
  locale,
  isOpen,
  onClose,
  initialCheckIn,
  initialCheckOut,
  onDatesChange,
  onClear,
}: DesktopDatesPopoverProps) {
  const t = STRINGS[locale] || STRINGS.en;
  const aria = ARIA[locale] || ARIA.en;
  const bcp47 = BCP47[locale] || 'en-GB';

  const { loading, error, helpers } = useRatesCalendar({ slug, enabled: isOpen, locale });

  const [checkIn, setCheckIn] = useState<string | undefined>(initialCheckIn);
  const [checkOut, setCheckOut] = useState<string | undefined>(initialCheckOut);
  const [hover, setHover] = useState<string | undefined>();
  const [message, setMessage] = useState<string | undefined>();
  const popoverRef = useRef<HTMLDivElement>(null);

  // Re-sync when reopened with a different selection (e.g. after Clear).
  useEffect(() => {
    if (isOpen) {
      setCheckIn(initialCheckIn);
      setCheckOut(initialCheckOut);
      setMessage(undefined);
    }
  }, [isOpen, initialCheckIn, initialCheckOut]);

  const [viewMonth, setViewMonth] = useState<string>(() =>
    firstOfMonth(initialCheckIn || helpers.today)
  );

  useEffect(() => {
    if (isOpen) setViewMonth(firstOfMonth(initialCheckIn || helpers.today));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Close on outside click.
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, onClose]);

  // Close on Escape.
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const minMonth = firstOfMonth(helpers.today);
  const maxMonth = helpers.maxDate ? firstOfMonth(helpers.maxDate) : addMonths(minMonth, 11);
  const canPrev = viewMonth > minMonth;
  const secondMonth = addMonths(viewMonth, 1);
  const canNext = secondMonth < maxMonth;

  const weekdayLabels = useMemo(() => {
    const base = Date.UTC(2024, 0, 1); // a Monday
    return Array.from({ length: 7 }, (_, i) =>
      new Date(base + i * 86400000).toLocaleDateString(bcp47, { weekday: 'short', timeZone: 'UTC' })
    );
  }, [bcp47]);

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
      onDatesChange(checkIn, date);
      // Auto-close once both dates are picked (Airbnb-style) - no separate
      // confirm step needed.
      onClose();
    } else {
      setMessage(t.notAvailable);
    }
  };

  const previewEnd =
    checkIn && !checkOut && hover && helpers.isCheckOutSelectable(checkIn, hover) ? hover : undefined;
  const rangeEnd = checkOut || previewEnd;

  const dayState = (date: string) => {
    const isCheckIn = date === checkIn;
    const isCheckOut = date === checkOut;
    const inRange = !!(checkIn && rangeEnd && date > checkIn && date < rangeEnd);

    let selectable: boolean;
    if (!checkIn || checkOut) {
      selectable = helpers.isCheckInSelectable(date);
    } else {
      selectable =
        helpers.isCheckOutSelectable(checkIn, date) || (date <= checkIn && helpers.isCheckInSelectable(date));
    }
    return { isCheckIn, isCheckOut, inRange, selectable };
  };

  const renderMonth = (monthStart: string) => {
    const cells = buildMonthCells(monthStart);
    const monthLabel = toDate(monthStart).toLocaleDateString(bcp47, {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    });

    return (
      <div className="w-[280px]">
        <div className="text-center font-logga text-base capitalize text-gray-800 mb-3">{monthLabel}</div>
        <div className="grid grid-cols-7 mb-1">
          {weekdayLabels.map((w, i) => (
            <div key={i} className="text-center text-xs text-gray-400 py-1 capitalize">
              {w}
            </div>
          ))}
        </div>
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
                        ? 'text-gray-800 hover:bg-[#e8ece9] cursor-pointer'
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

  if (!isOpen) return null;

  const nights = checkIn && checkOut ? helpers.nightsBetween(checkIn, checkOut) : 0;
  const minStayForCheckIn = checkIn ? helpers.getMinStay(checkIn) : 0;
  const headline = !checkIn
    ? t.selectCheckIn
    : !checkOut
      ? minStayForCheckIn > 1
        ? `${t.selectCheckOut} · ${t.minStay(minStayForCheckIn)}`
        : t.selectCheckOut
      : null;

  return (
    <div
      ref={popoverRef}
      className="absolute z-50 top-full right-0 mt-2 bg-white shadow-xl border border-gray-200 p-6 font-jost"
      style={{ width: 'max-content' }}
    >
      {/* Header: summary + editable chips */}
      <div className="flex items-start justify-between gap-6 mb-4">
        <div>
          {nights > 0 ? (
            <>
              <div className="text-lg font-semibold text-gray-900">{t.nightsTotal(nights)}</div>
              <div className="text-sm text-gray-500">
                {formatChip(checkIn, bcp47)} - {formatChip(checkOut, bcp47)}
              </div>
            </>
          ) : (
            headline && <p className="text-sm font-light text-gray-700 max-w-[220px]">{headline}</p>
          )}
          {message && <p className="text-xs text-amber-700 mt-1">{message}</p>}
        </div>

        <div className="flex border border-gray-300 overflow-hidden">
          <div className="px-3 py-2 border-r border-gray-300 min-w-[130px]">
            <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">{t.checkIn}</div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-gray-900">{formatChip(checkIn, bcp47) || '—'}</span>
              {checkIn && (
                <button
                  type="button"
                  aria-label={t.clear}
                  onClick={() => {
                    setCheckIn(undefined);
                    setCheckOut(undefined);
                  }}
                  className="text-gray-400 hover:text-gray-700"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="px-3 py-2 min-w-[130px]">
            <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">{t.checkOut}</div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-gray-900">{formatChip(checkOut, bcp47) || '—'}</span>
              {checkOut && (
                <button
                  type="button"
                  aria-label={t.clear}
                  onClick={() => setCheckOut(undefined)}
                  className="text-gray-400 hover:text-gray-700"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-24 w-[600px]">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-800" />
        </div>
      )}

      {!loading && error && (
        <div className="py-8 text-center text-sm text-red-600 w-[600px]">{error}</div>
      )}

      {!loading && !error && (
        <>
          {/* Shared month navigation - arrows control both panels as a pair */}
          <div className="flex items-start gap-8">
            <div className="relative">
              <button
                type="button"
                aria-label={aria.prevMonth}
                disabled={!canPrev}
                onClick={() => canPrev && setViewMonth(addMonths(viewMonth, -1))}
                className="absolute -left-2 top-0 p-2 text-gray-700 disabled:text-gray-300 hover:bg-gray-100 z-10"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              {renderMonth(viewMonth)}
            </div>
            <div className="relative">
              <button
                type="button"
                aria-label={aria.nextMonth}
                disabled={!canNext}
                onClick={() => canNext && setViewMonth(addMonths(viewMonth, 1))}
                className="absolute -right-2 top-0 p-2 text-gray-700 disabled:text-gray-300 hover:bg-gray-100 z-10"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              {renderMonth(secondMonth)}
            </div>
          </div>
        </>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={() => {
            setCheckIn(undefined);
            setCheckOut(undefined);
            setMessage(undefined);
            onClear();
          }}
          className="text-sm font-medium text-gray-900 underline hover:no-underline"
        >
          {t.clear}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-[#495D4D] hover:bg-[#3d4d3f] text-white px-6 py-3 text-sm font-medium transition-colors"
        >
          {t.close}
        </button>
      </div>
    </div>
  );
}
