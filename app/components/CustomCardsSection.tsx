'use client';

import Link from 'next/link';
import ServiceCard from './ServiceCard';

interface SectionItem {
  image: string;
  title: string;
  subtitle?: string;
  link?: string;
}

interface CustomCardsSectionProps {
  title?: string;
  subtitle?: string;
  items?: SectionItem[];
  buttonText?: string;
  buttonLink?: string;
  backgroundColor?: string;
}

const CustomCardsSection = ({
  title,
  subtitle,
  items = [],
  buttonText,
  buttonLink,
  backgroundColor,
}: CustomCardsSectionProps) => {
  const bgStyle = backgroundColor ? { backgroundColor } : {};

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="py-6 md:py-5 px-4 md:px-20 bg-white md:mt-12" style={bgStyle}>
      <div className="container mx-auto">
        <div className="max-w-[1390px] mx-auto">
          {title && (
            <h2 className="font-logga text-[28px] md:text-[42px] font-semibold md:font-normal text-center mb-4 md:mb-8">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="font-jost font-light text-center text-gray-600 text-base md:text-lg mb-8 md:mb-16">
              {subtitle}
            </p>
          )}
          <div className="flex flex-col md:flex-row gap-3 justify-between">
            {items.map((item, index) => (
              <ServiceCard
                key={index}
                imageSrc={item.image}
                serviceName={item.title}
                subtitle={item.subtitle}
              />
            ))}
          </div>
          {buttonLink && buttonText && (
            <div className="text-center mt-6 md:mt-10 mb-6 md:mb-8">
              <Link href={buttonLink}>
                <button className="py-3 px-6 bg-[#495D4D] text-white text-base md:text-lg font-heading font-medium tracking-widest hover:bg-[#2d4a2d] transition-colors">
                  {buttonText}
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CustomCardsSection;
