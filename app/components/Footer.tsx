'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslations } from '@/app/providers/TranslationsProvider';
import { localizedPath, type Locale } from '@/app/lib/i18n';
import type { FooterSection } from '@/app/lib/footer';

interface FooterLink {
  label: string;
  url: string;
  isExternal?: boolean;
}

interface FooterButton {
  label: string;
  url: string;
  variant: 'primary' | 'secondary';
  isExternal?: boolean;
}

interface SocialLink {
  platform: string;
  url: string;
}

// Social icons mapping
const SocialIcon = ({ platform }: { platform: string }) => {
  const icons: Record<string, React.ReactNode> = {
    facebook: (
      <svg className="w-4 h-4 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    instagram: (
      <svg className="w-4 h-4 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
    youtube: (
      <svg className="w-4 h-4 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    tiktok: (
      <svg className="w-4 h-4 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
      </svg>
    ),
    twitter: (
      <svg className="w-4 h-4 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    linkedin: (
      <svg className="w-4 h-4 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  };
  return icons[platform] || icons.facebook;
};

/**
 * sections arrives already fetched server-side (see app/lib/footer.ts's
 * getFooterSections, called from the homepage and the (pages) layout), so
 * this renders the real CMS footer on first paint - no client fetch, no
 * loading state, nothing for a crawler (or a user on a slow connection) to
 * catch mid-fallback.
 */
const Footer = ({ sections: initialSections }: { sections?: FooterSection[] } = {}) => {
  const pathname = usePathname();
  const { t, locale } = useTranslations('footer');
  const [sections, setSections] = useState<FooterSection[]>(initialSections || []);
  const [isLoading, setIsLoading] = useState(!initialSections);

  // Helper to create localized link
  const link = (path: string) => localizedPath(locale as Locale, path);

  // Hide footer on specific pages (booking flow)
  const shouldHideFooter = (() => {
    // Exact matches: /cabins, /search (with optional locale prefix)
    const exactPatterns = ['/search'];
    const isExactMatch = exactPatterns.some(pattern => {
      const regex = new RegExp(`^(/[a-z]{2})?${pattern}$`);
      return regex.test(pathname);
    });

    // Prefix matches: /cabins/* (cabin detail pages)
    const prefixPatterns = ['/cabins/'];
    const isPrefixMatch = prefixPatterns.some(pattern => {
      const regex = new RegExp(`^(/[a-z]{2})?${pattern}`);
      return regex.test(pathname);
    });

    return isExactMatch || isPrefixMatch;
  })();

  // Footer sections come from the server component parent for SSR - see the
  // comment above. Fallback: fetch client-side only if not provided (e.g. a
  // page that hasn't been updated to pass it yet), same pattern as
  // Header.tsx's hero settings. MUST be before any conditional returns.
  useEffect(() => {
    if (initialSections) return;
    const fetchSections = async () => {
      try {
        const response = await fetch('/api/footer-sections', {
          headers: {
            'x-language': locale,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setSections(data);
        }
      } catch (error) {
        console.error('Failed to fetch footer sections:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSections();
  }, [locale, initialSections]);

  // Early return for pages that don't show footer - AFTER all hooks
  if (shouldHideFooter) {
    return null;
  }

  // Get section by type
  const getSection = (type: string) => sections.find(s => s.sectionType === type);
  const getLinkColumns = () => sections.filter(s => s.sectionType === 'LINK_COLUMN');

  // Render logo & description section
  const renderLogoDescription = () => {
    const section = getSection('LOGO_DESCRIPTION');
    const config = section?.config || {};
    const logoUrl = (config.logoUrl as string) || '/assets/Group 1.png';
    const description = (config.description as string) || t('description_line1', 'Luxury Cabines with private wellness.') + '\n' + t('description_line2', 'Eat, sleep & relax above the trees in Eupen, Belgium.');
    const lines = description.split('\n');

    return (
      <div className="w-[240px] flex-shrink-0">
        <Image src={logoUrl} alt="Cabanéau Logo" width={150} height={50} className="mb-3" />
        <p className="text-[13px] font-jost font-light leading-[1.4] text-white">
          {lines.map((line, i) => (
            <span key={i}>{line}{i < lines.length - 1 && <br/>}</span>
          ))}
        </p>
      </div>
    );
  };

  // Render link column
  const renderLinkColumn = (section: FooterSection) => {
    const links = (section.config.links as FooterLink[]) || [];
    return (
      <div key={section.id}>
        <h3 className="font-logga text-[16px] mb-3 text-customyellow">{section.title}</h3>
        <ul className="space-y-1.5 font-jost font-light text-[13px] text-gray-100">
          {links.map((linkItem, index) => (
            <li key={index}>
              {linkItem.isExternal ? (
                <a href={linkItem.url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                  {linkItem.label}
                </a>
              ) : (
                <Link href={link(linkItem.url)} className="hover:text-white transition">
                  {linkItem.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Render contact info section
  const renderContactInfo = () => {
    const section = getSection('CONTACT_INFO');
    if (!section) return null;

    const config = section.config || {};
    const phone = (config.phone as string) || '';
    const email = (config.email as string) || '';
    const address = (config.address as string) || '';
    const addressLines = address.split('\n');

    return (
      <div>
        <h3 className="font-logga text-[16px] mb-3 text-customyellow">{section.title || t('section_contact_us', 'Contact Us')}</h3>
        <ul className="space-y-2 font-jost font-light text-[13px] text-gray-100">
          {phone && (
            <li className="flex items-start gap-2">
              <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <a href={`tel:${phone.replace(/[^+\d]/g, '')}`} className="hover:text-white transition">{phone}</a>
            </li>
          )}
          {email && (
            <li className="flex items-start gap-2">
              <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <a href={`mailto:${email}`} className="hover:text-white transition">{email}</a>
            </li>
          )}
          {address && (
            <li className="flex items-start gap-2">
              <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="leading-[1.4]">
                {addressLines.map((line, i) => (
                  <span key={i}>{line}{i < addressLines.length - 1 && <br/>}</span>
                ))}
              </span>
            </li>
          )}
        </ul>
      </div>
    );
  };

  // Render CTA buttons
  const renderCtaButtons = () => {
    const section = getSection('CTA_BUTTONS');
    if (!section) return null;

    const buttons = (section.config.buttons as FooterButton[]) || [];

    return (
      <div className="flex flex-col gap-2.5 flex-shrink-0">
        {buttons.map((button, index) => {
          const buttonClasses = button.variant === 'primary'
            ? 'bg-[#495D4D] hover:bg-[#3d5a3d]'
            : 'bg-[#939D92] hover:bg-[#7d8d7d]';

          return button.isExternal ? (
            <a
              key={index}
              href={button.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${buttonClasses} font-heading text-white w-[134px] h-[40px] flex items-center justify-center text-[13px] font-medium tracking-wider transition whitespace-nowrap`}
            >
              {button.label}
            </a>
          ) : (
            <Link
              key={index}
              href={link(button.url)}
              className={`${buttonClasses} font-heading text-white w-[134px] h-[40px] flex items-center justify-center text-[13px] font-medium tracking-wider transition whitespace-nowrap`}
            >
              {button.label}
            </Link>
          );
        })}
      </div>
    );
  };

  // Render social links
  const renderSocialLinks = () => {
    const section = getSection('SOCIAL_LINKS');
    if (!section) return null;

    const links = (section.config.links as SocialLink[]) || [];

    return (
      <div className="flex items-center gap-3">
        {links.map((social, index) => (
          <a
            key={index}
            href={social.url}
            aria-label={social.platform}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 bg-white flex items-center justify-center hover:bg-gray-200 transition rounded-none"
          >
            <SocialIcon platform={social.platform} />
          </a>
        ))}
      </div>
    );
  };

  // Render bottom bar
  const renderBottomBar = () => {
    const section = getSection('BOTTOM_BAR');
    const config = section?.config || {};
    let copyrightText = (config.copyrightText as string) || '{year} Cabaneau All Rights Reserved.';
    copyrightText = copyrightText.replace('{year}', new Date().getFullYear().toString());
    const links = (config.links as FooterLink[]) || [];

    return (
      <div className="pt-6 border-t border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[13px] font-jost font-light text-gray-100">{copyrightText}</p>

          <div className="flex items-center gap-4 md:gap-6">
            {links.map((linkItem, index) => (
              <Link
                key={index}
                href={link(linkItem.url)}
                className="text-[13px] font-jost font-light text-gray-100 hover:text-white transition"
              >
                {linkItem.label}
              </Link>
            ))}
          </div>

          {renderSocialLinks()}
        </div>
      </div>
    );
  };

  // Mobile layout for link columns
  const renderMobileLinkColumns = () => {
    const linkColumns = getLinkColumns();
    return (
      <div className="grid grid-cols-2 gap-6 mb-8">
        {linkColumns.map(section => {
          const links = (section.config.links as FooterLink[]) || [];
          return (
            <div key={section.id}>
              <h3 className="font-logga text-[18px] mb-4 text-customyellow">{section.title}</h3>
              <ul className="space-y-2 font-jost font-light text-[13px] text-gray-100">
                {links.map((linkItem, index) => (
                  <li key={index}>
                    {linkItem.isExternal ? (
                      <a href={linkItem.url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                        {linkItem.label}
                      </a>
                    ) : (
                      <Link href={link(linkItem.url)} className="hover:text-white transition">
                        {linkItem.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
        {renderContactInfo() && (
          <div>
            {(() => {
              const section = getSection('CONTACT_INFO');
              if (!section) return null;
              const config = section.config || {};
              const phone = (config.phone as string) || '';
              const email = (config.email as string) || '';
              const address = (config.address as string) || '';
              const addressLines = address.split('\n');

              return (
                <>
                  <h3 className="font-logga text-[18px] mb-4 text-customyellow">{section.title || t('section_contact_us', 'Contact Us')}</h3>
                  <ul className="space-y-3 font-jost font-light text-[13px] text-gray-100">
                    {phone && (
                      <li className="flex items-start gap-2">
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <a href={`tel:${phone.replace(/[^+\d]/g, '')}`} className="hover:text-white transition">{phone}</a>
                      </li>
                    )}
                    {email && (
                      <li className="flex items-start gap-2">
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        <a href={`mailto:${email}`} className="hover:text-white transition">{email}</a>
                      </li>
                    )}
                    {address && (
                      <li className="flex items-start gap-2">
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span>
                          {addressLines.map((line, i) => (
                            <span key={i}>{line}{i < addressLines.length - 1 && <br/>}</span>
                          ))}
                        </span>
                      </li>
                    )}
                  </ul>
                </>
              );
            })()}
          </div>
        )}
      </div>
    );
  };

  // Mobile CTA buttons
  const renderMobileCtaButtons = () => {
    const section = getSection('CTA_BUTTONS');
    if (!section) return null;

    const buttons = (section.config.buttons as FooterButton[]) || [];

    return (
      <div className="flex gap-3 mb-6">
        {buttons.map((button, index) => {
          const buttonClasses = button.variant === 'primary'
            ? 'bg-[#495D4D] hover:bg-[#3d5a3d]'
            : 'bg-[#939D92] hover:bg-[#7d8d7d]';

          return button.isExternal ? (
            <a
              key={index}
              href={button.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${buttonClasses} font-heading text-white flex-1 h-[43px] flex items-center justify-center text-sm font-medium tracking-wider transition whitespace-nowrap`}
            >
              {button.label}
            </a>
          ) : (
            <Link
              key={index}
              href={link(button.url)}
              className={`${buttonClasses} font-heading text-white flex-1 h-[43px] flex items-center justify-center text-sm font-medium tracking-wider transition whitespace-nowrap`}
            >
              {button.label}
            </Link>
          );
        })}
      </div>
    );
  };

  // If loading or no sections, show static fallback
  if (isLoading || sections.length === 0) {
    return <FooterFallback t={t} link={link} />;
  }

  return (
    <footer className="bg-[#1a1a1a] text-white m-2 md:m-5">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8 lg:px-20 py-8 md:py-12">
        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Logo and Description */}
          <div className="mb-6">
            {(() => {
              const section = getSection('LOGO_DESCRIPTION');
              const config = section?.config || {};
              const logoUrl = (config.logoUrl as string) || '/assets/Group 1.png';
              const description = (config.description as string) || t('description_line1', 'Luxury Cabines with private wellness.') + '\n' + t('description_line2', 'Eat, sleep & relax above the trees in Eupen, Belgium.');
              const lines = description.split('\n');

              return (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <Image src={logoUrl} alt="Cabanéau Logo" width={150} height={50} className="max-w-full" />
                  </div>
                  <p className="text-[16px] font-jost font-light leading-relaxed text-gray-100 max-w-[354px]">
                    {lines.map((line, i) => (
                      <span key={i}>{line}{i < lines.length - 1 && <br/>}</span>
                    ))}
                  </p>
                </>
              );
            })()}
          </div>

          {/* Mobile Buttons */}
          {renderMobileCtaButtons()}

          {/* Mobile Links Grid */}
          {renderMobileLinkColumns()}
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex justify-between items-start mb-12">
          {renderLogoDescription()}

          {/* Center Section - Link Columns */}
          <div className="flex gap-12 lg:gap-16 xl:gap-20">
            {getLinkColumns().map(section => renderLinkColumn(section))}
            {renderContactInfo()}
          </div>

          {/* Buttons */}
          {renderCtaButtons()}
        </div>

        {/* Bottom Section */}
        {renderBottomBar()}
      </div>
    </footer>
  );
};

// Static fallback component when API fails or loading
const FooterFallback = ({ t, link }: { t: (key: string, fallback: string) => string; link: (path: string) => string }) => (
  <footer className="bg-[#1a1a1a] text-white m-2 md:m-5">
    <div className="max-w-[1920px] mx-auto px-4 md:px-8 lg:px-20 py-8 md:py-12">
      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Image src="/assets/Group 1.png" alt="Cabanéau Logo" width={150} height={50} className="max-w-full" />
          </div>
          <p className="text-[16px] font-jost font-light leading-relaxed text-gray-100 max-w-[354px]">
            {t('description_line1', 'Luxury Cabines with private wellness.')}<br/>
            {t('description_line2', 'Eat, sleep & relax above the trees in Eupen, Belgium.')}
          </p>
        </div>

        <div className="flex gap-3 mb-6">
          <Link href={link('/search')} className="bg-[#495D4D] font-heading text-white flex-1 h-[43px] flex items-center justify-center text-sm font-medium tracking-wider hover:bg-[#3d5a3d] transition whitespace-nowrap">
            {t('button_book_now', 'BOOK NOW')}
          </Link>
          <Link href={link('/gift-voucher')} className="bg-[#939D92] font-heading text-white flex-1 h-[43px] flex items-center justify-center text-sm font-medium tracking-wider hover:bg-[#7d8d7d] transition whitespace-nowrap">
            {t('button_gift_voucher', 'GIFT VOUCHER')}
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="font-logga text-[18px] mb-4 text-customyellow">{t('section_our_cabins', 'Our Cabins')}</h3>
            <ul className="space-y-2 font-jost font-light text-[13px] text-gray-100">
              <li><Link href={link('/cabins')} className="hover:text-white transition">{t('menu_all_cabins', 'View All Cabins')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-logga text-[18px] mb-4 text-customyellow">{t('section_contact_us', 'Contact Us')}</h3>
            <ul className="space-y-3 font-jost font-light text-[13px] text-gray-100">
              <li>
                <a href="mailto:hello@cabaneau.com" className="hover:text-white transition">{t('contact_email', 'hello@cabaneau.com')}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex justify-between items-start mb-12">
        <div className="w-[240px] flex-shrink-0">
          <Image src="/assets/Group 1.png" alt="Cabanéau Logo" width={150} height={50} className="mb-3" />
          <p className="text-[13px] font-jost font-light leading-[1.4] text-white">
            {t('description_line1', 'Luxury Cabines with private wellness.')}<br/>
            {t('description_line2', 'Eat, sleep & relax above the trees in Eupen, Belgium.')}
          </p>
        </div>

        <div className="flex gap-12 lg:gap-16 xl:gap-20">
          <div>
            <h3 className="font-logga text-[16px] mb-3 text-customyellow">{t('section_our_cabins', 'Our Cabins')}</h3>
            <ul className="space-y-1.5 font-jost font-light text-[13px] text-gray-100">
              <li><Link href={link('/cabins')} className="hover:text-white transition">{t('menu_all_cabins', 'View All Cabins')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-logga text-[16px] mb-3 text-customyellow">{t('section_contact_us', 'Contact Us')}</h3>
            <ul className="space-y-2 font-jost font-light text-[13px] text-gray-100">
              <li>
                <a href="mailto:hello@cabaneau.com" className="hover:text-white transition">{t('contact_email', 'hello@cabaneau.com')}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 flex-shrink-0">
          <Link href={link('/search')} className="bg-[#495D4D] font-heading text-white w-[134px] h-[40px] flex items-center justify-center text-[13px] font-medium tracking-wider hover:bg-[#3d5a3d] transition whitespace-nowrap">
            {t('button_book_now', 'BOOK NOW')}
          </Link>
          <Link href={link('/gift-voucher')} className="bg-[#939D92] font-heading text-white w-[134px] h-[40px] flex items-center justify-center text-[13px] font-medium tracking-wider hover:bg-[#7d8d7d] transition whitespace-nowrap">
            {t('button_gift_voucher', 'GIFT VOUCHER')}
          </Link>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[13px] font-jost font-light text-gray-100">{new Date().getFullYear()} Cabaneau All Rights Reserved.</p>
          <div className="flex items-center gap-4 md:gap-6">
            <Link href={link('/terms')} className="text-[13px] font-jost font-light text-gray-100 hover:text-white transition">
              {t('link_terms', 'Terms & Conditions')}
            </Link>
            <Link href={link('/privacy')} className="text-[13px] font-jost font-light text-gray-100 hover:text-white transition">
              {t('link_privacy', 'Privacy Policy')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
