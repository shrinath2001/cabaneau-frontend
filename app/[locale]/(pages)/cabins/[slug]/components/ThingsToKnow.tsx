'use client';

import { useTranslations } from '@/app/providers/TranslationsProvider';

interface ThingsToKnowItem {
  icon: string;
  title: string;
  content: string;
}

interface ThingsToKnowProps {
  items?: ThingsToKnowItem[];
}

const ThingsToKnow = ({ items }: ThingsToKnowProps) => {
  const { t } = useTranslations('cabin');

  // Filter out empty items
  const validItems = items?.filter(item => item.title || item.content) || [];

  if (validItems.length === 0) {
    return null;
  }

  // Split content by newlines to create list items
  const renderContent = (content: string) => {
    if (!content) return null;

    const lines = content.split('\n').filter(line => line.trim());

    if (lines.length === 1) {
      return <p className="text-gray-600 font-jost font-light text-sm leading-relaxed">{lines[0]}</p>;
    }

    return (
      <ul className="space-y-1.5">
        {lines.map((line, index) => (
          <li key={index} className="text-gray-600 font-jost font-light text-sm leading-relaxed flex items-start">
            <span className="text-[#495D4D] mr-2 mt-0.5">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="mt-8 md:mt-12">
      <h2 className="font-logga text-[16px] md:text-[20px] mb-6 uppercase tracking-wide text-gray-800 p-4 md:p-6" style={{ backgroundColor: '#F1FAF7' }}>
        {t('detail.things_to_know', 'THINGS TO KNOW')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {validItems.map((item, index) => (
          <div key={index} className="space-y-3">
            {/* Icon */}
            <div className="text-[#495D4D]">
              {item.icon ? (
                <i className={`fas ${item.icon} text-2xl`}></i>
              ) : (
                <i className="fas fa-info-circle text-2xl"></i>
              )}
            </div>

            {/* Title */}
            {item.title && (
              <h3 className="font-jost font-medium text-base text-[#212121]">
                {item.title}
              </h3>
            )}

            {/* Content */}
            {item.content && renderContent(item.content)}

            {/* Learn more link (optional, can be enabled later) */}
            {/* <button className="text-[#495D4D] font-jost font-medium text-sm underline hover:text-[#3a4a3d] transition-colors">
              {t('detail.learn_more', 'Learn more')}
            </button> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThingsToKnow;
