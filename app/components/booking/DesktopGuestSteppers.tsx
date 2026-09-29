'use client';

import type { GuestCounts } from '../search/GuestSteppers';

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
    adults: 'Adults', adultsSub: 'Ages 13 or above',
    children: 'Children', childrenSub: 'Ages 2-12',
    infants: 'Infants', infantsSub: 'Under 2',
    dogs: 'Dogs', decrease: 'Decrease', increase: 'Increase',
    note: (c, d) => `This place has a maximum of ${c} guests, not including infants.${d ? ' 1 dog max.' : ' Pets aren’t allowed.'}`,
  },
  fr: {
    adults: 'Adultes', adultsSub: '13 ans et plus',
    children: 'Enfants', childrenSub: '2 à 12 ans',
    infants: 'Bébés', infantsSub: 'Moins de 2 ans',
    dogs: 'Chiens', decrease: 'Diminuer', increase: 'Augmenter',
    note: (c, d) => `Cet hébergement a une capacité maximale de ${c} personnes, bébés non compris.${d ? ' 1 chien maximum.' : ' Les animaux ne sont pas acceptés.'}`,
  },
  de: {
    adults: 'Erwachsene', adultsSub: 'Ab 13 Jahren',
    children: 'Kinder', childrenSub: '2 bis 12 Jahre',
    infants: 'Kleinkinder', infantsSub: 'Unter 2',
    dogs: 'Hunde', decrease: 'Verringern', increase: 'Erhöhen',
    note: (c, d) => `Diese Unterkunft bietet Platz für maximal ${c} Gäste, Kleinkinder nicht mitgezählt.${d ? ' Maximal 1 Hund.' : ' Haustiere sind nicht erlaubt.'}`,
  },
  nl: {
    adults: 'Volwassenen', adultsSub: '13 jaar en ouder',
    children: 'Kinderen', childrenSub: '2 tot 12 jaar',
    infants: "Baby's", infantsSub: 'Onder 2',
    dogs: 'Honden', decrease: 'Verminderen', increase: 'Verhogen',
    note: (c, d) => `Deze accommodatie biedt plaats aan maximaal ${c} gasten, exclusief baby's.${d ? ' Max. 1 hond.' : ' Huisdieren zijn niet toegestaan.'}`,
  },
};

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
  const t = STRINGS[locale] || STRINGS.en;
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
