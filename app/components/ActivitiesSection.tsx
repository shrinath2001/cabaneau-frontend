import React from 'react';
import ActivityCard from './ActivityCard';

const activities = [
  {
    imageSrc: '/assets/sports & surfwave.png',
    activityName: 'SPORTS & SURFWAVE',
  },
  {
    imageSrc: '/assets/hiking.png',
    activityName: 'HIKING',
  },
  {
    imageSrc: '/assets/city trips.png',
    activityName: 'CITY TRIPS',
  },
];

const ActivitiesSection = () => {
  return (
    <section className="py-5 px-20 bg-white">
      <div className="container mx-auto ">
        <h2 className="text-4xl font-normal font-custom text-center mb-8">ACTIVITIES IN THE REGION</h2>
        <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-6 sm:space-y-0">
          {activities.map((activity, index) => (
            <ActivityCard key={index} {...activity} />
          ))}
        </div>
        <div className="text-center mt-8">
          <button className="py-3 px-6 bg-green-800 text-white rounded-md hover:bg-green-700 transition-colors">
            DISCOVER ALL ACTIVITIES
          </button>
        </div>
      </div>
    </section>
  );
};

export default ActivitiesSection;
