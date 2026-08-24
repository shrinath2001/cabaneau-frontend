'use client';

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';

/**
 * Booking selection shared across the cabin flow. Internal date format is ISO
 * (YYYY-MM-DD). This context is the reactive source of truth: components read it
 * and re-render (no page reload). It is persisted to sessionStorage (per tab)
 * and mirrored into the URL via the History API (no reload) so shareable links,
 * the search->cabin handoff, and the Lodgify widgets keep working.
 */
export interface BookingDatesState {
  arrival?: string; // ISO YYYY-MM-DD
  departure?: string; // ISO YYYY-MM-DD
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

interface BookingDatesContextValue extends BookingDatesState {
  /** False during SSR + before the first hydration effect runs. */
  hydrated: boolean;
  setDates: (patch: Partial<BookingDatesState>) => void;
  clearDates: () => void;
}

const BookingDatesContext = createContext<BookingDatesContextValue | null>(null);

const SESSION_KEY = 'cabaneau_booking_dates';

const DEFAULTS: BookingDatesState = {
  arrival: undefined,
  departure: undefined,
  adults: 2,
  children: 0,
  infants: 0,
  pets: 0,
};

// ISO YYYY-MM-DD <-> Lodgify YYYYMMDD
function toISO(d?: string | null): string | undefined {
  if (!d) return undefined;
  if (d.includes('-')) return d;
  if (/^\d{8}$/.test(d)) return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
  return undefined;
}
function toLodgify(iso: string): string {
  return iso.replace(/-/g, '');
}
function intParam(v: string | null, fallback: number): number {
  const n = parseInt(v ?? '', 10);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

function readSession(): BookingDatesState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    return {
      arrival: toISO(p.arrival),
      departure: toISO(p.departure),
      adults: typeof p.adults === 'number' ? p.adults : DEFAULTS.adults,
      children: typeof p.children === 'number' ? p.children : 0,
      infants: typeof p.infants === 'number' ? p.infants : 0,
      pets: typeof p.pets === 'number' ? p.pets : 0,
    };
  } catch {
    return null;
  }
}
function writeSession(s: BookingDatesState): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        arrival: s.arrival,
        departure: s.departure,
        adults: s.adults,
        children: s.children,
        infants: s.infants,
        pets: s.pets,
      })
    );
  } catch {
    /* ignore quota/availability errors */
  }
}

/** Read dates from a URLSearchParams (Lodgify or ISO format). */
function datesFromParams(sp: URLSearchParams, base: BookingDatesState): BookingDatesState | null {
  const arrival = toISO(sp.get('arrival'));
  const departure = toISO(sp.get('departure'));
  if (!arrival || !departure) return null;
  return {
    arrival,
    departure,
    adults: intParam(sp.get('adults'), base.adults),
    children: intParam(sp.get('children'), base.children),
    infants: intParam(sp.get('infants'), base.infants),
    pets: intParam(sp.get('pets'), base.pets),
  };
}

/** Build a URL (from the current href) with the selection mirrored in, or removed. */
function urlWithDates(s: BookingDatesState): string {
  const url = new URL(window.location.href);
  const q = url.searchParams;
  if (s.arrival && s.departure) {
    q.set('arrival', toLodgify(s.arrival));
    q.set('departure', toLodgify(s.departure));
    q.set('adults', String(s.adults));
    s.children > 0 ? q.set('children', String(s.children)) : q.delete('children');
    s.infants > 0 ? q.set('infants', String(s.infants)) : q.delete('infants');
    s.pets > 0 ? q.set('pets', String(s.pets)) : q.delete('pets');
  } else {
    q.delete('arrival');
    q.delete('departure');
    q.delete('min_stay_adjusted');
  }
  return url.toString();
}

export function BookingDatesProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [state, setState] = useState<BookingDatesState>(DEFAULTS);
  const [hydrated, setHydrated] = useState(false);
  // Synchronous mirror of the latest state for event-driven setters.
  const ref = useRef<BookingDatesState>(state);
  ref.current = state;

  const commit = useCallback((next: BookingDatesState) => {
    ref.current = next;
    setState(next);
    writeSession(next);
    // Shallow URL update: Next patches the History API so this does not
    // navigate, re-run server work, or reload the page.
    window.history.replaceState(window.history.state, '', urlWithDates(next));
  }, []);

  const setDates = useCallback(
    (patch: Partial<BookingDatesState>) => commit({ ...ref.current, ...patch }),
    [commit]
  );

  const clearDates = useCallback(
    () => commit({ ...ref.current, arrival: undefined, departure: undefined }),
    [commit]
  );

  // Hydration: URL wins on load; else sessionStorage (and mirror it back to the
  // URL so the URL-reading Lodgify widgets prefill); else empty. Runs once.
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const fromUrl = datesFromParams(sp, DEFAULTS);
    if (fromUrl) {
      ref.current = fromUrl;
      setState(fromUrl);
      writeSession(fromUrl);
      setHydrated(true);
      return;
    }
    const fromSession = readSession();
    if (fromSession?.arrival && fromSession?.departure) {
      ref.current = fromSession;
      setState(fromSession);
      // Soft URL update so useSearchParams-based widgets (Lodgify) prefill.
      router.replace(`${pathname}?${new URL(urlWithDates(fromSession)).searchParams.toString()}`, {
        scroll: false,
      });
      setHydrated(true);
      return;
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reconcile on client navigation (provider lives in the layout and does not
  // remount, so the hydration effect won't re-run). Bidirectional: URL wins if
  // the destination carries dates (e.g. search->cabin link); otherwise re-mirror
  // the session selection into the new URL.
  useEffect(() => {
    if (!hydrated) return;
    const sp = new URLSearchParams(window.location.search);
    const fromUrl = datesFromParams(sp, ref.current);
    if (fromUrl) {
      if (fromUrl.arrival !== ref.current.arrival || fromUrl.departure !== ref.current.departure) {
        ref.current = fromUrl;
        setState(fromUrl);
        writeSession(fromUrl);
      }
    } else if (ref.current.arrival && ref.current.departure) {
      window.history.replaceState(window.history.state, '', urlWithDates(ref.current));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, hydrated]);

  return (
    <BookingDatesContext.Provider value={{ ...state, hydrated, setDates, clearDates }}>
      {children}
    </BookingDatesContext.Provider>
  );
}

export function useBookingDates(): BookingDatesContextValue {
  const ctx = useContext(BookingDatesContext);
  if (!ctx) {
    throw new Error('useBookingDates must be used within a BookingDatesProvider');
  }
  return ctx;
}
