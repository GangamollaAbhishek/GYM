import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LineByLineSlide from "./LineByLineSlide";
import { FluidBlobs } from "./FluidBlobs";
import { GlowEffect } from "./GlowEffect";
import { useOutsideClick } from "@/hooks/use-outside-click";
import {
  Sparkles,
  Shield,
  Cpu,
  Activity,
  X,
  Zap,
  CheckCircle2,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";

export default function LineByLineShowcase() {
  const [active, setActive] = useState(null);
  const modalRef = useRef(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
      if (window.__lenis) {
        window.__lenis.stop();
      }
    } else {
      document.body.style.overflow = "auto";
      if (window.__lenis) {
        window.__lenis.start();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "auto";
      if (window.__lenis) {
        window.__lenis.start();
      }
    };
  }, [active]);

  useOutsideClick(modalRef, () => {
    if (active) setActive(null);
  });

  const items = [
    {
      id: "telemetry",
      title: "PRECISION SENSOR TELEMETRY",
      subtitle: "Velocity-Based Training & Real-Time Biomechanics",
      description:
        "Real-time velocity tracking and force curve sensors embedded across all kinetic rack stations.",
      badge: "PRECISION IOT",
      icon: <Cpu size={22} />,
      iconLarge: <Cpu size={32} />,
      iconColor: "text-[#FF2E4C]",
      badgeClass: "bg-[#FF2E4C]/20 border-[#FF2E4C]/40 text-[#FF2E4C]",
      glowColor: "rgba(255, 46, 76, 0.35)",
      btnBg: "bg-gradient-to-r from-[#FF2E4C] to-[#E50914] text-white shadow-[0_0_25px_rgba(255,46,76,0.4)]",
      lightColors: ["#ff0020", "#fc0f60", "#e8227a", "#ff85b3"],
      darkColors: ["#ff0020", "#fc0f60", "#e8227a", "#ff85b3"],
      glowColors: ["#ff0020", "#ff4d6d", "#ff758f", "#ff0020"],
      ctaText: "INITIALIZE TELEMETRY",
      stats: [
        { label: "SAMPLING FREQUENCY", value: "1,000 Hz" },
        { label: "FORCE PRECISION", value: "±0.01 N" },
        { label: "LATENCY", value: "< 2.4 ms" },
        { label: "AI ENGINE", value: "VBT Core 3.4" },
      ],
      specs: [
        "Bar Velocity & Mean Propulsive Velocity (MPV) continuous optical calculation",
        "Sub-millimeter displacement sensors measuring eccentric-to-concentric turnaround",
        "Dynamic resistance adaptation linked with magnetic variable-load dampers",
        "Auto-calibrated biometric fatigue threshold & eccentric velocity cutoff alerts",
      ],
    },
    {
      id: "speedpass",
      title: "BIOMETRIC GATE SPEEDPASS",
      subtitle: "High-Frequency RFID & Seamless Attendance Telemetry",
      description:
        "13.56 MHz high-frequency turnstile RFID key providing seamless instant access with live attendance telemetry.",
      badge: "RFID GATEWAY",
      icon: <Activity size={22} />,
      iconLarge: <Activity size={32} />,
      iconColor: "text-amber-400",
      badgeClass: "bg-amber-500/20 border-amber-500/40 text-amber-400",
      glowColor: "rgba(245, 158, 11, 0.35)",
      btnBg: "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-[0_0_25px_rgba(245,158,11,0.4)]",
      lightColors: ["#ffb800", "#ff8800", "#ffa200", "#ffd000"],
      darkColors: ["#ffb800", "#ff8800", "#ffa200", "#ffd000"],
      glowColors: ["#ffb800", "#ff5400", "#ffd000", "#ffb800"],
      ctaText: "AUTHORIZE SPEEDPASS",
      stats: [
        { label: "GATE RESPONSE", value: "12 ms" },
        { label: "ENCRYPTION", value: "AES-256 GCM" },
        { label: "PROTOCOL", value: "NFC / BLE 5.4" },
        { label: "SYNC RELIABILITY", value: "99.99%" },
      ],
      specs: [
        "Instant optical and high-frequency 13.56 MHz RFID turnstile throughput verification",
        "Encrypted Apple Wallet & Google Wallet digital credential synchronization",
        "Autonomous smart locker assignment upon perimeter entry",
        "Live heat-map telemetry reflecting real-time zone density and equipment availability",
      ],
    },
    {
      id: "cryo",
      title: "CRYO LONGEVITY SUITE",
      subtitle: "Sub-Zero Nitrogen Recovery & Cellular Regeneration",
      description:
        "Sub-zero full-body cryotherapy and hydro-sauna pods engineered to accelerate cellular ATP recovery by 300%.",
      badge: "-110°C RECOVERY",
      icon: <Shield size={22} />,
      iconLarge: <Shield size={32} />,
      iconColor: "text-emerald-400",
      badgeClass: "bg-emerald-500/20 border-emerald-500/40 text-emerald-400",
      glowColor: "rgba(16, 185, 129, 0.35)",
      btnBg: "bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-extrabold shadow-[0_0_25px_rgba(16,185,129,0.4)]",
      lightColors: ["#00F0FF", "#10b981", "#00c2ff", "#7000ff"],
      darkColors: ["#00F0FF", "#10b981", "#00c2ff", "#7000ff"],
      glowColors: ["#00F0FF", "#10b981", "#00c2ff", "#00F0FF"],
      ctaText: "RESERVE CRYO CHAMBER",
      stats: [
        { label: "CHAMBER TEMP", value: "-110° C" },
        { label: "CYCLE DURATION", value: "180 Sec" },
        { label: "ATP ACCELERATION", value: "+300%" },
        { label: "HRV UPLIFT", value: "+42 ms" },
      ],
      specs: [
        "Vaporized liquid nitrogen hyper-cooling with hyperbaric pure-oxygen infusion",
        "Near-infrared and red-light (660nm / 850nm) mitochondrial biogenesis array",
        "Contrast hydro-pod thermal regulation for immediate DOMS suppression",
        "Real-time autonomic nervous system (ANS) and thermal skin monitoring",
      ],
    },
  ];

  return (
    <section className="py-24 sm:py-32 bg-[#08090D] border-b border-white/10 relative overflow-hidden">
      {/* Subtle Background Lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_center,_rgba(229,9,20,0.16)_0%,_transparent_65%)] blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center space-y-12">
        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#12141C] border border-white/10 text-slate-300 text-xs font-mono font-semibold tracking-widest uppercase shadow-sm">
          <Sparkles size={14} className="text-[#FF2B35]" />
          <span>ARCHITECTURAL FITNESS DESIGN</span>
        </div>

        {/* 1. Large Elastic Bounce Pop-In & Shimmer Gradient Headline */}
        <div className="elastic-pop-headline font-bebas text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-wide uppercase leading-[0.92] text-center select-none">
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 40 }}
            whileInView={{ scale: 1, opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{
              type: "spring",
              stiffness: 160,
              damping: 12,
              mass: 0.9,
              delay: 0.1,
            }}
            className="elastic-pop-line"
          >
            BEAUTIFUL BY DESIGN.
          </motion.div>
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 40 }}
            whileInView={{ scale: 1, opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{
              type: "spring",
              stiffness: 160,
              damping: 12,
              mass: 0.9,
              delay: 0.28,
            }}
            className="elastic-pop-line"
          >
            POWERFUL BY NATURE.
          </motion.div>
        </div>

        {/* 2. Subtitle Lines */}
        <LineByLineSlide
          className="text-base sm:text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-normal leading-relaxed text-center"
          delay={400}
          staggerDelay={160}
          lines={[
            "Where elite biomechanical engineering meets minimalist aesthetic refinement.",
            "Designed for humans who refuse to accept physiological boundaries.",
          ]}
        />

        {/* 3. Expandable Bento Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-6 text-left">
          {items.map((item) => (
            <motion.div
              layoutId={`card-${item.id}-${id}`}
              key={item.id}
              onClick={() => setActive(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActive(item);
                }
              }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="relative w-full group cursor-pointer select-none rounded-[24px] focus:outline-none focus:ring-2 focus:ring-[#FF2E4C]"
            >
              {/* Outer Glow Border Layer */}
              <div className="absolute -inset-[1.5px] rounded-[24px] overflow-hidden z-0 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                <GlowEffect
                  colors={item.glowColors}
                  mode="rotate"
                  blur="strongest"
                  duration={6}
                  scale={1}
                />
              </div>

              {/* Inner Card Container Body */}
              <div className="relative z-10 rounded-[22px] overflow-hidden bg-[#0D0F15] border border-white/10 group-hover:border-white/20 transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col justify-between h-full min-h-[280px]">
                {/* Top Header with Fluid Blobs Backdrop */}
                <motion.div
                  layoutId={`image-${item.id}-${id}`}
                  className="relative overflow-hidden rounded-t-[22px] h-[100px]"
                >
                  <FluidBlobs
                    lightColors={item.lightColors}
                    darkColors={item.darkColors}
                    origins={[
                      { x: 30, y: -25 },
                      { x: 75, y: -15 },
                      { x: 50, y: 15 },
                      { x: 20, y: 25 },
                    ]}
                    margin={50}
                    blur={38}
                  />
                  {/* Gradient blend into card body */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0D0F15]/40 to-[#0D0F15] pointer-events-none" />

                  <div className="relative z-10 p-6 pb-0 flex justify-between items-start">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-[#181A24]/90 border border-white/15 flex items-center justify-center ${item.iconColor} shadow-lg group-hover:scale-110 transition-transform`}
                    >
                      {item.icon}
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full border text-[10px] font-mono font-bold tracking-wider uppercase ${item.badgeClass}`}
                    >
                      {item.badge}
                    </span>
                  </div>
                </motion.div>

                {/* Card Content Body */}
                <div className="relative z-10 p-6 pt-2 flex flex-col justify-between flex-1">
                  <div className="space-y-2 mt-1">
                    <motion.h3
                      layoutId={`title-${item.id}-${id}`}
                      className="font-bebas text-2xl sm:text-3xl text-white tracking-wide uppercase leading-tight"
                    >
                      {item.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${item.id}-${id}`}
                      className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans"
                    >
                      {item.description}
                    </motion.p>
                  </div>

                  {/* Interactive Micro Footer */}
                  <div className="pt-5 mt-auto flex items-center justify-between text-xs font-mono text-slate-400 group-hover:text-white transition-colors">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      CLICK TO EXPAND
                    </span>
                    <ArrowUpRight
                      size={16}
                      className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 4. Framer Motion Expandable Backdrop & Modal Overlay */}
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            data-lenis-prevent="true"
            className="fixed inset-0 bg-black/85 backdrop-blur-md h-full w-full z-[10000]"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="fixed inset-0 grid place-items-center z-[10001] p-3 sm:p-4 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setActive(null);
            }}
          >
            <motion.div
              layoutId={`card-${active.id}-${id}`}
              ref={modalRef}
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg md:max-w-xl max-h-[88vh] bg-[#0E1017] border border-white/20 rounded-[22px] shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col"
              style={{
                boxShadow: `0 0 40px ${active.glowColor}`,
              }}
            >
              {/* Close Button */}
              <motion.button
                key={`button-close-${active.id}-${id}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.1 } }}
                className="absolute top-3 right-3 z-30 flex items-center justify-center bg-[#1E2230]/90 hover:bg-white text-slate-300 hover:text-black border border-white/20 rounded-full h-8 w-8 transition-colors shadow-lg"
                onClick={() => setActive(null)}
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </motion.button>

              {/* Modal Dynamic Header */}
              <motion.div
                layoutId={`image-${active.id}-${id}`}
                className="relative overflow-hidden w-full h-24 sm:h-28 bg-[#090A0F] shrink-0"
              >
                <FluidBlobs
                  lightColors={active.lightColors}
                  darkColors={active.darkColors}
                  origins={[
                    { x: 25, y: -20 },
                    { x: 75, y: -10 },
                    { x: 50, y: 20 },
                    { x: 20, y: 40 },
                  ]}
                  margin={45}
                  blur={35}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0E1017]/60 to-[#0E1017]" />

                <div className="relative z-10 p-4 sm:p-5 h-full flex flex-col justify-end">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl bg-[#181A24]/90 border border-white/20 flex items-center justify-center ${active.iconColor} shadow-md`}
                    >
                      {active.icon}
                    </div>
                    <div>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-bold tracking-wider uppercase ${active.badgeClass}`}
                      >
                        {active.badge}
                      </span>
                      <p className="text-[10px] font-mono text-slate-400 mt-0.5 uppercase tracking-wider">
                        TITAN ARCHITECTURE • PROTOCOL SPEC
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Modal Body & Interactive Content (Scrollable if screen is very short) */}
              <div
                data-lenis-prevent="true"
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                className="p-4 sm:p-5 pt-1 space-y-4 overflow-y-auto no-scrollbar"
              >
                {/* Title & Description Header */}
                <div>
                  <motion.h3
                    layoutId={`title-${active.id}-${id}`}
                    className="font-bebas text-2xl sm:text-3xl text-white tracking-wide uppercase leading-tight"
                  >
                    {active.title}
                  </motion.h3>
                  <p className="text-[11px] sm:text-xs font-mono text-[#FF2E4C] mt-0.5 uppercase tracking-wider">
                    {active.subtitle}
                  </p>
                  <motion.p
                    layoutId={`description-${active.id}-${id}`}
                    className="text-slate-300 text-xs sm:text-sm leading-relaxed mt-1.5"
                  >
                    {active.description}
                  </motion.p>
                </div>

                {/* Telemetry Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {active.stats.map((stat, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-[#141722]/90 border border-white/10 flex flex-col justify-between"
                    >
                      <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider truncate">
                        {stat.label}
                      </span>
                      <span className="text-sm sm:text-base font-bold font-mono text-white mt-0.5">
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Feature / Spec List */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <Zap size={13} className="text-[#FF2E4C]" />
                    TECHNICAL CAPABILITIES
                  </h4>
                  <div className="grid grid-cols-1 gap-1.5">
                    {active.specs.map((spec, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 p-2 rounded-lg bg-white/[0.03] border border-white/5 text-xs text-slate-300 leading-tight"
                      >
                        <CheckCircle2
                          size={14}
                          className="text-emerald-400 shrink-0 mt-0.5"
                        />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Action Bar */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
                  <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE TELEMETRY ACTIVE
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setActive(null)}
                      className="w-full sm:w-auto px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-xl bg-[#181A24] text-slate-300 hover:text-white hover:bg-[#202330] border border-white/15 transition-colors"
                    >
                      CLOSE
                    </button>
                    <motion.button
                      layoutId={`button-${active.id}-${id}`}
                      onClick={() => setActive(null)}
                      className={`w-full sm:w-auto px-5 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 ${active.btnBg} transition-all`}
                    >
                      <span>{active.ctaText}</span>
                      <ChevronRight size={13} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

