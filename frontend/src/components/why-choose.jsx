import React, { useState, useEffect, useRef } from 'react';
import { Clock, Cpu, Award, Sparkles, CheckCircle2, Shield, RefreshCw, Zap, ChevronDown, Flame } from 'lucide-react';
import './WhyChooseStackCards.css';

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

  useEffect(() => {
    targetRef.current = value;
  }, [value]);

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

      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="diamond-slider-container relative w-full pt-10 pb-4"
      >
        <div className="relative w-full h-3 flex items-center">
          <div className="absolute inset-0 h-3 bg-[#090C0E] rounded-full border border-white/15 overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-[#FF2E4C]/50 via-[#FF2E4C] to-[#FF526B] rounded-full shadow-[0_0_14px_rgba(255,46,76,0.7)]"
              style={{ width: `${normalizedD * 100}%` }}
            />
          </div>

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
              <svg 
                viewBox="0 0 99 84" 
                className="w-full h-full drop-shadow-[0_0_16px_rgba(255,46,76,0.9)] fill-[#FF2E4C]"
              >
                <path d="M20 0L1 20l50 63 48-63L80 0H20z" />
              </svg>
              <span className="absolute top-[8px] text-[11px] font-black text-white font-mono tracking-tighter">
                {roundedVal}
              </span>
            </div>
          </div>

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

/**
 * ============================================================================
 * STACK CARD DATA
 * ============================================================================
 */
const DOMINATE_CARDS = [
  {
    id: 1,
    counter: "01 / 04",
    tag: "3D OPTICAL",
    tagColor: "accent-cyan",
    badgeBg: "bg-[#00F0FF]/20 border-[#00F0FF]/40 text-[#00F0FF]",
    icon: Cpu,
    iconColor: "text-[#00F0FF] bg-[#00F0FF]/10 border-[#00F0FF]/30",
    title: "BIOMETRIC SCANNING",
    desc: "Precision optical scanners track lean tissue gain, skeletal balance, and joint mobility angles continuously with sub-millimeter precision.",
    specs: ["128 Scan Nodes", "0.2mm Precision", "Dynamic Heatmap", "Cloud Sync"]
  },
  {
    id: 2,
    counter: "02 / 04",
    tag: "24/7 ACCESS",
    tagColor: "accent-red",
    badgeBg: "bg-[#FF2E4C]/20 border-[#FF2E4C]/40 text-[#FF2E4C]",
    icon: Clock,
    iconColor: "text-[#FF2E4C] bg-[#FF2E4C]/10 border-[#FF2E4C]/30",
    title: "24/7 ALL-ACCESS",
    desc: "Biometric door scanners grant unlimited access 365 days a year across all club branches with touchless rapid credentials and high-security turnstiles.",
    specs: ["Touchless RFID", "Multi-Club Pass", "Zero Downtime", "Always Open"]
  },
  {
    id: 3,
    counter: "03 / 04",
    tag: "IFBB & CSCS",
    tagColor: "accent-cyan",
    badgeBg: "bg-[#00F0FF]/20 border-[#00F0FF]/40 text-[#00F0FF]",
    icon: Award,
    iconColor: "text-[#00F0FF] bg-[#00F0FF]/10 border-[#00F0FF]/30",
    title: "ELITE COACHES",
    desc: "Master trainers with verified physical competition credentials, CSCS certifications, and real-time velocity-based barbell tracking telemetry.",
    specs: ["1-on-1 Periodization", "VBT Barbell Tech", "Form Correction", "Weekly Audit"]
  },
  {
    id: 4,
    counter: "04 / 04",
    tag: "-110°C CRYO",
    tagColor: "accent-red",
    badgeBg: "bg-[#FF2E4C]/20 border-[#FF2E4C]/40 text-[#FF2E4C]",
    icon: Shield,
    iconColor: "text-[#FF2E4C] bg-[#FF2E4C]/10 border-[#FF2E4C]/30",
    title: "CRYO RECOVERY",
    desc: "Sub-zero hyperbaric decompression chambers for rapid muscular inflammation reduction, cellular recovery, and central nervous system rebooting.",
    specs: ["-110°C Hyperbaric", "Nitrogen Vapor", "3-Min Protocol", "Lymphatic Flush"]
  }
];

export default function WhyChoose() {
  const containerRef = useRef(null);
  const [slidCards, setSlidCards] = useState([]);
  const [activeStep, setActiveStep] = useState(0);

  // AI Nutrition State
  const [aiTarget, setAiTarget] = useState('Build Muscle');
  const [aiWeight, setAiWeight] = useState(85);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [simulating, setSimulating] = useState(false);

  // Scroll Stacking Algorithm
  useEffect(() => {
    let lastScrollTop = window.scrollY;

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollPosition = window.scrollY;
      const scrollDown = scrollPosition > lastScrollTop;
      lastScrollTop = scrollPosition <= 0 ? 0 : scrollPosition;

      // Calculate progress through this section (0 to 1)
      const totalDist = containerRect.height - windowHeight;
      const currentDist = -containerRect.top;
      const progress = Math.max(0, Math.min(1, currentDist / (totalDist * 0.85)));

      const numCards = DOMINATE_CARDS.length;
      const newSlid = [];

      // Determine which cards should be slid up based on progress
      for (let i = 0; i < numCards - 1; i++) {
        const threshold = (i + 1) / numCards;
        if (progress > threshold * 0.75) {
          newSlid.push(i);
        }
      }

      setSlidCards(newSlid);
      setActiveStep(Math.min(numCards - 1, newSlid.length));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
    <div id="why-choose" className="relative w-full bg-[#07080B]">
      
      {/* 1. SCROLL STACKING CARDS SECTION */}
      <div ref={containerRef} className="stack-cards-section">
        
        {/* Animated Light Rays Background Scene */}
        <div className="s__rays">
          <div className="a-rays">
            <svg className="a__scene" width="350" height="1200" viewBox="0 0 350 1200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 0L300 1200M150 0L350 1200M-50 0L200 1200M0 0L250 1200" stroke="url(#raysGradient)" strokeWidth="1.5" />
              <defs>
                <linearGradient id="raysGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FF2E4C" stopOpacity="0" />
                  <stop offset="50%" stopColor="#FF2E4C" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#00F0FF" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Ambient Radial Vignettes */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[radial-gradient(ellipse_at_center,_rgba(255,46,76,0.18)_0%,_transparent_70%)] blur-[100px] pointer-events-none" />

        {/* Sticky Viewport */}
        <div className="stack-viewport">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-10 z-10">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#12161A] border border-white/10 text-xs font-mono tracking-widest text-[#00F0FF] uppercase mb-2">
              <Sparkles size={13} className="text-[#FF2E4C]" />
              <span>UNMATCHED PERFORMANCE</span>
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black font-heading text-white uppercase leading-none tracking-wide">
              WHY WE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E4C] via-white to-[#00F0FF]">DOMINATE</span>
            </h2>
          </div>

          {/* Stacking Deck Container */}
          <div className="stack-cards-deck">
            {DOMINATE_CARDS.map((card, idx) => {
              const IconComp = card.icon;
              const isSlid = slidCards.includes(idx);
              const stackIndex = idx;
              const offsetTop = (DOMINATE_CARDS.length - 1 - stackIndex) * 10;
              const scaleVal = 1 - (DOMINATE_CARDS.length - 1 - stackIndex) * 0.035;

              return (
                <div
                  key={card.id}
                  className={`stack-card-item ${card.tagColor} ${isSlid ? 'slide-up' : ''}`}
                  style={{
                    zIndex: DOMINATE_CARDS.length - idx,
                    transform: isSlid 
                      ? 'translate(-50%, -240%) scale(0.92) rotate(-5deg)' 
                      : `translate(-50%, calc(-50% + ${offsetTop}px)) scale(${scaleVal})`,
                  }}
                >
                  <div className="card-shadow" />
                  
                  <div className="card-inner">
                    {/* Top Row: Icon + Badge */}
                    <div className="flex justify-between items-start">
                      <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shadow-md ${card.iconColor}`}>
                        <IconComp size={24} />
                      </div>
                      <span className={`px-3 py-1 rounded-full border text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-sm ${card.badgeBg}`}>
                        {idx === 1 && <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E4C] animate-ping" />}
                        {card.tag}
                      </span>
                    </div>

                    {/* Middle Row: Title & Description */}
                    <div className="my-3">
                      <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-wide mb-2 uppercase">
                        {card.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans line-clamp-3">
                        {card.desc}
                      </p>
                    </div>

                    {/* Bottom Row: Specs Pills & Counter */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <div className="flex flex-wrap gap-1.5 max-w-[80%]">
                        {card.specs.map((spec, sIdx) => (
                          <span 
                            key={sIdx}
                            className="px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/10 text-slate-300 text-[10px] font-mono font-medium"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>

                      <div className="counter-badge text-[#00F0FF]">
                        {card.counter}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Deck Navigation Indicator */}
          <div className="flex items-center gap-2 mt-8 z-10">
            {DOMINATE_CARDS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeStep === i 
                    ? 'w-8 bg-[#FF2E4C] shadow-[0_0_10px_rgba(255,46,76,0.8)]' 
                    : 'w-2 bg-white/20'
                }`}
              />
            ))}
          </div>

          {/* Scroll Down Prompt */}
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono uppercase tracking-widest mt-4 z-10">
            <span>Scroll Deck</span>
            <ChevronDown size={14} className="animate-bounce text-[#FF2E4C]" />
          </div>

        </div>

      </div>

      {/* 2. INTERACTIVE AI NUTRITION & WORKOUT SIMULATOR */}
      <div className="py-20 px-4 md:px-12 bg-[#090C0E] border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#12161A] rounded-3xl p-8 border border-white/10 relative overflow-hidden shadow-2xl">
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              
              <div className="w-full md:max-w-md">
                <div className="inline-flex items-center gap-2 text-xs font-mono text-[#00F0FF] mb-2">
                  <Sparkles size={16} /> AI NUTRITION & WORKOUT ENGINE
                </div>
                <h3 className="text-3xl font-extrabold font-heading text-white mb-3 uppercase">
                  SIMULATE YOUR <span className="text-[#FF2E4C]">TITAN PLAN</span>
                </h3>
                <p className="text-xs text-[#8A94A0] mb-6 leading-relaxed">
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
                          aiTarget === g 
                            ? 'bg-[#FF2E4C] text-white shadow-[0_0_15px_rgba(255,46,76,0.4)]' 
                            : 'bg-[#090C0E] text-[#8A94A0] border border-white/10 hover:text-white'
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
                    className="py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#FF2E4C] to-[#FF526B] hover:brightness-110 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(255,46,76,0.4)] active:scale-[0.98] cursor-pointer"
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
      </div>

    </div>
  );
}
