'use client';

import { useEffect } from 'react';
import {
  houseRulesContent,
  safetyPropertyContent,
  cancellationPolicyContent,
  getLocalizedText,
  replaceTemplatePlaceholders,
  calculateCancellationDate,
  formatDateForLocale,
  type ThingsToKnowSection,
  type CancellationSection,
} from './thingsToKnowContent';

export type PanelType = 'house_rules' | 'safety' | 'cancellation';

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
  checkOut?: string;
  capacity: number;
  locale: string;
}

const ThingsToKnowSlidePanel = ({
  isOpen,
  onClose,
  type,
  checkIn,
  capacity,
  locale,
}: ThingsToKnowSlidePanelProps) => {
  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Get content based on type
  const getContent = (): ThingsToKnowSection | CancellationSection => {
    switch (type) {
      case 'house_rules':
        return houseRulesContent;
      case 'safety':
        return safetyPropertyContent;
      case 'cancellation':
        return cancellationPolicyContent;
      default:
        return houseRulesContent;
    }
  };

  const content = getContent();
  const isCancellation = type === 'cancellation';

  // Render regular section content (house rules, safety)
  const renderSectionContent = (section: ThingsToKnowSection) => {
    return (
      <>
        {/* Intro */}
        {section.intro && (
          <p className="text-gray-600 font-jost font-light text-base leading-relaxed">
            {getLocalizedText(section.intro, locale)}
          </p>
        )}

        {/* Groups */}
        {section.groups.map((group, groupIndex) => (
          <div key={groupIndex} className={groupIndex > 0 ? 'border-t border-[#EBEBEB]' : ''}>
            {/* Group Header */}
            <h3 className="font-jost font-medium text-base text-[#212121] pt-6 pb-4">
              {getLocalizedText(group.header, locale)}
            </h3>

            {/* Items */}
            <div className="space-y-4 pb-2">
              {group.items.map((item, itemIndex) => {
                const hasDescription = item.title && item.description;
                const displayText = item.text
                  ? replaceTemplatePlaceholders(getLocalizedText(item.text, locale), { capacity })
                  : '';
                const displayTitle = item.title
                  ? replaceTemplatePlaceholders(getLocalizedText(item.title, locale), { capacity })
                  : '';
                const displayDescription = item.description
                  ? replaceTemplatePlaceholders(getLocalizedText(item.description, locale), { capacity })
                  : '';

                return (
                  <div key={itemIndex} className="flex gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-6 text-center text-[#495D4D]">
                      <i className={`fa-regular ${item.icon} text-xl`}></i>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      {hasDescription ? (
                        <>
                          <p className="font-jost font-medium text-[#212121] text-base">{displayTitle}</p>
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
      </>
    );
  };

  // Render cancellation policy content
  const renderCancellationContent = (section: CancellationSection) => {
    const refundDate = calculateCancellationDate(checkIn || '');
    const formattedRefundDate = refundDate
      ? formatDateForLocale(refundDate, locale)
      : noDateFallback[locale as keyof typeof noDateFallback] || noDateFallback.en;

    return (
      <>
        {/* Cancellation Tiers */}
        <div className="space-y-6">
          {section.tiers.map((tier, tierIndex) => (
            <div
              key={tierIndex}
              className={`pb-6 ${tierIndex < section.tiers.length - 1 ? 'border-b border-[#EBEBEB]' : ''}`}
            >
              {/* Label and Date */}
              <p className="font-jost text-[#212121] text-base mb-3">
                <span className="font-medium">{getLocalizedText(tier.label, locale)}</span>{' '}
                <span className="font-semibold">{formattedRefundDate}</span>
              </p>

              {/* Refund Type Badge */}
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

              {/* Description */}
              <p className="font-jost font-light text-gray-600 text-base">
                {getLocalizedText(tier.description, locale)}
              </p>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-6 pt-4 border-t border-[#EBEBEB]">
          <p className="font-jost font-light text-gray-500 text-sm">
            {getLocalizedText(section.footer.timeNote, locale)}
          </p>
        </div>
      </>
    );
  };

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
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto h-[calc(100%-60px)] px-4 pt-6 pb-8">
          {/* Title */}
          <h2 className="font-logga font-semibold text-2xl uppercase tracking-wide text-[#212121] mb-4">
            {getLocalizedText(content.title, locale)}
          </h2>

          {/* Content based on type */}
          {isCancellation
            ? renderCancellationContent(content as CancellationSection)
            : renderSectionContent(content as ThingsToKnowSection)}
        </div>
      </div>
    </>
  );
};

export default ThingsToKnowSlidePanel;
