'use client';

import type { GuestCounts } from '../search/GuestSteppers';
import { useTranslations } from '@/app/providers/TranslationsProvider';

type GuestField = keyof GuestCounts;

interface DesktopGuestSteppersProps {
  value: GuestCounts;
  onChange: (field: GuestField, next: number) => void;
  locale: string;
  /** Max combined adults + children + infants. */
  peopleCap?: number;
  /** Whether to show the Dogs row (cabin must offer the Dog add-on). */
  allowDogs?: boolean;
}



const MIN: Record<GuestField, number> = { adults: 1, children: 0, infants: 0, pets: 0 };
const DOG_CAP = 1;

/**
 * Airbnb-styled guest steppers (circular +/- buttons) for the desktop
 * booking card's Guests popover. Deliberately a separate component from
 * the shared GuestSteppers used by the mobile sheet, so mobile's look is
 * never affected by desktop-only styling changes. Same capping rules.
 */
export default function DesktopGuestSteppers({
  value,
  onChange,
  locale,
  peopleCap = 4,
  allowDogs = true,
}: DesktopGuestSteppersProps) {
  const { t: tBooking, tf: tfBooking } = useTranslations('booking');
  const t = {
    adults: tBooking('desktop_guests.adults'),
    adultsSub: tBooking('desktop_guests.adults_sub'),
    children: tBooking('desktop_guests.children'),
    childrenSub: tBooking('desktop_guests.children_sub'),
    infants: tBooking('desktop_guests.infants'),
    infantsSub: tBooking('desktop_guests.infants_sub'),
    dogs: tBooking('desktop_guests.dogs'),
    decrease: tBooking('desktop_guests.decrease'),
    increase: tBooking('desktop_guests.increase'),
    note: (c: number, d: boolean) => `${tfBooking('desktop_guests.note', { count: c })} ${d ? tBooking('desktop_guests.note_dog') : tBooking('desktop_guests.note_no_pets')}`,
  };
  const peopleTotal = value.adults + value.children + value.infants;

  const rows: { field: GuestField; label: string; sub?: string }[] = [
    { field: 'adults', label: t.adults, sub: t.adultsSub },
    { field: 'children', label: t.children, sub: t.childrenSub },
    { field: 'infants', label: t.infants, sub: t.infantsSub },
    ...(allowDogs ? [{ field: 'pets' as GuestField, label: t.dogs }] : []),
  ];

  return (
    <div className="font-jost text-gray-900">
      {rows.map(({ field, label, sub }) => {
        const v = value[field];
        const isDog = field === 'pets';
        const atMax = isDog ? v >= DOG_CAP : peopleTotal >= peopleCap;
        return (
          <div key={field} className="flex items-center justify-between py-4 border-b border-gray-200 last:border-0">
            <div>
              <div className="text-[15px] font-medium">{label}</div>
              {sub && <div className="text-sm text-gray-400">{sub}</div>}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label={`${t.decrease} ${label}`}
                disabled={v <= MIN[field]}
                onClick={() => onChange(field, Math.max(MIN[field], v - 1))}
                className="w-8 h-8 border border-gray-400 flex items-center justify-center text-gray-600 disabled:text-gray-300 disabled:border-gray-200 hover:border-gray-900 hover:text-gray-900 transition-colors"
              >
                <span className="text-lg leading-none">−</span>
              </button>
              <span className="w-5 text-center tabular-nums text-[15px]">{v}</span>
              <button
                type="button"
                aria-label={`${t.increase} ${label}`}
                disabled={atMax}
                onClick={() => onChange(field, v + 1)}
                className="w-8 h-8 border border-gray-400 flex items-center justify-center text-gray-600 disabled:text-gray-300 disabled:border-gray-200 hover:border-gray-900 hover:text-gray-900 transition-colors"
              >
                <span className="text-lg leading-none">+</span>
              </button>
            </div>
          </div>
        );
      })}
      <p className="text-xs text-gray-400 mt-3">{t.note(peopleCap, allowDogs)}</p>
    </div>
  );
}
