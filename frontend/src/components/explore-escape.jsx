import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Dumbbell, Flame, Zap, ArrowRight, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CRIMSON = "#FF2E4C";
const CYAN = "#00F0FF";

const CARDS = [
  {
    key: "hypertrophy",
    title: "Hypertrophic\nProtocols",
    text: "Maximum motor unit recruitment for dense muscular growth.",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80",
    variant: "framed",
    category: "STRENGTH ARENA",
    toast: "Hypertrophic Heavy Lifting Protocol booked! Biometric scanner ready.",
    accent: CRIMSON
  },
  {
    key: "cardio",
    title: "Cyber Cardio\nDecks",
    text: "High-intensity metabolic circuits driving EPOC oxygen surge.",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
    variant: "overlay",
    category: "METABOLIC DRIVE",
    toast: "Cyber Cardio Deck pass active! Skillmill & Concept2 reserved.",
    accent: CYAN
  },
  {
    key: "athletic",
    title: "Athletic\nKinematics",
    text: "Force-velocity curve optimization and jump mechanics.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    variant: "overlay",
    category: "PLYOMETRIC TURF",
    toast: "Athletic Performance Turf session scheduled!",
    accent: CRIMSON
  },
  {
    key: "recovery",
    title: "Sub-Zero\nRecovery Pods",
    text: "Cryotherapy and biothermal infrared decompression.",
    image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80",
    variant: "overlay",
    category: "CRYO DECOMPRESSION",
    toast: "Sub-Zero Cryo Chamber booked at -110°C!",
    accent: CYAN
  }
];

// 3D Perspective Tilt Card Wrapper Component
function TiltCard({ children, className, onClick }) {
  const cardRef = useRef(null);
  const [rotation, setRotation] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const rotateY = ((x - width / 2) / (width / 2)) * 12;
    const rotateX = -((y - height / 2) / (height / 2)) * 12;
    setRotation({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ rotateX: 0, rotateY: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform: `perspective(1000px) rotateX(${rotation.rotateX}deg) rotateY(${rotation.rotateY}deg)`,
        transition: 'transform 0.15s ease-out'
      }}
      className={className}
    >
      {children}
    </div>
  );
}

function ArrowCircle({ tone = "crimson" }) {
  const color = tone === "crimson" ? CRIMSON : "#FFFFFF";
  return (
    <span
      className="flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 hover:scale-110 shadow-lg"
      style={{ borderColor: color, color, backgroundColor: tone === "crimson" ? `${CRIMSON}15` : 'rgba(0,0,0,0.4)' }}
    >
      <ArrowRight size={16} />
    </span>
  );
}

export default function ExploreEscape({ onReserveSpot }) {
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 50, scale: 0.94 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: i * 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  const handleCardClick = (card) => {
    if (onReserveSpot) {
      onReserveSpot(card.toast);
    }
  };

  return (
    <section id="explore-escape" className="relative z-10 overflow-hidden bg-[#090C0E] px-4 py-16 md:px-12 md:py-24 border-t border-white/10">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#FF2E4C]/5 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-10">
        
        {/* Section Header */}
        <div className="mb-12 flex items-start justify-between md:mb-16">
          <div>
            <p className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-[#00F0FF] flex items-center gap-2">
              <Sparkles size={14} className="text-[#FF2E4C]" /> EXPLORE THE UNSEEN
            </p>
            <h2 className="mt-3 text-4xl font-black font-heading leading-[1.1] text-white uppercase md:text-6xl tracking-tight">
              Find your <br className="hidden md:block" />
              next <em className="italic font-normal lowercase text-[#FF2E4C] font-serif">breaking point.</em>
            </h2>
          </div>

          {/* Spinning Circular Badge Widget */}
          <div className="relative hidden h-28 w-28 shrink-0 items-center justify-center md:flex">
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 h-full w-full animate-[spin_18s_linear_infinite]"
            >
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="#FF2E4C"
                strokeOpacity="0.3"
                strokeWidth="1"
              />
              <defs>
                <path
                  id="circlePath"
                  d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
                />
              </defs>
              <text fontSize="7" fill="#8A94A0" letterSpacing="2" className="font-mono font-bold uppercase">
                <textPath href="#circlePath">TITAN PULSE · NO EXCUSES · BUILD MUSCLE ·</textPath>
              </text>
            </svg>
            <div className="w-12 h-12 rounded-full bg-[#12161A] border border-[#FF2E4C]/60 flex items-center justify-center text-[#FF2E4C] shadow-[0_0_15px_rgba(255,46,76,0.5)]">
              <Dumbbell size={20} />
            </div>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 gap-5 md:h-[480px] md:grid-cols-3 md:grid-rows-2">
          {CARDS.map((card, cardIndex) => {
            if (card.variant === "framed") {
              return (
                <div
                  key={card.key}
                  ref={(el) => {
                    cardsRef.current[cardIndex] = el;
                  }}
                  className="flex flex-col md:col-start-1 md:row-span-2 justify-between"
                >
                  <div className="pb-3 pr-4 md:pb-4">
                    <span className="text-[10px] font-mono text-[#00F0FF] uppercase tracking-widest block mb-1">
                      {card.category}
                    </span>
                    <h3 className="whitespace-pre-line text-2xl font-extrabold font-heading leading-[1.15] text-white md:text-3xl">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-xs text-[#8A94A0] font-mono leading-relaxed max-w-[240px]">
                      {card.text}
                    </p>
                  </div>

                  <div className="relative z-10 my-2">
                    <button
                      onClick={() => handleCardClick(card)}
                      aria-label={`Explore ${card.title}`}
                      className="cursor-pointer"
                    >
                      <ArrowCircle tone="crimson" />
                    </button>
                  </div>

                  <TiltCard 
                    onClick={() => handleCardClick(card)}
                    className="group relative mt-2 aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 md:aspect-auto md:flex-1 cursor-pointer bg-[#12161A]"
                  >
                    <img
                      src={card.image}
                      alt={card.title.replace("\n", " ")}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-85"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#12161A] via-transparent to-black/30" />
                  </TiltCard>
                </div>
              );
            }

            const spanClass =
              card.key === "cardio"
                ? "md:col-start-2 md:row-span-2"
                : card.key === "athletic"
                ? "md:col-start-3 md:row-start-1"
                : "md:col-start-3 md:row-start-2";

            return (
              <div
                key={card.key}
                ref={(el) => {
                  cardsRef.current[cardIndex] = el;
                }}
                className={`relative aspect-[4/3] md:aspect-auto md:h-full ${spanClass}`}
              >
                <TiltCard
                  className="group relative h-full w-full overflow-hidden rounded-3xl border border-white/10 bg-[#12161A] cursor-pointer"
                  onClick={() => handleCardClick(card)}
                >
                  <img
                    src={card.image}
                    alt={card.title.replace("\n", " ")}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-transparent" />
                  
                  <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-6">
                    <div>
                      <span className="text-[10px] font-mono text-[#00F0FF] uppercase tracking-widest block mb-1">
                        {card.category}
                      </span>
                      <h3 className="whitespace-pre-line text-xl font-extrabold font-heading leading-[1.15] text-white md:text-2xl">
                        {card.title}
                      </h3>
                      <p className="mt-1.5 max-w-[200px] text-xs text-[#8A94A0] font-mono leading-relaxed">
                        {card.text}
                      </p>
                    </div>

                    <div className="mt-3">
                      <ArrowCircle tone="white" />
                    </div>
                  </div>
                </TiltCard>
              </div>
            );
          })}
        </div>

        {/* Footer Tagline */}
        <p className="mt-8 text-right text-xs font-mono uppercase tracking-[0.2em] text-[#8A94A0] md:mt-10">
          TRAIN HARD. <span className="text-[#FF2E4C] font-bold">EXPLORE LIMITS.</span> DOMINATE.
        </p>

      </div>
    </section>
  );
}
