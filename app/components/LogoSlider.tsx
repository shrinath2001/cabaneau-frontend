"use client";

import { useEffect, useState } from "react";

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

  // Don't render while loading or if inactive/empty
  if (loading) return null;
  if (!data || !data.isActive || !data.logos || data.logos.length === 0) return null;

  // Sort by displayOrder
  const logos = [...data.logos].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="w-full overflow-hidden bg-white py-3 shadow-md relative z-10">
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          display: flex;
          width: max-content;
          animation: scroll 20s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }

        @media (max-width: 767px) {
          .animate-scroll {
            animation-duration: 12s;
          }
        }
      `}</style>

      <div className="animate-scroll">
        {/* First set of logos */}
        {logos.map((logo, index) => (
          <div
            key={`logo-1-${index}`}
            className="flex-shrink-0 mx-6 md:mx-10 flex items-center justify-center"
          >
            <img
              src={logo.url}
              alt={logo.alt || `Partner logo ${index + 1}`}
              className="h-14 md:h-16 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
            />
          </div>
        ))}
        {/* Duplicate set for seamless loop */}
        {logos.map((logo, index) => (
          <div
            key={`logo-2-${index}`}
            className="flex-shrink-0 mx-6 md:mx-10 flex items-center justify-center"
          >
            <img
              src={logo.url}
              alt={logo.alt || `Partner logo ${index + 1}`}
              className="h-14 md:h-16 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
