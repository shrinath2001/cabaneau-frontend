'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
  en: { adults: ['adult', 'adults'], children: ['child', 'children'], infants: ['infant', 'infants'], pets: ['dog', 'dogs'] },
  fr: { adults: ['adulte', 'adultes'], children: ['enfant', 'enfants'], infants: ['bébé', 'bébés'], pets: ['chien', 'chiens'] },
  de: { adults: ['Erwachsener', 'Erwachsene'], children: ['Kind', 'Kinder'], infants: ['Kleinkind', 'Kleinkinder'], pets: ['Hund', 'Hunde'] },
  nl: { adults: ['volwassene', 'volwassenen'], children: ['kind', 'kinderen'], infants: ['baby', "baby's"], pets: ['hond', 'honden'] },
};

interface PanelPos {
  left: number;
  width: number;
  top?: number;
  bottom?: number;
  maxH: number;
}

// Fixed-position placement under (or above, if no room) an anchor, clamped to
// the viewport. Lets the popovers be portaled out of the hero's overflow:hidden.
function computePos(anchor: HTMLElement, desiredWidth: number, align: 'left' | 'right'): PanelPos {
  const r = anchor.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const width = Math.min(desiredWidth, vw - 16);
  let left = align === 'left' ? r.left : r.right - width;
  left = Math.max(8, Math.min(left, vw - width - 8));

  const belowSpace = vh - r.bottom - 16;
  const aboveSpace = r.top - 16;
  if (belowSpace >= 340 || belowSpace >= aboveSpace) {
    return { left, width, top: r.bottom + 8, maxH: belowSpace };
  }
  return { left, width, bottom: vh - r.top + 8, maxH: aboveSpace };
}

export default function SearchWidget({ variant = 'page' }: SearchWidgetProps) {
  const router = useRouter();
  const { locale } = useTranslations();
  const { arrival, departure, adults, children, infants, pets, setDates, clearDates } =
    useBookingDates();

  const L = LABELS[locale] || LABELS.en;
  const nouns = NOUNS[locale] || NOUNS.en;
  const bcp47 = BCP47[locale] || 'en-GB';

  const [open, setOpen] = useState<'cal' | 'guests' | null>(null);
  const [pos, setPos] = useState<PanelPos | null>(null);
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const datesRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  const recompute = useCallback(() => {
    if (open === 'cal' && datesRef.current) setPos(computePos(datesRef.current, 640, 'left'));
    else if (open === 'guests' && guestsRef.current) setPos(computePos(guestsRef.current, 320, 'right'));
  }, [open]);

  useEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    recompute();
    window.addEventListener('scroll', recompute, true);
    window.addEventListener('resize', recompute);
    return () => {
      window.removeEventListener('scroll', recompute, true);
      window.removeEventListener('resize', recompute);
    };
  }, [open, recompute]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (rootRef.current?.contains(t) || panelRef.current?.contains(t)) return;
      setOpen(null);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const today = localToday();
  const td = toDate(today);
  const maxDate = ymd(new Date(Date.UTC(td.getUTCFullYear() + 1, td.getUTCMonth(), td.getUTCDate())));

  const fmt = (iso?: string) =>
    iso
      ? toDate(iso).toLocaleDateString(bcp47, { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' })
      : '';

  const hasRange = !!(arrival && departure);

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

  // Variant styling matched to the previous Lodgify widget: a single connected
  // row at all breakpoints, sharp corners, green icon-only Search. Hero =
  // frosted glass + white text; /search page = white bar + #e0e0e0 + dark text.
  const isHero = variant === 'hero';
  const bar = isHero
    ? 'bg-white/10 backdrop-blur-[8px] border border-white/20'
    : 'bg-white border border-[#e0e0e0] shadow-sm';
  const cellHover = isHero ? 'hover:bg-white/10' : 'hover:bg-gray-50';
  const labelCls = isHero ? 'text-white/70' : 'text-gray-500';
  const valOn = isHero ? 'text-white' : 'text-gray-900';
  const valOff = isHero ? 'text-white/60' : 'text-gray-400';
  const dividerCls = isHero ? 'bg-white/25' : 'bg-[#e0e0e0]';
  const clearCls = isHero ? 'text-white/70 hover:text-white' : 'text-gray-400 hover:text-gray-700';
  const chevronCls = isHero ? 'text-white/80' : 'text-gray-500';

  const cellCls = `min-w-0 flex-1 text-left px-2 md:px-4 py-2.5 md:py-3 transition ${cellHover}`;
  const labelTextCls = `text-[10px] md:text-xs uppercase tracking-wide truncate ${labelCls}`;
  const valueTextCls = (filled: boolean) =>
    `text-[12px] md:text-[15px] truncate ${filled ? 'font-medium ' + valOn : valOff}`;

  const panelStyle: React.CSSProperties | undefined = pos
    ? {
        position: 'fixed',
        left: pos.left,
        width: pos.width,
        maxHeight: pos.maxH,
        ...(pos.top !== undefined ? { top: pos.top } : { bottom: pos.bottom }),
      }
    : undefined;

  return (
    <div ref={rootRef} className="relative w-full max-w-3xl font-jost text-left">
      <div className={`flex flex-row flex-nowrap items-stretch ${bar}`}>
        {/* Dates */}
        <div ref={datesRef} className="relative flex items-stretch flex-[2] md:flex-1 min-w-0">
          <button
            type="button"
            onClick={() => setOpen(open === 'cal' ? null : 'cal')}
            className={cellCls}
          >
            <div className={labelTextCls}>{L.checkIn}</div>
            <div className={valueTextCls(!!arrival)}>{fmt(arrival) || L.addDates}</div>
          </button>
          <div className={`w-px my-2 shrink-0 ${dividerCls}`} />
          <button
            type="button"
            onClick={() => setOpen(open === 'cal' ? null : 'cal')}
            className={cellCls}
          >
            <div className={labelTextCls}>{L.checkOut}</div>
            <div className={valueTextCls(!!departure)}>{fmt(departure) || L.addDates}</div>
          </button>
          {hasRange && (
            <button
              type="button"
              onClick={() => clearDates()}
              aria-label="Clear dates"
              className={`shrink-0 px-1.5 md:px-2 ${clearCls}`}
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.7 7.3a1 1 0 00-1.4 1.4L8.6 10l-1.3 1.3a1 1 0 101.4 1.4L10 11.4l1.3 1.3a1 1 0 001.4-1.4L11.4 10l1.3-1.3a1 1 0 00-1.4-1.4L10 8.6 8.7 7.3z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>

        <div className={`w-px my-2 shrink-0 ${dividerCls}`} />

        {/* Guests */}
        <div ref={guestsRef} className="relative flex items-stretch flex-1 md:flex-none md:w-56 min-w-0">
          <button
            type="button"
            onClick={() => setOpen(open === 'guests' ? null : 'guests')}
            className={`w-full min-w-0 text-left px-2 md:px-4 py-2.5 md:py-3 flex items-center justify-between gap-1 transition ${cellHover}`}
          >
            <div className="min-w-0">
              <div className={labelTextCls}>{L.guests}</div>
              <div className={`text-[12px] md:text-[15px] truncate ${valOn}`}>{guestSummary()}</div>
            </div>
            <svg className={`w-4 h-4 md:w-5 md:h-5 shrink-0 ${chevronCls}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Search (icon only, matching the previous widget) */}
        <button
          type="button"
          onClick={onSearch}
          aria-label={L.search}
          title={L.search}
          className="shrink-0 w-12 md:w-[60px] min-h-[52px] md:min-h-[60px] bg-[#495D4D] text-white flex items-center justify-center hover:bg-[#3d5a3d] transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
        </button>
      </div>

      {/* Popovers portaled to body so they escape the hero's overflow:hidden */}
      {mounted &&
        open &&
        pos &&
        createPortal(
          <div
            ref={panelRef}
            style={panelStyle}
            className="z-[1000] bg-white border border-gray-300 shadow-xl p-4 overflow-y-auto font-jost"
          >
            {open === 'cal' ? (
              <SearchDateRange
                checkIn={arrival}
                checkOut={departure}
                today={today}
                maxDate={maxDate}
                locale={locale}
                onPickDay={onPickDay}
              />
            ) : (
              <SearchGuests
                value={{ adults, children, infants, pets }}
                onChange={onGuestChange}
                onDone={() => setOpen(null)}
                locale={locale}
              />
            )}
          </div>,
          document.body
        )}
    </div>
  );
}
