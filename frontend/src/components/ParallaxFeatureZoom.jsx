import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Flame, Zap, Activity, Award } from "lucide-react";

export default function ParallaxFeatureZoom() {
  const containerRef = useRef(null);

  // Track scroll progress within this 240vh section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth spring physics for silky 120fps motion
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 20,
    restDelta: 0.001,
  });

  // 1. Background Zoom: starts at 2.4x scale and zooms out smoothly to 1.0x
  const bgScale = useTransform(smoothProgress, [0, 0.75, 1], [2.4, 1.05, 1.0]);

  // 2. Optical Blur: starts crystal clear, increases slightly as user reads the text
  const bgBlur = useTransform(
    smoothProgress,
    [0, 0.35, 0.85],
    ["blur(0px)", "blur(3px)", "blur(8px)"]
  );

  // 3. Dynamic Darkening & Color Tint Overlay
  const overlayOpacity = useTransform(smoothProgress, [0, 0.5, 0.9], [0.35, 0.65, 0.85]);
  const glowOpacity = useTransform(smoothProgress, [0, 0.5, 1], [0.4, 0.85, 0.5]);

  // 4. Content Parallax: floats up gracefully and fades in with crisp hierarchy
  const contentY = useTransform(smoothProgress, [0.1, 0.6, 1], [140, 0, -80]);
  const contentOpacity = useTransform(smoothProgress, [0.08, 0.25, 0.8, 0.98], [0, 1, 1, 0.2]);
  const statsScale = useTransform(smoothProgress, [0.2, 0.55], [0.9, 1]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[240vh] bg-[#07080B] text-white"
    >
      {/* STICKY FULLSCREEN VIEWPORT */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* A. DYNAMIC PARALLAX ZOOM FEATURE BACKGROUND */}
        <motion.div
          style={{
            scale: bgScale,
            filter: bgBlur,
          }}
          className="absolute inset-0 w-full h-full bg-cover bg-center will-change-transform transform-gpu"
        >
          {/* High-Impact Cinematic Athlete / Power Arena Visual */}
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop')`,
            }}
          />
        </motion.div>

        {/* B. GRADIENT VIGNETTES & GLOWS */}
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-[#07080B] pointer-events-none transition-opacity duration-150"
        />

        {/* Edge Shadows & Top/Bottom Blends for Seamless Section Transitions */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_120px_rgba(7,8,11,0.95)]" />
        <div className="absolute top-0 left-0 right-0 h-36 bg-gradient-to-b from-[#07080B] to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-[#07080B] to-transparent pointer-events-none" />

        {/* Pulsing Crimson Accent Lighting */}
        <motion.div
          style={{ opacity: glowOpacity }}
          className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_rgba(229,9,20,0.22)_0%,_transparent_70%)] blur-[100px]"
        />

        {/* C. FLOATING CONTENT & EDITORIAL REVEAL */}
        <motion.div
          style={{
            y: contentY,
            opacity: contentOpacity,
          }}
          className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center pointer-events-auto"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#12141C]/90 border border-[#E50914]/40 text-white text-xs font-mono font-bold tracking-widest uppercase mb-6 shadow-[0_0_25px_rgba(229,9,20,0.4)] backdrop-blur-md">
            <Flame size={14} className="text-[#FF2E4C] animate-pulse" />
            <span>HYPER-KINETIC POWER MATRIX</span>
          </div>

          {/* Main Giant Headline */}
          <h2 className="font-bebas text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white tracking-wider leading-[0.9] uppercase drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)] mb-6">
            WHERE RAW POWER <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E4C] via-white to-[#FF1E27]">
              MEETS PRECISION
            </span>
          </h2>

          {/* Subtitle Description */}
          <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-normal leading-relaxed mb-10 drop-shadow-md">
            Engineered from ground-up biomechanical telemetry. Every barbell knurl, velocity sensor, and air-damped plate is synchronized to shatter human performance barriers.
          </p>

          {/* 3 Interactive Floating Glass Telemetry Cards */}
          <motion.div
            style={{ scale: statsScale }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl text-left"
          >
            {/* Stat Card 1 */}
            <div className="p-5 rounded-2xl bg-[#0F121A]/80 border border-white/15 backdrop-blur-xl hover:border-[#E50914]/60 transition-all group shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Peak Velocity</span>
                <Zap size={16} className="text-[#FF2E4C] group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-2xl sm:text-3xl font-bebas text-white tracking-wider">
                0.04<span className="text-sm font-sans text-[#FF2E4C] font-bold">s</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans mt-1">Real-time force capture response speed</p>
            </div>

            {/* Stat Card 2 */}
            <div className="p-5 rounded-2xl bg-[#0F121A]/80 border border-white/15 backdrop-blur-xl hover:border-[#E50914]/60 transition-all group shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Biometric Sync</span>
                <Activity size={16} className="text-[#00F2FE] group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-2xl sm:text-3xl font-bebas text-white tracking-wider">
                99.8<span className="text-sm font-sans text-[#00F2FE] font-bold">%</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans mt-1">Continuous heart-rate & lactate tracking</p>
            </div>

            {/* Stat Card 3 */}
            <div className="p-5 rounded-2xl bg-[#0F121A]/80 border border-white/15 backdrop-blur-xl hover:border-[#E50914]/60 transition-all group shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Recorded PRs</span>
                <Award size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-2xl sm:text-3xl font-bebas text-white tracking-wider">
                14,200<span className="text-sm font-sans text-amber-400 font-bold">+</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans mt-1">Athlete personal records logged this season</p>
            </div>
          </motion.div>

        </motion.div>

        {/* Subtle Scroll Indicator at bottom */}
        <motion.div
          style={{ opacity: useTransform(smoothProgress, [0, 0.25], [1, 0]) }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none text-slate-400"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-slate-400">Scroll to Explore Depth</span>
          <div className="w-5 h-8 rounded-full border-2 border-white/20 flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full bg-[#FF2E4C]"
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
