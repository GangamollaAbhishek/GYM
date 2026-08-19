import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Cpu, Play, ChevronDown, Sparkles, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function LetsDrive() {
  const [activeStep, setActiveStep] = useState(0);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const containerRef = useRef(null);

  const steps = [
    {
      step: 'Step 01 of 4',
      title: 'Biometric Scan & Assessment',
      subtitle: '3D Body Composition Profiling',
      desc: 'High-precision 3D optical body scanning analyzes muscle volume distribution, body fat percentage, and postural alignment in 60 seconds.'
    },
    {
      step: 'Step 02 of 4',
      title: 'AI-Customized Training Split',
      subtitle: 'Algorithmic Periodization',
      desc: 'Neural engine computes your optimal weekly volume, exercise selection, and recovery ratios based on your muscle fiber composition.'
    },
    {
      step: 'Step 03 of 4',
      title: 'Smart Equipment Resistance Setup',
      subtitle: 'Electromagnetic Load Tuning',
      desc: 'Smart machines auto-adjust seat height and electromagnetic resistance in real time based on velocity drop-off and force production.'
    },
    {
      step: 'Step 04 of 4',
      title: '24/7 Elite Trainer Support',
      subtitle: 'Continuous Velocity Profiling',
      desc: 'Certified coaches monitor form metrics live on overhead telemetry displays to refine movement mechanics during peak lifts.'
    }
  ];

  return (
    <section ref={containerRef} id="equipment" className="py-24 px-4 md:px-12 bg-[#090C0E] relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-mono tracking-widest text-[#00F0FF] uppercase block mb-2">
              HOW IT WORKS
            </span>
            <h2 className="text-4xl md:text-6xl font-black font-heading text-white uppercase tracking-tight">
              3D SMART <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E4C] to-[#00F0FF]">EQUIPMENT ENGINE</span>
            </h2>
          </div>

          <button className="px-6 py-3 rounded-full border border-white/10 text-white font-extrabold text-xs font-mono uppercase tracking-wider hover:border-[#FF2E4C] hover:text-[#FF2E4C] transition-colors self-start md:self-auto">
            View All Gear →
          </button>
        </div>

        {/* 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Featured Equipment Card with Step Pill Badge & Glowing Play Button */}
          <div className="lg:col-span-6 bg-[#12161A] rounded-3xl p-6 md:p-8 border border-white/10 relative overflow-hidden flex flex-col justify-between group">
            
            {/* Top Step Pill Badge */}
            <div className="flex justify-between items-center z-10">
              <span className="px-4 py-1.5 rounded-full bg-[#FF2E4C]/20 border border-[#FF2E4C]/50 text-[#FF2E4C] text-xs font-mono font-bold">
                {steps[activeStep].step}
              </span>
              <span className="text-xs font-mono text-[#00F0FF] flex items-center gap-1.5">
                <Cpu size={14} /> ACTIVE TELEMETRY
              </span>
            </div>

            {/* Video Thumbnail Box with Pulsing Glowing Play Button */}
            <div className="relative my-8 h-72 rounded-2xl overflow-hidden border border-white/10">
              <img 
                src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80" 
                alt="Equipment Video" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12161A] via-transparent to-black/40" />

              {/* Pulsing Glowing Video Play Button */}
              <button 
                onClick={() => setVideoModalOpen(true)}
                className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-[#FF2E4C] text-white flex items-center justify-center shadow-[0_0_30px_#FF2E4C] hover:scale-110 transition-transform group/play cursor-pointer"
              >
                <Play size={26} className="ml-1 fill-white" />
                <span className="absolute inset-0 rounded-full bg-[#FF2E4C] animate-ping opacity-60" />
              </button>
            </div>

            {/* Step Details */}
            <div className="z-10">
              <h3 className="text-2xl font-bold font-heading text-white">{steps[activeStep].title}</h3>
              <p className="text-xs font-mono text-[#00F0FF] mt-1 mb-3">{steps[activeStep].subtitle}</p>
              <p className="text-xs text-[#8A94A0] leading-relaxed">{steps[activeStep].desc}</p>
            </div>

          </div>

          {/* Right Column: Interactive 4-Step Accordion */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-4">
            {steps.map((item, index) => (
              <div 
                key={index}
                onClick={() => setActiveStep(index)}
                className={`p-6 rounded-3xl cursor-pointer transition-all duration-300 border ${
                  activeStep === index
                    ? 'bg-[#12161A] border-[#FF2E4C] shadow-[0_0_25px_rgba(255,46,76,0.3)]'
                    : 'bg-[#12161A]/50 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#090C0E] border border-white/10 flex items-center justify-center font-mono text-xs font-bold text-[#FF2E4C]">
                      0{index + 1}
                    </span>
                    <h4 className="text-lg font-bold font-heading text-white">{item.title}</h4>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-[#8A94A0] transition-transform duration-300 ${activeStep === index ? 'rotate-180 text-[#FF2E4C]' : ''}`} />
                </div>

                {activeStep === index && (
                  <div className="mt-4 pt-4 border-t border-white/10 text-xs text-[#8A94A0] font-mono leading-relaxed">
                    {item.desc}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Video Overlay Modal */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-[100] bg-[#090C0E]/90 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-[#12161A] rounded-3xl border border-white/20 p-4 shadow-2xl">
            <button 
              onClick={() => setVideoModalOpen(false)}
              className="absolute -top-12 right-0 text-[#8A94A0] hover:text-white p-2"
            >
              <X size={32} />
            </button>
            <div className="aspect-video w-full overflow-hidden rounded-2xl">
              <video 
                src="https://www.w3schools.com/html/mov_bbb.mp4" 
                controls 
                autoPlay 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold font-heading text-white mt-4">{steps[activeStep].title} - Video Overlay Demo</h3>
          </div>
        </div>
      )}

    </section>
  );
}
