import React from 'react';
import CylinderCarousel from './CylinderCarousel';
import { Flame } from 'lucide-react';

export default function CylinderSection() {
  const gymImages = [
    {
      src: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
      title: 'POWERLIFTING ARENA',
      subtitle: 'MAX MECHANICAL LOAD',
      alt: 'Powerlifting Heavy Barbell'
    },
    {
      src: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80',
      title: 'HYPERTROPHY LAB',
      subtitle: 'ISOLATION & DENSITY',
      alt: 'Dumbbell Hypertrophy Rack'
    },
    {
      src: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
      title: 'METABOLIC ENGINE',
      subtitle: 'HIIT BLAST CIRCUIT',
      alt: 'HIIT Battle Ropes'
    },
    {
      src: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=600&q=80',
      title: 'COMBAT STRIKE RING',
      subtitle: 'ROTATIONAL POWER',
      alt: 'Boxing Heavy Bag Conditioning'
    },
    {
      src: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
      title: 'ARMORY BENCH ZONE',
      subtitle: 'CHEST & TRICEPS DECK',
      alt: 'Heavy Bench Press Setup'
    },
    {
      src: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=600&q=80',
      title: 'CALISTHENICS MATRIX',
      subtitle: 'BODYWEIGHT MASTERY',
      alt: 'Pull-up Bar Station'
    },
    {
      src: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=600&q=80',
      title: 'OLYMPIC REIGN',
      subtitle: 'EXPLOSIVE KINETICS',
      alt: 'Clean & Jerk Barbell Platform'
    },
  ];

  return (
    <section className="py-20 bg-[#0B0B0B] border-y border-white/10 relative overflow-hidden">
      {/* Background Lighting Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[radial-gradient(ellipse_at_center,_rgba(229,9,20,0.22)_0%,_transparent_70%)] blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Section Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#151515] border border-[#E50914]/40 text-[#E50914] text-xs font-mono font-bold uppercase tracking-widest mb-4 shadow-[0_0_20px_rgba(229,9,20,0.3)]">
          <Flame size={14} className="animate-pulse" />
          <span>3D TITAN PULSE HIGHLIGHTS</span>
        </div>

        <h2 className="font-bebas text-5xl sm:text-6xl md:text-7xl text-white tracking-wider uppercase mb-3 drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
          EXPERIENCE THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E50914] via-[#FF2B35] to-[#E50914]">360° ATHLETIC ARENA</span>
        </h2>

        <p className="text-[#A0A0A0] text-sm sm:text-base max-w-2xl mx-auto mb-10 font-normal">
          Immerse yourself in our multi-disciplinary training zones engineered for raw strength, metabolic output, and kinetic mastery.
        </p>

        {/* 3D Cylinder Carousel Component (Slightly Larger Card Sizing) */}
        <CylinderCarousel images={gymImages} animationDuration={28} cardWidth={215} />




      </div>
    </section>
  );
}
