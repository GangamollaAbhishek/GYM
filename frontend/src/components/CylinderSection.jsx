import React from 'react';
import CylinderDrag3D from './CylinderDrag3D';
import { Flame } from 'lucide-react';

export default function CylinderSection() {
  return (
    <section className="py-16 bg-[#0B0B0B] border-y border-white/10 relative overflow-hidden">
      {/* Background Lighting Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[radial-gradient(ellipse_at_center,_rgba(229,9,20,0.22)_0%,_transparent_70%)] blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Section Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#151515] border border-[#E50914]/40 text-[#E50914] text-xs font-mono font-bold uppercase tracking-widest mb-4 shadow-[0_0_20px_rgba(229,9,20,0.3)]">
          <Flame size={14} className="animate-pulse" />
          <span>3D TITAN DRAG-PARALLAX ARENA</span>
        </div>

        <h2 className="font-bebas text-5xl sm:text-6xl md:text-7xl text-white tracking-wider uppercase mb-3 drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
          EXPERIENCE THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E50914] via-[#FF2B35] to-[#E50914]">360° ATHLETIC ARENA</span>
        </h2>

        <p className="text-[#A0A0A0] text-sm sm:text-base max-w-2xl mx-auto mb-6 font-normal">
          Immerse yourself in our multi-disciplinary training zones engineered for raw strength, metabolic output, and kinetic mastery. Drag horizontally to spin the arena ring.
        </p>

        {/* 3D Drag Ring Parallax Cylinder Component */}
        <CylinderDrag3D />
      </div>
    </section>
  );
}
