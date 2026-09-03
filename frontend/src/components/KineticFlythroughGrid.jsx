import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Zap, Sparkles, ChevronDown } from "lucide-react";
import "./KineticFlythroughGrid.css";

// 50 Fitness & Biomechanical Science Terms mapped across 4x4 3D grid
const GRID_DATA = [
  { id: 1, text: "VO2 MAX", range: [0.35, 0.55], grid: "1 / 1", highlight: "highlight-cyan" },
  { id: 2, text: "ATP RECOVERY", range: [0.15, 0.32], grid: "1 / 2" },
  { id: 3, text: "FORCE CURVE", range: [0.48, 0.65], grid: "1 / 3", highlight: "highlight-red" },
  { id: 4, text: "MYOFIBRILLAR", range: [0.45, 0.62], grid: "1 / 4" },
  { id: 5, text: "BARBELL VBT", range: [0.40, 0.58], grid: "2 / 1" },
  { id: 6, text: "NEURAL DRIVE", range: [0.08, 0.24], grid: "2 / 2", highlight: "highlight-cyan" },
  { id: 7, text: "HYPERBARIC CRYO", range: [0.82, 0.98], grid: "2 / 3", highlight: "highlight-red" },
  { id: 8, text: "NITROGEN MATRIX", range: [0.25, 0.42], grid: "2 / 4" },
  { id: 9, text: "CREAPURE®", range: [0.72, 0.90], grid: "3 / 1" },
  { id: 10, text: "128-NODE TELEMETRY", range: [0.65, 0.82], grid: "3 / 2", highlight: "highlight-cyan" },
  // Center Item (Item 11) is the Special Anchor
  { id: 11, isSpecial: true, text: "PULSE FIT", sub: "BIOMECHANICAL SUPREMACY", range: [0.0, 0.95] },
  { id: 12, text: "ECCENTRIC OVERLOAD", range: [0.48, 0.65], grid: "3 / 4", highlight: "highlight-red" },
  { id: 13, text: "PEAK VELOCITY", range: [0.12, 0.28], grid: "4 / 1" },
  { id: 14, text: "SARCOPLASMIC", range: [0.05, 0.20], grid: "4 / 2" },
  { id: 15, text: "SUB-ZERO FLUSH", range: [0.70, 0.88], grid: "4 / 3", highlight: "highlight-cyan" },
  { id: 16, text: "KINETIC CALIBRATION", range: [0.02, 0.16], grid: "4 / 4", highlight: "highlight-red" },
  { id: 17, text: "LACTATE FLUSH", range: [0.80, 0.97], grid: "2 / 1" },
  { id: 18, text: "ELECTROMAGNETIC RESISTANCE", range: [0.38, 0.54], grid: "2 / 2" },
  { id: 19, text: "MOTOR UNIT RECRUITMENT", range: [0.52, 0.70], grid: "2 / 3", highlight: "highlight-cyan" },
  { id: 20, text: "ISOMETRIC PEAK", range: [0.32, 0.50], grid: "2 / 4" },
  { id: 21, text: "MICRO-FILTERED WHEY", range: [0.10, 0.25], grid: "3 / 1" },
  { id: 22, text: "BCAA 2:1:1 MATRIX", range: [0.06, 0.21], grid: "3 / 2", highlight: "highlight-red" },
  { id: 23, text: "HYPERTROPHY PROTOCOL", range: [0.78, 0.95], grid: "3 / 3" },
  { id: 24, text: "POST-ACTIVATION POTENTIATION", range: [0.28, 0.45], grid: "3 / 4", highlight: "highlight-cyan" },
  { id: 25, text: "ANABOLIC THRESHOLD", range: [0.42, 0.60], grid: "1 / 1" },
  { id: 26, text: "0.2MM OPTICAL PRECISION", range: [0.10, 0.26], grid: "1 / 2", highlight: "highlight-red" },
  { id: 27, text: "AEROBIC CAPACITY", range: [0.72, 0.90], grid: "1 / 3" },
  { id: 28, text: "FORCE PRODUCTION", range: [0.58, 0.74], grid: "1 / 4", highlight: "highlight-cyan" },
  { id: 29, text: "TOUCHLESS RFID ACCESS", range: [0.26, 0.43], grid: "4 / 1" },
  { id: 30, text: "PERIODIZED SPLITS", range: [0.06, 0.20], grid: "4 / 2" },
  { id: 31, text: "OXYGEN DYNAMICS", range: [0.03, 0.17], grid: "4 / 3", highlight: "highlight-red" },
  { id: 32, text: "KINETIC SYNERGY", range: [0.68, 0.86], grid: "4 / 4" },
  { id: 33, text: "NEURAL READINESS", range: [0.56, 0.73], grid: "2 / 1", highlight: "highlight-cyan" },
  { id: 34, text: "TORQUE GENERATION", range: [0.22, 0.38], grid: "2 / 2" },
  { id: 35, text: "INTRA-WORKOUT HYDRATION", range: [0.58, 0.75], grid: "2 / 3" },
  { id: 36, text: "RAPID ABSORPTION", range: [0.09, 0.23], grid: "2 / 4", highlight: "highlight-red" },
  { id: 37, text: "BIO-CORRECTION ENGINE", range: [0.82, 0.99], grid: "3 / 1", highlight: "highlight-cyan" },
  { id: 38, text: "METABOLIC CONDITIONING", range: [0.28, 0.45], grid: "3 / 2" },
  { id: 39, text: "350MG CAFFEINE ANHYDROUS", range: [0.80, 0.98], grid: "3 / 3" },
  { id: 40, text: "6000MG L-CITRULLINE", range: [0.18, 0.34], grid: "3 / 4", highlight: "highlight-red" },
  { id: 41, text: "BETA-ALANINE CHARGE", range: [0.14, 0.28], grid: "1 / 1" },
  { id: 42, text: "1-ON-1 COACHING AUDIT", range: [0.22, 0.38], grid: "1 / 2", highlight: "highlight-cyan" },
  { id: 43, text: "DYNAMIC RANGE OF MOTION", range: [0.60, 0.78], grid: "1 / 3" },
  { id: 44, text: "CELLULAR ATP SATURATION", range: [0.02, 0.15], grid: "1 / 4", highlight: "highlight-red" },
  { id: 45, text: "ZERO ADDED SUGAR", range: [0.39, 0.56], grid: "4 / 1" },
  { id: 46, text: "OLYMPIC STRENGTH FACULTY", range: [0.09, 0.23], grid: "4 / 2", highlight: "highlight-cyan" },
  { id: 47, text: "HYPER-PULSE ARENA", range: [0.19, 0.35], grid: "4 / 3" },
  { id: 48, text: "HIGH-DENSITY FUEL", range: [0.34, 0.51], grid: "4 / 4", highlight: "highlight-red" },
  { id: 49, text: "CNS REBOOT PROTOCOL", range: [0.54, 0.71], grid: "3 / 1", highlight: "highlight-cyan" },
  { id: 50, text: "PULSE FIT REIGN", range: [0.04, 0.18], grid: "3 / 2" }
];

function GridItemMotion({ item, smoothProgress }) {
  const [start, end] = item.range;
  const mid = (start + end) / 2;

  // 3D Z-Flythrough calculation
  const z = useTransform(smoothProgress, [start, mid, end], [-900, 0, 900]);
  const opacity = useTransform(smoothProgress, [start, mid, end], [0, 1, 0]);
  const blur = useTransform(
    smoothProgress, 
    [start, mid - 0.04, mid, mid + 0.04, end], 
    ["blur(6px)", "blur(0px)", "blur(0px)", "blur(0px)", "blur(6px)"]
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

function SpecialCenterMotion({ item, smoothProgress }) {
  // Center Special Anchor: stays prominent in center with pulsing 3D depth
  const scale = useTransform(smoothProgress, [0, 0.5, 1], [0.85, 1.15, 0.9]);
  const z = useTransform(smoothProgress, [0, 0.5, 1], [-200, 100, -200]);
  const opacity = useTransform(smoothProgress, [0, 0.15, 0.85, 1], [0.4, 1, 1, 0.4]);

  return (
    <motion.div
      style={{
        scale,
        z,
        opacity,
      }}
      className="grid-item special"
    >
      <b>{item.text}</b>
      <span>{item.sub}</span>
    </motion.div>
  );
}

export default function KineticFlythroughGrid() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 75,
    damping: 22,
    restDelta: 0.001,
  });

  return (
    <section ref={containerRef} className="flythrough-container">
      {/* 3D PERSPECTIVE STUCK GRID VIEWPORT */}
      <div className="stuck-grid">
        <div className="flythrough-glow" />

        {GRID_DATA.map((item) => {
          if (item.isSpecial) {
            return (
              <SpecialCenterMotion
                key={item.id}
                item={item}
                smoothProgress={smoothProgress}
              />
            );
          }
          return (
            <GridItemMotion
              key={item.id}
              item={item}
              smoothProgress={smoothProgress}
            />
          );
        })}

        {/* Scroll Indicator Prompt */}
        <motion.div
          style={{
            opacity: useTransform(smoothProgress, [0, 0.18], [1, 0]),
          }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-slate-400 font-mono text-[10px] uppercase tracking-widest pointer-events-none z-50"
        >
          <span>Scroll To Fly Through 3D Grid</span>
          <ChevronDown size={14} className="text-[#FF2E4C] animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}
