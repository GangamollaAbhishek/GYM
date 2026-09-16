import React from "react";
import { Dumbbell, Sparkles, Flame, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PamsFitnessCategories({ user, onBookActivity }) {
  const navigate = useNavigate();

  const handleGymClick = () => {
    // Connects directly to existing Gym implementation
    if (user) {
      const role = (user.role || "").toLowerCase().trim();
      if (role === "admin") navigate("/admin");
      else if (role === "receptionist") navigate("/receptionist");
      else if (role === "trainer") navigate("/trainer");
      else navigate("/account");
    } else {
      navigate("/account");
    }
  };

  const handleExploreActivity = (activity) => {
    if (onBookActivity) {
      onBookActivity(activity);
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
    <section id="fitness-section" className="py-24 bg-[#090C0E] relative overflow-hidden border-t border-white/[0.04]">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-0 w-96 h-96 rounded-full bg-[#FF2E4C]/10 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF2E4C]/10 border border-[#FF2E4C]/25 text-[#FF2E4C] text-xs font-bold uppercase tracking-wider mb-3">
              <Dumbbell size={13} />
              <span>Fitness Disciplines</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight uppercase">
              FIND YOUR FITNESS
            </h2>
            <p className="mt-3 text-neutral-400 text-base sm:text-lg max-w-xl">
              Choose your way to move. From iron powerlifting and functional hypertrophy
              to mindful somatic yoga and heart-thumping dance cardio.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#FF2E4C]"></span>
            <span>All Fitness Passes Include Free Assessments</span>
          </div>
        </div>

        {/* The 3 Fitness Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 1. GYM CARD (Connects to existing Gym module) */}
          <div className="group rounded-3xl bg-[#0C1015] border border-white/[0.08] hover:border-[#FF2E4C]/50 overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-2 shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:shadow-[0_25px_60px_rgba(255,46,76,0.18)]">
            {/* Visual Header / Image Container */}
            <div className="relative h-64 overflow-hidden bg-neutral-950">
              <img
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop"
                alt="PAMS Gym Strength & Conditioning"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-75 group-hover:opacity-95"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C1015] via-[#0C1015]/40 to-transparent" />
              
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white text-[11px] font-bold uppercase tracking-wider">
                  Strength Arena
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FF2E4C] text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                  Live Module
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-7 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight uppercase group-hover:text-[#FF2E4C] transition-colors">
                  GYM
                </h3>

                <div className="flex items-center gap-2 my-2.5 text-xs font-bold text-neutral-400 uppercase tracking-widest font-mono">
                  <span>Strength</span>
                  <span>•</span>
                  <span>Conditioning</span>
                  <span>•</span>
                  <span>Hypertrophy</span>
                </div>

                <p className="text-neutral-300 text-sm leading-relaxed mb-6 font-normal">
                  Elite Eleiko Olympic free weights, pneumatic selectorized machines,
                  heavy power cages, and customized strength programming guided by certified master coaches.
                </p>

                <ul className="space-y-2.5 mb-7 text-xs text-neutral-300">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={15} className="text-[#FF2E4C] shrink-0" />
                    <span>Free weight zones & calibrated dumbbells up to 60kg</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={15} className="text-[#FF2E4C] shrink-0" />
                    <span>Personalized coach workout logging & biometrics</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={15} className="text-[#FF2E4C] shrink-0" />
                    <span>Integrated member turnstile check-in & attendance</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={handleGymClick}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#FF2E4C] via-[#FF2E4C] to-[#D80027] text-white font-heading font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-[0_0_25px_rgba(255,46,76,0.3)] flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Enter Gym Portal</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* 2. YOGA CARD */}
          <div className="group rounded-3xl bg-[#0C1015] border border-white/[0.08] hover:border-[#00F0FF]/50 overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-2 shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:shadow-[0_25px_60px_rgba(0,240,255,0.18)]">
            {/* Visual Header */}
            <div className="relative h-64 overflow-hidden bg-neutral-950">
              <img
                src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=1000&auto=format&fit=crop"
                alt="PAMS Yoga Studio"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-75 group-hover:opacity-95"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C1015] via-[#0C1015]/40 to-transparent" />
              
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white text-[11px] font-bold uppercase tracking-wider">
                  Mind & Body
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-7 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight uppercase group-hover:text-[#00F0FF] transition-colors">
                  YOGA
                </h3>

                <div className="flex items-center gap-2 my-2.5 text-xs font-bold text-neutral-400 uppercase tracking-widest font-mono">
                  <span>Mobility</span>
                  <span>•</span>
                  <span>Balance</span>
                  <span>•</span>
                  <span>Mindfulness</span>
                </div>

                <p className="text-neutral-300 text-sm leading-relaxed mb-6 font-normal">
                  Immerse in sound-insulated, humidity-balanced studios offering Hatha,
                  Vinyasa Flow, Yin restorative recovery, and breathwork led by senior practitioners.
                </p>

                <ul className="space-y-2.5 mb-7 text-xs text-neutral-300">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={15} className="text-[#00F0FF] shrink-0" />
                    <span>Acoustically treated quiet mindfulness studio</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={15} className="text-[#00F0FF] shrink-0" />
                    <span>Joint mobility, spine health & restorative flows</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={15} className="text-[#00F0FF] shrink-0" />
                    <span>Foundational alignment to advanced asana masterclasses</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleExploreActivity("Yoga")}
                className="w-full py-3.5 px-4 rounded-2xl bg-white/[0.05] hover:bg-[#00F0FF]/15 text-white border border-white/10 hover:border-[#00F0FF]/40 font-heading font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 shadow-lg"
              >
                <span>Explore Yoga</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* 3. ZUMBA CARD */}
          <div className="group rounded-3xl bg-[#0C1015] border border-white/[0.08] hover:border-purple-500/50 overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-2 shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:shadow-[0_25px_60px_rgba(168,85,247,0.18)]">
            {/* Visual Header */}
            <div className="relative h-64 overflow-hidden bg-neutral-950">
              <img
                src="https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop"
                alt="PAMS Zumba Dance Cardio"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-75 group-hover:opacity-95"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C1015] via-[#0C1015]/40 to-transparent" />
              
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white text-[11px] font-bold uppercase tracking-wider">
                  Cardio Party
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-7 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight uppercase group-hover:text-purple-400 transition-colors">
                  ZUMBA
                </h3>

                <div className="flex items-center gap-2 my-2.5 text-xs font-bold text-neutral-400 uppercase tracking-widest font-mono">
                  <span>Dance</span>
                  <span>•</span>
                  <span>Cardio</span>
                  <span>•</span>
                  <span>High-Energy</span>
                </div>

                <p className="text-neutral-300 text-sm leading-relaxed mb-6 font-normal">
                  Torch up to 700 calories per session in pulse-pounding, club-grade sound
                  and dynamic rhythm lighting with world-beat Latin and electronic choreographies.
                </p>

                <ul className="space-y-2.5 mb-7 text-xs text-neutral-300">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={15} className="text-purple-400 shrink-0" />
                    <span>Concert-quality audio and immersive light setup</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={15} className="text-purple-400 shrink-0" />
                    <span>High-calorie burn with infectious group energy</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={15} className="text-purple-400 shrink-0" />
                    <span>Energizing, all-levels inclusive group atmosphere</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleExploreActivity("Zumba")}
                className="w-full py-3.5 px-4 rounded-2xl bg-white/[0.05] hover:bg-purple-500/15 text-white border border-white/10 hover:border-purple-500/40 font-heading font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 shadow-lg"
              >
                <span>Explore Zumba</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
