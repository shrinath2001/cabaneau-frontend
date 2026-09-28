'use client';

import { Activity } from '@/app/types/content';
import { useTranslations } from '@/app/providers/TranslationsProvider';

interface ActivityListCardProps {
  activity: Activity;
}

const ActivityListCard: React.FC<ActivityListCardProps> = ({ activity }) => {
  const { t } = useTranslations('activities');
  const price = activity.price !== undefined && activity.price !== null && activity.price !== ''
    ? Number(activity.price)
    : null;
  const hasContactInfo = Boolean(activity.phone || activity.email || activity.website);
  const hasButtons = Boolean(activity.readMoreUrl || activity.bookNowUrl);

  return (
    <div className="bg-white border border-black">
      <div className="flex flex-col md:flex-row p-4 sm:p-6">
        {/* Image Section - 358px × 366px */}
        <div className="relative w-full md:w-[358px] h-[250px] md:h-[366px] flex-shrink-0 mb-4 md:mb-0 md:mr-4">
          <img
            src={activity.image}
            alt={activity.title}
            className="w-full h-full object-cover"
          />
          {activity.imageCredit && (
            <span className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/40 text-white text-[11px] font-jost">
              {activity.imageCredit}
            </span>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col">
          {/* Title - 22px Logga #212121 */}
          <h3 className="text-[18px] md:text-[22px] font-logga mb-2 uppercase tracking-wide" style={{ color: '#212121' }}>
            {activity.title}
          </h3>

          {/* Subtitle - 18px Jost Light #706C6C */}
          <p className="text-[14px] md:text-[18px] font-jost font-light mb-4 leading-relaxed" style={{ color: '#706C6C' }}>
            {activity.subtitle}
          </p>

          {price !== null && !Number.isNaN(price) && (
            <p className="mb-4" style={{ color: '#212121' }}>
              <span className="text-[12px] font-jost font-light uppercase mr-1" style={{ color: '#706C6C' }}>
                {t('card.from_price')}
              </span>
              <span className="text-[16px] md:text-[18px] font-jost font-medium">
                {Math.round(price)} €
              </span>
            </p>
          )}

          {/* Description - 18px Jost Light #706C6C */}
          <p className="text-[14px] md:text-[18px] font-jost font-light mb-4 leading-relaxed" style={{ color: '#706C6C' }}>
            {activity.description}
          </p>

          {/* Contact Info */}
          {hasContactInfo && (
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] md:text-[18px] font-jost font-light mb-6" style={{ color: '#706C6C' }}>
              {activity.phone && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span>{activity.phone}</span>
                </div>
              )}
              {activity.email && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span>{activity.email}</span>
                </div>
              )}
              {activity.website && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                  </svg>
                  <span>{activity.website}</span>
                </div>
              )}
            </div>
          )}

          {/* Buttons */}
          {hasButtons && (
            <div className="flex flex-col sm:flex-row gap-3">
              {activity.readMoreUrl && (
                <a
                  href={activity.readMoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-2 bg-[#939D92] text-white text-[16px] font-heading font-medium uppercase tracking-wider hover:bg-opacity-90 transition-colors text-center"
                >
                  READ MORE
                </a>
              )}
              {activity.bookNowUrl && (
                <a
                  href={activity.bookNowUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-2 bg-[#495D4D] text-white text-[16px] font-heading font-medium uppercase tracking-wider hover:bg-opacity-90 transition-colors text-center"
                >
                  BOOK NOW
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityListCard;
