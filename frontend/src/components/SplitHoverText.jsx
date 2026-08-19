import React from 'react';
import { cn } from '../lib/utils';

export default function SplitHoverText({
  mainText = "EVERY DAY",
  subText = "BELIEVE IN YOURSELF",
  className = "",
}) {
  return (
    <div className={cn("group relative inline-block max-w-max self-start cursor-pointer select-none overflow-visible", className)}>
      {/* Invisible baseline spacer text to reserve container width and height */}
      <span className="opacity-0 pointer-events-none block whitespace-nowrap">{mainText}</span>

      {/* 1. TOP HALF SPLIT */}
      <span 
        className="absolute inset-0 block whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-[#E50914] via-[#FF2B35] to-[#E50914] drop-shadow-[0_0_35px_rgba(229,9,20,0.45)] transition-transform duration-500 ease-out group-hover:-translate-y-4"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)',
        }}
      >
        {mainText}
      </span>

      {/* 2. BOTTOM HALF SPLIT */}
      <span 
        className="absolute inset-0 block whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-[#E50914] via-[#FF2B35] to-[#E50914] drop-shadow-[0_0_35px_rgba(229,9,20,0.45)] transition-transform duration-500 ease-out group-hover:translate-y-4"
        style={{
          clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)',
        }}
      >
        {mainText}
      </span>

      {/* 3. MIDDLE REVEAL BANNER (BELIEVE IN YOURSELF - WHITE BANNER WITH BLACK TEXT) */}
      <span 
        className="absolute top-1/2 left-0 right-0 w-full -translate-y-1/2 scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-out bg-white text-black text-[0.22em] font-black tracking-[0.35em] uppercase text-center py-1 sm:py-1.5 shadow-[0_0_25px_rgba(255,255,255,0.7)] border-y border-black/20 rounded-sm z-20 pointer-events-none flex items-center justify-center overflow-hidden"
      >
        {subText}
      </span>
    </div>
  );
}
