import React from "react";
import { ArrowRight, Flame, Trophy, Play, Shield, Users, Zap, Calendar } from "lucide-react";

export default function PamsHero({ onExploreFitness, onExploreSports, onBookSession }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      if (window.__lenis) {
        window.__lenis.scrollTo(el, { offset: -80, duration: 1.2 });
      } else {
        const yOffset = -80;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  };

  return (
    <section className="relative min-h-[94vh] flex items-center justify-center pt-32 pb-20 overflow-hidden bg-[#07090C]">
      {/* Background Gradients & Ambient Glow Mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Dual atmospheric glows with smooth luxury diffusion */}
        <div className="absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-[#FF2E4C]/18 via-[#FF2E4C]/06 to-transparent blur-[160px] animate-pulse duration-[8000ms]" />
        <div className="absolute top-1/4 -right-32 w-[700px] h-[700px] rounded-full bg-gradient-to-bl from-[#00F0FF]/14 via-[#00F0FF]/04 to-transparent blur-[180px]" />
        <div className="absolute bottom-10 left-1/3 w-[450px] h-[450px] rounded-full bg-purple-600/08 blur-[170px]" />

        {/* Refined subtle tech grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(rgba(255,255,255,0.85) 1px, transparent 1px)`,
            backgroundSize: "36px 36px",
          }}
        />

        {/* Smooth cinematic vignettes */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#07090C]/60 via-transparent to-[#07090C]" />
        <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#07090C] via-[#07090C]/80 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center z-10">
        {/* Luxury Eyebrow Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.1] backdrop-blur-xl mb-8 shadow-[0_4px_25px_rgba(0,0,0,0.5)] hover:border-white/20 transition-all cursor-default">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF2E4C] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF2E4C]"></span>
          </span>
          <span className="text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-neutral-200">
            The Complete Fitness & Sports Ecosystem
          </span>
          <span className="text-neutral-600">•</span>
          <span className="text-[11px] sm:text-xs font-bold text-[#00F0FF] uppercase tracking-widest">
            All In One Pass
          </span>
        </div>

        {/* Grand Headline */}
        <h1 className="font-heading font-black text-5xl sm:text-7xl lg:text-8xl tracking-tight text-white uppercase max-w-5xl leading-[1.02] mb-6 drop-shadow-sm">
          <span>MOVE.</span>{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E4C] via-[#FF526B] to-[#FF8093]">
            PLAY.
          </span>{" "}
          <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#00F0FF]">
            BECOME MORE.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl text-base sm:text-lg lg:text-xl text-neutral-300 font-normal leading-relaxed mb-10 text-balance">
          India's unified athletic sanctuary. Experience championship iron conditioning,
          restorative yoga, and cardio Zumba alongside tournament-grade basketball,
          badminton, and heated aquatic arenas.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-14">
          {/* Explore Fitness */}
          <button
            onClick={() => {
              if (onExploreFitness) onExploreFitness();
              else scrollTo("fitness-section");
            }}
            className="w-full sm:w-auto group relative px-8 py-4 rounded-full bg-gradient-to-r from-[#FF2E4C] via-[#FF2E4C] to-[#D80027] text-white font-heading font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 shadow-[0_0_35px_rgba(255,46,76,0.38)] hover:shadow-[0_0_50px_rgba(255,46,76,0.6)] hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Flame size={18} className="text-white group-hover:scale-110 transition-transform" />
            <span>Explore Fitness</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Explore Sports */}
          <button
            onClick={() => {
              if (onExploreSports) onExploreSports();
              else scrollTo("sports-section");
            }}
            className="w-full sm:w-auto group px-8 py-4 rounded-full bg-[#10141A]/90 hover:bg-[#161C24] text-white border border-[#00F0FF]/35 hover:border-[#00F0FF]/80 font-heading font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 shadow-[0_0_25px_rgba(0,240,255,0.12)] hover:shadow-[0_0_35px_rgba(0,240,255,0.28)] hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Trophy size={18} className="text-[#00F0FF] group-hover:scale-110 transition-transform" />
            <span>Explore Sports</span>
            <ArrowRight size={16} className="text-[#00F0FF] group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Book a Session Quick CTA */}
          <button
            onClick={() => {
              if (onBookSession) onBookSession();
              else scrollTo("book-session-section");
            }}
            className="w-full sm:w-auto px-7 py-4 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-white border border-white/10 hover:border-white/20 font-heading font-semibold text-xs sm:text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          >
            <Calendar size={16} className="text-neutral-400" />
            <span>Book a Session</span>
          </button>
        </div>

        {/* Sleek Glass Ecosystem Metrics Dock */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-4 rounded-3xl bg-[#0F141C]/60 backdrop-blur-2xl border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full max-w-4xl text-left">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:border-white/10 transition-colors">
            <div className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
              6+
            </div>
            <div className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400 mt-1">
              Disciplines & Arenas
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:border-[#FF2E4C]/30 transition-colors">
            <div className="font-heading font-black text-2xl sm:text-3xl text-[#FF2E4C] tracking-tight">
              40+
            </div>
            <div className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400 mt-1">
              Weekly Live Sessions
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:border-[#00F0FF]/30 transition-colors">
            <div className="font-heading font-black text-2xl sm:text-3xl text-[#00F0FF] tracking-tight">
              15+
            </div>
            <div className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400 mt-1">
              Certified Master Coaches
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:border-white/10 transition-colors">
            <div className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
              100%
            </div>
            <div className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400 mt-1">
              Integrated Ecosystem
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
