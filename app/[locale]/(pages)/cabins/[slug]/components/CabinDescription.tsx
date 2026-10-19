'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from '@/app/providers/TranslationsProvider';
import { isRichText, stripPastedFormatting } from '@/app/lib/richText';

interface CabinDescriptionProps {
  title?: string;
  description?: string;
}

const CabinDescription = ({ title, description }: CabinDescriptionProps) => {
  const { t } = useTranslations('cabin');
  const [expanded, setExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkTruncation = () => {
      const el = textRef.current;
      if (!expanded && el) {
        setIsTruncated(el.scrollHeight > el.clientHeight + 1);
      }
    };

    checkTruncation();
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [description, expanded]);

  if (!description) return null;

  return (
    <div className="mb-6 md:mb-8">
      {title && (
        <h2 className="font-logga font-semibold text-[18px] md:text-[20px] mb-3 uppercase tracking-wide text-gray-800">
          {title}
        </h2>
      )}
      {/* Rich text (lists, bold, italic) when the CMS text has HTML; older plain texts render as before */}
      {isRichText(description) ? (
        <div
          ref={textRef}
          className={`font-jost font-light leading-relaxed text-[15px] md:text-[16px] text-gray-700 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_ul]:mb-3 [&_ol]:mb-3 [&_li]:mb-1 [&_a]:underline [&_strong]:font-medium [&_b]:font-medium ${
            expanded ? '' : 'line-clamp-4'
          }`}
          dangerouslySetInnerHTML={{ __html: stripPastedFormatting(description) }}
        />
      ) : (
        <p
          ref={textRef as React.RefObject<HTMLParagraphElement>}
          className={`font-jost font-light leading-relaxed text-[15px] md:text-[16px] text-gray-700 ${
            expanded ? '' : 'line-clamp-4'
          }`}
        >
          {description}
        </p>
      )}
      {(isTruncated || expanded) && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="font-jost font-medium text-[14px] md:text-[16px] text-[#495D4D] underline mt-2"
        >
          {expanded ? t('detail.read_less') : t('detail.read_more')}
        </button>
      )}
    </div>
  );
};

export default CabinDescription;
