import React from "react";
import { Activity, Trophy, Waves, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

export default function PamsSportsCategories({ onBookSport }) {
  const handleExploreSport = (sportName) => {
    if (onBookSport) {
      onBookSport(sportName);
    } else {
      const el = document.getElementById("book-session-section");
      if (el) {
        if (window.__lenis) {
          window.__lenis.scrollTo(el, { offset: -80, duration: 1.2 });
        } else {
          const yOffset = -80;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }
    }
  };

  return (
    <section id="sports-section" className="py-24 bg-[#090C0E] relative overflow-hidden border-t border-white/[0.04]">
      {/* Background ambient light */}
      <div className="absolute top-1/2 right-0 w-96 h-96 rounded-full bg-[#00F0FF]/10 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/25 text-[#00F0FF] text-xs font-bold uppercase tracking-wider mb-3">
              <Trophy size={13} />
              <span>Sports Arenas</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight uppercase">
              PLAY YOUR GAME
            </h2>
            <p className="mt-3 text-neutral-400 text-base sm:text-lg max-w-xl">
              Train. Compete. Enjoy. Discover state-of-the-art courts, tournament-grade
              turf, and temperature-controlled aquatic facilities built for peak athletic performance.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#00F0FF]"></span>
            <span>Court & Pool Bookings Open Daily 6:00 AM - 10:00 PM</span>
          </div>
        </div>

        {/* The 3 Sports Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 1. BASKETBALL CARD */}
          <div className="group rounded-3xl bg-[#0C1015] border border-white/[0.08] hover:border-amber-500/50 overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-2 shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:shadow-[0_25px_60px_rgba(245,158,11,0.18)]">
            {/* Visual Header */}
            <div className="relative h-64 overflow-hidden bg-neutral-950">
              <img
                src="https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1000&auto=format&fit=crop"
                alt="PAMS Basketball Arena"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-75 group-hover:opacity-95"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C1015] via-[#0C1015]/40 to-transparent" />
              
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white text-[11px] font-bold uppercase tracking-wider">
                  Hardwood Court
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-7 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight uppercase group-hover:text-amber-400 transition-colors">
                  BASKETBALL
                </h3>

                <div className="flex items-center gap-2 my-2.5 text-xs font-bold text-neutral-400 uppercase tracking-widest font-mono">
                  <span>Training</span>
                  <span>•</span>
                  <span>Pickup Games</span>
                  <span>•</span>
                  <span>Leagues</span>
                </div>

                <p className="text-neutral-300 text-sm leading-relaxed mb-6 font-normal">
                  FIBA regulation maple hardwood courts with breakaway spring rims, calibrated shot clocks,
                  open pickup runs, and tactical shooting drills led by varsity coaches.
                </p>

                <ul className="space-y-2.5 mb-7 text-xs text-neutral-300">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={15} className="text-amber-400 shrink-0" />
                    <span>Suspended shock-absorbing Canadian maple hardwood</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={15} className="text-amber-400 shrink-0" />
                    <span>Full-court pickup leagues & weekly 3v3 shootouts</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={15} className="text-amber-400 shrink-0" />
                    <span>Shooting mechanics, handles & athletic agility clinics</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleExploreSport("Basketball")}
                className="w-full py-3.5 px-4 rounded-2xl bg-white/[0.05] hover:bg-amber-500/15 text-white border border-white/10 hover:border-amber-500/40 font-heading font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 shadow-lg"
              >
                <span>Explore Basketball Arena</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* 2. BADMINTON CARD */}
          <div className="group rounded-3xl bg-[#0C1015] border border-white/[0.08] hover:border-emerald-500/50 overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-2 shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:shadow-[0_25px_60px_rgba(16,185,129,0.18)]">
            {/* Visual Header */}
            <div className="relative h-64 overflow-hidden bg-neutral-950">
              <img
                src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1000&auto=format&fit=crop"
                alt="PAMS Badminton Courts"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-75 group-hover:opacity-95"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C1015] via-[#0C1015]/40 to-transparent" />
              
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white text-[11px] font-bold uppercase tracking-wider">
                  BWF Standard
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-7 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight uppercase group-hover:text-emerald-400 transition-colors">
                  BADMINTON
                </h3>

                <div className="flex items-center gap-2 my-2.5 text-xs font-bold text-neutral-400 uppercase tracking-widest font-mono">
                  <span>Courts</span>
                  <span>•</span>
                  <span>Sessions</span>
                  <span>•</span>
                  <span>Coaching</span>
                </div>

                <p className="text-neutral-300 text-sm leading-relaxed mb-6 font-normal">
                  6 professional synthetic vinyl mats laid over cushioning wood, glare-free
                  LED illumination, shuttle dispensers, and multi-level singles/doubles matchmaking.
                </p>

                <ul className="space-y-2.5 mb-7 text-xs text-neutral-300">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                    <span>BWF-approved anti-slip synthetic tournament matting</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                    <span>Shadow-free, anti-glare overhead diffuse LED lights</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                    <span>Racket stringing station & shuttlecock pro shop</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleExploreSport("Badminton")}
                className="w-full py-3.5 px-4 rounded-2xl bg-white/[0.05] hover:bg-emerald-500/15 text-white border border-white/10 hover:border-emerald-500/40 font-heading font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 shadow-lg"
              >
                <span>Explore Badminton Courts</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* 3. SWIMMING CARD */}
          <div className="group rounded-3xl bg-[#0C1015] border border-white/[0.08] hover:border-[#00F0FF]/50 overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-2 shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:shadow-[0_25px_60px_rgba(0,240,255,0.18)]">
            {/* Visual Header */}
            <div className="relative h-64 overflow-hidden bg-neutral-950">
              <img
                src="https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=1000&auto=format&fit=crop"
                alt="PAMS Heated Swimming Pool"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-75 group-hover:opacity-95"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C1015] via-[#0C1015]/40 to-transparent" />
              
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white text-[11px] font-bold uppercase tracking-wider">
                  Heated Lanes
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-7 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight uppercase group-hover:text-[#00F0FF] transition-colors">
                  SWIMMING
                </h3>

                <div className="flex items-center gap-2 my-2.5 text-xs font-bold text-neutral-400 uppercase tracking-widest font-mono">
                  <span>Training</span>
                  <span>•</span>
                  <span>Coaching</span>
                  <span>•</span>
                  <span>Lanes</span>
                </div>

                <p className="text-neutral-300 text-sm leading-relaxed mb-6 font-normal">
                  Semi-Olympic 25m heated pool with advanced ozone filtration, anti-wave lane
                  dividers, dedicated lap swimming, and stroke correction by national-level coaches.
                </p>

                <ul className="space-y-2.5 mb-7 text-xs text-neutral-300">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={15} className="text-[#00F0FF] shrink-0" />
                    <span>Skin-friendly low-chlorine ozone purification system</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={15} className="text-[#00F0FF] shrink-0" />
                    <span>28°C constant temperature year-round comfort</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={15} className="text-[#00F0FF] shrink-0" />
                    <span>Adult learn-to-swim & elite endurance conditioning</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleExploreSport("Swimming")}
                className="w-full py-3.5 px-4 rounded-2xl bg-white/[0.05] hover:bg-[#00F0FF]/15 text-white border border-white/10 hover:border-[#00F0FF]/40 font-heading font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 shadow-lg"
              >
                <span>Explore Aquatic Pool</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
