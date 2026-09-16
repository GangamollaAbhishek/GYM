import React from "react";
import { ArrowRight, Flame, Trophy, Sparkles } from "lucide-react";

export default function PamsFinalCTA({ onGetStarted, onExploreSports }) {
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
    <section className="py-24 sm:py-32 bg-[#07090C] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[2.5rem] p-10 sm:p-16 lg:p-20 bg-gradient-to-br from-[#11161D] via-[#0C1015] to-[#07090C] border border-white/[0.09] overflow-hidden text-center shadow-[0_30px_90px_rgba(0,0,0,0.8)]">
          {/* Ambient Multi-point Glows */}
          <div className="absolute -top-24 left-1/4 w-[500px] h-[500px] rounded-full bg-[#FF2E4C]/15 blur-[160px] pointer-events-none" />
          <div className="absolute -bottom-24 right-1/4 w-[500px] h-[500px] rounded-full bg-[#00F0FF]/15 blur-[160px] pointer-events-none" />

          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] text-xs font-bold uppercase tracking-widest text-[#FF2E4C] mb-8 backdrop-blur-md">
            <Sparkles size={14} />
            <span>START YOUR LEGACY</span>
          </div>

          {/* Heading */}
          <h2 className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight uppercase max-w-4xl mx-auto leading-[1.05] mb-6">
            YOUR HIGHEST PERFORMANCE <span className="text-gradient-gold">STARTS AT PAMS.</span>
          </h2>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-neutral-300 font-light mb-10 leading-relaxed">
            Step onto the training floor. Dive into the pool. Take the game-winning shot on the court.
            Join thousands of active movers elevating their daily discipline.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <button
              onClick={() => {
                if (onGetStarted) onGetStarted();
                else scrollTo("memberships-section");
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#FF2E4C] to-[#E0002A] text-white font-heading font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_0_30px_rgba(255,46,76,0.45)] hover:shadow-[0_0_40px_rgba(255,46,76,0.7)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Flame size={17} />
              <span>Get Your Pass</span>
              <ArrowRight size={15} />
            </button>

            <button
              onClick={() => {
                if (onExploreSports) onExploreSports();
                else scrollTo("book-session-section");
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/10 font-heading font-bold text-xs tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Trophy size={17} className="text-[#00F0FF]" />
              <span>Book a Session</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
