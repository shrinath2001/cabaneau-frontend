'use client';

import { useState } from 'react';
import { useTranslations } from '@/app/providers/TranslationsProvider';
import ThingsToKnowSlidePanel from './ThingsToKnowSlidePanel';
import ThingsToKnowModal from './ThingsToKnowModal';
import {
  type CMSThingsToKnowSection,
  cancellationPolicyContent,
  getLocalizedText,
  getCancellationPreviewText,
  isOldFormat,
  replaceTemplatePlaceholders,
} from './thingsToKnowContent';

interface ThingsToKnowProps {
  checkIn?: string;
  checkOut?: string;
  capacity?: number;
  locale?: string;
  thingsToKnow?: CMSThingsToKnowSection[];
}

interface RowConfig {
  type: string;
  icon: string;
  title: string;
  previewLines: string[];
}

const ThingsToKnow = ({ checkIn, checkOut, capacity = 6, locale = 'en', thingsToKnow }: ThingsToKnowProps) => {
  const { t } = useTranslations('cabin');
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Build row configurations: cancellation first (always), then CMS sections
  const getRows = (): RowConfig[] => {
    const rows: RowConfig[] = [];

    // Cancellation policy - always first, hardcoded with dynamic dates
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
    <div className="mt-8 md:mt-12">
      <h2 className="font-logga font-semibold text-[16px] md:text-[20px] mb-6 uppercase tracking-wide text-gray-800 p-4 md:p-6" style={{ backgroundColor: '#F1FAF7' }}>
        {t('detail.things_to_know', 'THINGS TO KNOW')}
      </h2>

      {/* Mobile View - Clickable rows with slide panel */}
      <div className="md:hidden divide-y divide-[#EBEBEB]">
        {rows.map((row) => (
          <button
            key={row.type}
            onClick={() => setActivePanel(row.type)}
            className="w-full py-6 flex items-start gap-4 text-left focus:outline-none active:bg-gray-50 transition-colors"
          >
            <div className="flex-shrink-0 w-8 pt-0.5 text-[#495D4D]">
              <i className={`fa-regular ${row.icon} text-2xl`}></i>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-jost font-medium text-[#212121] text-base mb-1">
                {row.title}
              </h3>
              <div className="space-y-0.5">
                {row.previewLines.map((line, index) => (
                  <p key={index} className="font-jost font-light text-gray-600 text-sm leading-relaxed truncate">
                    {line}
                  </p>
                ))}
              </div>
            </div>
            <div className="flex-shrink-0 pt-1">
              <svg className="w-4 h-4 text-[#495D4D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Desktop View - grid with Learn More links */}
      <div className={`hidden md:grid gap-8 ${rows.length >= 3 ? 'grid-cols-3' : rows.length === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {rows.map((row) => (
          <div key={row.type} className="space-y-3">
            <div className="text-[#495D4D]">
              <i className={`fa-regular ${row.icon} text-2xl`}></i>
            </div>
            <h3 className="font-jost font-medium text-base text-[#212121]">
              {row.title}
            </h3>
            <div className="space-y-1">
              {row.previewLines.map((line, index) => (
                <p key={index} className="text-gray-600 font-jost font-light text-sm leading-relaxed">
                  {line}
                </p>
              ))}
            </div>
            <button
              onClick={() => setActiveModal(row.type)}
              className="text-[#495D4D] font-jost font-medium text-sm underline hover:text-[#3a4a3d] transition-colors"
            >
              {t('detail.learn_more', 'Learn more')}
            </button>
          </div>
        ))}
      </div>

      {/* Mobile Slide Panel */}
      <ThingsToKnowSlidePanel
        isOpen={activePanel !== null}
        onClose={() => setActivePanel(null)}
        type={activePanel || 'cancellation'}
        checkIn={checkIn}
        capacity={capacity}
        locale={locale}
        thingsToKnow={thingsToKnow}
      />

      {/* Desktop Modal */}
      <ThingsToKnowModal
        isOpen={activeModal !== null}
        onClose={() => setActiveModal(null)}
        type={activeModal || 'cancellation'}
        checkIn={checkIn}
        capacity={capacity}
        locale={locale}
        thingsToKnow={thingsToKnow}
      />
    </div>
  );
};

export default ThingsToKnow;
