'use client';

import { useTranslations } from '@/app/providers/TranslationsProvider';
import Image from 'next/image';
import { stripPastedFormatting } from '@/app/lib/richText';
import { useMediaAlt } from '@/app/providers/MediaAltProvider';

interface SleepingAreasSectionProps {
  locationImage?: string | null;
  cabinName?: string;
  sleepingAreaDescription?: string;
}

const SleepingAreasSection = ({ locationImage, cabinName, sleepingAreaDescription }: SleepingAreasSectionProps) => {
  const altOf = useMediaAlt();
  const { t } = useTranslations('cabin');

  const imageUrl = locationImage || '';

  return (
    <div className="mt-8 sm:mt-12 mb-8 sm:mb-12">
      <h2 className="font-logga font-semibold text-[18px] md:text-[20px] mb-6 uppercase tracking-wide text-gray-800 px-4 md:px-6 pt-[11px] pb-2" style={{ backgroundColor: '#F1FAF7' }}>
        {t('detail.where_you_sleep')}
      </h2>

      {sleepingAreaDescription && (
        <div
          className="font-jost font-light text-[15px] text-gray-800 mb-4 px-4 md:px-0 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_a]:underline [&_strong]:font-medium [&_b]:font-medium"
          dangerouslySetInnerHTML={{ __html: stripPastedFormatting(sleepingAreaDescription) }}
        />
      )}

      {locationImage && (
        <div className="relative w-full h-[250px] sm:h-[350px] lg:h-[400px] bg-gray-200 overflow-hidden">
          <Image
            src={imageUrl}
            alt={altOf(imageUrl, cabinName || '')}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          />
        </div>
      )}
    </div>
  );
};

export default SleepingAreasSection;
