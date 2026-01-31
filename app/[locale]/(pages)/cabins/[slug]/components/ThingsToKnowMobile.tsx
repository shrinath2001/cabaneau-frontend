'use client';

import { useState } from 'react';
import ThingsToKnowSlidePanel from './ThingsToKnowSlidePanel';
import {
  type CMSThingsToKnowSection,
  cancellationPolicyContent,
  getLocalizedText,
  getCancellationPreviewText,
  isOldFormat,
  replaceTemplatePlaceholders,
} from './thingsToKnowContent';

interface ThingsToKnowMobileProps {
  checkIn?: string;
  capacity: number;
  locale: string;
  thingsToKnow?: CMSThingsToKnowSection[];
}

interface RowConfig {
  type: string;
  icon: string;
  title: string;
  previewLines: string[];
}

const ThingsToKnowMobile = ({
  checkIn,
  capacity,
  locale,
  thingsToKnow,
}: ThingsToKnowMobileProps) => {
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const getRows = (): RowConfig[] => {
    const rows: RowConfig[] = [];

    // Cancellation policy - always first
    const cancellationPreview = getCancellationPreviewText(checkIn, locale);
    rows.push({
      type: 'cancellation',
      icon: 'fa-calendar-xmark',
      title: getLocalizedText(cancellationPolicyContent.title, locale),
      previewLines: [cancellationPreview.line1, cancellationPreview.line2],
    });

    // CMS-driven sections follow
    if (thingsToKnow && thingsToKnow.length > 0) {
      thingsToKnow.forEach((section, index) => {
        if (isOldFormat(section)) {
          const contentLines = (section.content || '').split('\n').filter((l: string) => l.trim()).slice(0, 3);
          rows.push({
            type: `cms_${index}`,
            icon: section.icon || 'fa-info-circle',
            title: section.title || '',
            previewLines: contentLines,
          });
        } else {
          const previewLines = (section.previewItems || [])
            .slice(0, 3)
            .map((pi) => replaceTemplatePlaceholders(pi.text || '', { capacity }));
          rows.push({
            type: `cms_${index}`,
            icon: section.icon || 'fa-info-circle',
            title: replaceTemplatePlaceholders(section.title || '', { capacity }),
            previewLines,
          });
        }
      });
    }

    return rows;
  };

  const rows = getRows();

  return (
    <>
      <div className="divide-y divide-[#EBEBEB]">
        {rows.map((row) => (
          <button
            key={row.type}
            onClick={() => setActivePanel(row.type)}
            className="w-full py-6 flex items-start gap-4 text-left focus:outline-none active:bg-gray-50 transition-colors"
          >
            <div className="flex-shrink-0 w-8 pt-0.5">
              <i className={`fa-solid ${row.icon} text-[#222222] text-2xl`}></i>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[#222222] text-base font-semibold mb-1">
                {row.title}
              </h3>
              <div className="space-y-0.5">
                {row.previewLines.map((line, index) => (
                  <p key={index} className="text-[#717171] text-sm leading-relaxed truncate">
                    {line}
                  </p>
                ))}
              </div>
            </div>
            <div className="flex-shrink-0 pt-1">
              <svg className="w-4 h-4 text-[#222222]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      <ThingsToKnowSlidePanel
        isOpen={activePanel !== null}
        onClose={() => setActivePanel(null)}
        type={activePanel || 'cancellation'}
        checkIn={checkIn}
        capacity={capacity}
        locale={locale}
        thingsToKnow={thingsToKnow}
      />
    </>
  );
};

export default ThingsToKnowMobile;
