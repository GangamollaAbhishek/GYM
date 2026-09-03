import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Shield, ChevronRight } from "lucide-react";

const col1Images = [
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80",
];

const col2Images = [
  "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=800&q=80",
];

const col3Images = [
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
];

const col4Images = [
  "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&q=80",
];

export default function ParallaxGallery({ onClaimTrial }) {
  const containerRef = useRef(null);

  // Framer Motion Differential Velocity Parallax Transforms
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -280]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, -320]);

  return (
    <section
      ref={containerRef}
      className="py-24 px-4 md:px-12 bg-[#090C0E] overflow-hidden relative border-t border-white/10"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-[#FF2E4C]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title & Subtitle */}
        <div className="text-center mb-16">
          <span className="text-xs font-mono tracking-widest text-[#00F0FF] uppercase block mb-2">
            DIFFERENTIAL VELOCITY PARALLAX
          </span>
          <h2 className="text-4xl md:text-6xl font-black font-heading text-white uppercase tracking-tight">
            PHYSICAL{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E4C] via-[#FF526B] to-[#00F0FF]">
              DOMINANCE
            </span>
          </h2>
        </div>

        {/* 4 Multi-Column Parallax Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 min-h-[600px]">
          {/* Column 1 */}
          <motion.div style={{ y: y1 }} className="flex flex-col gap-6">
            {col1Images.map((src, i) => (
              <div
                key={i}
                className="relative h-80 rounded-3xl overflow-hidden bg-[#12161A] border border-white/10 group shadow-2xl"
              >
                <img
                  src={src}
                  alt="Parallax 1"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-lg font-bold font-heading text-white tracking-wide">
                  PURE FORCE
                </div>
              </div>
            ))}
          </motion.div>

          {/* Column 2 */}
          <motion.div style={{ y: y2 }} className="flex flex-col gap-6 -mt-12">
            {col2Images.map((src, i) => (
              <div
                key={i}
                className="relative h-[360px] rounded-3xl overflow-hidden bg-[#12161A] border border-[#FF2E4C]/30 group shadow-2xl"
              >
                <img
                  src={src}
                  alt="Parallax 2"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-lg font-bold font-heading text-[#FF2E4C] tracking-wide">
                  TITAN WILL
                </div>
              </div>
            ))}
          </motion.div>

          {/* Column 3 */}
          <motion.div style={{ y: y3 }} className="flex flex-col gap-6">
            {col3Images.map((src, i) => (
              <div
                key={i}
                className="relative h-80 rounded-3xl overflow-hidden bg-[#12161A] border border-white/10 group shadow-2xl"
              >
                <img
                  src={src}
                  alt="Parallax 3"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-lg font-bold font-heading text-[#00F0FF] tracking-wide">
                  NEVER RETREAT
                </div>
              </div>
            ))}
          </motion.div>

          {/* Column 4 */}
          <motion.div style={{ y: y4 }} className="flex flex-col gap-6 -mt-16">
            {col4Images.map((src, i) => (
              <div
                key={i}
                className="relative h-[380px] rounded-3xl overflow-hidden bg-[#12161A] border border-[#FF2E4C]/30 group shadow-2xl"
              >
                <img
                  src={src}
                  alt="Parallax 4"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-lg font-bold font-heading text-[#FF2E4C] tracking-wide">
                  RAW KINETICS
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Section Callout Card */}
        <div className="bg-[#12161A]/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-[#FF2E4C]/50 shadow-[0_0_50px_rgba(255,46,76,0.3)] flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
            <span className="text-xs font-mono text-[#00F0FF] uppercase tracking-widest block mb-2">
              LIMITED PASS AVAILABILITY
            </span>
            <h3 className="text-3xl md:text-4xl font-extrabold font-heading text-white">
              Claim your 7-day free trial right away
            </h3>
            <p className="text-xs text-[#8A94A0] mt-2 max-w-lg font-mono">
              Get full access to all signature workout zones, 3D equipment
              setups, and biometric scanner doors.
            </p>
          </div>

          <button
            onClick={onClaimTrial}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-[#FF2E4C] to-[#FF526B] hover:brightness-110 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_25px_rgba(255,46,76,0.5)] transition-all shrink-0"
          >
            <Shield size={16} /> Get Started <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
