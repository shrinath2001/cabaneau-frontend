"use client";

import Marquee from "react-fast-marquee";

interface SliderImage {
  image: string;
}

interface ImageSliderSectionProps {
  title?: string;
  topSliderImages: SliderImage[];
  bottomSliderImages: SliderImage[];
  backgroundColor?: string;
}

export default function ImageSliderSection({
  title,
  topSliderImages,
  bottomSliderImages,
  backgroundColor,
}: ImageSliderSectionProps) {
  if (topSliderImages.length === 0 && bottomSliderImages.length === 0) {
    return null;
  }

  return (
    <section
      className="py-6 md:py-5 md:mt-12 overflow-hidden"
      style={{ backgroundColor: backgroundColor || undefined }}
    >
      {title && (
        <h2 className="font-logga text-[28px] md:text-[42px] font-semibold text-center pt-6 md:pt-10 mb-10 md:mb-14">
          {title}
        </h2>
      )}

      {topSliderImages.length > 0 && (
        <div className="mb-4">
          <Marquee speed={50} direction="left" gradient={false}>
            {topSliderImages.map((item, index) => (
              <div key={index} className="mx-2">
                <img
                  src={item.image}
                  alt=""
                  className="h-[200px] md:h-[280px] w-auto object-cover"
                />
              </div>
            ))}
          </Marquee>
        </div>
      )}

      {bottomSliderImages.length > 0 && (
        <div>
          <Marquee speed={50} direction="right" gradient={false}>
            {bottomSliderImages.map((item, index) => (
              <div key={index} className="mx-2">
                <img
                  src={item.image}
                  alt=""
                  className="h-[200px] md:h-[280px] w-auto object-cover"
                />
              </div>
            ))}
          </Marquee>
        </div>
      )}
    </section>
  );
}
