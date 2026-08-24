import React, { useState, useEffect, useRef } from 'react';
import { Clock, Cpu, Award, Sparkles, CheckCircle2, Shield, RefreshCw } from 'lucide-react';

/**
 * ============================================================================
 * LERP SMOOTH DIAMOND SLIDER COMPONENT
 * Interactive Slider with LERP physics & dynamic velocity tilt diamond badge.
 * ============================================================================
 */
function DiamondWeightSlider({ min = 50, max = 130, value, onChange, label = "Weight (kg)" }) {
  const [current, setCurrent] = useState(value);
  const targetRef = useRef(value);
  const currentRef = useRef(value);
  const animFrameRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Sync targetRef whenever parent value prop changes
  useEffect(() => {
    targetRef.current = value;
  }, [value]);

  // Continuous LERP animation loop
  useEffect(() => {
    let active = true;

    const animate = () => {
      if (!active) return;
      const target = targetRef.current;
      const curr = currentRef.current;
      const delta = target - curr;

      if (Math.abs(delta) > 0.001) {
        const next = curr + delta * 0.2;
        currentRef.current = next;
        setCurrent(next);
      } else if (curr !== target) {
        currentRef.current = target;
        setCurrent(target);
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      active = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const d = (current - min) / (max - min);
  const normalizedD = Math.max(0, Math.min(1, d));
  const rawTilt = Math.min(6, Math.max(-6, targetRef.current - current));
  const roundedVal = Math.round(current);

  return (
    <div className="w-full flex flex-col gap-1 select-none">
      <div className="flex justify-between items-center text-xs font-mono text-[#8A94A0] mb-1">
        <span>{label}: <strong className="text-white font-bold text-base font-heading">{roundedVal} kg</strong></span>
        <span className="text-xs text-[#00F0FF] font-mono font-bold">{min} kg – {max} kg</span>
      </div>

      {/* Slider Hit Area Container */}
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="diamond-slider-container relative w-full pt-10 pb-4"
      >
        <div className="relative w-full h-3 flex items-center">
          
          {/* Background Track */}
          <div className="absolute inset-0 h-3 bg-[#090C0E] rounded-full border border-white/15 overflow-hidden shadow-inner">
            {/* Filled Crimson Progress Track */}
            <div 
              className="h-full bg-gradient-to-r from-[#FF2E4C]/50 via-[#FF2E4C] to-[#FF526B] rounded-full shadow-[0_0_14px_rgba(255,46,76,0.7)]"
              style={{ width: `${normalizedD * 100}%` }}
            />
          </div>

          {/* Floating Diamond Badge */}
          <div 
            className="absolute bottom-[16px] left-0 pointer-events-none transition-transform duration-150 ease-out z-20"
            style={{
              left: `${normalizedD * 100}%`,
              transform: `translateX(-50%) scale(${isHovered || isDragging ? 1.1 : 0.95})`,
              opacity: 1,
            }}
          >
            <div 
              className="relative w-12 h-12 flex items-center justify-center transition-transform duration-75"
              style={{
                transform: `rotate(${rawTilt * -8}deg)`,
                transformOrigin: 'bottom center'
              }}
            >
              {/* SVG Diamond Shape */}
              <svg 
                viewBox="0 0 99 84" 
                className="w-full h-full drop-shadow-[0_0_16px_rgba(255,46,76,0.9)] fill-[#FF2E4C]"
              >
                <path d="M20 0L1 20l50 63 48-63L80 0H20z" />
              </svg>
              {/* Value Text inside Diamond */}
              <span className="absolute top-[8px] text-[11px] font-black text-white font-mono tracking-tighter">
                {roundedVal}
              </span>
            </div>
          </div>

          {/* Slider Thumb Circle */}
          <div 
            className="absolute top-1/2 left-0 -translate-y-1/2 pointer-events-none z-10"
            style={{
              left: `${normalizedD * 100}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div 
              className={`w-6 h-6 rounded-full border-4 border-[#FF2E4C] bg-[#090C0E] shadow-[0_0_20px_rgba(255,46,76,1)] transition-transform ${
                isDragging ? 'scale-125 border-white bg-[#FF2E4C]' : 'scale-100'
              }`}
            />
          </div>

          {/* Invisible Full-Height Range Input Overlay */}
          <input
            type="range"
            min={min}
            max={max}
            step="1"
            value={value}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            onChange={(e) => onChange(Number(e.target.value))}
            className="absolute -top-10 left-0 w-full h-16 opacity-0 cursor-grab active:cursor-grabbing z-30"
          />

        </div>
      </div>
    </div>
  );
}

export default function WhyChoose() {
  const [aiTarget, setAiTarget] = useState('Build Muscle');
  const [aiWeight, setAiWeight] = useState(85);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [simulating, setSimulating] = useState(false);

  const handleSimulateAI = () => {
    setSimulating(true);
    setTimeout(() => {
      const isMuscle = aiTarget === 'Build Muscle';
      setGeneratedPlan({
        dailyCalories: isMuscle ? Math.round(aiWeight * 36) : Math.round(aiWeight * 25),
        protein: `${Math.round(aiWeight * 2.2)}g`,
        carbs: isMuscle ? `${Math.round(aiWeight * 4.2)}g` : `${Math.round(aiWeight * 2.0)}g`,
        fats: `${Math.round(aiWeight * 0.85)}g`,
        split: isMuscle ? 'Upper / Lower Power 4-Day Split' : 'HIIT Circuit & Low-Incline Cardio'
      });
      setSimulating(false);
    }, 600);
  };

  return (
    <section id="why-choose" className="py-24 px-4 md:px-12 bg-[#090C0E] relative">
      
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono tracking-widest text-[#00F0FF] uppercase">UNMATCHED PERFORMANCE</span>
          <h2 className="text-4xl md:text-6xl font-black font-heading text-white uppercase mt-2">
            WHY WE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E4C] to-[#00F0FF]">DOMINATE</span>
          </h2>
        </div>

        {/* Bento Grid Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          
          {/* Bento 1: Biometric Scanning */}
          <div className="bg-[#12161A] rounded-3xl p-8 border border-white/10 glass-card-hover flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center text-[#00F0FF]">
                <Cpu size={24} />
              </div>
              <span className="px-3 py-1 rounded-full bg-[#00F0FF]/20 border border-[#00F0FF]/40 text-[#00F0FF] text-[10px] font-mono font-bold">
                3D OPTICAL
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-2xl font-extrabold font-heading text-white mb-2">BIOMETRIC SCANNING</h3>
              <p className="text-xs text-[#8A94A0] leading-relaxed">
                Precision optical scanners track lean tissue gain and joint mobility angles continuously.
              </p>
            </div>
          </div>

          {/* Bento 2: 24/7 Access */}
          <div className="bg-[#12161A] rounded-3xl p-8 border border-white/10 glass-card-hover flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-[#FF2E4C]/10 border border-[#FF2E4C]/30 flex items-center justify-center text-[#FF2E4C]">
                <Clock size={24} />
              </div>
              <span className="px-3 py-1 rounded-full bg-[#FF2E4C]/20 border border-[#FF2E4C]/40 text-[#FF2E4C] text-[10px] font-mono font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E4C] animate-ping" />
                24/7 ACCESS
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-2xl font-extrabold font-heading text-white mb-2">24/7 ALL-ACCESS</h3>
              <p className="text-xs text-[#8A94A0] leading-relaxed">
                Biometric door scanners grant unlimited access 365 days a year across all club branches.
              </p>
            </div>
          </div>

          {/* Bento 3: Elite Coaches */}
          <div className="bg-[#12161A] rounded-3xl p-8 border border-white/10 glass-card-hover flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center text-[#00F0FF]">
                <Award size={24} />
              </div>
              <span className="px-3 py-1 rounded-full bg-[#00F0FF]/20 border border-[#00F0FF]/40 text-[#00F0FF] text-[10px] font-mono font-bold">
                IFBB & CSCS
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-2xl font-extrabold font-heading text-white mb-2">ELITE COACHES</h3>
              <p className="text-xs text-[#8A94A0] leading-relaxed">
                Master trainers with verified physical competition credentials and biomechanics certification.
              </p>
            </div>
          </div>

          {/* Bento 4: Cryo Recovery */}
          <div className="bg-[#12161A] rounded-3xl p-8 border border-white/10 glass-card-hover flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-[#FF2E4C]/10 border border-[#FF2E4C]/30 flex items-center justify-center text-[#FF2E4C]">
                <Shield size={24} />
              </div>
              <span className="px-3 py-1 rounded-full bg-[#FF2E4C]/20 border border-[#FF2E4C]/40 text-[#FF2E4C] text-[10px] font-mono font-bold">
                -110°C CRYO
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-2xl font-extrabold font-heading text-white mb-2">CRYO RECOVERY</h3>
              <p className="text-xs text-[#8A94A0] leading-relaxed">
                Sub-zero hyperbaric decompression chambers for rapid muscular inflammation reduction.
              </p>
            </div>
          </div>

        </div>

        {/* Interactive AI Nutrition Simulator */}
        <div className="bg-[#12161A] rounded-3xl p-8 border border-white/10 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            
            <div className="w-full md:max-w-md">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#00F0FF] mb-2">
                <Sparkles size={16} /> AI NUTRITION & WORKOUT ENGINE
              </div>
              <h3 className="text-3xl font-extrabold font-heading text-white mb-3">
                SIMULATE YOUR <span className="text-[#FF2E4C]">TITAN PLAN</span>
              </h3>
              <p className="text-xs text-[#8A94A0] mb-6">
                Input your target goal and body weight to preview instant AI-calculated macronutrient targets.
              </p>

              {/* Input Controls */}
              <div className="flex flex-col gap-5">
                <div className="flex gap-2">
                  {['Build Muscle', 'Shred Fat'].map((g) => (
                    <button
                      key={g}
                      onClick={() => setAiTarget(g)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                        aiTarget === g ? 'bg-[#FF2E4C] text-white shadow-[0_0_15px_rgba(255,46,76,0.4)]' : 'bg-[#090C0E] text-[#8A94A0] border border-white/10 hover:text-white'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>

                {/* LERP Smooth Diamond Weight Slider */}
                <DiamondWeightSlider
                  min={50}
                  max={130}
                  value={aiWeight}
                  onChange={setAiWeight}
                  label="Weight (kg)"
                />

                <button
                  onClick={handleSimulateAI}
                  disabled={simulating}
                  className="py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#FF2E4C] to-[#FF526B] hover:brightness-110 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(255,46,76,0.4)] active:scale-[0.98]"
                >
                  {simulating ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  Generate AI Recommendation
                </button>
              </div>
            </div>

            {/* Simulation Result Box */}
            <div className="w-full md:w-1/2 p-6 rounded-2xl bg-[#090C0E] border border-white/10 backdrop-blur-md">
              {generatedPlan ? (
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center text-xs font-mono text-[#00F0FF] border-b border-white/10 pb-2">
                    <span>TARGET METRICS FOR {aiWeight} KG</span>
                    <CheckCircle2 size={14} className="text-[#FF2E4C]" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 my-2">
                    <div className="p-3.5 rounded-xl bg-[#12161A] border border-white/5">
                      <span className="text-[10px] text-[#8A94A0] block font-mono">DAILY CALORIES</span>
                      <span className="text-xl font-extrabold text-white font-heading">{generatedPlan.dailyCalories} kcal</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#12161A] border border-white/5">
                      <span className="text-[10px] text-[#8A94A0] block font-mono">PROTEIN TARGET</span>
                      <span className="text-xl font-extrabold text-[#FF2E4C] font-heading">{generatedPlan.protein}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <div className="p-3.5 rounded-xl bg-[#12161A] border border-white/5">
                      <span className="text-[10px] text-[#8A94A0] block font-mono">CARBS TARGET</span>
                      <span className="text-lg font-bold text-[#00F0FF] font-heading">{generatedPlan.carbs}</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#12161A] border border-white/5">
                      <span className="text-[10px] text-[#8A94A0] block font-mono">FATS TARGET</span>
                      <span className="text-lg font-bold text-[#FFB800] font-heading">{generatedPlan.fats}</span>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#12161A] border border-white/5">
                    <span className="text-[10px] text-[#8A94A0] block font-mono mb-1">RECOMMENDED SPLIT</span>
                    <span className="text-xs font-extrabold text-white">{generatedPlan.split}</span>
                  </div>
                </div>
              ) : (
                <div className="h-56 flex flex-col items-center justify-center text-xs text-[#8A94A0] font-mono text-center gap-2">
                  <Sparkles size={24} className="text-[#FF2E4C] animate-pulse" />
                  <span>Adjust controls and click Generate AI Recommendation</span>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
