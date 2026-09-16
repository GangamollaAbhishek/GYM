import React from "react";
import { Users, Clock, ShieldCheck, HeartPulse, LineChart, Smartphone } from "lucide-react";

const WHY_CARDS = [
  {
    icon: Users,
    title: "TRAINER LED",
    description: "Learn from experienced trainers, former varsity athletes, and certified sports masters who program every rep and rally.",
    color: "#FF2E4C",
  },
  {
    icon: Clock,
    title: "FLEXIBLE",
    description: "Choose activities that fit your schedule. From dawn 6:00 AM lifting to 9:00 PM basketball pickup sessions 7 days a week.",
    color: "#00F0FF",
  },
  {
    icon: ShieldCheck,
    title: "FITNESS + SPORTS",
    description: "Everything in one unified ecosystem. Never buy a separate gym membership and sports court package again.",
    color: "#A855F7",
  },
  {
    icon: HeartPulse,
    title: "COMMUNITY",
    description: "Train and play with others. High-energy group classes, weekend recreational tournaments, and an uplifting locker-room culture.",
    color: "#F59E0B",
  },
  {
    icon: LineChart,
    title: "TRACK YOUR PROGRESS",
    description: "Keep your fitness journey organized. Seamless digital check-ins, class logs, and trainer feedback via your member dashboard.",
    color: "#10B981",
  },
  {
    icon: Smartphone,
    title: "EASY BOOKING",
    description: "Find and book sessions in under a minute. Real-time slot availability, instant confirmation, and reminder notifications.",
    color: "#FF2E4C",
  },
];

export default function PamsWhySection() {
  return (
    <section id="why-pams" className="py-24 bg-[#090C0E] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#00F0FF] mb-3 inline-block">
            The PAMS Difference
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight uppercase">
            WHY PAMS FITNESS & SPORTS?
          </h2>
          <p className="mt-4 text-neutral-400 text-base sm:text-lg">
            We built PAMS because fitness isn't just about barbells, and sport isn't just
            about weekends. It's a daily lifestyle of movement, energy, and community.
          </p>
        </div>

        {/* 6-Card Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_CARDS.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="group rounded-3xl p-8 bg-[#0C1015] border border-white/[0.08] hover:border-white/20 transition-all duration-500 hover:-translate-y-1.5 shadow-[0_15px_40px_rgba(0,0,0,0.5)] flex flex-col justify-between"
              >
                <div>
                  <div
                    className="w-13 h-13 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md"
                    style={{
                      backgroundColor: `${card.color}15`,
                      color: card.color,
                      border: `1px solid ${card.color}35`,
                    }}
                  >
                    <Icon size={24} />
                  </div>

                  <h3 className="font-heading font-black text-xl text-white tracking-tight uppercase mb-3">
                    {card.title}
                  </h3>

                  <p className="text-sm text-neutral-300 leading-relaxed font-normal">
                    {card.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-neutral-400">
                  <span>Standard 0{idx + 1}</span>
                  <span className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: card.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
