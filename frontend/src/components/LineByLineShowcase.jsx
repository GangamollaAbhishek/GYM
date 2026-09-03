import React from "react";
import { motion } from "framer-motion";
import LineByLineSlide from "./LineByLineSlide";
import BlobCard from "./BlobCard";
import { Sparkles, Shield, Cpu, Activity, ArrowUpRight } from "lucide-react";

export default function LineByLineShowcase() {
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
            "Designed for humans who refuse to accept physiological boundaries."
          ]}
        />

        {/* 3. Three BlobCards with Fluid Lava Blobs & Rotating Glow Borders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-6 text-left">
          
          {/* Card 1: Precision Sensor Telemetry */}
          <BlobCard
            headerHeight={100}
            lightColors={["#ff0020", "#fc0f60", "#e8227a", "#ff85b3"]}
            darkColors={["#ff0020", "#fc0f60", "#e8227a", "#ff85b3"]}
            glowColors={["#ff0020", "#ff4d6d", "#ff758f", "#ff0020"]}
            header={
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-2xl bg-[#181A24]/90 border border-white/15 flex items-center justify-center text-[#FF2E4C] shadow-lg group-hover:scale-110 transition-transform">
                  <Cpu size={22} />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#FF2E4C]/20 border border-[#FF2E4C]/40 text-[#FF2E4C] text-[10px] font-mono font-bold">
                  PRECISION IOT
                </span>
              </div>
            }
          >
            <div className="space-y-2 mt-1">
              <h3 className="font-bebas text-2xl sm:text-3xl text-white tracking-wide uppercase">
                PRECISION SENSOR TELEMETRY
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                Real-time velocity tracking and force curve sensors embedded across all kinetic rack stations.
              </p>
            </div>
          </BlobCard>

          {/* Card 2: Biometric Gate Speedpass */}
          <BlobCard
            headerHeight={100}
            lightColors={["#ffb800", "#ff8800", "#ffa200", "#ffd000"]}
            darkColors={["#ffb800", "#ff8800", "#ffa200", "#ffd000"]}
            glowColors={["#ffb800", "#ff5400", "#ffd000", "#ffb800"]}
            header={
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-2xl bg-[#181A24]/90 border border-white/15 flex items-center justify-center text-amber-400 shadow-lg group-hover:scale-110 transition-transform">
                  <Activity size={22} />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-[10px] font-mono font-bold">
                  RFID GATEWAY
                </span>
              </div>
            }
          >
            <div className="space-y-2 mt-1">
              <h3 className="font-bebas text-2xl sm:text-3xl text-white tracking-wide uppercase">
                BIOMETRIC GATE SPEEDPASS
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                13.56 MHz high-frequency turnstile RFID key providing seamless instant access with live attendance telemetry.
              </p>
            </div>
          </BlobCard>

          {/* Card 3: Cryo Longevity Suite */}
          <BlobCard
            headerHeight={100}
            lightColors={["#00F0FF", "#10b981", "#00c2ff", "#7000ff"]}
            darkColors={["#00F0FF", "#10b981", "#00c2ff", "#7000ff"]}
            glowColors={["#00F0FF", "#10b981", "#00c2ff", "#00F0FF"]}
            header={
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-2xl bg-[#181A24]/90 border border-white/15 flex items-center justify-center text-emerald-400 shadow-lg group-hover:scale-110 transition-transform">
                  <Shield size={22} />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold">
                  -110°C RECOVERY
                </span>
              </div>
            }
          >
            <div className="space-y-2 mt-1">
              <h3 className="font-bebas text-2xl sm:text-3xl text-white tracking-wide uppercase">
                CRYO LONGEVITY SUITE
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                Sub-zero full-body cryotherapy and hydro-sauna pods engineered to accelerate cellular ATP recovery by 300%.
              </p>
            </div>
          </BlobCard>

        </div>

      </div>
    </section>
  );
}

