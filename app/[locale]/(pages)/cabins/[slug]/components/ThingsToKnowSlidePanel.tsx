'use client';

import { useEffect } from 'react';
import {
  type CMSThingsToKnowSection,
  type CancellationSection,
  cancellationPolicyContent,
  getLocalizedText,
  calculateCancellationDate,
  formatDateForLocale,
  isOldFormat,
  replaceTemplatePlaceholders,
} from './thingsToKnowContent';

export type PanelType = string;

// Fallback text when no check-in date is selected
const noDateFallback = {
  en: "14 days before check-in",
  fr: "14 jours avant l'arrivee",
  de: "14 Tage vor dem Check-in",
  nl: "14 dagen voor inchecken"
};

interface ThingsToKnowSlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  type: PanelType;
  checkIn?: string;
  capacity: number;
  locale: string;
  thingsToKnow?: CMSThingsToKnowSection[];
}

const ThingsToKnowSlidePanel = ({
  isOpen,
  onClose,
  type,
  checkIn,
  capacity,
  locale,
  thingsToKnow,
}: ThingsToKnowSlidePanelProps) => {
  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const isCancellation = type === 'cancellation';

  // Get CMS section by index
  const getCMSSection = (): CMSThingsToKnowSection | null => {
    if (!type.startsWith('cms_') || !thingsToKnow) return null;
    const index = parseInt(type.replace('cms_', ''), 10);
    return thingsToKnow[index] || null;
  };

  // Determine title
  const getTitle = (): string => {
    if (isCancellation) {
      return getLocalizedText(cancellationPolicyContent.title, locale);
    }
    const section = getCMSSection();
    return section ? replaceTemplatePlaceholders(section.title || '', { capacity }) : '';
  };

  // Render cancellation policy content with tiers
  const renderCancellationContent = (section: CancellationSection) => {
    const refundDate = calculateCancellationDate(checkIn || '');
    const formattedRefundDate = refundDate
      ? formatDateForLocale(refundDate, locale)
      : noDateFallback[locale as keyof typeof noDateFallback] || noDateFallback.en;

    return (
      <>
        <div className="space-y-6">
          {section.tiers.map((tier, tierIndex) => (
            <div
              key={tierIndex}
              className={`pb-6 ${tierIndex < section.tiers.length - 1 ? 'border-b border-[#EBEBEB]' : ''}`}
            >
              <p className="font-jost text-[#212121] text-base mb-3">
                <span className="font-medium">{getLocalizedText(tier.label, locale)}</span>{' '}
                <span className="font-semibold">{formattedRefundDate}</span>
              </p>
              <div className="mb-3">
                <span
                  className={`inline-block px-3 py-1.5 rounded-full font-jost font-medium text-sm ${
                    tierIndex === 0
                      ? 'bg-[#E8F5E9] text-[#2E7D32]'
                      : 'bg-[#FFEBEE] text-[#C62828]'
                  }`}
                >
                  {getLocalizedText(tier.refundType, locale)}
                </span>
              </div>
              <p className="font-jost font-light text-gray-600 text-base">
                {getLocalizedText(tier.description, locale)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-[#EBEBEB]">
          <p className="font-jost font-light text-gray-500 text-sm">
            {getLocalizedText(section.footer.timeNote, locale)}
          </p>
        </div>
      </>
    );
  };

  // Render CMS section content
  const renderCMSContent = (s: CMSThingsToKnowSection) => {
    if (isOldFormat(s)) {
      const lines = (s.content || '').split('\n').filter((l: string) => l.trim());
      return (
        <div className="space-y-3">
          {lines.map((line: string, i: number) => (
            <p key={i} className="font-jost font-light text-[#212121] text-base">
              {replaceTemplatePlaceholders(line, { capacity })}
            </p>
          ))}
        </div>
      );
    }

    return (
      <>
        {s.intro && (
          <p className="text-gray-600 font-jost font-light text-base leading-relaxed">
            {replaceTemplatePlaceholders(s.intro, { capacity })}
          </p>
        )}

        {(s.groups || []).map((group, groupIndex) => (
          <div key={groupIndex} className={groupIndex > 0 ? 'border-t border-[#EBEBEB]' : ''}>
            <h3 className="font-jost font-medium text-base text-[#212121] pt-6 pb-4">
              {replaceTemplatePlaceholders(group.header || '', { capacity })}
            </h3>
            <div className="space-y-4 pb-2">
              {(group.items || []).map((item, itemIndex) => {
                const hasDescription = item.text && item.description;
                const displayText = item.text ? replaceTemplatePlaceholders(item.text, { capacity }) : '';
                const displayDescription = item.description ? replaceTemplatePlaceholders(item.description, { capacity }) : '';

                return (
                  <div key={itemIndex} className="flex gap-4">
                    <div className="flex-shrink-0 w-6 text-center text-[#495D4D]">
                      <i className={`fa-regular ${item.icon} text-xl`}></i>
                    </div>
                    <div className="flex-1">
                      {hasDescription ? (
                        <>
                          <p className="font-jost font-medium text-[#212121] text-base">{displayText}</p>
                          <p className="font-jost font-light text-gray-600 text-sm mt-1">{displayDescription}</p>
                        </>
                      ) : (
                        <p className="font-jost font-light text-[#212121] text-base">{displayText}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {s.footer && (
          <div className="mt-6 pt-4 border-t border-[#EBEBEB]">
            <p className="font-jost font-light text-gray-500 text-sm">
              {replaceTemplatePlaceholders(s.footer, { capacity })}
            </p>
          </div>
        )}
      </>
    );
  };

  const title = getTitle();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-[69] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Panel - slides from right */}
      <div
        className={`fixed top-0 left-0 right-0 bottom-0 bg-white z-[70] transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white z-10 px-4 py-4 border-b border-[#EBEBEB]">
          <button
            onClick={onClose}
            className="flex items-center text-[#212121] font-jost font-medium text-base"
            aria-label="Close panel"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto h-[calc(100%-60px)] px-4 pt-6 pb-8">
          <h2 className="font-logga font-semibold text-2xl uppercase tracking-wide text-[#212121] mb-4">
            {title}
          </h2>
          {isCancellation
            ? renderCancellationContent(cancellationPolicyContent)
            : getCMSSection() && renderCMSContent(getCMSSection()!)}
        </div>
      </div>
    </>
  );
};

export default ThingsToKnowSlidePanel;
