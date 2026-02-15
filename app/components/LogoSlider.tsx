"use client";

import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";

interface Logo {
  url: string;
  alt: string;
  displayOrder: number;
}

interface LogoSliderData {
  logos: Logo[];
  isActive: boolean;
}

export default function LogoSlider() {
  const [data, setData] = useState<LogoSliderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/logo-slider")
      .then((res) => res.json())
      .then((d: LogoSliderData) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch logo slider:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return null;
  if (!data || !data.isActive || !data.logos || data.logos.length === 0) return null;

  const logos = [...data.logos].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="w-full bg-white py-3 shadow-md relative z-10">
      <Marquee
        speed={40}
        gradient={false}
        pauseOnHover={false}
        pauseOnClick={false}
      >
        {logos.map((logo, index) => (
          <div
            key={index}
            className="flex-shrink-0 mx-6 md:mx-10 flex items-center justify-center"
          >
            <img
              src={logo.url}
              alt={logo.alt || `Partner logo ${index + 1}`}
              className="h-14 md:h-16 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
            />
          </div>
        ))}
      </Marquee>
    </div>
  );
}
