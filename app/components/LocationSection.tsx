'use client';

import Link from 'next/link';
import { useTranslations } from '@/app/providers/TranslationsProvider';

interface LocationConfig {
  mapEmbedUrl?: string;
  address?: string;
}

interface LocationSectionProps {
  title?: string;
  config?: LocationConfig;
  buttonText?: string;
  buttonLink?: string;
  backgroundColor?: string;
}

const LocationSection = ({
  title,
  config,
  buttonText,
  buttonLink,
  backgroundColor,
}: LocationSectionProps) => {
  const { t } = useTranslations('homepage');

  const displayTitle = title || t('location_section.title', 'WHERE WE ARE');
  const displayMapUrl = config?.mapEmbedUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2519.394400349409!2d4.35169971574599!3d50.84655797953239!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3c48d1f2d1f1f%3A0x4009999999999999!2sBrussels%2C%20Belgium!5e0!3m2!1sen!2sus!4v1678912345678!5m2!1sen!2sus';
  const displayButtonText = buttonText || t('location_section.button', 'GET DIRECTIONS');
  // Only show button if buttonLink has actual content (not empty string)
  const hasButtonLink = buttonLink && buttonLink.trim() !== '';

  const bgStyle = backgroundColor ? { backgroundColor } : {};

  return (
    <section className="bg-white py-6 md:py-5 px-4 md:px-20 md:mt-12" style={bgStyle}>
      <div className="container mx-auto">
        <div className="max-w-[1390px] mx-auto">
          <h2 className="font-logga text-[28px] md:text-[42px] font-semibold md:font-normal text-center pt-6 md:pt-10 mb-10 md:mb-20">
            {displayTitle}
          </h2>
          <div className="relative h-[200px] md:h-[273px] w-full">
            <iframe
              src={displayMapUrl}
              className="w-full h-full"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          {hasButtonLink && (
            <div className="text-center mt-6 md:mt-10 mb-6 md:mb-8">
              <Link href={buttonLink!}>
                <button className="py-3 px-6 bg-[#495D4D] text-white text-base md:text-lg font-heading font-medium tracking-widest hover:bg-[#2d4a2d] transition-colors">
                  {displayButtonText}
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
