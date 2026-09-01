'use client';

import Image from 'next/image';
import { useTranslations } from '@/app/providers/TranslationsProvider';

interface HostsConfig {
  names?: string;
  image?: string;
  description?: string;
  /** Contact details for the "Get in touch" block. Set per site in the CMS. */
  phone?: string;
  email?: string;
  instagram?: string;
}

interface HostsSectionProps {
  title?: string;
  subtitle?: string;
  config?: HostsConfig;
  backgroundColor?: string;
}

const HostsSection = ({
  title,
  subtitle,
  config,
  backgroundColor,
}: HostsSectionProps) => {
  const { t } = useTranslations('homepage');

  const displayTitle = title || t('hosts_section.title', 'THE HOSTS');
  const displayNames = config?.names || t('hosts_section.names', 'DANIEL & YANNICK');
  const displayImage = config?.image || '/assets/d206536ef067f64b29cad184324fe360bb763e30.jpg';
  const displayDescription = config?.description || t('hosts_section.description', 'Welcome to our treehouse retreat. We look forward to hosting you in our unique accommodations.');
  const phone = config?.phone;
  const email = config?.email;
  const instagram = config?.instagram;
  const hasContactDetails = Boolean(phone || email || instagram);

  const bgStyle = backgroundColor ? { backgroundColor } : {};

  return (
    <section className="py-6 md:py-5 px-4 md:px-20 bg-tint md:mt-12" style={bgStyle}>
      <div className="container mx-auto">
        <div className="max-w-[1390px] mx-auto">
          <h2 className={`font-logga text-[28px] md:text-[42px] font-semibold md:font-normal text-left pt-6 md:pt-10 ${subtitle ? 'mb-3 md:mb-4' : 'mb-10 md:mb-16'}`}>
            {displayTitle}
          </h2>
          {subtitle && (
            <p className="text-left text-gray-600 text-base md:text-lg mb-10 md:mb-16">
              {subtitle}
            </p>
          )}

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
              {hasContactDetails && (
                <div className="mt-6 md:mt-8">
                  <h4 className="font-heading font-medium text-[16px] md:text-[18px] tracking-widest uppercase mb-4 text-[#495D4D]">
                    {t('hosts_section.get_in_touch', 'GET IN TOUCH')}
                  </h4>
                  <ul className="flex flex-col gap-3 font-jost font-light text-[16px] md:text-[18px]">
                    {phone && (
                      <li className="flex items-center gap-3">
                        <svg className="w-5 h-5 flex-shrink-0 text-[#495D4D]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <a href={`tel:${phone.replace(/[^+\d]/g, '')}`} className="hover:text-[#F49A4A] transition-colors">
                          {phone}
                        </a>
                      </li>
                    )}
                    {email && (
                      <li className="flex items-center gap-3">
                        <svg className="w-5 h-5 flex-shrink-0 text-[#495D4D]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        <a href={`mailto:${email}`} className="hover:text-[#F49A4A] transition-colors">
                          {email}
                        </a>
                      </li>
                    )}
                    {instagram && (
                      <li className="flex items-center gap-3">
                        <svg className="w-5 h-5 flex-shrink-0 text-[#495D4D]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                        </svg>
                        <a href={instagram} target="_blank" rel="noopener noreferrer" className="hover:text-[#F49A4A] transition-colors">
                          Instagram
                        </a>
                      </li>
                    )}
                  </ul>
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
