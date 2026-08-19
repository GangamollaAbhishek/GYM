import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users, Flame, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function PopularDestinations({ onReserveSpot }) {
  const targetRef = useRef(null);
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const zones = [
    {
      id: 'iron-pit',
      name: 'THE IRON PIT',
      subtitle: 'Heavy Duty Barbell & Power Racks Zone',
      capacity: '92% Capacity',
      burnedKcal: '🔥 920 kcal/hr average',
      equipment: ['Eleiko Bumper Plates', 'Custom Dumbbells up to 80kg', 'Monolift Racks'],
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80',
      color: '#FF2E4C'
    },
    {
      id: 'cardio-deck',
      name: 'CYBER CARDIO DECK',
      subtitle: 'Air Ergometer & Sprint Turf Track',
      capacity: '65% Capacity',
      burnedKcal: '🔥 850 kcal/hr average',
      equipment: ['Skillmill Treadmills', 'Concept2 Ergometers', 'Curve Sprint Turf'],
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80',
      color: '#00F0FF'
    },
    {
      id: 'recovery-lounge',
      name: 'RECOVERY LOUNGE',
      subtitle: 'Cryotherapy & Biometric Decompression',
      capacity: '40% Capacity',
      burnedKcal: '⚡ 300 kcal/hr recovery',
      equipment: ['Cryo Chambers (-110°C)', 'Infrared Saunas', 'Normatec Boots'],
      image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1000&q=80',
      color: '#FF2E4C'
    },
    {
      id: 'turf-zone',
      name: 'THE TURF ARENA',
      subtitle: 'Sled Pushes & Plyometric Conditioning',
      capacity: '78% Capacity',
      burnedKcal: '🔥 880 kcal/hr average',
      equipment: ['Weighted Sled Racks', 'Plyo Box Towers', 'Battle Rope Station'],
      image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=1000&q=80',
      color: '#00F0FF'
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const totalWidth = containerRef.current.scrollWidth - window.innerWidth + 100;

      gsap.to(containerRef.current, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: targetRef.current,
          start: 'top top',
          end: () => `+=${totalWidth}`,
          pin: true,
          scrub: 0.8,
          onUpdate: (self) => {
            setScrollProgress(self.progress);
          }
        }
      });
    }, targetRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={targetRef} id="zones" className="relative h-screen bg-[#090C0E] overflow-hidden flex flex-col justify-between py-12">
      
      {/* Header & Live Progress Indicator Bar */}
      <div className="px-6 md:px-12 flex flex-col md:flex-row md:items-center justify-between gap-4 z-10">
        <div>
          <span className="text-xs font-mono tracking-widest text-[#00F0FF] uppercase">SIGNATURE ENVIRONMENTS</span>
          <h2 className="text-3xl md:text-5xl font-black font-heading text-white uppercase tracking-tight">
            WORKOUT ZONES <span className="text-[#8A94A0]">(04 ARENAS)</span>
          </h2>
        </div>

        {/* Live Progress Bar */}
        <div className="w-full md:w-64 flex flex-col gap-2">
          <div className="flex justify-between text-xs font-mono text-[#8A94A0]">
            <span>EXPLORATION</span>
            <span>{Math.round(scrollProgress * 100)}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#12161A] rounded-full overflow-hidden border border-white/10">
            <div 
              className="h-full bg-gradient-to-r from-[#FF2E4C] via-[#00F0FF] to-[#FF2E4C] transition-all duration-75"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Horizontal Carousel Container */}
      <div ref={containerRef} className="flex gap-8 px-6 md:px-12 items-center h-[70vh] z-10">
        {zones.map((zone) => (
          <div 
            key={zone.id}
            className="relative min-w-[320px] md:min-w-[520px] h-full rounded-3xl bg-[#12161A] border border-white/10 overflow-hidden group flex flex-col justify-between p-8 hover:border-[#FF2E4C]/60 transition-all duration-500 shrink-0"
          >
            {/* Background Image Zoom */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img 
                src={zone.image} 
                alt={zone.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-35 group-hover:opacity-55" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12161A] via-[#12161A]/60 to-transparent" />
            </div>

            {/* Top Badges */}
            <div className="relative z-10 flex justify-between items-center">
              <span 
                className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase backdrop-blur-md"
                style={{ backgroundColor: `${zone.color}20`, border: `1px solid ${zone.color}50`, color: zone.color }}
              >
                {zone.capacity}
              </span>

              {/* Burned kcal rate badge */}
              <span className="px-3 py-1 rounded-full bg-[#090C0E]/90 border border-white/10 text-xs font-mono text-[#00F0FF]">
                {zone.burnedKcal}
              </span>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-extrabold font-heading text-white uppercase mb-1">
                {zone.name}
              </h3>
              <p className="text-xs text-[#8A94A0] font-mono mb-4">{zone.subtitle}</p>

              {/* Equipment Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {zone.equipment.map((eq, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-[#090C0E] border border-white/10 text-[10px] text-[#8A94A0] font-mono">
                    • {eq}
                  </span>
                ))}
              </div>

              {/* Reserve Button */}
              <button 
                onClick={() => onReserveSpot(zone.name)}
                className="w-full py-3.5 rounded-2xl bg-[#090C0E] hover:bg-[#FF2E4C] hover:text-white font-extrabold text-xs uppercase tracking-wider text-white border border-white/10 flex items-center justify-center gap-2 transition-all duration-300 group/btn"
              >
                Reserve Spot in Zone
                <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
}
