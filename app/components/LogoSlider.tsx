"use client";

export default function LogoSlider() {
  const logos = [
    "/logos/move.png",
    "/logos/wallonie.png",
    "/logos/GE.png",
    "/logos/ostbelgien.png",
    "/logos/neau.png",
    "/logos/Casapilot.png",
  ];

  return (
    <div className="w-full overflow-hidden bg-white py-4 -mt-20 shadow-md relative z-10">
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
          animation: scroll 4s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }

        @media (min-width: 768px) {
          .animate-scroll {
            animation: scroll 10s linear infinite;
          }
        }
      `}</style>

      <div className="flex animate-scroll">
        {/* First set of logos */}
        {logos.map((logo, index) => (
          <div
            key={`logo-1-${index}`}
            className="flex-shrink-0 mx-8 flex items-center justify-center"
          >
            <img
              src={logo}
              alt={`Partner logo ${index + 1}`}
              className="h-20 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
            />
          </div>
        ))}
        {/* Duplicate set for seamless loop */}
        {logos.map((logo, index) => (
          <div
            key={`logo-2-${index}`}
            className="flex-shrink-0 mx-8 flex items-center justify-center"
          >
            <img
              src={logo}
              alt={`Partner logo ${index + 1}`}
              className="h-16 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
