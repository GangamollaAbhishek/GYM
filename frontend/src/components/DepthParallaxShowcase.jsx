import React from "react";
import DepthParallaxWords from "./smoothui/components/depth-parallax-words";
import { Sparkles, Shield, Zap } from "lucide-react";

export default function DepthParallaxShowcase() {
  return (
    <section className="relative py-20 md:py-28 bg-[#07090C] text-white overflow-hidden border-t border-b border-white/[0.06] select-none">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#FF1E27]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] [background-size:32px_32px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-8">
        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF1E27]/10 border border-[#FF1E27]/30 text-[#FF1E27] text-xs font-mono font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(255,30,39,0.2)]">
          <Sparkles
            size={14}
            className="animate-spin"
            style={{ animationDuration: "6s" }}
          />
          <span>3D Depth Parallax Engine</span>
        </div>

        {/* Primary Parallax Headline */}
        <div className="space-y-4 cursor-default">
          <DepthParallaxWords
            as="h2"
            depth={40}
            perspective={1200}
            className="text-4xl sm:text-6xl md:text-7xl font-black font-['Outfit',sans-serif] tracking-tighter uppercase text-white leading-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
          >
            FORGED IN IRON. POWERED BY PRECISION.
          </DepthParallaxWords>

          <DepthParallaxWords
            as="p"
            delay={300}
            depth={20}
            perspective={800}
            className="text-base sm:text-xl md:text-2xl text-slate-400 font-medium max-w-3xl mx-auto leading-relaxed"
          >
            Move your cursor across this matrix to feel per-word spatial depth
            and kinetic telemetry in real time.
          </DepthParallaxWords>
        </div>

        {/* Feature Pills */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-300">
          <div className="px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md flex items-center gap-2">
            <Zap size={14} className="text-[#FF1E27]" />
            <span>Multi-Plane 3D Perspective</span>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md flex items-center gap-2">
            <Shield size={14} className="text-cyan-400" />
            <span>GPU-Accelerated Spatial Physics</span>
          </div>
        </div>
      </div>
    </section>
  );
}
