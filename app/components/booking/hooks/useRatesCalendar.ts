'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { apiFetch } from '@/app/lib/api';

export interface RatesCalendarDay {
  date: string; // YYYY-MM-DD
  available: boolean;
  minStay: number;
  maxStay: number; // 0 = no max
  pricePerDay: number | null;
  canCheckIn: boolean; // arrival allowed this date (weekday check-in rule)
  canCheckOut: boolean; // departure allowed this date (weekday check-out rule)
}

export interface RatesCalendarSettings {
  checkInHour: number;
  checkOutHour: number;
  bookingWindowDays: number;
  advanceNoticeDays: number;
  preparationTimeDays: number;
  currency: string;
}

export interface RatesCalendarResponse {
  slug: string;
  name: string;
  lodgifyId: string;
  startDate: string;
  endDate: string;
  days: RatesCalendarDay[];
  rateSettings: RatesCalendarSettings;
}

interface UseRatesCalendarParams {
  slug: string;
  /** How many months ahead to load (default 12). */
  monthsAhead?: number;
  /** When false, the hook does not fetch (e.g. modal closed). */
  enabled?: boolean;
  locale?: string;
}

export interface RuleHelpers {
  /** Local "today" as YYYY-MM-DD. */
  today: string;
  /** Earliest selectable check-in (today + advance notice). */
  minCheckIn: string;
  /** Latest selectable date (today + booking window), or null if unbounded. */
  maxDate: string | null;
  /** Currency code for price display. */
  currency: string;
  /** Day info lookup. */
  getDay: (date: string) => RatesCalendarDay | undefined;
  /** Minimum nights required for a stay starting on `date`. */
  getMinStay: (date: string) => number;
  /** Can this date be picked as a check-in (arrival)? */
  isCheckInSelectable: (date: string) => boolean;
  /**
   * Given a chosen check-in, can `date` be picked as the check-out?
   * Validates ordering, min/max stay, and that every night is available.
   * Quote remains the authoritative final check for subtle gap rules.
   */
  isCheckOutSelectable: (checkIn: string, date: string) => boolean;
  /** Nights between two YYYY-MM-DD dates. */
  nightsBetween: (checkIn: string, checkOut: string) => number;
}

function toDateUTC(d: string): Date {
  return new Date(`${d}T00:00:00Z`);
}

function addDays(date: string, days: number): string {
  const d = toDateUTC(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().split('T')[0];
}

/** Local calendar "today" (browser tz) as YYYY-MM-DD. */
function localToday(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  return Math.round(
    (toDateUTC(checkOut).getTime() - toDateUTC(checkIn).getTime()) /
      (1000 * 60 * 60 * 24)
  );
}

/**
 * Fetches the booking calendar (availability + rate rules) for a cabin and
 * exposes pure helpers the date picker uses to enforce Lodgify rules client
 * side. The Quote endpoint is still the authoritative final validation.
 */
export function useRatesCalendar({
  slug,
  monthsAhead = 12,
  enabled = true,
  locale = 'en',
}: UseRatesCalendarParams) {
  const [data, setData] = useState<RatesCalendarResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  // Stable range for the request (today .. today + monthsAhead)
  const { startDate, endDate } = useMemo(() => {
    const start = localToday();
    const end = addDays(start, Math.round(monthsAhead * 30.5));
    return { startDate: start, endDate: end };
  }, [monthsAhead]);

  useEffect(() => {
    mountedRef.current = true;
    if (!enabled || !slug) return;

    setLoading(true);
    setError(null);

    const params = new URLSearchParams({ startDate, endDate });
    apiFetch(`/api/cabins/slug/${slug}/rates-calendar?${params.toString()}`, {
      headers: { 'x-language': locale },
    })
      .then(async (res) => {
        if (!res.ok) {
          const e = await res.json().catch(() => ({}));
          throw new Error(e.error || `Failed to load calendar: ${res.status}`);
        }
        return res.json();
      })
      .then((json: RatesCalendarResponse) => {
        if (mountedRef.current) setData(json);
      })
      .catch((err) => {
        if (mountedRef.current) {
          setError(err instanceof Error ? err.message : 'Failed to load calendar');
        }
      })
      .finally(() => {
        if (mountedRef.current) setLoading(false);
      });

    return () => {
      mountedRef.current = false;
    };
  }, [slug, startDate, endDate, enabled, locale]);

  const helpers: RuleHelpers = useMemo(() => {
    const byDate = new Map<string, RatesCalendarDay>();
    for (const d of data?.days || []) byDate.set(d.date, d);

    const settings = data?.rateSettings;
    const today = localToday();
    const advance = settings?.advanceNoticeDays ?? 0;
    const window = settings?.bookingWindowDays ?? 0;
    const minCheckIn = addDays(today, advance);
    const maxDate = window > 0 ? addDays(today, window) : null;

    const getDay = (date: string) => byDate.get(date);
    const getMinStay = (date: string) => Math.max(1, byDate.get(date)?.minStay ?? 1);

    const isCheckInSelectable = (date: string): boolean => {
      if (date < minCheckIn) return false;
      if (maxDate && date > maxDate) return false;
      const day = byDate.get(date);
      // Unknown days (outside loaded range) are not selectable; the night that
      // starts on the arrival date must be available AND check-in must be
      // allowed on this weekday (e.g. no Sunday arrivals).
      if (!day) return false;
      return day.available && day.canCheckIn;
    };

    const isCheckOutSelectable = (checkIn: string, date: string): boolean => {
      if (!checkIn) return false;
      if (date <= checkIn) return false;
      const nights = nightsBetween(checkIn, date);
      const minStay = getMinStay(checkIn);
      if (nights < minStay) return false;
      const maxStay = byDate.get(checkIn)?.maxStay ?? 0;
      if (maxStay > 0 && nights > maxStay) return false;
      if (maxDate && date > maxDate) return false;
      // Check-out must be allowed on this weekday (e.g. no Saturday departures).
      const coDay = byDate.get(date);
      if (coDay && !coDay.canCheckOut) return false;
      // Every night in [checkIn, checkOut) must be available.
      for (let i = 0; i < nights; i++) {
        const night = addDays(checkIn, i);
        const d = byDate.get(night);
        if (!d || !d.available) return false;
      }
      return true;
    };

    return {
      today,
      minCheckIn,
      maxDate,
      currency: settings?.currency || 'EUR',
      getDay,
      getMinStay,
      isCheckInSelectable,
      isCheckOutSelectable,
      nightsBetween,
    };
  }, [data]);

  return { data, loading, error, helpers, startDate, endDate };
}
