import Image from 'next/image';
import React from 'react';

const HostsSection = () => {
  return (
    <section className="py-5 px-20 bg-tint ">
      <div className="container mx-auto ">
        <div className="max-w-[1278px] mx-auto">
          <h2 className="text-4xl font-normal font-custom text-left mb-8">THE HOSTS</h2>
          <div className="flex flex-col md:flex-row md:space-x-8">
            <div>
              <div className="relative w-full h-64 md:h-96 md:w-96">
                <Image
                  src="/assets/d206536ef067f64b29cad184324fe360bb763e30.jpg"
                  alt="Host"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <h3 className="text-4xl font-heading font-medium mb-4">DANIEL & YANNICK</h3>
              <p className="text-lg font-body text-gray-400">
                Loremp ipsum asdas as sds sds sdasjdasd. asdasdaasd d nasdjasd jasdd asdasda
                asdnja sd ka sdk asd mk asdAssdasdasdasd sd sd bf skdaskndakmnsdakmsd d da sdo
                kasd as doasdnoa da osdnas dtiqeote fvoqe f Loremp ipsum asdas as sds sds sdasjdasd.
                asdasdaasd d nasdjasd jasdd asdasda asdnja sd ka sdk asd mk asdAssdasdasdasd sd sd
                bf skdaskndakmnsdakmsd d da sdo kasd as doasdnoa da osdnas dtiqeote fvoqe fLoremp
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
