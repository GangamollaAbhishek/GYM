import * as React from "react";
import { FluidBlobs } from "./FluidBlobs";
import { GlowEffect } from "./GlowEffect";
import { cn } from "../lib/utils";

const DEFAULT_LIGHT = ["#ff0020", "#fc0f60", "#e8227a", "#ff85b3"];
const DEFAULT_DARK = ["#8c0f60", "#e8227a", "#e8227a", "#ff85b3"];
const DEFAULT_GLOW = ["#ff96a9", "#e8b4f0", "#ffb3c6", "#d44d8a", "#ff96a9"];

export function BlobCard({
  header,
  children,
  headerHeight = 110,
  lightColors = DEFAULT_LIGHT,
  darkColors = DEFAULT_DARK,
  glowColors = DEFAULT_GLOW,
  className,
}) {
  return (
    <div className={cn("relative w-full group", className)}>
      {/* 1. Outer Glow Border Layer */}
      <div className="absolute -inset-[1.5px] rounded-[24px] overflow-hidden z-0 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
        <GlowEffect
          colors={glowColors}
          mode="rotate"
          blur="strongest"
          duration={6}
          scale={1}
        />
      </div>

      {/* 2. Inner Card Container Body */}
      <div className="relative z-10 rounded-[22px] overflow-hidden bg-[#0D0F15] border border-white/10 group-hover:border-white/20 transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col justify-between h-full">
        {/* Top Header with Fluid Blobs Backdrop */}
        <div
          className="relative overflow-hidden rounded-t-[22px]"
          style={{ height: headerHeight }}
        >
          <FluidBlobs
            lightColors={lightColors}
            darkColors={darkColors}
            origins={[
              { x: 30, y: -25 },
              { x: 75, y: -15 },
              { x: 50, y: 15 },
              { x: 20, y: 25 },
            ]}
            margin={50}
            blur={38}
          />
          {/* Subtle gradient vignette to blend header cleanly into card body */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0D0F15]/30 to-[#0D0F15] pointer-events-none" />
          
          {header && <div className="relative z-10 p-6 pb-0">{header}</div>}
        </div>

        {/* Card Content Body */}
        {children && <div className="relative z-10 p-6 pt-2">{children}</div>}
      </div>
    </div>
  );
}

export default BlobCard;
