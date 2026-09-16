import React from "react";
import { Users, Quote, Star, Sparkles, Heart } from "lucide-react";

const STORIES = [
  {
    id: "story-1",
    author: "Rohan Verma",
    tag: "Gym + Basketball Member",
    activity: "Strength & Court Sports",
    quote: "Switching between heavy squats on Tuesday and 5v5 basketball games on Thursday in the exact same facility is unmatched. PAMS transformed my routine completely.",
    duration: "Member for 14 Months",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
    rating: 5,
  },
  {
    id: "story-2",
    author: "Ananya Iyer",
    tag: "Yoga + Swimming Member",
    activity: "Mobility & Aquatics",
    quote: "The heated pool combined with morning Vinyasa helped me heal chronic lower back stiffness. The coaches genuinely care about correct biomechanics and form.",
    duration: "Member for 8 Months",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
    rating: 5,
  },
  {
    id: "story-3",
    author: "Devraj Sengupta",
    tag: "Badminton League Player",
    activity: "Tournament Matches",
    quote: "Finding high-quality BWF synthetic courts with proper lighting in the city was always tough until PAMS opened. The weekend rallies and tournaments are electric!",
    duration: "Member for 11 Months",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    rating: 5,
  },
];

export default function PamsCommunity() {
  return (
    <section id="community-section" className="py-24 bg-[#090C0E] relative overflow-hidden border-t border-white/[0.04]">
      {/* Background Glow */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 rounded-full bg-[#FF2E4C]/5 blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#FF2E4C] mb-3 inline-block">
            Athlete Voices
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight uppercase">
            MORE THAN A WORKOUT
          </h2>
          <div className="mt-4 flex items-center justify-center gap-3 text-neutral-300 font-semibold text-sm sm:text-base">
            <span>Train Together</span>
            <span className="text-[#FF2E4C]">•</span>
            <span>Play Together</span>
            <span className="text-[#00F0FF]">•</span>
            <span>Grow Together</span>
          </div>
          <p className="mt-3 text-neutral-400 text-sm sm:text-base max-w-xl mx-auto">
            Real stories from our community of athletes, lifters, yogis, and court players
            who have made PAMS their second home.
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STORIES.map((story) => (
            <div
              key={story.id}
              className="rounded-3xl p-8 bg-[#0C1015] border border-white/[0.08] hover:border-white/20 transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              <div>
                {/* Rating & Quote Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1">
                    {[...Array(story.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="#F59E0B" className="text-amber-400" />
                    ))}
                  </div>
                  <Quote size={20} className="text-white/20" />
                </div>

                <p className="text-neutral-200 text-sm leading-relaxed mb-6 italic font-normal">
                  "{story.quote}"
                </p>
              </div>

              <div className="pt-6 border-t border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <img
                    src={story.image}
                    alt={story.author}
                    className="w-11 h-11 rounded-full object-cover border border-white/15 shrink-0 shadow-md"
                    loading="lazy"
                  />
                  <div>
                    <div className="text-sm font-bold text-white">{story.author}</div>
                    <div className="text-xs text-[#00F0FF] font-semibold">{story.tag}</div>
                    <div className="text-[10px] text-neutral-400 mt-0.5 font-mono">{story.duration}</div>
                  </div>
                </div>

                <div className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#FF2E4C] shrink-0">
                  <Heart size={15} fill="currentColor" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Community snapshot banner */}
        <div className="mt-14 rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-[#0C1015] via-[#101622] to-[#0C1015] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#00F0FF]/10 border border-[#00F0FF]/25 flex items-center justify-center text-[#00F0FF] shrink-0 shadow-sm">
              <Users size={22} />
            </div>
            <div>
              <div className="font-heading font-bold text-lg text-white">
                Join our Saturday Open Community Scrimmages & Workouts
              </div>
              <div className="text-xs text-neutral-400 mt-0.5">
                Non-members welcome every first Saturday of the month with valid RSVP.
              </div>
            </div>
          </div>
          <a
            href="#book-session-section"
            className="px-7 py-3.5 rounded-full bg-white/[0.06] hover:bg-white/[0.14] text-white text-xs font-heading font-bold uppercase tracking-wider border border-white/10 transition-all shrink-0 hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
          >
            RSVP for Saturday
          </a>
        </div>
      </div>
    </section>
  );
}
