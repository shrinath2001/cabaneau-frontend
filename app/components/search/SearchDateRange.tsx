'use client';

import { useMemo, useState } from 'react';
import {
  BCP47,
  addMonths,
  buildMonthCells,
  firstOfMonth,
  monthYearLabel,
  toDate,
  weekdayLabels,
} from '../booking/calendarUtils';

interface SearchDateRangeProps {
  checkIn?: string; // ISO
  checkOut?: string; // ISO
  today: string; // ISO
  maxDate: string; // ISO (latest selectable)
  locale: string;
  /** Called with the clicked ISO date; parent runs the two-step range logic. */
  onPickDay: (date: string) => void;
}

const ARIA: Record<string, { prev: string; next: string }> = {
  en: { prev: 'Previous month', next: 'Next month' },
  fr: { prev: 'Mois précédent', next: 'Mois suivant' },
  de: { prev: 'Vorheriger Monat', next: 'Nächster Monat' },
  nl: { prev: 'Vorige maand', next: 'Volgende maand' },
};

/**
 * Plain, availability-agnostic range calendar for the multi-property search.
 * No per-cabin availability/min-stay (that applies on the cabin page); only a
 * past-date guard and the booking-window bound. 2 months desktop / 1 mobile,
 * Monday-first. Controlled: parent owns the selection and the click logic.
 */
export default function SearchDateRange({
  checkIn,
  checkOut,
  today,
  maxDate,
  locale,
  onPickDay,
}: SearchDateRangeProps) {
  const bcp47 = BCP47[locale] || 'en-GB';
  const aria = ARIA[locale] || ARIA.en;

  const [viewMonth, setViewMonth] = useState<string>(() => firstOfMonth(checkIn || today));
  const [hover, setHover] = useState<string | undefined>();

  const minMonth = firstOfMonth(today);
  const maxMonth = firstOfMonth(maxDate);
  const canPrev = viewMonth > minMonth;
  // Allow next while the SECOND shown month is still within range
  const canNext = addMonths(viewMonth, 1) < maxMonth;

  const labels = useMemo(() => weekdayLabels(bcp47), [bcp47]);

  const previewEnd =
    checkIn && !checkOut && hover && hover > checkIn ? hover : undefined;
  const rangeEnd = checkOut || previewEnd;

  const renderMonth = (monthStart: string, className = '') => {
    const cells = buildMonthCells(monthStart);
    return (
      <div className={className}>
        <div className="text-center font-logga text-base capitalize text-gray-800 mb-3">
          {monthYearLabel(monthStart, bcp47)}
        </div>
        <div className="grid grid-cols-7 mb-1">
          {labels.map((w, i) => (
            <div key={i} className="text-center text-xs text-gray-400 py-1 capitalize">
              {w}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-1" onMouseLeave={() => setHover(undefined)}>
          {cells.map((date, i) => {
            if (!date) return <div key={`e${i}`} />;
            const dayNum = toDate(date).getUTCDate();
            const selectable = date >= today && date <= maxDate;
            const isCheckIn = date === checkIn;
            const isCheckOut = date === checkOut;
            const inRange = !!(checkIn && rangeEnd && date > checkIn && date < rangeEnd);
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
                  onClick={() => selectable && onPickDay(date)}
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
    <div className="font-jost">
      {/* Nav */}
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          aria-label={aria.prev}
          disabled={!canPrev}
          onClick={() => canPrev && setViewMonth(addMonths(viewMonth, -1))}
          className="p-2 text-[#495D4D] disabled:text-gray-300 hover:bg-gray-100"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          aria-label={aria.next}
          disabled={!canNext}
          onClick={() => canNext && setViewMonth(addMonths(viewMonth, 1))}
          className="p-2 text-[#495D4D] disabled:text-gray-300 hover:bg-gray-100"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Months: 2 on desktop, 1 on mobile */}
      <div className="flex gap-8">
        {renderMonth(viewMonth, 'flex-1')}
        {renderMonth(addMonths(viewMonth, 1), 'flex-1 hidden md:block')}
      </div>
    </div>
  );
}
