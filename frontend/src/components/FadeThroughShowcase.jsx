import React from "react";
import FadeThrough from "./FadeThrough";
import { Zap, Flame, Trophy, ShieldCheck, ArrowRight } from "lucide-react";

export default function FadeThroughShowcase({ onExploreClick }) {
  const mainPhrases = [
    "FORGE UNYIELDING STRENGTH.",
    "SCULPT ELITE PHYSIQUES.",
    "SHATTER EVERY CEILING.",
    "DOMINATE EVERY ARENA.",
    "IGNITE PEAK METABOLIC POWER."
  ];

  const subPhrases = [
    "Biometric 3D Telemetry & Real-Time Load Optimization.",
    "IFBB Pro Coaches & Olympic Strength Faculty.",
    "24/7 Smart Turnstiles & Cryo-Recovery Hydro Suites.",
    "Precision Macronutrient Science & High-Density Fuel."
  ];

  const handleAction = () => {
    if (onExploreClick) {
      onExploreClick();
    } else {
      const el = document.getElementById("explore-escape");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 sm:py-28 bg-[#090C0E] border-y border-white/10 relative overflow-hidden text-center">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[360px] bg-[radial-gradient(ellipse_at_center,_rgba(229,9,20,0.2)_0%,_transparent_70%)] blur-[100px] pointer-events-none" />
      <div 
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.3) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center justify-center gap-8">
        
        {/* Badge Header */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#151722] border border-[#E50914]/40 text-[#E50914] text-xs font-mono font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(229,9,20,0.3)]">
          <Zap size={14} className="fill-[#E50914] animate-pulse" />
          <span>TITAN PERFORMANCE PHILOSOPHY</span>
        </div>

        {/* Primary Large FadeThrough Headline */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-slate-400 text-xs sm:text-sm font-mono uppercase tracking-[0.25em] font-semibold">
            WE EMPOWER YOU TO
          </p>
          <h2 className="font-bebas text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wider text-white uppercase leading-none min-h-[1.2em] flex items-center justify-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#FF2B35]">
              <FadeThrough
                phrases={mainPhrases}
                interval={2800}
                className="font-bebas font-black tracking-wider"
              />
            </span>
          </h2>
        </div>

        {/* Secondary Subtitle FadeThrough */}
        <div className="max-w-2xl min-h-[48px] flex items-center justify-center">
          <FadeThrough
            phrases={subPhrases}
            interval={3500}
            className="text-sm sm:text-base md:text-lg text-slate-400 font-medium leading-relaxed"
          />
        </div>

        {/* Metric Badges & Action */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-semibold text-slate-300">
            <Flame size={15} className="text-amber-400 fill-amber-400" />
            <span>+42% Strength Surge</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-semibold text-slate-300">
            <Trophy size={15} className="text-[#FF2B35]" />
            <span>400+ Transformations</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-semibold text-slate-300">
            <ShieldCheck size={15} className="text-emerald-400" />
            <span>24/7 Smart Biometrics</span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleAction}
          className="mt-2 px-7 py-3 rounded-full bg-gradient-to-r from-[#E50914] to-[#FF2B35] hover:brightness-110 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(229,9,20,0.5)] transition-all cursor-pointer flex items-center gap-2 group"
        >
          <span>Explore Training Matrix</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>

      </div>
    </section>
  );
}
