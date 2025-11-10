import Image from 'next/image';
import React from 'react';

interface ServiceCardProps {
  imageSrc: string;
  serviceName: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ imageSrc, serviceName }) => {
  return (
    <div className="relative h-[461px] w-full sm:w-[410px]  overflow-hidden">
      <Image src={imageSrc} alt={serviceName} layout="fill" objectFit="cover" />
      <div className="absolute inset-0 flex items-end justify-center p-6 bg-gradient-to-t from-black/60 to-transparent">
        <h3 className="text-white text-2xl font-bold">{serviceName}</h3>
      </div>
    </div>
  );
};

export default ServiceCard;
