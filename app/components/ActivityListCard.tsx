'use client';

import { Activity } from '@/app/data/activities';

interface ActivityListCardProps {
  activity: Activity;
  onReadMore: (activity: Activity) => void;
}

const ActivityListCard: React.FC<ActivityListCardProps> = ({ activity, onReadMore }) => {
  return (
    <div className="bg-white border border-black">
      <div className="flex flex-col md:flex-row p-4 sm:p-6">
        {/* Image Section - 358px × 366px */}
        <div className="w-full md:w-[358px] h-[250px] md:h-[366px] flex-shrink-0 mb-4 md:mb-0 md:mr-4">
          <img
            src={activity.image}
            alt={activity.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col">
          {/* Title - 22px Logga #212121 */}
          <h3 className="text-[22px] font-logga mb-2 uppercase tracking-wide" style={{ color: '#212121' }}>
            {activity.title}
          </h3>

          {/* Subtitle - 18px Jost Light #706C6C */}
          <p className="text-[18px] font-jost font-light mb-4 leading-relaxed" style={{ color: '#706C6C' }}>
            {activity.subtitle}
          </p>

          {/* Icon Buttons */}
          <div className="flex gap-4 mb-5">
            {/* Feather/Leaf Icon */}
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            {/* Anchor/Download Icon */}
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            {/* Clock Icon */}
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {/* Share/Export Icon */}
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </div>

          {/* Description - 18px Jost Light #706C6C */}
          <p className="text-[18px] font-jost font-light mb-4 leading-relaxed" style={{ color: '#706C6C' }}>
            {activity.description}
          </p>

          {/* Contact Info */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[18px] font-jost font-light mb-6" style={{ color: '#706C6C' }}>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span>{activity.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span>{activity.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
              </svg>
              <span>{activity.website}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onReadMore(activity)}
              className="px-8 py-2 bg-[#939D92] text-white text-[16px] font-heading font-medium uppercase tracking-wider hover:bg-opacity-90 transition-colors text-center"
            >
              READ MORE
            </button>
            <button className="px-8 py-2 bg-[#495D4D] text-white text-[16px] font-heading font-medium uppercase tracking-wider hover:bg-opacity-90 transition-colors text-center">
              BOOK NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityListCard;
