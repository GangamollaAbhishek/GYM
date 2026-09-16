import React from "react";
import { ArrowRight, Dumbbell, Sparkles, Flame, Activity, Trophy, Waves } from "lucide-react";

export default function PamsFitnessSportsSplit({ onSelectFitness, onSelectSports }) {
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
    <section id="split-section" className="py-20 bg-[#090C0E] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#FF2E4C] mb-3 inline-block">
            Choose Your Arena
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight uppercase">
            TWO WORLDS. ONE UNIFIED PLATFORM.
          </h2>
          <p className="mt-4 text-neutral-400 text-base sm:text-lg">
            Whether your focus is physical transformation and mind-body conditioning or
            competitive sport on the court and in the pool, PAMS provides world-class
            infrastructure for both.
          </p>
        </div>

        {/* The Dual Split Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {/* FITNESS CARD */}
          <div
            onClick={() => {
              if (onSelectFitness) onSelectFitness();
              else scrollTo("fitness-section");
            }}
            className="group relative rounded-3xl p-8 sm:p-10 bg-[#0E1217] border border-white/[0.08] hover:border-[#FF2E4C]/60 transition-all duration-500 overflow-hidden cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:shadow-[0_25px_60px_rgba(255,46,76,0.22)] flex flex-col justify-between min-h-[480px]"
          >
            {/* Background Photography with Luxury Vignette */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img
                src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop"
                alt="PAMS Fitness"
                className="w-full h-full object-cover opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-700 filter saturate-150"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E1217] via-[#0E1217]/85 to-transparent" />
              <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#FF2E4C]/15 blur-3xl group-hover:bg-[#FF2E4C]/30 transition-all duration-700" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF2E4C]/10 border border-[#FF2E4C]/30 text-[#FF2E4C] text-[11px] font-bold uppercase tracking-wider backdrop-blur-md">
                  <Flame size={14} />
                  <span>Physical & Mind Performance</span>
                </div>
                <span className="text-xs uppercase font-mono tracking-widest text-neutral-400">
                  01 / FIT
                </span>
              </div>

              <h3 className="font-heading font-black text-4xl sm:text-5xl text-white tracking-tight uppercase group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-[#FF526B] transition-all">
                FITNESS
              </h3>

              <p className="mt-3 text-neutral-300 text-sm sm:text-base leading-relaxed max-w-lg">
                Sculpt raw strength, build cardiovascular stamina, and restore vitality with
                world-class gym conditioning, restorative yoga, and high-tempo dance cardio.
              </p>

              {/* Sub-disciplines pills */}
              <div className="mt-6 flex flex-wrap gap-2.5">
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-xs font-semibold text-neutral-200 backdrop-blur-md">
                  <Dumbbell size={14} className="text-[#FF2E4C]" />
                  <span>Gym & Lifting</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-xs font-semibold text-neutral-200 backdrop-blur-md">
                  <Sparkles size={14} className="text-[#FF2E4C]" />
                  <span>Yoga & Mind</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-xs font-semibold text-neutral-200 backdrop-blur-md">
                  <Flame size={14} className="text-[#FF2E4C]" />
                  <span>Zumba Cardio</span>
                </div>
              </div>
            </div>

            {/* Bottom CTA bar */}
            <div className="relative z-10 mt-10 pt-6 border-t border-white/[0.08] flex items-center justify-between">
              <span className="text-sm font-bold uppercase tracking-wider text-white group-hover:text-[#FF2E4C] transition-colors flex items-center gap-2">
                <span>Explore Fitness Disciplines</span>
                <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
              </span>
              <div className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.1] group-hover:bg-[#FF2E4C] group-hover:border-[#FF2E4C] flex items-center justify-center text-white transition-all shadow-md">
                <ArrowRight size={16} />
              </div>
            </div>
          </div>

          {/* SPORTS CARD */}
          <div
            onClick={() => {
              if (onSelectSports) onSelectSports();
              else scrollTo("sports-section");
            }}
            className="group relative rounded-3xl p-8 sm:p-10 bg-[#0E1217] border border-white/[0.08] hover:border-[#00F0FF]/60 transition-all duration-500 overflow-hidden cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:shadow-[0_25px_60px_rgba(0,240,255,0.22)] flex flex-col justify-between min-h-[480px]"
          >
            {/* Background Photography with Luxury Vignette */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img
                src="https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1200&auto=format&fit=crop"
                alt="PAMS Sports Arena"
                className="w-full h-full object-cover opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-700 filter saturate-150"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E1217] via-[#0E1217]/85 to-transparent" />
              <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#00F0FF]/15 blur-3xl group-hover:bg-[#00F0FF]/30 transition-all duration-700" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] text-[11px] font-bold uppercase tracking-wider backdrop-blur-md">
                  <Trophy size={14} />
                  <span>Competition & Court Arenas</span>
                </div>
                <span className="text-xs uppercase font-mono tracking-widest text-neutral-400">
                  02 / SPORT
                </span>
              </div>

              <h3 className="font-heading font-black text-4xl sm:text-5xl text-white tracking-tight uppercase group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-[#00F0FF] transition-all">
                SPORTS
              </h3>

              <p className="mt-3 text-neutral-300 text-sm sm:text-base leading-relaxed max-w-lg">
                Step onto FIBA standard maple hardwood, play high-tempo badminton rallies on BWF
                synthetic turf, and train in semi-Olympic heated swimming lanes.
              </p>

              {/* Sub-disciplines pills */}
              <div className="mt-6 flex flex-wrap gap-2.5">
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-xs font-semibold text-neutral-200 backdrop-blur-md">
                  <Activity size={14} className="text-[#00F0FF]" />
                  <span>Hardwood Basketball</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-xs font-semibold text-neutral-200 backdrop-blur-md">
                  <Trophy size={14} className="text-[#00F0FF]" />
                  <span>Pro Badminton</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-xs font-semibold text-neutral-200 backdrop-blur-md">
                  <Waves size={14} className="text-[#00F0FF]" />
                  <span>Aquatic Swimming</span>
                </div>
              </div>
            </div>

            {/* Bottom CTA bar */}
            <div className="relative z-10 mt-10 pt-6 border-t border-white/[0.08] flex items-center justify-between">
              <span className="text-sm font-bold uppercase tracking-wider text-white group-hover:text-[#00F0FF] transition-colors flex items-center gap-2">
                <span>Explore Sports Arenas</span>
                <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
              </span>
              <div className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.1] group-hover:bg-[#00F0FF] group-hover:border-[#00F0FF] group-hover:text-black flex items-center justify-center text-white transition-all shadow-md">
                <ArrowRight size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
