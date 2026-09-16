import React from "react";
import { Award, Star, ArrowRight, ShieldCheck } from "lucide-react";

const COACHES = [
  {
    id: "coach-1",
    name: "Marcus Vance",
    role: "Head of Strength & Hypertrophy",
    discipline: "Gym",
    experience: "12+ Yrs Exp",
    specialization: "Olympic Lifting, Functional Bodybuilding & Injury Prevention",
    image: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=800&auto=format&fit=crop",
    color: "#FF2E4C",
    rating: "4.98",
  },
  {
    id: "coach-2",
    name: "Elena Rostova",
    role: "Senior Yoga Master & Mobility Lead",
    discipline: "Yoga",
    experience: "9+ Yrs Exp",
    specialization: "Vinyasa Flow, Spine Health & Somatic Breathwork",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop",
    color: "#00F0FF",
    rating: "4.96",
  },
  {
    id: "coach-3",
    name: "Sofia Mendez",
    role: "Head of Dance Cardio & Rhythm",
    discipline: "Zumba",
    experience: "8+ Yrs Exp",
    specialization: "High-Calorie Choreography & Aerobic Endurance",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
    color: "#A855F7",
    rating: "4.99",
  },
  {
    id: "coach-4",
    name: "Coach Darryl Evans",
    role: "Basketball Director & Skills Mentor",
    discipline: "Basketball",
    experience: "14+ Yrs Exp",
    specialization: "Shot Mechanics, Guard Play, & Transition Offense",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
    color: "#F59E0B",
    rating: "4.95",
  },
  {
    id: "coach-5",
    name: "Chen Wei",
    role: "Badminton High-Performance Coach",
    discipline: "Badminton",
    experience: "10+ Yrs Exp",
    specialization: "Footwork Dynamics, Smash Angles & Tactical Rallies",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
    color: "#10B981",
    rating: "4.97",
  },
  {
    id: "coach-6",
    name: "Maya Lin",
    role: "Aquatics Director & Stroke Specialist",
    discipline: "Swimming",
    experience: "11+ Yrs Exp",
    specialization: "Underwater Hydrodynamics, VO2 Max & Triathlete Prep",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
    color: "#00F0FF",
    rating: "4.98",
  },
];

export default function PamsCoachesSection({ onBookCoach }) {
  const handleSelectCoach = (coach) => {
    if (onBookCoach) {
      onBookCoach(coach);
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
    <section id="coaches-section" className="py-24 bg-[#090C0E] relative overflow-hidden border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#FF2E4C] mb-3 inline-block">
            Faculty of Champions
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight uppercase">
            TRAIN WITH PEOPLE WHO MOVE YOU
          </h2>
          <p className="mt-4 text-neutral-400 text-base sm:text-lg">
            Every coach at PAMS is an active practitioner, internationally certified, and
            dedicated to unlocking your next tier of athletic mastery.
          </p>
        </div>

        {/* Coaches Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {COACHES.map((coach) => (
            <div
              key={coach.id}
              className="group rounded-3xl bg-[#0C1015] border border-white/[0.08] hover:border-white/20 overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-2 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
            >
              {/* Photo Area */}
              <div className="relative h-72 overflow-hidden bg-neutral-950">
                <img
                  src={coach.image}
                  alt={coach.name}
                  className="w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700 opacity-85 group-hover:opacity-100"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C1015] via-transparent to-black/30" />

                <div className="absolute top-4 left-4">
                  <span
                    className="px-3.5 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider text-white shadow-md backdrop-blur-md"
                    style={{ backgroundColor: `${coach.color}CC` }}
                  >
                    {coach.discipline}
                  </span>
                </div>

                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-xs font-bold text-amber-400">
                  <Star size={12} fill="#F59E0B" />
                  <span>{coach.rating}</span>
                </div>

                <div className="absolute bottom-3 left-4 right-4">
                  <span className="px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[11px] font-semibold text-neutral-300 border border-white/10">
                    {coach.experience}
                  </span>
                </div>
              </div>

              {/* Information */}
              <div className="p-7 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-black text-2xl text-white tracking-tight group-hover:text-[#FF2E4C] transition-colors">
                    {coach.name}
                  </h3>
                  <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 mt-1 font-mono">
                    {coach.role}
                  </div>

                  <p className="text-xs text-neutral-300 mt-3 line-clamp-2 leading-relaxed font-normal">
                    {coach.specialization}
                  </p>
                </div>

                <button
                  onClick={() => handleSelectCoach(coach)}
                  className="w-full mt-6 py-3.5 px-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.12] text-white border border-white/10 hover:border-white/30 text-xs font-heading font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
                >
                  <span>Schedule 1-on-1 With {coach.name.split(" ")[0]}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
