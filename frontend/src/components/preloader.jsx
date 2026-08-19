import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import LightLines from './LightLines';

export default function Preloader({ onComplete }) {
  const [count, setCount] = useState(0);
  const preloaderRef = useRef(null);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 3;
      });
    }, 16);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (count === 100 && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            if (onComplete) onComplete();
          }
        });

        tl.to('.preloader-content', { opacity: 0, scale: 0.95, duration: 0.35, ease: 'power2.inOut' })
          .to(preloaderRef.current, { opacity: 0, duration: 0.45, ease: 'power2.inOut' });
      });

      return () => ctx.revert();
    }
  }, [count, onComplete]);

  return (
    <div ref={preloaderRef} className="fixed inset-0 z-[9999] bg-[#0B0B0B] flex items-center justify-center overflow-hidden pointer-events-auto">
      <LightLines
        linesOpacity={0.25}
        lightsOpacity={0.9}
        speedMultiplier={1.2}
        gradientFrom="#0B0B0B"
        gradientTo="#151515"
        lightColor="#E50914"
        lineColor="rgba(229, 9, 20, 0.35)"
      >
        <div className="preloader-content flex flex-col items-center justify-center text-center px-4">
          <div className="text-6xl sm:text-7xl md:text-9xl font-black font-bebas tracking-wider text-white drop-shadow-[0_0_35px_rgba(229,9,20,0.5)]">
            TITAN<span className="text-[#E50914]">•</span>PULSE
          </div>
          <div className="text-xs sm:text-sm uppercase tracking-[0.35em] text-[#A0A0A0] mt-1 font-mono">
            3D FITNESS SYSTEM
          </div>

          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="text-4xl sm:text-5xl font-bebas text-[#E50914] tracking-widest">
              {count}%
            </div>
            <div className="w-48 sm:w-64 h-1.5 bg-white/10 rounded-full overflow-hidden border border-white/10 shadow-[0_0_15px_rgba(229,9,20,0.3)]">
              <div 
                className="h-full bg-gradient-to-r from-[#E50914] via-[#FF2B35] to-[#E50914] transition-all duration-75"
                style={{ width: `${count}%` }}
              />
            </div>
          </div>
        </div>
      </LightLines>
    </div>
  );
}
