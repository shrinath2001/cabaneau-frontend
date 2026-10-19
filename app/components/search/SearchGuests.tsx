'use client';

import GuestSteppers, { GuestCounts } from './GuestSteppers';
import { useTranslations } from '@/app/providers/TranslationsProvider';

export type { GuestCounts };

interface SearchGuestsProps {
  value: GuestCounts;
  onChange: (field: keyof GuestCounts, next: number) => void;
  onDone: () => void;
  locale: string;
}

/** Search-widget guests dropdown: capped steppers (4 people, 1 dog) + Done. */
export default function SearchGuests({ value, onChange, onDone, locale }: SearchGuestsProps) {
  const { t } = useTranslations('search');
  return (
    <div>
      <GuestSteppers value={value} onChange={onChange} locale={locale} peopleCap={4} allowDogs />
      <button
        type="button"
        onClick={onDone}
        className="w-full mt-3 py-3 border border-gray-300 text-gray-800 hover:border-[#495D4D] hover:text-[#495D4D] transition uppercase text-sm tracking-wide"
      >
        {t('done')}
      </button>
    </div>
  );
}
