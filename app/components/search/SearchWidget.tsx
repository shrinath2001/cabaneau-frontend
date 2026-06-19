'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from '@/app/providers/TranslationsProvider';
import { useBookingDates } from '@/app/providers/BookingDatesProvider';
import { BCP47, localToday, toDate, ymd } from '../booking/calendarUtils';
import SearchDateRange from './SearchDateRange';
import SearchGuests, { GuestCounts } from './SearchGuests';

interface SearchWidgetProps {
  /** 'hero' = on the dark homepage hero; 'page' = on the light /search page. */
  variant?: 'hero' | 'page';
}

const LABELS: Record<
  string,
  { checkIn: string; checkOut: string; guests: string; search: string; addDates: string }
> = {
  en: { checkIn: 'Check-in', checkOut: 'Check-out', guests: 'Guests', search: 'Search', addDates: 'Add dates' },
  fr: { checkIn: 'Arrivée', checkOut: 'Départ', guests: 'Voyageurs', search: 'Rechercher', addDates: 'Ajouter des dates' },
  de: { checkIn: 'Anreise', checkOut: 'Abreise', guests: 'Gäste', search: 'Suchen', addDates: 'Datum hinzufügen' },
  nl: { checkIn: 'Inchecken', checkOut: 'Uitchecken', guests: 'Gasten', search: 'Zoeken', addDates: 'Datum toevoegen' },
};

// [singular, plural] guest nouns for the trigger summary
const NOUNS: Record<string, Record<keyof GuestCounts, [string, string]>> = {
  en: { adults: ['adult', 'adults'], children: ['child', 'children'], infants: ['infant', 'infants'], pets: ['pet', 'pets'] },
  fr: { adults: ['adulte', 'adultes'], children: ['enfant', 'enfants'], infants: ['bébé', 'bébés'], pets: ['animal', 'animaux'] },
  de: { adults: ['Erwachsener', 'Erwachsene'], children: ['Kind', 'Kinder'], infants: ['Kleinkind', 'Kleinkinder'], pets: ['Haustier', 'Haustiere'] },
  nl: { adults: ['volwassene', 'volwassenen'], children: ['kind', 'kinderen'], infants: ['baby', "baby's"], pets: ['huisdier', 'huisdieren'] },
};

export default function SearchWidget({ variant = 'page' }: SearchWidgetProps) {
  const router = useRouter();
  const { locale } = useTranslations();
  const { arrival, departure, adults, children, infants, pets, setDates, clearDates } =
    useBookingDates();

  const L = LABELS[locale] || LABELS.en;
  const nouns = NOUNS[locale] || NOUNS.en;
  const bcp47 = BCP47[locale] || 'en-GB';

  const [open, setOpen] = useState<'cal' | 'guests' | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // Close popovers on outside click
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const today = localToday();
  const td = toDate(today);
  const maxDate = ymd(new Date(Date.UTC(td.getUTCFullYear() + 1, td.getUTCMonth(), td.getUTCDate())));

  const fmt = (iso?: string) =>
    iso
      ? toDate(iso).toLocaleDateString(bcp47, {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          timeZone: 'UTC',
        })
      : '';

  const hasRange = !!(arrival && departure);

  // Two-step range selection writing to the shared store
  const onPickDay = (date: string) => {
    if (!arrival || (arrival && departure)) {
      setDates({ arrival: date, departure: undefined });
    } else if (date <= arrival) {
      setDates({ arrival: date, departure: undefined });
    } else {
      setDates({ departure: date });
      setOpen(null);
    }
  };

  const onGuestChange = (field: keyof GuestCounts, next: number) => setDates({ [field]: next });

  const guestSummary = () => {
    const counts: GuestCounts = { adults, children, infants, pets };
    const parts: string[] = [];
    (Object.keys(counts) as (keyof GuestCounts)[]).forEach((f) => {
      const n = counts[f];
      if (f === 'adults' || n > 0) parts.push(`${n} ${nouns[f][n === 1 ? 0 : 1]}`);
    });
    return parts.join(', ');
  };

  const onSearch = () => {
    if (!hasRange) return;
    const q = new URLSearchParams();
    q.set('arrival', arrival!.replace(/-/g, ''));
    q.set('departure', departure!.replace(/-/g, ''));
    q.set('adults', String(adults));
    if (children > 0) q.set('children', String(children));
    if (infants > 0) q.set('infants', String(infants));
    if (pets > 0) q.set('pets', String(pets));
    setOpen(null);
    router.push(`/${locale}/search?${q.toString()}`);
  };

  const boxBase =
    'bg-white border border-gray-300' + (variant === 'page' ? ' shadow-sm' : '');

  return (
    <div ref={rootRef} className="relative w-full max-w-3xl font-jost text-left">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Dates */}
        <div className="relative flex-1">
          <div className={`flex items-stretch ${boxBase}`}>
            <button
              type="button"
              onClick={() => setOpen(open === 'cal' ? null : 'cal')}
              className="flex-1 text-left px-4 py-3 hover:bg-gray-50 transition"
            >
              <div className="text-xs uppercase tracking-wide text-gray-500">{L.checkIn}</div>
              <div className={`text-[15px] ${arrival ? 'font-medium text-gray-900' : 'text-gray-400'}`}>
                {fmt(arrival) || L.addDates}
              </div>
            </button>
            <div className="w-px bg-gray-300" />
            <button
              type="button"
              onClick={() => setOpen(open === 'cal' ? null : 'cal')}
              className="flex-1 text-left px-4 py-3 hover:bg-gray-50 transition"
            >
              <div className="text-xs uppercase tracking-wide text-gray-500">{L.checkOut}</div>
              <div className={`text-[15px] ${departure ? 'font-medium text-gray-900' : 'text-gray-400'}`}>
                {fmt(departure) || L.addDates}
              </div>
            </button>
            {hasRange && (
              <button
                type="button"
                onClick={() => clearDates()}
                aria-label="Clear dates"
                className="px-3 text-gray-400 hover:text-gray-700"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.7 7.3a1 1 0 00-1.4 1.4L8.6 10l-1.3 1.3a1 1 0 101.4 1.4L10 11.4l1.3 1.3a1 1 0 001.4-1.4L11.4 10l1.3-1.3a1 1 0 00-1.4-1.4L10 8.6 8.7 7.3z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>

          {open === 'cal' && (
            <div className="absolute z-50 mt-2 left-0 right-0 md:right-auto md:w-[640px] bg-white border border-gray-300 shadow-xl p-4">
              <SearchDateRange
                checkIn={arrival}
                checkOut={departure}
                today={today}
                maxDate={maxDate}
                locale={locale}
                onPickDay={onPickDay}
              />
            </div>
          )}
        </div>

        {/* Guests */}
        <div className="relative md:w-72">
          <button
            type="button"
            onClick={() => setOpen(open === 'guests' ? null : 'guests')}
            className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition ${boxBase}`}
          >
            <div>
              <div className="text-xs uppercase tracking-wide text-gray-500">{L.guests}</div>
              <div className="text-[15px] text-gray-900">{guestSummary()}</div>
            </div>
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {open === 'guests' && (
            <div className="absolute z-50 mt-2 left-0 right-0 md:left-auto md:right-0 md:w-80 bg-white border border-gray-300 shadow-xl p-4">
              <SearchGuests
                value={{ adults, children, infants, pets }}
                onChange={onGuestChange}
                onDone={() => setOpen(null)}
                locale={locale}
              />
            </div>
          )}
        </div>

        {/* Search */}
        <button
          type="button"
          disabled={!hasRange}
          onClick={onSearch}
          className={[
            'px-8 py-3 uppercase tracking-wide font-heading font-medium transition',
            hasRange
              ? 'bg-[#495D4D] text-white hover:bg-[#3d5a3d]'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed',
          ].join(' ')}
        >
          {L.search}
        </button>
      </div>
    </div>
  );
}
