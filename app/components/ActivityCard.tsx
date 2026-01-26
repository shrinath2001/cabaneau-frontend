import Image from 'next/image';

interface ActivityCardProps {
  imageSrc: string;
  activityName: string;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ imageSrc, activityName }) => {
  return (
    <div className="relative h-[160px] md:h-[461px] w-full md:w-[410px] overflow-hidden group cursor-pointer">
      <Image src={imageSrc} alt={activityName} fill style={{ objectFit: 'cover' }} />
      <div className="absolute inset-0 flex items-end justify-center p-6 bg-gradient-to-t from-black/60 to-transparent group-hover:opacity-0 transition-opacity duration-300">
        <h3 className="text-white text-xl md:text-2xl font-logga">{activityName}</h3>
      </div>
      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-[#F49A4A] opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex items-center justify-center">
        <h3 className="text-[#F0E8C6] text-2xl md:text-3xl font-logga font-extrabold tracking-wider drop-shadow-lg text-center">{activityName}</h3>
      </div>
    </div>
  );
};

export default ActivityCard;
