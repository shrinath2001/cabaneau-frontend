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
      <div className="container mx-auto">
        <div className="max-w-[1390px] mx-auto">
          <h2 className="font-logga text-[40px] font-semibold text-center mb-8">ACTIVITIES IN THE REGION</h2>
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          {activities.map((activity, index) => (
            <ActivityCard key={index} {...activity} />
          ))}
        </div>
        <div className="text-center mt-8">
          <button className="py-3 px-6 bg-green-800 text-white  hover:bg-green-700 transition-colors">
            DISCOVER ALL ACTIVITIES
          </button>
        </div>
        </div>
      </div>
    </section>
  );
};

export default ActivitiesSection;
