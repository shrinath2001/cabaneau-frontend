'use client';

import { useState } from 'react';
import { activities, restaurants } from '@/app/data/activities';
import ActivityListCard from '@/app/components/ActivityListCard';
import ActivityDetailModal from '@/app/components/ActivityDetailModal';
import { Activity } from '@/app/data/activities';

export default function ActivitiesPage() {
  const [activeTab, setActiveTab] = useState<'activities' | 'restaurants'>('activities');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleReadMore = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedActivity(null), 300);
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/assets/d206536ef067f64b29cad184324fe360bb763e30.jpg)',
          }}
        >
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.50)' }}></div>
        </div>
        <h1 className="relative z-10 text-white text-4xl md:text-5xl lg:text-6xl font-custom text-center px-4">
          WHAT TO DO? WHERE TO GO?
        </h1>
      </section>

      {/* Tabs Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex justify-center gap-6 sm:gap-12 overflow-x-auto">
            <button
              onClick={() => setActiveTab('activities')}
              className="py-4 px-2 text-[24px] font-medium font-heading uppercase tracking-wider transition-colors relative whitespace-nowrap"
              style={{ color: activeTab === 'activities' ? '#F49A4A' : '#495D4D' }}
            >
              ACTIVITIES
              {activeTab === 'activities' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F49A4A]"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('restaurants')}
              className="py-4 px-2 text-[24px] font-medium font-heading uppercase tracking-wider transition-colors relative whitespace-nowrap"
              style={{ color: activeTab === 'restaurants' ? '#F49A4A' : '#495D4D' }}
            >
              RESTAURANTS
              {activeTab === 'restaurants' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F49A4A]"></span>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Activities List */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="space-y-6">
            {(activeTab === 'activities' ? activities : restaurants).map((item) => (
              <ActivityListCard
                key={item.id}
                activity={item}
                onReadMore={handleReadMore}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Discover Restaurants Section */}
      <section className="relative h-[300px] md:h-[400px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/assets/breakfast.jpg)',
          }}
        >
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.50)' }}></div>
        </div>
        <h2 className="relative z-10 text-white text-3xl md:text-4xl lg:text-5xl font-custom text-center px-4">
          DISCOVER THE RESTAURANTS<br />AROUND
        </h2>
      </section>

      {/* Activity Detail Modal */}
      <ActivityDetailModal
        activity={selectedActivity}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </main>
  );
}