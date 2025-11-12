import Image from 'next/image';
import React from 'react';

const LocationSection = () => {
  return (
    <section className="bg-white py-5 px-20">
      <div className="container mx-auto ">
        <div className="max-w-[1278px] mx-auto">
          <h2 className="text-4xl font-normal font-custom text-center mb-8">WHERE WE ARE</h2>
          <div className="relative h-[273px] w-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2519.394400349409!2d4.35169971574599!3d50.84655797953239!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3c48d1f2d1f1f%3A0x4009999999999999!2sBrussels%2C%20Belgium!5e0!3m2!1sen!2sus!4v1678912345678!5m2!1sen!2sus"
              className="w-full h-full"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
