'use client';

import { useState } from 'react';
import AmenitiesModal from './AmenitiesModal';

const AmenitiesSection = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="mb-8">
      <h2 className="font-jost font-semibold text-[16px] md:text-[20px] mb-6 uppercase tracking-wide text-gray-800 p-4 md:p-6" style={{ backgroundColor: '#F1FAF7' }}>
        WHAT THIS CABIN OFFERS
      </h2>
      <div className="grid grid-cols-2 gap-x-6 md:gap-x-16 gap-y-4">
        <div className="flex items-center gap-2 md:gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="#495D4D" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span className="font-raleway font-normal text-[15px] text-gray-800">KITCHEN</span>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="#495D4D" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
          </svg>
          <span className="font-raleway font-normal text-[15px] text-gray-800">WIFI</span>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="#495D4D" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          <span className="font-raleway font-normal text-[15px] text-gray-800">FREE PARKING ON PREMISES</span>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="#495D4D" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
          </svg>
          <span className="font-raleway font-normal text-[15px] text-gray-800">PRIVATE SAUNA</span>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="#495D4D" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="font-raleway font-normal text-[15px] text-gray-800">TV</span>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="#495D4D" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="font-raleway font-normal text-[15px] text-gray-800">WASHER</span>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="#495D4D" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <span className="font-raleway font-normal text-[15px] text-gray-800">DRYER</span>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="#495D4D" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
          <span className="font-raleway font-normal text-[15px] text-gray-800">AIR CONDITIONING</span>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="#495D4D" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="font-raleway font-normal text-[15px] text-gray-800">PRIVATE PATIO OR BALCONY</span>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="#495D4D" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="font-raleway font-normal text-[15px] text-gray-800">BACKYARD</span>
        </div>
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="mt-6 md:mt-8 px-6 py-3 text-white font-jost font-medium text-[14px] md:text-[16px] hover:opacity-90 transition uppercase"
        style={{ backgroundColor: '#939D92' }}
      >
        SHOW ALL 60 AMENITIES
      </button>

      {/* Amenities Modal */}
      <AmenitiesModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default AmenitiesSection;
