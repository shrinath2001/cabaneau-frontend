import ServiceCard from './ServiceCard';

const services = [
  {
    imageSrc: '/assets/breakfast.jpg',
    serviceName: 'BREAKFAST',
  },
  {
    imageSrc: '/assets/dinner.png',
    serviceName: 'DINNER',
  },
  {
    imageSrc: '/assets/massage.png',
    serviceName: 'MASSAGE',
  },
];

const ServicesSection = () => {
  return (
    <section className="py-6 md:py-5 px-4 md:px-20 bg-tint md:mt-12">
      <div className="container mx-auto">
        <div className="max-w-[1390px] mx-auto">
          <h2 className="font-logga text-[28px] md:text-[42px] font-semibold text-center mb-8 md:mb-16">OUR SERVICES</h2>
        <div className="flex flex-col md:flex-row gap-3 justify-between">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
        <div className="text-center mt-6 md:mt-10 mb-6 md:mb-8">
          <button className="py-3 px-6 bg-[#495D4D] text-white text-base md:text-lg font-heading font-medium tracking-widest hover:bg-[#2d4a2d] transition-colors">
            DISCOVER ALL SERVICES
          </button>
        </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
