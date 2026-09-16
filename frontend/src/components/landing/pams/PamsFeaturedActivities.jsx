import React, { useState } from "react";
import { Clock, MapPin, BarChart2, Flame, Sparkles, Activity, Trophy, Waves, Dumbbell, Calendar, ArrowRight } from "lucide-react";

const FEATURED_SESSIONS = [
  {
    id: "act-1",
    title: "Morning Hypertrophy & Power",
    category: "Fitness",
    subCategory: "Gym",
    icon: Dumbbell,
    color: "#FF2E4C",
    duration: "60 mins",
    level: "Intermediate",
    location: "Main Weight Floor",
    time: "07:00 AM",
    trainer: "Marcus Vance",
    spotsLeft: 4,
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "act-2",
    title: "Sunrise Vinyasa Flow",
    category: "Fitness",
    subCategory: "Yoga",
    icon: Sparkles,
    color: "#00F0FF",
    duration: "50 mins",
    level: "All Levels",
    location: "Zen Studio A",
    time: "08:15 AM",
    trainer: "Elena Rostova",
    spotsLeft: 6,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "act-3",
    title: "Zumba High-Energy Cardio",
    category: "Fitness",
    subCategory: "Zumba",
    icon: Flame,
    color: "#A855F7",
    duration: "45 mins",
    level: "All Levels",
    location: "Studio Pulsar",
    time: "06:30 PM",
    trainer: "Sofia Mendez",
    spotsLeft: 2,
    image: "https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "act-4",
    title: "Full-Court 5v5 Open League",
    category: "Sports",
    subCategory: "Basketball",
    icon: Activity,
    color: "#F59E0B",
    duration: "75 mins",
    level: "Intermediate / Advanced",
    location: "Court 1 Hardwood Arena",
    time: "06:00 PM",
    trainer: "Coach Darryl Evans",
    spotsLeft: 5,
    image: "https://images.unsplash.com/photo-1519766304817-4f37bda74a29?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "act-5",
    title: "Smash & Rally Matchplay",
    category: "Sports",
    subCategory: "Badminton",
    icon: Trophy,
    color: "#10B981",
    duration: "60 mins",
    level: "All Levels",
    location: "Badminton Hall (Courts 3-6)",
    time: "07:30 PM",
    trainer: "Chen Wei",
    spotsLeft: 3,
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "act-6",
    title: "Freestyle & Butterfly Masterclass",
    category: "Sports",
    subCategory: "Swimming",
    icon: Waves,
    color: "#00F0FF",
    duration: "50 mins",
    level: "Intermediate",
    location: "Heated Aquatic Center",
    time: "05:00 PM",
    trainer: "Maya Lin",
    spotsLeft: 4,
    image: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?q=80&w=800&auto=format&fit=crop",
  },
];

export default function PamsFeaturedActivities({ onBookSession }) {
  const [filter, setFilter] = useState("all");

  const filteredSessions = FEATURED_SESSIONS.filter((session) => {
    if (filter === "all") return true;
    if (filter === "fitness") return session.category === "Fitness";
    if (filter === "sports") return session.category === "Sports";
    return true;
  });

  const handleBook = (session) => {
    if (onBookSession) {
      onBookSession(session);
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
    <section id="featured-activities" className="py-24 sm:py-32 bg-[#07090C] relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#00F0FF]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#FF2E4C]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header with category tab toggles */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-semibold text-neutral-300 mb-4 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-ping" />
              <span className="uppercase tracking-[0.2em] text-[11px] text-[#00F0FF] font-bold">Daily Schedule & Classes</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight uppercase">
              WHAT'S HAPPENING <span className="text-gradient-silver">AT PAMS</span>
            </h2>
            <p className="mt-3 text-neutral-400 text-sm sm:text-base max-w-xl font-light">
              Reserve your spot in today's coach-led workshops, pickup matches, and athletic group classes.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="inline-flex p-1.5 rounded-full bg-[#0C1015] border border-white/[0.08] backdrop-blur-xl self-start md:self-auto">
            <button
              onClick={() => setFilter("all")}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                filter === "all"
                  ? "bg-white text-black shadow-[0_4px_16px_rgba(255,255,255,0.2)]"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              All Activities
            </button>
            <button
              onClick={() => setFilter("fitness")}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                filter === "fitness"
                  ? "bg-[#FF2E4C] text-white shadow-[0_0_18px_rgba(255,46,76,0.5)]"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Fitness (3)
            </button>
            <button
              onClick={() => setFilter("sports")}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                filter === "sports"
                  ? "bg-[#00F0FF] text-black shadow-[0_0_18px_rgba(0,240,255,0.5)]"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Sports (3)
            </button>
          </div>
        </div>

        {/* Sessions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => {
            const Icon = session.icon;
            return (
              <div
                key={session.id}
                className="group rounded-3xl bg-[#0C1015] border border-white/[0.08] hover:border-white/25 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 shadow-[0_15px_35px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.7)]"
              >
                {/* Header visual */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={session.image}
                    alt={session.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-80 group-hover:opacity-95"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0C1015] via-[#0C1015]/30 to-black/40" />

                  {/* Badges */}
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                    <span
                      className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-md"
                      style={{ backgroundColor: session.color }}
                    >
                      {session.subCategory}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-semibold text-neutral-200 border border-white/10">
                      {session.time}
                    </span>
                  </div>

                  <div className="absolute top-3.5 right-3.5">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-amber-300 border border-amber-500/20">
                      {session.spotsLeft} spots open
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-xl text-white group-hover:text-[#FF2E4C] transition-colors line-clamp-1">
                      {session.title}
                    </h3>
                    <div className="text-xs text-neutral-400 mt-1.5 font-light">
                      Coach: <span className="text-neutral-200 font-medium">{session.trainer}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 my-5 pt-4 border-t border-white/[0.06] text-center">
                      <div className="p-2.5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                        <div className="flex items-center justify-center text-neutral-400 mb-1">
                          <Clock size={13} />
                        </div>
                        <div className="text-[11px] font-semibold text-white">{session.duration}</div>
                      </div>
                      <div className="p-2.5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                        <div className="flex items-center justify-center text-neutral-400 mb-1">
                          <BarChart2 size={13} />
                        </div>
                        <div className="text-[11px] font-semibold text-white truncate">{session.level}</div>
                      </div>
                      <div className="p-2.5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                        <div className="flex items-center justify-center text-neutral-400 mb-1">
                          <MapPin size={13} />
                        </div>
                        <div className="text-[11px] font-semibold text-white truncate">{session.location.split(" ")[0]}</div>
                      </div>
                    </div>
                  </div>

                  {/* Action CTA */}
                  <button
                    onClick={() => handleBook(session)}
                    className="w-full mt-2 py-3 px-4 rounded-xl bg-white/[0.04] hover:bg-[#FF2E4C] text-neutral-200 hover:text-white border border-white/10 hover:border-[#FF2E4C] text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-[0_0_20px_rgba(255,46,76,0.35)]"
                  >
                    <span>Reserve Spot</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
