'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from '@/app/providers/TranslationsProvider';
import { useBookingDates } from '@/app/providers/BookingDatesProvider';
import { BCP47, localToday, toDate, ymd } from '../booking/calendarUtils';
import SearchDateRange from './SearchDateRange';
import SearchGuests, { GuestCounts } from './SearchGuests';

interface SearchWidgetProps {
  /** 'hero' = on the dark homepage hero (frosted glass); 'page' = light /search page. */
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
    // Guide the user to pick dates first if missing (button stays enabled to
    // match the previous widget's always-on styling).
    if (!hasRange) {
      setOpen('cal');
      return;
    }
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

  // Variant styling matched to the previous Lodgify widget: frosted glass with
  // white text on the dark hero; a white bordered bar with dark text on the
  // light /search page. Sharp corners, green Search, in both.
  const isHero = variant === 'hero';
  const bar = isHero
    ? 'bg-white/10 backdrop-blur-[8px] border border-white/20'
    : 'bg-white border border-[#e0e0e0] shadow-sm';
  const cellHover = isHero ? 'hover:bg-white/10' : 'hover:bg-gray-50';
  const labelCls = isHero ? 'text-white/70' : 'text-gray-500';
  const valOn = isHero ? 'text-white' : 'text-gray-900';
  const valOff = isHero ? 'text-white/60' : 'text-gray-400';
  const dividerCls = isHero ? 'bg-white/25' : 'bg-[#e0e0e0]';
  const hBorder = isHero ? 'border-white/25' : 'border-[#e0e0e0]';
  const clearCls = isHero ? 'text-white/70 hover:text-white' : 'text-gray-400 hover:text-gray-700';
  const chevronCls = isHero ? 'text-white/80' : 'text-gray-500';

  return (
    <div ref={rootRef} className="relative w-full max-w-3xl font-jost text-left">
      <div className={`flex flex-col md:flex-row items-stretch ${bar}`}>
        {/* Dates */}
        <div className="relative flex items-stretch flex-1">
          <button
            type="button"
            onClick={() => setOpen(open === 'cal' ? null : 'cal')}
            className={`flex-1 text-left px-4 py-3 transition ${cellHover}`}
          >
            <div className={`text-xs uppercase tracking-wide ${labelCls}`}>{L.checkIn}</div>
            <div className={`text-[15px] ${arrival ? 'font-medium ' + valOn : valOff}`}>
              {fmt(arrival) || L.addDates}
            </div>
          </button>
          <div className={`w-px my-2 ${dividerCls}`} />
          <button
            type="button"
            onClick={() => setOpen(open === 'cal' ? null : 'cal')}
            className={`flex-1 text-left px-4 py-3 transition ${cellHover}`}
          >
            <div className={`text-xs uppercase tracking-wide ${labelCls}`}>{L.checkOut}</div>
            <div className={`text-[15px] ${departure ? 'font-medium ' + valOn : valOff}`}>
              {fmt(departure) || L.addDates}
            </div>
          </button>
          {hasRange && (
            <button
              type="button"
              onClick={() => clearDates()}
              aria-label="Clear dates"
              className={`px-3 ${clearCls}`}
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

          {open === 'cal' && (
            <div className="absolute z-50 top-full mt-2 left-0 w-[640px] max-w-[calc(100vw-2rem)] bg-white border border-gray-300 shadow-xl p-4">
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

        {/* Divider between dates and guests (desktop) */}
        <div className={`hidden md:block w-px my-2 ${dividerCls}`} />

        {/* Guests */}
        <div className={`relative flex items-stretch md:w-64 border-t md:border-t-0 ${hBorder}`}>
          <button
            type="button"
            onClick={() => setOpen(open === 'guests' ? null : 'guests')}
            className={`w-full text-left px-4 py-3 flex items-center justify-between transition ${cellHover}`}
          >
            <div>
              <div className={`text-xs uppercase tracking-wide ${labelCls}`}>{L.guests}</div>
              <div className={`text-[15px] ${valOn}`}>{guestSummary()}</div>
            </div>
            <svg className={`w-5 h-5 ${chevronCls}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {open === 'guests' && (
            <div className="absolute z-50 top-full mt-2 left-0 right-0 md:left-auto md:right-0 md:w-80 bg-white border border-gray-300 shadow-xl p-4">
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
          onClick={onSearch}
          className="bg-[#495D4D] text-white px-8 py-4 md:py-0 min-h-[56px] uppercase tracking-wide font-heading font-medium hover:bg-[#3d5a3d] transition flex items-center justify-center"
        >
          {L.search}
        </button>
      </div>
    </div>
  );
}
