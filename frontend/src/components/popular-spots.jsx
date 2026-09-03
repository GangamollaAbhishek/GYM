import React, { useState } from "react";
import { MapPin, Award, UserCheck, ChevronRight } from "lucide-react";

export default function PopularSpots({ onBookCoach }) {
  const [activeSpot, setActiveSpot] = useState("Downtown");

  const spots = [
    {
      id: "Downtown",
      locationName: "Downtown Metro Arena",
      address: "742 Cyber Pulse Blvd, Downtown",
      coachName: "Marcus Vance",
      role: "Head Strength & Hypertrophy Coach",
      certifications: [
        "IFBB Pro Specialist",
        "CSCS Certified",
        "Biometrics Level 3",
      ],
      nextSession: "18 mins left until Next Lift",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      bio: "Former competitive powerlifter specializing in heavy mechanical load adaptation and elite hypertrophy programming.",
    },
    {
      id: "Westside",
      locationName: "Westside Power Lab",
      address: "109 Kinetic Way, Westside",
      coachName: "Elena Rostova",
      role: "Head HIIT & Endurance Specialist",
      certifications: [
        "CrossFit Level 4 Master",
        "Olympic Weightlifting Coach",
      ],
      nextSession: "42 mins left until HIIT Blast",
      image:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
      bio: "Expert in high-intensity cardiovascular conditioning, energy systems development, and mobility protocol.",
    },
    {
      id: "Uptown",
      locationName: "Uptown Elite Studio",
      address: "450 Zenith Peak Dr, Uptown",
      coachName: "Jaxson Reed",
      role: "Barbell Kinematics Lead",
      certifications: ["USAPL Level 2", "Biomechanics Specialist"],
      nextSession: "1 hour 15 mins until Power Hour",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
      bio: "Master coach focused on barbell trajectory modeling, squat depth mechanics, and competitive lifting prep.",
    },
  ];

  const currentSpot = spots.find((s) => s.id === activeSpot);

  return (
    <section
      id="coaches-spotlight"
      className="py-24 px-4 md:px-12 bg-[#090C0E] relative"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono tracking-widest text-[#00F0FF] uppercase">
            LOCATIONS & COACHING SPOTLIGHT
          </span>
          <h2 className="text-4xl md:text-6xl font-black font-heading text-white uppercase mt-2">
            ELITE{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E4C] to-[#00F0FF]">
              COACHES & CLUBS
            </span>
          </h2>
        </div>

        {/* Dual-View Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {spots.map((spot) => (
              <div
                key={spot.id}
                onClick={() => setActiveSpot(spot.id)}
                className={`p-6 rounded-3xl cursor-pointer transition-all duration-300 border ${
                  activeSpot === spot.id
                    ? "bg-[#12161A] border-[#FF2E4C] shadow-[0_0_20px_rgba(255,46,76,0.3)]"
                    : "bg-[#12161A]/60 border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-[#00F0FF] flex items-center gap-1.5">
                    <MapPin size={14} /> {spot.id} Branch
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#090C0E] text-[#8A94A0]">
                    {spot.nextSession}
                  </span>
                </div>
                <h3 className="text-xl font-bold font-heading text-white">
                  {spot.locationName}
                </h3>
                <p className="text-xs text-[#8A94A0] mt-1">{spot.address}</p>
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-7 bg-[#12161A] rounded-3xl p-8 border border-white/10 flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/2 h-80 rounded-2xl overflow-hidden relative border border-white/10 shrink-0">
              <img
                src={currentSpot.image}
                alt={currentSpot.coachName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12161A] via-transparent to-transparent" />
            </div>

            <div className="flex-1 flex flex-col justify-between h-full">
              <div>
                <span className="text-xs font-mono text-[#FF2E4C] uppercase tracking-widest block mb-1">
                  FEATURED COACH
                </span>
                <h3 className="text-2xl font-extrabold font-heading text-white">
                  {currentSpot.coachName}
                </h3>
                <p className="text-xs text-[#00F0FF] font-semibold mt-0.5">
                  {currentSpot.role}
                </p>

                <p className="text-xs text-[#8A94A0] leading-relaxed mt-4">
                  "{currentSpot.bio}"
                </p>

                {/* Certifications Badges */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {currentSpot.certifications.map((c, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-[#090C0E] border border-white/10 text-[10px] font-mono text-[#8A94A0] flex items-center gap-1"
                    >
                      <Award size={12} className="text-[#FF2E4C]" /> {c}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onBookCoach(currentSpot.coachName)}
                className="w-full mt-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF2E4C] to-[#FF526B] hover:brightness-110 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(255,46,76,0.4)]"
              >
                <UserCheck size={16} />
                Book Private Session
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
