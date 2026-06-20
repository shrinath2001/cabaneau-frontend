'use client';

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

const STRINGS: Record<
  string,
  {
    adults: string;
    adultsSub: string;
    children: string;
    childrenSub: string;
    infants: string;
    infantsSub: string;
    dogs: string;
    decrease: string;
    increase: string;
    note: (cap: number, dogs: boolean) => string;
  }
> = {
  en: {
    adults: 'adults', adultsSub: 'Ages 13 or above',
    children: 'children', childrenSub: 'Ages 2-12',
    infants: 'infants', infantsSub: 'Under 2',
    dogs: 'dogs', decrease: 'Decrease', increase: 'Increase',
    note: (c, d) => `Up to ${c} guest${c === 1 ? '' : 's'}${d ? ' and 1 dog' : ''}.`,
  },
  fr: {
    adults: 'adultes', adultsSub: '13 ans et plus',
    children: 'enfants', childrenSub: '2 à 12 ans',
    infants: 'bébés', infantsSub: 'Moins de 2 ans',
    dogs: 'chiens', decrease: 'Diminuer', increase: 'Augmenter',
    note: (c, d) => `Jusqu'à ${c} personne${c === 1 ? '' : 's'}${d ? ' et 1 chien' : ''}.`,
  },
  de: {
    adults: 'Erwachsene', adultsSub: 'Ab 13 Jahren',
    children: 'Kinder', childrenSub: '2 bis 12 Jahre',
    infants: 'Kleinkinder', infantsSub: 'Unter 2',
    dogs: 'Hunde', decrease: 'Verringern', increase: 'Erhöhen',
    note: (c, d) => `Bis zu ${c} ${c === 1 ? 'Gast' : 'Gäste'}${d ? ' und 1 Hund' : ''}.`,
  },
  nl: {
    adults: 'volwassenen', adultsSub: '13 jaar en ouder',
    children: 'kinderen', childrenSub: '2 tot 12 jaar',
    infants: "baby's", infantsSub: 'Onder 2',
    dogs: 'honden', decrease: 'Verminderen', increase: 'Verhogen',
    note: (c, d) => `Tot ${c} ${c === 1 ? 'gast' : 'gasten'}${d ? ' en 1 hond' : ''}.`,
  },
};

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
  const t = STRINGS[locale] || STRINGS.en;
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
          <div key={field} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
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
