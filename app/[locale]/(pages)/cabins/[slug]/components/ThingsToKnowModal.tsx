'use client';

import { useEffect } from 'react';
import {
  type CMSThingsToKnowSection,
  isOldFormat,
  replaceTemplatePlaceholders,
} from './thingsToKnowContent';

interface ThingsToKnowModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: string; // 'cms_0' | 'cms_1' | etc.
  capacity: number;
  thingsToKnow?: CMSThingsToKnowSection[];
}

const ThingsToKnowModal = ({
  isOpen,
  onClose,
  type,
  capacity,
  thingsToKnow,
}: ThingsToKnowModalProps) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Get CMS section by index
  const getCMSSection = (): CMSThingsToKnowSection | null => {
    if (!type.startsWith('cms_') || !thingsToKnow) return null;
    const index = parseInt(type.replace('cms_', ''), 10);
    return thingsToKnow[index] || null;
  };

  const section = getCMSSection();

  if (!isOpen || !section) return null;

  const title = replaceTemplatePlaceholders(section.title || '', { capacity });

  // Render CMS section content
  const renderContent = (s: CMSThingsToKnowSection) => {
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

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[69] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div
          className="bg-white shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBEBEB]">
            <h2 className="font-logga font-semibold text-xl uppercase tracking-wide text-[#212121]">
              {title}
            </h2>
            <button onClick={onClose} className="p-2" aria-label="Close modal">
              <svg className="w-5 h-5 text-[#222222]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto flex-1 px-6 py-4">
            {renderContent(section)}
          </div>
        </div>
      </div>
    </>
  );
};

export default ThingsToKnowModal;
