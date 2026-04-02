'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from '@/app/providers/TranslationsProvider';

interface HostsConfig {
  names?: string;
  image?: string;
  description?: string;
}

interface HostsSectionProps {
  title?: string;
  config?: HostsConfig;
  buttonText?: string;
  buttonLink?: string;
  backgroundColor?: string;
}

const HostsSection = ({
  title,
  config,
  buttonText,
  buttonLink,
  backgroundColor,
}: HostsSectionProps) => {
  const { t } = useTranslations('homepage');

  const displayTitle = title || t('hosts_section.title', 'THE HOSTS');
  const displayNames = config?.names || t('hosts_section.names', 'DANIEL & YANNICK');
  const displayImage = config?.image || '/assets/d206536ef067f64b29cad184324fe360bb763e30.jpg';
  const displayDescription = config?.description || t('hosts_section.description', 'Welcome to our treehouse retreat. We look forward to hosting you in our unique accommodations.');
  const displayButtonText = buttonText || t('hosts_section.button', 'ABOUT US');
  const displayButtonLink = buttonLink || '/about';

  const bgStyle = backgroundColor ? { backgroundColor } : {};

  return (
    <section className="py-6 md:py-5 px-4 md:px-20 bg-tint md:mt-12" style={bgStyle}>
      <div className="container mx-auto">
        <div className="max-w-[1390px] mx-auto">
          <h2 className="font-logga text-[28px] md:text-[42px] font-semibold md:font-normal text-left pt-6 md:pt-10 mb-10 md:mb-16">
            {displayTitle}
          </h2>

          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Image Section */}
            <div className="flex-shrink-0">
              <div className="relative w-full md:w-[501px] h-[400px] md:h-[569px]">
                <Image
                  src={displayImage}
                  alt={`${displayNames} - Hosts`}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="object-top"
                />
              </div>
            </div>

            {/* Text Section */}
            <div className="flex-1 flex flex-col justify-start">
              <h3 className="font-jost text-[24px] md:text-[40px] font-medium mb-4 md:mb-6 tracking-wide">
                {displayNames}
              </h3>
              <div
                className="font-jost font-light text-[16px] md:text-[18px] leading-relaxed"
                style={{ color: '#706C6C' }}
                dangerouslySetInnerHTML={{ __html: displayDescription }}
              />
              {displayButtonLink && (
                <div className="mt-6 md:mt-8">
                  <Link href={displayButtonLink}>
                    <button className="py-3 px-6 bg-[#495D4D] text-white text-base md:text-lg font-heading font-medium tracking-widest hover:bg-[#2d4a2d] transition-colors">
                      {displayButtonText}
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HostsSection;
