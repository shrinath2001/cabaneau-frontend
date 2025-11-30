'use client';

const ExtraServicesSection = () => {
  const services = [
    {
      name: 'BREAKFAST',
      image: '/assets/breakfast.jpg',
    },
    {
      name: 'DINNER',
      subtitle: '3 SERVICE',
      image: '/assets/dinner.jpg',
    },
    {
      name: 'BBQ',
      subtitle: 'PACKAGE',
      image: '/assets/bbq.jpg',
    },
    {
      name: 'RACLETTE',
      subtitle: 'PACKAGE',
      image: '/assets/raclette.jpg',
    },
    {
      name: 'MASSAGE',
      image: '/assets/massage.jpg',
    },
    {
      name: 'DOGS',
      image: '/assets/dogs.jpg',
    },
    {
      name: 'BABY BED',
      image: '/assets/baby-bed.jpg',
    },
    {
      name: 'HIGH CHAIR',
      image: '/assets/high-chair.jpg',
    },
  ];

  return (
    <div className="mb-8 sm:mb-12">
      <h2 className="font-heading font-medium text-[18px] sm:text-[20px] lg:text-[24px] mb-4 sm:mb-6 uppercase tracking-wide" style={{ color: '#212121' }}>
        AVAILABLE EXTRA SERVICES
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {services.map((service, idx) => (
          <div key={idx} className="text-center">
            <div
              className="w-[70px] h-[70px] sm:w-[80px] sm:h-[80px] lg:w-[100px] lg:h-[100px] bg-gray-200 overflow-hidden mb-2 sm:mb-3 mx-auto"
              style={{
                backgroundImage: `url(${service.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Placeholder for image */}
            </div>
            <div className="font-heading font-medium text-[10px] sm:text-[12px] lg:text-[14px] uppercase" style={{ color: '#212121' }}>
              {service.name}
              {service.subtitle && (
                <>
                  <br />
                  {service.subtitle}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExtraServicesSection;
