import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Zap, Sparkles, ChevronDown, Activity, Flame } from "lucide-react";
import { useLandingPageCMS } from "../context/LandingPageCMSContext";
import "./KineticFlythroughGrid.css";

// 48 Fitness & Biomechanical Science Terms mapped around the 3D perimeter tracks (never overlapping center)
const PERIMETER_GRID_DATA = [
  // ROW 1 (TOP EDGE)
  { id: 1, text: "VO2 MAX", range: [0.35, 0.55], grid: "1 / 1", highlight: "highlight-cyan" },
  { id: 2, text: "ATP RECOVERY", range: [0.15, 0.32], grid: "1 / 2" },
  { id: 3, text: "FORCE CURVE", range: [0.48, 0.65], grid: "1 / 3", highlight: "highlight-red" },
  { id: 4, text: "MYOFIBRILLAR", range: [0.45, 0.62], grid: "1 / 4" },
  { id: 25, text: "ANABOLIC THRESHOLD", range: [0.42, 0.6], grid: "1 / 1" },
  { id: 26, text: "0.2MM OPTICAL SENSORS", range: [0.1, 0.26], grid: "1 / 2", highlight: "highlight-red" },
  { id: 27, text: "AEROBIC CAPACITY", range: [0.72, 0.9], grid: "1 / 3" },
  { id: 28, text: "FORCE PRODUCTION", range: [0.58, 0.74], grid: "1 / 4", highlight: "highlight-cyan" },
  { id: 41, text: "BETA-ALANINE CHARGE", range: [0.14, 0.28], grid: "1 / 1" },
  { id: 42, text: "1-ON-1 COACHING AUDIT", range: [0.22, 0.38], grid: "1 / 2", highlight: "highlight-cyan" },
  { id: 43, text: "DYNAMIC RANGE OF MOTION", range: [0.6, 0.78], grid: "1 / 3" },
  { id: 44, text: "CELLULAR ATP SATURATION", range: [0.02, 0.15], grid: "1 / 4", highlight: "highlight-red" },

  // ROW 2 (LEFT & RIGHT EDGES)
  { id: 5, text: "BARBELL VBT", range: [0.4, 0.58], grid: "2 / 1" },
  { id: 8, text: "NITROGEN MATRIX", range: [0.25, 0.42], grid: "2 / 4" },
  { id: 17, text: "LACTATE FLUSH", range: [0.8, 0.97], grid: "2 / 1" },
  { id: 20, text: "ISOMETRIC PEAK", range: [0.32, 0.5], grid: "2 / 4" },
  { id: 33, text: "NEURAL READINESS", range: [0.56, 0.73], grid: "2 / 1", highlight: "highlight-cyan" },
  { id: 36, text: "RAPID ABSORPTION", range: [0.09, 0.23], grid: "2 / 4", highlight: "highlight-red" },

  // ROW 3 (LEFT & RIGHT EDGES)
  { id: 9, text: "CREAPURE® WHEY", range: [0.72, 0.9], grid: "3 / 1" },
  { id: 12, text: "ECCENTRIC OVERLOAD", range: [0.48, 0.65], grid: "3 / 4", highlight: "highlight-red" },
  { id: 21, text: "MICRO-FILTERED AMINOS", range: [0.1, 0.25], grid: "3 / 1" },
  { id: 24, text: "POST-ACTIVATION POTENTIATION", range: [0.28, 0.45], grid: "3 / 4", highlight: "highlight-cyan" },
  { id: 37, text: "BIO-CORRECTION ENGINE", range: [0.82, 0.99], grid: "3 / 1", highlight: "highlight-cyan" },
  { id: 40, text: "6000MG L-CITRULLINE", range: [0.18, 0.34], grid: "3 / 4", highlight: "highlight-red" },
  { id: 49, text: "CNS REBOOT PROTOCOL", range: [0.54, 0.71], grid: "3 / 1", highlight: "highlight-cyan" },

  // ROW 4 (BOTTOM EDGE)
  { id: 13, text: "PEAK VELOCITY", range: [0.12, 0.28], grid: "4 / 1" },
  { id: 14, text: "SARCOPLASMIC PUMP", range: [0.05, 0.2], grid: "4 / 2" },
  { id: 15, text: "SUB-ZERO FLUSH", range: [0.7, 0.88], grid: "4 / 3", highlight: "highlight-cyan" },
  { id: 16, text: "KINETIC CALIBRATION", range: [0.02, 0.16], grid: "4 / 4", highlight: "highlight-red" },
  { id: 29, text: "TOUCHLESS RFID ACCESS", range: [0.26, 0.43], grid: "4 / 1" },
  { id: 30, text: "PERIODIZED SPLITS", range: [0.06, 0.2], grid: "4 / 2" },
  { id: 31, text: "OXYGEN DYNAMICS", range: [0.03, 0.17], grid: "4 / 3", highlight: "highlight-red" },
  { id: 32, text: "KINETIC SYNERGY", range: [0.68, 0.86], grid: "4 / 4" },
  { id: 45, text: "ZERO SUGAR ELECTROLYTES", range: [0.39, 0.56], grid: "4 / 1" },
  { id: 46, text: "OLYMPIC STRENGTH FACULTY", range: [0.09, 0.23], grid: "4 / 2", highlight: "highlight-cyan" },
  { id: 47, text: "HYPER-PULSE ARENA", range: [0.19, 0.35], grid: "4 / 3" },
  { id: 48, text: "HIGH-DENSITY FUEL", range: [0.34, 0.51], grid: "4 / 4", highlight: "highlight-red" },
];

function PerimeterGridItem({ item, smoothProgress }) {
  const [start, end] = item.range;
  const mid = (start + end) / 2;

  // 3D Z-Flythrough calculation
  const z = useTransform(smoothProgress, [start, mid, end], [-950, 0, 950]);
  const opacity = useTransform(
    smoothProgress,
    [start, start + 0.05, mid, end - 0.05, end],
    [0, 0.9, 1, 0.9, 0]
  );
  const blur = useTransform(
    smoothProgress,
    [start, mid - 0.04, mid, mid + 0.04, end],
    ["blur(8px)", "blur(0px)", "blur(0px)", "blur(0px)", "blur(8px)"]
  );

  return (
    <motion.div
      style={{
        gridArea: item.grid,
        z,
        opacity,
        filter: blur,
      }}
      className={`grid-item ${item.highlight || ""}`}
    >
      {item.text}
    </motion.div>
  );
}

export default function KineticFlythroughGrid() {
  const containerRef = useRef(null);
  const { cmsData } = useLandingPageCMS();
  const brandName = cmsData?.brand?.name || "TITAN PULSE";
  const brandSubname = cmsData?.brand?.subname || "BIOMECHANICAL SUPREMACY";

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 24,
    restDelta: 0.001,
  });

  // Center Hero Title Transformations
  const titleScale = useTransform(smoothProgress, [0, 0.5, 1], [0.92, 1.08, 0.94]);
  const titleZ = useTransform(smoothProgress, [0, 0.5, 1], [-80, 40, -80]);
  const titleOpacity = useTransform(
    smoothProgress,
    [0, 0.1, 0.88, 1],
    [0.75, 1, 1, 0.6]
  );
  const glowOpacity = useTransform(smoothProgress, [0, 0.5, 1], [0.4, 0.85, 0.4]);

  return (
    <section ref={containerRef} className="flythrough-container">
      {/* 3D PERSPECTIVE STUCK GRID VIEWPORT */}
      <div className="stuck-grid">
        {/* Dynamic Background Ambient Glow */}
        <motion.div
          style={{ opacity: glowOpacity }}
          className="flythrough-glow"
        />

        {/* Outer Perimeter 3D Flythrough Items */}
        {PERIMETER_GRID_DATA.map((item) => (
          <PerimeterGridItem
            key={item.id}
            item={item}
            smoothProgress={smoothProgress}
          />
        ))}

        {/* =========================================================
            ELEGANT, SMOOTH, & NEAT CENTER BRAND HERO ANCHOR
            ========================================================= */}
        <motion.div
          style={{
            scale: titleScale,
            z: titleZ,
            opacity: titleOpacity,
          }}
          className="center-brand-anchor"
        >
          {/* Subtle Tagline Pill */}
          <div className="center-brand-pill">
            <span className="w-2 h-2 rounded-full bg-[#FF2E4C] animate-ping inline-block" />
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#FF2E4C] font-extrabold">
              01 // KINETIC ENGINE
            </span>
          </div>

          {/* Main Clean Brand Title */}
          <h2 className="center-brand-title">
            <span className="title-part-titan">TITAN</span>
            <span className="title-separator">•</span>
            <span className="title-part-pulse">PULSE</span>
          </h2>

          {/* Clean Secondary Subtitle */}
          <div className="center-brand-sub">
            <span className="sub-line" />
            <span className="sub-text">{brandSubname}</span>
            <span className="sub-line" />
          </div>

          {/* Metric Badges */}
          <div className="center-brand-metrics">
            <div className="metric-chip">
              <Activity size={12} className="text-[#00F0FF]" />
              <span>128-NODE TELEMETRY</span>
            </div>
            <div className="metric-chip">
              <Flame size={12} className="text-[#FF2E4C]" />
              <span>HYPER-PULSE ARENA</span>
            </div>
          </div>
        </motion.div>

        {/* Scroll Indicator Prompt */}
        <motion.div
          style={{
            opacity: useTransform(smoothProgress, [0, 0.18], [1, 0]),
          }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-slate-400 font-mono text-[10px] uppercase tracking-widest pointer-events-none z-50 bg-[#0C0E14]/80 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md shadow-lg"
        >
          <span>Scroll To Explore Kinetic 3D Matrix</span>
          <ChevronDown size={14} className="text-[#FF2E4C] animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}
