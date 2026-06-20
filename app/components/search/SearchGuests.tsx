'use client';

export interface GuestCounts {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

type GuestField = keyof GuestCounts;

interface SearchGuestsProps {
  value: GuestCounts;
  onChange: (field: GuestField, next: number) => void;
  onDone: () => void;
  locale: string;
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
    note: string;
    done: string;
    decrease: string;
    increase: string;
  }
> = {
  en: {
    adults: 'adults', adultsSub: 'Ages 13 or above',
    children: 'children', childrenSub: 'Ages 2-12',
    infants: 'infants', infantsSub: 'Under 2',
    dogs: 'dogs', note: 'Up to 4 guests and 1 dog.',
    done: 'Done', decrease: 'Decrease', increase: 'Increase',
  },
  fr: {
    adults: 'adultes', adultsSub: '13 ans et plus',
    children: 'enfants', childrenSub: '2 à 12 ans',
    infants: 'bébés', infantsSub: 'Moins de 2 ans',
    dogs: 'chiens', note: "Jusqu'à 4 personnes et 1 chien.",
    done: 'Terminé', decrease: 'Diminuer', increase: 'Augmenter',
  },
  de: {
    adults: 'Erwachsene', adultsSub: 'Ab 13 Jahren',
    children: 'Kinder', childrenSub: '2 bis 12 Jahre',
    infants: 'Kleinkinder', infantsSub: 'Unter 2',
    dogs: 'Hunde', note: 'Bis zu 4 Gäste und 1 Hund.',
    done: 'Fertig', decrease: 'Verringern', increase: 'Erhöhen',
  },
  nl: {
    adults: 'volwassenen', adultsSub: '13 jaar en ouder',
    children: 'kinderen', childrenSub: '2 tot 12 jaar',
    infants: "baby's", infantsSub: 'Onder 2',
    dogs: 'honden', note: 'Tot 4 gasten en 1 hond.',
    done: 'Klaar', decrease: 'Verminderen', increase: 'Verhogen',
  },
};

const MIN: Record<GuestField, number> = { adults: 1, children: 0, infants: 0, pets: 0 };
// Total people (adults + children + infants) are capped together; only 1 dog.
const PEOPLE_CAP = 4;
const DOG_CAP = 1;

export default function SearchGuests({ value, onChange, onDone, locale }: SearchGuestsProps) {
  const t = STRINGS[locale] || STRINGS.en;
  const peopleTotal = value.adults + value.children + value.infants;

  const rows: { field: GuestField; label: string; sub?: string }[] = [
    { field: 'adults', label: t.adults, sub: t.adultsSub },
    { field: 'children', label: t.children, sub: t.childrenSub },
    { field: 'infants', label: t.infants, sub: t.infantsSub },
    { field: 'pets', label: t.dogs },
  ];

  return (
    <div className="font-jost text-gray-800">
      {rows.map(({ field, label, sub }) => {
        const v = value[field];
        const isDog = field === 'pets';
        const atMax = isDog ? v >= DOG_CAP : peopleTotal >= PEOPLE_CAP;
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

      <p className="text-xs text-gray-400 mt-3">{t.note}</p>

      <button
        type="button"
        onClick={onDone}
        className="w-full mt-3 py-3 border border-gray-300 text-gray-800 hover:border-[#495D4D] hover:text-[#495D4D] transition uppercase text-sm tracking-wide"
      >
        {t.done}
      </button>
    </div>
  );
}
