import React, { useMemo } from "react";
import { cn } from "../lib/utils";

export const CylinderCarousel = React.forwardRef(
  (
    {
      images = [],
      className,
      containerClassName,
      cardClassName,
      animationDuration = 28,
      cardWidth = 240,
      ...props
    },
    ref,
  ) => {
    const N = images.length || 1;

    // Calculate exact 3D translateZ radius based on card width and number of cards
    const translateZ = useMemo(() => {
      const angleRad = (Math.PI * 2) / N / 2;
      return (cardWidth * 0.5 + 8) / Math.tan(angleRad);
    }, [N, cardWidth]);

    const customStyle = {
      "--n": N,
      "--w": `${cardWidth}px`,
      "--anim-dur": `${animationDuration}s`,
    };

    return (
      <div
        ref={ref}
        className={cn(
          "w-full h-full min-h-[430px] sm:min-h-[500px] grid place-items-center overflow-hidden relative",
          className,
        )}
        style={{
          perspective: "40em",
          maskImage:
            "linear-gradient(90deg, transparent, #000 15% 85%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, #000 15% 85%, transparent)",
        }}
        {...props}
      >
        <div
          className={cn(
            "grid place-items-center [transform-style:preserve-3d]",
            containerClassName,
          )}
          style={{
            ...customStyle,
            animation: "rotateCylinder var(--anim-dur) linear infinite",
          }}
        >
          <style>
            {`
              @keyframes rotateCylinder {
                from { transform: rotateY(0deg); }
                to { transform: rotateY(360deg); }
              }
            `}
          </style>

          {images.map((img, i) => {
            const rotateY = i * (360 / N);
            return (
              <div
                key={i}
                className={cn(
                  "[grid-area:1/1] overflow-hidden rounded-2xl border border-white/15 bg-[#151515] shadow-[0_12px_32px_rgba(0,0,0,0.8)] transition-all duration-300 hover:border-[#E50914] group cursor-pointer",
                  cardClassName,
                )}
                style={{
                  width: "var(--w)",
                  aspectRatio: "7/10",
                  transform: `rotateY(${rotateY}deg) translateZ(${translateZ}px)`,
                }}
              >
                <img
                  src={img.src}
                  alt={img.alt || `Gym Highlight ${i}`}
                  className="w-full h-full object-cover filter brightness-[0.9] group-hover:brightness-[1.1] group-hover:scale-105 transition-all duration-500"
                />
                {img.title && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-4 flex flex-col justify-end">
                    <span className="font-bebas text-xl leading-tight text-white tracking-wider">
                      {img.title}
                    </span>
                    {img.subtitle && (
                      <span className="text-[10px] uppercase font-mono text-[#E50914] tracking-widest leading-tight">
                        {img.subtitle}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);

CylinderCarousel.displayName = "CylinderCarousel";
export default CylinderCarousel;
