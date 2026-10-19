'use client';
import { useTranslations } from '@/app/providers/TranslationsProvider';

export interface GuestCounts {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

type GuestField = keyof GuestCounts;

interface GuestSteppersProps {
  value: GuestCounts;
  onChange: (field: GuestField, next: number) => void;
  locale: string;
  /** Max combined adults + children + infants. Default 4 (search). */
  peopleCap?: number;
  /** Whether to show the Dogs row (cabin must offer the Dog add-on). */
  allowDogs?: boolean;
}



const MIN: Record<GuestField, number> = { adults: 1, children: 0, infants: 0, pets: 0 };
const DOG_CAP = 1;

/**
 * Shared guest +/- steppers with capped totals. adults + children + infants are
 * capped together at peopleCap; dogs at 1. Field key 'pets' is kept for Lodgify
 * compatibility but labelled "Dogs" (we only allow dogs).
 */
export default function GuestSteppers({
  value,
  onChange,
  locale,
  peopleCap = 4,
  allowDogs = true,
}: GuestSteppersProps) {
  const { t: tSearch, tn: tnSearch } = useTranslations('search');
  const t = {
    adults: tSearch('guests.adults'),
    adultsSub: tSearch('guests.adults_sub'),
    children: tSearch('guests.children'),
    childrenSub: tSearch('guests.children_sub'),
    infants: tSearch('guests.infants'),
    infantsSub: tSearch('guests.infants_sub'),
    dogs: tSearch('guests.dogs'),
    decrease: tSearch('guests.decrease'),
    increase: tSearch('guests.increase'),
    note: (c: number, d: boolean) => (d ? tnSearch('guests.note_dog', c, { count: c }) : tnSearch('guests.note', c, { count: c })),
  };
  const peopleTotal = value.adults + value.children + value.infants;

  const rows: { field: GuestField; label: string; sub?: string }[] = [
    { field: 'adults', label: t.adults, sub: t.adultsSub },
    { field: 'children', label: t.children, sub: t.childrenSub },
    { field: 'infants', label: t.infants, sub: t.infantsSub },
    ...(allowDogs ? [{ field: 'pets' as GuestField, label: t.dogs }] : []),
  ];

  return (
    <div className="font-jost text-gray-800">
      {rows.map(({ field, label, sub }) => {
        const v = value[field];
        const isDog = field === 'pets';
        const atMax = isDog ? v >= DOG_CAP : peopleTotal >= peopleCap;
        return (
          <div key={field} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
            <div>
              <div className="capitalize text-[15px]">{label}</div>
              {sub && <div className="text-sm text-gray-400">{sub}</div>}
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                aria-label={`${t.decrease} ${label}`}
                disabled={v <= MIN[field]}
                onClick={() => onChange(field, Math.max(MIN[field], v - 1))}
                className="w-10 h-10 border border-gray-300 flex items-center justify-center text-xl text-gray-700 disabled:text-gray-300 disabled:border-gray-200 hover:border-[#495D4D]"
              >
                −
              </button>
              <span className="w-5 text-center tabular-nums">{v}</span>
              <button
                type="button"
                aria-label={`${t.increase} ${label}`}
                disabled={atMax}
                onClick={() => onChange(field, v + 1)}
                className="w-10 h-10 border border-gray-300 flex items-center justify-center text-xl text-gray-700 disabled:text-gray-300 disabled:border-gray-200 hover:border-[#495D4D]"
              >
                +
              </button>
            </div>
          </div>
        );
      })}
      <p className="text-xs text-gray-400 mt-3">{t.note(peopleCap, allowDogs)}</p>
    </div>
  );
}
