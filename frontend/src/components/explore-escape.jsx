import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Flame, Zap, Shield, ArrowUpRight, Trophy } from 'lucide-react';

// 3D Perspective Tilt Card Component
function TiltCard({ children, className }) {
  const cardRef = useRef(null);
  const [rotation, setRotation] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const rotateY = ((x - width / 2) / (width / 2)) * 10;
    const rotateX = -((y - height / 2) / (height / 2)) * 10;
    setRotation({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ rotateX: 0, rotateY: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotation.rotateX}deg) rotateY(${rotation.rotateY}deg)`,
        transition: 'transform 0.15s ease-out'
      }}
      className={className}
    >
      {children}
    </div>
  );
}

export default function ExploreEscape() {
  const programs = [
    {
      id: 1,
      title: 'Hypertrophy & Power',
      category: 'STRENGTH',
      intensity: 'High Mechanical Load',
      intensityIcon: <Flame className="w-4 h-4 text-[#FF2E4C]" />,
      calories: '850 kcal/session',
      image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80',
      description: 'Maximum motor unit recruitment protocol designed for dense muscular adaptation.'
    },
    {
      id: 2,
      title: 'HIIT Blast Circuit',
      category: 'CARDIO',
      intensity: 'Explosive Metabolic',
      intensityIcon: <Zap className="w-4 h-4 text-[#00F0FF]" />,
      calories: '950 kcal/session',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
      description: 'High-intensity interval training driving EPOC post-exercise oxygen consumption.'
    },
    {
      id: 3,
      title: 'Athletic Performance',
      category: 'FUNCTIONAL',
      intensity: 'Kinetic Agility',
      intensityIcon: <Trophy className="w-4 h-4 text-[#FF2E4C]" />,
      calories: '720 kcal/session',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
      description: 'Force-velocity curve optimization for sprinting, plyometrics, and jump mechanics.'
    },
    {
      id: 4,
      title: 'Combat Conditioning',
      category: 'COMBAT',
      intensity: 'Strike Output',
      intensityIcon: <Shield className="w-4 h-4 text-[#00F0FF]" />,
      calories: '880 kcal/session',
      image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=600&q=80',
      description: 'Heavy bag rounds, footwork kinematics, and rotational core power drills.'
    }
  ];

  return (
    <section id="programs-section" className="py-24 px-4 md:px-12 bg-[#090C0E] relative">
      
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header with Spinning Circular Badge Widget */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-mono tracking-widest text-[#00F0FF] uppercase block mb-2">
              ENGINEERED FOR RESULTS
            </span>
            <h2 className="text-4xl md:text-6xl font-black font-heading text-white uppercase tracking-tight">
              Find your <span className="font-serif-italic text-[#FF2E4C] lowercase italic font-normal">breaking point.</span>
            </h2>
          </div>

          {/* Spinning Circular Badge Widget */}
          <div className="layer relative w-28 h-28 flex items-center justify-center shrink-0">

            <div className="absolute inset-0 animate-spin-slow">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <path
                  id="circlePath"
                  d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                  fill="none"
                />
                <text className="text-[9.5px] font-mono font-bold fill-[#8A94A0] tracking-widest uppercase">
                  <textPath href="#circlePath">
                    TITAN PULSE · NO EXCUSES · BUILD MUSCLE ·
                  </textPath>
                </text>
              </svg>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#12161A] border border-[#FF2E4C]/40 flex items-center justify-center text-[#FF2E4C]">
              <Dumbbell size={20} />
            </div>
          </div>
        </div>

        {/* Bento Grid with 3D Tilt */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((prog) => (
            <TiltCard 
              key={prog.id}
              className="bg-[#12161A] rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between group hover:border-[#FF2E4C]/60 glass-card-hover cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-60 overflow-hidden">
                <img 
                  src={prog.image} 
                  alt={prog.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12161A] via-transparent to-black/40" />
                
                {/* Intensity Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#090C0E]/90 backdrop-blur-md border border-white/10 flex items-center gap-1.5 text-[11px] font-mono font-semibold text-white">
                  {prog.intensityIcon}
                  <span>{prog.intensity}</span>
                </div>

                {/* Calorie Tag */}
                <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-[#FF2E4C]/20 border border-[#FF2E4C]/50 text-[#FF2E4C] text-xs font-mono font-bold">
                  {prog.calories}
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#00F0FF] uppercase tracking-widest block mb-1">
                    {prog.category}
                  </span>

                  <h3 className="text-xl font-bold font-heading text-white group-hover:text-[#FF2E4C] transition-colors mb-2 flex items-center justify-between">
                    <span>{prog.title}</span>
                    <div className="w-8 h-8 rounded-full bg-[#FF2E4C] text-white flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                      <ArrowUpRight size={16} />
                    </div>
                  </h3>

                  <p className="text-xs text-[#8A94A0] leading-relaxed">
                    {prog.description}
                  </p>
                </div>
              </div>

            </TiltCard>
          ))}
        </div>

      </div>
    </section>
  );
}
