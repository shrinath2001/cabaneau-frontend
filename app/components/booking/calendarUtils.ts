/**
 * Shared, pure calendar helpers (UTC-based to avoid timezone drift) used by the
 * booking pickers and the search widget. "today" is anchored to the property
 * timezone (Europe/Brussels) so the calendar matches Lodgify's local day.
 */

export const PROPERTY_TIMEZONE = 'Europe/Brussels';

export const BCP47: Record<string, string> = {
  en: 'en-GB',
  fr: 'fr-FR',
  de: 'de-DE',
  nl: 'nl-NL',
};

/** Calendar "today" in the property's timezone as ISO YYYY-MM-DD. */
export function localToday(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: PROPERTY_TIMEZONE }).format(new Date());
}

export function toDate(d: string): Date {
  return new Date(`${d}T00:00:00Z`);
}

export function ymd(d: Date): string {
  return d.toISOString().split('T')[0];
}

export function firstOfMonth(d: string): string {
  const dt = toDate(d);
  return ymd(new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), 1)));
}

export function addMonths(monthStart: string, n: number): string {
  const dt = toDate(monthStart);
  return ymd(new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth() + n, 1)));
}

/** Calendar grid (Monday-first) for the month containing monthStart. */
export function buildMonthCells(monthStart: string): (string | null)[] {
  const dt = toDate(monthStart);
  const year = dt.getUTCFullYear();
  const month = dt.getUTCMonth();
  // Monday-first week: Mon=0 … Sun=6 (getUTCDay is Sun=0 … Sat=6)
  const firstWeekday = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells: (string | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(ymd(new Date(Date.UTC(year, month, day))));
  }
  return cells;
}

/** Monday-first short weekday labels in the given locale. */
export function weekdayLabels(bcp47: string): string[] {
  const base = Date.UTC(2024, 0, 1); // a Monday
  return Array.from({ length: 7 }, (_, i) =>
    new Date(base + i * 86400000).toLocaleDateString(bcp47, {
      weekday: 'short',
      timeZone: 'UTC',
    })
  );
}

export function monthYearLabel(monthStart: string, bcp47: string): string {
  return toDate(monthStart).toLocaleDateString(bcp47, {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** Number of nights between two ISO dates. */
export function nightsBetween(checkIn: string, checkOut: string): number {
  return Math.round((toDate(checkOut).getTime() - toDate(checkIn).getTime()) / 86400000);
}

/** True when the given ISO date falls on a Sunday (UTC, matching toDate()). */
export function isSunday(d: string): boolean {
  return toDate(d).getUTCDay() === 0;
}
