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
    <section className="py-5 px-20 bg-tint">
      <div className="container mx-auto">
        <div className="max-w-[1390px] mx-auto">
          <h2 className="font-logga text-[40px] font-semibold text-center mb-8">OUR SERVICES</h2>
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
        <div className="text-center mt-8">
          <button className="py-3 px-6 bg-[#495D4D] text-white text-lg font-heading font-medium tracking-widest hover:bg-[#2d4a2d] transition-colors">
            DISCOVER ALL SERVICES
          </button>
        </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
