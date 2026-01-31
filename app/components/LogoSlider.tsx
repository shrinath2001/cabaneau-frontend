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
    <div className="w-full overflow-hidden bg-white py-2 shadow-md relative z-10">
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
              src={logo}
              alt={`Partner logo ${index + 1}`}
              className="h-10 md:h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
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
              src={logo}
              alt={`Partner logo ${index + 1}`}
              className="h-10 md:h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
