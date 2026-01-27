'use client';

import { useState } from 'react';
import ThingsToKnowSlidePanel, { type PanelType } from './ThingsToKnowSlidePanel';
import {
  houseRulesContent,
  safetyPropertyContent,
  cancellationPolicyContent,
  getLocalizedText,
  replaceTemplatePlaceholders,
  getCancellationPreviewText,
} from './thingsToKnowContent';

interface ThingsToKnowMobileProps {
  checkIn?: string;
  checkOut?: string;
  capacity: number;
  locale: string;
}

interface RowConfig {
  type: PanelType;
  icon: string;
  title: string;
  previewLines: string[];
}

const ThingsToKnowMobile = ({
  checkIn,
  checkOut,
  capacity,
  locale,
}: ThingsToKnowMobileProps) => {
  const [activePanel, setActivePanel] = useState<PanelType | null>(null);

  // Build row configurations
  const getRows = (): RowConfig[] => {
    // Cancellation policy preview with dynamic dates
    const cancellationPreview = getCancellationPreviewText(checkIn, locale);

    return [
      {
        type: 'cancellation',
        icon: 'fa-calendar-xmark',
        title: getLocalizedText(cancellationPolicyContent.title, locale),
        previewLines: [cancellationPreview.line1, cancellationPreview.line2],
      },
      {
        type: 'house_rules',
        icon: 'fa-house-chimney',
        title: getLocalizedText(houseRulesContent.title, locale),
        previewLines: houseRulesContent.preview
          .slice(0, 3)
          .map((text) =>
            replaceTemplatePlaceholders(getLocalizedText(text, locale), { capacity })
          ),
      },
      {
        type: 'safety',
        icon: 'fa-shield-halved',
        title: getLocalizedText(safetyPropertyContent.title, locale),
        previewLines: safetyPropertyContent.preview
          .slice(0, 3)
          .map((text) => getLocalizedText(text, locale)),
      },
    ];
  };

  const rows = getRows();

  const handleRowClick = (type: PanelType) => {
    setActivePanel(type);
  };

  const handleClosePanel = () => {
    setActivePanel(null);
  };

  return (
    <>
      {/* Mobile Rows Container */}
      <div className="divide-y divide-[#EBEBEB]">
        {rows.map((row) => (
          <button
            key={row.type}
            onClick={() => handleRowClick(row.type)}
            className="w-full py-6 flex items-start gap-4 text-left focus:outline-none active:bg-gray-50 transition-colors"
          >
            {/* Icon */}
            <div className="flex-shrink-0 w-8 pt-0.5">
              <i className={`fa-solid ${row.icon} text-[#222222] text-2xl`}></i>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Title */}
              <h3 className="text-[#222222] text-base font-semibold mb-1">
                {row.title}
              </h3>

              {/* Preview Lines */}
              <div className="space-y-0.5">
                {row.previewLines.map((line, index) => (
                  <p
                    key={index}
                    className="text-[#717171] text-sm leading-relaxed truncate"
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>

            {/* Chevron */}
            <div className="flex-shrink-0 pt-1">
              <svg
                className="w-4 h-4 text-[#222222]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Slide Panel */}
      <ThingsToKnowSlidePanel
        isOpen={activePanel !== null}
        onClose={handleClosePanel}
        type={activePanel || 'house_rules'}
        checkIn={checkIn}
        checkOut={checkOut}
        capacity={capacity}
        locale={locale}
      />
    </>
  );
};

export default ThingsToKnowMobile;
