import Image from 'next/image';
import Link from 'next/link';

interface ActivityCardProps {
  imageSrc: string;
  activityName: string;
  subtitle?: string;
  /** Target page for this card, e.g. an activities category set in the CMS. */
  link?: string;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ imageSrc, activityName, subtitle, link }) => {
  const cardContent = (
    <div className="relative h-[160px] md:h-[461px] w-full md:w-[410px] overflow-hidden group cursor-pointer">
      <Image src={imageSrc} alt={activityName} fill style={{ objectFit: 'cover' }} />
      <div className="absolute inset-0 flex items-end justify-center p-6 bg-gradient-to-t from-black/60 to-transparent group-hover:opacity-0 transition-opacity duration-300">
        <h3 className="text-white text-xl md:text-2xl font-logga">{activityName}</h3>
      </div>
      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-[#F49A4A] opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex flex-col items-center justify-center text-center px-6">
        <h3 className="text-[#F0E8C6] text-2xl md:text-3xl font-logga font-extrabold tracking-wider drop-shadow-lg text-center">{activityName}</h3>
        {subtitle && (
          <p className="text-[#F0E8C6] text-sm md:text-base font-jost font-light mt-2 max-w-[280px]">{subtitle}</p>
        )}
      </div>
    </div>
  );

  if (link) {
    return <Link href={link}>{cardContent}</Link>;
  }

  return cardContent;
};

export default ActivityCard;
