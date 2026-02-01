"use client";

import { useEffect, useState, useRef } from "react";

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
  const trackRef = useRef<HTMLDivElement>(null);

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

  // Repeat logos enough times to guarantee seamless scrolling on any screen width.
  // Each logo is roughly ~160-200px wide (image + margins). For a 2560px ultrawide,
  // we need at least ~13 logos per "half". With 6 logos, repeating 4x = 24 per half.
  const repeatCount = Math.max(4, Math.ceil(16 / logos.length));
  const repeatedLogos: Logo[] = [];
  for (let i = 0; i < repeatCount; i++) {
    repeatedLogos.push(...logos);
  }

  return (
    <div className="w-full overflow-hidden bg-white py-3 shadow-md relative z-10">
      <style jsx>{`
        @keyframes logo-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .logo-track {
          display: flex;
          width: max-content;
          animation: logo-scroll 30s linear infinite;
        }

        .logo-track:hover {
          animation-play-state: paused;
        }

        @media (max-width: 767px) {
          .logo-track {
            animation-duration: 18s;
          }
        }
      `}</style>

      <div className="logo-track" ref={trackRef}>
        {/* First half */}
        {repeatedLogos.map((logo, index) => (
          <div
            key={`a-${index}`}
            className="flex-shrink-0 mx-6 md:mx-10 flex items-center justify-center"
          >
            <img
              src={logo.url}
              alt={logo.alt || `Partner logo`}
              className="h-14 md:h-16 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
            />
          </div>
        ))}
        {/* Second half (identical, for seamless loop) */}
        {repeatedLogos.map((logo, index) => (
          <div
            key={`b-${index}`}
            className="flex-shrink-0 mx-6 md:mx-10 flex items-center justify-center"
          >
            <img
              src={logo.url}
              alt={logo.alt || `Partner logo`}
              className="h-14 md:h-16 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
