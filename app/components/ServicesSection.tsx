'use client';

import Link from 'next/link';
import ServiceCard from './ServiceCard';
import { useTranslations } from '@/app/providers/TranslationsProvider';

interface SectionItem {
  image: string;
  title: string;
  link?: string;
}

interface ServicesSectionProps {
  title?: string;
  items?: SectionItem[];
  buttonText?: string;
  buttonLink?: string;
  backgroundColor?: string;
}

const ServicesSection = ({
  title,
  items,
  buttonText,
  buttonLink,
  backgroundColor,
}: ServicesSectionProps) => {
  const { t } = useTranslations('homepage');

  const displayTitle = title || t('services_section.title', 'OUR SERVICES');
  const displayButtonText = buttonText || t('services_section.button', 'DISCOVER ALL SERVICES');
  const displayButtonLink = buttonLink || '/services';

  const bgStyle = backgroundColor ? { backgroundColor } : {};

  return (
    <section className="py-6 md:py-5 px-4 md:px-20 bg-tint md:mt-12" style={bgStyle}>
      <div className="container mx-auto">
        <div className="max-w-[1390px] mx-auto">
          <h2 className="font-logga text-[28px] md:text-[42px] font-semibold md:font-normal text-center pt-6 md:pt-10 mb-10 md:mb-20">
            {displayTitle}
          </h2>
          {items && items.length > 0 ? (
            <div className="flex flex-col lg:flex-row gap-3 justify-between">
              {items.map((item, index) => (
                <ServiceCard
                  key={index}
                  imageSrc={item.image}
                  serviceName={item.title}
                  link={item.link}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">{t('services_section.empty', 'No services available at the moment.')}</p>
            </div>
          )}
          {displayButtonLink && (
            <div className="text-center mt-6 md:mt-10 mb-6 md:mb-8">
              <Link href={displayButtonLink}>
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

export default ServicesSection;
