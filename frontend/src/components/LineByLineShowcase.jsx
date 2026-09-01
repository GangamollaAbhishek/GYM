import React from "react";
import LineByLineSlide from "./LineByLineSlide";
import { Sparkles, Shield, Cpu, Activity, ArrowUpRight } from "lucide-react";

export default function LineByLineShowcase() {
  return (
    <section className="py-24 sm:py-32 bg-[#08090D] border-b border-white/10 relative overflow-hidden">
      {/* Subtle Background Lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_center,_rgba(229,9,20,0.16)_0%,_transparent_65%)] blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center space-y-12">
        
        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#12141C] border border-white/10 text-slate-300 text-xs font-mono font-semibold tracking-widest uppercase shadow-sm">
          <Sparkles size={14} className="text-[#FF2B35]" />
          <span>ARCHITECTURAL FITNESS DESIGN</span>
        </div>

        {/* 1. Large Apple-Style Line-By-Line Headline */}
        <LineByLineSlide
          className="font-bebas text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white tracking-wide uppercase leading-[0.92] text-center"
          lineClassName="text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400"
          delay={100}
          staggerDelay={180}
        >
          {"BEAUTIFUL BY DESIGN.\nPOWERFUL BY NATURE."}
        </LineByLineSlide>

        {/* 2. Subtitle Lines */}
        <LineByLineSlide
          className="text-base sm:text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-normal leading-relaxed text-center"
          delay={400}
          staggerDelay={160}
          lines={[
            "Where elite biomechanical engineering meets minimalist aesthetic refinement.",
            "Designed for humans who refuse to accept physiological boundaries."
          ]}
        />

        {/* 3. Three Minimalist Feature Tiles with Staggered Reveal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-6 text-left">
          
          <div className="p-6 sm:p-8 rounded-3xl bg-[#11131A]/80 border border-white/10 backdrop-blur-xl hover:border-[#E50914]/40 transition-all group space-y-4 shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-[#1A1D27] border border-white/10 flex items-center justify-center text-[#FF2B35] group-hover:scale-110 transition-transform">
              <Cpu size={22} />
            </div>
            <LineByLineSlide
              className="font-bebas text-2xl sm:text-3xl text-white tracking-wide"
              delay={200}
              lines={["PRECISION SENSOR TELEMETRY"]}
            />
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
              Real-time velocity tracking and force curve sensors embedded across all kinetic rack stations.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-[#11131A]/80 border border-white/10 backdrop-blur-xl hover:border-[#E50914]/40 transition-all group space-y-4 shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-[#1A1D27] border border-white/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Activity size={22} />
            </div>
            <LineByLineSlide
              className="font-bebas text-2xl sm:text-3xl text-white tracking-wide"
              delay={350}
              lines={["BIOMETRIC GATE SPEEDPASS"]}
            />
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
              13.56 MHz high-frequency turnstile RFID key providing seamless instant access with live attendance telemetry.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-[#11131A]/80 border border-white/10 backdrop-blur-xl hover:border-[#E50914]/40 transition-all group space-y-4 shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-[#1A1D27] border border-white/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Shield size={22} />
            </div>
            <LineByLineSlide
              className="font-bebas text-2xl sm:text-3xl text-white tracking-wide"
              delay={500}
              lines={["CRYO LONGEVITY SUITE"]}
            />
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
              Sub-zero full-body cryotherapy and hydro-sauna pods engineered to accelerate cellular ATP recovery by 300%.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
