import React, { useState } from 'react';
import { Clock, Cpu, Award, Sparkles, CheckCircle2, Shield, RefreshCw } from 'lucide-react';

export default function WhyChoose() {
  const [aiTarget, setAiTarget] = useState('Build Muscle');
  const [aiWeight, setAiWeight] = useState(78);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [simulating, setSimulating] = useState(false);

  const handleSimulateAI = () => {
    setSimulating(true);
    setTimeout(() => {
      setGeneratedPlan({
        dailyCalories: aiTarget === 'Build Muscle' ? 3200 : 2200,
        protein: '190g',
        carbs: aiTarget === 'Build Muscle' ? '380g' : '180g',
        fats: '65g',
        split: aiTarget === 'Build Muscle' ? 'Upper / Lower Power 4-Day Split' : 'HIIT Circuit & Low-Incline Cardio'
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
            
            <div className="max-w-md">
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
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  {['Build Muscle', 'Shred Fat'].map((g) => (
                    <button
                      key={g}
                      onClick={() => setAiTarget(g)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold uppercase ${
                        aiTarget === g ? 'bg-[#FF2E4C] text-white' : 'bg-[#090C0E] text-[#8A94A0] border border-white/10'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <label className="text-xs font-mono text-[#8A94A0]">Weight (kg): {aiWeight}</label>
                  <input 
                    type="range" 
                    min="50" 
                    max="130" 
                    value={aiWeight}
                    onChange={(e) => setAiWeight(Number(e.target.value))}
                    className="flex-1 accent-[#FF2E4C] cursor-pointer"
                  />
                </div>

                <button
                  onClick={handleSimulateAI}
                  disabled={simulating}
                  className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#FF2E4C] to-[#FF526B] hover:brightness-110 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(255,46,76,0.4)]"
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
                    <span>TARGET METRICS</span>
                    <CheckCircle2 size={14} className="text-[#FF2E4C]" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 my-2">
                    <div className="p-3 rounded-xl bg-[#12161A]">
                      <span className="text-[10px] text-[#8A94A0] block font-mono">DAILY CALORIES</span>
                      <span className="text-xl font-bold text-white">{generatedPlan.dailyCalories} kcal</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#12161A]">
                      <span className="text-[10px] text-[#8A94A0] block font-mono">PROTEIN TARGET</span>
                      <span className="text-xl font-bold text-[#FF2E4C]">{generatedPlan.protein}</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#12161A]">
                    <span className="text-[10px] text-[#8A94A0] block font-mono mb-1">RECOMMENDED SPLIT</span>
                    <span className="text-xs font-bold text-white">{generatedPlan.split}</span>
                  </div>
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-xs text-[#8A94A0] font-mono text-center">
                  Adjust controls and click Generate AI Recommendation
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
