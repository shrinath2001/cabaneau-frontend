import Image from 'next/image';

const HostsSection = () => {
  return (
    <section className="py-5 px-20 bg-white">
      <div className="container mx-auto">
        <div className="max-w-[1390px] mx-auto">
          <h2 className="font-logga text-[40px] font-semibold text-left mb-12">THE HOSTS</h2>

          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Image Section */}
            <div className="flex-shrink-0">
              <div className="relative w-full md:w-[501px] h-[400px] md:h-[569px]">
                <Image
                  src="/assets/d206536ef067f64b29cad184324fe360bb763e30.jpg"
                  alt="Daniel & Yannick - Hosts"
                  fill
                  style={{ objectFit: 'cover' }}
                  className="object-top"
                />
              </div>
            </div>

            {/* Text Section */}
            <div className="flex-1 flex flex-col justify-start">
              <h3 className="font-jost text-[40px] font-medium mb-6 tracking-wide">
                DANIEL & YANNICK
              </h3>
              <p className="font-raleway text-[17px] font-medium leading-[32px] text-gray-600">
                Loremp ipsum asdas as sds sds sdasjdasd. asdasdaasd d nasdjasd jasdd asdasda
                asdnja sd ka sdk asd mk asdAssdasdasdasd sd sd bf skdaskndakmnsdakmsd d da sdo
                kasd as doasdnoa da osdnas dtiqeote fvoqe f Loremp ipsum asdas as sds sds sdasjdasd.
                asdasdaasd d nasdjasd jasdd asdasda asdnja sd ka sdk asd mk asdAssdasdasdasd sd sd
                bf skdaskndakmnsdakmsd d da sdo kasd as doasdnoa da osdnas dtiqeote fvoqe f Loremp
                ipsum asdas as sds sds sdasjdasd. asdasdaasd d nasdjasd jasdd asdasda
                asdnja sd ka sdk asd mk asdAssdasdasdasd sd sd bf skdaskndakmnsdakmsd d da sdo
                kasd as doasdnoa da osdnas dtiqeote fvoqe f
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HostsSection;
