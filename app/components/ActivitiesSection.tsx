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
    <section className="py-6 md:py-5 px-4 md:px-20 bg-white md:mt-12">
      <div className="container mx-auto">
        <div className="max-w-[1390px] mx-auto">
          <h2 className="font-logga text-[28px] md:text-[42px] font-semibold text-center mb-8 md:mb-16">ACTIVITIES IN THE REGION</h2>
        <div className="flex flex-col md:flex-row gap-[18px] md:gap-3 justify-between">
          {activities.map((activity, index) => (
            <ActivityCard key={index} {...activity} />
          ))}
        </div>
        <div className="text-center mt-6 md:mt-10 mb-6 md:mb-8">
          <button className="py-3 px-6 bg-[#495D4D] text-white text-base md:text-lg font-heading font-medium tracking-widest hover:bg-[#2d4a2d] transition-colors">
            DISCOVER ALL ACTIVITIES
          </button>
        </div>
        </div>
      </div>
    </section>
  );
};

export default ActivitiesSection;
