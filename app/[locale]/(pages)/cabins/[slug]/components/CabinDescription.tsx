'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from '@/app/providers/TranslationsProvider';

interface CabinDescriptionProps {
  title?: string;
  description?: string;
}

const CabinDescription = ({ title, description }: CabinDescriptionProps) => {
  const { t } = useTranslations('cabin');
  const [expanded, setExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

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
      <p
        ref={textRef}
        className={`font-jost font-light leading-relaxed text-[15px] md:text-[16px] text-gray-700 ${
          expanded ? '' : 'line-clamp-4'
        }`}
      >
        {description}
      </p>
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
