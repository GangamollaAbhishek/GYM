import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function ParallaxGallery({ onClaimTrial }) {
  const containerRef = useRef(null);
  const col1Ref = useRef(null);
  const col2Ref = useRef(null);
  const col3Ref = useRef(null);
  const col4Ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(col1Ref.current, {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });

      gsap.to(col2Ref.current, {
        yPercent: -35,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });

      gsap.to(col3Ref.current, {
        yPercent: -25,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });

      gsap.to(col4Ref.current, {
        yPercent: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const col1Images = [
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80'
  ];

  const col2Images = [
    'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=600&q=80'
  ];

  const col3Images = [
    'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=600&q=80'
  ];

  const col4Images = [
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
  ];

  return (
    <section ref={containerRef} className="py-24 px-4 md:px-12 bg-[#090C0E] overflow-hidden relative">
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-mono tracking-widest text-[#00F0FF] uppercase">DIFFERENTIAL VELOCITY PARALLAX</span>
          <h2 className="text-3xl md:text-5xl font-black font-heading text-white uppercase mt-2">
            PHYSICAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E4C] to-[#00F0FF]">DOMINANCE</span>
          </h2>
        </div>

        {/* 4 Parallax Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          
          {/* Column 1 */}
          <div ref={col1Ref} className="flex flex-col gap-6">
            {col1Images.map((src, i) => (
              <div key={i} className="relative h-80 rounded-3xl overflow-hidden bg-[#12161A] border border-white/10 group">
                <img src={src} alt="Parallax 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-lg font-bold font-heading text-white">PURE FORCE</div>
              </div>
            ))}
          </div>

          {/* Column 2 */}
          <div ref={col2Ref} className="flex flex-col gap-6">
            {col2Images.map((src, i) => (
              <div key={i} className="relative h-[360px] rounded-3xl overflow-hidden bg-[#12161A] border border-white/10 group">
                <img src={src} alt="Parallax 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-lg font-bold font-heading text-[#FF2E4C]">TITAN WILL</div>
              </div>
            ))}
          </div>

          {/* Column 3 */}
          <div ref={col3Ref} className="flex flex-col gap-6">
            {col3Images.map((src, i) => (
              <div key={i} className="relative h-80 rounded-3xl overflow-hidden bg-[#12161A] border border-white/10 group">
                <img src={src} alt="Parallax 3" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-lg font-bold font-heading text-[#00F0FF]">NEVER RETREAT</div>
              </div>
            ))}
          </div>

          {/* Column 4 */}
          <div ref={col4Ref} className="flex flex-col gap-6">
            {col4Images.map((src, i) => (
              <div key={i} className="relative h-[380px] rounded-3xl overflow-hidden bg-[#12161A] border border-white/10 group">
                <img src={src} alt="Parallax 4" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-lg font-bold font-heading text-[#FF2E4C]">RAW KINETICS</div>
              </div>
            ))}
          </div>

        </div>

        {/* Section Conclusion Callout Box */}
        <div className="bg-[#12161A] rounded-3xl p-8 md:p-12 border border-[#FF2E4C]/50 shadow-[0_0_40px_rgba(255,46,76,0.25)] flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
            <span className="text-xs font-mono text-[#00F0FF] uppercase tracking-widest block mb-2">LIMITED PASS AVAILABILITY</span>
            <h3 className="text-3xl md:text-4xl font-extrabold font-heading text-white">
              Claim your 7-day free trial right away
            </h3>
            <p className="text-xs text-[#8A94A0] mt-2 max-w-lg">
              Get full access to all signature workout zones, 3D equipment setups, and biometric scanner doors.
            </p>
          </div>

          <button 
            onClick={onClaimTrial}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-[#FF2E4C] to-[#FF526B] hover:brightness-110 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_25px_rgba(255,46,76,0.4)] transition-all shrink-0"
          >
            <Shield size={16} /> Get Started <ChevronRight size={16} />
          </button>
        </div>

      </div>

    </section>
  );
}
