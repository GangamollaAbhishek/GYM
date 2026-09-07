"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Headset,
  MapTrifold,
  Hammer,
  Globe,
  Rocket,
  CaretRight,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

// Isometric SVGs
function IsometricBox01({ className }) {
  return (
    <svg
      viewBox="0 0 240 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M120 20L210 72V148L120 200L30 148V72L120 20Z"
        fill="url(#box-grad-1)"
        fillOpacity="0.15"
        stroke="rgba(168, 85, 247, 0.4)"
        strokeWidth="1.5"
      />
      <path
        d="M120 20L210 72L120 124L30 72L120 20Z"
        fill="url(#box-top)"
        fillOpacity="0.25"
        stroke="rgba(168, 85, 247, 0.6)"
        strokeWidth="1.5"
      />
      <path
        d="M120 124V200"
        stroke="rgba(168, 85, 247, 0.5)"
        strokeWidth="1.5"
      />
      <circle cx="120" cy="72" r="6" fill="#A855F7" className="animate-ping opacity-75" />
      <circle cx="120" cy="72" r="4" fill="#C084FC" />
      <defs>
        <linearGradient id="box-grad-1" x1="30" y1="20" x2="210" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A855F7" />
          <stop offset="1" stopColor="#3B82F6" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="box-top" x1="30" y1="20" x2="210" y2="124" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C084FC" />
          <stop offset="1" stopColor="#9333EA" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function IsometricBoxes02({ className }) {
  return (
    <svg
      viewBox="0 0 320 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Box 1 (Bottom Left) */}
      <path
        d="M80 80L140 115V175L80 140L20 105V45L80 80Z"
        fill="#181828"
        stroke="rgba(168, 85, 247, 0.3)"
        strokeWidth="1.5"
      />
      <path
        d="M80 80L140 115L80 150L20 115L80 80Z"
        fill="#26243A"
        stroke="rgba(168, 85, 247, 0.5)"
        strokeWidth="1.5"
      />
      {/* Box 2 (Top Right) */}
      <path
        d="M220 30L290 70V140L220 100L150 60V-10L220 30Z"
        fill="#1F1A30"
        stroke="rgba(239, 68, 68, 0.3)"
        strokeWidth="1.5"
      />
      <path
        d="M220 30L290 70L220 110L150 70L220 30Z"
        fill="#312244"
        stroke="rgba(239, 68, 68, 0.6)"
        strokeWidth="1.5"
      />
      {/* Center Connecting Energy lines */}
      <path
        d="M80 80L220 70"
        stroke="url(#line-grad)"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <circle cx="150" cy="75" r="5" fill="#EF4444" className="animate-pulse" />
      <defs>
        <linearGradient id="line-grad" x1="80" y1="80" x2="220" y2="70" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A855F7" />
          <stop offset="1" stopColor="#EF4444" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const DEFAULT_TEAM_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80",
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=160&q=80",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&q=80",
];

const PIPELINE_STEPS = [
  { id: "01", label: "ASSESS", Icon: Headset },
  { id: "02", label: "PLAN", Icon: MapTrifold },
  { id: "03", label: "BUILD", Icon: Hammer },
  { id: "04", label: "TRAIN", Icon: Globe },
  { id: "05", label: "PEAK", Icon: Rocket },
];

export function WhyUsBento({
  className,
  teamAvatars = DEFAULT_TEAM_AVATARS,
}) {
  return (
    <section className={cn("py-2 sm:py-4 relative z-10 w-full", className)}>
      <div className="flex flex-col gap-3 sm:gap-4">
        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-3.5 auto-rows-auto">
          {/* 01: AI & Automation (Wide) */}
          <motion.div
            initial="initial"
            whileHover="hover"
            className="col-span-1 md:col-span-2 row-span-1 rounded-2xl bg-[#12141C] border border-white/[0.08] hover:border-purple-500/40 backdrop-blur-md p-5 sm:p-6 md:p-7 relative overflow-hidden group transition-all duration-500 flex flex-col justify-center min-h-[150px] sm:min-h-[170px] shadow-lg"
          >
            {/* Visual: Isometric Box on the right */}
            <div className="absolute right-2 sm:right-4 md:-right-2 lg:right-4 top-1/2 -translate-y-1/2 w-36 sm:w-48 md:w-60 lg:w-72 z-20 hidden sm:block pointer-events-none">
              <IsometricBox01 className="w-full h-auto" />
            </div>

            <div className="relative z-30 w-full sm:w-3/5 md:w-3/5">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1.5 sm:mb-2 relative overflow-hidden flex flex-wrap font-['Outfit',sans-serif]">
                <span className="flex">
                  {"AI & Biomechanics".split("").map((l, i) => (
                    <motion.span
                      key={i}
                      className="inline-block"
                      variants={{
                        initial: { y: 0 },
                        hover: { y: "-100%" },
                      }}
                      transition={{ duration: 0.3, delay: i * 0.02, ease: [0.33, 1, 0.68, 1] }}
                    >
                      {l === " " ? "\u00A0" : l}
                    </motion.span>
                  ))}
                </span>
                <span className="absolute inset-0 flex text-[#FF2E4C] pointer-events-none" aria-hidden>
                  {"AI & Biomechanics".split("").map((l, i) => (
                    <motion.span
                      key={i}
                      className="inline-block"
                      variants={{
                        initial: { y: "100%" },
                        hover: { y: 0 },
                      }}
                      transition={{ duration: 0.3, delay: i * 0.02, ease: [0.33, 1, 0.68, 1] }}
                    >
                      {l === " " ? "\u00A0" : l}
                    </motion.span>
                  ))}
                </span>
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed">
                We build algorithmic periodization and velocity-based telemetry to track athlete RPE,
                CNS recovery, and barbell force curves in real time.
              </p>
            </div>
            {/* Watermark Number */}
            <div className="absolute -right-3 -bottom-8 text-[6rem] sm:text-[8rem] font-bold text-white/[0.03] pointer-events-none group-hover:scale-105 transition-transform duration-700 leading-none select-none">
              01
            </div>
          </motion.div>

          {/* 02: Senior Talent (Tall & Dark) */}
          <div className="col-span-1 md:col-span-1 row-span-1 md:row-span-2 rounded-2xl border border-white/[0.08] hover:border-purple-500/40 bg-[#090A0F] p-5 sm:p-6 md:p-7 relative overflow-hidden group transition-all duration-500 flex flex-col justify-between text-white min-h-[310px] sm:min-h-[350px] shadow-xl">
            {/* Visual: Stacked Cards */}
            <div className="relative z-10 w-full flex flex-col items-center justify-center min-h-[140px] sm:min-h-[160px] mb-3 sm:mb-4 translate-x-2">
              <div className="relative w-full max-w-[170px] sm:max-w-[200px] aspect-4/3 group-hover:-translate-y-2 group-hover:scale-105 transition-all duration-300 ease-out">
                {/* Back card 4 */}
                <div className="absolute inset-0 bg-neutral-800 rounded-xl border border-neutral-700/50 transform -rotate-12 -translate-x-3 translate-y-3 shadow-xl transition-all duration-300 ease-out group-hover:rotate-[-20deg] group-hover:-translate-x-6 group-hover:translate-y-6" />
                {/* Back card 3 */}
                <div className="absolute inset-0 bg-neutral-700 rounded-xl border border-neutral-600/50 transform -rotate-9 -translate-x-2.5 translate-y-2.5 shadow-xl transition-all duration-300 ease-out group-hover:rotate-[-15deg] group-hover:-translate-x-5 group-hover:translate-y-5" />
                {/* Back card 2 */}
                <div className="absolute inset-0 bg-neutral-600 rounded-xl border border-neutral-500/50 transform -rotate-6 -translate-x-1.5 translate-y-1.5 shadow-xl transition-all duration-300 ease-out group-hover:rotate-[-10deg] group-hover:-translate-x-3 group-hover:translate-y-3" />
                {/* Back card 1 */}
                <div className="absolute inset-0 bg-neutral-500 rounded-xl border border-neutral-400/50 transform -rotate-3 -translate-x-1 translate-y-1 shadow-xl transition-all duration-300 ease-out group-hover:-rotate-5 group-hover:-translate-x-1.5 group-hover:translate-y-1.5" />

                {/* Front card */}
                <div
                  className="absolute inset-0 bg-[#161822] rounded-xl p-3.5 sm:p-4 flex flex-col justify-between text-white shadow-2xl border border-white/20"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
                    backgroundSize: "10px 10px",
                  }}
                >
                  <div className="flex gap-1">
                    <div className="w-2.5 h-3 bg-purple-500 rounded-sm" />
                    <div className="w-1.5 h-3 bg-[#FF2E4C] rounded-sm" />
                    <div className="w-2.5 h-3 bg-white/30 rounded-sm" />
                  </div>

                  <div className="font-mono text-[14px] sm:text-[16px] md:text-[18px] font-bold leading-[1.1] tracking-tight mt-auto mb-2 text-white">
                    Assess.
                    <br />
                    Periodize.
                    <br />
                    Peak Output.
                  </div>

                  <div className="font-mono text-[7px] sm:text-[8px] text-purple-300 font-bold uppercase tracking-wider flex items-center gap-1">
                    <span>&gt; READY TO EXECUTE</span>
                    <span className="animate-pulse">_</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5 font-['Outfit',sans-serif]">
                From Intake to Podium
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Take client intake data, map personalized macros, and push progressive overload protocols directly to their athlete portal.
              </p>
            </div>
            {/* Watermark Number */}
            <div className="absolute -right-6 -bottom-12 text-[9rem] sm:text-[12rem] font-bold text-white/[0.02] pointer-events-none group-hover:scale-105 transition-transform duration-700 leading-none select-none">
              02
            </div>
          </div>

          {/* 03: Built by Experienced Coaches */}
          <motion.div
            initial="initial"
            whileHover="hover"
            className="col-span-1 md:col-span-1 row-span-1 rounded-2xl border border-white/[0.08] hover:border-purple-500/40 bg-[#12141C] p-5 sm:p-6 md:p-7 relative overflow-hidden group transition-all duration-500 flex flex-col justify-between min-h-[150px] sm:min-h-[170px] shadow-lg"
          >
            {/* Stacked avatars */}
            <div className="flex items-center relative z-10 mb-3 h-8 sm:h-10">
              {teamAvatars.map((src, i) => (
                <motion.div
                  key={i}
                  className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden ring-2 ring-[#12141C] shadow-md border border-purple-500/40"
                  style={{
                    marginLeft: i === 0 ? 0 : "-10px",
                    zIndex: teamAvatars.length - i,
                  }}
                  variants={{
                    initial: { x: 0, y: 0, rotate: 0, scale: 1 },
                    hover: {
                      x: i * 12,
                      y: i % 2 === 0 ? -4 : 4,
                      rotate: (i - 2) * 5,
                      scale: 1.1,
                    },
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    bounce: 0,
                  }}
                >
                  <img
                    src={src}
                    alt="faculty member"
                    className="w-full h-full object-cover object-top"
                  />
                </motion.div>
              ))}
            </div>

            <div className="relative z-10">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5 font-['Outfit',sans-serif]">
                Elite Master Faculty
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Coaches certified across CSCS, USAW, and IFBB Pro conditioning. Continuous 1-on-1 athlete guidance without rotating benches.
              </p>
            </div>
            <div className="absolute -right-3 -bottom-8 text-[6rem] sm:text-[8rem] font-bold text-white/[0.03] pointer-events-none group-hover:scale-105 transition-transform duration-700 leading-none select-none">
              03
            </div>
          </motion.div>

          {/* 04: No Telemetry Gaps */}
          <motion.div
            initial="initial"
            whileHover="hover"
            className="col-span-1 md:col-span-1 row-span-1 rounded-2xl border border-white/[0.08] hover:border-purple-500/40 bg-[#12141C] p-5 sm:p-6 md:p-7 relative overflow-hidden group transition-all duration-500 flex flex-col justify-between min-h-[150px] sm:min-h-[170px] shadow-lg"
          >
            {/* Pipeline visual */}
            <div className="relative z-10 w-full mb-3">
              <div className="flex items-start justify-between">
                {PIPELINE_STEPS.map(({ id, label, Icon }, i) => (
                  <React.Fragment key={id}>
                    <div className="flex flex-col items-center gap-1">
                      <div className="relative">
                        <Icon size={18} weight="fill" className="text-purple-400 sm:w-5 sm:h-5" />
                        {i === PIPELINE_STEPS.length - 1 && (
                          <span className="absolute -inset-1 rounded-full bg-purple-500/20 animate-ping" />
                        )}
                      </div>
                      <span className="text-[7px] sm:text-[8px] text-slate-300 font-mono font-bold tracking-wider">
                        {label}
                      </span>
                    </div>

                    {i < PIPELINE_STEPS.length - 1 && (
                      <div className="mt-0.5 text-slate-600 group-hover:text-purple-400 transition-colors duration-300">
                        <CaretRight size={10} weight="bold" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5 font-['Outfit',sans-serif]">
                Closed-Loop Telemetry
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Biometric turnstile check-ins feed directly to your coach console, instantly alerting you when your athlete steps into the arena.
              </p>
            </div>
            <div className="absolute -right-3 -bottom-8 text-[6rem] sm:text-[8rem] font-bold text-white/[0.03] pointer-events-none group-hover:scale-105 transition-transform duration-700 leading-none select-none">
              04
            </div>
          </motion.div>

          {/* 05: Deep Hypertrophy Engineering (Wide Bottom) */}
          <motion.div
            initial="initial"
            whileHover="hover"
            className="col-span-1 md:col-span-3 row-span-1 min-h-[150px] sm:min-h-[170px] rounded-2xl bg-[#12141C] border border-white/[0.08] hover:border-purple-500/40 backdrop-blur-md p-5 sm:p-6 md:p-7 relative overflow-hidden group transition-all duration-500 flex flex-col justify-center shadow-lg"
          >
            {/* Visual: Isometric Layered Boxes on the right */}
            <div className="absolute right-2 sm:right-4 md:right-8 lg:right-16 bottom-0 w-36 sm:w-56 md:w-72 lg:w-80 z-20 hidden sm:block pointer-events-none">
              <IsometricBoxes02 className="w-full h-auto drop-shadow-md" />
            </div>

            <div className="relative z-30 w-full sm:w-3/5 md:w-3/5">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1.5 sm:mb-2 font-['Outfit',sans-serif]">
                Deep Kinetic Engineering
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed md:max-w-xl">
                Force vectors, biomechanical moment arms, macronutrient timing, and endocrine recovery. An integrated dashboard engineered for high-performance athletic transformation.
              </p>
            </div>

            {/* Watermark Number */}
            <div className="absolute -right-6 -bottom-12 text-[8rem] sm:text-[11rem] font-bold text-white/[0.02] pointer-events-none group-hover:scale-105 transition-transform duration-700 leading-none select-none z-10">
              05
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default WhyUsBento;
