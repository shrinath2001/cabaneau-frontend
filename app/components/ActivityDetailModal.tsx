'use client';

import { Activity } from '@/app/data/activities';
import { useEffect } from 'react';

interface ActivityDetailModalProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
}

const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({ activity, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !activity) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.15)' }}
      onClick={onClose}
    >
      <div
        className="bg-white w-[398px] max-h-[80vh] md:w-full md:max-w-[600px] md:max-h-[85vh] overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Close Button Container */}
        <div className="sticky top-0 z-20 flex justify-end p-3 pointer-events-none">
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition-colors pointer-events-auto"
            aria-label="Close modal"
          >
            <span className="text-gray-600 text-lg font-bold">×</span>
          </button>
        </div>

        {/* Image */}
        <div className="w-full h-[280px] relative -mt-[52px]">
          <img
            src={activity.detailImage || activity.image}
            alt={activity.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-[17px] md:p-8">
          {/* Title and Subtitle */}
          <h2 className="text-xl font-logga mb-2 uppercase tracking-wide">{activity.title}</h2>
          <p className="text-sm text-gray-600 font-jost font-light mb-6">{activity.subtitle}</p>

          {/* Info Row with Icons */}
          {(activity.duration || activity.startLocation || activity.tags) && (
            <div className="flex flex-wrap gap-[12px] md:gap-6 mb-5">
              {activity.duration && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs text-gray-700 uppercase font-medium">{activity.duration}</span>
                </div>
              )}
              {activity.startLocation && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-xs text-gray-700 uppercase font-medium">{activity.startLocation}</span>
                </div>
              )}
              {activity.tags && activity.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-xs text-gray-700 uppercase font-medium">{activity.tags[0]}</span>
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          {activity.tags && activity.tags.length > 0 && (
            <div className="flex gap-[12px] md:gap-2 mb-6">
              {activity.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium uppercase"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Description Section */}
          <div className="mb-6">
            <h3 className="text-xs font-logga uppercase text-gray-900 mb-3 tracking-wide">DESCRIPTION</h3>
            <p className="text-sm text-gray-700 font-jost font-light leading-relaxed">{activity.description}</p>
          </div>

          {/* Schedule Availability */}
          {activity.scheduleAvailability && (
            <div className="mb-6">
              <h3 className="text-xs font-logga uppercase text-gray-900 mb-3 tracking-wide">SCHEDULE AVAILABILITY</h3>
              <p className="text-sm text-gray-700 font-jost font-light">{activity.scheduleAvailability}</p>
            </div>
          )}

          {/* Contact Section */}
          <div className="mb-6">
            <h3 className="text-xs font-logga uppercase text-gray-900 mb-3 tracking-wide">CONTACT</h3>
            <div className="space-y-2 text-sm text-gray-700 font-jost font-light">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>{activity.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>{activity.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                </svg>
                <span>{activity.website}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ActivityDetailModal;
